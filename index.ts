/**
 * Soccer Team Management API
 * 
 * @author Sohel Datta <soheldatta17@gmail.com>
 * @copyright Copyright (c) 2024 Sohel Datta
 * @license MIT
 * @repository https://github.com/soheldatta17/soccer-prisma-backend
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { roleRoutes } from "./src/routes/roleRoute.js";
import { authRoutes } from "./src/routes/authRoute.js";
import { teamRoutes } from "./src/routes/teamRoute.js";
import { playerRoutes } from "./src/routes/playerRoute.js";
import { convertToWebRequest } from "./src/utils/request.js";

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json({ limit: '10kb' })); // Body size limit
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { status: false, error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { status: false, error: 'Too many authentication attempts, please try again later.' }
});

// CORS configuration - Allow all origins and methods
app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: '*',
  credentials: true,
  maxAge: 86400 // CORS preflight cache for 24 hours
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.path}`);
  next();
});

// Routes
app.use('/v1/role', async (req, res, next) => {
  try {
    const webRequest = convertToWebRequest(req);
    const response = await roleRoutes(webRequest);
    res.status(response.status).json(JSON.parse(await response.text()));
  } catch (error) {
    next(error);
  }
});

app.use('/v1/auth', authLimiter, async (req, res, next) => {
  try {
    const webRequest = convertToWebRequest(req);
    const response = await authRoutes(webRequest);
    res.status(response.status).json(JSON.parse(await response.text()));
  } catch (error) {
    next(error);
  }
});

app.use('/v1/team', async (req, res, next) => {
  try {
    const webRequest = convertToWebRequest(req);
    const response = await teamRoutes(webRequest);
    res.status(response.status).json(JSON.parse(await response.text()));
  } catch (error) {
    next(error);
  }
});

app.use('/v1/player', async (req, res, next) => {
  try {
    const webRequest = convertToWebRequest(req);
    const response = await playerRoutes(webRequest);
    res.status(response.status).json(JSON.parse(await response.text()));
  } catch (error) {
    next(error);
  }
});

// Root route - API Documentation
app.get('/', (req, res) => {
  res.json({
    name: "Soccer Team Management API",
    version: "1.0.0",
    description: "A comprehensive REST API for managing professional soccer teams, players, and staff.",
    author: {
      name: "Sohel Datta",
      email: "soheldatta17@gmail.com",
      github: "https://github.com/soheldatta17"
    },
    documentation: {
      endpoints: {
        auth: {
          signup: {
            method: "POST",
            path: "/v1/auth/signup",
            description: "Register a new user (player, staff, or manager)"
          },
          signin: {
            method: "POST",
            path: "/v1/auth/signin",
            description: "Authenticate and receive access token"
          }
        },
        team: {
          create: {
            method: "POST",
            path: "/v1/team",
            description: "Create a new soccer team"
          },
          getAll: {
            method: "GET",
            path: "/v1/team",
            description: "List all teams with pagination"
          },
          getDetails: {
            method: "GET",
            path: "/v1/team/:teamId",
            description: "Get detailed information about a specific team"
          },
          getPlayers: {
            method: "GET",
            path: "/v1/team/:teamId/players",
            description: "Get all players in a team"
          }
        },
        player: {
          add: {
            method: "POST",
            path: "/v1/player",
            description: "Add a player to a team with position and number"
          },
          update: {
            method: "PUT",
            path: "/v1/player/:playerId",
            description: "Update player information"
          }
        }
      },
      features: [
        "Complete Soccer Team Management",
        "Player Management",
        "Staff Management",
        "Role-based Access Control",
        "JWT Authentication",
        "RESTful API Architecture",
        "PostgreSQL Database"
      ],
      playerPositions: [
        "Forward",
        "Midfielder",
        "Defender",
        "Goalkeeper"
      ],
      teamRoles: [
        "Team Manager",
        "Head Coach",
        "Assistant Coach",
        "Team Captain",
        "Player"
      ]
    },
    repository: "https://github.com/soheldatta17/soccer-prisma-backend",
    license: "MIT"
  });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  
  // Handle specific known errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: false,
      error: 'Validation Error',
      message: err.message
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: false,
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }

  // Default error response
  res.status(500).json({ 
    status: false, 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    status: false, 
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Start server only in non-production environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;
