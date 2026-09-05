# POST-V1 ICON-001 Runtime Integration — Warehouse Detail Report

**Date:** 2026-09-05  
**Slice:** ICON-001 — Second runtime consumer (Warehouse Detail)  
**Mode:** Small controlled runtime implementation  
**Commit policy:** DO NOT COMMIT (per prompt §35)

---

## A. Executive Summary

ICON-001 resource icons are integrated into **warehouse detail resource rows** inside `PGInventoryWidget` via a minimal mapper-only change mirroring the closed Site Inventory pattern. `ResourceIcon`, registry, mapping, sync pipeline, runtime derivatives, and CSS were reused unchanged.

Twenty-three targeted tests pass. Asset infrastructure no-delta gate passes (18 files, identical SHA-256 pre/post sync). `pnpm build:web` passes. Runtime inspection confirms Site Inventory icons unchanged; warehouse detail rows were empty in available smoke saves — mapper render tests and runtime widget context screenshot provided; **populated warehouse detail icon rows pending external visual gate**.

A later populated-warehouse review proved ICON-001 artwork and consumer integration, but left **accidental header ellipsis** (`Re…` / `Ve…`) and remaining `Eisen…` truncation. That is a presentation-layout fail, not an icon fail. See **§ Final Narrow-Table Layout Delta**.

**Decision:** OPTION A — FINAL VISUAL DELTA PASS / EXTERNAL GATE PENDING

---

## B. Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| Starting HEAD | `8a906070fc1509f17fd54f6d9252a4679c93e7e5` |
| Current HEAD | `8a906070fc1509f17fd54f6d9252a4679c93e7e5` (uncommitted) |
| Site Inventory commit | `62fc61989c746445f77416df10a11e71fdb25b68` |
| Readiness audit | `POST_V1_ICON_001_NEXT_CONSUMER_READINESS_AUDIT.md` (OPTION A) |

---

## C. V1 Integrity

| Tag | Expected | Verified |
|-----|----------|----------|
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` | ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` | ✓ |

Tags not moved.

---

## D. Scope Verification

| In scope | Status |
|----------|--------|
| `mapOperationsWarehouseBlocks()` detail rows only | ✓ |
| Per-building warehouse resource table first cell | ✓ |

| Excluded (unchanged) | Status |
|----------------------|--------|
| Warehouse summary rows | ✓ |
| Site Inventory | ✓ |
| Market / production / transport / etc. | ✓ |
| ResourceIcon, registry, mapping, sync, assets | ✓ |

---

## E. Existing ICON-001 Infrastructure Reuse

| Layer | Reused unchanged |
|-------|------------------|
| Source PNGs (9 × 1254×1254) | ✓ |
| Runtime PNG/WebP (9+9 × 48×48) | ✓ |
| Registry (9 entries) | ✓ |
| `resource-icon-asset-ids.ts` | ✓ |
| `ResourceIcon.tsx` | ✓ |
| `.pg-resource-cell` / `.pg-resource-icon` CSS | ✓ |

---

## F. Warehouse resourceId Verification

Verified in current code:

- `WarehouseStorageRowViewData.items` → `InventoryItemRowViewData[]`
- `InventoryItemRowViewData.resourceId` populated from API read model in `company-dashboard-view-mappers.ts`
- **No new propagation required** — only mapper render change

Readiness contract matches repository.

---

## G. Warehouse Detail Implementation

Detail row first cell updated in `mapOperationsWarehouseBlocks()`:

```350:358:apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.tsx
              cells: Object.freeze([
                <span className="pg-resource-cell" key={`resource-${item.resourceId}`}>
                  <ResourceIcon resourceId={item.resourceId} />
                  <span className="pg-resource-cell-label">{item.resourceLabel}</span>
                </span>,
                String(item.reserved),
                String(item.available),
              ]) as readonly (string | ReactNode)[],
```

Summary rows unchanged (building label / line count / units).

---

## H. ResourceIcon Reuse

