# POST-V1 ICON-001 — Market Widget Integration Readiness Delta Audit

**Date:** 2026-09-06  
**Slice:** ICON-001 — Third consumer decision (Market Widget only)  
**Mode:** Read-only delta audit  
**Commit policy:** DO NOT COMMIT (per prompt §41)

---

## A. Executive Summary

ICON-001 Site Inventory and Warehouse Detail are **CLOSED / PASS** (`62fc619`, `62f99ba`, closeout `44e9f44`). Warehouse closeout added **QueryColumn** structured headers and scoped narrow-table CSS, but those patterns were created for **3-column resource tables** and must **not** be assumed for Market.

This delta audit re-evaluates **dashboard Market Widget only** against current code at `44e9f44`.

**Technical readiness improved slightly** since the prior next-consumer audit (`8a90607`): canonical `resourceId` remains directly available, `ResourceIcon` and all 18 runtime derivatives remain reusable unchanged, and Warehouse proved a safe mapper-only consumer pattern. **Core Market constraints are unchanged:** eight-column economic table, existing horizontal overflow, shared `buildMarketPriceRow()` coupling to MarketScreen, and **HIGH** visual density.

Market Widget **can** become the third ICON-001 consumer as a **small (S) controlled slice**, but only after **one explicit presentation seam decision** isolating dashboard decoration from MarketScreen. QueryColumn / `Res. | Verf.` compact headers are **not** required and should **not** be copied.

External visual gate risk remains **material** — Warehouse demonstrated that technical reuse alone does not guarantee acceptable narrow/dense-table presentation.

**Decision:** **OPTION B — READY WITH ONE SMALL PRESENTATION DECISION**

**Required decision before implementation:** choose shared-builder isolation seam for `buildMarketPriceRow()` (recommended: optional `includeResourceIcon?: boolean`, default `false`, enabled only in `mapOperationsMarketRows`).

**Value vs cost:** player value is **MEDIUM**; integration cost is **MEDIUM–HIGH** (density, coupling, tests, mandatory runtime gate). **Value does not clearly exceed cost** — proceed only if dashboard visual consistency is an explicit product goal, not because assets are “free.”

---

## B. Baseline / Repository State

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD | `44e9f44e354272817d309835e13ca60dc04bcd07` |
| Warehouse implementation | `62f99baecbf6117aaf9c698f41e21dffee8f19c2` |
| Warehouse closeout docs | `44e9f44e354272817d309835e13ca60dc04bcd07` |
| Relation of `62f99ba` to HEAD | **Ancestor** |
| `origin/master` | `44e9f44` (aligned) |
| Prior next-consumer audit | `8a90607` — selected Warehouse over Market |
| Working tree | Unrelated M11/M12 docs, design churn, prompts, temp saves — **no uncommitted Market code delta** |

---

## C. V1 Integrity

| Tag | Expected | Verified |
|-----|----------|----------|
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` | ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` | ✓ |

Tags not moved. This audit made **no** implementation changes.

---

## D. Existing ICON-001 Contract

| Layer | Status |
|-------|--------|
| Source PNGs | 9 × 1254×1254 RGBA (certified `73c074b`) |
| Runtime PNG | 9 × 48×48 |
| Runtime WebP | 9 × 48×48 |
| Registry | 9 entries, unchanged |
| Mapping | `resource-icon-asset-ids.ts` |
| Component | `ResourceIcon.tsx` — `resourceId` prop, decorative, `var(--icon-lg)` ≈ 24px |
| Consumers closed | Site Inventory, Warehouse Detail |
| Fallback | Unknown/missing/failed image → text-only label authoritative |

No asset infrastructure change required for Market Widget.

---

## E. Warehouse-Derived Architecture Delta

