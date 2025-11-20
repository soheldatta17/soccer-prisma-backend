/**
 * Role Controller
 * Part of Soccer Team Management API
 * 
 * Handles role-related HTTP requests with normalized permissions.
 * 
 * @author Sohel Datta <soheldatta17@gmail.com>
 * @copyright Copyright (c) 2024 Sohel Datta
 * @license MIT
 * @repository https://github.com/soheldatta17/soccer-prisma-backend
 */

import type { Request } from "express";
import { createRole, getAllRoles, getAllPermissions } from "../services/roleService.js";
import { createRoleSchema } from "../validators/roleValidate.js";

const handleCreateRole = async (req: Request) => {
  const body = req.body;
  const { error } = createRoleSchema.validate(body);
  if (error) {
    return {
      status: false,
      message: error.message,
      statusCode: 400
    };
  }

  try {
    const role = await createRole(body.name, body.description);
    return {
      status: true,
      content: { data: role },
      statusCode: 200
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.message || "Something went wrong",
      statusCode: 500
    };
  }
};

const handleGetAllRoles = async () => {
  try {
    const roles = await getAllRoles();
    
    // Transform the data to include permissions in a cleaner format
    const transformedRoles = roles.map(role => ({
      ...role,
      permissions: role.permissions.map(rp => rp.permission)
    }));

    return {
      status: true,
      content: {
        meta: {
          total: transformedRoles.length,
          pages: 1,
          page: 1
        },
        data: transformedRoles
      },
      statusCode: 200
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.message || "Something went wrong",
      statusCode: 500
    };
  }
};

const handleGetAllPermissions = async () => {
  try {
    const permissions = await getAllPermissions();

    return {
      status: true,
      content: {
        meta: {
          total: permissions.length,
          pages: 1,
          page: 1
        },
        data: permissions
      },
      statusCode: 200
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.message || "Something went wrong",
      statusCode: 500
    };
  }
};

export { handleCreateRole, handleGetAllRoles, handleGetAllPermissions };
