# Multi-stage build: Node builds, Caddy serves

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm ci

# Copy source (config will be overwritten at runtime, but needed for default build)
COPY . .

# Build config and app
RUN npm run build:config && npm run build

# Stage 2: Serve
FROM caddy:2-alpine

# Copy built static files
COPY --from=builder /app/dist /srv

# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 4000

# Caddy runs as PID 1
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
