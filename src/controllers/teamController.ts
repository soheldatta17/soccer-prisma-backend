/**
 * Team Management Controller
 * Part of Soccer Team Management API
 * 
 * Handles team creation, updates, and team-related operations.
 * 
 * @author Sohel Datta <soheldatta17@gmail.com>
 * @copyright Copyright (c) 2024 Sohel Datta
 * @license MIT
 * @repository https://github.com/soheldatta17/soccer-prisma-backend
 */

import { Request } from 'express';
import { PrismaClient } from "@prisma/client";
import { sendJSON } from "../utils/response.js";
import { generateId } from "../utils/id.js";

const prisma = new PrismaClient();

export const teamController = {
  async createTeam(req: Request, userId: string) {
    try {
      const body = req.body as { 
        name: string;
        location: string;
        league: string;
        founded?: number;
      };

      const team = await prisma.team.create({
        data: {
          id: generateId(),
          name: body.name,
          location: body.location,
          league: body.league,
          founded: body.founded,
          ownerId: userId,
        },
      });

      return sendJSON(200, true, { data: team });
    } catch (err: any) {
      return sendJSON(400, false, err.message);
    }
  },

  async getAllTeams(req: Request) {
    try {
      const teams = await prisma.team.findMany({
        include: {
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return sendJSON(200, true, { data: teams });
    } catch (err: any) {
      return sendJSON(400, false, err.message);
    }
  },

  async getMyOwnedTeams(req: Request, userId: string) {
    try {
      const teams = await prisma.team.findMany({
        where: {
          ownerId: userId,
        },
      });

      return sendJSON(200, true, { data: teams });
    } catch (err: any) {
      return sendJSON(400, false, err.message);
    }
  },

  async getMyTeamsAsPlayer(req: Request, userId: string) {
    try {
      const teams = await prisma.player.findMany({
        where: {
          userId: userId,
        },
        include: {
          team: true,
          role: true,
        },
      });

      return sendJSON(200, true, { data: teams });
    } catch (err: any) {
      return sendJSON(400, false, err.message);
    }
  },

  async getTeamPlayers(req: Request, teamId: string) {
    try {
      const players = await prisma.player.findMany({
        where: {
          teamId: teamId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          role: true,
        },
      });

      return sendJSON(200, true, { data: players });
    } catch (err: any) {
      return sendJSON(400, false, err.message);
    }
  },

  async updateTeam(req: Request, userId: string) {
    try {
      const body = req.body as { 
        teamId: string;
        name?: string;
        location?: string;
        league?: string;
        founded?: number;
      };

      // Check if user owns the team
      const team = await prisma.team.findUnique({
        where: { id: body.teamId },
      });

      if (!team) {
        return sendJSON(404, false, "Team not found");
      }

      if (team.ownerId !== userId) {
        return sendJSON(403, false, "Not authorized to update this team");
      }

      const updatedTeam = await prisma.team.update({
        where: { id: body.teamId },
        data: {
          name: body.name,
          location: body.location,
          league: body.league,
          founded: body.founded,
        },
      });

      return sendJSON(200, true, { data: updatedTeam });
    } catch (err: any) {
      return sendJSON(400, false, err.message);
    }
  },

  async deleteTeam(req: Request, userId: string) {
    try {
      const body = req.body as { teamId: string };

      // Check if user owns the team
      const team = await prisma.team.findUnique({
        where: { id: body.teamId },
      });

      if (!team) {
        return sendJSON(404, false, "Team not found");
      }

      if (team.ownerId !== userId) {
        return sendJSON(403, false, "Not authorized to delete this team");
      }

      // Delete all players first due to foreign key constraints
      await prisma.player.deleteMany({
        where: { teamId: body.teamId },
      });

      // Then delete the team
      await prisma.team.delete({
        where: { id: body.teamId },
      });

      return sendJSON(200, true, { message: "Team deleted successfully" });
    } catch (err: any) {
      return sendJSON(400, false, err.message);
    }
  },
}; 