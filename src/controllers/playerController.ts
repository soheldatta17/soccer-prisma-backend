import { PrismaClient } from "@prisma/client";
import { sendJSON } from "../utils/response";
import { generateId } from "../utils/id";

const prisma = new PrismaClient();

export const playerController = {
  async addPlayerToTeam(req: Request, userId: string) {
    try {
      const body = await req.json() as {
        teamId: string;
        roleId: string;
        position: string;
        jerseyNumber?: number;
      };

      // Check if user is already in the team
      const existingPlayer = await prisma.player.findFirst({
        where: {
          teamId: body.teamId,
          userId: userId,
        },
      });

      if (existingPlayer) {
        throw new Error("Player already exists in this team");
      }

      // Create new player
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
      const body = await req.json() as {
        position?: string;
        jerseyNumber?: number;
        roleId?: string;
      };

      // Check if player exists and belongs to the user
      const existingPlayer = await prisma.player.findFirst({
        where: {
          id: playerId,
          userId: userId,
        },
      });

      if (!existingPlayer) {
        throw new Error("Player not found or you don't have permission to update");
      }

      // Update player
      const player = await prisma.player.update({
        where: {
          id: playerId,
        },
        data: {
          position: body.position,
          jerseyNumber: body.jerseyNumber,
          roleId: body.roleId,
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
}; 