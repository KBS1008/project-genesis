# POST-V1 MVI-001 — Market Price Row Visual Integration — Slice 1 — Close Candidate

**Prompt:** `docs/development/Prompts/POST_V1_MVI_001_MARKET_PRICE_ROW_VISUAL_INTEGRATION_SLICE_1.md`  
**Reassessment:** `docs/architecture/reviews/POST_V1_SCENARIO_B_VISUAL_COVERAGE_REASSESSMENT_AFTER_MSV_001.md`  
**Date:** 2026-09-26  
**Final decision:** **OPTION A — MVI-001 SLICE 1 FINAL CLOSE CANDIDATE READY**

No commit / push / tag (per prompt).

---

## A. Executive result

Market price rows on the Company Operations **Markt** widget and the dedicated **Regionaler Markt** screen now show sealed **ICON-001** artwork beside player-facing resource names, using the same `buildMarketPriceRow` mapper path as before for all economic columns. Presentation only; runtime evidence and root gates pass.

**Before:** resource column = translated label text only.  
**After:** `[ResourceIcon]` + player-facing resource label + unchanged price/supply/demand/trend/volume cells.

---

## B. Repository baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD | `461090b4843f0ca54e95317bd0ea4dbf86ec8bac` |
| Reassessment anchor | `461090b` (unchanged at slice start) |
| Working tree | Unrelated pre-existing edits (shell, doc moves/deletes, pilots, saves) — **not absorbed** |

**Task-owned changes:**

- `apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.tsx`
- `apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.test.ts`
- `apps/web/src/presentation/components/dashboard/dashboard-components.css`
- `tools/capture-mvi-001-slice-1-runtime-evidence.mjs`
- `docs/architecture/reviews/evidence/MVI_001_SLICE_1_*.png`
- `docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md` (minimal delta)
- `tools/verify-msv-001-production-resolution.mjs` — removed unused `PUBLIC` constant (**lint gate only**, no MSV reopen)

---

## C. Scope

| Surface | Component / mapper | Changed |
|---------|-------------------|---------|
| Company Operations market table | `PGMarketWidget` ← `mapOperationsMarketRows` ← `buildMarketPriceRow` | Yes |
| Dedicated market screen | `MarketScreen` ← `mapMarketPriceRows` ← `buildMarketPriceRow` | Yes |
| Transport / supply chain | — | **Out of scope** |

---

## D. Existing visual authority reused

| Authority | Path |
|-----------|------|
| ICON-001 (9/9 sealed) | `apps/web/public/assets/resources/` + registry |
| `ResourceIcon` | `apps/web/src/presentation/components/assets/ResourceIcon.tsx` |
| Resolver | `resolveResourceIconAssetId` / `resource-icon-asset-ids.ts` |
| Registry | `visual-asset-registry.ts` |

No new art. No duplicate `marketResourceIconMap`.

---

## E. Data-path changes

- `MarketPriceRowSource` already carried `resourceId` + `resourceLabel`; no API/domain change.
- `buildMarketPriceRow` first cell: `pg-resource-cell` with `<ResourceIcon resourceId={…} />` + label span (same pattern as site inventory / warehouse detail).
- `searchText` still indexes label and numeric fields; column order unchanged.

---

## F. Company Operations Market result

- `CompanyOperationsPanels` / `CompanyOperationsInspector` consume `mapOperationsMarketRows` → updated rows show icons at **56×56px** CSS footprint under `.pg-market-widget`.
- Economic cells unchanged (German locale formatting preserved).

---

## G. Dedicated MarketScreen result

- `MarketScreen` uses `PGMarketWidget` with `mapMarketPriceRows`; identical resource cell grammar.
- Regional selector and trade UI untouched.

---

## H. Resource coverage

Enabled resources (9/9) per `ICON_001_RESOURCE_IDS`:

`wood`, `planks`, `stone`, `iron_ore`, `steel`, `machine_parts`, `advanced_electronics`, `industrial_machinery`, `consumer_goods`

Mapper test asserts each ID resolves via `resolveResourceIconAssetId`. Runtime capture shows multiple distinct ICON-001 assets loaded in the market table.

---

## I. Unknown / fallback behavior

- `ResourceIcon` returns `null` when registry resolution fails; label span still renders (same as warehouse unknown-resource test pattern).
- Added `mapMarketPriceRows` unknown-resource test — no crash, no decorative image.

---

## J. Desktop runtime evidence

**Path:** `docs/architecture/reviews/evidence/MVI_001_SLICE_1_MARKET_DESKTOP.png` (1440×900, `screen=markets`)

**Findings:** ICON-001 visible on all listed commodities; names adjacent to icons; price/trend columns readable; no broken images; table remains data-first.

**Supplement:** `MVI_001_SLICE_1_COMPANY_MARKET_WIDGET.png` — Company Operations Markt widget with matching grammar.

---

## K. Narrow runtime evidence

**Path:** `docs/architecture/reviews/evidence/MVI_001_SLICE_1_MARKET_NARROW.png` (480×900)

**Findings:** Icons scale appropriately; resource names ellipsize without overlapping prices; horizontal scroll on table acceptable pre-existing pattern; no clipped artwork observed.

---

## L. Focused tests

| Command | Result |
|---------|--------|
| `pnpm exec vitest run apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.test.ts` | **12 passed** |
| Full `pnpm test` | **275 files / 1025 tests passed** |

New/updated cases: `mapMarketPriceRows` icon cell, `mapOperationsMarketRows`, unknown safety, ICON-001 ID resolution loop.

---

## M. Root gates

| Gate | Result |
|------|--------|
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS (**0 errors**, 144 pre-existing warnings) |
| `pnpm test` | PASS (1025 tests) |
| `pnpm build:web` | PASS |

---

## N. Gameplay / content firewall

Confirmed unchanged: market prices, formulas, supply/demand, trends, trade rules, resource definitions, regional economics, save/simulation behavior. **Presentation-only.**

---

## O. Scenario-B accounting

| Item | Value |
|------|--------|
| New authored concepts | **0** |
| ICON-001 reused | **9/9** (existing production assets) |
| Scenario B status | **IN PROGRESS** |
| Master inventory | Updated minimally (`GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md`) |

---

## P. Remaining MVI-001 scope

**Slice 2 (future):** transport cargo / `PGSupplyChainWidget` / executive transport tables — explicitly **not** part of Slice 1.

---

## Q. Final decision

**OPTION A — MVI-001 SLICE 1 FINAL CLOSE CANDIDATE READY**

Capture script: `node tools/capture-mvi-001-slice-1-runtime-evidence.mjs` with dev servers running; prefer `PG_WEB_ORIGIN=http://127.0.0.1:3000` on Windows if `localhost` resolves to IPv6 first.
