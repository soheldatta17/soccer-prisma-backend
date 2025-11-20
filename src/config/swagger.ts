/**
 * Swagger Configuration
 * Part of Soccer Team Management API
 * 
 * @author Sohel Datta <soheldatta17@gmail.com>
 * @copyright Copyright (c) 2024 Sohel Datta
 * @license MIT
 * @repository https://github.com/soheldatta17/soccer-prisma-backend
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Soccer Team Management API',
      version: '1.0.0',
      description: 'A comprehensive REST API for managing professional soccer teams, players, and staff. Built with Node.js, TypeScript, and Prisma.',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'Sohel Datta',
        email: 'soheldatta17@gmail.com',
        url: 'https://github.com/soheldatta17',
      },
      termsOfService: 'https://github.com/soheldatta17/soccer-prisma-backend/blob/main/LICENSE',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://soccer-prisma-backend.vercel.app',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT Bearer token **_only_**',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
              example: 'usr_123abc456def',
            },
            name: {
              type: 'string',
              description: 'User full name',
              example: 'Kylian Mbappe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'mbappe@example.com',
            },
            password: {
              type: 'string',
              description: 'User password (minimum 8 characters)',
              example: 'securepassword123',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
            },
          },
        },
        Team: {
          type: 'object',
          required: ['name', 'location', 'league', 'founded'],
          properties: {
            id: {
              type: 'string',
              description: 'Team ID',
              example: 'team_123abc456def',
            },
            name: {
              type: 'string',
              description: 'Team name',
              example: 'Manchester United',
            },
            location: {
              type: 'string',
              description: 'Team location',
              example: 'Manchester, England',
            },
            league: {
              type: 'string',
              description: 'League/Competition',
              example: 'Premier League',
            },
            founded: {
              type: 'integer',
              description: 'Year the team was founded',
              example: 1878,
            },
            owner_id: {
              type: 'string',
              description: 'ID of the team owner',
              example: 'usr_123abc456def',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Team creation timestamp',
            },
          },
        },
        Player: {
          type: 'object',
          required: ['teamId', 'roleId', 'position', 'jerseyNumber'],
          properties: {
            id: {
              type: 'string',
              description: 'Player ID',
              example: 'player_123abc',
            },
            team_id: {
              type: 'string',
              description: 'Team ID',
              example: 'team_123abc456def',
            },
            role_id: {
              type: 'string',
              description: 'Role ID',
              example: 'role_123abc',
            },
            position: {
              type: 'string',
              enum: ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'],
              description: 'Player position',
              example: 'Forward',
            },
            jersey_number: {
              type: 'integer',
              minimum: 1,
              maximum: 99,
              description: 'Jersey number',
              example: 7,
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'injured'],
              description: 'Player status',
              example: 'active',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Player registration timestamp',
            },
          },
        },
        Role: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'string',
              description: 'Role ID',
              example: 'role_123abc',
            },
            name: {
              type: 'string',
              description: 'Role name',
              example: 'Team Captain',
            },
            description: {
              type: 'string',
              description: 'Role description',
              example: 'Team leadership and communication',
            },
            permissions: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Role permissions',
              example: ['read_team', 'manage_players'],
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Role creation timestamp',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'boolean',
              example: true,
            },
            content: {
              type: 'object',
              properties: {
                data: {
                  $ref: '#/components/schemas/User',
                },
                meta: {
                  type: 'object',
                  properties: {
                    access_token: {
                      type: 'string',
                      description: 'JWT access token',
                      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    },
                  },
                },
              },
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'boolean',
              description: 'Response status',
              example: true,
            },
            content: {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  description: 'Response data',
                },
                meta: {
                  type: 'object',
                  description: 'Response metadata (pagination, etc.)',
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Invalid credentials',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'boolean',
              example: true,
            },
            content: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                meta: {
                  type: 'object',
                  properties: {
                    total: {
                      type: 'integer',
                      description: 'Total number of items',
                      example: 20,
                    },
                    page: {
                      type: 'integer',
                      description: 'Current page number',
                      example: 1,
                    },
                    limit: {
                      type: 'integer',
                      description: 'Items per page',
                      example: 10,
                    },
                    total_pages: {
                      type: 'integer',
                      description: 'Total number of pages',
                      example: 2,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization',
      },
      {
        name: 'Teams',
        description: 'Soccer team management',
      },
      {
        name: 'Players',
        description: 'Player management and roster control',
      },
      {
        name: 'Roles',
        description: 'Role-based access control',
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './index.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);