`ResourceIcon` used unchanged — no props, no refactor, no global semantics change.

---

## I. Registry / Mapping No-Delta

| File | Modified |
|------|----------|
| `visual-asset-registry.ts` | NO |
| `resource-icon-asset-ids.ts` | NO |

---

## J. Asset Infrastructure No-Delta

### Pre-sync SHA-256 (18 files)

| File | SHA-256 |
|------|---------|
| ICON-001-advanced_electronics.png | `bd0b12011e900fc59fd0f2a3f8c953354f56092d3c94514e3769f7dcc91f4ac9` |
| ICON-001-advanced_electronics.webp | `746021e7984bded0198aa9a19d45b01a0b660d5e4cfc163d06601e4803e00551` |
| ICON-001-consumer_goods.png | `5e1e38a32ee5028a2b91d1db236514818c9d1d358627ebfc7a753f14233e238b` |
| ICON-001-consumer_goods.webp | `663a70dcb8317b2a50486d8a0377ebb912895a4fef7d3d5af8a78c50896dcfbb` |
| ICON-001-industrial_machinery.png | `0c029f3daa1745bfcf2fda453a9bb4dfa016b71066437f466577a7d9fb36409e` |
| ICON-001-industrial_machinery.webp | `90008ee04aa0111c4d98bef748c8a6879b3179b4ac951bee20bc7da4c95c5db5` |
| ICON-001-iron_ore.png | `876879237f3543faa70c050e5adf36dc2df1c1422b88d3246c6d8f16a4f4b0e6` |
| ICON-001-iron_ore.webp | `2575c3656f7dea57555d9cfbfe27f78b0e6f255b173c648d0d586f34800cd9f8` |
| ICON-001-machine_parts.png | `9240a191d2b1f0d7930d20f303f8a279c357ce66f27e67749171a9236992d312` |
| ICON-001-machine_parts.webp | `792b541fa701e9ade6a0e21528e3d82ca1e16011b27727ccc138958385410591` |
| ICON-001-planks.png | `b80fefd75e6ff67364df8d14cb235a0e243ef3b8b0707c90a37e75c1eebaeb5a` |
| ICON-001-planks.webp | `cfe428e8c671af60ecda025f59e9e85540eb105dfd9fd37d39382deaf9cbf560` |
| ICON-001-steel.png | `f38032c1897e796cdfd307735ee655782bbd9f4fe2930abdff762e573b0792e7` |
| ICON-001-steel.webp | `53ec9946d59d2e2794940ea3dda790198814511928a83dac38383527d8362e0b` |
| ICON-001-stone.png | `f80805485493a436497bb4bb211a5f40ee96074c4fc1c64b9802dc181c5a8f32` |
| ICON-001-stone.webp | `86a13bcc07d0a79ba3982428a62d28e88d446b967c0c9cb38de18df69bb1fc9f` |
| ICON-001-wood.png | `0cc4d412a79cf28cefd85ca2ac661d35291cea55987d506048e705ece7a45e71` |
| ICON-001-wood.webp | `b8ed904e7615e69cc15d6a2574da217635aed98dcd5cfc55f1105fcfbcec45e7` |

### Post-sync

All 18 hashes **identical**. Dimensions 48×48. File count 18.

`git diff -- apps/web/public/assets/icons/` → **NO DELTA**

---

## K. CSS No-Delta (ICON-001 integration)

ICON-001 integration reused `.pg-resource-cell`, `.pg-resource-cell-label`, `.pg-resource-icon` unchanged.

**Visual Layout Delta (post-integration):** scoped CSS added — see §Y.

---

## Y. Visual Layout Delta

### Root cause

Resource labels truncated to a single initial (`E…`, `S…`, `H…`) due to **layout width**, not assets:

