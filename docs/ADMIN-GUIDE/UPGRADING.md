# Upgrading Guide

How to safely pull upstream changes and migrate between schema versions.

---

## Schema Versioning

OpenResearchDataPlanner uses semantic versioning for configuration schemas:

```yaml
# config/meta.yaml
schema_version: "1.0"
```

- **Major version** (1.x → 2.x): Breaking changes, migration required
- **Minor version** (1.0 → 1.1): New optional features, backwards compatible

The build process warns if your schema version is outdated or unrecognized.

---

## Checking for Updates

### 1. Add Upstream as Remote

If you haven't already:

```bash
git remote add upstream https://github.com/ORIGINAL-ORG/OpenResearchDataPlanner.git
git fetch upstream
```

### 2. View Upstream Changes

```bash
# See what's new
git log upstream/main --oneline -20

# See changes to config schema
git diff HEAD..upstream/main -- config/

# See changes to docs
git diff HEAD..upstream/main -- docs/
```

### 3. Check the Changelog

Review `CHANGELOG.md` for breaking changes and migration notes.

---

## Safe Upgrade Process

### Before You Start

1. **Commit your changes** - Ensure your working tree is clean
2. **Back up your config** - Copy `config/` somewhere safe
3. **Note your schema version** - Check `config/meta.yaml`

### Step 1: Create an Upgrade Branch

```bash
git checkout -b upgrade-to-vX.Y
```

### Step 2: Merge Upstream

```bash
git fetch upstream
git merge upstream/main
```

### Step 3: Resolve Conflicts

Git will flag conflicts. Common conflict locations:

- `config/*.yaml` - Your customizations vs. schema changes
- `package.json` - Dependency updates
- `src/` - If you modified core components

For config conflicts, prefer **your content** but adopt **new schema structure**.

### Step 4: Validate

```bash
npm install
npm run validate:config
```

Fix any validation errors (see [VALIDATION.md](./VALIDATION.md)).

### Step 5: Test

```bash
npm run dev
```

Walk through the wizard manually. Verify:
- Your services appear correctly
- Cost calculations work
- DMP generation includes your templates
- Bundles load properly

### Step 6: Merge to Main

```bash
git checkout main
git merge upgrade-to-vX.Y
```

---

## Version Migration Guide

### 1.0 → 1.1

**New Features (optional):**
- `schema_version` field in `meta.yaml`
- `comparison_features` value semantics (`full`/`partial`/`none`)
- Software catalog with license status

**To adopt:**

1. Add schema version to `meta.yaml`:
   ```yaml
   schema_version: "1.1"
   ```

2. Update comparison features to use new value format:
   ```yaml
   # Old (still works)
   comparison_features:
     gpu_available: true

   # New (recommended)
   comparison_features:
     gpu_available:
       value: full
       detail: "NVIDIA V100"
   ```

**No migration required** - 1.0 configs work with 1.1.

---

### Future Versions

This section will be updated with migration instructions for each release.

Check the [CHANGELOG.md](../../CHANGELOG.md) for version-specific notes.

---

## Handling Breaking Changes

When a major version introduces breaking changes:

### 1. Read the Migration Guide

Each major version will have specific migration instructions in this file.

### 2. Use the Migration Script (if provided)

```bash
# Example (future versions may provide this)
npm run migrate:config -- --from 1.0 --to 2.0
```

### 3. Manual Migration

For complex changes, you may need to:

1. Export your current config as reference
2. Start from the new version's example config
3. Manually transfer your customizations
4. Validate and test thoroughly

---

## Preserving Customizations

### Files You've Modified

Keep a list of files you've customized beyond basic configuration:

```
CUSTOMIZATIONS.md
----------------
- src/components/wizard/CustomStep.vue (added custom step)
- src/assets/logo.svg (institution logo)
- config/dmp-templates/custom/ (custom DMP templates)
```

Review these during upgrades for conflicts.

### Local Overrides Pattern

For significant component customizations, consider:

```
src/
├── components/
│   └── wizard/
│       ├── TierSelectStep.vue       # Upstream
│       └── TierSelectStep.local.vue # Your override
```

Then in your local code, import from `.local.vue` files when present.

---

## Pinning to a Version

If you need stability over new features:

```bash
# Tag your known-good state
git tag v1.0-stable

# Later, return to it
git checkout v1.0-stable
```

However, we recommend staying reasonably current for:
- Security updates
- Bug fixes
- Community support

---

## Getting Help with Upgrades

If you encounter upgrade issues:

1. Check [VALIDATION.md](./VALIDATION.md) for error solutions
2. Review the [CHANGELOG.md](../../CHANGELOG.md) for breaking changes
3. Open a GitHub issue with:
   - Your current version
   - Target version
   - Error messages
   - Your config structure (sanitized)

---

## Changelog

See [CHANGELOG.md](../../CHANGELOG.md) for the full release history.

### Recent Versions

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2024-01-15 | Initial release |

<!-- Future versions will be added here -->
