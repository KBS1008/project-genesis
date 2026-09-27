# POST-V1 TIME-UX-R1 — Player-Facing Tick Terminology Residual Closure — Close Candidate

## A. Executive result

**TIME-UX-R1:** `COMPLETE` (implementation + runtime evidence)

Player-facing `Tick` / `Ticks` copy on the approved dashboard, chart, builder-hint, and same-family surfaces is replaced with **`Zyklus` / `Zyklen`**. The **Production auto-transport estimate** (`~N Ticks` → `~N Zyklen`) is now certified on the real Production runtime path (see **Runtime evidence completion** below).

---

## Runtime evidence completion (2026-09-27)

Independent review gap: first Production screenshot used PGD-RES-001 fixture state that shows **missing-input** copy, not the **inbound auto-transport estimate** from `GameSessionDashboardBuilder.#readProductionHints`.

**Why prior Production evidence was insufficient:** PGD-RES-001 sets on-site `wood` to `0` with **empty warehouse**, so `needsInboundTransport` is false and the builder emits **`Benötigt … Holz`**, not `Material im Lagerhaus — Transport startet automatisch (~N …)`.

**Real runtime condition traced:**

| Item | Detail |
|---|---|
| Originating method | `GameSessionDashboardBuilder.#readProductionHints` |
| Visibility | `canStart === true` and `reason` set when on-site inventory insufficient **and** `TransportLogisticsService.needsInboundTransport` is true (warehouse can fulfill recipe) |
| Recipe | `recipe_planks` — **Bretter herstellen** (`wood` ×10) |
| Building | Active `sawmill` (`building_005` — Closeout Sawmill) |
| Warehouse | Active `warehouse` (`building_002`) with stored `wood` |
| Duration source | `TransportLogisticsService.resolveInboundTransportDurationTicks(companyId, destinationBuildingId)` → route duration from warehouse→sawmill positions (fallback `5` if unresolved) |
| Internal field | Inbound route **`durationTicks`** (presentation consumes this numeric value only) |

**Evidence-state source:** deterministic transform of `saves/e2e-m11-phase6-production-closeout.json` → `tools/evidence-fixtures/time-ux-r1-production-auto-transport-hint.json` (builder: `tools/build-time-ux-r1-auto-transport-evidence-fixture.mjs`).

| State field changed for evidence | Original | Evidence value | Why | Semantic rule changed? |
|---|---|---|---|---|
| `inventories[company_001].wood.quantity` | 10 | 0 | On-site insufficient for recipe | NO |
| `inventories[company_001].wood.reserved` | 10 | 0 | Clear on-site availability | NO |
| `buildingStorages[building_002].items[wood]` | empty | 30 | Warehouse fulfills recipe → inbound transport path | NO |

**Numeric integrity (certified case):**

| Field | Value |
|---|---|
| Recipe / operation | `recipe_planks` @ `building_005` |
| Internal duration field | `resolveInboundTransportDurationTicks` → route `durationTicks` |
| Internal numeric N | **9** |
| Visible numeric N | **9** |
| Before terminology | `~N Ticks` (semantic family) |
| Runtime terminology | **`~9 Zyklen`** |
| Numeric value changed? | **NO** |

**Exact visible auto-transport hint (scoped Production hint span):**

> `Material im Lagerhaus — Transport startet automatisch (~9 Zyklen).`

**Scoped Tick/Ticks:** absent. **Approximation `~`:** preserved.

**Screenshot:** `docs/architecture/reviews/evidence/TIME_UX_R1_PRODUCTION_AUTO_TRANSPORT_CYCLE_HINT_DESKTOP_1440x900.png`

**Capture tooling:** `tools/capture-time-ux-r1-production-auto-transport-runtime-evidence.mjs` (loads fixture via `POST /api/session/load` before `/game?screen=production`; programmatic assertions on `/api/dashboard` + scoped `.pg-operation-hint-copy span`).

**Programmatic proof:** `src/application/facade/time-ux-r1-auto-transport-evidence.test.ts` (loads same fixture; asserts internal N equals formatted reason; no `Tick/Ticks` in reason string).

**Implementation freeze during evidence completion:** `player-cycle-presentation.ts`, `player-facing-cycle-label.ts`, `GameSessionDashboardBuilder.ts`, mappers, charts — **unchanged in this pass**. Only evidence fixture builder, capture script, evidence test, PNG, and this report delta.

