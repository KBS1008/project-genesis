# POST-V1 ICON-001 — Next Consumer Readiness Audit

**Date:** 2026-09-05  
**Slice:** ICON-001 — Second runtime consumer decision  
**Mode:** Read-only audit / next-consumer decision  
**Commit policy:** DO NOT COMMIT (per prompt §33)

---

## A. Executive Summary

ICON-001 source production and Site Inventory integration are complete and closed (`62fc619`, closeout `641b1b4`). The established contract — nine registry entries, 48×48 PNG/WebP derivatives, `ResourceIcon`, `var(--icon-lg)` display, decorative accessibility, safe fallbacks — is production-ready for reuse without pipeline changes.

This audit compares **Warehouse Detail** and **Market Widget** (with **MarketScreen** analysed separately) against current repository evidence.

**Warehouse Detail** is the recommended next consumer: canonical `resourceId` is already present in warehouse item view data, the change is a minimal mapper-only delta mirroring Site Inventory, the same 3-column `PGOperationsTable` layout applies, and it completes visual consistency within `PGInventoryWidget` at **XS** implementation size with **LOW** visual density impact.

**Market Widget** has stronger unique economic-scanning value but **HIGH** visual density (8 columns, trend badges, horizontal scroll), shared `buildMarketPriceRow` coupling to MarketScreen, and was explicitly deferred in the original readiness audit for layout reasons. It remains a valid **third** slice, not the best **second** slice.

No other surface clearly beats both candidates.

**Decision:** OPTION A — WAREHOUSE DETAIL READY AS NEXT CONSUMER

---

## B. Baseline / Repository State

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD | `641b1b40a4e540de66824b9d783b0a23ae9a9174` |
| ICON-001 Site Inventory commit | `62fc61989c746445f77416df10a11e71fdb25b68` |
| Relation to HEAD | Ancestor (HEAD = closeout docs commit `641b1b4` on top) |
| Pushed state | Site Inventory commits (`62fc619`, `641b1b4`) are **ahead of** `origin/master` (`73c074b`) — **not pushed** per prior closeout policy |
| Working tree | Unrelated M11/M12 docs, Bilder churn, mockups, prompts, temp saves remain — preserved, not part of this audit |

---

## C. V1 Integrity

| Tag | Expected | Verified |
|-----|----------|----------|
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` | ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` | ✓ |

Tags not moved. No M11/M12/V1 release work reopened.

---

## D. Existing ICON-001 Runtime Contract

| Asset / layer | Status |
|---------------|--------|
| Source PNGs (9 × 1254×1254 RGBA) | Committed `73c074b` |
| Runtime PNG (9 × 48×48) | Committed `62fc619` |
| Runtime WebP (9 × 48×48) | Committed `62fc619` |
| Registry entries (`ICON-001-<resource_id>`, `preload: false`) | 9 entries |
| Mapping helper | `resource-icon-asset-ids.ts` |
| Presentation component | `ResourceIcon.tsx` |
| CSS display | `var(--icon-lg)` ≈ 24px |
| Site Inventory consumer | CLOSED / PASS |

Second consumer should require **no** new source artwork, registry entries, derivatives, or sync-pipeline changes.

---

## E. Site Inventory Reuse Baseline

Established pattern (reference only — do not modify):

```309:312:apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.tsx
          <span className="pg-resource-cell" key={`resource-${item.resourceId}`}>
            <ResourceIcon resourceId={item.resourceId} />
            <span className="pg-resource-cell-label">{item.resourceLabel}</span>
          </span>,
```

CSS: `.pg-resource-cell`, `.pg-resource-cell-label`, `.pg-resource-icon` in `dashboard-components.css`.

Known non-blocking observation: narrow first column can truncate labels aggressively. Use as comparative warning, not a Site Inventory fix target.

---

## F. Candidate A — Warehouse Detail

### Presentation path

| Layer | Location |
|-------|----------|
| Widget | `PGInventoryWidget` — warehouse section |
| Mapper | `mapOperationsWarehouseBlocks()` |
| View data | `WarehouseStorageRowViewData.items: InventoryItemRowViewData[]` |
| Table | `PGOperationsTable` — 3 columns: Ressource / Reserviert / Verfügbar |
| Tests | `company-operations-table-mappers.test.ts` (site inventory tests exist; warehouse none yet) |

### Current warehouse detail row

```347:352:apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.tsx
          warehouse.items.map((item, index) =>
            Object.freeze({
              id: `${warehouse.id}:${item.resourceLabel}:${index}`,
              cells: Object.freeze([item.resourceLabel, String(item.reserved), String(item.available)]),
```

### Explicit answers

