/**
 * Player Management Routes
 * Part of Soccer Team Management API
 * 
 * @author Sohel Datta <soheldatta17@gmail.com>
 * @copyright Copyright (c) 2024 Sohel Datta
 * @license MIT
 * @repository https://github.com/soheldatta17/soccer-prisma-backend
 */

import { Router } from 'express';
import { authenticate } from "../middlewares/authMiddleware.js";
import { playerController } from "../controllers/playerController.js";

const router = Router();

/**
 * @swagger
 * /v1/player:
 *   post:
 *     tags: [Players]
 *     summary: Add player to team
 *     description: Add a player to a team with position and jersey number
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamId
 *               - roleId
 *               - position
 *               - jerseyNumber
 *             properties:
 *               teamId:
 *                 type: string
 *                 description: ID of the team
 *                 example: "team_123abc456def"
 *               roleId:
 *                 type: string
 *                 description: ID of the player role
 *                 example: "role_123abc456def"
 *               position:
 *                 type: string
 *                 enum: [Forward, Midfielder, Defender, Goalkeeper]
 *                 description: Player position on the field
 *                 example: "Forward"
 *               jerseyNumber:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 99
 *                 description: Jersey number for the player
 *                 example: 7
 *     responses:
 *       200:
 *         description: Player added to team successfully
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
 *                       $ref: '#/components/schemas/Player'
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
 *       409:
 *         description: Jersey number already taken or player already in team
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
    const { userId } = await authenticate(req);
    const result = await playerController.addPlayerToTeam(req, userId);
    const data = await result.json();
    res.status(result.status).json(data);
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});

/**
 * @swagger
 * /v1/player/{playerId}:
 *   put:
 *     tags: [Players]
 *     summary: Update player details
 *     description: Update player information such as position or jersey number
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *         example: "player_123abc456def"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               position:
 *                 type: string
 *                 enum: [Forward, Midfielder, Defender, Goalkeeper]
 *                 description: Player position on the field
 *                 example: "Forward"
 *               jerseyNumber:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 99
 *                 description: Jersey number for the player
 *                 example: 10
 *     responses:
 *       200:
 *         description: Player updated successfully
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
 *                       $ref: '#/components/schemas/Player'
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
 *       404:
 *         description: Player not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Jersey number already taken
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
router.put('/:playerId', async (req, res) => {
  try {
    const { userId } = await authenticate(req);
    const playerId = req.params.playerId;
    const result = await playerController.updatePlayer(req, userId, playerId);
    const data = await result.json();
    res.status(result.status).json(data);
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});

export const playerRoutes = router; 