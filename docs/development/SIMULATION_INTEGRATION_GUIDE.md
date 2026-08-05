# Simulation Integration Guide

**Project:** Project Genesis  
**Milestone:** M11 Phase 5 — Simulation Integration Layer  
**Audience:** Frontend and full-stack developers

---

## Overview

Phase 5 connects the deterministic simulation engine to the production UI through a typed, testable integration layer. Data flows:

```text
SimulationEngine (domain)
  → GameSession facade
  → REST API (/api/simulation/*)
  → presentation adapters (simulation-client, query-client)
  → workspace mappers → WorkspaceViewData / CompanyDashboardViewData
  → GameWorkspaceProvider
  → Dashboard / World / Screens / Inspector / Notifications
```

No gameplay logic lives in React components — commands and queries stay in adapters.

---

## Core modules

| Module | Path | Role |
|--------|------|------|
| Integration math | `presentation/simulation/simulation-integration.ts` | Tick interval, loop eligibility |
| Tick loop hook | `presentation/simulation/useSimulationTickLoop.ts` | Client auto-tick scheduler |
| Tick loop mount | `presentation/simulation/SimulationTickLoop.tsx` | Headless shell component |
| Workspace provider | `presentation/state/GameWorkspaceProvider.tsx` | Session, commands, refresh |
| Simulation controls | `presentation/shell/SimulationControlsBar.tsx` | Pause / resume / step / speed |
| Screen queries | `presentation/hooks/useScreenQuery.ts` | Tick-keyed data reload |

---

## Automatic tick loop

When a session is active and **not paused**, `SimulationTickLoop` (mounted in `GameWorkspaceShell`) calls `runSimulationTick()` on an interval:

| Speed | Interval (default base 2000 ms) |
|-------|----------------------------------|
| ×1 | 2000 ms |
| ×2 | 1000 ms |
| ×4 | 500 ms |

The loop pauses while:
- no active game session
- simulation is paused
- a user command is in flight (`isBusy`)

Manual **+1 Tick** still uses `stepSimulation()` via `runCommand` (works while paused).

---

## Command safety (DD-038)

`runCommand` increments a **command generation counter**. If a newer command starts before the previous one finishes, stale responses are ignored (no refresh, no success toast, no `isBusy` reset).

Auto-ticks use `runSimulationTick()` separately — no success toasts, no `isBusy` lock.

---

## Live refresh

```text
API mutation or tick
  → DashboardBroadcastService.notifyRefresh({ tickNumber })
  → WebSocket dashboard:refresh
  → GameWorkspaceProvider.scheduleRefreshSession() [250 ms debounce]
  → loadWorkspaceQueries()
```

Tick-sensitive screens also key `useScreenQuery` off `viewData.simulation.tickNumber` with `TICK_QUERY_DEBOUNCE_MS` (250 ms):

- Market, Production, Research, Transport, Buildings, Finance, Reports
- **World map** (Phase 5): map, overlay, inspector queries
- **Executive dashboard** (Phase 5): buildings query

Company operations dashboard reads `companyViewData` directly from the provider (refreshed on every workspace reload).

---

## Simulation commands

| UI action | Client | API |
|-----------|--------|-----|
| Pause | `pauseSimulation()` | `POST /api/simulation/pause` |
| Resume | `resumeSimulation()` | `POST /api/simulation/resume` |
| +1 Tick | `stepSimulation()` | `POST /api/simulation/step` |
| Speed ×N | `setSimulationSpeed(N)` | `POST /api/simulation/speed` |
| Auto tick | `advanceSimulation(1)` | `POST /api/simulation/tick` |

---

## View-data fields

`WorkspaceViewData.simulation`:

- `tickNumber` — current tick
- `simulationTime` — clock time
- `isPaused` — pause state
- `speedMultiplier` — tick duration multiplier (×1/×2/×4)
- `speedLabel` — display label

---

## Testing

| Test file | Coverage |
|-----------|----------|
| `simulation-integration.test.ts` | Interval math, loop eligibility |
| `useSimulationTickLoop.test.ts` | Auto-tick scheduling |
| `SimulationControlsBar.test.tsx` | Manual controls |
| `game.controller.test.ts` | API pause/resume/step/speed |

Run: `pnpm test -- simulation`

---

## Related documents

- `docs/decisions/DD-038-Presentation-Architecture.md`
- `docs/architecture/reviews/M11_PHASE5_SIMULATION_INTEGRATION_REPORT.md`
- `docs/development/DASHBOARD_IMPLEMENTATION_GUIDE.md`
- `docs/development/WORLD_MODULE_IMPLEMENTATION_GUIDE.md`
