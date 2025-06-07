import { verifyJWT } from "../validators/jwt";

const rawSecret = process.env.JWT_SECRET;

if (!rawSecret) {
  throw new Error("JWT_SECRET is not defined in environment.");
}

const SECRET: string = rawSecret;

export async function authenticate(req: Request): Promise<{ userId: string }> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("Invalid token format");
  }
  
  try {
    const decoded = verifyJWT(token);
    
    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
      return { userId: decoded.id as string };
    }
    
    throw new Error("Invalid token payload");
  } catch (err) {
    throw new Error("Invalid token");
  }
}
