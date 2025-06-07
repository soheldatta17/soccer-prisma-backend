/**
 * Team Management Routes
 * Part of Soccer Team Management API
 * 
 * @author Sohel Datta <soheldatta17@gmail.com>
 * @copyright Copyright (c) 2024 Sohel Datta
 * @license MIT
 * @repository https://github.com/soheldatta17/soccer-prisma-backend
 */

import { authenticate } from "../middlewares/authMiddleware";
import { teamController } from "../controllers/teamController";

export async function teamRoutes(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const subroute = url.pathname.replace("/v1/team", "");
  const method = req.method;

  try {
    // Authenticated routes
    if (subroute === "/me/player" && method === "GET") {
      const { userId } = await authenticate(req);
      return await teamController.getMyTeamsAsPlayer(req, userId);
    }

    if (subroute === "/me/owner" && method === "GET") {
      const { userId } = await authenticate(req);
      return await teamController.getMyOwnedTeams(req, userId);
    }

    if (subroute === "" && method === "POST") {
      const { userId } = await authenticate(req);
      return await teamController.createTeam(req, userId);
    }

    if (subroute === "" && method === "GET") {
      return await teamController.getAllTeams(req);
    }

    // Get Team Players route
    const playerMatch = url.pathname.match(/^\/v1\/team\/(.+)\/players$/);
    if (playerMatch && method === "GET") {
      const teamId = String(playerMatch[1]);
      return await teamController.getTeamPlayers(req, teamId);
    }

    return new Response("Not Found", { status: 404 });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ status: false, error: err.message }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
} 