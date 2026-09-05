# POST-V1 ICON-001 Runtime Integration Readiness Audit

**Date:** 2026-09-05  
**Slice:** ICON-001 — Runtime Integration Readiness & Contract  
**Mode:** Read-only audit / integration planning  
**Commit policy:** DO NOT COMMIT (per prompt §20)

---

## A. Executive Summary

Wood recertification passes. All nine ICON-001 source PNGs share the 1254×1254 RGBA production contract. The repository already provides a visual asset registry, loader, sync tool, and `PGVisualAssetImage` — no parallel asset system is required.

The smallest correct first runtime slice is **site inventory resource rows** in `PGInventoryWidget` (operations dashboard), with a **presentation-layer-only** addition of `resourceId` to inventory view data (API already provides it). Production, transport, and recipe surfaces should be deferred — they do not expose canonical resource IDs in row models today.

Runtime derivatives should follow existing MM-* conventions (PNG + WebP via sync), but **must add a resize step** for icons because the current sync tool copies full-resolution sources. Target CSS display size is **`var(--icon-lg)` (1.5rem ≈ 24px)** per design tokens and row geometry; **48px derivative at 2× DPR** — derived from layout evidence, not preset examples.

Recommend a thin **`ResourceIcon`** wrapper mapping `resourceId` → registry asset ID, delegating to `PGVisualAssetImage` with decorative accessibility semantics.

**Decision:** OPTION A — READY FOR SMALL RUNTIME INTEGRATION SLICE

---

## B. Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD | `cdb5a66b21f44fb3517690cde45ca11210fada5c` |
| Mode | Read-only audit (no runtime integration implemented) |
| Source assets | `docs/design/icons/ICON-001_*.png` (9 certified) |

---

## C. V1 Integrity

| Tag | Expected | Verified |
|-----|----------|----------|
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` | ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` | ✓ |

Tags not moved.

---

## D. Wood Recertification

| Check | Result |
|-------|--------|
| Path | `docs/design/icons/ICON-001_Wood.png` |
| Dimensions | **1254×1254** |
| Mode | **RGBA** |
| Transparency | Corners `(0,0,0,0)`; edge-connected background removed |
| Decode | PASS (Pillow) |
| File size | 1,566,660 bytes (~1.50 MB) |
| SHA-256 | `73ae60f5391c0ca6e70528d8b4cfdb95e8b28369695c7b654e8971dd661b4b7c` |
| Filename | `ICON-001_Wood.png` (unchanged) |
| Resource identity | `wood` (unchanged) |

**Comparison with other eight:** All nine now match — 1254×1254 RGBA, transparent corners, unique hashes, canonical filenames.

---

## E. ICON-001 Source Family Status

**SOURCE_ASSET_FAMILY_CERTIFIED = YES**

**ICON-001 SOURCE ASSET PRODUCTION = COMPLETE**

No artwork modifications required or performed in this audit.

---

## F. Existing Runtime Asset Architecture

| Layer | Location | Role |
|-------|----------|------|
| Design archive | `docs/design/icons/` | Authoritative PNG source (1254×1254) |
| Sync tool | `tools/sync-runtime-visual-assets.ts` | Copy design → `apps/web/public/assets/` + WebP |
| Runtime static | `apps/web/public/assets/` | Browser-served files (MM-*, CH-010 today) |
| Registry | `visual-asset-registry.ts` | Asset IDs, paths, preload, WebP paths |
| Loader | `visual-asset-loader.ts` | URL resolution, WebP preference, preload |
| Image primitive | `PGVisualAssetImage` | `<picture>` / `<img>` from registry ID |
| Background primitive | `PGVisualAssetBackground` | CSS background-image (not applicable to icons) |
| Navigation icons | `DashboardIcon.tsx` | Inline SVG outlines — separate from resource art |

**Pattern for runtime PNGs:** `runtimePng()` entries with `path: '/assets/<dir>/<id>.png'`, `webp: '/assets/<dir>/<id>.webp'`, loader prefers WebP when supported.

**Gap:** ICON-001 not registered; no `public/assets/icons/` directory yet; sync tool reads from `docs/design/Bilder/einzelne_bilder/hochgeladen` only.

---

## G. Runtime Resource Surface Inventory

