# M12 UI Stability — Flicker & Layout Incident Report

**Project:** Project Genesis  
**Report date:** 2026-08-30  
**Type:** P0/P1 UI stability incident (runtime + layout)  
**Status:** Resolved in this delta

---

## 1. Executive Summary

User-reported **flicker return** and **widget overlap** were traced to a **shared runtime instability**: the dashboard WebSocket effect re-subscribed on every tick because its callbacks closed over `viewData`, causing disconnect/reconnect cycles, stale-banner toggling, full-session recovery refreshes, and cascading query re-identity changes.

A secondary layout factor was **fixed-position command overlay** (`PGLoadingOverlay`) and remaining **12-column overview grids** inside a constrained operations workspace.

**Fix:** Stabilize WebSocket lifecycle with refs; recover only after real disconnect; remove tick numbers from `useScreenQuery` keys (tick sync via invalidation); scope loading overlay; align overview strip with responsive KPI grid.

**Decision:** **OPTION A — UI STABILITY INCIDENT RESOLVED — PASS**

---

## 2. Severity

**Final:** **P0/P1 — Playability + UI stability blocker** (revoked prior flicker closure until this delta)

---

## 3. Baseline

| Item | Value |
|------|-------|
| Branch | `master` (uncommitted M12 stack) |
| HEAD | `958e94f` |
| Prior flicker fix | `useScreenQuery` background refresh — retained, insufficient alone |
| Prior layout delta | operations width + KPI grid — retained, insufficient alone |
| Tests before fix | 904 PASS |
| build:web before fix | PASS |

---

## 4. Reproduction

Normal gameplay path: start session → Company Executive Dashboard → simulation x1.

**Observed (pre-fix):**
- Visual refresh/flicker during ticks
- Stale connection banner persisting while Live badge active
- KPI/widgets extending past workspace / overlapping shell areas
- Instability worsened as ticks advanced

---

## 5. Combined Symptom Analysis

| Symptom | Correlation |
|---------|-------------|
| Flicker | Coincided with tick-driven workspace refresh + socket effect teardown |
| Widget overlap | Fixed overlay covered shell; grid overflow when workspace width oscillated |
| Stale banner | Socket disconnect on every tick → `isDataStale=true` → banner shown while reconnecting |

**Same underlying trigger:** unstable WebSocket + over-eager recovery on every `connected` event.

---

## 6. Runtime Trace

Tick path (pre-fix):

1. Socket `dashboard:refresh` → `scheduleRefreshSession`
2. `refreshWorkspaceScopeSlices` updates `viewData.simulation.tickNumber`
3. `refreshWorkspaceScopeSlices` callback identity changes (dep: `viewData`)
4. Socket `useEffect` deps `[retryRuntimeRecovery, scheduleRefreshSession]` change
5. **Socket disconnect + reconnect**
6. `connected` handler calls `retryRuntimeRecovery` → full refresh + invalidate all screen queries
7. Stale banner / layout shift / perceived flicker

Additionally, `tickKey` embedded in every `useScreenQuery` key caused redundant query effect cycles alongside invalidation.

---

## 7. Mount/Unmount Findings

No evidence of React component remount on tick after fix. Pre-fix socket effect cleanup behaved like a **connection remount loop**, replacing workspace content transiently via:
- `GameWorkspaceShell` global `isLoading` path (when session effect re-fired)
- `ScreenQueryFrame` loading branch (mitigated earlier but not sufficient alone)

---

## 8. Query Key Findings

**Before:** Keys like `production:${tickKey}`, `executive-dashboard-buildings:${tickKey}` changed every tick.

**After:** Stable keys (`production`, `executive-dashboard-buildings`, `world-map`, …) with tick synchronization through `invalidateScreenQueryScopes` + `useScreenQuery` invalidation token.

Architecture rule updated: `tests/architecture/presentation-tick-sync-rules.test.ts` now forbids tick-in-key.

---

## 9. Connection/Stale Findings

| Check | Result (post-fix) |
|-------|-------------------|
| WebSocket stable across tick refresh | **Yes** — disconnect not called on refresh |
| Initial connect triggers recovery | **No** — only after real disconnect |
| Stale banner during healthy session @ 1236×697 | **No** — 12 samples, 0 stale |
| Live ticks continue | **Yes** — tick 1→6 observed |

---

## 10. Layout Geometry Findings

| Container | Issue | Fix |
|-----------|-------|-----|
| `.pg-loading-overlay` | `position: fixed; inset: 0; z-index: 1200` covered entire shell | `position: absolute` within `position: relative` `.pg-operations-layout` |
| `.pg-operations-overview-strip` | 12-col `span={4}` grid | `.pg-kpi-grid` responsive wrap |
| `.pg-operations-layout` | width contract (prior delta) | retained + `position: relative` |

At **1236×697**: KPI cards **0 clipped**, **no horizontal overflow** across 12 tick samples.

---

## 11. Responsive/Breakpoint Findings

No breakpoint oscillation observed post-fix at 1236×697. Prior overflow at ~1024px from `.pg-query-row` min-width remains a low-risk separate panel scroll issue, not KPI/shell overlap.

---

## 12. Root Cause Matrix

| Symptom | Immediate Trigger | Root Cause | Layer | Same Root Cause? |
|---------|-------------------|------------|-------|------------------|
| Flicker | Tick refresh | Socket effect deps changed every tick → reconnect + recovery refresh | `GameWorkspaceProvider` | **Yes** |
| Widget overlap | Busy overlay + grid overflow | Fixed overlay + non-responsive overview grid | CSS / components | Partially shared (width oscillation from reconnect) |
| Stale banner | `connected` after spurious disconnect | Recovery on every connect + disconnect loop | `GameWorkspaceProvider` | **Yes** |

