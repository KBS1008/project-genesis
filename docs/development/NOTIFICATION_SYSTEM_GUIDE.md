# Notification System Guide

**Project:** Project Genesis  
**Milestone:** M11 Phase 5.4B  
**Audience:** Frontend developers wiring simulation events to UI notifications

---

## Overview

Simulation notifications connect authoritative application events (event log + runtime dashboard alerts) to:

- Executive dashboard notification center (`PGNotificationCenter`)
- Transient success/warning toasts (`NotificationProvider`)
- Critical screen reader announcements (`SimulationCriticalAnnouncer`)
- Status bar runtime context (`PGStatusBar` in `GameWorkspaceShell`)

There is no second event bus. Notifications are derived from existing APIs and ViewData.

```text
Event log API + company ViewData runtime alerts
  → buildSimulationNotificationFeed()
  → merge + dedupe + bound history (50)
  → widget items + toast candidates + assertive candidates
  → GameWorkspaceProvider state
  → Dashboard / toasts / status bar / announcer
```

---

## Event sources

| Source | API / data | Categories |
|--------|------------|------------|
| Event log | `fetchEventLog()` → `EventLogEntryDto` | SESSION, SIMULATION, BUILDING, PRODUCTION, RESEARCH, TRANSPORT, TRADE, EMPLOYEE |
| Runtime alerts | `CompanyDashboardViewData` | Energy deficit, tax blocked, logistics status |

### Event log entity linkage (Phase 6.2)

`EventLogEntryDto` may include optional `entityId` and `entityType` when the application layer records authoritative gameplay references:

| Category | `entityType` | `entityId` |
|----------|--------------|------------|
| PRODUCTION (start / completion) | `production` | Production job id (e.g. `production_001`) |

Presentation maps these fields into `SimulationNotification.entityId` for deep-link navigation (`open-production` → shared selection). Do not parse entity ids from human-readable message text.

Inventory: `APPLICATION_EVENT_INVENTORY` in `event-inventory.ts`

---

## Notification model

`SimulationNotification` (`simulation-notification-types.ts`):

| Field | Rule |
|-------|------|
| `notificationId` | Stable id (event log id or `runtime:*`) |
| `severity` | information, success, warning, critical, system |
| `title`, `message` | Server/event log text — no UI-generated gameplay meaning |
| `simulationTimestamp`, `tickNumber` | Authoritative simulation clock — no `Date.now()` |
| `entityId`, `entityType` | Optional navigation target |
| `action` | Navigation or command intent |
| `readState` | unread / read (presentation only) |
| `eventLogId` | Source event log entry when applicable |

---

## Severity rules

| Severity | Widget tone | Toast | Assertive live region |
|----------|-------------|-------|------------------------|
| information | info | no | no |
| success | success | yes | no |
| warning | warning | yes | no |
| critical | error | yes | yes |
| system | info | no | no |

Mapping: `notification-actions.ts` (`shouldAnnounceNotificationAsToast`, `shouldAnnounceNotificationAssertively`)

---

## Actions

Actions reuse shared selection and navigation — no duplicated routing.

| Action | Resolution |
|--------|------------|
| `open-region` | `buildRegionNavigationTarget` |
| `open-building` | `buildBuildingNavigationTarget` (Buildings screen) — *World map building markers use `buildProductionBuildingNavigationTarget` per `WORLD_MODULE_IMPLEMENTATION_GUIDE.md`* |
| `open-production` | production screen + entity selection |
| `open-research` | research screen + entity selection |
| `open-transport` | transport screen + entity selection |
| `open-market` | markets screen / resource navigation |
| `open-inspector` / `open-event-log` | reports / event navigation |
| `center-world` | world screen |
| `retry-save` | `runCommand` → `session.save` |
| `dismiss` | remove from notification center |

Entry point: `executeNotificationAction(notificationId, actionKind)` on `GameWorkspaceProvider`.

---

## Provider integration

`GameWorkspaceProvider` syncs notifications after:

- initial `refreshSession()`
- scoped `refreshWorkspaceScopeSlices()` (commands, ticks, WebSocket debounce)
- successful `runCommand()` (after scoped refresh)

Dedup:

- `seenNotificationIdsRef` — suppresses repeat toasts for known ids
- `dismissedNotificationIdsRef` — user-dismissed items stay hidden

Context fields:

- `simulationNotificationItems` — dashboard widget feed
- `criticalAnnouncement` — assertive announcer text
- `executeNotificationAction` / `dismissSimulationNotification`

---

## Status bar

`WorkspaceStatusBar` binds runtime ViewData (no polling):

- Simulation status (active / paused / no session)
- Autosave (`isSessionDirty`)
- Connection (`isLiveConnected`)
- Tick, simulation time, speed label

---

## Accessibility

| Feature | Implementation |
|---------|----------------|
| Notification list | `aria-live="polite"` on `PGNotificationCenter` list |
| Critical events | `SimulationCriticalAnnouncer` — `role="alert"`, `aria-live="assertive"` |
| Status bar | `aria-label` on company, simulation, connection, autosave, tick line |
| Spam control | No per-tick announcements; toast dedup via seen ids |
| Actions | Button per notification; keyboard accessible via `Button` primitive |

---

## Extension rules

1. Add event category mapping in `map-event-log-notification.ts` (typed, no string parsing in React components).
2. Register category in `APPLICATION_EVENT_INVENTORY`.
3. Add action resolution in `notification-actions.ts` if a new navigation target is needed.
4. Reuse `runCommand` with `commandId` for mutations — do not call clients from notification handlers except via existing command pipeline.
5. Keep notification ids stable for dedup and bounded history (`MAX_SIMULATION_NOTIFICATION_HISTORY = 50`).

---

## Key files

| Path | Purpose |
|------|---------|
| `notifications/simulation-notification-types.ts` | Model |
| `notifications/event-inventory.ts` | Event catalog |
| `notifications/map-event-log-notification.ts` | Event log mapping |
| `notifications/map-runtime-alerts.ts` | KPI/runtime alerts |
| `notifications/merge-simulation-notifications.ts` | Merge + sort + cap |
| `notifications/sync-simulation-notifications.ts` | Feed builder |
| `notifications/notification-actions.ts` | Action resolution |
| `state/GameWorkspaceProvider.tsx` | Sync + context API |
| `components/dashboard/PGNotificationCenter.tsx` | Widget UI |
