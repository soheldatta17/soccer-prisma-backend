/**
 * Role Management Routes
 * Part of Soccer Team Management API
 * 
 * @author Sohel Datta <soheldatta17@gmail.com>
 * @copyright Copyright (c) 2024 Sohel Datta
 * @license MIT
 * @repository https://github.com/soheldatta17/soccer-prisma-backend
 */

import { Router } from 'express';
import { handleCreateRole, handleGetAllRoles, handleGetAllPermissions } from "../controllers/roleController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /v1/role:
 *   get:
 *     tags: [Roles]
 *     summary: Get all roles
 *     description: Retrieve all available roles in the system
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 content:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Role'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', async (req, res) => {
  try {
    const result = await handleGetAllRoles();
    res.status(result.statusCode || 200).json({
      status: result.status,
      content: result.content
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});

/**
 * @swagger
 * /v1/role:
 *   post:
 *     tags: [Roles]
 *     summary: Create a new role
 *     description: Create a new role with specific permissions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Role name
 *                 example: "Team Captain"
 *               description:
 *                 type: string
 *                 description: Role description
 *                 example: "Team leadership and communication"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of permissions for this role
 *                 example: ["read_team", "manage_players"]
 *     responses:
 *       200:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 content:
 *                   type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Role'
 *       400:
 *         description: Bad request - validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', async (req, res) => {
  try {
    const result = await handleCreateRole(req);
    res.status(result.statusCode || 200).json({
      status: result.status,
      content: result.content,
      error: result.message
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});

/**
 * @swagger
 * /v1/role/permissions:
 *   get:
 *     tags: [Roles]
 *     summary: Get all permissions
 *     description: Retrieve all available permissions in the system
 *     responses:
 *       200:
 *         description: Permissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 content:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Permission'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/permissions', async (req, res) => {
  try {
    const result = await handleGetAllPermissions();
    res.status(result.statusCode || 200).json({
      status: result.status,
      content: result.content
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});

export const roleRoutes = router;