1. **Equal column grid** — `.pg-query-row` defaults to `grid-template-columns: repeat(var(--pg-query-columns), minmax(0, 1fr))` (`navigation.css`), giving each of the three inventory columns ~33% width.
2. **50/50 widget split** — `.pg-inventory-widget-grid` uses `grid-template-columns: repeat(2, minmax(0, 1fr))` at `≥64rem` (`dashboard-components.css`), so each table is ~half the dashboard width (~214px measured at runtime).
3. **Icon + label competition** — first cell holds `ResourceIcon` (`var(--icon-lg)` ≈ 24px) plus `.pg-resource-cell-label` inside an `inline-flex` cell with `overflow: hidden; text-overflow: ellipsis`.
4. **Initial fix attempt** — `minmax(4rem, 1fr)` on numeric columns forced 64px minimums each, leaving only ~44px for the resource column (worse than equal split).

### Exact CSS/layout change

File: `apps/web/src/presentation/components/dashboard/dashboard-components.css`

```css
/* Site inventory + warehouse detail: widen resource column vs numeric columns. */
.pg-inventory-widget .pg-operations-table .pg-query-row,
.pg-warehouse-block .pg-operations-table .pg-query-row {
  grid-template-columns: minmax(0, 2.5fr) minmax(0, 1fr) minmax(0, 1fr);
}

.pg-inventory-widget .pg-resource-cell,
.pg-warehouse-block .pg-resource-cell {
  width: 100%;
}
```

**Scope:** Site Inventory (`.pg-inventory-widget`) and warehouse **detail** tables (`.pg-warehouse-block`) only. Warehouse summary table and global `PGOperationsTable` / Market unchanged.

### Files changed (layout delta)

| File | Change |
|------|--------|
| `apps/web/src/presentation/components/dashboard/dashboard-components.css` | Scoped grid + resource-cell width |

**Not changed:** ResourceIcon, icon size, PNGs, registry, mapping, sync, mappers (warehouse integration unchanged), Market.

### Before / after behavior

| Label | Before (runtime) | After (runtime, ~214px table) |
|-------|------------------|--------------------------------|
| Holz | `H…` (~12px label width) | **Holz** fully visible (34px) |
| Stein | `S…` (~12px) | **Stein** fully visible (38px) |
| Eisenerz | `E…` (~12px) | **Eisen…** / 64px of 65px (minimal ellipsis on longest label) |

Grid columns: **before** `44px 64px 64px` (with failed 4rem min attempt) / equal `1fr` originally → **after** `~96px ~38px ~38px` (2.5fr : 1fr : 1fr). Numeric values (`0`, `10`, `15`, `30`) remain right-aligned and readable. No horizontal scroll introduced in the Inventar widget.

Column headers (`Reserviert`, `Verfügbar`) may abbreviate at narrow widths (`Re…`, `Ve…`); data columns unaffected.

### Site Inventory regression result

| Check | Result |
|-------|--------|
| Icons unchanged | ✓ |
| Icon size unchanged (`--icon-lg`) | ✓ |
| Labels materially more readable | ✓ |
| Numeric columns aligned/readable | ✓ |
| No clipping / horizontal scroll | ✓ |

### Warehouse regression result

| Check | Result |
|-------|--------|
| Warehouse detail CSS scoped | ✓ (`.pg-warehouse-block`) |
| Summary table unchanged | ✓ (`.pg-warehouse-widget` summary not targeted) |
| Populated detail rows at runtime | **Not observable** — smoke save warehouse storage empty (`items: []`); layout rule ready for populated rows |
| Empty state | ✓ “Lager ist leer.” unchanged |

### Screenshot evidence

**Path:** `docs/architecture/reviews/evidence/POST_V1_ICON_001_WAREHOUSE_DETAIL_LAYOUT_DELTA_RUNTIME.png`

Operatives Dashboard · `PGInventoryWidget`: Site Inventory shows **Stein**, **Holz** fully readable; **Eisenerz** substantially improved; icons unchanged; Lagerhaus panel adjacent (empty detail).

### Build result

