import { authenticate } from "../middlewares/authMiddleware";
import { playerController } from "../controllers/playerController";

export async function playerRoutes(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const subroute = url.pathname.replace("/v1/player", "");
  const method = req.method;

  try {
    // Add player to team
    if (subroute === "" && method === "POST") {
      const { userId } = await authenticate(req);
      return await playerController.addPlayerToTeam(req, userId);
    }

    // Update player details
    const updateMatch = url.pathname.match(/^\/v1\/player\/(.+)$/);
    if (updateMatch && method === "PUT") {
      const { userId } = await authenticate(req);
      const playerId = String(updateMatch[1]);
      return await playerController.updatePlayer(req, userId, playerId);
    }

    return new Response("Not Found", { status: 404 });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ status: false, error: err.message }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
} 