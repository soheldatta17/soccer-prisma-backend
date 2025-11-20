/**
 * Soccer Team Management API
 * 
 * @author Sohel Datta <soheldatta17@gmail.com>
 * @copyright Copyright (c) 2024 Sohel Datta
 * @license MIT
 * @repository https://github.com/soheldatta17/soccer-prisma-backend
 */

// Load environment variables first
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './src/config/swagger.js';
import { roleRoutes } from "./src/routes/roleRoute.js";
import { authRoutes } from "./src/routes/authRoute.js";
import { teamRoutes } from "./src/routes/teamRoute.js";
import { playerRoutes } from "./src/routes/playerRoute.js";
import path from 'path';
import fs from 'fs';
import { marked } from 'marked';

const app = express();

// Only essential middleware
app.use(express.json());
app.use(cors());

// Swagger API Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Soccer API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayOperationId: false,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
  },
}));

// Basic routes - Redirect root to Swagger docs
app.get('/', (_, res) => {
  res.redirect('/docs');
});

// Optional: Keep README available at /readme
app.get('/readme', (_, res) => {
  const readmePath = path.join(process.cwd(), 'README.md');
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');
  const htmlContent = marked(readmeContent);
  
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Soccer Team Management API - Documentation</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown.min.css">
        <style>
            body {
                box-sizing: border-box;
                min-width: 200px;
                max-width: 980px;
                margin: 0 auto;
                padding: 45px;
                background-color: #f6f8fa;
            }
            .markdown-body {
                background-color: white;
                padding: 45px;
                border-radius: 6px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.12);
                color: #24292f;
            }
            .api-docs-banner {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
                text-align: center;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .api-docs-banner h2 {
                margin: 0 0 10px 0;
                color: white;
                border: none;
                padding: 0;
                font-size: 24px;
            }
            .api-docs-banner p {
                margin: 0 0 15px 0;
                opacity: 0.9;
            }
            .docs-button {
                display: inline-block;
                background-color: rgba(255,255,255,0.2);
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                transition: background-color 0.3s ease;
                border: 2px solid rgba(255,255,255,0.3);
                margin-right: 10px;
            }
            .docs-button:hover {
                background-color: rgba(255,255,255,0.3);
                color: white;
                text-decoration: none;
            }
            .markdown-body h1 {
                color: #1a1a1a;
                border-bottom: 1px solid #eaecef;
                padding-bottom: 0.3em;
            }
            .markdown-body h2 {
                color: #1a1a1a;
                border-bottom: 1px solid #eaecef;
                padding-bottom: 0.3em;
            }
            .markdown-body h3 {
                color: #1a1a1a;
            }
            .markdown-body code {
                background-color: #f6f8fa;
                border-radius: 6px;
                padding: 0.2em 0.4em;
                color: #24292f;
                font-weight: 600;
            }
            .markdown-body pre {
                background-color: #f6f8fa;
                border-radius: 6px;
                padding: 16px;
                border: 1px solid #d0d7de;
            }
            .markdown-body pre code {
                background-color: transparent;
                padding: 0;
                color: #24292f;
                font-weight: normal;
            }
            .markdown-body a {
                color: #0969da;
                text-decoration: none;
            }
            .markdown-body a:hover {
                text-decoration: underline;
            }
            @media (max-width: 767px) {
                body {
                    padding: 15px;
                }
                .markdown-body {
                    padding: 15px;
                }
                .api-docs-banner {
                    padding: 15px;
                }
            }
            @media (prefers-color-scheme: dark) {
                body {
                    background-color: #0d1117;
                }
                .markdown-body {
                    background-color: #161b22;
                    color: #c9d1d9;
                }
                .api-docs-banner {
                    background: linear-gradient(135deg, #4c6ef5 0%, #9c36b5 100%);
                }
                .markdown-body h1,
                .markdown-body h2,
                .markdown-body h3 {
                    color: #e6edf3;
                    border-bottom-color: #30363d;
                }
                .markdown-body code {
                    background-color: rgba(110,118,129,0.4);
                    color: #e6edf3;
                }
                .markdown-body pre {
                    background-color: #1f2428;
                    border-color: #30363d;
                }
                .markdown-body pre code {
                    color: #e6edf3;
                }
                .markdown-body a {
                    color: #58a6ff;
                }
            }
        </style>
    </head>
    <body>
        <div class="markdown-body">
            <div class="api-docs-banner">
                <h2>🚀 Soccer Team Management API</h2>
                <p>Interactive API Documentation & Project Information</p>
                <a href="/docs" class="docs-button">Interactive API Docs →</a>
                <a href="/" class="docs-button">← Back to API</a>
            </div>
            ${htmlContent}
        </div>
    </body>
    </html>
  `;
  
  res.send(fullHtml);
});

app.use('/v1/auth', authRoutes);
app.use('/v1/role', roleRoutes);
app.use('/v1/team', teamRoutes);
app.use('/v1/player', playerRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

export default app;
