# Validation & Troubleshooting

This guide helps you diagnose and fix configuration errors when `npm run build:config` fails.

---

## Running Validation

```bash
# Validate only (no build)
npm run validate:config

# Validate and build
npm run build:config
```

Validation output shows errors with file locations and suggestions.

---

## Common Errors

### YAML Syntax Errors

**Error:**
```
YAMLException: bad indentation of a mapping entry at line 15, column 3
```

**Cause:** Incorrect indentation or missing colons.

**Fix:** Check the line number. YAML requires consistent indentation (2 spaces recommended). Common issues:
- Tabs instead of spaces
- Inconsistent indentation levels
- Missing colon after key names

```yaml
# Wrong
services:
  - slug: my-service
  name: "My Service"    # Missing proper indentation

# Right
services:
  - slug: my-service
    name: "My Service"  # Aligned under slug
```

---

### Missing Required Fields

**Error:**
```
ValidationError: services[0] missing required field 'slug'
```

**Cause:** A service (or tier, bundle, etc.) is missing a required field.

**Required fields by type:**

| Type | Required Fields |
|------|-----------------|
| Service | `slug`, `name`, `category`, `available_tiers` |
| Tier | `slug`, `name`, `description` |
| Bundle | `slug`, `name`, `services` |
| Category | `slug`, `name` |

**Fix:** Add the missing field:

```yaml
services:
  - slug: hpc-compute        # Required
    name: "HPC Compute"      # Required
    category: compute        # Required
    available_tiers:         # Required
      - public
      - internal
    # ... rest of service
```

---

### Invalid Reference

**Error:**
```
ValidationError: Service 'hpc-gpu' references unknown category 'gpu-compute'
```

**Cause:** A service, bundle, or mapping references something that doesn't exist.

**Common reference errors:**
- Service references non-existent category
- Bundle references non-existent service slug
- Mapping references non-existent tier slug
- Service references non-existent DMP template

**Fix:** Check spelling and ensure the referenced item exists:

```yaml
# In categories.yaml, verify this exists:
categories:
  - slug: compute        # This must match...
    name: "Compute"

# In services.yaml:
services:
  - slug: hpc-gpu
    category: compute    # ...this reference
```

---

### Comparison Feature Mismatch

**Error:**
```
ValidationError: Service 'hpc-gpu' has comparison_feature 'quantum_support'
not defined in category 'compute'
```

**Cause:** A service declares a comparison feature that isn't defined in its category.

**Fix:** Either add the feature to the category or remove it from the service:

```yaml
# Option 1: Add to category (categories.yaml)
categories:
  - slug: compute
    comparison_features:
      - key: quantum_support        # Add this
        label: "Quantum Support"

# Option 2: Remove from service (services.yaml)
services:
  - slug: hpc-gpu
    comparison_features:
      gpu_available:               # Keep valid features
        value: full
      # quantum_support: ...       # Remove invalid feature
```

---

### Invalid comparison_features Value

**Error:**
```
ValidationError: Service 'research-storage' comparison_feature 'snapshots'
has invalid value 'yes'. Must be 'full', 'partial', or 'none'.
```

**Cause:** Comparison feature values must be one of three specific strings.

**Valid values:**
- `full` - Feature fully available
- `partial` - Feature available with limitations (add `detail` to explain)
- `none` - Feature not available

**Fix:**
```yaml
comparison_features:
  snapshots:
    value: full              # Not "yes", "true", or "available"
    detail: "Daily, 30-day retention"
```

---

### Duplicate Slugs

**Error:**
```
ValidationError: Duplicate service slug 'hpc-compute' found
```

**Cause:** Two items of the same type have the same slug.

**Fix:** Slugs must be unique within their type. Rename one:

```yaml
services:
  - slug: hpc-compute-cpu    # Changed from hpc-compute
    name: "HPC CPU Compute"

  - slug: hpc-compute-gpu    # Changed from hpc-compute
    name: "HPC GPU Compute"
```

---

### Invalid Cost Model

**Error:**
```
ValidationError: Service 'cloud-aws' has cost_model type 'variable'
which is not a valid type
```

**Valid cost model types:**
- `free` - No cost
- `unit` - Per-unit pricing (e.g., $0.05/SU)
- `tiered` - Volume-based pricing tiers
- `subscription` - Fixed options (e.g., VM sizes)
- `consultation` - Price varies, requires quote
- `passthrough` - External billing (e.g., cloud provider)

**Fix:**
```yaml
cost_model:
  type: passthrough          # Use a valid type
  notes: "AWS pricing + 5% admin fee"
```

---

### Missing DMP Template

**Error:**
```
ValidationError: Mapping for service 'cloud-hipaa' tier 'L3' references
DMP template 'compute/cloud-hipaa' which does not exist
```

**Cause:** A mapping specifies a DMP template file that doesn't exist.

**Fix:** Create the template or update the reference:

```bash
# Create the missing template
mkdir -p config/dmp-templates/compute
touch config/dmp-templates/compute/cloud-hipaa.md
```

Or remove the template reference to use the default:

```yaml
mappings:
  - service: cloud-hipaa
    tier: L3
    approval: automatic
    # dmp_template: "compute/cloud-hipaa"  # Remove if not needed
```

---

### Circular Bundle Reference

**Error:**
```
ValidationError: Circular reference detected in bundle 'genomics-complete':
genomics-complete -> ml-bundle -> genomics-complete
```

**Cause:** Bundles that include other bundles create a loop.

**Fix:** Remove the circular reference. Bundles should only include services, not other bundles:

```yaml
bundles:
  - slug: genomics-complete
    services:
      - service: hpc-gpu           # Services only
      - service: research-storage
      # - bundle: ml-bundle        # Don't include bundles
```

---

## Troubleshooting Checklist

When validation fails:

1. **Read the error message carefully** - it usually tells you the file, line, and problem
2. **Check YAML syntax** - use a YAML linter or online validator
3. **Verify references exist** - slugs must match exactly (case-sensitive)
4. **Check required fields** - see table above
5. **Validate incrementally** - if adding many items, add one at a time

---

## YAML Tips

### Use a Linter

Install a YAML extension in your editor (VS Code, vim, etc.) for real-time syntax checking.

### Quote Strings with Special Characters

```yaml
# Might cause issues
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

# Folded block (joins lines)
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

1. Check [CUSTOMIZE.md](./CUSTOMIZE.md) for the full schema documentation
2. Look at [examples/minimal-config/](./examples/minimal-config/) for a working reference
3. Open a GitHub issue with:
   - The full error message
   - The relevant YAML section
   - What you were trying to do
