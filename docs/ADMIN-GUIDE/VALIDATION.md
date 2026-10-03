# Validation & Troubleshooting

This guide helps you diagnose and fix configuration errors when `npm run build:config` fails, plus common runtime surprises the validator doesn't catch.

---

## Running Validation

```bash
# Validate only (no build)
npm run validate:config

# Validate and build config.json
npm run build:config
```

Both commands run the same checks. `validate:config` stops after validation; `build:config` also writes `public/config.json` if validation passes.

---

## What the Validator Checks

The build script enforces **referential integrity** between config files — it makes sure every slug you reference actually exists — plus a small set of **compliance-block invariants**: it enum-validates `compliance.baa_status` on mappings and rejects any mapping that lists the `hipaa` framework without an `in_place` (or `not_applicable`) BAA. Outside of that, it does **not** check YAML schema shape — other field types, required fields, and enum values such as `cost_model.type` or `approval` aren't validated. If a required field is missing or a value is malformed, you'll usually see the symptom at runtime in the wizard, not during validation.

| Check | What it catches |
|-------|-----------------|
| File presence | Any of the 16 top-level config files missing from `config/` |
| YAML syntax | Indentation, missing colons, tab/space mixing |
| Service → category | Services that reference a category slug not in `categories.yaml` |
| Service archive_option → service | Archive links that point at a nonexistent service |
| Mapping → service | Mappings for a service that isn't in `services.yaml` |
| Mapping → tier | Mappings for a tier that isn't in `tiers.yaml` |
| Mapping → DMP template | `dmp_template` paths that don't have a matching `.md` file |
| Bundle → service | Bundle items that reference a nonexistent service |
| Bundle → tier | `recommended_tiers` that reference a nonexistent tier |
| Retention → tier | `applies_to_tiers` that reference a nonexistent tier |
| Mapping compliance → baa_status | A `compliance.baa_status` that isn't one of `in_place` / `available` / `not_available` / `not_applicable` |
| Mapping compliance → HIPAA/BAA | A mapping whose `frameworks` includes `hipaa` but whose `baa_status` isn't `in_place` or `not_applicable` |

One compliance check is advisory rather than build-blocking: a `baa_status` of `in_place` with no `baa_reference` emits a non-blocking *warning* (the build still succeeds) so the agreement can be named for auditing.

---

## Common Errors

Load errors (missing file, bad YAML) stop the build at the first bad file. Validation errors are collected and printed together under `Validation errors:`, one `  - ` line each, after all files load.

### Missing Config File

**Error:**
```
  Error loading legal.yaml: Config file not found: /path/to/repo/config/legal.yaml
```

**Cause:** The build loads a fixed list of files (`CONFIG_FILES` in `scripts/build-config.js`): `meta`, `categories`, `tiers`, `tier-questionnaire`, `tier-workflow`, `services`, `mappings`, `bundles`, `retention`, `software`, `acronyms`, `calculators`, `help`, `help-videos`, `legal`, `explainers`. Every one must exist, even if you don't use it.

**Fix:** Restore the file from upstream (or the demo config) rather than deleting it. To effectively disable one, keep a minimal valid version (e.g. `bundles: []`).

---

### YAML Syntax Errors

**Error:**
```
  Error loading services.yaml: bad indentation of a mapping entry (3:3)

 1 | services:
 2 |   - slug: my-service
 3 |   name: "My Service"
-------^
```

**Cause:** Incorrect indentation or missing colons.

**Fix:** YAML requires consistent indentation (2 spaces recommended). Common issues:
- Tabs mixed with spaces
- Inconsistent indentation levels
- Missing colon after a key

```yaml
# Wrong — "name" not aligned under "slug"
services:
  - slug: my-service
  name: "My Service"

# Right
services:
  - slug: my-service
    name: "My Service"
```

---

### Unknown Category

**Error:**
```
Service "hpc-gpu" references unknown category: "gpu-compute"
```

**Cause:** The service's `category` field doesn't match any `slug` in `categories.yaml`.

**Fix:** Check spelling (slugs are case-sensitive) and make sure the category exists:

```yaml
# categories.yaml — verify this slug exists
categories:
  - slug: compute
    name: "Compute"

# services.yaml — must match
services:
  - slug: hpc-gpu
    category: compute
```

