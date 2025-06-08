/**
 * Player Management Controller
 * Part of Soccer Team Management API
 * 
 * Handles player-related operations like adding players to teams and updating player details.
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

export const playerController = {
  async addPlayerToTeam(req: Request, userId: string) {
    try {
      const body = req.body as {
        teamId: string;
        roleId: string;
        position: string;
        jerseyNumber?: number;
      };

      // Check if player already exists in team
      const existingPlayer = await prisma.player.findFirst({
        where: {
          teamId: body.teamId,
          userId: userId,
        },
      });

      if (existingPlayer) {
        return sendJSON(400, false, "Player already exists in team");
      }

      // Create player
      const player = await prisma.player.create({
        data: {
          id: generateId(),
          teamId: body.teamId,
          userId: userId,
          roleId: body.roleId,
          position: body.position,
          jerseyNumber: body.jerseyNumber,
        },
        include: {
          team: true,
          role: true,
        },
      });

      return sendJSON(200, true, { data: player });
    } catch (err: any) {
      return sendJSON(400, false, err.message);
    }
  },

  async updatePlayer(req: Request, userId: string, playerId: string) {
    try {
      const body = req.body as {
        roleId?: string;
        position?: string;
        jerseyNumber?: number;
      };

      // Check if player exists and belongs to user
      const player = await prisma.player.findFirst({
        where: {
          id: playerId,
          userId: userId,
        },
      });

      if (!player) {
        return sendJSON(404, false, "Player not found or not authorized");
      }

      // Update player
      const updatedPlayer = await prisma.player.update({
        where: {
          id: playerId,
        },
        data: {
          roleId: body.roleId,
          position: body.position,
          jerseyNumber: body.jerseyNumber,
        },
        include: {
          team: true,
          role: true,
        },
      });

      return sendJSON(200, true, { data: updatedPlayer });
    } catch (err: any) {
      return sendJSON(400, false, err.message);
    }
  },
}; 