# Runtime ViewData Guide

**Project:** Project Genesis  
**Milestone:** M11 Phase 5.3  
**Audience:** Frontend developers binding UI to simulation state

---

## Overview

The presentation layer reads gameplay state exclusively through typed **ViewData** contracts and REST adapters. Screens never import domain or simulation modules directly (DD-038).

```text
GameSession / queries → DTOs → mappers → ViewData → Provider / useScreenQuery → React screens
```

---

## Authoritative sources

| ViewData | Loader | Refresh trigger |
|----------|--------|-----------------|
| `WorkspaceViewData` | `loadWorkspaceQueries()` | Provider refresh (tick, command, WebSocket) |
| `CompanyDashboardViewData` | `buildCompanyDashboardViewData()` | Same provider refresh |
| Screen-local lists | `useScreenQuery()` | Query key includes `tickNumber` |

See `docs/development/SIMULATION_INTEGRATION_GUIDE.md` for the tick loop and WebSocket debounce pipeline.

---

## Tick-aware screen queries

Every gameplay screen that must update while simulation runs keys `useScreenQuery` with `tickKey = viewData.simulation.tickNumber ?? 0`:

| Screen | Query key |
|--------|-----------|
| Finance | `finance:${tickKey}` |
| Markets | `markets:${regionId}:${tickKey}` |
| Production | `production:${tickKey}` |
| Buildings | `buildings:${tickKey}` |
| Research | `research:${tickKey}` |
| Transport | `transport:${tickKey}` |
| Reports | `events:${category}:${tickKey}` |
| World map | `world-map:${tickKey}` |
| World overlay | `world-overlay:${mapId}:${tickKey}` |
| Region inspector | `world-inspector:${regionId}:${tickKey}` |
| Executive buildings | `executive-dashboard-buildings:${tickKey}` |

Always pass `{ debounceMs: TICK_QUERY_DEBOUNCE_MS }` (250 ms).

Enforced by `tests/architecture/presentation-tick-sync-rules.test.ts`.

---

## Player identity (C5)

Executive dashboard header uses `resolvePlayerSummary()`:

1. `playerName` when the session/API exposes a display name
2. otherwise `playerId` (current temporary fallback — no player profile read model yet)
3. otherwise `'—'`

Binding location: `executive-dashboard-view-mappers.ts` → `ExecutiveDashboardScreen`.

When a future player profile field is added to `SessionStatusViewData`, pass it through without changing widget code.

---

## Executive building queries (C6)

Two building sources exist by design:

| Source | Shape | Used for |
|--------|-------|----------|
| `companyViewData.buildings` | `BuildingRowViewData[]` from dashboard aggregate | Operations tables, global search, sidebar hints |
| Executive `fetchBuildingList()` query | `BuildingListRowViewData[]` via `mapBuildingListRow()` | Regional presence widget with live `regionNames` resolution |

Both call the same API endpoint but produce **different presentation shapes**. They are not merged because the executive regional-presence mapper requires tick-keyed `BuildingListRowViewData` with region labels resolved from the current region list.

---

## Notification timestamps (C3)

Executive `PGNotificationCenter` items receive `timestampLabel` from `companyViewData.simulationTimeLabel` (simulation clock, not browser time).

---

## Empty-state labels (C4)

Missing optional runtime fields use `'—'` per UI guidelines — never debug placeholders like `'Fallback'`.

---

## Provider WebSocket refresh (C7)

`GameWorkspaceProvider` debounces `dashboard:refresh` WebSocket events into `scheduleRefreshSession()`. Unused socket tick tracking refs were removed; full workspace reload remains the authoritative refresh path.

---

## URL-backed entity selection (Phase 5.3)

One authoritative selection model drives World Map, Inspector, Dashboard widgets, Global Search, and Context Menu:

```text
URL ?screen=…&entity=kind:id  ↔  GameWorkspaceProvider.navigation  ↔  screen local state
```

| Mechanism | Role |
|-----------|------|
| `parseNavigationState` / `serializeNavigationState` | URL ↔ `NavigationState` |
| `selectEntity` / `clearEntitySelection` | Update selection on current screen |
| `navigateToTarget` / `build*NavigationTarget` | Cross-screen navigation with selection |
| `sanitizeNavigationState` | Clears entity when screen and kind mismatch |
| `recoverInvalidEntitySelection` | Clears stale IDs after catalog load |
| `formatEntitySelectionLabel` | Human-readable selection banner |

**Screen compatibility:** `isEntitySelectionCompatibleWithScreen()` — e.g. `markets` accepts only `resource`, `buildings` only `building`, `company` accepts building/production/transport/research/employee/resource.

**Building navigation split:**

| Builder | Screen | Use case |
|---------|--------|----------|
| `buildBuildingNavigationTarget` | `buildings` | Global search, explicit buildings navigation |
| `buildProductionBuildingNavigationTarget` | `production` | World map building markers (Phase 6.4) |
| `buildCompanyBuildingNavigationTarget` | `company` | Executive regional-presence widget |

Screens with bidirectional sync: Production, Research, Transport, Buildings, Markets (resource dropdown), Reports (events), Company operations (`DetailSelection`).

---

## Related documents

- `docs/decisions/DD-038-Presentation-Architecture.md`
- `docs/design/UI_DATA_BINDING_GUIDELINES.md`
- `docs/development/SIMULATION_INTEGRATION_GUIDE.md`
- `docs/architecture/reviews/M11_PHASE5_1_RUNTIME_BINDING_AUDIT_REPORT.md`
- `docs/architecture/reviews/M11_PHASE5_2_RUNTIME_BINDING_CORRECTIONS_REPORT.md`
- `docs/architecture/reviews/M11_PHASE5_3_SELECTION_AND_SYNCHRONIZATION_REPORT.md`
