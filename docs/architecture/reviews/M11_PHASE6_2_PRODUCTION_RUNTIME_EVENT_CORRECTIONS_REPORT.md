# M11 Phase 6.2 Production Runtime & Event Corrections

**Project:** Project Genesis  
**Milestone:** M11 — Visual Production & User Experience  
**Phase:** 6.2 — Production Runtime & Event Corrections  
**Report date:** 2026-08-27  
**Repository baseline:** `master` @ `c3ae71e` — *Complete M11 Phase 6.2 production runtime event corrections.*  
**Phase 6.1 audit baseline:** `docs/architecture/reviews/M11_PHASE6_1_PRODUCTION_SYSTEM_AUDIT.md`

---

## Verification Record (repository + executed tests)

All statements below were checked against the files at `c3ae71e` and against test runs executed on **2026-08-27**.

| Run | Command | Result |
|-----|---------|--------|
| Full suite | `pnpm test` | **238** test files, **874** tests passed; duration **218.15s**; exit code **0** |
| Phase 6.2–related subset | `pnpm test --` files listed in §13–§14 and §12 | **8** files, **70** tests passed; duration **74.27s**; exit code **0** |
| M11 Phase 5 E2E | `pnpm test -- apps/api/src/e2e/m11-phase5-simulation-integration-flow.test.ts` | **6** tests passed; exit code **0** |
| Domain production | `pnpm test -- src/domain/production` | **1** file (`ProductionJob.test.ts`), **5** tests passed; exit code **0** |

No failing tests were observed in these runs.

---

## 1. Executive Summary

Phase 6.2 implements targeted runtime corrections from the Phase 6.1 audit without redesigning production domain logic or adding Sprint 4 mockup UI.

Verified in code at `c3ae71e`:

- Production job completion is recorded in the player event log via `GameSession.#recordCompletedProductionEvents`, with exactly-once tracking in `#loggedCompletedProductionJobIds`.
- Start and completion events carry optional `entityId` / `entityType` through the application read model and web `EventLogEntryDto`.
- Running jobs expose presentation `operationalState` including `STALLED_WORKFORCE` and `STALLED_ENERGY` (computed in `#resolveProductionOperationalState`).
- Save/load round-trip for a `RUNNING` job with 42% progress is covered by `GameStateSerializer.test.ts`.

Verified by tests (see §13–§16): completion event logging, duplicate-tick prevention, stalled workforce read model, serializer round-trip, notification entity linkage, and existing API E2E flows that call production endpoints.

**Not verified by a dedicated automated test in this repository:** `STALLED_ENERGY` operational state; Nest controller production start **happy path** (success `200` after valid building).

**Final decision:** **PRODUCTION RUNTIME CORRECTIONS READY**

**Recommended next package:** Phase 6.3 — Production Operations UI (Sprint 4 Core: PR-001–PR-003)

---

## 2. Scope

| In scope (present in `c3ae71e`) | Out of scope (not changed in `c3ae71e`) |
|--------------------------------|----------------------------------------|
| Completion player events + notifications | Production queues, cancel/pause |
| Event log `entityId` / `entityType` | Sprint 4 mockup UI (PR-001 … PR-010) |
| Stalled production presentation `operationalState` | `productionCost` finance posting |
| Save/load production job serializer test | One-job-per-building enforcement |
| `GameSession` integration tests | Domain lifecycle redesign |
| Schema / notification / progress docs | New API endpoints |

---

## 3. Audit Findings Addressed

| ID | Disposition | Evidence |
|----|-------------|----------|
| G-03 | **RESOLVED** | `ProductionOperationalState` on `ProductionJobSessionReadModel` (`GameSessionDashboard.ts`); computed in `GameSession.#resolveProductionOperationalState`; labels in `formatProductionStatus` (`presentation-formatters.ts`). **Test:** stalled workforce only — §13. |
| G-04 | **DEFERRED WITH JUSTIFICATION** | No code change enforcing concurrent-job limits. `Production.Schema.md` lists queue as **NOT YET IMPLEMENTED**. |
| G-05 | **DEFERRED — GAMEPLAY SEMANTICS REQUIRED** | No `productionCost` posting hook in `c3ae71e`. `FinanceTransactionType.PRODUCTION_COST` label exists in `presentation-formatters.ts` only. |
| G-06 | **RESOLVED** | `GameSession.#recordCompletedProductionEvents` + `#loggedCompletedProductionJobIds`. **Tests:** §13. |
| G-07 | **RESOLVED** | `EventLogEntryReadModel`, `PlayerEventLogService`, `EventLogEntryDto` optional fields; `mapEventLogEntryToNotification` uses authoritative fields. **Tests:** §13–§14. |
| G-12 | **RESOLVED** | `GameStateSerializer.test.ts` — `restores a running production job with non-zero progress`. |
| G-13 | **PARTIAL** | Facade + E2E coverage (§12). No controller happy-path test in `game.controller.test.ts` (only validation and under-construction rejection). |
| AV-02 | **RESOLVED** | `docs/schemas/Production.Schema.md` implementation status table present. |