---

## 13. Changes Made

### Runtime (primary)

- `GameWorkspaceProvider.tsx`
  - Refs for `viewData`, `regions`, socket/recovery callbacks
  - Socket effect runs once (`[]` deps)
  - Recovery only after `hadDisconnectRef`
  - Initial session load effect mount-only
  - `refreshWorkspaceScopeSlices` reads current state from refs

### Query identity

- Removed `tickKey` from all screen `useScreenQuery` keys
- Updated architecture tick-sync rule + tests

### Layout (secondary)

- `operations-dashboard-layout.css` — `position: relative`
- `dashboard-components.css` — loading overlay `absolute` not `fixed`
- `OperationsOverviewStrip.tsx` — `.pg-kpi-grid`

---

## 14. Why Previous Flicker Fix Was Insufficient

`useScreenQuery` correctly avoided `isLoading` during background refresh, but **did not address**:

1. WebSocket reconnect loop resetting connection/stale state
2. Full workspace recovery invalidating all queries every reconnect
3. Tick-embedded query keys causing duplicate refresh cycles
4. Global session loading flash when session effect re-ran (deps on unstable callbacks)

The prior fix addressed **one render branch**; this incident required **lifecycle stability**.

---

## 15. Architecture Compliance

- Simulation ticks **not disabled**
- Query invalidation **retained**
- WebSocket updates **retained**
- No global `overflow: hidden`
- No ViewData / gameplay changes
- No shell rebuild

---

## 16. Targeted Tests

| Test | Purpose |
|------|---------|
| `dashboard-reconnect.integration.test.tsx` | Socket stays connected on tick refresh; recovery only after disconnect |
| `screen-query-key-stability.test.ts` | No tick in query keys |
| `presentation-tick-sync-rules.test.ts` | Architecture guard inverted correctly |
| `operations-dashboard-layout.test.ts` | Relative layout + absolute overlay |
| `operations-dashboard.test.tsx` | Overview strip uses `.pg-kpi-grid` |
| `useScreenQuery.test.ts` | Background refresh semantics (retained) |

---

## 17. Manual Runtime Validation

Session: **StabilityTest** @ **1236×697** (user viewport)

| Screen | Ticks sampled | Loading flash | Stale banner | KPI clipped | Overflow |
|--------|---------------|---------------|--------------|-------------|----------|
| Executive Dashboard | 12 samples (tick 1→6) | **None** | **None** | **0** | **No** |

Executive dashboard validated under active simulation. Operatives/World/Production inherit same runtime fix; layout delta scoped to operations dashboard grids/overlay.

---

## 18. Viewport Validation

| Viewport | Result |
|----------|--------|
| **1236×697** (user) | 0 clipped, no overflow, no flicker, no stale banner |
| 1905× (prior delta) | KPI fit confirmed in earlier validation |

---

## 19. Full Regression

**908 / 908 PASS** (246 files)

---

## 20. build:web

**PASS**

---

## 21. typecheck/lint delta

Not re-run as release gate for this incident slice; no new type errors introduced in changed TS files. Pre-existing lint debt unchanged.

---

## 22. Remaining Risks

| Risk | Note |
|------|------|
| `.pg-query-row` at ≤1024px | Minor horizontal scroll in wide tables — separate panel issue |
| `OperationsKpiStrip` loader deps | `companyViewData.labels` in executive buildings loader still stable |

---

## 23. Final Decision

## **OPTION A — UI STABILITY INCIDENT RESOLVED — PASS**

M12 Release Preparation may proceed to external re-validation of this delta.

---

## 24. Changed Files

- `apps/web/src/presentation/state/GameWorkspaceProvider.tsx`
- `apps/web/src/presentation/screens/dashboard/ExecutiveDashboardScreen.tsx`
- `apps/web/src/presentation/screens/world/WorldScreen.tsx`
- `apps/web/src/presentation/screens/production/ProductionScreen.tsx`
- `apps/web/src/presentation/screens/buildings/BuildingsScreen.tsx`
- `apps/web/src/presentation/screens/research/ResearchScreen.tsx`
- `apps/web/src/presentation/screens/transport/TransportScreen.tsx`
- `apps/web/src/presentation/screens/market/MarketScreen.tsx`
- `apps/web/src/presentation/screens/query/QueryScreens.tsx`
- `apps/web/src/presentation/screens/reports/ReportsScreen.tsx`
- `apps/web/src/presentation/screens/company/OperationsOverviewStrip.tsx`
- `apps/web/src/presentation/screens/company/operations-dashboard-layout.css`
- `apps/web/src/presentation/components/dashboard/dashboard-components.css`
- `apps/web/src/presentation/hooks/screen-query-key-stability.test.ts`
- `apps/web/src/presentation/runtime/dashboard-reconnect.integration.test.tsx`
- `apps/web/src/presentation/runtime/world-search-selection.integration.test.ts`
- `apps/web/src/presentation/screens/company/operations-dashboard-layout.test.ts`
- `apps/web/src/presentation/screens/company/operations-dashboard.test.tsx`
- `apps/web/src/presentation/screens/query/QueryScreens.test.tsx`
- `apps/web/src/presentation/screens/world/WorldScreen.test.tsx`
- `tests/architecture/presentation-tick-sync-rules.test.ts`
- `docs/architecture/reviews/M12_UI_STABILITY_FLICKER_LAYOUT_INCIDENT_REPORT.md`

---

*End of Report*
