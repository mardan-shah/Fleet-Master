# Deployment Guide for Dokploy

## CRITICAL: Required Environment Variables

**You MUST set these in your Dokploy environment configuration:**

```
DATABASE_URL=postgresql://user:password@host:5432/database_name
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.com
```

⚠️ **Important:** Make sure the database specified in `DATABASE_URL` already exists, or ensure your database user has `CREATE DATABASE` privileges.

## Prisma 7 Configuration Notes

This project uses **Prisma 7**, which has important changes:
- ✅ Database URL is configured in `prisma.config.ts` (NOT in schema.prisma)
- ✅ PrismaClient uses the adapter pattern with `@prisma/adapter-pg`
- ✅ No `url` field in `schema.prisma` datasource block

## Deployment Steps

1. **Push code to repository**
   ```bash
   git add .
   git commit -m "fix: Update Prisma 7 configuration for Dokploy"
   git push origin main
   ```

2. **In Dokploy:**
   - Verify all environment variables are set correctly
   - Trigger a new deployment
   - Monitor logs for successful startup
   - Port: 3000

## What happens on deployment:

1. Docker/Nixpacks builds the image
2. Prisma generates the client
3. Next.js builds the production bundle
4. Entrypoint validates DATABASE_URL is set
5. Prisma pushes schema changes to database via `npx prisma db push`
6. Database seeding occurs via `npx prisma db seed`
7. Next.js application starts on port 3000

## Changes Made to Fix Deployment

### Fixed Issues:
1. ✅ **Removed `url` field from schema.prisma** - Prisma 7 doesn't allow url in schema files
2. ✅ **Database URL configured in prisma.config.ts** - Proper Prisma 7 configuration
3. ✅ **Using adapter pattern** - PrismaClient uses @prisma/adapter-pg with pg.Pool
4. ✅ **Removed hardcoded credentials** - All secrets now come from environment variables
5. ✅ **Simplified entrypoint.sh** - Removed complex database creation logic
6. ✅ **Added next.config.ts to production image** - Required for Next.js runtime

## Troubleshooting

### "datasource.url property is no longer supported"
- **Cause:** Prisma 7 doesn't allow `url` in schema.prisma datasource block
- **Fix:** Already fixed - url removed from schema, configured in prisma.config.ts

### "DATABASE_URL is not set"
- **Cause:** Environment variable not configured in Dokploy
- **Fix:** Add DATABASE_URL in Dokploy environment settings

### Database connection errors
- **Cause:** Incorrect DATABASE_URL format or database doesn't exist
- **Fix:** Verify format: `postgresql://user:password@host:port/database`
- **Fix:** Ensure database exists or user has CREATE DATABASE permission

### Nixpacks build vs Dockerfile
- Dokploy may use Nixpacks or Dockerfile
- **For Dockerfile:** Explicitly select "Dockerfile" in Dokploy build settings
- **For Nixpacks:** It will auto-detect Node.js and use the provided nixpacks.toml

### Container not starting
- **Cause:** Missing environment variables
- **Fix:** Check Dokploy logs and ensure all three variables are set


