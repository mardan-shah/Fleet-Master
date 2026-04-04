# Deployment Guide for Dokploy

## CRITICAL: Required Environment Variables

**You MUST set these in your Dokploy environment configuration:**

```
DATABASE_URL=postgresql://user:password@host:5432/database_name
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.com
```

⚠️ **Important:** 
- Make sure the database specified in `DATABASE_URL` already exists
- Ensure your database user has appropriate permissions
- Set environment variables **BEFORE** deploying

## Dokploy Configuration

### Build Settings:
1. **Build Type:** Select **"Dockerfile"** (NOT Nixpacks)
2. **Dockerfile Path:** `dockerfile` (default)
3. **Port:** `3000`

### Environment Variables:
Add these in Dokploy's Environment section:
- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXTAUTH_SECRET` - A secure random string for auth
- `NEXTAUTH_URL` - Your application's public URL

## What happens on deployment:

1. Docker builds the production image
2. Prisma client is generated during build
3. Next.js builds the production bundle
4. At runtime: `npm run start` executes:
   - `npx prisma db push` - Syncs schema to database
   - `npx prisma db seed` - Seeds initial data
   - `next start` - Starts the application

## Deployment Steps

1. **Commit and push:**
   ```bash
   git add .
   git commit -m "fix: Configure Prisma 7 for Dokploy deployment"
   git push origin main
   ```

2. **In Dokploy:**
   - Set build type to **Dockerfile**
   - Add all environment variables
   - Click Deploy

## Prisma 7 Notes

This project uses **Prisma 7**, which has important changes:
- ✅ Database URL is configured in `prisma.config.ts`
- ✅ No `url` field in `schema.prisma` datasource block
- ✅ PrismaClient uses the adapter pattern with `@prisma/adapter-pg`

## Troubleshooting

### "DATABASE_URL environment variable is not set"
- **Cause:** Environment variable not configured in Dokploy
- **Fix:** Add DATABASE_URL in Dokploy → Environment section

### "datasource.url property is required"
- **Cause:** DATABASE_URL is empty or undefined at runtime
- **Fix:** Verify the environment variable is set in Dokploy settings

### Database connection errors
- **Cause:** Incorrect DATABASE_URL format or database doesn't exist
- **Fix:** Verify format: `postgresql://user:password@host:port/database`

### Build uses Nixpacks instead of Dockerfile
- **Cause:** Wrong build type selected
- **Fix:** In Dokploy, change build type to "Dockerfile"


