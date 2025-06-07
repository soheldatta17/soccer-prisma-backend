import type { Request as ExpressRequest } from 'express';

export function convertToWebRequest(req: ExpressRequest): globalThis.Request {
  const url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
  
  return new Request(url.toString(), {
    method: req.method,
    headers: new Headers(req.headers as any),
    body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : null
  });
} 