`pnpm build:web` — **PASS** (pre-existing unrelated ESLint warnings only).

### Asset no-delta result (layout delta)

`pnpm sync-visual-assets` — PASS. All **18 ICON-001** runtime file SHA-256 hashes **identical** pre/post sync. No registry, mapping, source PNG, or sync-pipeline changes.

---

## Final Narrow-Table Layout Delta

Populated Warehouse Detail later proved ICON-001 (Bretter icon, size, alignment, 0 / 5 readable). The remaining fail was **table information layout**, not artwork:

- Site Inventory: `Eisen…` still truncated; numeric headers collapsed to accidental `Re…` / `Ve…`.
- Warehouse Detail: `Bretter` readable; same accidental `Re…` / `Ve…`.

`2.5fr / 1fr / 1fr` was insufficient: it still gave numeric columns a large equal share of a ~214px table, so full words `Reserviert` / `Verfügbar` hit CSS ellipsis and became accidental labels. Resource identity did not receive the remaining practical width.

### Final header strategy

Scoped to the Site Inventory and Warehouse **detail** resource tables only:

`Ressource | Res. | Verf.`

These are **intentional compact UI copy**, not truncated `Reserviert` / `Verfügbar`. Terminology elsewhere is unchanged. Warehouse summary remains `Lagerhaus | Zeilen | Einheiten`.

### Accessibility treatment

No existing header `aria-label` / `title` mechanism existed on `QueryRows`. Smallest local additive solution:

- Visible label: `Res.` / `Verf.`
- `aria-label` + native `title`: `Reserviert` / `Verfügbar`

Assistive technology therefore still exposes the full names. No new tooltip system. Other tables continue to pass plain strings.

### Final column sizing strategy

Replaced `2.5fr / 1fr / 1fr` with a semantic contract:

```css
grid-template-columns: minmax(0, 1fr) minmax(var(--space-xl), max-content) minmax(var(--space-xl), max-content);
```

Numeric columns also restore `min-width: max-content` so compact headers cannot collapse under the global `min-width: 0` + ellipsis rule.

Runtime geometry at the demonstrated dashboard width (~214px table):

| Track | Computed |
|-------|----------|
| Resource | ~102px (`1fr` remainder) |
| Res. | ~33px |
| Verf. | ~37px |

`--space-xl` (2rem) is the numeric floor — enough for ordinary multi-digit tabular values, not a screenshot-hardcoded width for `0` / `5` / `10` / `15`.

### Exact files changed

| File | Change |
|------|--------|
| `apps/web/src/presentation/components/dashboard/PGInventoryWidget.tsx` | Compact resource-table columns for Site Inventory + warehouse detail |
| `apps/web/src/presentation/screens/shared/QueryRows.tsx` | Additive `QueryColumn` (`label` / `ariaLabel` / `title`) |
| `apps/web/src/presentation/components/dashboard/PGOperationsTable.tsx` | Pass-through of `QueryColumn` (string callers unchanged) |
| `apps/web/src/presentation/components/dashboard/dashboard-components.css` | Resource-first / compact-numeric grid |
| `apps/web/src/presentation/components/dashboard/PGInventoryWidget.test.tsx` | Compact headers + accessible names; summary headers unchanged |

**Not changed:** ResourceIcon, icon size, mapping, registry, source/runtime PNGs, sync pipeline, resourceId propagation, mappers, Market, warehouse summary layout, Production, Transport.

### Targeted test result

`pnpm vitest run` on:

- `PGInventoryWidget.test.tsx` (new)
- `company-operations-table-mappers.test.ts` (warehouse known/unknown + Site Inventory ICON-001)
- `ResourceIcon.test.tsx`
- `resource-icon-asset-ids.test.ts`
- `visual-asset-registry.test.ts`
- `operations-dashboard.test.tsx`
- `dashboard-components.test.tsx`

**34 passed / 7 files.** Mapper tests not weakened.

### Build result

`pnpm build:web` — **PASS** (pre-existing unrelated ESLint warnings only).

