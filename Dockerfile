# Use Node.js 24 (matches Prisma requirement)
FROM node:24-alpine AS base

WORKDIR /app

# Copy package files first for dependency install caching
COPY package.json package-lock.json ./

# Install dependencies (including dev deps, needed for build)
RUN npm ci

# Copy the rest of the source code
COPY . ./

# Generate Prisma client and build the app
RUN npm run build

# Production image
FROM node:24-alpine AS production
WORKDIR /app

# Copy only needed artifacts from the build stage
COPY --from=base /app/package.json ./
COPY --from=base /app/package-lock.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start"]