**PRODUCTION IMPLEMENTATION CHANGED DURING EVIDENCE COMPLETION:** `NO`

**PGD-RES-001 on this surface:** not co-present with auto-transport hint (by design); PGD-RES regression remains covered by existing `GameSessionDashboardBuilder` / PGD-RES tests and prior PGD-RES runtime evidence.

---

## B. Repository baseline

| Item | Value |
|---|---|
| Branch | `master` (local implementation; **not committed** per slice rules) |
| HEAD | `7f36b0c5cefb4cdd37b28a7541b65b9127b90a10` |
| HEAD subject | PGD-002-S1 lint repair (`console` global in evidence fixture builder) |
| `origin/master` | Same SHA as HEAD |
| PGD-RES-001 (`d472791`) | Present in ancestry |
| PGD-002-S1 lint repair (`7f36b0c`) | Present in ancestry |
| Unrelated WIP | Shell tweaks, building pilots, saves, `.next`, doc deletes — **excluded** from this slice |

Baseline root health was green before implementation; post-implementation gates re-run below.

---

## C. Approved player-facing time contract

- **Player unit:** `Zyklus` / `Zyklen`
- **Mapping:** `1 Zyklus = 1 internal simulation tick` (presentation only)
- **Authority (web):** `apps/web/src/presentation/formatting/player-cycle-presentation.ts`
- **Authority (application hints):** `src/application/facade/player-facing-cycle-label.ts`

---

## D. Pre-fix Tick/Ticks residual audit

| ID | Surface | Before (representative) | Classification | Action |
|---|---|---|---|---|
| T1 | Company header / `tickLabel` | `Tick N` | TIME-A | `formatPlayerCyclePosition` |
| T2 | KPI payroll | `Payroll / 10 Ticks` | TIME-A | `formatPlayerDuration(10)` |
| T3 | KPI tax / economy hints | `alle N Ticks` | TIME-A | `formatPlayerCycleIntervalEvery` |
| T4 | Economy contracts | `N Ticks` interval | TIME-A | `formatPlayerDuration` |
| T5 | Inspector construction / transport | `N Ticks` duration | TIME-A | `formatPlayerDuration` |
| T6 | Finance ledger timestamps | raw tick number | TIME-A | `formatPlayerCyclePosition` |
| T7 | Operations economy subtitle | `alle N Ticks` | TIME-A | interval helper |
| T8 | Executive summary / toolbar | `Tick ${tickLabel}` | TIME-A | use full cycle position label |
| T9 | Chart empty hints (6 widgets + default) | `Ticks` / `Simulation-Ticks` | TIME-A | natural Zyklus German |
| T10 | Chart tooltips (6 widgets) | `Tick ${label}` | TIME-A | `formatPlayerCycleChartTooltipLabel` |
| T11 | Production auto-transport hint (builder) | `~N Ticks` | TIME-A | `formatApproximatePlayerFacingCycleDuration` |
| T12 | Tutorial economy steps (builder) | `20 Ticks` / `30 Ticks` | TIME-A | cycle interval/count helpers |
| T13 | Supply chain column | `Dauer (Ticks)` | TIME-A | `Dauer (Zyklen)` |
| T14 | Market / Reports / Load game labels | `Tick` column/header | TIME-A | `Zyklus` + formatted labels |
| T15 | Workspace event/save labels | numeric tick only | TIME-A | `formatPlayerCyclePosition` |
| — | Simulation controls / recipe catalog | already Zyklus | TIME-B | unchanged |
| — | `tickNumber`, `durationTicks`, DTO fields | internal | TIME-C | unchanged |

**Active TIME-A count (pre-fix, approved family):** 15 groups / **~45 string sites** (charts counted per widget).

---

## E. Presentation authority

Extended `player-cycle-presentation.ts`:

- `formatPlayerCycleIntervalEvery`
- `formatApproximatePlayerCycleDuration`
- `formatPlayerCycleChartTooltipLabel`

Application mirror for builder-only hints: `player-facing-cycle-label.ts` (+ tests).

---

## F. Implementation

