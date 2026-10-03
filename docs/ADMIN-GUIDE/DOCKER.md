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

## config-local Structure

Because `config-local/` is mounted over `/app/config`, it must contain **every** file the build loads — a missing YAML file fails the build with `Config file not found` and the container exits. Copy the whole `config/` tree (step 2 above) and edit from there.

```
config-local/
├── meta.yaml              # Institution name, contacts, branding
├── services.yaml          # Your services and pricing
├── tiers.yaml             # Tier definitions
├── categories.yaml        # Service categories
├── mappings.yaml          # Tier-to-service matrix
├── bundles.yaml           # Pre-configured bundles
├── help.yaml              # Support contacts
├── help-videos.yaml       # Embedded help videos
├── acronyms.yaml          # Terminology (usually keep default)
├── calculators.yaml       # Calculator config (usually keep default)
├── tier-questionnaire.yaml
├── tier-workflow.yaml
├── retention.yaml
├── software.yaml
├── legal.yaml             # Disclaimer / no-warranty boilerplate
├── explainers.yaml        # Explainer content
├── dmp-templates/         # Per-service Handlebars-templated Markdown for DMP output
│   └── <service-slug>/
│       └── <variant>.md    # e.g. default.md, high.md (build reads only .md; .hbs files here are ignored)
├── export-templates/      # *.md.hbs export templates (slate-export.md.hbs)
├── ai-guidance/           # AI guidance applet configs (optional dir)
├── clinical/              # Clinical guidance applet configs (optional dir)
├── images/                # Branding (optional) — copied to /images/ at startup
│   ├── logo.png
│   └── favicon.ico
└── css/                   # Custom styles (optional)
    └── custom.css         # → loaded as /custom/custom.css
```

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
│    └─ Serve on :3000 (host :4000)       │
└─────────────────────────────────────────┘

Development (docker-compose.dev.yml):
┌─────────────────────────────────────────┐
│  Single stage with runtime build         │
│                                          │
│  node:20-alpine + caddy                 │
│    └─ Mount ./config-local → /app/config│
│    └─ Build at startup                  │
│    └─ Serve on :3000 (host :4000)       │
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
     - `links` is a list of `{ label, url }` footer links — remove an entry (or leave its `url` blank) to hide it
   - `services.yaml` — Your actual services and pricing
   - `tiers.yaml` — Your tier names (if different)
   - `help.yaml` — Your support contacts

4. **Add your branding** (optional):
   ```bash
   mkdir -p config-local/images
   cp your-logo.png config-local/images/logo.png
   cp your-favicon.ico config-local/images/favicon.ico
   ```

   The dev entrypoint copies `config-local/images/*` into `/images/`, so point `meta.yaml` at the files you added — nothing is picked up by filename alone:
   ```yaml
   institution:
     logo: "/images/logo.png"          # Header logo
     footer_logo: "/images/logo.png"   # Footer crest (optional; falls back to logo)
   ```
   `images/favicon.ico` is the one exception — it's also copied to `/favicon.ico` and used automatically.

5. **Add custom CSS** (optional):
   ```bash
   mkdir -p config-local/css
   cat > config-local/css/custom.css << 'EOF'
   :root {
     --color-primary: #1a365d;
     --color-accent: #c53030;
   }
   EOF
   ```

   Then in `config-local/meta.yaml`:
   ```yaml
   branding:
     custom_css_url: "/custom/custom.css"
   ```

   Or use inline CSS directly in meta.yaml:
   ```yaml
   branding:
     custom_css: |
       :root {
         --color-primary: #1a365d;
       }
   ```

6. **Run with dev compose** (for testing):
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

7. **Once stable**, bake config into production image. The production build only reads YAML and templates from `config/` — it does not process `config/images/` or `config/css/`, so move those into `public/` yourself:
   ```bash
   cp -r config-local/* config/
   cp -r config-local/images/* public/images/      # if you added images
   mkdir -p public/custom && cp -r config-local/css/* public/custom/   # if you added CSS
   rm -rf config/images config/css
   docker-compose up --build -d
   ```

---

## Behind a Reverse Proxy

If running behind nginx/Caddy/Traefik:

```yaml
# docker-compose.override.yml
# Compose *concatenates* port lists across files, so use !override
# (Compose v2.24+) to replace the base "4000:3000" mapping instead of adding to it.
services:
  planner:
    ports: !override
      - "127.0.0.1:4000:3000"  # Only localhost
  feedback-api:
    ports: !override
      - "127.0.0.1:4001:4001"  # Caddy inside the planner container already proxies /api/*
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

The planner container takes none. The `feedback-api` service (started by both compose files) reads:

| Variable | Default (docker-compose.yml) | Description |
|----------|------------------------------|-------------|
| `FEEDBACK_API_KEY_WRITE` → `API_KEY_WRITE` | `changeme-write` | Key the browser sends when submitting feedback. Must match `feedback.api_key` in `meta.yaml`. |
| `FEEDBACK_API_KEY_ADMIN` → `API_KEY_ADMIN` | `changeme-admin` | Admin key for reading feedback stats (IT Workbench). |
| `CORS_ORIGIN` | `http://localhost:4000` | Allowed browser origin. |
| `PORT` / `DB_PATH` | `4001` / `/app/data/feedback.db` | Set in the compose file; data persists in the `feedback-data` volume. |

Set the keys in a `.env` file next to `docker-compose.yml` — and change both from the defaults before going live. `docker-compose.dev.yml` hard-codes `dev-write-key` / `dev-admin-key` instead. If you don't want feedback collection, set `feedback.enabled: false` in `meta.yaml` and remove the `feedback-api` service.

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
  - "4001:3000"
```
