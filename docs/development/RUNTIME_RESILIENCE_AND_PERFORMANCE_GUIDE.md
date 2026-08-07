# Runtime Resilience & Performance Guide

**Project:** Project Genesis  
**Milestone:** M11 Phase 5.5  
**Audience:** Frontend developers maintaining workspace runtime behavior

---

## Overview

Phase 5.5 hardens the integrated presentation runtime against temporary connectivity loss, stale ViewData, and redundant refresh/sync work. It reuses the existing command pipeline, query invalidation, and notification system from Phases 5.4A–5.4B.

---

## Runtime state model

`deriveWorkspaceRuntimeState()` (`workspace-runtime-state.ts`) maps provider flags to:

| Phase | Meaning |
|-------|---------|
| `loading` | Initial session load |
| `ready` | Authoritative data, connected |
| `empty` | No active session |
| `stale` | Last valid ViewData preserved, freshness uncertain |
| `reconnecting` | WebSocket reconnect in progress |
| `recoverable-error` | Scoped refresh failed; retry available |
| `fatal-error` | Reserved for unrecoverable workspace failure |

Context fields: `runtimeState`, `connectionState`, `recoverableError`, `canRunCommands`, `retryRuntimeRecovery`.

---

## Stale-data policy

| Freshness | When | UI behavior |
|-----------|------|-------------|
| `fresh` | Successful scoped refresh or initial load | Normal interaction |
| `stale` | Disconnect or failed refresh after prior load | Data stays visible; warning banner |
| `unavailable` | No active session | Empty states |

No invented values. Missing runtime fields remain empty/null.

---

## Connection & reconnect

`connectDashboardSocket()` reports `connected` | `disconnected` | `reconnecting`.

On disconnect after a successful load:

1. `isDataStale` → true (ViewData preserved)
2. `WorkspaceRuntimeBanner` shows reconnect message
3. Commands disabled via `canRunCommands`

On reconnect:

1. `retryRuntimeRecovery()` runs scoped workspace refresh
2. Screen scopes invalidated
3. Stale flag cleared on success

---

## Command behavior while disconnected

`runCommand` returns immediately when:

- `isBusy`
- `!canRunCommands` (disconnected, stale, loading, recoverable error)

Simulation controls and mutation screens use `canRunCommands` / `isBusy` for disabled state.

---

## Refresh matrix

| Trigger | Workspace scopes | Screen invalidation | Notification sync |
|---------|------------------|---------------------|-------------------|
| Initial mount | Full (`refreshSession`) | — | Once |
| Command success | Per `commandId` map | Per `commandId` map | Once (via scoped refresh) |
| Simulation tick | session + dashboard | Affected screens | Once (via scoped refresh) |
| WebSocket debounce | dashboard + session + world | Affected screens | Once (via scoped refresh) |
| Manual retry | dashboard + session + world | Affected screens | Once |
| Reconnect | Same as retry | Same as retry | Once |

No full-page reloads. No per-widget polling.

---

## Notification synchronization

`NotificationSyncSession` coalesces overlapping sync requests into one in-flight pass plus at most one follow-up.

Notification sync runs inside `refreshWorkspaceScopeSlices` only — not again in `runCommand` success path (Phase 5.4 C6 fix).

---

## Performance baseline (local vitest, 2026-08-07)

| Measurement | Baseline |
|-------------|----------|
| Presentation test suite | 159+ tests, ~30s wall |
| Command scope resolution | &lt; 1 ms (unit) |
| Notification sync coalescing | 3 parallel → 2 passes (unit) |
| WebSocket refresh debounce | 250 ms (`SOCKET_REFRESH_DEBOUNCE_MS`) |
| Dashboard selective refresh | 2 API calls vs 7 full load |

---

## Performance budgets (engineering guardrails)

| Interaction | Budget | Measurement |
|-------------|--------|-------------|
| Command feedback (busy state) | &lt; 100 ms perceived | `isBusy` set before API call |
| Scoped refresh after command | &lt; 500 ms local | workspace scope fetch count |
| Notification sync | 1 pass per logical update | `NotificationSyncSession.syncCount` |
| Selection → inspector | &lt; 200 ms | URL + existing ViewData maps |
| WebSocket coalesced refresh | ≤ 1 per 250 ms burst | debounce timer |

---

## Accessibility

| Concern | Implementation |
|---------|----------------|
| Loading / reconnect | `aria-busy` on `#game-workspace-main` |
| Stale / reconnect banners | `StatusBanner` with polite/assertive live regions |
| Critical notifications | `SimulationCriticalAnnouncer` unchanged |
| Focus | Reconnect banners do not auto-focus |
| Tick spam | No per-tick announcements |

---

## Architecture exceptions

| Exception | Reason |
|-----------|--------|
| `CompanyDashboardScreen.runAction` | Thin wrapper; `PGOperationsSidebar` supplies `commandId` |
| `custom` commandId fallback | Legitimate orchestrators without registry entry → full refresh scopes |

Enforced by `tests/architecture/presentation-command-id-rules.test.ts`.

---

## Phase 5.4 finding C5 — entity deep links

`EventLogEntryReadModel` does not expose gameplay `entityId` / `entityType`. Frontend maps `entityId: null` for event-log notifications. Screen-level actions (e.g. open buildings list) remain safe. Entity-specific deep links require a backend contract extension — tracked as deferred.

---

## Key files

| Path | Purpose |
|------|---------|
| `runtime/workspace-runtime-state.ts` | State model |
| `runtime/notification-sync-session.ts` | Sync coalescing |
| `adapters/api/dashboard-socket.ts` | Reconnect events |
| `state/GameWorkspaceProvider.tsx` | Integration |
| `shell/WorkspaceRuntimeBanner.tsx` | Stale/reconnect UI |
