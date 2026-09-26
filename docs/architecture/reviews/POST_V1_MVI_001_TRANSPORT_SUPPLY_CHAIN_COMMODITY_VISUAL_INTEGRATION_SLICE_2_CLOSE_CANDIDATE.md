# POST-V1 MVI-001 — Transport / Supply-Chain Commodity Visual Integration — Slice 2 — Close Candidate

**Prompt:** `docs/development/Prompts/POST_V1_MVI_001_TRANSPORT_SUPPLY_CHAIN_COMMODITY_VISUAL_INTEGRATION_SLICE_2.md`  
**Slice 1 authority:** `docs/architecture/reviews/POST_V1_MVI_001_MARKET_PRICE_ROW_VISUAL_INTEGRATION_SLICE_1_CLOSE_CANDIDATE.md` (@ `da1969c`)  
**Date:** 2026-09-26  
**Final decision:** **OPTION A — MVI-001 SLICE 2 FINAL CLOSE CANDIDATE READY**

**MVI-001 workstream closure candidate:** **YES** — all explicitly scoped commodity-row consumers in Scenario-B reassessment are integrated (inventory/warehouse pre-existing, Slice 1 market, Slice 2 supply-chain transport orders).

No commit / push / tag (per prompt).

---

## A. Executive result

Transport cargo rows in `PGSupplyChainWidget` now show sealed **ICON-001** beside player-facing resource names, using stable `resourceId` from dashboard view-data. Company Operations (detailed layout) and Executive dashboard (compact layout) share the same widget implementation. Transport semantics unchanged.

**Before:** supply-chain rows showed resource labels as plain text.  
**After:** `[ResourceIcon]` + resource label + unchanged route, amount, status, and progress fields.

---

## B. Repository baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD (Slice 1 pushed) | `da1969c708605ff450bad1fdac33d7596f216439` |
| Working tree | Unrelated local edits (shell, doc moves, pilots, saves) — **not absorbed** |

**Task-owned changes:**

- `apps/web/src/presentation/adapters/view-data/company-dashboard-view-data.ts`
- `apps/web/src/presentation/adapters/mappers/company-dashboard-view-mappers.ts`
- `apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.tsx`
- `apps/web/src/presentation/components/dashboard/PGSupplyChainWidget.tsx`
- `apps/web/src/presentation/components/dashboard/dashboard-components.css`
- `apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.test.ts`
- `apps/web/src/presentation/adapters/mappers/company-dashboard-view-mappers.test.ts`
- `tools/capture-mvi-001-slice-2-runtime-evidence.mjs`
- `docs/architecture/reviews/evidence/MVI_001_SLICE_2_*.png`
- `docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md`

---

## C. Runtime consumer audit

| Consumer | Commodity row? | Stable `resourceId`? | Slice 2 |
|----------|----------------|----------------------|---------|
| **Company Operations** — `PGSupplyChainWidget` (`detailed`) via `mapOperationsTransportOrders` | Yes | Yes (added to row view-data) | **Integrated** |
| **Executive dashboard** — `PGSupplyChainWidget` (compact) via `executive-dashboard-view-mappers` → same `TransportOrderRowViewData` | Yes | Yes | **Integrated** |
| **Dedicated `TransportScreen`** — order table columns Route / Status / Fortschritt only | No dedicated cargo column | Detail inspector uses text KV rows | **Audited — no bounded integration** (would require new table column / UX scope) |

---

## D. Existing visual authority reused

| Authority | Path |
|-----------|------|
| ICON-001 (9/9 sealed) | production assets + registry |
| `ResourceIcon` | `ResourceIcon.tsx` |
| Resolver | `resolveResourceIconAssetId` |
| Slice 1 grammar | `pg-resource-cell` + label (48px in supply-chain widget) |

No TRV-001. No duplicate cargo resolvers.

---

## E. Transport data path

```text
GameSessionDashboard.transportOrders[].resourceId
  → buildCompanyDashboardViewData → TransportOrderRowViewData.resourceId + resourceLabel
  → mapOperationsTransportOrders (operations) OR direct pass-through (executive)
  → PGSupplyChainRow.resourceId
  → PGSupplyChainWidget → transportResourceCell → ResourceIcon(resourceId)
```

