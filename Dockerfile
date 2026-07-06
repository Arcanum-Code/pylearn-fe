# syntax=docker/dockerfile:1
ARG NODE_VERSION=22

# ────────────────────────────────────────────
# Stage 1: base — shared bun + node image
# ────────────────────────────────────────────
FROM node:${NODE_VERSION}-alpine AS base
RUN npm install -g bun

# ────────────────────────────────────────────
# Stage 2: deps — install ALL dependencies
# ────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# ────────────────────────────────────────────
# Stage 3: builder — build the Next.js app
# ────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Pass NEXT_PUBLIC_* build-time variables here:
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# ────────────────────────────────────────────
# Stage 4: runner — minimal production image
# ────────────────────────────────────────────
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy only the standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
