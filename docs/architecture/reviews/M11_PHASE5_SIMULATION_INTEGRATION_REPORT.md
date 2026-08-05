# M11 Phase 5 — Simulation Integration Layer Report

**Project:** Project Genesis  
**Milestone:** M11 Phase 5  
**Review date:** 2026-08-05  
**Reference:** `docs/development/Prompts/M11_PHASE_5_SIMULATION_INTEGRATION_LAYER.md`

---

# Executive Summary

Phase 5 closes the simulation ↔ UI integration gap by adding a **client tick loop**, **command generation safety**, **tick-synchronized World and Executive queries**, and consolidated documentation. The existing M9 pipeline (provider, API clients, WebSocket refresh, simulation controls) remains the foundation; Phase 5 adds the missing runtime behaviour for a live running simulation.

**Final statement:** **SIMULATION INTEGRATION READY**

---

# Integrated Flow

| Layer | Status |
|-------|--------|
| Simulation engine | ✅ Server-authoritative ticks via API |
| Application services | ✅ `GameSession` facade |
| Query contracts | ✅ `query-client`, workspace loaders |
| Presentation view-data | ✅ `WorkspaceViewData`, `CompanyDashboardViewData` |
| Dashboard | ✅ Provider refresh + executive/operations screens |
| World map | ✅ Tick-keyed overlay + inspector queries (Phase 5) |
| Inspector | ✅ Entity selection + PGInspectorPanel |
| Notifications | ✅ Toasts (`runCommand`) + dashboard alerts |

---

# Phase 5 Deliverables

| Deliverable | Implementation |
|-------------|----------------|
| Auto tick loop | `SimulationTickLoop` + `useSimulationTickLoop` |
| Speed-scaled intervals | `resolveSimulationTickIntervalMs()` |
| Stale command guard | `commandGenerationRef` in `runCommand` |
| Silent auto-tick command | `runSimulationTick()` |
| World tick sync | Query keys include `tickNumber` |
| Executive tick sync | Buildings query keyed by tick |
| Documentation | `SIMULATION_INTEGRATION_GUIDE.md` |

---

# Architecture

```text
GameWorkspaceShell
  ├── SimulationControlsBar (manual commands → runCommand)
  ├── SimulationTickLoop (auto ticks → runSimulationTick)
  └── Screens
        ├── companyViewData ← provider refresh
        └── useScreenQuery(`…:${tickKey}`) ← tick-driven reload
```

---

# Testing

| Test | Status |
|------|--------|
| `simulation-integration.test.ts` | ✅ |
| `useSimulationTickLoop.test.ts` | ✅ |
| Existing simulation API tests | ✅ Unchanged |

---

# Remaining Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Double refresh (tick API + WebSocket) | Low | 250 ms debounce on provider refresh |
| Auto-tick continues on background tab | Low | Future: Page Visibility API pause |
| `advanceSimulation(count>1)` still unused in UI | Low | Available for debug/batch tools |

---

# Recommendations

1. Pause tick loop when document is hidden (`document.visibilityState`).
2. Surface latest simulation events in `PGNotificationCenter` from event log.
3. Optional partial refresh using WebSocket `tickNumber` payload.

---

**SIMULATION INTEGRATION READY**