Presentation-only extension: `resourceId` on `TransportOrderRowViewData` / `PGSupplyChainRow`.

---

## F. Company / Operations Supply-Chain result

- Detailed 7-column layout: first column = icon + resource name; route, amount, recipe, status, duration, progress unchanged.
- Mapper tests + widget render test assert Holz + icon + route/amount preservation.

---

## G. Dedicated TransportScreen result

**Not applicable.** The primary order list does not expose a cargo/resource column; integration there would be new UX, out of slice scope. Transport detail panel remains text KV (including resource name string).

---

## H. Executive / dashboard transport result

**Integrated.** `ExecutiveDashboardScreen` passes `dashboard.transportOrders` into the same `PGSupplyChainWidget`; compact column order keeps resource as second column with identical icon grammar.

---

## I. Resource coverage

`ICON_001_RESOURCE_IDS` (9/9) unchanged. Runtime evidence shows **wood** cargo (warehouse → sawmill transport seeded for capture). Mapper/view-data tests preserve `resourceId` for known resources.

---

## J. Unknown / fallback behavior

Same as Slice 1: `ResourceIcon` → `null` when unregistered; label remains. Widget test covers `unknown_resource` without decorative image.

---

## K. MVI-001 Slice 1 regression verification

- Shared CSS adds **supply-chain-only** rules; market rules unchanged (56px).
- `buildMarketPriceRow` untouched.
- Full `pnpm test` PASS including existing market mapper icon tests.

---

## L. Desktop runtime evidence

**Path:** `docs/architecture/reviews/evidence/MVI_001_SLICE_2_TRANSPORT_DESKTOP.png` (1440×900, executive dashboard Lieferkette widget)

**Findings:** Holz ICON-001 visible beside label; route `Lager → Closeout Sawmill`; amount/status/progress readable; no broken images.

**Supplement:** `MVI_001_SLICE_2_SUPPLY_CHAIN_WIDGET.png` (widget crop).

Capture seeds runtime session via E2E save + market buy + sawmill production start to materialize an in-progress wood transport (presentation unchanged).

---

## M. Narrow runtime evidence

**Path:** `docs/architecture/reviews/evidence/MVI_001_SLICE_2_TRANSPORT_NARROW.png` (480×900)

**Findings:** Icon + truncated label usable; route and numeric columns remain interpretable; no clipping observed on cargo icon.

---

## N. Focused tests

| Command | Result |
|---------|--------|
| `pnpm exec vitest run apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.test.ts apps/web/src/presentation/adapters/mappers/company-dashboard-view-mappers.test.ts` | **18 passed** |
| Full `pnpm test` | **275 files / 1028 tests passed** |

---

## O. Root quality gates

| Gate | Result |
|------|--------|
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS (**0 errors**, 144 pre-existing warnings) |
| `pnpm test` | PASS (1028 tests) |
| `pnpm build:web` | PASS |

---

## P. Gameplay / content firewall

Confirmed unchanged: transport creation rules, routes, amounts, progress formulas, production triggers, market buy semantics used only in evidence seeding against dev save (not product logic changes). **No domain/API contract changes** beyond presentation view-data field.

---

## Q. Scenario-B accounting

| Item | Value |
|------|--------|
| New authored concepts | **0** |
| ICON-001 reused | **9/9** |
| Primary / compact counts | **unchanged** |
| MVI-001 workstream | **CLOSED / PASS / SEALED** (commodity-row integration backlog cleared) |
| Scenario B overall | **IN PROGRESS** (other deferred families remain) |

---

## R. Remaining MVI-001 scope

No further **explicitly scoped** MVI-001 commodity-row consumers remain in inventory/reassessment. Optional future polish (e.g. `TransportScreen` detail KV decoration) is **outside** the sealed MVI-001 commodity-row scope.

---

## S. Final decision

**OPTION A — MVI-001 SLICE 2 FINAL CLOSE CANDIDATE READY**

Capture: `node tools/capture-mvi-001-slice-2-runtime-evidence.mjs` with API + web running; default `PG_WEB_ORIGIN=http://127.0.0.1:3000`.