| Surface | Component | Resource ID available? | Current representation | Candidate for ICON-001? | Priority |
|---------|-----------|---------------------|------------------------|-------------------------|----------|
| Site inventory table | `PGInventoryWidget` → `PGOperationsTable` | **No** in view data (API has it) | Text label in column 1 | **Yes** — best semantic fit | **P1** |
| Warehouse detail rows | `PGInventoryWidget` (per-building blocks) | **No** in view data | Text label | Yes — same widget, second pass | P2 |
| Market prices table | `PGMarketWidget` → `PGOperationsTable` | **Yes** (`row.id = resourceId`) | Text label + 7 numeric/trend columns | Yes — lowest wiring friction | P1-alt |
| Market trade screen inventory | `MarketScreen` | Partial (list lacks id in render key) | `<li>` text | Possible later | P3 |
| Market trade `<select>` | `MarketScreen` | Yes (option value) | Text options only | Low value (native select) | Defer |
| Production jobs | `PGProductionWidget` | **No** (recipe/building labels) | Text columns | **No** — not resource rows | Defer |
| Transport orders | `PGSupplyChainWidget` | Label only in row model | Text + route/status | Possible later | P3 |
| Finance ledger | `PGFinanceWidget` | No | Transaction text | No | No |
| Economy contracts | `PGEconomyWidget` | Label in rows | Text | Possible later | P3 |
| Charts (market/history) | `PG*Chart` components | Yes internally | **Color lines** (`pgChartResourceColor`) | No — different visual language | No |
| World map / inspector | `PGWorldCanvas`, inspectors | Region/resource context | Procedural SVG / text sections | No — not ICON-001 table context | Defer |
| Notifications | `PGNotificationCenter` | Unlikely in current rows | Text messages | Unlikely in v1 slice | Defer |
| Tutorial | `PGTutorialPanel` | No | `DashboardIcon` SVG outlines | No | No |

**Note:** Not every text mention of a resource needs an icon. Tables where the first column identifies a canonical resource by ID are the primary candidates.

---

## H. Recommended First Integration Surface

**Recommended: Site inventory table (`PGInventoryWidget` — standort/site section only)**

**Why not Production in the same slice:** `PGProductionRow` exposes `buildingLabel`, `recipeLabel`, `statusLabel`, `progressLabel` — no canonical `resourceId`. Production shows processes, not resource stock. Icons belong elsewhere first.

**Why site inventory over market (despite extra view-data work):**

- Strongest player recognition semantics (“what materials do I have here?”)
- 3-column table vs market’s 8-column wide layout — lower layout risk
- Same `PGOperationsTable` / `QueryRows` pattern market uses, with precedent for `ReactNode` cells (`PGMarketTrendBadge` in market rows)

**Why market is the alternative first surface:** `mapOperationsMarketPriceRows` already preserves `resourceId` as `row.id`; zero view-data type changes. Choose market first only if minimizing adapter churn outweighs inventory semantics.

**Defer in slice 1:** warehouse detail rows, production, transport, market screen lists, charts.

**Prerequisite (presentation-only, not gameplay):** Extend `InventoryItemRowViewData` with `resourceId: string` in `company-dashboard-view-mappers.ts` (data already in `InventoryItemReadModel.resourceId`).

---

## I. Render-Size Evidence

**Layout source:** `navigation.css` — `.pg-query-row`

| Property | Value | Evidence |
|----------|-------|----------|
| Row padding | `0.625rem 0.75rem` | ~10px vertical at 16px root |
| Alignment | `align-items: center` | Icon must fit row cross-axis |
| First column | Left-aligned, ellipsis | `min-width: 0; overflow: hidden` |
| Body text | `var(--text-body)` = **0.9375rem (15px)** | `design-tokens.css` |
| Icon tokens | `--icon-lg: 1.5rem` (**24px**) | `design-tokens.css` |
| Tutorial icon precedent | `1.75rem` in grid | `dashboard-components.css` — slightly larger context |

**Estimated row content height:** ~20–24px text line + 20px vertical padding ≈ **40–44px** total row height.

**Recommended CSS display size for resource icons in table first column:** `var(--icon-lg)` → **24×24 CSS px**

**High-DPI:** Standard browser 2× on many displays → **48×48 px** raster derivative sufficient for first slice.

**Multiple derivatives:** Not justified yet — single surface, single display token, no evidence of larger icon contexts in the same slice. Re-evaluate when adding warehouse rows, market, or tooltips.

**Do not serve 1254×1254 runtime files** in table cells — bandwidth waste; sync must resize for icon entries.

**Not invented:** 64×64, 128×128 — not derived from this codebase’s layout evidence.

---

## J. Runtime Derivative Contract

**Decision: C — WebP runtime derivative with PNG fallback** (existing pattern)

