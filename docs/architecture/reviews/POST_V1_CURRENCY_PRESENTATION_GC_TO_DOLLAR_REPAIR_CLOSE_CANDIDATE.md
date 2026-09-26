# POST-V1 Currency Presentation — GC → $ Repair Close Candidate

**Workstream:** POST-V1-CURRENCY-PRESENTATION-GC-TO-DOLLAR  
**Date:** 2026-09-26  
**Authority:** `docs/development/Prompts/POST_V1_CURRENCY_PRESENTATION_GC_TO_DOLLAR_REPAIR.md`  
**Baseline HEAD (unchanged commit):** `f721e52` on `master` (working-tree implementation only; **no commit** per prompt)

---

## A. Executive result

Player-facing monetary copy now uses **`$`** with **unchanged de-DE numeric formatting** (`1.250 $` pattern). Internal domain and persisted currency code **`GC`** is retained; presentation maps `GC` → `$` at format time.

**Final decision:** **OPTION A — CURRENCY PRESENTATION REPAIR COMPLETE**

---

## B. Repository baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD (last commit) | `f721e52` |
| Unrelated working tree | Player guidance reassessment doc, shell/simulation WIP, doc moves, pilots, saves — **not modified by this task** |
| Commit / push / tag | **None** (awaiting independent review) |

---

## C. GC occurrence audit (pre-repair)

| Class | Approx. count | Examples |
|-------|---------------|----------|
| **A — Player-facing runtime** | ~35 | KPI labels, market rows, charts, hints, blockers |
| **B — Central authority** | 1 primary | `formatCurrency` default `GC` |
| **C — Presentation tests** | ~45 | Mapper/screen expectations with ` GC` |
| **D — Domain / API** | Many | `DEFAULT_CURRENCY = 'GC'`, finance DTO `currency: 'GC'` |
| **E — Saves / fixtures** | Many | `"currency": "GC"` in e2e saves |
| **F — Docs / prompts** | Many | Historical reviews (unchanged) |
| **G — Evidence / tools** | Few | WFV evidence SVG labels (unchanged) |
| **H — False positives** | — | — |

**Meaningful pre-repair player-facing occurrences:** ~**35** active runtime format sites + **5** server-generated hint strings in `GameSessionDashboardBuilder`.

---

## D. Currency presentation authority

| Question | Answer |
|----------|--------|
| Shared `formatCurrency`? | **YES** — `apps/web/src/presentation/formatting/presentation-formatters.ts` |
| Symbol centrally configured? | **NOW YES** — `PLAYER_FACING_CURRENCY_SYMBOL = '$'` + `toPlayerFacingCurrencySymbol()` maps internal `GC` |
| Manual `GC` append? | **Was widespread** in mappers/charts; **repaired** to use `formatCurrency` / `formatSignedCurrencyWithSymbol` |
| Multiple formatters? | Web central + small **application** helper for German hint strings |
| Tests establish contract? | **YES** — new `presentation-formatters.test.ts` |
| Domain encodes `GC`? | **YES** — semantic identifier; **unchanged** |

**Application hint authority:** `src/application/facade/player-facing-currency-format.ts` — `formatPlayerFacingCurrencyAmount()` for dashboard hint `reason` strings (still numeric-only domain values).

---

## E. Implementation

**Option 1 (primary):** Central web formatter maps internal `GC` → `$`; default parameter remains `'GC'` for API compatibility.

**Option 2 (bounded):** Application facade helper for server-built German copy (construction/research/market/hire costs, tutorial line).

**Consumers updated:** `company-dashboard-view-mappers.ts`, `company-operations-table-mappers.tsx`, `workspace-view-mappers.ts`, `PGTickHistoryCharts.tsx`, `PGMarketPriceHistoryChart.tsx`, `PGMarketWidget.tsx`, `GameSessionDashboardBuilder.ts`.

**Not changed:** `Money.ts`, save JSON, YAML costs, API field names, historical docs/evidence.

---

## F. Player-facing consumers changed

- Executive / company KPI strip (`availableCashLabel`, payroll, tax labels)
- Hire sidebar costs, economy contracts, employee salaries
- Finance ledger / transaction inspector labels
- Market price tables (operations + regional market screen)
- Market widget subtitle (min. fee)
- Cash / market history charts (tooltips & axes)
- Dashboard hint blockers (build, research, market buy, hire)
- Tutorial copy (125 $ example)

---

## G. Domain / economy / save / API firewall

| Layer | Changed? |
|-------|----------|
| Monetary amounts / prices | **NO** |
| Domain `DEFAULT_CURRENCY` | **NO** (`GC`) |
| Finance DTO / save `currency` field | **NO** (`GC`) |
| API contracts | **NO** |
| Save migration | **NO** |

---

## H. Number-format preservation

