# Use Node.js 22
FROM node:22-alpine AS base

WORKDIR /app

# Copy package files first for dependency install caching
COPY package.json package-lock.json ./

# Install dependencies (including dev deps, needed for build)
RUN npm ci

# Copy the rest of the source code
COPY . ./

# Generate Prisma client
RUN npx prisma generate

# Generate Prisma client and build the app
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

ENV NODE_ENV=production
ENV DATABASE_URL="postgres://postgres:uJiIZ3dBbtZvVFS4xy4OVAMyARSCtpUO29QzbdpVNC5lKhC6XPP4xHXFlq8McirV@cqiqcthiovbat5s3onr00kwd:5432/postgres"
ENV NEXTAUTH_SECRET="7df8a9b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6"
ENV NEXTAUTH_URL="https://fleet.fieldwaves.com"

EXPOSE 3000

CMD ["npm", "run", "start"]
