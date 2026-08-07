# M11 Phase 6.2 Production Runtime & Event Corrections

**Project:** Project Genesis  
**Milestone:** M11 — Visual Production & User Experience  
**Phase:** 6.2 — Production Runtime & Event Corrections  
**Date:** 2026-08-07  
**Baseline:** Phase 6.1 audit `M11_PHASE6_1_PRODUCTION_SYSTEM_AUDIT.md`  
**Tests:** 874 passing (`pnpm test`)

---

## 1. Executive Summary

Phase 6.2 closes the highest-priority runtime gaps from the Phase 6.1 audit without redesigning production architecture. Production job completion now flows through the existing player event log and notification pipeline with authoritative `entityId` linkage. Running jobs expose presentation-level stalled states when energy or workforce blocks tick progress. Save/load round-trip coverage for in-progress jobs was added.

**Final decision:** **PRODUCTION RUNTIME CORRECTIONS READY**

**Recommended next package:** Phase 6.3 — Production Operations UI (Sprint 4 Core: PR-001–PR-003)

---

## 2. Scope

| In scope | Out of scope |
|----------|----------------|
| Completion player events + notifications | Production queues, cancel/pause |
| Event log `entityId` / `entityType` | Sprint 4 mockup UI (PR-001 … PR-010) |
| Stalled production presentation state | `productionCost` finance posting |
| Save/load production job test | One-job-per-building enforcement |
| GameSession integration tests | Domain lifecycle redesign |
| Schema doc alignment | New API endpoints |

---

## 3. Audit Findings Addressed

| ID | Disposition | Summary |
|----|-------------|---------|
| G-03 | **RESOLVED** | `operationalState` on `ProductionJobSessionReadModel`; UI labels via `formatProductionStatus` |
| G-04 | **DEFERRED WITH JUSTIFICATION** | Concurrent jobs per building **UNSPECIFIED** — no authoritative forbid rule; design clarification tracked |
| G-05 | **DEFERRED — GAMEPLAY SEMANTICS REQUIRED** | `productionCost` in content; no unambiguous charge timing in docs/code |
| G-06 | **RESOLVED** | `#recordCompletedProductionEvents` in `GameSession` tick snapshot path |
| G-07 | **RESOLVED** | Optional `entityId` / `entityType` on event log; notification mapper uses authoritative fields |
| G-12 | **RESOLVED** | `GameStateSerializer.test.ts` running job round-trip |
| G-13 | **PARTIAL** | `GameSession.test.ts` facade coverage; m9/m11 E2E API flows; Nest controller happy-path blocked by multi-`session/new` limitation |
| AV-02 | **RESOLVED** | `Production.Schema.md` implementation status section added |

---

## 4. Production Completion Event

`ProductionSimulationSystem` continues to emit `ProductionCompleted` domain events. Completion inventory handling remains in `ProductionInventoryService.completeJob` (unchanged).

Player-visible completion is recorded in `GameSession.#recordTickSnapshot()` via `#recordCompletedProductionEvents`, mirroring the transport completion pattern with `#loggedCompletedProductionJobIds` for exactly-once logging.

---

## 5. Player Event Log Integration

- Extended `EventLogEntryReadModel` and `PlayerEventLogService` with optional `entityId` and `entityType`.
- `GameSession.startProduction` records start events with `entityId: jobId`, `entityType: 'production'`.
- Completion events use recipe display name from content and the same entity linkage.
- Simulation timestamps use `clock.now()` and `simulationEngine.state.tickNumber` — no browser time.

---

## 6. Notification Entity Linkage

- `EventLogEntryDto` extended with optional `entityId` / `entityType`.
- `mapEventLogEntryToNotification` maps authoritative fields; no message parsing.
- Production start/completion notifications map to `success` severity when message indicates start or completion.

---

## 7. Notification Actions

`open-production` action resolves via `resolveNotificationAction` with `entityId` → shared selection `{ kind: 'production', id }`. Covered by existing `notification-actions.ts` and new notification mapper tests.

---

