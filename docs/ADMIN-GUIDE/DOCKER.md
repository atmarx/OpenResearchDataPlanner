# Docker Deployment Guide

Two deployment options depending on your needs.

---

## Option 1: Production (config baked into image)

Best for: Stable deployments where config doesn't change often.

```bash
# 1. Edit config files directly in config/
#    (or copy your institution's config there)

# 2. Build and run
docker-compose up --build -d

# 3. Access at http://localhost:4000
```

Config changes require rebuild:
```bash
docker-compose up --build -d
```

---

## Option 2: Development (config mounted as volume)

Best for: Testing, iterating on config, pilot deployments.

```bash
# 1. Create your config directory
mkdir -p config-local
cp -r config/* config-local/

# 2. Edit config-local/ with your institution's info
#    - meta.yaml (institution name, contacts)
#    - services.yaml (your services)
#    - tiers.yaml (your tier definitions)
#    - etc.

# 3. Run with mounted config
docker-compose -f docker-compose.dev.yml up --build -d

# 4. Access at http://localhost:4000
```

Config changes require container restart:
```bash
docker-compose -f docker-compose.dev.yml restart
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start (production) | `docker-compose up -d` |
| Start (dev) | `docker-compose -f docker-compose.dev.yml up -d` |
| Rebuild after config change | `docker-compose up --build -d` |
| View logs | `docker-compose logs -f` |
| Stop | `docker-compose down` |
| Health check | `curl http://localhost:4000/health` |

---

## Architecture

```
Production (docker-compose.yml):
┌─────────────────────────────────────────┐
│  Multi-stage build                       │
│                                          │
│  Stage 1: node:20-alpine                │
│    └─ npm ci && build:config && build   │
│                                          │
│  Stage 2: caddy:2-alpine                │
│    └─ Copy /dist → /srv                 │
│    └─ Serve on :4000                    │
└─────────────────────────────────────────┘

Development (docker-compose.dev.yml):
┌─────────────────────────────────────────┐
│  Single stage with runtime build         │
│                                          │
│  node:20-alpine + caddy                 │
│    └─ Mount ./config-local → /app/config│
│    └─ Build at startup                  │
│    └─ Serve on :4000                    │
└─────────────────────────────────────────┘
```

---

## For Other Universities

If you're deploying for a different institution:

1. **Clone the repo** (or use the Docker image)
2. **Create config-local/**:
   ```bash
   mkdir config-local
   cp -r config/* config-local/
   ```

3. **Edit these files minimum**:
   - `meta.yaml` — Institution name, logo, contacts
   - `services.yaml` — Your actual services and pricing
   - `tiers.yaml` — Your tier names (if different)
   - `help.yaml` — Your support contacts

4. **Run with dev compose** (for testing):
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

5. **Once stable**, bake config into production image:
   ```bash
   cp -r config-local/* config/
   docker-compose up --build -d
   ```

---

## Behind a Reverse Proxy

If running behind nginx/Caddy/Traefik:

```yaml
# docker-compose.override.yml
services:
  planner:
    ports:
      - "127.0.0.1:4000:4000"  # Only localhost
```

Then proxy from your frontend:

```nginx
# nginx
location / {
    proxy_pass http://127.0.0.1:4000;
}
```

```
# Caddyfile
example.edu {
    reverse_proxy localhost:4000
}
```

---

## Environment Variables

Currently none required. Future versions may support:

| Variable | Description |
|----------|-------------|
| `CONFIG_DIR` | Override config directory location |
| `PORT` | Override port (default 4000) |

---

## Troubleshooting

**Container exits immediately**
```bash
docker-compose logs planner-dev
```
Usually means config is missing or invalid.

**Config not updating**
Dev mode requires restart after config changes:
```bash
docker-compose -f docker-compose.dev.yml restart
```

**Port already in use**
```bash
# Change the port mapping
ports:
  - "4001:4000"
```