---

## 4. Production Completion Event

**Domain (unchanged in 6.2):** `ProductionSimulationSystem` emits `ProductionCompleted`; inventory completion remains in `ProductionInventoryService.completeJob`.

**Application (6.2):** `GameSession.#recordTickSnapshot()` calls `#recordCompletedProductionEvents(productionJobs)` after building the session read-model snapshot. Pattern mirrors transport completion (`#loggedCompletedTransportIds` / `#recordCompletedTransportEvents`).

Completion message format in code: `Produktion abgeschlossen: ${recipeLabel}.` with `entityId: job.id`, `entityType: 'production'`.

Finished jobs loaded from snapshot are seeded into `#loggedCompletedProductionJobIds` via `#seedLoggedCompletedProductionJobs` to avoid duplicate log entries on restore.

---

## 5. Player Event Log Integration

| Layer | Change |
|-------|--------|
| `EventLogEntryReadModel` | Optional `entityId`, `entityType` |
| `PlayerEventLogService` | Persists optional entity fields on append |
| `GameSession.startProduction` | Records start with `jobId` and `'production'` via `#recordPlayerEvent` |
| `GameSession.#recordCompletedProductionEvents` | Records completion with same linkage |
| Timestamps | `#recordPlayerEvent` uses session clock / tick (no browser time in application layer) |

**Test:** `PlayerEventLogService.test.ts` — `stores optional entity linkage fields`.

---

## 6. Notification Entity Linkage

| Layer | Change |
|-------|--------|
| `EventLogEntryDto` (`query-client.ts`) | Optional `entityId`, `entityType` union |
| `mapEventLogEntryToNotification` | Maps authoritative DTO fields; production `success` when message contains `abgeschlossen` or `gestartet` |

**Tests:** `map-event-log-notification.test.ts` — production completion, started, and blocked cases (§14).

---

## 7. Notification Actions

`resolveNotificationAction('open-production', entityId)` resolves to `buildProductionNavigationTarget(entityId)` (`notification-actions.ts`).

**Existing tests (not added in 6.2, present at `c3ae71e`):**

- `notification-actions.test.ts` — `getNotificationActionLabel('open-production')`
- `runtime-pipeline.integration.test.ts` — `routes production notification actions through shared navigation`

6.2 adds mapper coverage that production notifications receive `action: 'open-production'` when entity fields are present (§14).

---

## 8. Stalled Production Visibility

`ProductionOperationalState` (`GameSessionDashboard.ts`): `WAITING` | `RUNNING` | `STALLED_ENERGY` | `STALLED_WORKFORCE` | `FINISHED`.

`GameSession.#resolveProductionOperationalState` logic at `c3ae71e`:

| State | Condition in code |
|-------|-------------------|
| `FINISHED` | Domain status `FINISHED` |
| `WAITING` | Domain status `WAITING` |
| `STALLED_ENERGY` | Domain `RUNNING` and `!energyBalanceService.canAffordRecipeEnergy(...)` |
| `STALLED_WORKFORCE` | Domain `RUNNING` and `employeeAllocationService.getWorkerEfficiency(...) <= 0` |
| `RUNNING` | Domain `RUNNING` with energy and workers |

`ApplicationContext` includes `energyBalanceService` and `employeeAllocationService` (used by resolver).

Presentation: `formatProductionStatus` returns `Energie fehlt` / `Keine Mitarbeiter` when `operationalState` matches; used in `company-dashboard-view-mappers.ts` and `workspace-view-mappers.ts` with `job.operationalState`.

**Test coverage gap:** `GameSession.test.ts` asserts `STALLED_WORKFORCE` only. No test file at `c3ae71e` asserts `STALLED_ENERGY`.

---

## 9. Concurrent Jobs Per Building Decision

**UNSPECIFIED — no behavioral change in `c3ae71e`.** `Production.Schema.md` marks production queue as **NOT YET IMPLEMENTED**. No enforcement code was added.

---

## 10. Production Cost Decision

**DEFERRED — GAMEPLAY SEMANTICS REQUIRED.** No finance posting for `productionCost` in `c3ae71e`. Enum/label `PRODUCTION_COST` exists for display formatting only.

---

## 11. Save / Load Verification

**File:** `src/infrastructure/persistence/savegame/GameStateSerializer.test.ts`  
**Case:** `restores a running production job with non-zero progress`

Snapshot input: `production_001`, `RUNNING`, `progress: 42`, `recipe_planks`, `startTime: 20`.  
Assertions after hydrate: status `RUNNING`, progress `42`, recipe `recipe_planks`, `startTime` `20`.

**Result:** Passed in full suite and Phase 6.2 subset run (2026-08-27).

---

## 12. API Verification

**Endpoints in `game.controller.ts` at `c3ae71e`:** `GET production/jobs`, `POST production/start`.

