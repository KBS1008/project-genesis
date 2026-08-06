# M11 Phase 5.4B — Simulation Events & Notifications Report

**Project:** Project Genesis  
**Milestone:** M11 Phase 5.4B  
**Review date:** 2026-08-06  
**Prompt:** M11 Phase 5.4B — Simulation Events & Notifications

---

# Executive Summary

Phase 5.4B connects authoritative application events to the presentation layer through a unified `SimulationNotification` model. Event log entries and runtime dashboard alerts merge into one bounded feed surfaced in the executive notification center, command-success toasts, critical screen reader announcements, and the workspace status bar.

The implementation reuses Phase 5.4A command invalidation and Phase 5.3 navigation/selection. No simulation logic or gameplay rules were modified.

**Final decision:** **SIMULATION EVENTS READY**

---

# Reviewed Events

| Group | Source | UI target | Refresh strategy |
|-------|--------|-----------|------------------|
| Save / Load | Event log `SESSION` | Notification center, retry-save action | `workspace.session` |
| Simulation | Event log `SIMULATION` | Toasts (system) | `workspace.session` |
| Construction | Event log `BUILDING` | open-building | dashboard + buildings |
| Production | Event log `PRODUCTION` | open-production | dashboard + production |
| Research | Event log `RESEARCH` | open-research | dashboard + research |
| Logistics | Event log `TRANSPORT` + runtime logistics | open-transport | dashboard + transport |
| Market | Event log `TRADE` | open-market | dashboard + markets |
| Employees | Event log `EMPLOYEE` | open-inspector | dashboard |
| Energy deficit | Runtime KPI | open-inspector | dashboard |
| Tax blocked | Runtime KPI | critical + open-inspector | dashboard |

Full inventory: `APPLICATION_EVENT_INVENTORY` in `event-inventory.ts`

---

# Notification Model

Single typed model: `SimulationNotification`

- Authoritative `simulationTimestamp` and `tickNumber` from event log / chart points
- No browser timestamps in notification content
- Stable `notificationId` for dedup (event id or `runtime:*` prefix)
- Bounded history: 50 entries (`MAX_SIMULATION_NOTIFICATION_HISTORY`)

---

# Event Mapping

| Mapper | Input | Output |
|--------|-------|--------|
| `mapEventLogEntryToNotification` | `EventLogEntryDto` | Typed severity + category action |
| `mapRuntimeAlertsToNotifications` | `CompanyDashboardViewData` | Energy, tax, logistics runtime alerts |
| `mergeSimulationNotifications` | Event + runtime lists | Sorted, deduped, capped feed |
| `mapSimulationNotificationsToWidgetItems` | `SimulationNotification[]` | `PGNotificationItem[]` |

Examples verified in unit tests:

- Construction completed → success / open-building
- Research completed → success / open-research
- Autosave failed → critical / retry-save
- Production blocked → warning / open-production
- Transport delayed → information / open-transport
- Market contract → information / open-market

---

# Notification Actions

`resolveNotificationAction()` maps action kinds to:

- `EntityNavigationTarget` (shared selection / URL navigation)
- Screen-only navigation (`center-world`)
- Command pipeline (`retry-save` → `session.save` via `runCommand`)

Dashboard widget actions call `executeNotificationAction()` from `GameWorkspaceProvider`.

---

# Status Bar Integration

`WorkspaceStatusBar` in `GameWorkspaceShell` binds:

| Signal | Source |
|--------|--------|
| Simulation status | `viewData.simulation.isPaused`, `session.hasGame` |
| Autosave | `isSessionDirty` |
| Connection | `isLiveConnected` |
| Tick / time / speed | `viewData.simulation` |

No additional polling — data comes from existing workspace refresh paths.

---

# Accessibility

| Requirement | Status |
|-------------|--------|
| Polite live region (notification list) | `PGNotificationCenter` `aria-live="polite"` |
| Assertive critical announcements | `SimulationCriticalAnnouncer` |
| Status bar labels | `aria-label` on status segments |
| No tick spam | Toasts only for unseen warning/success/critical; ticks not announced |
| Keyboard actions | Notification action buttons use `Button` primitive |

---

# Performance

| Check | Result |
|-------|--------|
| Duplicate event subscriptions | Single sync path in `GameWorkspaceProvider` |
| Duplicate notifications | Merge by `notificationId`; toast dedup via `seenNotificationIdsRef` |
| Bounded history | Max 50 notifications |
| Re-render scope | Notification items isolated in provider state |

Local vitest (2026-08-06): 159 presentation tests passed.

---

# Testing

| Suite | Coverage |
|-------|----------|
| `map-event-log-notification.test.ts` | Severity, timestamp, category actions |
| `notification-actions.test.ts` | Navigation resolution, toast/aria rules |
| `sync-simulation-notifications.test.ts` | Merge, dedup, assertive candidates |
| `merge-simulation-notifications.test.ts` | Sort order, id stability, cap |
| `executive-dashboard-view-mappers.test.ts` | Unified notification items param |
| Regression | Full `apps/web/src/presentation` — 159 tests green |

---

# Documentation

- `docs/development/NOTIFICATION_SYSTEM_GUIDE.md` — event flow, model, actions, a11y, extension rules
- `docs/development/IMPLEMENTATION_PROGRESS.md` — Phase 5.4B row updated

---

# Remaining Risks

| Risk | Mitigation |
|------|------------|
| Event log entity ids vs gameplay entity ids | Navigation uses event log id for inspector/event targets; building actions need backend entity refs in future payloads |
| Runtime alert reappearance after dismiss | Dismissed ids tracked in ref; runtime alerts with stable ids reappear on next sync unless dismissed |
| Double sync on command success | Scoped refresh + explicit sync — acceptable latency; can consolidate in 5.5 perf pass |

---

# Recommendations

1. Extend `EventLogEntryDto` with explicit `entityId` / `entityType` when backend supports it.
2. Wire notification actions on additional screens beyond executive dashboard if needed.
3. Phase 5.5: measure notification sync latency under WebSocket burst load.

---

# Final Decision

**SIMULATION EVENTS READY**
