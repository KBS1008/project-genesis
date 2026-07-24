# M9 Implementation Gate 2 Review Report

**Project:** Project Genesis  
**Milestone:** M9 – User Interface  
**Gate:** Gate 2 — Gameplay UI (after Phases 4–8)  
**Review date:** 2026-07-24  
**Commit audited:** `f5d912d` (master, synced with `origin/master`)  
**Scope:** Phases 4–8 only (Main Menu / Save-Load, Game Shell, World / Region / Company, Market, Buildings / Production / Research)  
**Reviewer:** Mandatory implementation audit (read-only)

**Reference documents read:**

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/project-management/M9_USER_INTERFACE_PLAN.md`
- `docs/architecture/reviews/M9_ARCHITECTURE_REVIEW.md`
- `docs/architecture/reviews/M9_ARCHITECTURE_REVIEW_REPORT.md`
- `docs/architecture/reviews/M9_IMPLEMENTATION_GATE_1_REPORT.md`
- `docs/architecture/reviews/M9_FOUNDATION_CONSOLIDATION_REPORT.md`
- ADRs: DD-029, DD-032, DD-033, DD-038 (and related DD-028)

---

# Executive Summary

Phases 4–8 deliver **playable gameplay UI** across main menu, save/load, simulation controls, world/region/company inspection, regional markets, and dedicated buildings/production/research operation screens. The implementation **respects DD-038 presentation boundaries**: React components consume immutable view-data, invoke Application workflows through the NestJS API adapter, and do not import domain, simulation, infrastructure, or application layers.

Gate 1 blocking findings (duplicate session loading, raw DTO consumption in the primary company screen, Buildings bypassing dedicated query) were **resolved in foundation consolidation** (`a4f0f03`) and remain fixed through Phase 8.

**Strengths**

- Automated presentation dependency rules pass (`tests/architecture/presentation-dependency-rules.test.ts`).
- Single authoritative session pipeline via `GameWorkspaceProvider` and `loadWorkspaceQueries()`.
- Phases 7–8 screens follow a consistent pattern: `useScreenQuery` → mappers → `ScreenQueryFrame` → hint-driven commands via `runCommand`.
- Simulation control (pause, resume, speed, step) is API-driven and guarded by `isBusy`.
- Save/load round-trip covered by API integration test; menu and workspace flows use typed session clients.

**Non-blocking gaps**

- `CompanyDashboardScreen` remains a large legacy composition (~1,100 lines) with pre-M9 `@/components/` charts and tables; employee hire/assign uses inline `callApi` instead of a typed command client.
- Overlapping HTTP fetches (workspace loader + per-screen queries) create performance risk under tick refresh.
- Phase 9 surfaces (transport detail, event log, reports dashboard) are stubbed or minimal.
- Presentation test coverage expanded for Phases 7–8 but remains thin for menu, save/load, world, and company overview screens.
- `IMPLEMENTATION_PROGRESS.md` header metadata is stale (588 tests / 2026-07-22) while M9 section reflects Phase 8 at ~93%.

**Verdict:** Gameplay UI for Phases 4–8 is architecturally compliant. Remaining items are technical debt or Phase 9 scope, not layer violations introduced in this gate window.

---

# Repository Status

| Area | Status |
| ---- | ------ |
| **Git `master`** | `f5d912d` — M9 Phase 8 committed and pushed |
| **Prior gate baseline** | `a4f0f03` — Phase 3 + Gate 1 consolidation |
| **Tests (Phase 8 commit)** | ~615 (`pnpm test` at `f5d912d`) |
| **M9 ADRs** | DD-038 accepted; DD-029, DD-032, DD-033 unchanged and complied with |
| **Gate 1 outcome** | Blocking items addressed in consolidation report |

### Commits in Gate 2 scope (Phases 4–8)

| Commit | Content |
| ------ | ------- |
| `d72279e` | Phase 4 — main menu, new/load/save workflows, session client |
| `ee49941` | Phase 5 — simulation controls, game shell header, pause/resume/speed/step API |
| `efe3295` | Phase 6 — world, region detail, company overview, entity navigation |
| `f861767` | Phase 7 — market screen, buy/sell client, trade API tests |
| `f5d912d` | Phase 8 — buildings/production/research screens, gameplay client, screen tests |

Supporting: `e599454` documents deferred non-blocking follow-ups.

### Component classification (since Gate 1 consolidation)

#### New (Phases 4–8)

| Path | Phase |
| ---- | ----- |
| `presentation/screens/menu/MainMenuScreen.tsx` | 4 |
| `presentation/screens/menu/NewGamePanel.tsx` | 4 |
| `presentation/screens/menu/LoadGamePanel.tsx` | 4 |
| `presentation/screens/menu/SaveGameDialog.tsx` | 4 |
| `presentation/screens/menu/menu.css` | 4 |
| `presentation/adapters/api/session-client.ts` | 4 |
| `presentation/adapters/api/session-client.test.ts` | 4 |
| `presentation/shell/SimulationControlsBar.tsx` | 5 |
| `presentation/shell/SimulationControlsBar.test.tsx` | 5 |
| `presentation/shell/simulation-controls.css` | 5 |
| `presentation/adapters/api/simulation-client.ts` | 5 |
| `presentation/adapters/api/simulation-client.test.ts` | 5 |
| `presentation/screens/world/WorldScreen.tsx` | 6 |
| `presentation/screens/company/CompanyOverviewScreen.tsx` | 6 |
| `presentation/screens/company/CompanyScreen.tsx` | 6 |
| `presentation/screens/company/CompanyOverviewScreen.test.tsx` | 6 |
| `presentation/adapters/view-data/company-overview-view-data.ts` | 6 |
| `presentation/adapters/mappers/company-overview-view-mappers.ts` | 6 |
| `presentation/adapters/mappers/company-overview-view-mappers.test.ts` | 6 |
| `presentation/screens/market/MarketScreen.tsx` | 7 |
| `presentation/screens/market/MarketScreen.test.tsx` | 7 |
| `presentation/screens/market/market-screen.css` | 7 |
| `presentation/adapters/api/market-client.ts` | 7 |
| `presentation/screens/buildings/BuildingsScreen.tsx` | 8 |
| `presentation/screens/buildings/BuildingsScreen.test.tsx` | 8 |
| `presentation/screens/production/ProductionScreen.tsx` | 8 |
| `presentation/screens/production/ProductionScreen.test.tsx` | 8 |
| `presentation/screens/research/ResearchScreen.tsx` | 8 |
| `presentation/screens/research/ResearchScreen.test.tsx` | 8 |
| `presentation/adapters/api/gameplay-client.ts` | 8 |
| `presentation/screens/shared/ScreenQueryFrame.tsx` | 8 |
| `presentation/screens/shared/QueryRows.tsx` | 8 |
| `presentation/screens/shared/operation-screen.css` | 8 |
| `presentation/hooks/useScreenQuery.ts` | 8 |
| `apps/web/src/app/page.tsx` (main menu route) | 4 |

#### Extended

| Path | Change |
| ---- | ------ |
| `presentation/state/GameWorkspaceProvider.tsx` | Dirty-session tracking, `markSessionSaved`, simulation refresh |
| `presentation/shell/GameWorkspaceShell.tsx` | Header meta, save dialog, return-to-menu guard, simulation bar |
| `presentation/navigation/ScreenRouter.tsx` | Dedicated screen imports for markets, buildings, production, research |
| `presentation/screens/query/QueryScreens.tsx` | Slimmed to transport, finance, reports stub |
| `presentation/screens/company/CompanyDashboardScreen.tsx` | Sidebar market/build/production/research actions removed |
| `presentation/adapters/view-data/company-dashboard-view-data.ts` | `PlaceBuildingHintViewData.category` |
| `presentation/adapters/mappers/company-dashboard-view-mappers.ts` | Building list mapping, hint extensions |
| `apps/api/src/game/game.controller.test.ts` | Save/load round-trip, simulation control, market, building, production, research tests |
| `docs/development/IMPLEMENTATION_PROGRESS.md` | M9 Phase 4–8 deliverable rows (M9 section) |

#### Deprecated

| Path | Notes |
| ---- | ----- |
| `apps/web/src/components/DashboardShell.tsx` | Thin re-export; no longer session owner |
| Inline sidebar gameplay actions in `CompanyDashboardScreen` | Replaced by dedicated screens (Phases 7–8) |

#### Legacy (retained, not migrated in Phases 4–8)

| Path | Notes |
| ---- | ----- |
| `apps/web/src/components/*` charts, `DataTable`, `TutorialPanel` | Used by `CompanyDashboardScreen` and `MarketScreen` charts |
| `apps/web/src/components/DashboardDetailPanel.tsx` | Unused by company screen; retained for reference |
| `presentation/adapters/api/client.ts` (`GameSessionDashboard` DTO) | Internal to adapters; mapped before components |

---

# Gameplay Screen Review

## Main Menu (Phase 4)

| Criterion | Status | Evidence |
| --------- | ------ | -------- |
| ViewData | ✅ | Menu panels use mapped save slots (`SaveSlotViewData`) or form state only |
| Queries | ✅ | `LoadGamePanel` → `fetchSaveList()` + `mapSaveSlotViewData` |
| Commands | ✅ | `startNewGame`, `loadGame` via `session-client.ts` |
| Loading / empty / error | ✅ | `LoadingState`, `EmptyState`, `StatusBanner` in load panel |
| Navigation | ✅ | `/` home; successful new/load → `/game` |

Settings panel is an intentional stub (Phase 10+).

## Save / Load (Phase 4)

| Criterion | Status | Evidence |
| --------- | ------ | -------- |
| Save dialog | ✅ | `SaveGameDialog` — filename normalization, overwrite confirm |
| Load workflow | ✅ | `LoadGamePanel` — listbox selection, error translation |
| Unsaved progress | ✅ | `GameWorkspaceShell` confirms before return to menu when `isSessionDirty` |
| Round-trip | ✅ | `game.controller.test.ts` — `POST /api/session/save and load round-trip` |
| Refresh after save | ⚠️ | Save uses direct `saveGame()` + `markSessionSaved`; does not call full `refreshSession` (acceptable — path updated locally) |

## Game Shell / Simulation Controls (Phase 5)

| Criterion | Status | Evidence |
| --------- | ------ | -------- |
| Header / session meta | ✅ | Tick, simulation time, cash, live/dirty pills |
| Pause / resume / speed / step | ✅ | `SimulationControlsBar` → `simulation-client.ts` → `runCommand` |
| Notifications | ✅ | Global pipeline via `runCommand` |
| Keyboard accessibility | ✅ Partial | ARIA labels on simulation buttons; no full a11y suite |

`advanceSimulation(count)` exists in `simulation-client.ts` but is **not exposed in UI** (step uses `/api/simulation/step` instead). Not a violation — single-step exit criterion met.

## World / Regions (Phase 6)

| Criterion | Status | Evidence |
| --------- | ------ | -------- |
| World overview | ✅ | Schematic map grid, region list |
| Region detail | ✅ | `fetchRegionDetails` + `mapRegionDetailViewData` |
| Entity navigation | ✅ | Region/building selection → URL `?entity=` |
| Loading / empty / error | ✅ | `ScreenQueryFrame` on detail and regional buildings |
| Stale ID recovery | ✅ | `recoverInvalidEntitySelection` in provider |

## Company (Phase 6)

| Criterion | Status | Evidence |
| --------- | ------ | -------- |
| Overview screen | ✅ | `CompanyOverviewScreen` — KPIs, inventory, finance, regional summaries |
| Operations dashboard | ✅ | `CompanyDashboardScreen` via `CompanyScreen` toggle |
| ViewData | ✅ | `companyViewData`, `buildCompanyOverviewViewData` |
| Deep link to operations | ✅ | Entity selection kinds auto-open operations view |

## Markets (Phase 7)

| Criterion | Status | Evidence |
| --------- | ------ | -------- |
| Regional selector | ✅ | Region dropdown backed by workspace `regions` |
| Price table / history | ✅ | `fetchMarketPrices` + legacy chart/table components |
| Buy / sell | ✅ | `market-client.ts` → `runCommand`; `isBusy` guard |
| Hints / validation | ✅ | `companyViewData.hints.market`; UI guards only, server authoritative |
| Tick refresh | ✅ | Query key includes `tickKey` |

## Buildings (Phase 8)

| Criterion | Status | Evidence |
| --------- | ------ | -------- |
| List / detail | ✅ | `/api/buildings` + `companyViewData.detail.buildings` |
| Catalog / placement | ✅ | Hint-driven catalog; `placeBuilding` via `gameplay-client.ts` |
| Costs / requirements | ✅ | Pre-formatted hint labels from dashboard mapper |
| Tests | ✅ | Screen test + API place success test |

## Production (Phase 8)

| Criterion | Status | Evidence |
| --------- | ------ | -------- |
| Active jobs | ✅ | `fetchProductionJobs` + `mapProductionJobRowsViewData` |
| Start workflow | ✅ | Hint buttons → `startProduction` → `runCommand` |
| Detail panel | ✅ | Pre-mapped `companyViewData.detail.productionJobs` |
| Failure display | ✅ | API test for under-construction rejection |

## Research (Phase 8)

| Criterion | Status | Evidence |
| --------- | ------ | -------- |
| Catalog / prerequisites | ✅ | Hints from `companyViewData.hints.research` |
| Active jobs | ✅ | `fetchResearchJobs` query |
| Start workflow | ✅ | `startResearch` → `runCommand` |
| Failure display | ✅ | API test for unknown technology |

---

# Presentation Architecture Review

Expected stack (DD-038):

```text
Presentation → ViewData → Queries / Commands → Application → Domain → Repositories
```

| Layer boundary | Status | Notes |
| -------------- | ------ | ----- |
| Components → ViewData | ✅ | New screens consume view-data or pre-formatted labels |
| Adapters → HTTP API | ✅ | `query-client.ts`, `session-client.ts`, `simulation-client.ts`, `market-client.ts`, `gameplay-client.ts` |
| No repository access in UI | ✅ | Verified by dependency test + manual grep |
| DTO isolation | ✅ | `GameSessionDashboard` confined to `loadWorkspaceQueries()` and mappers; not exposed on context |
| Formatting | ✅ | Centralized in `presentation-formatters.ts` and mappers; no `Intl` / `toFixed` in presentation `.tsx` |

### Violations

**None at layer-boundary severity.** The following are **pattern inconsistencies**, not architecture bypasses:

1. **Employee commands** — `CompanyDashboardScreen` calls `callApi('/api/employees/hire|assign')` directly instead of a typed `employees-client.ts`. Commands still route API → use cases; wrapped in `runCommand` via local `runAction`.
2. **Legacy chart components** — `MarketScreen` and `CompanyDashboardScreen` import `@/components/*`. Data passed in is already mapped; components hold presentation rendering only.
3. **Dashboard aggregate in workspace loader** — `loadWorkspaceQueries()` still fetches monolithic dashboard for company KPIs, hints, and charts. Acceptable per consolidation scope; dedicated queries used for operation screens.

---

# Dependency Review

Automated scan: `tests/architecture/presentation-dependency-rules.test.ts`

**Findings:** **0 violations**

Verified absence in `apps/web/src/presentation/` of imports from:

- `src/domain`
- `src/application`
- `src/infrastructure`
- `src/simulation`
- repository or aggregate modules

Presentation HTTP adapters correctly import only from `presentation/adapters/api/client.ts` (API DTO shapes) and presentation-local modules.

---

# Query Layer Review

| Screen / area | Query path | ViewData mapping | Direct DTO in component |
| ------------- | ---------- | ---------------- | ----------------------- |
| Workspace bootstrap | `loadWorkspaceQueries()` | `WorkspaceViewData`, `CompanyDashboardViewData` | ❌ |
| World regions | `fetchRegionList`, `fetchRegionDetails` | `mapRegionDetailViewData` | ❌ |
| Company overview | `fetchBuildingList` | `mapBuildingListRow`, `buildCompanyOverviewViewData` | ❌ |
| Markets | `fetchMarketPrices(regionId)` | Table/chart props from query + labels resolver | ❌ |
| Buildings | `fetchBuildingList` | `mapBuildingListRow` | ❌ |
| Production | `fetchProductionJobs` | `mapProductionJobRowsViewData` | ❌ |
| Research | `fetchResearchJobs` | Mapper + hint view-data | ❌ |
| Transport / Finance | `fetchTransportOrders`, `fetchFinanceTransactions` | `workspace-view-mappers` | ❌ |
| Reports | Workspace `viewData.saves` only | Pre-mapped save slots | ❌ |
| Main menu load | `fetchSaveList` | `mapSaveSlotViewData` | ❌ |

**No repository access. No direct DTO usage in React components. No formatting logic in components** (grep confirmed).

**Gap:** `useScreenQuery` omits `loader` from effect dependencies — intentional stability trade-off; tick-driven refetch relies on explicit `queryKey` (markets, buildings, production include `tickKey`; company overview and world regional buildings do not).

---

# Command Review

| Action | Client | Orchestration | Server validation |
| ------ | ------ | ------------- | ----------------- |
| New game | `session-client.startNewGame` | Direct (pre-workspace) | `StartNewGameUseCase` |
| Save | `session-client.saveGame` | Dialog + `markSessionSaved` | `SaveGameUseCase` |
| Load | `session-client.loadGame` | Direct (pre-workspace) | `LoadGameUseCase` |
| Pause / resume / speed / step | `simulation-client.*` | `runCommand` | Simulation engine facade |
| Buy / sell | `market-client.*` | `runCommand` + `isBusy` | `MarketTradeUseCases` |
| Place building | `gameplay-client.placeBuilding` | `runCommand` | `PlaceBuildingUseCase` |
| Start production | `gameplay-client.startProduction` | `runCommand` + hints | `StartProductionUseCase` |
| Start research | `gameplay-client.startResearch` | `runCommand` + hints | `StartResearchUseCase` |
| Hire / assign employee | Inline `callApi` | `runCommand` via `runAction` | `HireEmployeeUseCase`, `AssignEmployeeUseCase` |

**No duplicated domain validation or simulation logic in UI.** Hint-driven disable states mirror server eligibility; authoritative rejection still comes from API errors translated by `translatePresentationError`.

**Duplicate submission prevention:** `isBusy` on workspace provider blocks concurrent commands on gameplay screens and simulation bar.

---

# Business Logic Review

| Area | Assessment |
| ---- | ---------- |
| Market trade amount validation | `resolveTradeValidation` — presentation guard for integer input and hint alignment; prices and affordability computed server-side ✅ |
| Save filename normalization | `normalizeSaveFilePath` — input-shape validation only (path safety); acceptable in adapter ✅ |
| World map grid layout | `buildWorldMapCells` — pure layout from region coordinates; no domain rules ✅ |
| Placement default coordinates | `buildingCount * 2` — UX default; server validates placement ✅ |
| Company operations dashboard | Tables/charts render pre-mapped view-data; sidebar hints from mapper ✅ |

**Duplicated business logic:** None identified at domain-rule severity. Employee hire/assign should adopt typed client for consistency, not correctness.

---

# Component Reuse Review

| Primitive / shared | Usage |
| ------------------ | ----- |
| `Button`, `Card`, `LoadingState`, `EmptyState`, `StatusBanner` | Menu, shell, all operation screens |
| `ScreenQueryFrame` | World, company overview, markets, buildings, production, research, transport, finance |
| `QueryRows` | Tabular screens |
| `useScreenQuery` | All query-backed screens |
| `useTransientFormState` | Market trade, building placement, menu forms |
| `runCommand` | Simulation bar, markets, buildings, production, research, dashboard sidebar |
| Dialog system | Save overwrite, unsaved exit confirm |

**Duplication observed**

- `MarketPricesTable` / `MarketPriceHistoryChart` used in both `MarketScreen` and legacy dashboard paths — acceptable shared legacy widgets.
- `CompanyDashboardScreen` retains bespoke `DataTable` and chart suite not yet migrated to presentation primitives — deferred debt.
- Transport and Finance screens share `QueryScreens.tsx` pattern; Buildings/Production/Research have parallel but consistent dedicated files (Phase 8 intentional split).

No unjustified copy-paste of full screen implementations found.

---

# Navigation Review

| Feature | Status | Evidence |
| ------- | ------ | -------- |
| Routing | ✅ | `/` main menu; `/game` workspace |
| URL-backed screen | ✅ | `?screen=` parsed in `navigation-state.ts` |
| Deep links / entity selection | ✅ | `?entity=kind:id` |
| Primary navigation | ✅ | `PrimaryNavigation` + `ScreenRouter` |
| Selection banner | ✅ | `GameWorkspaceShell` entity banner + clear |
| History | ✅ | Next.js `router.replace` for in-workspace nav |
| Dialog navigation | ✅ | `DialogProvider` for confirm flows |
| Cross-screen entity targets | ✅ | `entity-navigation.ts`, `navigateToTarget` |

Invalid entity IDs recovered on session refresh via `recoverInvalidEntitySelection`.

---

# Performance Review

| Risk | Severity | Detail |
| ---- | -------- | ------ |
| Duplicate HTTP fetches | Medium | `loadWorkspaceQueries()` fetches full dashboard + history; individual screens also call `/api/buildings`, `/api/markets/prices`, etc. |
| Tick-triggered refetch | Medium | Screens with `tickKey` in query key refetch on every simulation tick while mounted |
| Large company dashboard | Medium | ~1,100-line component with many charts rerenders on `companyViewData` updates |
| Provider context size | Low–Medium | Full `companyViewData` on context; all workspace consumers rerender on refresh |
| Memoization | Low | `useMemo` used for labels/resolvers; charts not memoized |
| Large tables | Low | `QueryRows` is lightweight; no virtualisation yet |

No correctness impact identified; optimisations deferred to Phase 11 polish.

---

# Simulation Review

| Requirement | Status | Evidence |
| ----------- | ------ | -------- |
| UI does not mutate simulation state directly | ✅ | All tick/pause/speed changes via API POST |
| Deterministic tick processing (DD-032) | ✅ | Speed via `setSimulationSpeed`; step via dedicated endpoint |
| Rendering frequency ≠ simulation time | ✅ | No render-driven tick loops; socket `dashboard:refresh` triggers query reload |
| Post-command refresh | ✅ | `runCommand` awaits `refreshSession()` |

Simulation remains in backend `SimulationEngine`; web is observer/controller only.

---

# Testing Review

### Coverage summary (~615 tests at `f5d912d`)

| Category | Count / status |
| -------- | -------------- |
| Architecture — presentation deps | 1 test file ✅ |
| Architecture — backend deps | 1 test file ✅ |
| API — `game.controller.test.ts` | 18 cases (session, save/load, simulation, world, market, building, production, research) |
| Presentation — total | 16 test files under `apps/web/src/presentation/` |
| Application / domain / simulation | Extensive existing suite (unchanged baseline) |

### Phase 4–8 presentation tests

| Present | Missing |
| ------- | ------- |
| `session-client.test.ts` | `MainMenuScreen.test.tsx` |
| `simulation-client.test.ts` | `NewGamePanel.test.tsx` |
| `SimulationControlsBar.test.tsx` | `LoadGamePanel.test.tsx` |
| `MarketScreen.test.tsx` | `SaveGameDialog.test.tsx` |
| `BuildingsScreen.test.tsx` | `WorldScreen.test.tsx` |
| `ProductionScreen.test.tsx` | `CompanyScreen.test.tsx` |
| `ResearchScreen.test.tsx` | Navigation integration / E2E |
| `CompanyOverviewScreen.test.tsx` | Automated a11y (Phase 10) |

### Integration tests

- Save/load round-trip: ✅ API level
- Market buy/sell: ✅ API level
- Building place / production / research failure paths: ✅ API level
- UI round-trip integration test mentioned in M9 Phase 4 exit criteria: **partial** — covered at API layer; no dedicated Playwright/Cypress suite

---

# Documentation Review

| Document | Sync status |
| -------- | ------------- |
| `IMPLEMENTATION_PROGRESS.md` M9 section | ✅ Phases 4–8 rows at ~93%; deferred items documented |
| `IMPLEMENTATION_PROGRESS.md` header | ✅ Updated 2026-07-24 — 615 tests, commit `f5d912d`, Gate 2 status |
| `M9_USER_INTERFACE_PLAN.md` | ✅ Phases 4–8 specifications match implementation |
| `M9_ARCHITECTURE_REVIEW*.md` | ✅ Gate 0 context; superseded by later gates for current state |
| `M9_FOUNDATION_CONSOLIDATION_REPORT.md` | ✅ Accurate for Gate 1 fixes |
| `DD-038` | ✅ Implementation aligns with accepted ADR |
| `UI_DEVELOPMENT_GUIDE.md` | ✅ Created — `docs/development/UI_DEVELOPMENT_GUIDE.md` |
| `M9_IMPLEMENTATION_REPORT.md` | ❌ Not yet created (expected post-M9) |

---

# Remaining Risks

1. **Performance under live simulation** — overlapping dashboard reload and per-screen queries on each tick may degrade UX on slower networks.
2. **Legacy dashboard maintenance** — continued dual paths (overview + operations monolith) increase regression risk during Phase 9–10.
3. **Thin menu/save component tests** — regressions in pre-workspace flows may escape CI.
4. **Event log stub** — `GetEventLogQueryHandler` returns empty list; Phase 9 reports depend on backend work.
5. **Accessibility** — partial ARIA only; no automated axe/pa11y gate until Phase 10.

---

# Technical Debt

| ID | Item | Introduced | Blocking Phase 9? |
| -- | ---- | ---------- | ------------------- |
| TD-M9-G2-01 | `CompanyDashboardScreen` size and legacy `@/components` dependency | Pre-M9 / consolidated | No |
| TD-M9-G2-02 | Employee hire/assign inline `callApi` (no typed client) | Phase 4–6 sidebar | No |
| TD-M9-G2-03 | Duplicate fetch strategy (workspace + screen queries) | Phase 3–8 | No |
| TD-M9-G2-04 | `useScreenQuery` loader dep omission / uneven tick refetch keys | Phase 8 | No |
| TD-M9-G2-05 | Unused `DashboardDetailPanel.tsx` | Pre-M9 | No |
| TD-M9-G2-06 | `advanceSimulation` API client unused in UI | Phase 5 | No |
| TD-M9-G2-07 | Reports screen placeholder (no event log) | Phase 3 stub | Phase 9 work item |
| TD-M9-G2-08 | ~~Missing `UI_DEVELOPMENT_GUIDE.md`~~ | Gate 0 | ✅ Resolved 2026-07-24 |

---

# Recommendations Before Phase 9

1. **Add `employees-client.ts`** — align hire/assign with other typed command adapters (low effort, reduces inconsistency).
2. **Extend presentation tests** for `LoadGamePanel`, `SaveGameDialog`, and `WorldScreen` before building transport/event UX on shared patterns.
3. ~~**Refresh `IMPLEMENTATION_PROGRESS.md` header**~~ — ✅ Updated 2026-07-24 (615 tests, `f5d912d`).
4. **Plan Phase 9 query strategy** — decide whether transport/event screens share `useScreenQuery` + tick keys or subscribe to a narrower read model before implementation.
5. **Document tick-refetch policy** — explicit convention for which screens include `tickKey` in query keys.
6. ~~**Draft `UI_DEVELOPMENT_GUIDE.md`**~~ — ✅ Created 2026-07-24.

None of the above block Phase 9 start.

---

# Final Recommendation

Phases 4–8 gameplay UI **complies with DD-038, DD-029, DD-032, and DD-033**. Gate 1 architectural bypasses are resolved. Dedicated operation screens for market, buildings, production, and research follow the established presentation pipeline. Remaining issues are documented technical debt, test gaps, and Phase 9 backlog — not layer violations requiring gameplay UI rework before transport/reports/event log work proceeds.

**READY FOR PHASE 9**

---

# Related Documents

- `docs/project-management/M9_USER_INTERFACE_PLAN.md`
- `docs/architecture/reviews/M9_IMPLEMENTATION_GATE_1_REPORT.md`
- `docs/architecture/reviews/M9_FOUNDATION_CONSOLIDATION_REPORT.md`
- `docs/decisions/DD-038-Presentation-Architecture.md`
- `docs/decisions/DD-029-Modular-Monolith-Architecture.md`
- `docs/decisions/DD-032-Deterministic-Tick-Processing.md`
- `docs/decisions/DD-033-Savegame-and-Persistence-Strategy.md`
- `docs/development/IMPLEMENTATION_PROGRESS.md`

---

# Change Log

| Version | Date | Change |
| ------- | ---- | ------ |
| 1.0.0 | 2026-07-24 | Initial Gate 2 review after M9 Phases 4–8 |
