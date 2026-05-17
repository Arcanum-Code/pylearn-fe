---
name: nextjs-dockerfile
description: Generates a production-ready Dockerfile for a Next.js project using pnpm, standalone output mode, and self-hosted VPS deployment. Use when the user asks to "generate a Dockerfile", "dockerize the project", "create a Dockerfile for Next.js", or "set up Docker for production". Also triggers when the user wants to containerize or deploy the Next.js app to a VPS.
user-invocable: true
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
---

# Next.js Dockerfile Generator

Generate a production-ready, multi-stage Dockerfile optimized for Next.js standalone output, pnpm, and self-hosted VPS deployment.

---

## Prerequisites

Before generating, verify the project is configured correctly.

### 1. Check `next.config` for standalone output

The Dockerfile relies on Next.js standalone mode. Confirm `next.config.js` (or `.ts`) contains:

```js
output: "standalone";
```

If it's missing, add it before generating the Dockerfile and inform the user.

### 2. Check Node version

```bash
# Read from .nvmrc, .node-version, or engines field in package.json
cat .nvmrc 2>/dev/null || cat .node-version 2>/dev/null || node -v
```

Use the detected version in the `FROM` base image. Default to `node:20-alpine` if none is found.

### 3. Check for `.env` usage

```bash
ls .env* 2>/dev/null
```

- Never copy `.env` or `.env.local` into the image — these contain secrets.
- Environment variables must be injected at **runtime** via `docker run --env-file` or the VPS's environment config.
- If the project uses `NEXT_PUBLIC_*` variables, warn the user: these are baked in at **build time** and must be passed as `--build-arg` / `ARG` in the Dockerfile.

---

## Dockerfile Template

```dockerfile
# syntax=docker/dockerfile:1
ARG NODE_VERSION=20

# ────────────────────────────────────────────
# Stage 1: base — shared pnpm + node image
# ────────────────────────────────────────────
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ────────────────────────────────────────────
# Stage 2: deps — install ALL dependencies
# ────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ────────────────────────────────────────────
# Stage 3: builder — build the Next.js app
# ────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Pass NEXT_PUBLIC_* build-time variables here if needed:
# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

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
```

---

## `.dockerignore` Template

Always write a `.dockerignore` alongside the Dockerfile to keep the build context lean:

```
.git
.gitignore
.env
.env.*
node_modules
.next
README.md
*.log
Dockerfile
.dockerignore
```

---

## Process

### 1. Gather project info

- Detect Node version (see Prerequisites)
- Check for `NEXT_PUBLIC_*` variables in `.env.example` or source files
- Confirm `output: 'standalone'` is set in `next.config`

### 2. Write the files

- Write `Dockerfile` at project root using the template above, substituting the correct `NODE_VERSION`
- Write `.dockerignore` at project root
- Use the Write or Edit tool — do not output files as code blocks in the conversation

### 3. Inform the user

After writing, tell the user:

**Build the image:**

```bash
docker build -t my-app .
```

**Run the container (inject env vars at runtime):**

```bash
docker run -p 3000:3000 --env-file .env.production my-app
```

**If `NEXT_PUBLIC_*` vars are needed at build time:**

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.example.com -t my-app .
```

Also remind them:

- Never commit `.env` files to the image or the repo
- The standalone output copies only the necessary files — `node_modules` inside `.next/standalone` is already trimmed by Next.js

---

## Git Safety

- NEVER read or copy `.env`, `.env.local`, or `.env.production` into the Dockerfile
- NEVER stage `.env*` files — they must stay out of the image and version control