---

### Mapping References Unknown Service or Tier

**Error:**
```
Mapping references unknown service: "hpc-gpu"
Mapping references unknown tier: "L3"
```

**Cause:** A `mappings.yaml` entry points at a service or tier slug that doesn't exist.

**Fix:** Most common cause for tier errors is stale slugs from older examples. The current reference uses `low` / `medium` / `high` / `restricted` — not `L1` / `L2` / `L3` / `L4`. Make sure your mapping matches what's actually in `tiers.yaml`:

```yaml
# tiers.yaml
tiers:
  - slug: high          # Use this slug...
    name: "High Risk"

# mappings.yaml
mappings:
  - service: hpc-gpu
    tier: high          # ...here, not "L3"
    approval: consultation
```

For service errors, either add the service to `services.yaml` or fix the typo in the mapping.

---

### Missing DMP Template

**Error:**
```
Mapping "hpc-gpu:high" references missing DMP template: "hpc-gpu/high-risk"
```

**Cause:** A mapping's `dmp_template` points at a Handlebars file that isn't in `config/dmp-templates/`.

**Fix:** Create the template or drop the reference:

```bash
# Create the file (omit .md in the mapping — it's added automatically)
mkdir -p config/dmp-templates/hpc-gpu
touch config/dmp-templates/hpc-gpu/high-risk.md
```

Or remove the line. There's no fallback template: that service simply gets no section in the generated DMP.

```yaml
mappings:
  - service: hpc-gpu
    tier: high
    approval: consultation
    # dmp_template: "hpc-gpu/high-risk"  # Remove if not needed
```

---

### Bundle References Unknown Service

**Error:**
```
Bundle "genomics-complete" references unknown service: "hpc-gpu-v100"
```

**Cause:** A `bundles.yaml` entry lists a `service:` slug that isn't in `services.yaml`.

**Fix:** Fix the slug or add the service:

```yaml
bundles:
  - slug: genomics-complete
    services:
      - service: hpc-gpu       # Must exist in services.yaml
      - service: research-storage
```

---

### Bundle `recommended_tiers` References Unknown Tier

**Error:**
```
Bundle "genomics-complete" references unknown tier in recommended_tiers: "L2"
```

**Cause:** Same as the mapping case — stale tier slug. Use the slugs that are actually in `tiers.yaml`.

---

### Retention Schedule References Unknown Tier

**Error:**
```
Retention schedule "clinical-7yr" references unknown tier: "sensitive"
```

**Cause:** `applies_to_tiers` on a schedule in `retention.yaml` references a tier that isn't defined.

**Fix:** Align the slug with `tiers.yaml`.

---

### Unknown `baa_status`

**Error:**
```
Mapping "aws-compute-high:high" has unknown baa_status "inplace" (expected one of: in_place, available, not_available, not_applicable)
```

**Cause:** A typo in `compliance.baa_status`. The Service Matrix only shows the BAA badge on an exact `in_place`, so a misspelling would silently hide a real agreement. The build catches it instead.

**Fix:** Use one of the four listed values.

---

### HIPAA Without an In-Place BAA

**Error:**
```
Mapping "aws-compute-high:high" lists framework "hipaa" but baa_status is "available" — PHI needs an in-place BAA (or "not_applicable" for on-prem services with no business associate)
```

(`baa_status is "unset"` means the field is missing.)

**Cause:** The mapping claims HIPAA capability, but the BAA is only offered (`available`), unavailable, or unset. PHI processed by a third party requires a signed Business Associate Agreement.

**Fix:** Either set `baa_status: in_place` (and name it in `baa_reference`), use `not_applicable` for on-prem infrastructure with no business associate, or remove `hipaa` from `frameworks`. If your institution covers PHI through a different instrument, widen the allowed set in `validateConfig()` in `scripts/build-config.js` on purpose. Don't just delete the check.

---

### Warning: In-Place BAA Without a Reference

**Output** (build still succeeds):
```
Validation warnings (advisory — not blocking):
  - Mapping "aws-compute-high:high" has baa_status "in_place" but no baa_reference — name the agreement so it can be audited
```

**Fix:** Add `baa_reference: "<agreement name>"` to the mapping's `compliance` block, or ignore it if you track agreements elsewhere.

