# Deployment Guide for Dokploy

## CRITICAL: Required Environment Variables

**You MUST set these in your Dokploy environment configuration:**

```
DATABASE_URL=postgresql://user:password@host:5432/database_name
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.com
```

⚠️ **Important:** Make sure the database specified in `DATABASE_URL` already exists, or ensure your database user has `CREATE DATABASE` privileges.

## Deployment Steps

1. **Push code to repository**
   ```bash
   git add .
   git commit -m "fix: Fix Prisma configuration for Dokploy deployment"
   git push origin main
   ```

2. **In Dokploy:**
   - Verify all environment variables are set correctly
   - Trigger a new deployment
   - Monitor logs for successful startup
   - Port: 3000

## What happens on deployment:

1. Docker builds the image using the multi-stage Dockerfile
2. Entrypoint validates DATABASE_URL is set
3. Prisma pushes schema changes to database via `npx prisma db push`
4. Database seeding occurs via `npx prisma db seed`
5. Next.js application starts on port 3000

## Changes Made to Fix Deployment

### Fixed Issues:
1. ✅ **Added missing `url` field in schema.prisma** - Prisma requires `url = env("DATABASE_URL")` in the datasource block
2. ✅ **Removed hardcoded credentials** - All secrets now come from environment variables
3. ✅ **Simplified entrypoint.sh** - Removed complex database creation logic (Prisma handles it)
4. ✅ **Added next.config.ts to production image** - Required for Next.js runtime
5. ✅ **Created deployment documentation** - Clear instructions for Dokploy setup

## Troubleshooting

### "datasource.url property is required"
- **Cause:** Missing `url` field in prisma/schema.prisma
- **Fix:** Already fixed - schema now has `url = env("DATABASE_URL")`

### "DATABASE_URL is not set"
- **Cause:** Environment variable not configured in Dokploy
- **Fix:** Add DATABASE_URL in Dokploy environment settings

### Database connection errors
- **Cause:** Incorrect DATABASE_URL format or database doesn't exist
- **Fix:** Verify format: `postgresql://user:password@host:port/database`
- **Fix:** Ensure database exists or user has CREATE DATABASE permission

### Container not starting
- **Cause:** Missing environment variables
- **Fix:** Check Dokploy logs and ensure all three variables are set