- **Company:** `company-dashboard-view-mappers.ts`
- **Operations tables:** `company-operations-table-mappers.tsx`
- **Executive:** `executive-dashboard-view-mappers.ts`, `ExecutiveDashboardScreen.tsx`
- **Charts:** `PG*HistoryChart.tsx`, `PGTickHistoryCharts.tsx`, `PGChartWidget.tsx`
- **Builder hints:** `GameSessionDashboardBuilder.ts` (transport + tutorial economy copy only)
- **Same-family:** `workspace-view-mappers.ts`, `MarketScreen.tsx`, `ReportsScreen.tsx`, `LoadGamePanel.tsx`, `PGSupplyChainWidget.tsx`

---

## G. Singular / plural behavior

| Pattern | Presentation |
|---|---|
| `1` | `1 Zyklus` |
| `N ≠ 1` | `N Zyklen` |
| Absolute position | `Zyklus N` |
| Interval | `alle N Zyklen` |
| Approximate duration | `~N Zyklen` / `~1 Zyklus` |
| Per-step rate | `{value} / Zyklus` (unchanged) |

---

## H. Company / Operations repair

Header, KPI strip, economy section, inspector durations, ledger timestamps, and operations economy subtitle now use cycle terminology. Runtime sample (1440×900): **`Zyklus 131`**, operations KPI copy includes **`alle … Zyklen`** / payroll cycle phrasing (see screenshot).

---

## I. Executive repair

`companySummary` and toolbar subtitle use **`Zyklus N`** without a redundant `Tick` prefix.

---

## J. Chart repair

Empty-state hints use **“Führen Sie Zyklen aus …”**; tooltips use **`Zyklus N`**. Runtime tooltip certified: **`Zyklus 76`** (hover on executive/operations chart).

---

## K. Dashboard / Production hint repair

- Builder transport estimate: **`Material im Lagerhaus — Transport startet automatisch (~N Zyklen)`** via `formatApproximatePlayerFacingCycleDuration` (parentheses + `~` preserved from pre-fix copy).
- Tutorial NPC/tax steps: **`alle 20 Zyklen`**, **`Alle 30 Zyklen`**.
- **Production auto-transport runtime:** certified with dedicated fixture (see Runtime evidence completion); prior generic Production screenshot (`TIME_UX_R1_PRODUCTION_CYCLE_HINT_*`) remains historical context for PGD-RES-adjacent state only.

---

## L. Post-fix residual audit

| Occurrence | Classification | Player-facing defect remains? |
|---|---|---|
| Approved mapper/chart/builder copy | TIME-B / repaired | **No** |
| Internal `*Ticks*` field names | TIME-C | N/A (not player copy) |
| Test fixture strings updated to Zyklus | TIME-D | N/A |

**Unresolved TIME-A in approved family:** `0`

---

## M. Runtime — Company

| Field | Value |
|---|---|
| State | Loaded `tools/evidence-fixtures/pgd-res-001-production-resource-label.json` |
| Observed copy | `Zyklus 131`; operations KPI interval/payroll cycle phrasing |
| Raw Tick/Ticks in scoped UI | No |
| Evidence | `docs/architecture/reviews/evidence/TIME_UX_R1_COMPANY_CYCLE_TERMINOLOGY_DESKTOP_1440x900.png` |

---

## N. Runtime — Production

| Field | Value |
|---|---|
| State | `tools/evidence-fixtures/time-ux-r1-production-auto-transport-hint.json`; `/game?screen=production` |
| Recipe / building | **Bretter herstellen** @ **Closeout Sawmill** (`recipe_planks` / `building_005`) |
| Internal N | **9** ticks (`resolveInboundTransportDurationTicks`) |
| Observed scoped hint | `Material im Lagerhaus — Transport startet automatisch (~9 Zyklen).` |
| Scoped Tick/Ticks | **No** |
| Evidence | `docs/architecture/reviews/evidence/TIME_UX_R1_PRODUCTION_AUTO_TRANSPORT_CYCLE_HINT_DESKTOP_1440x900.png` |

**PRODUCTION AUTO-TRANSPORT RUNTIME:** `PASS`

(Supplemental: `TIME_UX_R1_PRODUCTION_CYCLE_HINT_DESKTOP_1440x900.png` from first pass — PGD-RES missing-input state, not auto-transport estimate.)

---

## O. Runtime — Chart

| Field | Value |
|---|---|
| State | Company route; chart hover |
| Observed copy | Tooltip **`Zyklus 76`** |
| Evidence | `docs/architecture/reviews/evidence/TIME_UX_R1_CHART_CYCLE_TERMINOLOGY_DESKTOP_1440x900.png` |