| Case | Before | After |
|------|--------|-------|
| Positive | `1.250 GC` | `1.250 $` |
| Zero | `0 GC` | `0 $` |
| Negative (signed) | `−500 GC` / `-50 GC` | `−500 $` / `-50 $` |
| Large | `1.250.000 GC` | `1.250.000 $` |
| Placement | trailing marker after de-DE number | **unchanged** |

No US `$1,250` conversion. No precision/locale change.

---

## I. Focused tests

- **New:** `apps/web/src/presentation/formatting/presentation-formatters.test.ts` — positive, zero, negative, large, unknown code passthrough
- **Updated:** Mapper/screen tests expecting `$` in labels (15+ files); `company-operations-table-mappers.test.ts` market/ledger expectations
- **Incidental fix:** `company-overview-view-mappers.test.ts` region fixture `biomeName` / `biomeCategory` (unblocks typecheck on touched file; API DTO alignment only)

---

## J. Runtime evidence

Automated (no new screenshot artifacts):

- `MarketScreen.test.tsx` — cell `12 $`, header cash `100.000 $`
- `presentation-formatters.test.ts` — formatter contract
- `company-operations-table-mappers.test.ts` — market row price column `12 $`
- `BuildingsScreen.test.tsx` — KPI cash label uses `$` in fixture-driven render

Manual browser capture: **not required** for close candidate; tests cover representative KPI, market price, and formatter surfaces.

---

## K. Root quality gates

| Gate | Result |
|------|--------|
| `pnpm typecheck` | **PASS** |
| `pnpm lint` | **PASS** |
| `pnpm test` | **PASS** — 276 files, **1033** tests |
| `pnpm build:web` | **PASS** |

---

## L. Residual GC scan (post-repair, active code)

| Location | Legitimate? | Why |
|----------|-------------|-----|
| `presentation-formatters.ts` | **YES** | Maps internal `GC` → `$` |
| `company-dashboard-view-mappers.ts` `?? 'GC'` | **YES** | Internal code from API |
| `company-dashboard-view-data.ts` empty default | **YES** | Internal view-data default |
| Test fixtures `currency: 'GC'` | **YES** | Simulates API semantics |
| `src/domain/shared/Money.ts` | **YES** | Domain identifier |
| Saves / e2e JSON | **YES** | Persistence contract |
| `GameSessionDashboardBuilder.test.ts` finance fixture | **YES** | API shape |
| Historical docs / prompts / evidence | **YES** | Not player runtime |

**Active player-facing `GC` in runtime UI paths:** **NONE** identified.

---

## M. Diff scope

Task-owned (implementation):

- `apps/web/src/presentation/formatting/presentation-formatters.ts` (+ `.test.ts`)
- `apps/web/src/presentation/adapters/mappers/company-dashboard-view-mappers.ts`
- `apps/web/src/presentation/adapters/mappers/company-operations-table-mappers.tsx` (+ `.test.ts`)
- `apps/web/src/presentation/adapters/mappers/workspace-view-mappers.ts`
- `apps/web/src/presentation/components/dashboard/charts/PGTickHistoryCharts.tsx`
- `apps/web/src/presentation/components/dashboard/charts/PGMarketPriceHistoryChart.tsx`
- `apps/web/src/presentation/components/dashboard/PGMarketWidget.tsx`
- `src/application/facade/player-facing-currency-format.ts`
- `src/application/facade/GameSessionDashboardBuilder.ts`
- Presentation test updates (currency display expectations)
- This close candidate report

**Not included:** Player guidance reassessment, ICON-003, shell/simulation churn, assets, YAML, saves.

---

## N. Final decision

## OPTION A — CURRENCY PRESENTATION REPAIR COMPLETE

> **CURRENCY PRESENTATION:** `$`

> **NUMBER FORMAT:** `UNCHANGED`

> **ECONOMY VALUES:** `UNCHANGED`

> **SAVE COMPATIBILITY:** `UNCHANGED`

> **NEW ART:** `NONE`

> **READY FOR INDEPENDENT REVIEW:** `YES`

---

## Required factual questions (§31)

1. Meaningful `GC` before repair: **~80+** classified (see §C); **~40** active presentation + tests  
2. Active player-facing runtime: **~35** sites + **5** hint strings  
3. Central authority before? **Partial** (`formatCurrency` existed but symbol was `GC`)  
4. Authority now: **`formatCurrency` / `toPlayerFacingCurrencySymbol`** + **`formatPlayerFacingCurrencyAmount`** for hints  
5. Internal `GC` retained? **YES**  
6. Serialized save `GC` retained? **YES**  
7. API contracts changed? **NO**  
8. Gameplay YAML amounts changed? **NO**  
9. Number formatting changed? **NO** (marker only)  
10. Symbol placement changed beyond marker? **NO**  
11. Surfaces verified: KPI cash, market price cell, finance ledger mapper, formatter unit tests  
12. Active player-facing `GC` remains? **NO**  
13. Residual categories: domain, saves, tests simulating API, docs (§L)  
14. New art? **NO**  
15. Scenario-B reopened? **NO**  
16. Quality gates green? **YES**

# END
