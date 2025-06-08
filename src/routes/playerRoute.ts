/**
 * Player Management Routes
 * Part of Soccer Team Management API
 * 
 * @author Sohel Datta <soheldatta17@gmail.com>
 * @copyright Copyright (c) 2024 Sohel Datta
 * @license MIT
 * @repository https://github.com/soheldatta17/soccer-prisma-backend
 */

import { Request, Response } from 'express';
import { authenticate } from "../middlewares/authMiddleware";
import { playerController } from "../controllers/playerController";

export async function playerRoutes(req: Request, res: Response): Promise<void> {
  const subroute = req.path.replace("/v1/player", "");
  const method = req.method;

  try {
    // Add player to team
    if (subroute === "" && method === "POST") {
      const { userId } = await authenticate(req);
      await playerController.addPlayerToTeam(req, userId);
      return;
    }

    // Update player details
    const updateMatch = req.path.match(/^\/v1\/player\/(.+)$/);
    if (updateMatch && method === "PUT") {
      const { userId } = await authenticate(req);
      const playerId = String(updateMatch[1]);
      await playerController.updatePlayer(req, userId, playerId);
      return;
    }

    res.status(404).json({ status: false, error: "Not Found" });
  } catch (err: any) {
    res.status(401).json({ status: false, error: err.message });
  }
} 