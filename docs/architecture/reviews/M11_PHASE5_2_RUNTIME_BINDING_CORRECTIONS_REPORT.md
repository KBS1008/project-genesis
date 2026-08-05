# M11 Phase 5.2 — Runtime Binding Corrections Report

**Project:** Project Genesis  
**Milestone:** M11 Phase 5.2  
**Review date:** 2026-08-05  
**Commits:** `71c394f`, `0f65d5e` (master)  
**Reference:** `docs/architecture/reviews/M11_PHASE5_1_RUNTIME_BINDING_AUDIT_REPORT.md`  
**Prompt:** M11 Phase 5.2 — Runtime Binding Corrections & ViewData Consolidation

---

# Executive Summary

Phase 5.2 implements **only** the runtime-binding corrections identified in the Phase 5.1 audit. No architecture redesign, no new gameplay features, and no new UI surfaces were introduced.

All changes reuse the existing chain:

```text
Simulation → REST API → presentation adapters → ViewData mappers
  → GameWorkspaceProvider / useScreenQuery → screens
```

The major audit gap (**Finance screen not tick-synchronized**) is closed. Minor mapper, notification, player-identity, and provider cleanup items are resolved or documented. An architecture test now prevents regression on tick-aware query keys.

**Final statement:** **RUNTIME BINDING CORRECTIONS READY**

---

# Audit Traceability

| Audit ID | Severity | Phase 5.1 finding | Phase 5.2 correction | Status |
|----------|----------|-------------------|----------------------|--------|
| **MAJ-01** | Major | Finance static query key `'finance'` | **C1** — `finance:${tickKey}` | ✅ Fixed |
| **MIN-01** | Minor | Notifications without timestamps | **C3** — `simulationTimeLabel` | ✅ Fixed |
| **MIN-02** | Minor | Player summary incomplete | **C5** — `resolvePlayerSummary()` | ✅ Documented fallback |
| **MIN-03** | Minor | Transport `'Fallback'` label | **C4** — empty state `'—'` | ✅ Fixed |
| **MIN-04** | Minor | Executive buildings double-fetch | **C6** — documented dual source | ✅ Documented |
| **MIN-05** | Minor | Unused `lastSocketTickRef` | **C7** — removed dead ref | ✅ Fixed |
| **DOC-01** | Doc | DD-038 event name drift | DD-038 updated | ✅ Fixed |
| **DOC-02** | Doc | Incomplete tick-sync docs | Guides updated | ✅ Fixed |
| — | — | No tick-key architecture test | **C2** — architecture guard | ✅ Added |

---

# Corrections Implemented

## C1 — Finance Tick Synchronization

**File:** `apps/web/src/presentation/screens/query/QueryScreens.tsx`

Replaced static query identity:

```text
finance
```

with tick-aware key and debounce:

```text
finance:${tickKey}   +   { debounceMs: TICK_QUERY_DEBOUNCE_MS }
```

Finance transaction rows now refresh when `viewData.simulation.tickNumber` advances during auto-ticks.

---

## C2 — Tick-Sync Architecture Guard

**File:** `tests/architecture/presentation-tick-sync-rules.test.ts`

Scans all gameplay screens under `apps/web/src/presentation/screens/` and asserts every `useScreenQuery()` call includes `tickKey` in its query identity string.

Prevents recurrence of the MAJ-01 Finance gap.

---

## C3 — Executive Notification Timestamps

**File:** `apps/web/src/presentation/adapters/mappers/executive-dashboard-view-mappers.ts`

`buildNotifications()` now sets `timestampLabel` from `companyViewData.simulationTimeLabel` — authoritative **simulation time**, not browser `Date.now()`.

Consumed by `PGNotificationCenter` on the executive dashboard.

---

## C4 — Transport Route Empty-State Label

**File:** `apps/web/src/presentation/adapters/mappers/company-dashboard-view-mappers.ts`

Transport inspector detail for missing `routeId`:

| Before | After |
|--------|-------|
| `'Fallback'` | `'—'` |

Aligns with DD-042 / UI guidelines for empty-state representation.

---

## C5 — Player Identity Binding

**File:** `apps/web/src/presentation/adapters/mappers/executive-dashboard-view-mappers.ts`

New helper `resolvePlayerSummary()`:

1. `playerName` when session/API exposes a display name (future-ready)
2. `playerId` as **documented temporary fallback** (current runtime)
3. `'—'` when both absent

**Binding site:** `ExecutiveDashboardScreen` → `buildExecutiveDashboardViewData()`.

No player profile read model exists yet; raw `playerId` remains acceptable until that contract is added.

---

## C6 — Duplicate Building Queries

**Decision:** Keep both sources — document, do not merge.

