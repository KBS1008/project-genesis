# M11 Gate — Phase 5.4A + 5.4B Commands & Notifications Review

**Project:** Project Genesis  
**Milestone:** M11 — Visual Production & User Experience  
**Gate:** Phase 5.4 (A + B) — Command Pipeline & Simulation Notifications  
**Review date:** 2026-08-07  
**Commit audited:** `5127a50` (master, synced with `origin/master`)  
**References:**  
- `docs/development/Prompts/M11_PHASE_5_4A_COMMANDS_AND_QUERY_INVALIDATION.md`  
- `docs/development/Prompts/M11_PHASE_5_4B_SIMULATION_EVENTS_AND_NOTIFICATIONS.md`  
**Baseline:** M11 Phase 5.3 CLOSED (`63fa519` — Shared Selection)  
**Reviewer:** Independent read-only audit

---

# Executive Summary

Phase 5.4A delivers a unified `runCommand` → `executePresentationCommand` pipeline with scoped workspace refresh and screen query invalidation. Phase 5.4B layers a typed `SimulationNotification` feed from event log + runtime alerts into the executive notification center, deduped toasts, critical announcer, and status bar.

All **159 presentation tests pass** at audit time (+18 vs Phase 5.3 presentation baseline of 141 scoped to commands/notifications delta). Implementation reports, `COMMAND_EXECUTION_GUIDE.md`, and `NOTIFICATION_SYSTEM_GUIDE.md` are present and match the repository.

The gate is **not fully clean against the Phase 5.4 specification checklists**. Integration-level tests for command flows and notification actions are thin; event-log navigation still uses log entry ids rather than gameplay entity refs; notification actions are wired only on the executive dashboard.

**Gate decision:** **PASS WITH MINOR CORRECTIONS**

Phase 5.4 is suitable to close for Phase 5.5 (resilience / performance / E2E validation). Tracked corrections are non-blocking.

**Final statements:** **COMMAND PIPELINE READY** · **SIMULATION EVENTS READY**

---

# Scope

| Area | 5.4A | 5.4B |
|------|------|------|
| Command pipeline | `presentation/commands/`, `GameWorkspaceProvider.runCommand` | Reused for `retry-save` |
| Workspace refresh | `refresh-workspace-scopes.ts` | Sync after scoped refresh |
| Screen invalidation | `useScreenQuery` + invalidation store | — |
| Notifications | — | `presentation/notifications/*`, provider sync |
| UI surfaces | Screen `commandId` wiring | `PGNotificationCenter`, status bar, announcer |
| Tests | 11 command/refresh unit tests | 17 notification unit tests |
| Docs | `COMMAND_EXECUTION_GUIDE.md`, 4A report | `NOTIFICATION_SYSTEM_GUIDE.md`, 4B report |

**Out of scope:** Simulation logic changes, new gameplay mechanics, Phase 5.5 reconnect/perf work.

---

# Phase 5.4A — Gate Checklist

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Command inventory | ✅ PASS | `COMMAND_REGISTRY` in `command-invalidation-map.ts` |
| Unified execution flow | ✅ PASS | `execute-command.ts` → typed clients → scoped refresh |
| Query invalidation (workspace) | ✅ PASS | `refresh-workspace-scopes.ts`, scope map per command |
| Query invalidation (screens) | ✅ PASS | `query-invalidation.ts`, `useScreenQuery` token |
| Loading / busy guard | ✅ PASS | `isBusy` + `isBusyRef` in provider |
| Stale-response guard | ✅ PASS | `commandGenerationRef` |
| Duplicate submission prevention | ✅ PASS | `execute-command.test.ts`, busy guard |
| Error handling | ✅ PASS | `PresentationCommandError`, error toasts |
| No ViewData mutation in components | ✅ PASS | Refresh via provider only |
| `commandId` on wired screens | ✅ PASS | Buildings, Production, Research, Market, Simulation, Save, Employees |
| Integration tests (prompt STEP 8) | ⚠️ PARTIAL | Unit coverage strong; no dedicated integration suite for save/load flows |
| Architecture test (`commandId` required) | ⚠️ OPEN | Recommended in 4A report; not implemented |
| `custom` fallback full refresh | ⚠️ ACCEPTED | `CompanyDashboardScreen.runAction` may omit `commandId` → full scopes |
| Documentation | ✅ PASS | Guide + progress + 4A report |
| Regression | ✅ PASS | 159 presentation tests green |

---

