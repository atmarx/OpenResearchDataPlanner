# Multi-Session / Drafts Feature

## Problem

Researchers often need to:
- Plan multiple grants simultaneously
- Compare different service configurations for the same project
- Import a colleague's session to review or fork
- Save work-in-progress without losing previous completed plans

Currently: Single session stored directly in localStorage. Starting over = losing everything.

## Solution

Store named **drafts** in an array, with exactly one being **active** at any time.

---

## Data Model

### Current (Single Session)

```typescript
// localStorage key: 'odp-session'
{
  tier: 'L2',
  grantPeriod: { ... },
  selectedServices: [ ... ],
  // etc.
}
```

### New (Multi-Draft)

```typescript
// localStorage key: 'odp-drafts'
interface DraftStore {
  version: 1,
  activeId: string | null,        // Which draft is currently loaded
  drafts: Draft[]
}

interface Draft {
  id: string,                      // UUID
  name: string,                    // User-provided or auto-generated
  createdAt: string,               // ISO date
  updatedAt: string,               // ISO date

  // Quick preview data (denormalized for list display)
  preview: {
    tier: string | null,
    serviceCount: number,
    estimatedTotal: number | null,
  },

  // The actual session data
  data: SessionState
}
```

### Why an Array?

- Preserves insertion order (useful for "recent" sorting)
- Simple to render as a list
- Easy to find by ID: `drafts.find(d => d.id === id)`
- Keeps things flat (no nested object keys to manage)

---

## Isolation Guarantee

**The golden rule:** Only ONE draft is loaded in the Pinia `sessionStore` at any time.

```
┌─────────────────────────────────────────────────────────────────┐
│                        localStorage                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  odp-drafts                                              │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │   │
│  │  │ Draft A │  │ Draft B │  │ Draft C │  │ Draft D │    │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │   │
│  │       ▲                                                  │   │
│  │       │ activeId points here                            │   │
│  └───────┼─────────────────────────────────────────────────┘   │
└──────────┼─────────────────────────────────────────────────────┘
           │
           │  Load on switch
           ▼
┌─────────────────────┐
│    sessionStore     │  ◄── Only Draft A data is in memory
│   (Pinia - memory)  │
└─────────────────────┘
```

**Switching drafts:**
1. Save current sessionStore → active draft
2. Set new activeId
3. Clear sessionStore completely
4. Load new draft data → sessionStore

This ensures no data leakage. The sessionStore never holds data from multiple drafts.

---

## New Store: `draftsStore`