| Coverage | Evidence |
|----------|----------|
| Validation / rejection | `game.controller.test.ts`: `POST /api/production/start validates required fields`; `POST /api/production/start rejects jobs on buildings under construction` — **2 tests**, passed in subset run |
| Happy path `200` on controller | **Not present** in `game.controller.test.ts` |
| E2E production start + jobs list | `m9-core-gameplay-flow.test.ts` (1 test) — passed |
| E2E industrial chain | `m10-industrial-chain-flow.test.ts` (1 test) — passed |
| E2E command → dashboard refresh | `m11-phase5-simulation-integration-flow.test.ts` — `command → authoritative dashboard refresh (production start)` among **6** tests — passed |

**Documented limitation (from test file behavior):** repeated `POST /api/session/new` in the shared Nest test app is unreliable; controller tests use conditional `session/new` or single-session E2E flows.

**Facade coverage:** `GameSession.test.ts` — `starts production after construction completes` plus §13 cases.

---

## 13. Integration Tests (`GameSession.test.ts`)

**File total:** 10 tests (all passed, 2026-08-27).

| Test name | What it verifies |
|-----------|------------------|
| `records production completion in the player event log with entity linkage` | Job `FINISHED` after ticks; one completion event with `entityId: 'production_001'`; start event has same `entityId`; second tick does not duplicate completion |
| `exposes stalled workforce state for running jobs without assigned workers` | `status: 'RUNNING'`, `operationalState: 'STALLED_WORKFORCE'`, `progress: 0` after 5 ticks without workers |
| `starts production after construction completes` | Pre-existing happy path for `startProduction` at facade level |

---

## 14. Notification and Event Log Tests

**`map-event-log-notification.test.ts`** — production-related cases (all passed):

- `maps production completion with authoritative entity linkage` — `success`, `entityId`, `open-production`
- `maps production started events with entity linkage`
- `maps production blocked events to production action`

**`PlayerEventLogService.test.ts`:**

- `stores optional entity linkage fields`

---

## 15. Documentation Alignment

Verified present at `c3ae71e`:

| Document | Content |
|----------|---------|
| `docs/schemas/Production.Schema.md` | **CURRENTLY IMPLEMENTED** vs **NOT YET IMPLEMENTED** table |
| `docs/development/NOTIFICATION_SYSTEM_GUIDE.md` | § Event log entity linkage (Phase 6.2) |
| `docs/development/IMPLEMENTATION_PROGRESS.md` | Phase 6.2 entry; test count **874** |

---

## 16. Regression Results (executed 2026-08-27)

| Suite | Executed | Result |
|-------|----------|--------|
| Full `pnpm test` | Yes | **874 / 874** pass (**238** files) |
| `GameSession.test.ts` | Yes (subset + full) | **10 / 10** pass |
| `GameStateSerializer.test.ts` | Yes (subset + full) | Pass (includes running-job case) |
| `map-event-log-notification.test.ts` | Yes (subset + full) | Pass |
| `PlayerEventLogService.test.ts` | Yes (subset + full) | Pass |
| `game.controller.test.ts` | Yes (subset + full) | Pass (2 production-related cases) |
| `m9-core-gameplay-flow.test.ts` | Yes | **1 / 1** pass |
| `m10-industrial-chain-flow.test.ts` | Yes | **1 / 1** pass |
| `m11-phase5-simulation-integration-flow.test.ts` | Yes | **6 / 6** pass |
| `src/domain/production/ProductionJob.test.ts` | Yes | **5 / 5** pass |

All other project tests passed as part of the full **874** run; individual file counts were not re-enumerated beyond the rows above.

---

## 17. Deferred Items

- Production cost finance posting (G-05)
- Concurrent jobs per building rule (G-04)
- Nest controller dedicated production start happy-path (G-13 partial)
- Automated test for `STALLED_ENERGY` operational state
- C5 broader `entityId` linkage for non-production event categories (out of 6.2 scope)

---

## 18. Remaining Risks

| Risk | Basis |
|------|-------|
| Finished jobs remain in repository | Pre-existing domain behavior; completion events deduplicated via `#loggedCompletedProductionJobIds` |
| Stalled state is read-model only | Domain status stays `RUNNING`; no `BLOCKED` domain status added |
| `STALLED_ENERGY` untested | Implemented in `#resolveProductionOperationalState` but no asserting test at `c3ae71e` |
| Multi `session/new` in Nest tests | Observed in `game.controller.test.ts` conditional setup; no happy-path controller test added |

---

## 19. Recommendations

1. Proceed to **Phase 6.3** — PR-001/002/003 on existing `ProductionScreen`.
2. Clarify concurrent jobs and `productionCost` semantics before G-04/G-05 implementation.
3. Add `STALLED_ENERGY` integration test when energy-deficit scenario is easy to fixture.
4. If repeated `session/new` API coverage is required, address `StartNewGameUseCase` / test app reset strategy first.

---

## 20. Final Decision

**PRODUCTION RUNTIME CORRECTIONS READY**

Evidence: implementation at `c3ae71e`; full test suite **874 / 874** on 2026-08-27; Phase 6.2–targeted cases listed in §13–§16 all passed.

---

*End of M11 Phase 6.2 Production Runtime & Event Corrections Report.*