| Warehouse addition | Relevance to Market |
|--------------------|---------------------|
| `QueryColumn` (`label`, `title`, `ariaLabel`) via `QueryRows` → `PGOperationsTable` | **Available without framework change** — Market still passes plain `string[]` columns today |
| Compact headers `Ressource \| Res. \| Verf.` | **Not applicable** — approved only for narrow 3-column inventory/warehouse resource tables |
| Scoped CSS `.pg-inventory-widget` / `.pg-warehouse-block` grid overrides | **Must NOT be reused by accident** — rules target 3-column resource tables only |
| `.pg-resource-cell` + `ResourceIcon` + label pattern | **Reusable presentation pattern** for first cell content |
| Mandatory populated runtime screenshot + external visual gate | **Applies equally to Market** |
| Mapper-only integration without asset delta | **Template for Market Widget** |

**QueryColumn for Market:** **LOW VALUE** — Market headers are already reasonably short; density comes from **eight data columns**, not header length.

---

## F. Market Widget Runtime / Data Flow

```
API GameSessionDashboard.marketPrices
  → company-dashboard-view-mappers.mapMarketPrices()
  → CompanyDashboardViewData.marketPrices[]  (resourceId + resourceLabel + economics)
  → CompanyOperationsPanels
  → mapOperationsMarketRows(marketPrices)
  → buildMarketPriceRow({ resourceId, resourceLabel, … })
  → PGMarketWidget
  → PGOperationsTable (8 columns, columnCount=8)
  → QueryRows (pg-query-table-wide)
```

| Layer | File |
|-------|------|
| Widget | `PGMarketWidget.tsx` |
| Dashboard host | `CompanyOperationsPanels.tsx` |
| Mapper | `mapOperationsMarketRows()` in `company-operations-table-mappers.tsx` |
| Row builder | `buildMarketPriceRow()` (shared) |
| View data | `MarketPriceChartViewData` — includes `resourceId` |
| Table | `PGOperationsTable` → `QueryRows` |
| CSS | `.pg-market-widget .pg-operations-table { overflow-x: auto; }` |
| Tests | `company-operations-table-mappers.test.ts` (`mapMarketPriceRows` only today; no dashboard market icon tests) |

**Inspector reuse:** `CompanyOperationsInspector.tsx` also renders `PGMarketWidget` with pre-mapped rows — same row contract.

---

## G. MarketScreen Runtime / Data Flow

```
fetchMarketPrices(regionId) → MarketPriceReadModel[]
  → mapMarketPriceRows(prices, labels.resource)
  → buildMarketPriceRow({ resourceId, resourceLabel, …, tradeVolume })
  → PGMarketWidget (embedded in MarketScreen)
  → same PGOperationsTable / QueryRows path
```

| Layer | File |
|-------|------|
| Screen | `MarketScreen.tsx` |
| Mapper | `mapMarketPriceRows()` |
| Shared builder | **`buildMarketPriceRow()`** |
| Extra UI | Region select, trade forms, charts, inventory context — **not** part of widget table |

MarketScreen must remain **out of scope** for the third consumer slice.

---

## H. Shared `buildMarketPriceRow()` Coupling

| # | Question | Answer |
|---|----------|--------|
| 1 | Still shared? | **YES** — `mapOperationsMarketRows` and `mapMarketPriceRows` both call it |
| 2 | Returns? | `PGOperationsTableRow` with `id = resourceId`, 8 cells, searchText |
| 3 | Resource-name cell today? | **Plain string** `price.resourceLabel` in `cells[0]` |
| 4 | If `ResourceIcon` added inside `buildMarketPriceRow()` globally? | **YES — both Market Widget and MarketScreen would get icons** |
| 5 | Violates one-consumer-per-slice boundary? | **YES** unless MarketScreen is explicitly in scope |
| 6 | Widget-only outside shared builder? | **YES** — via seam (see §S) |
| 7 | Smallest safe seam? | Optional flag on `buildMarketPriceRow` **or** dashboard-only wrapper that replaces `cells[0]` after row build |
| 8 | Duplication / pollution risk? | Flag = low pollution; duplicating full row builder = high duplication |

**Ranking (preferred first):**

1. **B** — optional `includeResourceIcon?: boolean` on `buildMarketPriceRow` (default `false`)
2. **C** — dashboard-only post-decoration in `mapOperationsMarketRows` without changing shared cell economics columns
3. **E** — defer until seam agreed (current state)
4. **D** — duplicate row logic (avoid)
5. **A** — modify shared builder without isolation (reject)