### Asset no-delta result

`pnpm sync-visual-assets` — PASS. All **18 ICON-001** SHA-256 hashes **identical** pre/post. `git diff -- apps/web/public/assets/icons/` empty.

### Final screenshot path

`docs/architecture/reviews/evidence/POST_V1_ICON_001_WAREHOUSE_DETAIL_NARROW_TABLE_RUNTIME.png`

Operatives Dashboard · `PGInventoryWidget`: Site Inventory (left) and populated Warehouse Detail (right) in one view. Includes the Bretter warehouse row.

### Site Inventory visual result

| Check | Result |
|-------|--------|
| `Ressource` header readable | ✓ |
| `Res.` / `Verf.` intentional (not `Re…` / `Ve…`) | ✓ |
| Stein fully readable | ✓ |
| Holz fully readable | ✓ |
| Eisenerz fully readable at demonstrated width | ✓ (65px label, no ellipsis) |
| Icons unchanged (`--icon-lg` = 24px) | ✓ |
| Numbers readable (0 / 10 / 15 / 5) | ✓ |

### Warehouse visual result

| Check | Result |
|-------|--------|
| `Ressource` / `Res.` / `Verf.` readable | ✓ |
| Bretter fully readable | ✓ |
| Icon unchanged (24px) | ✓ |
| 0 / 5 readable | ✓ |
| Summary table unchanged (`Lagerhaus` / `Zeilen` / `Einheiten`) | ✓ (summary headers may still ellipsis — out of scope) |
| No new horizontal scroll / clipping | ✓ |
| Market headers unchanged | ✓ |

---

## R. Layout / Truncation Observation (superseded by §Y)

Original integration noted aggressive truncation — **addressed** by §Y Visual Layout Delta for Site Inventory. Warehouse detail label readability uses the same scoped CSS when detail rows are populated. Header ellipsis (`Re…` / `Ve…`) and remaining `Eisen…` truncation **remained after §Y** and are addressed by **§ Final Narrow-Table Layout Delta**.

---

## L. Fallback / Accessibility

Unchanged established contract: decorative icon (`alt=""`, `aria-hidden`), visible label authoritative; unknown/missing/failed image → text only.

---

## M. Automated Tests

| Suite | Result |
|-------|--------|
| `company-operations-table-mappers.test.ts` (9 tests, +2 warehouse) | PASS |
| `resource-icon-asset-ids.test.ts` | PASS |
| `visual-asset-registry.test.ts` | PASS |
| `ResourceIcon.test.tsx` | PASS |
| **Total targeted** | **23 passed** |

New coverage:
- Known warehouse detail → ResourceIcon + label + numeric cells unchanged + summary unchanged
- Unknown warehouse detail → label only, no icon

Site Inventory tests unchanged in behavior.

---

## N. Sync Validation

`pnpm sync-visual-assets` — PASS, ICON-001 family regenerated deterministically; hashes unchanged.

---

## O. Build Validation

`pnpm build:web` — PASS (pre-existing unrelated ESLint warnings only).

---

## P. Manual Runtime Validation

| Check | Result |
|-------|--------|
| Save | `saves/m12-rc-smoke.json` (RC Smoke Test) |
| Navigation | Company → Operatives Dashboard → Inventar widget |
| Site Inventory icons | ✓ 3 icons (Eisenerz, Stein, Holz) — unchanged |
| Warehouse building | ✓ Present (Lager) |
| Warehouse detail items | **Empty** (`items: []`) in all checked smoke saves |
| Warehouse detail icons at runtime | 0 (empty warehouse — expected) |
| No regression in Site Inventory | ✓ |

**Note:** Available `apps/api/saves/*.json` smoke saves contain warehouse buildings but no stored warehouse inventory items. Populated warehouse detail icon verification requires a session with warehouse stock (e.g. market purchase during review) without modifying save files on disk.

---

## Q. Screenshot Evidence

