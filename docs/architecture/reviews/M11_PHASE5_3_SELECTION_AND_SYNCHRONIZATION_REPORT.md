# M11 Phase 5.3 — Shared Selection & UI Synchronization Report

**Project:** Project Genesis  
**Milestone:** M11 Phase 5.3  
**Review date:** 2026-08-05  
**Prompt:** M11 Phase 5.3 — Shared Selection & UI Synchronization  
**Reference:** `docs/development/Prompts/M11_PHASE_5_3_SELECTION_AND_SYNCHRONIZATION.md`

---

# Executive Summary

Phase 5.3 unifies entity selection across the game workspace behind a single URL-backed model (`?screen=` + `?entity=kind:id`). World Map, Inspector, Executive Dashboard widgets, operation screens, Global Search, Context Menu, and the selection banner now read and write the same `NavigationState` via `GameWorkspaceProvider`.

Screen–entity compatibility rules prevent stale selections when switching primary screens (e.g. region selection cleared on Finance). Operation screens synchronize local row/detail state bidirectionally with URL selection.

No new gameplay mechanics or domain changes were introduced.

**Final statement:** **SHARED SELECTION SYNCHRONIZATION READY**

---

# Selection Model

| Layer | Responsibility |
|-------|----------------|
| URL search params | Persistent, shareable selection state |
| `navigation-state.ts` | Parse/serialize, catalog recovery, screen compatibility |
| `GameWorkspaceProvider` | `selectEntity`, `navigateToTarget`, `sanitizeNavigationState` on navigation |
| `entity-navigation.ts` | Typed navigation builders per entity kind and target screen |
| `entity-selection-labels.ts` | Human-readable banner labels from ViewData |
| Screen components | Local UI state synced from `navigation.entitySelection` |

---

# Implementations

## S1 — Navigation sanitization

**Files:** `navigation-state.ts`, `GameWorkspaceProvider.tsx`

- `isEntitySelectionCompatibleWithScreen()` maps primary screens to allowed entity kinds
- `sanitizeNavigationState()` clears incompatible selections on `navigateToScreen` and `navigateToTarget`
- `recoverInvalidEntitySelection()` unchanged — clears unknown entity IDs after catalog load

## S2 — Navigation builders

**File:** `entity-navigation.ts`

| Builder | Screen | Entity kind |
|---------|--------|-------------|
| `buildRegionNavigationTarget` | `world` | `region` |
| `buildBuildingNavigationTarget` | `buildings` | `building` |
| `buildCompanyBuildingNavigationTarget` | `company` | `building` |
| `buildProductionNavigationTarget` | `production` | `production` |
| `buildTransportNavigationTarget` | `transport` | `transport` |
| `buildResearchNavigationTarget` | `research` | `research` |
| `buildEmployeeNavigationTarget` | `company` | `employee` |
| `buildResourceNavigationTarget` | `markets` | `resource` |
| `buildEventNavigationTarget` | `reports` | `event` |

## S3 — Screen bidirectional sync

| Screen | Selection source | User action |
|--------|------------------|-------------|
| `CompanyDashboardScreen` | URL → `DetailSelection` | `selectDetail` → `selectEntity` |
| `ProductionScreen` | `navigation.entitySelection` | row click → `selectEntity` |
| `ResearchScreen` | `navigation.entitySelection` | row click → `selectEntity` |
| `TransportScreen` | `navigation.entitySelection` | row click → `selectEntity` |
| `BuildingsScreen` | `navigation.entitySelection` | row click → `selectEntity` |
| `MarketScreen` | URL → resource dropdown | dropdown → `selectEntity` |
| `ReportsScreen` | URL → `selectedEventId` | row click → `selectEntity` |
| `WorldScreen` | `navigation.entitySelection` | map click → `selectEntity` |

Finance and logistics sub-views clear URL selection when activated.

## S4 — Executive dashboard widgets

**File:** `ExecutiveDashboardScreen.tsx`

- Regional presence: `buildCompanyBuildingNavigationTarget` + `onOpenOperations`
- Production / Research / Supply Chain widgets: `selectedJobId` / `selectedOrderId` from URL; clicks call `navigateToTarget` with job builders
- Inspector panel continues to resolve from `navigation.entitySelection`

## S5 — Shell integration

**Files:** `GameWorkspaceShell.tsx`, `NotificationIndicator.tsx`

- Selection banner uses `formatEntitySelectionLabel()`
- Context menu “Auswahl aufheben” calls `clearEntitySelection`
- Notification indicator uses `buildEventNavigationTarget` + `buildNavigationQueryString`

## S6 — Global search

**File:** `build-global-search-index.ts`

Building entries now target `buildings` screen (was `company`) so search aligns with the dedicated Buildings screen.

---

# Tests

| Test file | Coverage |
|-----------|----------|
| `navigation-state.test.ts` | `sanitizeNavigationState`, `isEntitySelectionCompatibleWithScreen` |
| `entity-navigation.test.ts` | All navigation builders including buildings vs company split |
| `build-global-search-index.test.ts` | Building search item screen = `buildings` |
| Existing screen tests | Reports, Transport selection via `selectEntity` |

---

# Documentation

| Document | Update |
|----------|--------|
| `RUNTIME_VIEWDATA_GUIDE.md` | Phase 5.3 selection section |
| `IMPLEMENTATION_PROGRESS.md` | Phase 5.3 row |
| `M11_VISUAL_PRODUCTION_PLAN.md` | Phase 5.3 complete |
| This report | Phase 5.3 closure |

---

# Out of scope (unchanged)

- New gameplay commands or simulation rules
- Player profile read model (Phase 5.2 C5 fallback remains)
- Context menu entity-specific actions beyond clear selection and open search

---

**SHARED SELECTION SYNCHRONIZATION READY**