---

## P. Narrow viewport

480×900 company/operations spot-check: **`Zyklus 131`** readable; no task-owned horizontal overflow observed.

Evidence: `docs/architecture/reviews/evidence/TIME_UX_R1_CYCLE_TERMINOLOGY_NARROW_480x900.png`

---

## Q. Gameplay / Simulation / Save / API firewalls

| Area | Changed? |
|---|---|
| Simulation cadence / speed | No |
| Durations / intervals (numeric) | No |
| Save schema / API DTOs | No |

Evidence tooling: **load save + navigate only** (see `tools/capture-time-ux-r1-cycle-terminology-runtime-evidence.mjs`).

---

## R. PGD / deferred-family firewalls

| Area | Changed? |
|---|---|
| PGD-001 / PGD-TECH-001 / PGD-002-S1 / PGD-RES-001 semantics | No (resource labels verified at runtime) |
| Transport **status** enums | No |
| Research **status** enums | No |
| Building **category** enums | No |
| PDM / Tutorial navigation / art | No |

---

## S. Focused tests

Added/updated: `player-cycle-presentation.test.ts`, `player-facing-cycle-label.test.ts`, company/operations/executive mapper tests, `chart-components.test.tsx`, `GameSessionDashboardBuilder.test.ts` (tutorial cycle copy), **`time-ux-r1-auto-transport-evidence.test.ts`** (evidence completion). Sealed regressions: `SimulationControlsBar.test.tsx`, `GameWorkspaceShell.test.tsx`, `ProductionScreen.test.tsx` — still pass in full suite.

---

## T. Root quality gates

| Gate | Result |
|---|---|
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS (0 errors; 144 existing warnings) |
| `pnpm test` | PASS — **1058** tests |
| `pnpm build:web` | PASS |

---

## U. Diff ownership

| File | Why changed | Presentation only? |
|---|---|---|
| `player-cycle-presentation.ts` (+ test) | Central cycle grammar | Yes |
| `player-facing-cycle-label.ts` (+ test) | Builder hint mirror | Yes |
| Company / executive / operations mappers (+ tests) | Dashboard copy | Yes |
| Chart components (+ test) | Tooltip / empty hints | Yes |
| `GameSessionDashboardBuilder.ts` (+ test) | Hint strings | Yes |
| Market / Reports / Load / workspace mappers | Same-family labels | Yes |
| `PGSupplyChainWidget.tsx` | Column header | Yes |
| `tools/capture-time-ux-r1-cycle-terminology-runtime-evidence.mjs` | Runtime certification | Tooling |
| `tools/build-time-ux-r1-auto-transport-evidence-fixture.mjs` | Auto-transport evidence save | Tooling |
| `tools/capture-time-ux-r1-production-auto-transport-runtime-evidence.mjs` | Production auto-transport capture | Tooling |
| `time-ux-r1-auto-transport-evidence.test.ts` | Fixture + numeric integrity | Test (evidence) |
| Evidence PNGs (5) | Certification | Evidence |

---

## V. Deferred issues

- Raw transport/research/building **status** presentation (separate slices).
- PDM-001 (product contract).
- General i18n beyond cycle unit.

---

## W. Final decision

### OPTION A — TIME-UX-R1 RUNTIME EVIDENCE COMPLETE

> **TIME-UX-R1 RUNTIME EVIDENCE:** `COMPLETE`  
> **TIME-UX-R1 (implementation):** `COMPLETE`  
> **PRODUCTION AUTO-TRANSPORT RUNTIME:** `PASS`  
> **INTERNAL DURATION:** `9 TICK(S)`  
> **PLAYER-FACING PRESENTATION:** `Material im Lagerhaus — Transport startet automatisch (~9 Zyklen).`  
> **NUMERIC VALUE:** `UNCHANGED`  
> **SCOPED TICK/TICKS:** `ABSENT`  
> **PRODUCTION IMPLEMENTATION CHANGED DURING EVIDENCE COMPLETION:** `NO`  
> **PLAYER-FACING TIME UNIT:** `ZYKLUS / ZYKLEN`  
> **PRESENTATION MAPPING:** `1 ZYKLUS = 1 INTERNAL TICK`  
> **UNRESOLVED ACTIVE TIME-A OCCURRENCES:** `0`  
> **SIMULATION / BALANCE:** `UNCHANGED`  
> **SAVE / API:** `UNCHANGED`  
> **COMPANY RUNTIME:** `PASS`  
> **CHART RUNTIME:** `PASS`  
> **NARROW VIEWPORT:** `PASS`  
> **PGD-RES-001:** `UNCHANGED / REGRESSION PASS`  
> **COMPANY / CHART / NARROW EVIDENCE:** `PREVIOUS PASS REMAINS VALID`  
> **TRANSPORT STATUS ENUMS:** `UNCHANGED / DEFERRED`  
> **NEW ART:** `NONE`  
> **SCENARIO-B:** `REMAINS PAUSED`  
> **ROOT GATES:** `PASS` (1058 tests)  
> **READY FOR INDEPENDENT FINAL CLOSURE:** `YES`