---

## What the Validator *Doesn't* Catch

The build enforces referential integrity plus the compliance-block invariants noted above — beyond those, these issues slip past validation and surface later:

### Missing or typo'd field names

If you write `namee:` instead of `name:`, the build still passes — you'll just see an empty label in the wizard. Same for `slog:` instead of `slug:`. The app generally renders blanks rather than erroring.

**How to notice:** Walk through the wizard after any config change. If a service shows up unnamed, you've got a field typo.

### Invalid enum values

Fields like `cost_model.type` (supported: `unit`, `tiered`, `consultation`) and `approval` on mappings (`automatic`, `review`, `consultation`) aren't enum-validated. An unknown value won't break the build. An unrecognized `cost_model.type` prices the service at $0, and an unrecognized `approval` is treated as `automatic` in the Service Matrix.

**How to notice:** Cost display looks wrong, or approval flow doesn't match what you intended.

### Duplicate slugs

Two services with the same slug won't fail validation. The second entry silently wins (the build keeps both entries in config.json; the frontend builds a slug→service map at load time, so the last duplicate wins).

**How to notice:** One of your services seems to be missing from the wizard, or shows the wrong pricing.

### Comparison feature mismatches

The current schema for `comparison_features` on a service expects `full` / `partial` / `none` values (bare, or as `{ value, detail }`). Other strings don't error. They render the same empty marker as `none`.

### Circular bundle references

Bundles should only reference services, never other bundles. The validator doesn't enforce this; nesting bundles won't break the build but also isn't supported.

### Tier semantics and slugs

- `consultation_required: true` on a tier ends the wizard at a consultation step: researchers on that tier never reach service selection, so any mappings for it are unreachable in the wizard.
- The tier questionnaire ranks only `low`, `medium`, `high`, and `restricted`. A `sets_tier` naming any other slug is ignored.
- A retention schedule with no `applies_to_tiers` passes validation but breaks the retention step.
- `legal.yaml` `tier_notices` and `help.yaml` `contextual_help` are looked up by key (tier slug / wizard step id). Wrong keys just mean nothing shows.

### Ghost fields

Older examples in the wild may show fields like `available_tiers` (on services), `self_service`, `show_workflow_modal`, `security_review_required`, `default_tier`, or service-level `compliance`. These are legacy no-ops — the app doesn't read them. They won't error, they just don't do anything. If you see them in your config, they're safe to delete. The current reference config (`config/` in the repo) shows which fields are actually wired up.

---

## Troubleshooting Checklist

When validation fails:

1. **Read the error message** — it names the file, the offending slug, and what's missing.
2. **Check slug spelling** — slugs are case-sensitive and have to match exactly.
3. **Verify the referenced item exists** — open the target YAML and confirm the slug is there.
4. **Validate incrementally** — if you're adding many items, add one at a time so errors are easy to attribute.

When the build passes but the wizard looks wrong:

1. **Walk through the wizard manually** — missing names, misrouted approvals, and duplicate-slug shadowing all show up here.
2. **Check the browser console** for runtime warnings.
3. **Compare against `config/` in the repo** — the reference config is the source of truth for which fields are wired up.

---

## YAML Tips

### Use a Linter

Install a YAML extension in your editor (VS Code, vim, etc.) for real-time syntax checking. It'll catch indentation and colon issues before you run the build.

### Quote Strings with Special Characters

```yaml
# Might cause issues — unquoted colon
description: Price: $10/month

# Safe
description: "Price: $10/month"
```

### Multi-line Strings

```yaml
# Literal block (preserves newlines)
long_description: |
  This is line one.
  This is line two.

# Folded block (joins lines with spaces)
long_description: >
  This will all be
  on one line.
```

### Comments

```yaml
# This is a comment
slug: my-service  # Inline comment
```

---

## Getting Help

If you're stuck:

1. Check [CUSTOMIZE.md](./CUSTOMIZE.md) for field-by-field schema documentation.
2. Look at [examples/minimal-config/](./examples/minimal-config/) for a minimal working reference.
3. Compare your config to `config/` in the repo root — that's the live Northwinds reference.
4. Open a GitHub issue with:
   - The full error message
   - The relevant YAML section
   - What you were trying to do