| Aspect | Contract |
|--------|----------|
| Source of truth | `docs/design/icons/ICON-001_*.png` (1254×1254, untouched) |
| Runtime PNG | Resized copy in `apps/web/public/assets/icons/` |
| Runtime WebP | Same dimensions, quality 82 (match `sync-runtime-visual-assets.ts`) |
| Loader | `resolveVisualAssetSources` → `<picture>` via `PGVisualAssetImage` |
| Resize | **Required extension** — current sync copies full resolution only |
| Target derivative size | **48×48 px** (supports 24px CSS at 2× DPR) — tied to §I |

**Not chosen:** SVG conversion, direct 1254px runtime serve, CSS `object-fit` scaling of megapixel sources.

---

## K. Registry Contract

**ICON-001 belongs in `visual-asset-registry.ts`** as **per-resource runtime entries** (not one family entry — loader resolves by ID string).

**Recommended asset ID shape:** `ICON-001-<resource_id>`

Examples:

| resourceId | Registry ID | Runtime PNG path | Runtime WebP path |
|------------|-------------|------------------|-------------------|
| `wood` | `ICON-001-wood` | `/assets/icons/ICON-001-wood.png` | `/assets/icons/ICON-001-wood.webp` |
| `iron_ore` | `ICON-001-iron_ore` | `/assets/icons/ICON-001-iron_ore.png` | `/assets/icons/ICON-001-iron_ore.webp` |

**Design source field:** `docs/design/icons/ICON-001_Wood.png` (etc.)

**Factory:** Reuse `runtimePng()` with `baseDir: '/assets/icons'` (or constant `ICONS_BASE`).

**Mapping helper (implementation slice):**

```typescript
function resourceIdToIconAssetId(resourceId: string): string {
  return `ICON-001-${resourceId}`;
}
```

**Preload:** `false` (on-demand; not boot-critical like MM-006).

**Dynamic lookup:** Safe for the nine certified resources; unknown IDs return null from `getVisualAssetEntry` — no throw.

**Do not modify registry in this audit.**

---

## L. Sync Pipeline Contract

**Smallest extension to `tools/sync-runtime-visual-assets.ts`:**

1. Add second design root or explicit list for ICON-001:

   - Source: `docs/design/icons/ICON-001_<PascalCase>.png`
   - Target dir: `apps/web/public/assets/icons/`

2. Add nine entries to a new `ICON_RUNTIME_ASSETS` array (parallel to `RUNTIME_ASSETS`), mapping:

   | Source file | Runtime ID |
   |-------------|------------|
   | `ICON-001_Wood.png` | `ICON-001-wood` |
   | `ICON-001_Planks.png` | `ICON-001-planks` |
   | … | … |

3. **Extend `syncPngWithWebp`** with optional `resizePx: 48` (or named constant from audit) for icon entries only — reuse sharp pipeline already imported.

4. **No architecture change** — same copy + WebP flow, add icon list + resize parameter.

**WebP quality:** Keep `WEBP_QUALITY = 82` unless inspection shows artifact issues at 48px (unlikely).

**Do not generate derivatives in this audit.**

---

## M. Rendering Component Decision

**Recommendation: C — small `ResourceIcon` component**

| Option | Assessment |
|--------|------------|
| A. Reuse `PGVisualAssetImage` directly | Insufficient — callers would duplicate resourceId→assetId mapping |
| B. Extend existing resource component | None exists for raster resource art |
| C. **`ResourceIcon`** | **Preferred** — thin wrapper: `resourceId` → registry ID → `PGVisualAssetImage` |
| D. Generic asset helper only | Same duplication problem as A |

**Sketch (implementation slice, not created here):**

```tsx
// ResourceIcon.tsx — presentation only, no gameplay
ResourceIcon({ resourceId, className = 'pg-resource-icon' })
  → assetId = resourceIdToIconAssetId(resourceId)
  → if !getVisualAssetEntry(assetId) return null
  → PGVisualAssetImage assetId alt="" aria-hidden className
```

**CSS:** `.pg-resource-icon { width: var(--icon-lg); height: var(--icon-lg); flex-shrink: 0; }` in first table cell flex row with label.

**Cell pattern:** Wrap label + icon in `<span className="pg-resource-cell">` — mirror market trend badge cell pattern.

**DashboardIcon:** Remains for UI chrome (cash, energy, checkmarks) — not for ICON-001 resource art.

---

## N. Fallback Contract

| Scenario | Behaviour |
|----------|-----------|
| Unknown `resourceId` | No registry entry → `ResourceIcon` returns **null**; label text unchanged |
| Missing runtime file (404) | `PGVisualAssetImage` renders broken img unless enhanced — **implementation slice should add `onError` hide or null render** |
| Future resource without artwork | Same as unknown — text-only row |
| Load failure | Must not break table layout; no gameplay fallback |