---

## I. Canonical resourceId Availability

**Classification: A — canonical resourceId already directly available**

Evidence:

- `MarketPriceChartViewData.resourceId` populated in `mapMarketPrices()` from `dashboard.marketPrices`
- `buildMarketPriceRow` receives `resourceId`; row `id` equals `resourceId` (tested in `mapMarketPriceRows` test)
- `mapOperationsMarketRows` passes `price.resourceId` unchanged

No label inference. No API/domain propagation required for dashboard widget.

---

## J. ResourceIcon Reuse

**Classification: REUSE UNCHANGED — NONE**

- Props: `resourceId`, optional `className` (defaults to `pg-resource-icon`)
- Registry resolution via `resolveResourceIconAssetId`
- Unknown resource → `null` render
- Image error → hide icon, label remains
- Decorative: `alt=""`, `aria-hidden`

Market Widget can use identical `<span className="pg-resource-cell">` pattern as inventory consumers.

**Modification requirement:** **NONE**

---

## K. Asset Infrastructure Reuse

| Question | Answer |
|----------|--------|
| Requires new source artwork? | **NO** |
| Requires new registry entries? | **NO** |
| Requires new resource mapping? | **NO** |
| Requires new derivatives? | **NO** |
| Requires sync change? | **NO** |
| 48×48 sufficient for ~24px display? | **YES** |

---

## L. Market Widget Table Geometry

| Property | Current value |
|----------|---------------|
| Columns | **8** — `Ressource`, `Preis`, `Δ Basis`, `Angebot`, `Nachfrage`, `Druck`, `Trend`, `Volumen` |
| Table class | `pg-query-table-wide` (`columnCount > 4`) |
| Row grid | `repeat(8, minmax(0, 1fr))` via `--pg-query-columns: 8` |
| Row min-width | `max(100%, 8 × 6.25rem)` ≈ **50rem** (`navigation.css`) |
| Widget layout | **Full-width** row on operations dashboard (not 50/50 split like inventory grid) |
| Overflow | `.pg-market-widget .pg-operations-table { overflow-x: auto; }` |
| First-column wrap | `.pg-query-table-wide .pg-query-row > :first-child { white-space: normal; overflow-wrap: anywhere; }` |
| Row height | ~single line today; icon + wrap may increase row height slightly |
| Trend column | `PGMarketTrendBadge` ReactNode with ▲/▼/→ and green/red/stable colors |
| Icon display token | `--icon-lg` ≈ 24px (used by existing consumers) |

**Inventory-specific CSS does not apply** — no `.pg-market-widget` resource-column override exists today.

---

## M. Visual Density

**Classification: HIGH**

| # | Question | Answer |
|---|----------|--------|
| 1 | Essential columns? | Resource identity + price + delta + supply/demand + pressure + trend + volume — all present for economic scanning |
| 2 | Compact numeric columns? | Price, Δ%, supply, demand, pressure, volume use numeric/tabular presentation |
| 3 | Resource column truncates today? | Uses **wrap**, not single-char ellipsis (wide-table first-column rule) |
| 4 | Horizontal overflow already? | **YES** — by design at `overflow-x: auto` |
| 5 | 24px icon reduces label readability? | **Moderate risk** — first column shares width with seven others; icon consumes ~24px + gap |
| 6 | Row height change? | **Possible** when labels wrap alongside icon |
| 7 | Competes with price/trend? | **YES** — trend badge and colored deltas are primary scanning signals |
| 8 | Better scanning despite width cost? | **Partial** — helps “which resource?” but economic columns remain dominant |

---

## N. Resource Column Fit (conceptual, not implemented)

Preferred form: `[ResourceIcon] Resource Label` inside existing column 1 — **no separate icon column**.

**Classification: SAFE ELLIPSIS LIKELY → FULL LABEL LIKELY** (viewport-dependent)

