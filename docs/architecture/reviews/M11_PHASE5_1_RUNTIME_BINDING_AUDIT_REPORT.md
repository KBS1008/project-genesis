# M11 Phase 5.1 — Runtime Binding Audit Report

**Project:** Project Genesis  
**Milestone:** M11 Phase 5.1  
**Review date:** 2026-08-05  
**Reference:** `docs/development/Prompts/M11_PHASE_5_1_RUNTIME_BINDING_AUDIT.md`  
**Baseline:** M11 Phase 5 closed (`1b6e95c`) — Simulation Integration Layer

---

# Executive Summary

This phase is a **read-only audit**. No presentation code was changed.

Every scoped UI surface was reviewed against its authoritative runtime source chain:

```text
SimulationEngine → GameSession → REST API → presentation adapters
  → ViewData mappers → GameWorkspaceProvider / useScreenQuery → React screens
```

**Verdict:** The presentation layer is **largely correctly bound** to server-authoritative read models. Provider-level refresh (`runSimulationTick`, `runCommand`, WebSocket debounce) keeps most gameplay values current. One **confirmed tick-sync gap** remains on the Finance screen. Several **legacy fallbacks** and **derived notification strings** are documented for follow-up.

**Final statement:** **RUNTIME BINDING AUDIT COMPLETE**

---

# Classification Legend

| Class | Meaning |
|-------|---------|
| **Runtime** | Value originates from simulation/session API and refreshes with workspace reload or tick-keyed query |
| **Placeholder** | DD-042 mockup token preserved in mapper metadata (`{{availableCash}}`) — not shown to user |
| **Static UI Copy** | Fixed German chrome, navigation labels, dialog text, marketing copy |
| **Derived Presentation Value** | Computed in mappers from runtime DTOs (labels, trends, formatted numbers) |
| **Legacy Fallback** | Hardcoded default when runtime field is null (`'—'`, `'Unbenannt'`, `'GC'`) |
| **Duplicated State** | Same entity data loaded via provider **and** a separate screen query |
| **Unknown Source** | Could not trace to a single authoritative field (none found in scope) |

---

# Authoritative Source Map

| Layer | Path | Role |
|-------|------|------|
| Session facade | `src/application/facade/GameSession.ts` | Commands + simulation state |
| Dashboard builder | `src/application/facade/GameSessionDashboardBuilder.ts` | KPI / economy aggregates |
| REST queries | `apps/web/src/presentation/adapters/api/query-client.ts` | Typed fetch functions |
| Workspace loader | `apps/web/src/presentation/adapters/queries/load-workspace-queries.ts` | Parallel session/dashboard/world/save load |
| Workspace mapper | `apps/web/src/presentation/adapters/mappers/workspace-view-mappers.ts` | `WorkspaceViewData` |
| Company mapper | `apps/web/src/presentation/adapters/mappers/company-dashboard-view-mappers.ts` | `CompanyDashboardViewData` |
| Executive mapper | `apps/web/src/presentation/adapters/mappers/executive-dashboard-view-mappers.ts` | Widget view-data |
| World mappers | `world-view-mappers.ts`, `world-overlay-mappers.ts` | Map + overlay + inspector |
| Provider | `GameWorkspaceProvider.tsx` | `viewData`, `companyViewData`, refresh, commands |
| Tick queries | `useScreenQuery.ts` | Screen-local refetch keyed by `tickNumber` |
| WebSocket | `dashboard-socket.ts` | `dashboard:refresh` → debounced `refreshSession()` |

---

# Tick Synchronization Audit

| Screen | Query key pattern | Tick-synced | Refresh path |
|--------|-------------------|-------------|--------------|
| World map | `world-map:${tickKey}` | ✅ | `useScreenQuery` |
| World overlay | `world-overlay:${mapId}:${tickKey}` | ✅ | `useScreenQuery` |
| Region inspector | `world-inspector:${regionId}:${tickKey}` | ✅ | `useScreenQuery` |
| Executive buildings | `executive-dashboard-buildings:${tickKey}` | ✅ | `useScreenQuery` |
| Markets | `markets:${regionId}:${tickKey}` | ✅ | `useScreenQuery` |
| Production | `production:${tickKey}` | ✅ | `useScreenQuery` |
| Buildings | `buildings:${tickKey}` | ✅ | `useScreenQuery` |
| Research | `research:${tickKey}` | ✅ | `useScreenQuery` |
| Transport | `transport:${tickKey}` | ✅ | `useScreenQuery` |
| Reports / events | `events:${category}:${tickKey}` | ✅ | `useScreenQuery` |
| **Finance** | **`finance` (static)** | **❌** | **No refetch on tick** |
| Company operations | — (provider only) | ✅ | `companyViewData` refresh |
| Executive widgets | — (provider + buildings query) | ✅ | Provider + buildings query |

