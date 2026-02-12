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

echo "Building config..."
npm run build:config

echo "Building app..."
npm run build

echo ""
echo "Starting Caddy on port 4000..."
echo ""

# Start Caddy (serves /app/dist via Caddyfile)
exec caddy run --config /etc/caddy/Caddyfile