- At full dashboard width with horizontal scroll, first column often has enough room for icon + German resource names (many wrap rather than ellipsis).
- At narrow dashboard widths, table already scrolls horizontally; icon adds fixed width cost but does not introduce a new scroll axis by itself.
- **Not** as tight as pre-fix inventory 50/50 tables — Market is full-width but **more columns**.

Do **not** copy inventory `2.5fr / 1fr / 1fr` or `Res. | Verf.` contract without a dedicated Market layout review.

---

## O. Render Size

**Recommended: `var(--icon-lg)` ≈ 24px unchanged**

Row height accommodates 24px icon aligned with existing cell padding. Do not shrink icons to force fit. 48×48 derivatives remain sufficient at 2× DPR.

---

## P. Visual Hierarchy / Player Value

Market answers economic questions first (price movement, supply/demand, trend, volume).

| Question | Assessment |
|----------|------------|
| Icon helps “which resource is this row?” | **YES — MEDIUM** |
| Icon distracts from “what is happening economically?” | **Some risk — MEDIUM** |
| Dashboard consistency with inventory widget | **MEDIUM** |

**Player-facing value classification: MEDIUM**

Not LOW (resources are the row subject), not HIGH (economic encoding already strong without icons).

---

## Q. Trend / Color Competition

Market uses:

- `PGMarketTrendBadge` — green ▲ / red ▼ / stable → with percentage text
- Numeric delta column with signed `%`
- Chart series colors elsewhere on dashboard (separate from table)

ICON-001 artwork includes material-specific colors (wood, ore, stone, etc.).

**Classification: MEDIUM COMPETITION**

Icons aid identity; trend colors aid direction. Coexistence is acceptable but visually busier than inventory tables.

---

## R. Widget vs MarketScreen Separation

**Classification: SEPARABLE**

| Surface | Mapper | Can keep text-only? |
|---------|--------|---------------------|
| Dashboard Market Widget | `mapOperationsMarketRows` | Enable icon decoration here only |
| MarketScreen | `mapMarketPriceRows` | Leave unchanged |

**MarketScreen change required for widget-only slice:** **NO** — if and only if shared builder is not modified globally without isolation.

**NOT CLEANLY SEPARABLE** would apply only if team insisted on editing `buildMarketPriceRow()` without a flag — **avoid**.

---

## S. Shared-Builder Strategy Options

See §H ranking. **Recommended:** optional boolean on `buildMarketPriceRow`, default `false`:

```typescript
// Conceptual — NOT implemented in this audit
includeResourceIcon?: boolean
```

`mapOperationsMarketRows` → `true`; `mapMarketPriceRows` → omitted/`false`.

Alternative: build resource cell in `mapOperationsMarketRows` only by composing `pg-resource-cell` around label without touching shared economics columns — slightly more mapper code, zero shared-builder API change.

---

## T. QueryColumn Relevance

**LOW VALUE**

Market Widget headers today:

`Ressource | Preis | Δ Basis | Angebot | Nachfrage | Druck | Trend | Volumen`

Abbreviating these to fit icons would be **negative signal** (hiding density problem). QueryColumn remains available if a future **specific** accessibility gap is found, but it is **not** a readiness unlock for Market.

---

## U. Fallback / Accessibility

Market can preserve established contract:

| Case | Behavior |
|------|----------|
| Known resource | Icon (decorative) + visible label |
| Unknown / unmapped | Label only |
| Registry miss | Label only |
| Image error | Label only |

Existing `QueryRows` cell markup (`role="cell"`) supports ReactNode first cell. Labels remain visible at all breakpoints — **no icon-only identity**.

QueryColumn `ariaLabel` not currently used by Market; not required for baseline accessibility if label text remains visible.

---

## V. Responsive Risk

**Classification: MEDIUM**

| Viewport | Behavior |
|----------|----------|
| Wide desktop | Full widget width; horizontal scroll may be minimal |
| Normal operations dashboard | Table often scrolls horizontally (50rem min row width) |
| Narrow dashboard | Scroll + wrapped first column; icon adds fixed width |
| Smallest supported | Same scroll contract; no new widget-level overflow expected if scoped correctly |