**Finding MAJ-01:** `FinanceScreen` uses a static query key. Transaction rows stay stale while the screen remains mounted during auto-ticks.

---

# Area Audit

## 1. Application Shell

**Files:** `GameWorkspaceShell.tsx`, `PGSidebar.tsx`, `SimulationControlsBar.tsx`, `SimulationTickLoop.tsx`

| UI value | Class | Authoritative source |
|----------|-------|---------------------|
| Screen title / eyebrow | Static UI Copy + Derived | `labelPrimaryScreen(navigation.screen)` |
| Company name (header) | Runtime | `viewData.session.companyName` |
| Tick / simulation time (header) | Runtime | `viewData.simulation.*` via `loadWorkspaceQueries` |
| Pause / active pill | Runtime | `viewData.simulation.isPaused` |
| Live pill | Runtime | `isLiveConnected` ← WebSocket connection state |
| Ungespeichert pill | Derived | `isSessionDirty` ← client session flag |
| Available cash pill | Runtime | `companyViewData.kpis.availableCashLabel` |
| Speed label pill | Runtime | `viewData.simulation.speedLabel` |
| Sidebar screen labels | Static UI Copy | `PRIMARY_SCREENS` registry |
| Sidebar active state | Derived | URL-backed `navigation.screen` |
| Simulation pause/resume/step | Runtime command | `simulation-client` → API |
| Speed multiplier buttons | Runtime | `viewData.simulation.speedMultiplier` |
| Entity selection banner | Runtime | `navigation.entitySelection` |
| Loading overlay | Derived | `isLoading` from provider |
| Skip link text | Static UI Copy | — |

**Notes:** Shell chrome correctly reads provider view-data. Theme toggle in status bar uses local `ThemeProvider` state (UI preference, not gameplay).

---

## 2. Status Bar

**File:** `GameWorkspaceShell.tsx` → `PGStatusBar`

| UI value | Class | Authoritative source |
|----------|-------|---------------------|
| Company name | Runtime | `viewData.session.companyName` |
| Live / Ungespeichert | Runtime / Derived | Provider flags |
| Tick + time (center) | Runtime | `viewData.simulation` |
| Available cash | Runtime | `companyViewData.kpis.availableCashLabel` |
| Theme button label | Derived | Local theme state |

**Legacy fallback:** `'Keine Session'` when `companyName` is null — acceptable empty-state copy.

---

## 3. Main Menu

**Files:** `MainMenuScreen.tsx`, `MainMenuHome.tsx`, `useMenuBootstrap.ts`, `NewGamePanel.tsx`, `LoadGamePanel.tsx`, `SettingsPanel.tsx`, `CreditsPanel.tsx`, `SplashScreen.tsx`, `MenuLoadingScreen.tsx`

| UI value | Class | Authoritative source |
|----------|-------|---------------------|
| Brand title / tagline | Static UI Copy | — |
| Continue availability | Runtime | `fetchSessionStatus()` → `hasActiveSession` |
| Continue hint company name | Runtime | `sessionStatus.companyName` |
| Version footer | Static UI Copy | `package.json` version |
| M11 milestone label | Static UI Copy | — |
| New game company name input | Derived | User form → `startNewGame({ name })` |
| Save slot list | Runtime | `fetchSaveList()` → `mapSaveSlotViewData` |
| Save slot metadata (tick, company, date) | Derived Presentation Value | Save DTO mappers |
| Settings (animations) | Derived | `localStorage` via `menu-settings` |
| Credits content | Static UI Copy | `menu-credits-data.ts` |
| Background asset MM-001 | Static UI Copy | Visual asset registry (art, not gameplay) |
| Splash / loading timing | Static UI Copy | `MENU_SPLASH_DURATION_MS`, `MENU_LOADING_MIN_DURATION_MS` |