| # | Question | Answer |
|---|----------|--------|
| 1 | Canonical `resourceId` at render time? | **YES** — `InventoryItemRowViewData.resourceId` populated from API read model in `company-dashboard-view-mappers.ts` (warehouse `storage.items` mapping) |
| 2 | Where lost? | **Not lost** — only omitted in warehouse **detail row mapper** first cell |
| 3 | Presentation-only propagation? | **Not required** — data already present; mapper render change only |
| 4 | API/domain/gameplay changes? | **NO** |
| 5 | `ResourceIcon` unchanged? | **YES** |
| 6 | 48×48 derivatives unchanged? | **YES** |
| 7 | 24px CSS appropriate? | **YES** — identical 3-column inventory table geometry to Site Inventory |
| 8 | Minimal file touch count | **~2–3 files**: `company-operations-table-mappers.tsx`, `company-operations-table-mappers.test.ts`; optional registry `component` note only |
| 9 | Material player recognition improvement? | **Moderate** — answers “what is stored in this warehouse block?” when multiple buildings/resources visible |
| 10 | Redundant with Site Inventory? | **Partially** — same resources may appear in both site and warehouse tables, but warehouse context is building-scoped; classification: **USEFUL BUT SECONDARY** (widget consistency > unique information) |

### Implementation size: **XS**

---

## G. Candidate B — Market Widget

### Presentation path

| Layer | Location |
|-------|----------|
| Widget | `PGMarketWidget` on Operations Dashboard (`CompanyOperationsPanels`) |
| Mapper | `mapOperationsMarketRows()` → `buildMarketPriceRow()` |
| View data | `MarketPriceChartViewData` includes `resourceId` |
| Table | `PGOperationsTable` — **8 columns** + trend badge ReactNode |
| CSS | `.pg-market-widget .pg-operations-table { overflow-x: auto; }` |

### Current market first cell

```33:37:apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.tsx
function buildMarketPriceRow(price: MarketPriceRowSource): PGOperationsTableRow {
  return Object.freeze({
    id: price.resourceId,
    cells: Object.freeze([
      price.resourceLabel,
```

Verified: **`row.id = resourceId`** (confirmed in `company-operations-table-mappers.test.ts`).

### Explicit answers

| # | Question | Answer |
|---|----------|--------|
| 1 | `resourceId` at render time? | **YES** — in mapper source object and `row.id` |
| 2 | View-data changes needed? | **NO** for dashboard widget |
| 3 | Horizontal space for icon + label? | **Marginal** — 8-column wide table; first column competes with price/supply/demand/trend columns; table already uses `pg-query-table-wide` + horizontal scroll |
| 4 | Worsens dense table? | **YES, likely** — adds visual element alongside trend badge and numeric density |
| 5 | Stronger gameplay value than Warehouse? | **YES for economic scanning** — helps match price rows to resources when comparing markets |
| 6 | Competes with colors/trends? | **YES** — `PGMarketTrendBadge` + chart series colors (`pgChartResourceColor`) already encode resource identity differently |
| 7 | 48×48 derivatives reusable? | **YES** |
| 8 | 24px CSS appropriate? | **Technically yes**, but first-column width pressure higher than inventory tables |
| 9 | Separate from MarketScreen? | **Should be YES** — see §H |
| 10 | Minimal file touch count | **~3–4 files** if dashboard-only; requires mapper fork or parameter on shared `buildMarketPriceRow` |

### Implementation size: **S** (dashboard-only) / **M** if MarketScreen accidentally included via shared helper)

### Visual density: **HIGH**

---

## H. MarketScreen Separation Analysis

| Aspect | Dashboard Market Widget | MarketScreen |
|--------|-------------------------|--------------|
| Component | `PGMarketWidget` | Same `PGMarketWidget` |
| Mapper | `mapOperationsMarketRows(companyViewData.marketPrices)` | `mapMarketPriceRows(marketQuery.data, labels.resource)` |
| Shared helper | Both call **`buildMarketPriceRow()`** | Same |
| Data source | Company dashboard view data | Regional API (`fetchMarketPrices`) |
| Layout context | Operations dashboard grid | Full screen + trade controls + charts |

**Conclusion:** Architecturally separable **only if** `buildMarketPriceRow` is not modified globally. A dashboard-only slice must either:

- add an optional `decorateResourceCell` / `includeResourceIcon` flag to `buildMarketPriceRow`, or
- inline icon decoration in `mapOperationsMarketRows` only.

**Default assumption:** Market Widget and MarketScreen are **NOT one slice**. MarketScreen integration should be a **future, separate** decision after dashboard Market Widget is validated visually.

---

## I. Other Candidate Scan

Brief scan of player-facing surfaces with resource identity:

