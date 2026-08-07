# Simulation Integration Guide

**Project:** Project Genesis  
**Milestone:** M11 Phase 5 — Simulation Integration Layer (canonical overview)  
**Audience:** Frontend and full-stack developers  
**Status:** Phase 5.6 closeout — **SIMULATION INTEGRATION READY**

---

## Phase 5 package map

| Phase | Deliverable | Guide / report |
|-------|-------------|--------------|
| 5.0 | Auto tick loop, command guard | This guide (baseline) |
| 5.1 | Runtime binding audit | `M11_PHASE5_1_RUNTIME_BINDING_AUDIT_REPORT.md` |
| 5.2 | Runtime binding corrections | `RUNTIME_VIEWDATA_GUIDE.md` |
| 5.3 | Shared selection & URL sync | `M11_PHASE5_3_SELECTION_AND_SYNCHRONIZATION_REPORT.md` |
| 5.4A | Command pipeline & invalidation | `COMMAND_EXECUTION_GUIDE.md` |
| 5.4B | Simulation events & notifications | `NOTIFICATION_SYSTEM_GUIDE.md` |
| 5.5 | Resilience, reconnect, performance | `RUNTIME_RESILIENCE_AND_PERFORMANCE_GUIDE.md` |
| 5.6 | E2E validation & closeout | `M11_PHASE5_SIMULATION_INTEGRATION_FINAL_REPORT.md` |

---

## End-to-end data flow

```text
SimulationEngine (domain)
  → GameSession facade
  → REST API (/api/*)
  → presentation adapters (*-client.ts, query-client)
  → workspace mappers → WorkspaceViewData / CompanyDashboardViewData
  → GameWorkspaceProvider (refresh, commands, notifications, runtime state)
  → Screens / Shell / Inspector / Notification Center / Status Bar
  → User action
  → runCommand → executePresentationCommand
  → scoped workspace refresh + screen invalidation
  → notification sync (single coalesced pass)
  → React render
```

No gameplay logic in React components.

---

## ViewData flow

| Layer | Source | Consumer |
|-------|--------|----------|
| Session / simulation | `/api/session/status`, `/api/simulation/status` | `WorkspaceViewData.session`, `.simulation` |
| Dashboard aggregate | `/api/dashboard` | `CompanyDashboardViewData` |
| World | `/api/world/*` | `WorkspaceViewData.world`, regions |
| Screen lists | `useScreenQuery` + tick keys | Operation screens |

Authoritative clock: `simulation.tickNumber`, `simulation.simulationTime` — not browser time.

---

## Shared selection (Phase 5.3)

- URL-backed `entitySelection` in `navigation-state.ts`
- `selectEntity`, `navigateToTarget`, global search, context menu share one model
- Invalid selections recovered against entity catalog on dashboard load

---

## Command flow (Phase 5.4A)

```text
UI → runCommand(action, message, { commandId })
  → executePresentationCommand
  → typed client (callApi)
  → scoped refreshWorkspaceScopeSlices
  → invalidateScreenQueryScopes
  → success toast
```

- `commandId` required on direct `runCommand` calls (architecture test)
- `isBusy` + `canRunCommands` prevent duplicate / unsafe submissions
- Generation counter cancels stale responses

Registry: `command-invalidation-map.ts`

---

## Query invalidation

| Layer | Mechanism |
|-------|-----------|
| Workspace | `refresh-workspace-scopes.ts` — dashboard, session, world, saves |
| Screen | `QueryInvalidationStore` + `useScreenQuery` token |
| Tick / WebSocket | Debounced scoped refresh (250 ms) |

---

## Simulation events & notifications (Phase 5.4B)

```text
Event log API + runtime KPI alerts
  → buildSimulationNotificationFeed
  → merge + dedupe (max 50)
  → notification center + toasts + critical announcer
```

- `NotificationSyncSession` coalesces concurrent sync (Phase 5.5 C6)
- Event log entries do not expose gameplay `entityId` yet — screen-level actions only (C5 deferred)

---

## Stale data & reconnect (Phase 5.5)

| State | Behavior |
|-------|----------|
| `connected` | Normal operation |
| `disconnected` / `reconnecting` | Last ViewData preserved, `isDataStale`, commands disabled |
| Recovery | `retryRuntimeRecovery()` — scoped refresh, no full reload |

`deriveWorkspaceRuntimeState()` drives status bar, banners, `aria-busy`.

---

## Automatic tick loop

`SimulationTickLoop` in `GameWorkspaceShell` calls `runSimulationTick()` when session active, not paused, not busy.

Speed intervals (base 2000 ms): ×1 → 2000 ms, ×2 → 1000 ms, ×4 → 500 ms.

Tick-sensitive screens key `useScreenQuery` with `tickKey` + `TICK_QUERY_DEBOUNCE_MS` (250 ms).

---

## Performance strategy

- Scoped refresh instead of full `loadWorkspaceQueries` after commands
- WebSocket debounce 250 ms
- Notification sync once per scoped refresh pass
- Budgets documented in `RUNTIME_RESILIENCE_AND_PERFORMANCE_GUIDE.md`

---

## Accessibility

- `aria-busy` on main workspace during loading/reconnect
- Notification list: polite live region; critical: assertive announcer
- Status bar labels for connection, data freshness, autosave
- No per-tick screen reader announcements

---

## Automated validation (Phase 5.6)

| Suite | Path |
|-------|------|
| API E2E workflows | `apps/api/src/e2e/m11-phase5-simulation-integration-flow.test.ts` |
| Presentation closeout | `apps/web/src/presentation/m11-phase5-closeout.integration.test.ts` |
| Architecture | `tests/architecture/presentation-command-id-rules.test.ts`, `presentation-tick-sync-rules.test.ts` |

Run:

```bash
pnpm test
pnpm test:e2e
pnpm typecheck
pnpm build:web
```

---

## Extension rules

1. Add commands with `commandId` + invalidation map entry
2. Map new event categories in `map-event-log-notification.ts` (no UI string parsing)
3. Key tick-sensitive queries with `tickKey`
4. Use `runCommand` — never mutate ViewData in components
5. Extend backend event log with `entityId` before entity-specific notification deep links

---

## Related documents

- `docs/decisions/DD-038-Presentation-Architecture.md`
- `docs/development/RUNTIME_VIEWDATA_GUIDE.md`
- `docs/architecture/reviews/M11_PHASE5_SIMULATION_INTEGRATION_FINAL_REPORT.md`