**Risk drivers:** eight columns, trend badge, possible row height growth — not inventory-style single-char ellipsis.

---

## W. Future Test Contract

Minimum test delta if implemented:

| Suite | Purpose |
|-------|---------|
| `company-operations-table-mappers.test.ts` | `mapOperationsMarketRows` decorates `cells[0]` with icon + label; economics cells unchanged |
| Same file | `mapMarketPriceRows` **still** text-only `cells[0]` (MarketScreen non-regression) |
| `ResourceIcon.test.tsx` | Unchanged behavior regression |
| `MarketScreen.test.tsx` | No ResourceIcon in rendered market table rows |
| Optional `PGMarketWidget` component test | Header/column count unchanged |

**Critical proof:** dashboard mapper tests demonstrate icon; regional mapper tests demonstrate **no** icon.

---

## X. Future Runtime Validation Contract

Mandatory future evidence (not captured in this audit):

1. **Operations dashboard Market Widget** at normal dashboard width — multiple resources, ICON-001 artwork, visible labels, economic columns, trend colors.
2. **One additional width** if horizontal scroll / wrap behavior materially differs (likely narrow dashboard).

Screenshot must prove **dashboard context**, not MarketScreen trade UI alone.

External visual gate required — Warehouse precedent applies.

---

## Y. Implementation Size Reassessment

| Size | Assessment |
|------|------------|
| **XS** | **No** — shared-builder seam + density/layout validation required |
| **S** | **Yes** — optional builder flag or dashboard-only cell decoration + mapper tests + scoped CSS if needed |
| **M** | If shared builder changed without isolation, or MarketScreen included, or broad Market redesign attempted |
| **L** | Not indicated — no API/domain/pipeline work |

**Estimated size: S**

---

## Z. Architecture Change Matrix

| Change | Required? | Evidence |
|--------|-----------|----------|
| New source artwork | NO | 9 certified PNGs cover all resources |
| New registry entries | NO | Registry complete |
| New mapping | NO | `resource-icon-asset-ids.ts` complete |
| New derivatives | NO | 48×48 PNG/WebP exist |
| Sync pipeline change | NO | Deterministic sync unchanged |
| ResourceIcon change | NO | Reuse as-is |
| QueryRows change | NO | Already supports ReactNode cells |
| PGOperationsTable change | NO | Pass-through sufficient |
| Market view-data change | NO | `resourceId` already present |
| Shared row-builder change | **YES (minimal)** | Isolation seam only — not global MarketScreen decoration |
| Market Widget CSS change | **MAYBE** | Optional scoped `.pg-market-widget` resource-column tuning after runtime gate — not inventory CSS reuse |
| Global CSS change | NO | Avoid |
| MarketScreen change | NO | Required out-of-scope |
| API change | NO | |
| Domain change | NO | |
| Gameplay change | NO | |

---

## AA. Previous Audit vs Current Delta

| Aspect | Previous (`8a90607`) | Current (`44e9f44`) | Delta |
|--------|----------------------|---------------------|-------|
| Next consumer pick | Warehouse | Warehouse **done** | Sequencing advanced |
| Market resourceId | Available | Available | **UNCHANGED** |
| Shared `buildMarketPriceRow` | Risk flagged | Still shared | **UNCHANGED** |
| Column count / density | 8 cols, HIGH | 8 cols, HIGH | **UNCHANGED** |
| QueryColumn | Not available | Available | **IMPROVED** (low Market relevance) |
| Proven icon+label pattern | Site Inventory only | Site + Warehouse + narrow-table gate | **IMPROVED** |
| MarketScreen separation | Requires seam | Still requires same seam | **UNCHANGED** |
| Player value | MEDIUM–HIGH scanning | MEDIUM after Warehouse context | **UNCHANGED** |

**Overall readiness delta: IMPROVED (sequencing + infrastructure confidence), core Market geometry/coupling UNCHANGED**

Previous audit deferred Market as **second** consumer. It remains a **candidate third** consumer — not automatically promoted because Warehouse finished.

---

