#!/bin/sh
set -e

echo "=== OpenResearchDataPlanner ==="
echo ""

# Check if config exists
if [ ! -f /app/config/meta.yaml ]; then
    echo "ERROR: No config found at /app/config/"
    echo "Mount your config directory with -v ./config-local:/app/config"
    exit 1
fi

# Copy institution images if they exist
if [ -d /app/config/images ]; then
    echo "Copying institution images..."
    cp -r /app/config/images/* /app/public/images/ 2>/dev/null || true
fi

# Copy favicon if it exists
if [ -f /app/config/images/favicon.ico ]; then
    cp /app/config/images/favicon.ico /app/public/favicon.ico
fi

# Copy custom CSS if it exists
if [ -d /app/config/css ]; then
    echo "Copying custom CSS..."
    mkdir -p /app/public/custom
    cp -r /app/config/css/* /app/public/custom/ 2>/dev/null || true
fi

echo "Building config..."
npm run build:config

echo "Building app..."
npm run build

echo ""
echo "Starting Caddy on port 4000..."
echo ""

# Start Caddy (serves /app/dist via Caddyfile)
exec caddy run --config /etc/caddy/Caddyfile