## 8. Stalled Production Visibility

`ProductionOperationalState` added to session read models:

| State | Condition |
|-------|-----------|
| `WAITING` | Domain `WAITING` |
| `RUNNING` | Running with energy and workers |
| `STALLED_ENERGY` | `RUNNING` + `!canAffordRecipeEnergy` |
| `STALLED_WORKFORCE` | `RUNNING` + worker efficiency ≤ 0 |
| `FINISHED` | Domain `FINISHED` |

Computed in `GameSession.#resolveProductionOperationalState` using `energyBalanceService` and `employeeAllocationService` (added to `ApplicationContext`).

Presentation labels: `Energie fehlt`, `Keine Mitarbeiter` via `formatProductionStatus`.

---

## 9. Concurrent Jobs Per Building Decision

**UNSPECIFIED.** Gameplay doc references building queues (not implemented). DD-011 does not forbid multiple concurrent jobs. No behavioral change. Tracked for future design clarification.

---

## 10. Production Cost Decision

**DEFERRED — GAMEPLAY SEMANTICS REQUIRED.** `Recipe.Schema.md` defines `productionCost` as a static value without charge timing, account rules, or insufficient-funds behavior. `FinanceTransactionType.PRODUCTION_COST` exists but no posting hook was integrated.

---

## 11. Save / Load Verification

Added `GameStateSerializer` hydrate test for a `RUNNING` job with 42% progress, verifying status, recipe, and `startTime` after round-trip.

---

## 12. API Verification

| Endpoint | Status |
|----------|--------|
| `POST /api/production/start` | Existing validation tests retained |
| `GET /api/production/jobs` | Covered by m9/m11 E2E flows |
| Controller happy-path | Not added — `POST /api/session/new` cannot be reliably invoked twice in shared Nest test session (pre-existing limitation) |

Facade coverage: `GameSession.test.ts` start + list + completion event flow.

---

## 13. Integration Tests

`GameSession.test.ts`:

- Production completion → single player event with `entityId`
- Duplicate tick does not duplicate completion event
- Stalled workforce state when no workers assigned

---

## 14. Notification Tests

`map-event-log-notification.test.ts`: production start/completion with entity linkage and success severity.

`PlayerEventLogService.test.ts`: entity field persistence.

---

## 15. Documentation Alignment

- `docs/schemas/Production.Schema.md` — CURRENTLY IMPLEMENTED vs NOT YET IMPLEMENTED table
- `docs/development/NOTIFICATION_SYSTEM_GUIDE.md` — event log entity linkage section
- `docs/development/IMPLEMENTATION_PROGRESS.md` — Phase 6.2 entry

---

## 16. Regression Results

| Suite | Result |
|-------|--------|
| Full `pnpm test` | **874 / 874** pass |
| Domain production tests | Pass |
| GameSession / serializer | Pass |
| m9 / m10 / m11 E2E | Pass (unchanged) |
| Phase 5 presentation / notification | Pass |

---

## 17. Deferred Items

- Production cost finance posting (G-05)
- Concurrent jobs per building rule (G-04)
- Nest controller dedicated happy-path (G-13 partial)
- C5 broader entity linkage for non-production categories (out of 6.2 scope)

---

## 18. Remaining Risks

| Risk | Mitigation |
|------|------------|
| Finished jobs remain in repository | Existing behavior; completion events logged once via id set |
| Stalled state is read-model only | Documented; no false domain `BLOCKED` status |
| Multi `session/new` API limitation | Documented; E2E uses single-session flows |

---

## 19. Recommendations

1. Proceed to **Phase 6.3** — PR-001/002/003 mockup integration on existing `ProductionScreen`.
2. Schedule design clarification for concurrent jobs and `productionCost` semantics before implementing G-04/G-05.
3. Consider `StartNewGameUseCase` reset strategy if repeated `session/new` API calls are required.

---

## 20. Final Decision

**PRODUCTION RUNTIME CORRECTIONS READY**

---

*End of M11 Phase 6.2 Production Runtime & Event Corrections Report.*