| Surface | `resourceId` ready? | Icon value | Verdict |
|---------|---------------------|------------|---------|
| Warehouse Detail | ✓ | Moderate (completes inventory widget) | **Promoted — Candidate A** |
| Market Widget | ✓ | High scanning value, high density | **Promoted — Candidate B** |
| MarketScreen trade `<select>` | ✓ (option value) | Low — native select, text sufficient | Defer |
| MarketScreen inventory list | ✓ in data, not in render key | Low — short summary list | Defer |
| Economy contracts table | **No** — `ContractRowViewData` label only | Would need propagation | Defer |
| Transport / supply chain | **No** — `resourceLabel` only | Would need propagation | Defer |
| Production jobs | Recipe labels, not resource rows | Poor fit | Defer |
| Charts | Color lines, not row icons | Different visual language | Defer |
| Building panels / world | Building-centric | Not resource-row surfaces | Defer |

**No surface clearly superior to both Warehouse and Market.**

---

## J. Candidate Suitability Matrix

Scores 1 (poor) – 5 (excellent):

| Criterion | Warehouse | Market Widget |
|-----------|:---------:|:-------------:|
| Canonical resourceId readiness | 5 | 5 |
| Resource identity importance | 4 | 5 |
| Player recognition value | 3 | 5 |
| Existing ResourceIcon reuse | 5 | 5 |
| Existing derivative reuse | 5 | 5 |
| Layout compatibility | 4 | 2 |
| Responsive safety | 3 | 2 |
| Accessibility simplicity | 5 | 5 |
| Testability | 5 | 4 |
| Implementation smallness | 5 | 4 |
| Low architecture risk | 5 | 4 |
| Low gameplay/domain risk | 5 | 5 |
| **TOTAL** | **49** | **46** |

**Score override rationale:** Market leads on unique player recognition (+2 net on identity/value) but loses on layout compatibility, responsive safety, and architecture coupling. For a **second** consumer immediately after Site Inventory, **implementation smallness and layout safety outweigh raw economic-scanning value**. Warehouse completes one widget before entering the dense market table.

---

## K. ResourceIcon Reuse Analysis

| Check | Warehouse | Market Widget |
|-------|-----------|---------------|
| `resourceId` API | ✓ | ✓ |
| Registry resolution | ✓ | ✓ |
| Unknown resource | null render | null render |
| Image-load failure | local `onError` hide | same |
| Accessibility | decorative | decorative |
| `className` support | default `pg-resource-icon` sufficient | same |
| Sizing | `var(--icon-lg)` via default class | same |

**Verdict:** **REUSE UNCHANGED** for both candidates. No ResourceIcon modification recommended.

---

## L. Runtime Derivative / Render-Size Analysis

| Candidate | Display need | Recommendation |
|-----------|--------------|----------------|
| Warehouse Detail | ~24px in 3-col table | Reuse `var(--icon-lg)` + existing 48×48 @2× DPR |
| Market Widget | ~24px in 8-col wide table | Same derivative sufficient; **layout width** is the constraint, not pixel density |

Do **not** generate 64×128 variants without measured larger display geometry — none observed.

---

## M. Visual Density Analysis

| Surface | Density | Rationale |
|---------|---------|-----------|
| Warehouse Detail | **LOW** | 3 columns, no badges, same as Site Inventory |
| Market Widget | **HIGH** | 8 columns, currency formatting, supply/demand numbers, trend badge, horizontal scroll |

A technically cheap Market integration is **not** automatically visually good.

---

## N. Information Redundancy / Player Value

### Warehouse

- **Classification:** USEFUL BUT SECONDARY
- Same `PGInventoryWidget` panel as Site Inventory; icons repeat resource identity across site vs warehouse contexts
- **Value:** Consistency and faster scanning within warehouse blocks when multiple resources stored per building
- **Player question helped:** “What resources are in this warehouse?”

### Market Widget

- **Classification:** HIGH VALUE CONSISTENCY (cross-surface) / unique economic context
- Not redundant with Site Inventory — different question: “Which resource is this price row?”
- **Player question helped:** Resource ↔ price ↔ trend association when comparing rows

---

## O. Layout / Responsive Risk

| Risk | Warehouse | Market Widget |
|------|-----------|---------------|
| Row height | Low — same as Site Inventory | Low |
| First-column width | Medium — truncation risk (known pattern) | High — 8-col wide grid |
| Numeric alignment | Unchanged | Unchanged |
| Horizontal overflow | Unlikely (3 col) | Already present (`overflow-x: auto`) |
| Narrow viewport | Same truncation risk as Site Inventory | Scroll + truncation compound |
| Dashboard density | Low (inventory grid half) | High (operations panel) |

Do not reproduce Site Inventory truncation blindly — reuse `.pg-resource-cell-label` ellipsis pattern.

---

## P. Accessibility / Fallback Contract

Both candidates keep visible resource labels adjacent to icons → decorative contract preserved:

- `alt=""`
- `aria-hidden="true"`
- visible label remains authoritative

