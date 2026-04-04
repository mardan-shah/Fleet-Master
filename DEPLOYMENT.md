# Deployment Guide for Dokploy

## Required Environment Variables

Set these in your Dokploy environment configuration:

```
DATABASE_URL=postgresql://user:password@host:5432/database_name
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.com
```

## Deployment Steps

1. **Push code to repository**
   ```bash
   git push origin main
   ```

2. **In Dokploy:**
   - Ensure environment variables are set
   - Deploy using the Dockerfile
   - Port: 3000

## What happens on deployment:

1. Docker builds the image using the multi-stage Dockerfile
2. The entrypoint script checks/creates the database if needed
3. Prisma migrations run via `npx prisma db push`
4. Database seeding occurs via `npx prisma db seed`
5. Next.js application starts on port 3000

## Troubleshooting

- **Database connection issues**: Verify DATABASE_URL is correct
- **Container not starting**: Check Dokploy logs for environment variable issues
- **Migration failures**: Ensure database user has CREATE DATABASE permissions
