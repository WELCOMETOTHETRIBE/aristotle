# Use Node.js 18 Debian for better Prisma compatibility
FROM node:18 AS base

# Install dependencies only when needed
FROM base AS deps
# Install OpenSSL for Prisma compatibility and verify installation
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN openssl version && which openssl
WORKDIR /app

# Copy package files and Prisma schema
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Install dependencies (using npm install instead of npm ci for better compatibility)
RUN npm install --production=false

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set dummy DATABASE_URL for build-time Prisma client generation
ENV DATABASE_URL="file:./dummy.db"

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
# Install OpenSSL in production image for Prisma compatibility
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/data ./data
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/test-server.js ./test-server.js

# Create prisma directory and set proper permissions
RUN mkdir -p ./prisma && chown -R nextjs:nodejs ./prisma

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy the full application for standard Next.js startup
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 8080

ENV PORT 8080
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production

# Use Next.js with proper port binding
CMD ["sh", "-c", "node scripts/init-database.js && PORT=8080 HOSTNAME=0.0.0.0 npm start"] 