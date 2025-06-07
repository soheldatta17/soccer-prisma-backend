/**
 * Request Utility
 * Part of Soccer Team Management API
 * 
 * Provides request handling and conversion utilities.
 * 
 * @author Sohel Datta <soheldatta17@gmail.com>
 * @copyright Copyright (c) 2024 Sohel Datta
 * @license MIT
 * @repository https://github.com/soheldatta17/soccer-prisma-backend
 */

import type { Request as ExpressRequest } from 'express';

export function convertToWebRequest(req: ExpressRequest): globalThis.Request {
  const url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
  
  return new Request(url.toString(), {
    method: req.method,
    headers: new Headers(req.headers as any),
    body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : null
  });
} 