**Path:** `docs/architecture/reviews/evidence/POST_V1_ICON_001_WAREHOUSE_DETAIL_RUNTIME.png`

Shows `PGInventoryWidget` grid: Site Inventory with ICON-001 icons (left) + Lagerhaus section with empty warehouse detail (right). Proves runtime context and Site Inventory non-regression. Does **not** show populated warehouse detail icon rows (no legitimate save data available).

---

## S. Lifecycle Updates

| Document | Update |
|----------|--------|
| `VISUAL_ASSET_CATALOG.md` | Warehouse detail consumer added; pending external visual gate noted |
| `VISUAL_ASSET_CHANGELOG.md` | Warehouse detail integration entry |
| `VISUAL_PRODUCTION_BACKLOG.md` | Site inventory + warehouse detail; market deferred |

Site Inventory remains COMPLETE / PASS. Warehouse: IMPLEMENTED / PENDING EXTERNAL VISUAL GATE.

---

## T. Files Changed

**Implementation (warehouse integration)**
- `apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.tsx`
- `apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.test.ts`

**Visual layout delta**
- `apps/web/src/presentation/components/dashboard/dashboard-components.css`

**Final narrow-table layout delta**
- `apps/web/src/presentation/components/dashboard/PGInventoryWidget.tsx`
- `apps/web/src/presentation/screens/shared/QueryRows.tsx`
- `apps/web/src/presentation/components/dashboard/PGOperationsTable.tsx`
- `apps/web/src/presentation/components/dashboard/PGInventoryWidget.test.tsx`

**Lifecycle**
- `docs/design/VISUAL_ASSET_CATALOG.md`
- `docs/design/VISUAL_ASSET_CHANGELOG.md`
- `docs/design/VISUAL_PRODUCTION_BACKLOG.md`

**Evidence / report**
- `docs/architecture/reviews/evidence/POST_V1_ICON_001_WAREHOUSE_DETAIL_RUNTIME.png`
- `docs/architecture/reviews/evidence/POST_V1_ICON_001_WAREHOUSE_DETAIL_LAYOUT_DELTA_RUNTIME.png`
- `docs/architecture/reviews/evidence/POST_V1_ICON_001_WAREHOUSE_DETAIL_NARROW_TABLE_RUNTIME.png`
- `docs/architecture/reviews/POST_V1_ICON_001_RUNTIME_INTEGRATION_WAREHOUSE_DETAIL_REPORT.md`

**Not changed:** ResourceIcon, registry, mapping, sync, runtime assets, Site Inventory mapper logic, Market, warehouse summary contract.

---

## U. Explicit Deferrals

Site Inventory (closed), Market Widget, MarketScreen, Production, Transport, Contracts, charts, world, tutorials, building panels.

---

## V. Remaining Issues

1. **External visual gate:** Final screenshot with populated Bretter warehouse row is now captured (§ Final Narrow-Table Layout Delta). User + ChatGPT still perform the screenshot gate.
2. **Header abbreviations:** Superseded by the final narrow-table delta. Compact labels `Res.` / `Verf.` replace accidental `Re…` / `Ve…`. Warehouse **summary** headers (`Lagerhaus` / `Einheiten`) may still ellipsis at this width — **out of scope**.

---

## W. Recommended Next Step

After user/ChatGPT visual gate on populated warehouse detail: run Warehouse Detail closeout commit (separate prompt). Do not start Market Widget until Warehouse is externally approved.

---

## X. Final Decision

**OPTION A — FINAL VISUAL DELTA PASS / EXTERNAL GATE PENDING**

ICON-001 artwork and warehouse consumer integration remain closed. The remaining table-layout fail is addressed by intentional compact headers and resource-first column sizing. Automated tests and `pnpm build:web` pass. ICON-001 assets have no sync delta. Final runtime screenshot includes Site Inventory and populated Warehouse Detail. **Do not claim external visual approval** — User + ChatGPT perform that gate.