Neither candidate renders icon-only resource identity. Current `ResourceIcon` fallback contract is suitable for both.

---

## Q. Test Impact

### Warehouse (minimum)

| Test | Required |
|------|----------|
| `mapOperationsWarehouseBlocks` — icon + label in detail first cell | Yes |
| Unknown resource — label without icon | Yes |
| `ResourceIcon` / registry tests | No change expected |
| `pnpm build:web` | Yes |
| Manual runtime + screenshot | Yes — warehouse block in `PGInventoryWidget` |

### Market Widget (minimum)

| Test | Required |
|------|----------|
| `mapOperationsMarketRows` — decorated first cell | Yes |
| Ensure `mapMarketPriceRows` unchanged if dashboard-only | Yes |
| Market mapper / badge interaction | Yes |
| Manual runtime + screenshot | Yes — operations dashboard market widget |

No broad M12 regression proposed.

---

## R. Implementation Size Comparison

| Candidate | Size | Categories touched |
|-----------|------|-------------------|
| Warehouse Detail | **XS** | Mapper, mapper test; reuse existing CSS |
| Market Widget (dashboard only) | **S** | Shared row builder fork/flag, mapper test, manual density review |
| Market Widget + MarketScreen | **M** | Avoid — separate slices |

---

## S. Architecture Change Matrix

| Question | Warehouse | Market Widget |
|----------|:-----------:|:-------------:|
| New source artwork? | NO | NO |
| New registry entries? | NO | NO |
| New runtime derivatives? | NO | NO |
| Sync-pipeline change? | NO | NO |
| ResourceIcon change? | NO | NO |
| API change? | NO | NO |
| Domain change? | NO | NO |
| Gameplay change? | NO | NO |
| New global CSS abstraction? | NO | NO (reuse `.pg-resource-cell`) |

Both pass the preferred **NO** matrix. Market adds mapper-fork complexity only.

---

## T. Recommended Next Consumer

**Warehouse Detail** (warehouse storage detail rows inside `PGInventoryWidget`).

**Reason:** Strongest balance of reuse, layout fit, auditable XS scope, and widget-level consistency immediately after Site Inventory — without entering the high-density market table or coupling to MarketScreen.

Market Widget remains the leading **third** candidate when economic scanning value justifies visual density review.

---

## U. Exact Future Implementation Boundary

**Slice name:** `ICON-001 Runtime Integration — Warehouse Detail`

**Scope:**

- `mapOperationsWarehouseBlocks()` detail rows only (per-building resource tables)
- **NOT** warehouse summary rows (building name / line count / units)
- **NOT** Site Inventory (closed)
- **NOT** Market Widget / MarketScreen
- **NOT** pipeline/registry/ResourceIcon changes

**One consumer per reviewed slice.**

---

## V. Future Validation Contract

When Warehouse Detail is implemented:

1. Targeted mapper tests (warehouse detail rows + unknown resource)
2. Existing ResourceIcon/registry tests remain green
3. `pnpm sync-visual-assets` — no ICON-001 delta expected
4. `pnpm build:web`
5. Manual runtime: load save with warehouse storage (e.g. `m12-rc-smoke.json`)
6. Screenshot: warehouse detail block showing multiple resource icons + labels
7. Viewports: at least default dashboard width; note truncation if present (non-blocking)

---

## W. Explicit Deferrals

| Surface | Status |
|---------|--------|
| Site Inventory | **CLOSED** — do not reopen |
| Market Widget | Deferred — valid third slice; HIGH density |
| MarketScreen | Deferred — separate from dashboard widget |
| Production | Deferred — no resource-row model |
| Transport / Supply Chain | Deferred — no `resourceId` in row view data |
| Contracts | Deferred — label-only view data |
| Notifications / Charts / World / Tutorials / Building panels | Deferred |

---

## X. Remaining Questions / Risks

1. **Warehouse redundancy:** Icons may repeat resources already shown in Site Inventory in the same widget — acceptable for consistency, not essential for gameplay.
2. **Truncation:** Warehouse detail rows may exhibit the same narrow-column label truncation as Site Inventory — non-blocking; do not resize icons to compensate.
3. **Market mapper coupling:** Future Market Widget slice must explicitly guard against accidental MarketScreen inclusion via `buildMarketPriceRow`.
4. **Unpushed commits:** ICON-001 work remains local until user chooses to push — does not affect this audit.

---

## Y. Final Decision

**OPTION A — WAREHOUSE DETAIL READY AS NEXT CONSUMER**

Warehouse provides the strongest balance of player value (within inventory context), ResourceIcon reuse, layout fit, implementation smallness, and low risk for the second ICON-001 slice.

Market Widget remains deferred as the preferred third candidate pending a dedicated density review slice.

**DO NOT IMPLEMENT during this audit.**
