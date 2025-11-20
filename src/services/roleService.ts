/**
 * Role Service
 * Part of Soccer Team Management API
 * 
 * Handles role-related database operations with normalized permissions.
 * 
 * @author Sohel Datta <soheldatta17@gmail.com>
 * @copyright Copyright (c) 2024 Sohel Datta
 * @license MIT
 * @repository https://github.com/soheldatta17/soccer-prisma-backend
 */

import { PrismaClient } from "@prisma/client";
import { generateId } from "../utils/id.js";

const prisma = new PrismaClient();

export const createRole = async (name: string, description?: string) => {
  return await prisma.role.create({
    data: { 
      id: generateId(), 
      name, 
      description 
    },
    include: {
      permissions: {
        include: {
          permission: true
        }
      }
    }
  });
};

export const getAllRoles = async () => {
  return await prisma.role.findMany({
    include: {
      permissions: {
        include: {
          permission: true
        }
      }
    }
  });
};

export const getRoleById = async (id: string) => {
  return await prisma.role.findUnique({
    where: { id },
    include: {
      permissions: {
        include: {
          permission: true
        }
      }
    }
  });
};

export const assignPermissionToRole = async (roleId: string, permissionId: string) => {
  return await prisma.rolePermission.create({
    data: {
      id: generateId(),
      roleId,
      permissionId
    }
  });
};

export const removePermissionFromRole = async (roleId: string, permissionId: string) => {
  return await prisma.rolePermission.deleteMany({
    where: {
      roleId: roleId,
      permissionId: permissionId
    }
  });
};

export const getAllPermissions = async () => {
  return await prisma.permission.findMany({
    orderBy: [
      { category: 'asc' },
      { name: 'asc' }
    ]
  });
};
