/**
 * Authentication Controller
 * Part of Soccer Team Management API
 * 
 * Handles user authentication, registration, and user management operations.
 * 
 * @author Sohel Datta <soheldatta17@gmail.com>
 * @copyright Copyright (c) 2024 Sohel Datta
 * @license MIT
 * @repository https://github.com/soheldatta17/soccer-prisma-backend
 */

import { Request } from 'express';
import { signupUser, signinUser } from "../services/authService.js";
import { sendJSON } from "../utils/response.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function signupController(req: Request) {
  try {
    const result = await signupUser(req);
    return result;
  } catch (err: any) {
    throw err;
  }
}

export async function signinController(req: Request) {
  try {
    const result = await signinUser(req);
    return result;
  } catch (err: any) {
    throw err;
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (err: any) {
    throw err;
  }
}