| Source | ViewData shape | Consumer |
|--------|----------------|----------|
| `companyViewData.buildings` | `BuildingRowViewData[]` from dashboard aggregate | Operations tables, global search, hints |
| Executive `fetchBuildingList()` query | `BuildingListRowViewData[]` via `mapBuildingListRow()` | Regional presence widget |

Both call the same API endpoint but produce **different presentation shapes**. The executive query requires tick-keyed `BuildingListRowViewData` with live `regionNames` resolution.

**Documentation:** `docs/development/RUNTIME_VIEWDATA_GUIDE.md` § Executive building queries.

---

## C7 — Provider WebSocket Cleanup

**File:** `apps/web/src/presentation/state/GameWorkspaceProvider.tsx`

Removed unused `lastSocketTickRef`. WebSocket `dashboard:refresh` continues to trigger debounced `scheduleRefreshSession()` (250 ms). Full workspace reload remains the authoritative refresh path.

---

# Compliance Matrix (After Phase 5.2)

| Scope area | Runtime binding | Tick sync | Notes |
|------------|-------------------|-----------|-------|
| Application Shell | ✅ | ✅ via provider | — |
| Executive Dashboard | ✅ | ✅ | Buildings query + provider |
| Operations Dashboard | ✅ | ✅ via provider | — |
| World / Inspector | ✅ | ✅ | Phase 5 tick keys |
| Finance screen | ✅ | ✅ | **C1 closed MAJ-01** |
| Notification Center | ✅ | ✅ via provider | **C3 timestamps added** |
| Global Search | ✅ | ✅ via provider | C6 documented |
| All gameplay screens | ✅ | ✅ | C2 architecture guard |

---

# Tests

| Test file | Coverage | Status |
|-----------|----------|--------|
| `QueryScreens.test.tsx` | Finance tick key + debounce options | ✅ |
| `presentation-tick-sync-rules.test.ts` | All screen queries include `tickKey` | ✅ |
| `executive-dashboard-view-mappers.test.ts` | Notification timestamps, player identity | ✅ |
| `company-dashboard-view-mappers.test.ts` | Transport route empty-state label | ✅ |
| Existing presentation + simulation suite | No regressions | ✅ |

Run: `pnpm test`

---

# Documentation

| Document | Change |
|----------|--------|
| `docs/development/RUNTIME_VIEWDATA_GUIDE.md` | **New** — authoritative ViewData binding reference |
| `docs/development/IMPLEMENTATION_PROGRESS.md` | Phase 5.2 deliverable complete |
| `docs/decisions/DD-038-Presentation-Architecture.md` | Socket event `dashboard:refresh` aligned |
| `docs/development/UI_DEVELOPMENT_GUIDE.md` | Full tick-sync screen list |
| `docs/development/SIMULATION_INTEGRATION_GUIDE.md` | Finance in tick-sensitive screens |
| `docs/project-management/M11_VISUAL_PRODUCTION_PLAN.md` | Phase 5.2 section closed |

---

# Files Changed

| Area | Files |
|------|-------|
| Screens | `QueryScreens.tsx`, `ExecutiveDashboardScreen.tsx` |
| Mappers | `executive-dashboard-view-mappers.ts`, `company-dashboard-view-mappers.ts` |
| Provider | `GameWorkspaceProvider.tsx` |
| Tests | `QueryScreens.test.tsx`, `company-dashboard-view-mappers.test.ts`, `presentation-tick-sync-rules.test.ts`, `executive-dashboard-view-mappers.test.ts` |
| Docs | `RUNTIME_VIEWDATA_GUIDE.md`, DD-038, guides, progress, plan |

---

# Remaining Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Player display name unavailable | Low | `resolvePlayerSummary()` ready for future `playerName` field |
| Executive + provider building drift within debounce window | Low | Both refresh on same tick cycle; acceptable |
| Full workspace reload on every socket event | Low | 250 ms debounce; selective refresh deferred |
| No provider integration test | Low | Covered indirectly by mapper + architecture tests |

---

# Deferred (Out of Scope)

| Item | Reason |
|------|--------|
| Player profile / display name API | Requires new read model — not a binding correction |
| Executive buildings query merge | Different ViewData shapes — documented in C6 |
| Selective refresh via socket `tickNumber` | Performance optimization — future phase |

---

# Related Documents

- `docs/architecture/reviews/M11_PHASE5_1_RUNTIME_BINDING_AUDIT_REPORT.md`
- `docs/architecture/reviews/M11_PHASE5_SIMULATION_INTEGRATION_REPORT.md`
- `docs/development/RUNTIME_VIEWDATA_GUIDE.md`
- `docs/development/SIMULATION_INTEGRATION_GUIDE.md`
- `docs/design/UI_DATA_BINDING_GUIDELINES.md`

---

**RUNTIME BINDING CORRECTIONS READY**