**Notes:** Main menu correctly separates static marketing from runtime session probes. No gameplay mock values embedded.

---

## 4. Save / Load UI

**Files:** `SaveGameDialog.tsx`, `LoadGamePanel.tsx`, workspace header save button

| UI value | Class | Authoritative source |
|----------|-------|---------------------|
| Default filename | Runtime | `viewData.session.savePath` |
| Overwrite confirm company name | Runtime | Existing save DTO via `mapSaveSlotViewData` |
| Save list in dialog | Runtime | `fetchSaveList()` at submit time |
| Post-save dirty flag | Derived | `markSessionSaved()` client state |
| Load selection | Runtime | User picks slot → `loadGame({ filePath })` |

**Notes:** Save/load paths are API-authoritative. No stale tick binding required (explicit user action).

---

## 5. Executive Dashboard

**Files:** `ExecutiveDashboardScreen.tsx`, `executive-dashboard-view-mappers.ts`, PG widgets

| UI value | Class | Authoritative source |
|----------|-------|---------------------|
| KPI cards (cash, energy, transport, …) | Derived Presentation Value | `companyViewData.kpis` ← dashboard API |
| KPI placeholder metadata | Placeholder | `{{availableCash}}`, `{{energyReserve}}` in mapper (not rendered) |
| Status panel items | Derived | `buildExecutiveDashboardViewData` |
| Finance widget rows | Derived | `companyViewData.detail.financeEntries` |
| Production / research / transport widgets | Derived | `companyViewData` job lists |
| Supply chain widget | Derived | `companyViewData` inventory + prices |
| Report widget actions | Static UI Copy | Navigation metadata in mapper |
| Notification center items | Derived Presentation Value | Flags (`energyHasDeficit`, `taxPaymentBlocked`, `logisticsStatusMessage`) |
| Notification titles | Static UI Copy | Fixed German strings in mapper |
| Building list (regional presence) | Runtime | `fetchBuildingList()` via tick-keyed query |
| Charts | Runtime | `companyViewData.chartPoints`, `marketPrices` |
| Player summary | Runtime | `viewData.session.playerId` |
| Inspector detail | Runtime | `companyViewData.detail.*` maps |
| Company name header | Runtime | `companyViewData.companyName` |

**Legacy fallbacks:** `'Unbenannt'`, `'—'`, `'Energieunterdeckung'` when trend missing.

**Duplicated state:** Building list fetched in executive query **and** embedded in `companyViewData.buildings` used by global search.

**Resolved since Gate 1:** `playerSummary` now binds `playerId`, not `companyName` (Gate 1 finding MIN-05 partially addressed — still shows raw ID not display name).

---

## 6. Operations Dashboard

**Files:** `CompanyDashboardScreen.tsx`, `company-operations-view-mappers.ts`, `CompanyOperationsInspector.tsx`, `CompanyOperationsCharts.tsx`

| UI value | Class | Authoritative source |
|----------|-------|---------------------|
| Header company name | Runtime | `companyViewData.companyName` |
| Header subtitle | Derived | `companyViewData.headerSubtitle` |
| KPI strip | Derived | `buildOperationsKpiCards(companyViewData.kpis)` |
| Overview strip | Derived | `buildOperationsOverviewCards(companyViewData.overview)` |
| Energy deficit banner | Runtime | `companyViewData.energyHasDeficit` |
| Logistics status | Runtime | `companyViewData.logisticsStatusMessage` |
| Sidebar hints | Derived | `companyViewData.hints` |
| Inspector tables | Derived | `companyViewData.detail` entity maps |
| Market prices in inspector | Runtime | `companyViewData.marketPrices` |
| Charts | Runtime | `companyViewData.chartPoints` |
| Tutorial panel | Runtime | `companyViewData.tutorial` |

**Notes:** Entire screen bound to provider refresh — no separate tick query needed. Provider reload on every tick keeps values current.

---

## 7. World Workspace

**Files:** `WorldScreen.tsx`, `PGWorldWorkspace.tsx`, world mappers

