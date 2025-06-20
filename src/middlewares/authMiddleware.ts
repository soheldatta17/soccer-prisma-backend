/**
 * Authentication Middleware
 * Part of Soccer Team Management API
 * 
 * Provides authentication and authorization middleware functions.
 * 
 * @author Sohel Datta <soheldatta17@gmail.com>
 * @copyright Copyright (c) 2024 Sohel Datta
 * @license MIT
 * @repository https://github.com/soheldatta17/soccer-prisma-backend
 */

import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from "../validators/jwt.js";

const rawSecret = process.env.JWT_SECRET;

if (!rawSecret) {
  throw new Error("JWT_SECRET is not defined in environment.");
}

const SECRET: string = rawSecret;

export async function authenticate(req: Request): Promise<{ userId: string }> {
  const authHeader = req.headers.authorization;
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