**Prefer:** Silent omission of icon, preserve text — matches `PGVisualAssetImage` null-on-missing-entry pattern.

**Do not invent** default placeholder gameplay icons in slice 1 unless design approves a generic fallback asset.

---

## O. Accessibility Contract

Resource tables already expose **visible resource names** in the same row/cell.

**Recommended semantics for decorative icons:**

- `alt=""`
- `aria-hidden="true"` on the image (or wrapper)
- Do **not** duplicate resource name for screen readers

**Evidence:** `DashboardIcon` uses `'aria-hidden': true` in SVG props. `PGVisualAssetBackground` uses `aria-hidden="true"`.

**If icon ever rendered without adjacent text** (not planned in slice 1): would need meaningful `alt` — not applicable to current table design.

---

## P. Layout / Responsive Risk

| Risk | Assessment | Mitigation |
|------|------------|------------|
| Row height increase | Low — 24px icon fits ~40px row | Use `--icon-lg`, `flex-shrink: 0` |
| Text truncation | Medium — first column already ellipsizes | Icon before label; keep `min-width: 0` on label span |
| Numeric alignment | None — icons only in column 1 | Columns 2–3 stay `tabular-nums` right-aligned |
| Narrow viewport | Low for 3-col inventory | Market 8-col has `overflow-x: auto`; inventory simpler |
| Dashboard density | Low — one icon per row | Single surface only in slice 1 |
| Responsive grid | Inventory widget 2-col at `64rem` | Icon in table unaffected |

**Do not redesign dashboard.** Mockup pixel parity not required.

---

## Q. Validation Contract

Minimum validation for implementation slice:

| Area | Test |
|------|------|
| Registry | `visual-asset-registry.test.ts` — nine ICON-001 entries, paths, type runtime |
| Loader | `visual-asset-loader.test.ts` — resolve URL for `ICON-001-wood` |
| Mapping | Unit test `resourceIdToIconAssetId` + unknown id |
| Mapper | `company-operations-table-mappers` — site inventory row includes `ResourceIcon` when resourceId present |
| Component | `ResourceIcon` — renders picture/img for known id, null for unknown |
| Fallback | Unknown resourceId → no icon, label visible |
| Accessibility | img has `alt=""` and decorative hiding |
| Sync | Manual or script check: 9 files in `public/assets/icons/`, ~48px dimensions |
| Snapshot | Update targeted dashboard/inventory snapshots if they exist |
| Build | `pnpm build:web` |
| Manual | Operations dashboard — site inventory with game save showing resources |

**Not required:** Full M12 regression, simulation tests, savegame tests.

---

## R. Explicit Deferrals

- Production widget icon integration
- Transport/supply chain resource icons
- Market widget icons (unless chosen as alternate first surface)
- Warehouse detail table icons (slice 2)
- MarketScreen trade UI icons
- Notification icons
- Chart legend icons
- Registry preload / boot critical path
- Multiple derivative sizes
- Theme variants
- Gameplay / API / resource YAML changes
- V1 tag movement

---

## S. Smallest Implementation Slice

**Slice name:** ICON-001 Runtime Integration — Site Inventory Icons

**Scope:**

1. Extend `InventoryItemRowViewData` + mapper with `resourceId`
2. Add `resourceIdToIconAssetId` + nine registry entries (`runtimePng`, `baseDir: icons`)
3. Extend sync tool — nine ICON-001 sources, resize 48px, WebP
4. Add `ResourceIcon` + `.pg-resource-icon` CSS (`--icon-lg`)
5. Update `mapOperationsSiteInventoryRows` first cell → icon + label
6. Tests per §Q
7. Update `VISUAL_ASSET_CATALOG` integration status (not required in this audit commit)

**Out of scope:** Warehouse blocks, market, production, notifications.

**Estimated touch files:** ~8–12 (registry, sync, mapper, view-data type, new component, CSS, tests, catalog).

---

## T. Final Decision

**OPTION A — READY FOR SMALL RUNTIME INTEGRATION SLICE**

- Wood recertification: **PASS**
- Source family: **COMPLETE**
- First consumer: **Site inventory table** (with presentation-layer `resourceId` extension)
- Render size: **24px CSS / 48px@2x derivative** (evidence-based)
- Runtime format: **PNG + WebP** (existing pattern + resize extension)
- Registry/sync/component path: **Clear**
- No architectural blocker

---

**Stop.** Await ChatGPT review before implementation.