| UI value | Class | Authoritative source |
|----------|-------|---------------------|
| Map regions / topology | Runtime | `fetchWorldMap()` → `mapWorldMapViewData` |
| Overlay layers (trade, infra, resources) | Derived | Buildings + transport + region DTOs |
| Layer toggles | Derived | Local UI state in workspace component |
| Pan / zoom | Derived | Local viewport state (not gameplay) |
| Selected region highlight | Runtime | `navigation.entitySelection` |

All gameplay overlay values refresh via tick-keyed queries (Phase 5).

---

## 8. Region Inspector

**Files:** `WorldScreen.tsx` inspector query, `PGInspectorPanel.tsx`, `world-overlay-mappers.ts`

| UI value | Class | Authoritative source |
|----------|-------|---------------------|
| Region title / description | Runtime | `fetchRegionDetails()` |
| Resource amounts | Derived | Region DTO → formatted labels |
| Cities list | Runtime | Region DTO |
| Operations summary | Derived | Buildings + transport + production in region |
| Inspector section titles | Static UI Copy | Mapper / component defaults |
| Related entities title fallback | Legacy Fallback | `'Verknüpft'` in `PGInspectorPanel` |

Inspector refetches on `world-inspector:${regionId}:${tickKey}`.

---

## 9. Gameplay Screens (tick-keyed)

| Screen | Primary runtime fields | Mapper / client |
|--------|------------------------|-----------------|
| Markets | Prices, supply, demand, liquidity | `fetchMarketSnapshot`, market mappers |
| Production | Job list, progress, hints | `fetchProductionJobs` |
| Buildings | Building list, placement hints | `fetchBuildingList` |
| Research | Technology jobs, prerequisites | `fetchResearchJobs` |
| Transport | Orders, routes, status | `fetchTransportOrders` |
| Reports | Event log rows | `fetchEventLog` |
| Finance ❌ | Transaction rows | `fetchFinanceTransactions` — **stale on tick** |

Shared sidebar values (cash, price index, tick label) on Market screen read `companyViewData` — provider-synced ✅.

---

## 10. Notification Center & Toasts

| Surface | Class | Source |
|---------|-------|--------|
| Executive `PGNotificationCenter` | Derived Presentation Value | Mapper builds items from KPI/session flags |
| Toast messages (`NotificationHost`) | Derived Presentation Value | User commands / errors via `showNotification` |
| Notification indicator count | Derived | In-memory toast list length |
| Toast → event log link | Runtime | `eventLogId` when provided |

**Gap MIN-01:** Executive notification items have no `timestampLabel` — widget supports it but mapper does not populate simulation time.

**Gap MIN-02:** Toasts are ephemeral client state, not synced from server event log (by design for command feedback).

---

## 11. Global Search

**Files:** `GlobalSearchProvider.tsx`, `build-global-search-index.ts`, `PGGlobalSearch.tsx`

| UI value | Class | Authoritative source |
|----------|-------|---------------------|
| Screen entries | Static UI Copy + registry | `PRIMARY_SCREENS` |
| Region entities | Runtime | `regions` from provider |
| Building / employee / job entities | Runtime | `companyViewData.*` lists |
| Search filter | Derived | Client-side text match |

**Duplicated state:** Index rebuilds from `companyViewData` on provider refresh — same building/employee data also available via screen queries. Acceptable for palette freshness; index lags one provider cycle vs dedicated queries.

---

## 12. Context Menus

**Files:** `ContextMenuProvider.tsx`, workspace `onContextMenu` handler

| Item | Class |
|------|-------|
| Globale Suche | Static UI Copy |
| Auswahl aufheben | Static UI Copy (action uses runtime selection state) |

No gameplay values displayed.

---

# Legacy Fallback Inventory

| Location | Fallback | When | Risk |
|----------|----------|------|------|
| `workspace-view-mappers.ts` | `'Unbenannt'` | Missing company name | Low |
| `GameWorkspaceShell.tsx` | `'Project Genesis'` | Missing company in header | Low |
| `presentation-formatters.ts` | `'—'` | Null numeric/time format | Low — empty state |
| `company-dashboard-view-mappers.ts` | `'GC'` | Missing finance currency | Low |
| `company-dashboard-view-mappers.ts` | `'Fallback'` | Missing transport route ID in detail | Medium — debug label visible |
| `MarketScreen.tsx` | `'—'` | Missing KPI labels | Low |
| `executive-dashboard-view-mappers.ts` | `'Energieunterdeckung'` | Missing energy trend | Low |