```typescript
// stores/draftsStore.ts

export const useDraftsStore = defineStore('drafts', {
  state: () => ({
    activeId: null as string | null,
    drafts: [] as Draft[],
  }),

  getters: {
    activeDraft: (state) => state.drafts.find(d => d.id === state.activeId),

    sortedDrafts: (state) =>
      [...state.drafts].sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),

    hasDrafts: (state) => state.drafts.length > 0,
  },

  actions: {
    // Initialize from localStorage (called on app start)
    initialize() {
      const stored = localStorage.getItem('odp-drafts')
      if (stored) {
        const data = JSON.parse(stored)
        this.activeId = data.activeId
        this.drafts = data.drafts
      }
      // Migrate from old single-session format if needed
      this.migrateFromLegacy()
    },

    // Persist to localStorage (called after every change)
    persist() {
      localStorage.setItem('odp-drafts', JSON.stringify({
        version: 1,
        activeId: this.activeId,
        drafts: this.drafts,
      }))
    },

    // Create a new empty draft and make it active
    createDraft(name?: string): string {
      const sessionStore = useSessionStore()

      // Save current draft first
      this.saveActiveDraft()

      const id = crypto.randomUUID()
      const draft: Draft = {
        id,
        name: name || this.generateName(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preview: { tier: null, serviceCount: 0, estimatedTotal: null },
        data: getEmptySessionState(),
      }

      this.drafts.push(draft)
      this.activeId = id

      // Clear sessionStore and load empty state
      sessionStore.$reset()

      this.persist()
      return id
    },

    // Switch to a different draft
    switchToDraft(id: string) {
      if (id === this.activeId) return

      const sessionStore = useSessionStore()
      const targetDraft = this.drafts.find(d => d.id === id)
      if (!targetDraft) throw new Error(`Draft ${id} not found`)

      // Save current draft
      this.saveActiveDraft()

      // Clear and load new
      sessionStore.$reset()
      sessionStore.loadFromData(targetDraft.data)

      this.activeId = id
      this.persist()
    },

    // Save current sessionStore state to active draft
    saveActiveDraft() {
      if (!this.activeId) return

      const sessionStore = useSessionStore()
      const draft = this.drafts.find(d => d.id === this.activeId)
      if (!draft) return

      draft.data = sessionStore.exportData()
      draft.updatedAt = new Date().toISOString()
      draft.preview = {
        tier: sessionStore.tier,
        serviceCount: sessionStore.selectedServices.length,
        estimatedTotal: sessionStore.grandTotal,
      }

      this.persist()
    },

    // Import a session from JSON
    importDraft(json: string, name?: string): string {
      const data = JSON.parse(json)
      // Validate it's a valid session...

      const id = crypto.randomUUID()
      const draft: Draft = {
        id,
        name: name || `Imported ${new Date().toLocaleDateString()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preview: {
          tier: data.tier,
          serviceCount: data.selectedServices?.length || 0,
          estimatedTotal: null, // Recalculate on load
        },
        data,
      }

      this.drafts.push(draft)
      this.persist()
      return id
    },

    // Rename a draft
    renameDraft(id: string, name: string) {
      const draft = this.drafts.find(d => d.id === id)
      if (draft) {
        draft.name = name
        draft.updatedAt = new Date().toISOString()
        this.persist()
      }
    },

    // Delete a draft
    deleteDraft(id: string) {
      const index = this.drafts.findIndex(d => d.id === id)
      if (index === -1) return

      this.drafts.splice(index, 1)

      // If we deleted the active draft, clear active
      if (this.activeId === id) {
        this.activeId = null
        useSessionStore().$reset()
      }

      this.persist()
    },

    // Duplicate a draft
    duplicateDraft(id: string): string {
      const source = this.drafts.find(d => d.id === id)
      if (!source) throw new Error(`Draft ${id} not found`)

      const newId = crypto.randomUUID()
      const duplicate: Draft = {
        ...structuredClone(source),
        id: newId,
        name: `${source.name} (copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      this.drafts.push(duplicate)
      this.persist()
      return newId
    },

    // Generate auto-name like "Draft 1", "Draft 2"
    generateName(): string {
      const existing = this.drafts.filter(d => d.name.startsWith('Draft '))
      const numbers = existing
        .map(d => parseInt(d.name.replace('Draft ', '')))
        .filter(n => !isNaN(n))
      const next = numbers.length ? Math.max(...numbers) + 1 : 1
      return `Draft ${next}`
    },

    // Migrate from old single-session localStorage format
    migrateFromLegacy() {
      const legacy = localStorage.getItem('odp-session')
      if (!legacy || this.drafts.length > 0) return

      try {
        const data = JSON.parse(legacy)
        const id = crypto.randomUUID()

        this.drafts.push({
          id,
          name: 'Migrated Session',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          preview: {
            tier: data.tier,
            serviceCount: data.selectedServices?.length || 0,
            estimatedTotal: null,
          },
          data,
        })

        this.activeId = id
        this.persist()

        // Remove old key
        localStorage.removeItem('odp-session')
      } catch (e) {
        console.warn('Failed to migrate legacy session:', e)
      }
    },
  },
})
```

---

## UI Components

### Welcome Page Changes

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                      OpenResearchDataPlanner                             │
│                                                                  │
│         Plan your research data infrastructure                   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Your Drafts                                          [+New] ││
│  │                                                              ││
│  │  ┌─────────────────────────────────────────────────────────┐││
│  │  │ 📄 NIH R01 Genomics Project                        [⋮] │││
│  │  │    L2 • 5 services • ~$4,200/year                      │││
│  │  │    Last edited: 2 hours ago                            │││
│  │  └─────────────────────────────────────────────────────────┘││
│  │                                                              ││
│  │  ┌─────────────────────────────────────────────────────────┐││
│  │  │ 📄 NSF CAREER - ML Training                        [⋮] │││
│  │  │    L1 • 3 services • ~$8,400/year                      │││
│  │  │    Last edited: Yesterday                               │││
│  │  └─────────────────────────────────────────────────────────┘││
│  │                                                              ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────┐  ┌──────────────────────┐              │
│  │  + Start New Draft  │  │  📥 Import Session   │              │
│  └─────────────────────┘  └──────────────────────┘              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Draft Actions Menu (⋮)

- **Continue** — Switch to this draft and resume editing
- **Rename** — Edit the draft name
- **Duplicate** — Create a copy
- **Export** — Download as JSON
- **Delete** — Remove (with confirmation)

### Active Draft Indicator (Header)

During the wizard, show which draft is active:

```
┌─────────────────────────────────────────────────────────────────┐
│  OpenResearchDataPlanner          [📄 NIH R01 Genomics ▼]    [?] [Exit] │
├─────────────────────────────────────────────────────────────────┤
```

Clicking the dropdown shows:
- Current draft (checked)
- Other drafts (click to switch)
- "Start new draft" option
- "Save & return to drafts" option

---

## Import Session Flow

### Button Placement

Welcome page: **"Import Session"** button

### Import Modal

```
┌─────────────────────────────────────────────────────────────────┐
│  Import Session                                            [✕]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Drop a session file here, or click to browse                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                              ││
│  │                     📄                                       ││
│  │               session.json                                   ││
│  │                                                              ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Or paste session JSON:                                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ { "tier": "L2", "grantPeriod": ...                          ││
│  │                                                              ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Draft name: [Imported Session________________]                 │
│                                                                  │
│  ┌─────────────────────┐  ┌──────────────────────┐              │
│  │       Cancel        │  │   Import & Open      │              │
│  └─────────────────────┘  └──────────────────────┘              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Switching Flow

When user clicks a different draft:

```
┌───────────────────────────────────────────┐
│  Switch to "NSF CAREER"?                  │
│                                           │
│  Your current draft "NIH R01" will be     │
│  automatically saved.                     │
│                                           │
│  ┌─────────────┐  ┌───────────────────┐   │
│  │   Cancel    │  │  Switch Draft     │   │
│  └─────────────┘  └───────────────────┘   │
└───────────────────────────────────────────┘
```

---

## Auto-Save Behavior

Current draft auto-saves on:
- Every step transition
- Every input blur
- Before switching drafts
- Before closing tab (beforeunload)
- Every 30 seconds while active

This ensures users never lose work.

---

## Edge Cases

### No Drafts (First Visit)

- Don't show "Your Drafts" section
- Just show "Get Started" and "Import Session"
- First session creates "Draft 1" automatically

### Delete Active Draft

- Prompt: "Delete 'NIH R01'? This cannot be undone."
- After delete: Return to welcome page, no active draft
- If other drafts exist, show the list
- If no drafts remain, show fresh start state

### Max Drafts?

- For V1: No limit (localStorage is ~5-10MB)
- Future: Could add limit with warning

### Corrupted Data

- If a draft fails to load, show error and offer to delete
- Never crash the whole app due to one bad draft

---

## Migration Strategy

On first load after update:
1. Check for `odp-drafts` key (new format)
2. If exists, use it
3. If not, check for `odp-session` key (old format)
4. If old exists, migrate to new format as "Migrated Session"
5. Remove old key
6. If neither exists, start fresh

---

## Session Store Changes

The `sessionStore` needs minimal changes:

```typescript
// Add to sessionStore

// Export current state as plain object (for saving to draft)
exportData(): SessionState {
  return {
    tier: this.tier,
    grantPeriod: { ...this.grantPeriod },
    selectedServices: [...this.selectedServices],
    // ... all state
  }
}

// Load state from plain object (when switching drafts)
loadFromData(data: SessionState) {
  this.tier = data.tier
  this.grantPeriod = { ...data.grantPeriod }
  this.selectedServices = [...data.selectedServices]
  // ... all state
}

// Remove direct localStorage persistence
// Now handled by draftsStore
```

---

## Config Addition

No config needed for V1 - this is core functionality.

Future config option:
```yaml
# config/meta.yaml
features:
  multi_session: true    # Could disable for simpler deployments
```

---

## Implementation Order

1. **Create draftsStore** with basic CRUD
2. **Migrate sessionStore** to not persist directly
3. **Add Welcome page draft list** UI
4. **Add Import modal**
5. **Add header draft switcher**
6. **Add migration logic** for existing users
7. **Test isolation** exhaustively

---

## Testing Checklist

- [ ] Create new draft
- [ ] Switch between drafts (verify no data leakage)
- [ ] Rename draft
- [ ] Delete draft (active and inactive)
- [ ] Duplicate draft
- [ ] Import session (file and paste)
- [ ] Export session
- [ ] Auto-save on step transition
- [ ] Auto-save on input blur
- [ ] Migration from old format
- [ ] Multiple tabs (verify they don't conflict)
- [ ] Clear all drafts
- [ ] Max localStorage stress test

---

## Open Questions

1. **Compare mode?** — Side-by-side comparison of two drafts on Results page
   - Nice-to-have for V1.1
   - Would show cost differences

2. **Draft templates?** — Pre-configured drafts for common scenarios
   - Could be a bundle-like feature
   - Defer to V1.1

---

## Future: Folder Sync (V1.2)

### The Idea

Let users point to **any folder** where drafts auto-save. They handle sync however they want:

- OneDrive sync folder → syncs via OneDrive
- Dropbox folder → syncs via Dropbox
- Box folder → syncs via Box
- Network share → IT sees it directly
- Local folder → their backup strategy

**We just read/write JSON files. Their existing sync tools handle distribution.**

No OAuth, no cloud APIs, no provider lock-in. Just files in a folder.

### Storage Provider Abstraction

```typescript
interface StorageProvider {
  load(): Promise<DraftStore>
  save(data: DraftStore): Promise<void>
  watch?(callback: (data: DraftStore) => void): void
}

class LocalStorageProvider implements StorageProvider {
  load() { return JSON.parse(localStorage.getItem('odp-drafts')) }
  save(data) { localStorage.setItem('odp-drafts', JSON.stringify(data)) }
}

class FolderProvider implements StorageProvider {
  constructor(private folderPath: string) {}

  async load() {
    // Read all .json files from folder
    // Parse each as a draft
  }

  async save(draft: Draft) {
    // Write: /path/to/folder/nih-r01-genomics.json
  }
}
```

### Initial Setup Flow

```
Settings → Storage Location → [Browse...] → /Users/jane/OneDrive/Research/DataPlanner/
```

That's it. Their IT already has sync policies. We just write files.

### Return Visit Flow

Browser permissions don't always persist across sessions. Rather than surprising users with the browser's permission dialog, we ask first:

```
┌─────────────────────────────────────────────────────────────────┐
│  Resume Folder Sync?                                            │
│                                                                  │
│  Last time, you were syncing drafts to:                        │
│                                                                  │
│  📁 C:\Users\Jane\OneDrive\Research\DataPlanner                │
│                                                                  │
│  Would you like to continue syncing to this folder?            │
│  Your browser may ask you to re-approve access.                │
│                                                                  │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐ │
│  │   Yes, Continue     │  │   No, Use Local Storage Only     │ │
│  └─────────────────────┘  └──────────────────────────────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   Choose a Different Folder...                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**After they click "Yes, Continue":**
- We call `requestPermission()` on the stored handle
- Browser shows its permission prompt (if needed)
- If granted → resume sync, check for external changes
- If denied → graceful fallback to localStorage, no nagging

### Efficient Sync Checking

Once permission is granted, poll for changes efficiently:

```typescript
// Check every 30 seconds - only read first ~200 bytes of each file
async function checkForUpdates(dirHandle: FileSystemDirectoryHandle) {
  for await (const [name, handle] of dirHandle) {
    if (name.endsWith('.json')) {
      const file = await handle.getFile()
      const header = await file.slice(0, 200).text()  // Just sync metadata

      const version = extractVersion(header)
      if (version > ourCachedVersion[name]) {
        showBanner(`"${name}" was modified externally. Reload?`)
      }
    }
  }
}
```

**File format supports this** - put `sync` block first:

```json
{
  "sync": { "version": 42, "modifiedAt": "...", "modifiedBy": "..." },
  "name": "NIH R01 Genomics",
  "data": { ... }
}
```

Cheap header check without parsing the whole file.

### File Structure

```
/Users/jane/OneDrive/Research/DataPlanner/
├── nih-r01-genomics.json
├── nsf-career-ml.json
└── doe-climate-sim.json
```

Each file is a single draft - human-readable JSON, easy to share or debug.

---

## Sync: Conflict Detection

When syncing via folder, multiple devices/people can edit. We need conflict detection.

### Draft Sync Metadata

```typescript
interface DraftSyncMeta {
  version: number,           // Monotonic counter, increments on every save
  modifiedBy: {
    deviceId: string,        // UUID, generated automatically
    deviceName: string,      // Human label: "Jane's Office Laptop"
  },
  modifiedAt: string,        // ISO timestamp
  checksum: string,          // SHA-256 of content
}
```

### Device Labeling

Don't ask for device name upfront. Only prompt on **first export or sync setup**:

```
┌─────────────────────────────────────────────────────────────────┐
│  Name This Device                                               │
│                                                                  │
│  When sharing drafts, this helps identify where edits           │
│  came from.                                                     │
│                                                                  │
│  Device name: [Jane's Office Laptop_______________]             │
│                                                                  │
│  Examples: "Office Desktop", "Home MacBook", "Lab Workstation" │
│                                                                  │
│                                    ┌──────────────────────────┐ │
│                                    │       Continue           │ │
│                                    └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

Store device identity in localStorage:

```typescript
interface DeviceIdentity {
  id: string,           // UUID, generated automatically, never shown
  name: string | null,  // Human label, prompted on first export/sync
}
```

### Conflict Detection Flow

**On App Load:**
1. Read all draft files from folder
2. Compare each file's `sync.version` to our cached version
3. If file is newer → reload it (IT made changes!)
4. If our cache is newer → we're current

**Before Any Edit:**
1. Re-check file's `sync.checksum`
2. If changed since we loaded → STOP
3. Show: "This draft was modified externally. Reload to continue."

**On Save:**
1. Check file's current `sync.version`
2. If version changed since load → CONFLICT
3. If we have latest:
   - Increment version
   - Update modifiedBy to our device
   - Update modifiedAt to now
   - Compute new checksum
   - Write file

### Conflict UI

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️  External Changes Detected                                  │
│                                                                  │
│  This draft was modified by another user or device:             │
│                                                                  │
│  Modified by: IT-Workstation-Jane                               │
│  Modified at: 10 minutes ago                                    │
│                                                                  │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐ │
│  │  Load Their Version │  │  Keep Mine (creates conflict copy)│ │
│  └─────────────────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

This prevents silent overwrites. IT edits something, user opens app, sees "newer version available" before they can change anything.

---

## Future: Backend API (V2)

For institutions wanting centralized management:

```typescript
class BackendProvider implements StorageProvider {
  constructor(private apiUrl: string, private authToken: string) {}

  async load() {
    const response = await fetch(`${this.apiUrl}/drafts`, {
      headers: { Authorization: `Bearer ${this.authToken}` }
    })
    return response.json()
  }

  async save(data) {
    await fetch(`${this.apiUrl}/drafts`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${this.authToken}` },
      body: JSON.stringify(data)
    })
  }
}
```

This enables:
- Admin dashboards
- Usage analytics
- Centralized draft templates
- Cross-user sharing
- Integration with ticketing systems

But requires running a backend service - significant operational overhead. The folder sync approach (V1.2) gets 80% of the benefit with 0% of the infrastructure.

---

## Future: OpenChargeback Integration (V3)

### The Vision

OpenResearchDataPlanner estimates costs **pre-grant**. OpenChargeback tracks actual costs **during-grant**. They integrate via file interchange:

```
┌─────────────────┐    Approved Draft       ┌─────────────────┐
│ OpenResearchDataPlanner │ ──── (JSON file) ────►  │ OpenChargeback  │
│                 │                          │                 │
│ • Estimate costs│                          │ • Track actual  │
│ • Select tiers  │                          │ • Bill/chargeback│
│ • Generate DMP  │                          │ • PDF statements│
└─────────────────┘                          └────────┬────────┘
                                                      │
                                               FOCUS CSV / GL
                                                      │
                                                      ▼
                                                   Banner
                                            (via journal import)
```

### Integration Points

1. **Shared service catalog** — OpenChargeback could import service definitions from OpenResearchDataPlanner's config

2. **Estimate → Project** — Approved draft creates an OpenChargeback project with estimated budget as baseline

3. **Estimate vs Actual** — Dashboard showing: "Estimated $4,200/year, actual $3,800 (9% under)"

4. **File-based handoff** — Drop approved JSON in watched folder → OpenChargeback picks it up

### Design Principles

Following the Unix philosophy for research computing tools:

- **No tight API coupling** — Tools integrate via well-defined file formats
- **Each tool independently useful** — Neither requires the other
- **Human-readable interchange** — JSON/CSV files IT staff can inspect and fix
- **Same tagging patterns** — Consistent identifiers across systems

### Preparing Now

To make V3 integration smooth, V1.x should:

- Keep draft JSON format clean and documented
- Include stable identifiers (service slugs, tier IDs) that OpenChargeback can reference
- Structure estimates in a way that maps to FOCUS billing format
- Document the draft schema for external consumers
