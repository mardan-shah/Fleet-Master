# Use Node.js 22
FROM node:22-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Generate Prisma client and build the app
RUN npx prisma generate
RUN npm run build

# Production image
FROM node:22-alpine AS production
WORKDIR /app

# Copy only needed artifacts from the build stage
COPY --from=base /app/package.json ./
COPY --from=base /app/package-lock.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/prisma.config.ts ./prisma.config.ts
COPY --from=base /app/tsconfig.json ./tsconfig.json
COPY --from=base /app/next.config.ts ./next.config.ts

# Set environment variables
ENV NODE_ENV=production

# Environment variables (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
# MUST be set in Dokploy environment settings

EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