No hardcoded gameplay percentages (e.g. `'5 %'` tax) found in production screens — Gate 1 MIN-06 appears resolved.

---

# Findings Summary

| ID | Severity | Finding | Classification | Recommended phase |
|----|----------|---------|----------------|-------------------|
| **MAJ-01** | Major | Finance screen static query key — no tick refetch | Runtime gap | 5.2 fix |
| **MIN-01** | Minor | Executive notifications lack simulation timestamps | Derived gap | 5.2 polish |
| **MIN-02** | Minor | `playerSummary` shows raw `playerId` not display name | Runtime (incomplete UX) | Player profile work |
| **MIN-03** | Minor | Transport detail shows `'Fallback'` for missing route ID | Legacy Fallback | Mapper cleanup |
| **MIN-04** | Minor | Executive buildings double-fetch (provider + query) | Duplicated State | Optional optimize |
| **MIN-05** | Minor | `lastSocketTickRef` written but never read | Dead code | Provider cleanup |
| **DOC-01** | Doc | DD-038 references `dashboard-updated`; code uses `dashboard:refresh` | Documentation drift | DD-038 sync |
| **DOC-02** | Doc | `UI_DEVELOPMENT_GUIDE` tick-sync list incomplete vs Finance gap | Documentation drift | Guide update |

---

# Compliance Matrix

| Scope area | Runtime binding | Tick sync | Notes |
|------------|-------------------|-----------|-------|
| Application Shell | ✅ | ✅ via provider | — |
| Main Menu | ✅ | N/A | Session probe only |
| Executive Dashboard | ✅ | ✅ | Buildings query + provider |
| Operations Dashboard | ✅ | ✅ via provider | — |
| World Workspace | ✅ | ✅ | Phase 5 tick keys |
| Region Inspector | ✅ | ✅ | Tick-keyed query |
| Status Bar | ✅ | ✅ via provider | — |
| Notification Center | ⚠️ | ✅ via provider | Missing timestamps |
| Global Search | ✅ | ✅ via provider | Duplicated entity lists |
| Context Menus | ✅ | N/A | Actions only |
| Save/Load UI | ✅ | N/A | Explicit user ops |
| Finance screen | ⚠️ | ❌ | **MAJ-01** |

---

# Test Coverage Assessment

| Area | Automated check | Gap |
|------|-----------------|-----|
| Import boundaries | `presentation-dependency-rules.test.ts` | ✅ |
| Tick loop | `simulation-integration.test.ts`, `useSimulationTickLoop.test.ts` | ✅ |
| Screen tick keys | None | ❌ No architecture test scans keys |
| `useScreenQuery` debounce | None | ❌ |
| Provider refresh chain | None | ❌ |
| Mapper binding | Unit tests for static mapping only | Partial |

**Recommendation:** Add `presentation-tick-sync-rules.test.ts` in a future fix phase (not in scope for 5.1 read-only audit).

---

# Related Documents

- `docs/development/SIMULATION_INTEGRATION_GUIDE.md`
- `docs/design/UI_DATA_BINDING_GUIDELINES.md` (DD-042)
- `docs/decisions/DD-038-Presentation-Architecture.md`
- `docs/architecture/reviews/M11_PHASE5_SIMULATION_INTEGRATION_REPORT.md`
- `docs/architecture/reviews/M11_GATE_1_UI_FOUNDATION_REVIEW.md`

---

# Recommendations (Phase 5.2+)

1. **Fix MAJ-01:** Change Finance query key to `finance:${tickKey}` with `TICK_QUERY_DEBOUNCE_MS`.
2. Add architecture test enforcing tick keys on all gameplay `useScreenQuery` calls.
3. Populate notification `timestampLabel` from `viewData.simulation.simulationTime`.
4. Replace transport `'Fallback'` route label with `'—'` or content-resolved name.
5. Sync DD-038 WebSocket event name with `dashboard:refresh`.
6. Consider selective refresh using `lastSocketTickRef` instead of full workspace reload.

---

**RUNTIME BINDING AUDIT COMPLETE**