## AB. Value / Cost Decision

### Value

| Factor | Level |
|--------|-------|
| Resource recognition | MEDIUM |
| Economic scanning | LOW–MEDIUM (labels already identify resources) |
| Visual consistency | MEDIUM (dashboard widgets) |
| Player-facing benefit | MEDIUM |

### Cost

| Factor | Level |
|--------|-------|
| Table density | HIGH |
| Shared-builder coupling | MEDIUM (requires seam discipline) |
| Layout risk | MEDIUM |
| Responsive risk | MEDIUM |
| Test scope | MEDIUM (must prove MarketScreen non-regression) |
| Implementation size | S |

**Does value clearly exceed cost?** **NO**

Proceed only with explicit acceptance of density cost + mandatory external visual gate.

---

## AC. Exact Future Slice Boundary

**In scope:** ICON-001 Runtime Integration — **Market Widget ONLY**

- `mapOperationsMarketRows()` first-cell decoration (or isolated `buildMarketPriceRow` flag used only from this mapper)
- Optional scoped `.pg-market-widget` CSS if runtime gate requires resource-column tuning
- Mapper tests + MarketScreen non-regression tests
- Asset no-delta gate, `build:web`, runtime screenshot, external visual gate

**Out of scope:**

- MarketScreen / `mapMarketPriceRows`
- Site Inventory, Warehouse Detail
- Production, Transport, Contracts, charts, world, tutorials, building panels
- Registry, mapping, sync, source artwork, API, domain, gameplay
- Copying `Res. | Verf.` inventory header contract

---

## AD. Explicit Deferrals

| Surface | Status |
|---------|--------|
| Site Inventory | CLOSED / PASS |
| Warehouse Detail | CLOSED / PASS |
| Market Widget | **AUDITED — OPTION B (ready after one seam decision)** |
| MarketScreen | DEFERRED |
| Production | DEFERRED |
| Transport / Supply Chain | DEFERRED |
| Contracts | DEFERRED |
| Notifications | DEFERRED |
| Charts | DEFERRED |
| World Map | DEFERRED |
| Tutorials | DEFERRED |
| Building panels | DEFERRED |

---

## AE. Remaining Risks / Questions

1. **Shared-builder seam** must be decided and tested before any icon lands in Market rows.
2. **External visual gate** may fail on eight-column density even if Site/Warehouse patterns succeed.
3. **Do not reuse** inventory narrow-table CSS or compact headers for Market without a dedicated Market layout decision.
4. Warehouse **summary** header truncation (`Lagerhaus` / `Zeilen` / `Einheiten`) remains out of scope — analogous risk: Market economic headers should not be abbreviated merely to fit icons.
5. **Value/cost balance is marginal** — deferral remains a valid product decision even when technically ready.

---

## AF. Final Decision

**OPTION B — READY WITH ONE SMALL PRESENTATION DECISION**

**Precise decision required:** how to isolate Market Widget resource-cell decoration from MarketScreen while both use `buildMarketPriceRow()`.

**Recommended:** optional `includeResourceIcon?: boolean` (default `false`) on `buildMarketPriceRow`, enabled only from `mapOperationsMarketRows`.

**Not OPTION A** — value does not clearly exceed cost; layout risk not pre-cleared without runtime gate.

**Not OPTION C** — technically justified deferral remains valid if product owner declines marginal benefit; audit finds no hard blocker.

**Not OPTION D** — widget-only integration is cleanly separable with the recommended seam.

**Not OPTION E/F** — no additional architecture project or data blocker beyond the single seam choice.

---

## V1 Integrity (recheck)

| Tag | Verified |
|-----|----------|
| `v1.0.0` = `c4bb643` | ✓ |
| `v1.0.0-rc.1` = `442665c` | ✓ |
| Tags moved | NO |
| Implementation changes from audit | NONE |

---

**Report path:** `docs/architecture/reviews/POST_V1_ICON_001_MARKET_WIDGET_INTEGRATION_READINESS_DELTA_AUDIT.md`  
**Commit policy:** DO NOT COMMIT (audit artifact only)