---

## Semantic before/after (representative)

| Surface | Internal value | Before | After | Value changed? |
|---|---:|---|---|---|
| Company position | 131 | `Tick 131` | `Zyklus 131` | NO |
| Tax interval | 10 | `alle 10 Ticks` | `alle 10 Zyklen` | NO |
| Payroll interval | 10 | `… / 10 Ticks` | `… / 10 Zyklen` | NO |
| Chart tooltip | 76 | `Tick 76` | `Zyklus 76` | NO |
| Transport hint | 9 | `~9 Ticks` | `~9 Zyklen` | NO |

---

## Required factual answers (abbreviated)

1. Branch: `master` (uncommitted worktree).  
2. HEAD: `7f36b0c`.  
3. HEAD matches `origin/master`: **Yes**.  
4–5. PGD-RES-001 and lint repair: **Yes** in history.  
6. Baseline green: **Yes**.  
7. Formatter: `player-cycle-presentation.ts` (+ application mirror for builder).  
8. Unit: **Zyklus / Zyklen**.  
9–10. 1:1 tick mapping; **no conversion factor**.  
11–12. ~45 sites / families A–E + same-family.  
13. None removed from product; all active at audit time.  
14. Market, Reports, Load game, workspace event log, supply chain column added.  
15–24. No internal renames; no simulation/balance/save/API changes.  
25–30. Grammar per section G.  
31–36. All approved repairs **Yes**; PGD-RES-001 **unchanged**.  
37–43. Deferred families **unchanged**; no art.  
44. Scenario-B **paused**.  
45. TIME-A remaining: **0**.  
46–51. Runtime **PASS** (Company, **Production auto-transport**, Chart, Narrow).  
52–53. Narrow checked; **no destructive overflow**.  
54–59. Tests **1058** pass; build **pass**.  
60. Task files per section U.  
61. Unrelated WIP **excluded**.  
62–64. Evidence gap **closed**; **ready for independent final closure:** **Yes**.

---

## Runtime evidence table

| Surface | State | Expected player copy | Raw Tick/Ticks visible? | Evidence |
|---|---|---|---|---|
| Company / Operations | PGD-RES fixture @ tick 131 | `Zyklus 131`, `alle N Zyklen` | No | `TIME_UX_R1_COMPANY_…1440x900.png` |
| Production auto-transport | TIME-UX-R1 fixture @ tick 131 | `~9 Zyklen` in auto-transport hint | No | `TIME_UX_R1_PRODUCTION_AUTO_TRANSPORT_…1440x900.png` |
| Production (PGD-RES context) | PGD-RES fixture | `Benötigt … Holz` (separate state) | No | `TIME_UX_R1_PRODUCTION_CYCLE_HINT_…1440x900.png` |
| Chart tooltip | PGD-RES fixture | `Zyklus 76` | No | `TIME_UX_R1_CHART_…1440x900.png` |
| Narrow | PGD-RES fixture | `Zyklus 131` | No | `TIME_UX_R1_CYCLE_…480x900.png` |

---

## Firewall table

| Area | Changed? | Evidence / note |
|---|---|---|
| Simulation engine | No | No touched domain files |
| Save/API | No | DTO names unchanged |
| PGD sealed behavior | No | Builder tests + PGD-RES runtime (separate fixture) |
| Transport statuses | No | Only duration unit in shared hint |
| Tutorial navigation | No | Description text unit only |
| TIME-UX production code (evidence pass) | No | Evidence-only delta |

---

**No commit. No push. No tag.** (per slice execution rules)
