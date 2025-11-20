# 🚀 Deployment Guide

## Vercel Deployment

### Prerequisites
1. **Neon Database**: Ensure your Neon PostgreSQL database is set up and accessible
2. **Environment Variables**: Required environment variables for production
3. **Vercel Account**: Connected to your GitHub repository

### Environment Variables Required
```bash
# Database
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# JWT Authentication
JWT_SECRET="your-super-secure-jwt-secret-key"

# Environment
NODE_ENV="production"
```

### Deployment Steps

#### 1. **Push to GitHub**
```bash
git add .
git commit -m "feat: serverless-friendly Swagger UI implementation"
git push origin main
```

#### 2. **Deploy to Vercel**

**Option A: Vercel CLI**
```bash
npm i -g vercel
vercel --prod
```

**Option B: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set environment variables in project settings
4. Deploy

#### 3. **Set Environment Variables in Vercel**
1. Go to Project Settings → Environment Variables
2. Add the required variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`

#### 4. **Test Deployment**
Once deployed, test these endpoints:
- `https://your-app.vercel.app/` → Redirects to docs
- `https://your-app.vercel.app/docs` → Swagger UI
- `https://your-app.vercel.app/health` → Health check
- `https://your-app.vercel.app/v1/auth/register` → API endpoints

### Key Changes for Serverless Compatibility

#### 1. **Removed swagger-ui-express**
- Replaced with custom HTML implementation
- Uses CDN for Swagger UI assets
- No dependency on local static files

#### 2. **Optimized Vercel Configuration**
```json
{
  "functions": {
    "index.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

#### 3. **Explicit Route Mapping**
```json
{
  "routes": [
    { "src": "/v1/(.*)", "dest": "index.ts" },
    { "src": "/docs", "dest": "index.ts" },
    { "src": "/swagger", "dest": "index.ts" },
    { "src": "/health", "dest": "index.ts" }
  ]
}
```

### Troubleshooting

#### Common Issues:

**1. Database Connection Error**
```
Error: P1001: Can't reach database server
```
**Solution**: Verify `DATABASE_URL` in Vercel environment variables

**2. JWT Secret Missing**
```
Error: JWT secret is required
```
**Solution**: Set `JWT_SECRET` environment variable

**3. 404 on API Routes**
```
404 - This page could not be found
```
**Solution**: Check Vercel route configuration in `vercel.json`

### Performance Optimization

#### 1. **Database Connection Pooling**
Neon automatically handles connection pooling for serverless functions.

#### 2. **Cold Start Optimization**
- Prisma client generation happens at build time
- Environment variables loaded once at startup
- Minimal middleware setup

#### 3. **Memory Configuration**
```json
{
  "functions": {
    "index.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

### Monitoring

#### Health Check Endpoint
```
GET /health
```
Response:
```json
{
  "status": "OK",
  "timestamp": "2024-11-20T12:00:00.000Z",
  "service": "Soccer Team Management API",
  "version": "1.0.0",
  "environment": "production"
}
```

#### Vercel Analytics
- Enable Vercel Analytics in project settings
- Monitor function invocations and performance
- Set up error tracking

### Security

#### Production Security Checklist:
- ✅ Strong JWT secret (32+ characters)
- ✅ Database connection over SSL
- ✅ CORS configured appropriately
- ✅ Environment variables secured
- ✅ No sensitive data in logs

### Useful Commands

```bash
# Local development
npm run dev

# Build and test locally
npm run build

# Run database seed
npm run seed

# Deploy to Vercel
vercel --prod

# View deployment logs
vercel logs
```

### Support

If you encounter issues:
1. Check Vercel function logs: `vercel logs`
2. Verify environment variables in Vercel dashboard
3. Test database connectivity using Prisma Studio: `npx prisma studio`
4. Monitor function performance in Vercel analytics

---

**Last updated**: November 20, 2024
**API Version**: 1.0.0