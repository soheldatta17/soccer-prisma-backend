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

// Custom Swagger UI implementation for serverless deployment
app.get('/docs', (_, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Soccer API Documentation</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui.css" />
        <link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFNTE3OEEzMjk5QTAxMUUyOUExNUJDMTA0NkE4OTA0RCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFNTE3OEEzMzk5QTAxMUUyOUExNUJDMTA0NkE4OTA0RCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU1MTc4QTMwOTlBMDExRTI5QTE1QkMxMDQ2QTg5MDREIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU1MTc4QTMxOTlBMDExRTI5QTE1QkMxMDQ2QTg5MDREIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+m4QGuQAAAK1JREFUOI3t1ksNwjAUBODXgBCABCRYAsRqoSJAAmJBAmJFDBKQgBIkJKABCXBAw/RImyaUhzawZGLJFkJu5+SkY2KMeRdwBbZgCzZgA5Y1jNovB84RddhvUcOoXxN1yVkKfEtZ5iY6p+LJF9WdNzPdRWdLSIHXTcffUd6kCW7cR8YPnDpqAgO8JODMDmRwKO8yW7R8WCcfvw0ycjg35ZmG7Ek4vCjxPqA6YaFxC5FxSGN3M6UtCK+P/ZmCPwAAAABJRU5ErkJggg==" />
        <style>
            html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
            *, *:before, *:after { box-sizing: inherit; }
            body { margin:0; background: #fafafa; }
            .swagger-ui .topbar { display: none; }
            .swagger-ui .info .title { color: #3b4151; }
        </style>
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-standalone-preset.js"></script>
        <script>
            const spec = ${JSON.stringify(swaggerSpec)};
            SwaggerUIBundle({
                url: '/swagger',
                spec: spec,
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                persistAuthorization: true,
                displayOperationId: false,
                filter: true,
                showExtensions: true,
                showCommonExtensions: true,
                defaultModelExpandDepth: 3,
                defaultModelsExpandDepth: 3,
                docExpansion: 'list',
                supportedSubmitMethods: ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'],
                onComplete: function() {
                    console.log('Swagger UI loaded successfully');
                },
                onFailure: function(data) {
                    console.error('Failed to load Swagger UI:', data);
                }
            });
        </script>
    </body>
    </html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Serve swagger spec as JSON
app.get('/swagger', (_, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
});

// Basic routes - Redirect root to Swagger docs
app.get('/', (_, res) => {
  res.redirect('/docs');
});

// Health check endpoint for monitoring
app.get('/health', (_, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Soccer Team Management API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
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
