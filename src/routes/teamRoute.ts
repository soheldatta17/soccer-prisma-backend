/**
 * Team Management Routes
 * Part of Soccer Team Management API
 * 
 * @author Sohel Datta <soheldatta17@gmail.com>
 * @copyright Copyright (c) 2024 Sohel Datta
 * @license MIT
 * @repository https://github.com/soheldatta17/soccer-prisma-backend
 */

import { Router } from 'express';
import { authenticate } from "../middlewares/authMiddleware.js";
import { teamController } from "../controllers/teamController.js";

const router = Router();

/**
 * @swagger
 * /v1/team:
 *   get:
 *     tags: [Teams]
 *     summary: Get all teams
 *     description: List all teams with pagination support
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Teams retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', async (req, res) => {
  try {
    const result = await teamController.getAllTeams(req);
    const data = await result.json();
    res.status(result.status).json(data);
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});

/**
 * @swagger
 * /v1/team:
 *   post:
 *     tags: [Teams]
 *     summary: Create a new team
 *     description: Create a new soccer team
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
 *               - location
 *               - league
 *               - founded
 *             properties:
 *               name:
 *                 type: string
 *                 description: Team name
 *                 example: "Manchester United"
 *               location:
 *                 type: string
 *                 description: Team location
 *                 example: "Manchester, England"
 *               league:
 *                 type: string
 *                 description: League/Competition the team plays in
 *                 example: "Premier League"
 *               founded:
 *                 type: integer
 *                 minimum: 1850
 *                 maximum: 2024
 *                 description: Year the team was founded
 *                 example: 1878
 *     responses:
 *       200:
 *         description: Team created successfully
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
 *                       $ref: '#/components/schemas/Team'
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
    const { userId } = await authenticate(req);
    const result = await teamController.createTeam(req, userId);
    const data = await result.json();
    res.status(result.status).json(data);
  } catch (error) {
    res.status(401).json({ status: false, error: error.message });
  }
});

/**
 * @swagger
 * /v1/team/me/player:
 *   get:
 *     tags: [Teams]
 *     summary: Get teams where I'm a player
 *     description: Get all teams where the authenticated user is a player
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teams retrieved successfully
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
 *                         $ref: '#/components/schemas/Team'
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
router.get('/me/player', async (req, res) => {
  try {
    const { userId } = await authenticate(req);
    const result = await teamController.getMyTeamsAsPlayer(req, userId);
    const data = await result.json();
    res.status(result.status).json(data);
  } catch (error) {
    res.status(401).json({ status: false, error: error.message });
  }
});

/**
 * @swagger
 * /v1/team/me/owner:
 *   get:
 *     tags: [Teams]
 *     summary: Get teams I own
 *     description: Get all teams owned by the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teams retrieved successfully
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
 *                         $ref: '#/components/schemas/Team'
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
router.get('/me/owner', async (req, res) => {
  try {
    const { userId } = await authenticate(req);
    const result = await teamController.getMyOwnedTeams(req, userId);
    const data = await result.json();
    res.status(result.status).json(data);
  } catch (error) {
    res.status(401).json({ status: false, error: error.message });
  }
});

/**
 * @swagger
 * /v1/team/{teamId}/players:
 *   get:
 *     tags: [Teams]
 *     summary: Get team players
 *     description: Get all players in a specific team
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *         example: "team_123abc456def"
 *     responses:
 *       200:
 *         description: Team players retrieved successfully
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
 *                         $ref: '#/components/schemas/Player'
 *                     meta:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 25
 *                         active:
 *                           type: integer
 *                           example: 25
 *       404:
 *         description: Team not found
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
router.get('/:teamId/players', async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const result = await teamController.getTeamPlayers(req, teamId);
    const data = await result.json();
    res.status(result.status).json(data);
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});

/**
 * @swagger
 * /v1/team:
 *   put:
 *     tags: [Teams]
 *     summary: Update team details
 *     description: Update team information (only by team owner)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamId:
 *                 type: string
 *                 description: Team ID to update
 *                 example: "team_123abc456def"
 *               name:
 *                 type: string
 *                 description: Team name
 *                 example: "Manchester United FC"
 *               location:
 *                 type: string
 *                 description: Team location
 *                 example: "Manchester, England"
 *               league:
 *                 type: string
 *                 description: League/Competition
 *                 example: "Premier League"
 *               founded:
 *                 type: integer
 *                 description: Year the team was founded
 *                 example: 1878
 *     responses:
 *       200:
 *         description: Team updated successfully
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
 *                       $ref: '#/components/schemas/Team'
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
 *       403:
 *         description: Forbidden - not team owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Team not found
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
router.put('/', async (req, res) => {
  try {
    const { userId } = await authenticate(req);
    const result = await teamController.updateTeam(req, userId);
    const data = await result.json();
    res.status(result.status).json(data);
  } catch (error) {
    res.status(401).json({ status: false, error: error.message });
  }
});

/**
 * @swagger
 * /v1/team:
 *   delete:
 *     tags: [Teams]
 *     summary: Delete team
 *     description: Delete a team (only by team owner)
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
 *             properties:
 *               teamId:
 *                 type: string
 *                 description: Team ID to delete
 *                 example: "team_123abc456def"
 *     responses:
 *       200:
 *         description: Team deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Team deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - not team owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Team not found
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
router.delete('/', async (req, res) => {
  try {
    const { userId } = await authenticate(req);
    const result = await teamController.deleteTeam(req, userId);
    const data = await result.json();
    res.status(result.status).json(data);
  } catch (error) {
    res.status(401).json({ status: false, error: error.message });
  }
});

export const teamRoutes = router; 