# Phase 5.4B — Gate Checklist

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Event inventory | ✅ PASS | `APPLICATION_EVENT_INVENTORY` |
| Notification model | ✅ PASS | `SimulationNotification`, simulation timestamps |
| Event log mapping | ✅ PASS | `map-event-log-notification.ts` + 6 unit tests |
| Runtime alert mapping | ✅ PASS | `map-runtime-alerts.ts` (energy, tax, logistics) |
| Merge / dedup / bound history | ✅ PASS | `merge-simulation-notifications.ts`, max 50 |
| Notification actions | ✅ PASS | `notification-actions.ts` → navigation / `session.save` |
| Status bar binding | ✅ PASS | `WorkspaceStatusBar` — simulation, autosave, connection, tick, speed |
| Provider sync (no second bus) | ✅ PASS | `syncSimulationNotifications` in `GameWorkspaceProvider` |
| Toast dedup | ✅ PASS | `seenNotificationIdsRef` |
| Critical announcer | ✅ PASS | `SimulationCriticalAnnouncer`, `aria-live="assertive"` |
| Polite live region | ✅ PASS | `PGNotificationCenter` list |
| No tick spam | ✅ PASS | Toasts filtered by severity + seen ids |
| Integration tests (prompt STEP 9) | ⚠️ PARTIAL | Mapping unit tests; no provider/action integration test |
| Notification actions on all screens | ⚠️ PARTIAL | Executive dashboard only |
| `entityId` from event log | ⚠️ ACCEPTED | Uses `EventLogEntryDto.id`; backend entity ref gap documented |
| Documentation | ✅ PASS | Guide + progress + 4B report |
| Regression | ✅ PASS | 159 presentation tests green |

---

# Test Summary

| Suite | Files | Tests | Result |
|-------|-------|-------|--------|
| `presentation/commands/` | 4 | 11 | ✅ |
| `presentation/notifications/` (5.4B) | 5 | 17 | ✅ |
| `refresh-workspace-scopes.test.ts` | 1 | 2 | ✅ |
| Full `apps/web/src/presentation` | 62 | 159 | ✅ |

Commanded at audit: `pnpm exec vitest run apps/web/src/presentation`

---

# Tracked Corrections (Minor)

| ID | Area | Severity | Finding | Recommendation |
|----|------|----------|---------|----------------|
| C1 | 5.4A Testing | Low | No integration tests for save/load/command E2E paths | Add provider-level or screen integration tests in 5.5 |
| C2 | 5.4A Architecture | Low | `commandId` not enforced on all `runCommand` callers | ESLint or architecture test |
| C3 | 5.4B Testing | Low | No test for `executeNotificationAction` → navigation | Integration test with mocked provider |
| C4 | 5.4B A11y | Low | `PGNotificationCenter` axe test omits action buttons | Extend a11y fixture with `onAction` |
| C5 | 5.4B Data | Medium | Event log `entityId` is log entry id, not building/job id | Extend `EventLogEntryDto` when backend ready |
| C6 | 5.4B Perf | Low | Double notification sync after command success | Consolidate in 5.5 perf pass |

---

# Risks Accepted for Gate Close

1. **Custom commands without `commandId`** trigger full refresh scopes — acceptable for thin orchestrators until C2 is addressed.
2. **Runtime alerts reappear after dismiss** on next sync unless id stays in `dismissedNotificationIdsRef` — by design for persistent KPI alerts.
3. **Menu new/load** still rely on full session load on `/game` mount — documented in 4A report.

---

# Recommendations (Phase 5.5+)

1. Add architecture test: every `runCommand` in `presentation/screens` and `shell` must pass `commandId`.
2. Add `GameWorkspaceProvider` integration test for notification sync and `executeNotificationAction`.
3. Extend event log DTO with `entityId` / `entityType` for correct deep links.
4. Measure notification sync latency under WebSocket debounce bursts.

---

# Gate Decision

| Phase | Implementation verdict | Gate |
|-------|------------------------|------|
| 5.4A Commands & Query Invalidation | COMMAND PIPELINE READY | ✅ |
| 5.4B Simulation Events & Notifications | SIMULATION EVENTS READY | ✅ |
| **Combined Phase 5.4** | — | **PASS WITH MINOR CORRECTIONS** |

M11 Phase 5.4 may proceed to Phase 5.5 (resilience, reconnect, performance optimization, end-to-end validation) with corrections C1–C6 tracked as polish, not blockers.

---

**PHASE 5.4 GATE: PASS WITH MINOR CORRECTIONS**
