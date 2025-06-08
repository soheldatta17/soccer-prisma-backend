/**
 * Team Management Routes
 * Part of Soccer Team Management API
 * 
 * @author Sohel Datta <soheldatta17@gmail.com>
 * @copyright Copyright (c) 2024 Sohel Datta
 * @license MIT
 * @repository https://github.com/soheldatta17/soccer-prisma-backend
 */

import { Request, Response } from 'express';
import { authenticate } from "../middlewares/authMiddleware";
import { teamController } from "../controllers/teamController";

export async function teamRoutes(req: Request, res: Response): Promise<void> {
  const subroute = req.path.replace("/v1/team", "");
  const method = req.method;

  try {
    // Authenticated routes
    if (subroute === "/me/player" && method === "GET") {
      const { userId } = await authenticate(req);
      await teamController.getMyTeamsAsPlayer(req, userId);
      return;
    }

    if (subroute === "/me/owner" && method === "GET") {
      const { userId } = await authenticate(req);
      await teamController.getMyOwnedTeams(req, userId);
      return;
    }

    if (subroute === "" && method === "POST") {
      const { userId } = await authenticate(req);
      await teamController.createTeam(req, userId);
      return;
    }

    if (subroute === "" && method === "GET") {
      await teamController.getAllTeams(req);
      return;
    }

    // Get Team Players route
    const playerMatch = req.path.match(/^\/v1\/team\/(.+)\/players$/);
    if (playerMatch && method === "GET") {
      const teamId = String(playerMatch[1]);
      await teamController.getTeamPlayers(req, teamId);
      return;
    }

    // Update team details
    if (subroute === "" && method === "PUT") {
      const { userId } = await authenticate(req);
      await teamController.updateTeam(req, userId);
      return;
    }

    // Delete team
    if (subroute === "" && method === "DELETE") {
      const { userId } = await authenticate(req);
      await teamController.deleteTeam(req, userId);
      return;
    }

    res.status(404).json({ status: false, error: "Not Found" });
  } catch (err: any) {
    res.status(401).json({ status: false, error: err.message });
  }
} 