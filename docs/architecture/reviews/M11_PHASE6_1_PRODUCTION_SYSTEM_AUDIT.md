# M11 Phase 6.1 Production System Audit

**Project:** Project Genesis  
**Milestone:** M11 — Visual Production & User Experience  
**Phase:** 6.1 — Production System Integration Audit  
**Audit date:** 2026-08-07  
**Commit audited:** `d228064` (master)  
**Reviewer:** Read-only repository audit per `M11_PHASE_6_1_PRODUCTION_SYSTEM_AUDIT.md`  
**Baseline:** M11 Phase 5 closed (`M11_GATE_PHASE5_FINAL_REVIEW.md`); polish `65364f5`

---

## 1. Executive Summary

Project Genesis already has a **functional recipe-based production pipeline** spanning domain simulation, application use cases, REST API, dashboard read models, and presentation surfaces. Players can place production buildings, start recipes via `production.start`, observe tick-driven progress, receive outputs into inventory on completion, and see jobs across the Production screen, executive/operations dashboards, world inspector, global search, and notifications.

The system is **not a stub** and does **not** require a foundational rebuild. Phase 6 should focus on **targeted integration**: Sprint 4 production UX mockups (PR-001 … PR-010), runtime/event gaps (completion logging, `entityId` linkage), schema-doc alignment (queues, cancel, blocked states), and test hardening.

**Final decision:** **PRODUCTION SYSTEM READY FOR TARGETED INTEGRATION**

**Recommended next package:** **Phase 6.2 — Production Runtime & Event Corrections**

---

## 2. Current Production Architecture

### Expected Phase 5 flow (verified)

```
Simulation (ProductionSimulationSystem)
  → ProductionJobRepository / ProductionInventoryService
  → GameSession / GameSessionDashboardBuilder
  → REST (/api/dashboard, /api/production/*)
  → Presentation mappers (company-dashboard-view-data, workspace-view-mappers)
  → ViewData (companyViewData, jobs query)
  → ProductionScreen / PGProductionWidget / Inspector
```

### Command flow (verified)

```
Production UI (ProductionScreen, dashboard hints)
  → runCommand({ commandId: 'production.start' })
  → POST /api/production/start
  → StartProductionUseCase
  → ProductionJob.create + start (or WAITING + inbound transport)
  → scoped invalidation: workspace.dashboard + screen.production
  → refreshed ViewData
```

No competing command pipeline or second selection model was found in production paths.

### Key references

| Document | Role |
|----------|------|
| `docs/decisions/DD-011-recipe-based-production.md` | Recipe-based production decision |
| `docs/schemas/Production.Schema.md` | Schema doc (queues, blocked — **partially implemented**) |
| `docs/gameplay/production.md` | Gameplay design (broader than runtime) |
| `docs/development/SIMULATION_INTEGRATION_GUIDE.md` | Phase 5 integration rules |
| `docs/project-management/M11_VISUAL_PRODUCTION_PLAN.md` | Phase 6 Production UX scope |

---

## 3. Domain Inventory

| Concept | Owner | State / Rules | Commands | Events | Persistence | Dependencies |
|---------|-------|---------------|----------|--------|-------------|--------------|
| **Recipe** | Content (`game-content/recipes/`) | Inputs, outputs, duration, `productionCost`, `buildingTypes`, research/milestone gates | — | — | Content files | Building types, resources |
| **ProductionJob** | `ProductionJob` aggregate | `WAITING` → `RUNNING` → `FINISHED`; `CANCELLED` enum exists but **unused** | Implicit via `start()` | `ProductionStarted`, `ProductionCompleted` | `GameStateSerializer` → `productionJobs[]` | Building, company, recipe |
| **Production tick** | `ProductionSimulationSystem` | Advances `RUNNING` jobs; skips when energy insufficient or worker efficiency ≤ 0 | — | Pulled from job on tick | — | Energy, employees, repository |
| **Input reservation** | `ProductionInventoryService` | `reserveInputs` at start; `releaseInputs` on failure; `completeJob` consumes inputs + adds outputs | — | Inventory domain events | Inventory snapshot | Recipe registry |
| **Inbound transport deferral** | `StartProductionUseCase` + `TransportLogisticsService` | Job stays `WAITING` until inbound transports complete; then auto-starts | — | Transport events | Transport orders linked via `productionJobId` | Warehouse, routes |
| **Building eligibility** | `BuildingSupportsRecipeSpecification` | Building type must be in recipe `buildingTypes` | — | — | Building snapshot | Content |
| **Regional inputs** | `RegionalResourceAvailabilityPolicy` | Validates recipe inputs against region resources at start | — | — | — | Region content |
| **Energy gate** | `EnergyBalancePort` | Start blocked if insufficient; tick skipped if cannot afford ongoing load | — | — | — | Power plants, recipe energy |
| **Worker efficiency** | `EmployeeAllocationPort` | Scales tick progress; 0 efficiency stalls job | — | — | Employee assignments | Employee content |
| **Production queue** | **Not implemented** | Schema doc describes queues; no domain aggregate | — | — | — | — |
| **Cancel / pause** | **Not implemented** | No use case or aggregate method | — | — | — | — |
| **BLOCKED status** | **Not implemented** | Energy/worker stalls are silent `continue` in simulation | — | — | — | — |
| **One job per building** | **Not enforced** | Repository has no `findByBuildingId`; start use case does not check concurrent jobs | — | — | — | — |
| **Production cost (finance)** | Content field exists | `FinanceTransactionType.PRODUCTION_COST` exists; **no runtime posting observed** at job completion | — | — | — | Finance module |
| **AI production** | `CompanyDecisionExecutionService` | `START_PRODUCTION` decision type delegates to session | — | — | — | Brain/planning |

### Production job lifecycle (actual)

```
StartProductionUseCase
  ├─ needs inbound transport → WAITING (job saved, transports created)
  └─ inputs available → reserve → RUNNING (ProductionStarted event)

ProductionSimulationSystem (each tick)
  ├─ energy insufficient → skip (job stays RUNNING, no BLOCKED state)
  ├─ workerEfficiency ≤ 0 → skip
  └─ tick progress → FINISHED at 100% (ProductionCompleted event)
       → onProductionJobCompleted → ProductionInventoryService.completeJob
```

---

## 4. Application Layer

### Commands (verified)

| Command | Handler | Status |
|---------|---------|--------|
| `StartProductionCommand` | `StartProductionUseCase` | **COMPLETE** |
| Cancel / stop production | — | **MISSING** |
| Change recipe / queue | — | **MISSING** |
| Assign workers (production-specific) | `employees.assign` (general) | **PARTIAL** (not production UI) |

### Queries / read models

| Operation | Source | Status |
|-----------|--------|--------|
| List production jobs | `GameSession.listProductionJobs()` → `ProductionJobSessionReadModel` | **COMPLETE** |
| Dashboard production hints | `GameSessionDashboardBuilder.#readProductionHints` | **COMPLETE** |
| Dashboard production jobs | Included in `GameSessionDashboard` | **COMPLETE** |
| Dedicated recipes query | Recipes only via dashboard `contentNames` / hints iteration | **PARTIAL** |
| Production analytics / efficiency | — | **MISSING** |

### Services

| Service | Role | Status |
|---------|------|--------|
| `ProductionInventoryService` | Reserve, release, complete inventory | **COMPLETE** |
| `TransportLogisticsService` | Inbound deferral, warehouse fulfillment | **COMPLETE** (integrated) |
| `MilestoneEvaluationService` | `PRODUCTION_VOLUME` triggers | **COMPLETE** |
| `PlayerEventLogService` | Command-side event append | **COMPLETE** (completion not wired) |
| `CompanyDecisionExecutionService` | AI `START_PRODUCTION` | **COMPLETE** |

### Validation / error contracts

Start production validates: active building, recipe enabled, regional resources, building type, research, milestones, energy, inventory, duplicate job id. German error messages returned through standard `Result` → API error envelope.

---

## 5. API

| Method | Route | Request | Response | Handler | Runtime Source | UI Consumer | Status |
|--------|-------|---------|----------|---------|----------------|-------------|--------|
| `POST` | `/api/production/start` | `{ buildingId, recipeId }` | `{ ok, data: jobId }` | `GameSession.startProduction` | `StartProductionUseCase` | `ProductionScreen`, E2E | **COMPLETE** |
| `GET` | `/api/production/jobs` | — | `ProductionJobSessionReadModel[]` | `GameSession.listProductionJobs` | `ProductionJobRepository` | `ProductionScreen` (`fetchProductionJobs`) | **COMPLETE** |
| `POST` | `/api/buildings/place` | building placement | building id | `PlaceBuildingUseCase` | Building repo | Indirect (enables production) | **COMPLETE** |
| `GET` | `/api/buildings` | — | buildings[] | `GameSession` | Building repo | Hints, inspector | **COMPLETE** |
| `GET` | `/api/dashboard` | — | full dashboard incl. `productionJobs`, hints | `GameSessionDashboard` | Aggregated | Dashboards, hints | **COMPLETE** |
| `POST` | `/api/production/cancel` | — | — | — | — | — | **MISSING** |
| `GET` | `/api/recipes` | — | — | — | — | — | **MISSING** |

### API test coverage

| Test | Coverage | Status |
|------|----------|--------|
| `game.controller.test.ts` | Validation + under-construction rejection | **PARTIAL** (no happy-path start) |
| `m9-core-gameplay-flow.test.ts` | Happy-path start + list jobs | **COMPLETE** |
| `m10-industrial-chain-flow.test.ts` | Full chain with production | **COMPLETE** |
| `m11-phase5-simulation-integration-flow.test.ts` | Start + dashboard refresh | **COMPLETE** |

---

## 6. Presentation

| Surface | Displayed values | ViewData / mapper | Query source | Tick sync | Commands | Loading / empty / error | Selection | Notifications |
|---------|------------------|-------------------|--------------|-----------|----------|-------------------------|-----------|---------------|
| **ProductionScreen** | Active jobs, hints, job detail | `companyViewData.hints.production`, `detail.productionJobs`; `mapProductionJobRowsViewData` | `fetchProductionJobs` + dashboard slice | `useScreenQuery(`production:${tickKey}`)` debounced | `production.start` via `runCommand` | `ScreenQueryFrame` | `kind: 'production'` | Indirect via event log |
| **PGProductionWidget** (Executive) | Job rows, active count | `company-operations-table-mappers` | Dashboard refresh | Via workspace tick refresh | Row click → navigation | `PGWidgetSurface` empty/idle | `onJobClick` | — |
| **PGProductionWidget** (Operations) | Same | `CompanyOperationsPanels` | Dashboard | Same | Selection only | Same | `onSelectDetail('production')` | — |
| **Company Dashboard inspector** | Building → "Produktion an diesem Standort"; job → detail + transports | `company-detail-inspector-mappers` | Dashboard detail map | Dashboard scope | — | Focus mode | Shared selection | — |
| **World inspector** | Region operations → Produktion section (job list) | `world-overlay-mappers` | World screen parallel fetch | World tick query | — | Empty copy | Region context | — |
| **Global search** | Production job entries | `build-global-search-index` | `companyViewData.productionJobs` | On index rebuild | Navigate to screen | — | `entityKind: 'production'` | — |
| **Notifications** | PRODUCTION category → `open-production` | `map-event-log-notification` | Event log API | Sync on scoped refresh | Navigate action | — | `entityId: null` (C5 deferred) | **PARTIAL** |
| **PGSupplyChainWidget** | Linked transports incl. production column | Operations panels | Dashboard | Tick refresh | — | Empty states | Transport selection | — |
| **Context menu** | No production-specific actions found | — | — | — | — | — | — | — |
| **World production overlay** | — | — | — | — | — | — | — | **MISSING** |

### ProductionScreen test quality

`ProductionScreen.test.tsx` mocks `useScreenQuery` and workspace; verifies hint-driven start button calls `runCommand`. **Does not** test live API binding, job list refresh, or selection detail.

---

## 7. Visual Reference Mapping

Source: `docs/design/VISUAL_PRODUCTION_BACKLOG.md`, `docs/project-management/M11_VISUAL_PRODUCTION_PLAN.md`

| Asset ID | File | Classification | PG Component | Status |
|----------|------|----------------|--------------|--------|
| DB-006 | `DB-006_Production_Widget.png` | DESIGN REFERENCE → RUNTIME | `PGProductionWidget` | **INTEGRATED** |
| PR-001 | `PR-001_Production_Overview.png` | DESIGN REFERENCE | — (partial: `ProductionScreen`) | **PLANNED** |
| PR-002 | `PR-002_Factory.png` | DESIGN REFERENCE | — | **PLANNED** |
| PR-003 | `PR-003_Recipe.png` | DESIGN REFERENCE | — | **PLANNED** |
| PR-004 | `PR-004_Inventory.png` | DESIGN REFERENCE | `PGInventoryWidget` (general) | **PARTIAL** |
| PR-005 | `PR-005_Warehouse.png` | DESIGN REFERENCE | — | **PLANNED** |
| PR-006 | `PR-006_Build_Queue.png` | DESIGN REFERENCE | — | **PLANNED** |
| PR-007 | `PR-007_Construction.png` | DESIGN REFERENCE | — | **PLANNED** |
| PR-008 | `PR-008_Analytics.png` | DESIGN REFERENCE | — | **PLANNED** |
| PR-009 | `PR-009_Efficiency.png` | DESIGN REFERENCE | — | **PLANNED** |
| PR-010 | `PR-010_Production.png` | DESIGN REFERENCE | — | **PLANNED** |
| CH-004 | `CH-004_Production.svg` | SVG RUNTIME (planned) | — | **PLANNED** |
| RP-003 | `RP-003_Production_Report.png` | DOCUMENTATION ONLY | — | **PLANNED** |

No production mockup is rendered as a full-screen static image in runtime UI. `visual-asset-registry.ts` maps DB-006 → `PGProductionWidget`.

---

## 8. Runtime Data Binding

| UI value | Classification | Authoritative source |
|----------|----------------|----------------------|
| Job status label | DERIVED PRESENTATION | `ProductionJobSessionReadModel.status` → mapper labels |
| Job progress % | AUTHORITATIVE RUNTIME | `ProductionJob.getProgress()` via API |
| Recipe / building names | DERIVED PRESENTATION | Dashboard `contentNames` + label resolver |
| `canStart` on hints | AUTHORITATIVE RUNTIME | `GameSessionDashboardBuilder.#readProductionHints` |
| Hint reason (transport, missing research) | AUTHORITATIVE RUNTIME | Dashboard builder logic |
| Active production count (KPI) | DERIVED PRESENTATION | `productionJobs.length` |
| Efficiency / utilization | **Not displayed** | — |
| Production cost display | **Not displayed** | Content `productionCost` unused in UI |
| Demo factories / fake rates | **Not found** | No hardcoded demo production data in presentation |
| Static UI copy | STATIC UI COPY | German labels in components |
| Notification `entityId` | PLACEHOLDER | Hardcoded `null` in `map-event-log-notification.ts` (C5) |

No duplicated authoritative production state between presentation and API was found. Job list uses dedicated `GET /api/production/jobs` while hints/detail use dashboard `companyViewData` — both originate from the same session repositories.

---

## 9. Production Commands

| Command | UI trigger | `commandId` | Handler | Affected scopes | Busy | Error | Success | Notification |
|---------|------------|-------------|---------|-----------------|------|-------|---------|--------------|
| Start production | ProductionScreen "Starten"; dashboard hints | `production.start` | `StartProductionUseCase` | `workspace.dashboard`, `screen.production` | `isBusy` gate | `runCommand` error toast | Success message + refresh | Event log: `PRODUCTION` "Produktion gestartet…" |

### Pipeline compliance

- Uses `runCommand` with typed `commandId` ✅  
- Scoped invalidation via `command-invalidation-map.ts` ✅  
- No direct `fetch` bypass for mutations ✅  
- `CompanyDashboardScreen` command-id rules: production not in exception list ✅  

### Missing commands

Cancel production, pause, queue management, recipe picker command — **none exist**.

---

## 10. Tick Synchronization

| Data | Tick-aware? | Mechanism |
|------|-------------|-----------|
| Production job progress | Yes | `ProductionSimulationSystem` per tick; UI via `production:${tickKey}` debounced query |
| Dashboard production widget | Yes | Workspace dashboard refresh on tick / scoped invalidation |
| Production hints | Yes | Refreshed with `workspace.dashboard` scope |
| Inventory after completion | Yes | `completeJob` on simulation tick completion |
| Energy stall visibility | **No** | Stall is silent; UI shows RUNNING with frozen progress |
| Finance production cost | **No** | Not tick-posted |

Phase 5 tick rules followed: debounced screen queries, no full-page reload, scoped refresh after commands.

**Stale-risk:** Job list query and dashboard slice can briefly diverge if only one scope refreshes; `production.start` invalidates both scopes — acceptable.

---

## 11. Events & Notifications

### Domain events (authoritative)

| Event | Source | Payload | Player event log | Notification |
|-------|--------|---------|------------------|--------------|
| `ProductionStarted` | `ProductionJob.start()` | jobId, buildingId, companyId, recipeId | Via command `GameSession.#recordPlayerEvent` | `PRODUCTION` → `open-production` |
| `ProductionCompleted` | `ProductionJob.#complete()` | same fields | **Not recorded** | **No auto-notification** |

### Player event log categories

`PRODUCTION` entries are created only on **manual start** (`GameSession.startProduction`), not on simulation completion, energy block, or input shortage.

### Notification mapping

| Field | Value | Gap |
|-------|-------|-----|
| `entityId` | Always `null` | C5 deferred — deep-link to job/building broken |
| `entityType` | Mapped from category | OK |
| `action` | `open-production` for PRODUCTION | OK |
| Refresh | `workspace.dashboard + screen.production` | OK |

### Schema-doc events not implemented

`production stopped`, `production blocked`, `input shortage`, `capacity reached`, `facility offline` — **not** emitted as domain or player events.

---

## 12. World & Selection Integration

| Integration | Status | Evidence |
|-------------|--------|----------|
| Production entity selection | **COMPLETE** | `{ kind: 'production', id }` in `navigation-state.ts`, URL-backed |
| Building selection → production context | **PARTIAL** | Inspector subtitle only; no building-scoped job filter in ProductionScreen |
| Region inspector production section | **COMPLETE** | `world-overlay-mappers` section `production` |
| World map production overlay | **MISSING** | No production layer in overlay registry |
| Dashboard navigation from widget | **COMPLETE** | Job click → detail selection |
| Global search | **COMPLETE** | `build-global-search-index` production entries |
| Notification deep link | **PARTIAL** | Action navigates to screen; `entityId` null prevents job pre-selection |
| Stable IDs | **COMPLETE** | `production_NNN` from session sequence |

No second selection model introduced.

---

## 13. Save / Load

| State | Persisted? | Serializer field | Notes |
|-------|------------|------------------|-------|
| Active production jobs | Yes | `productionJobs[]` | id, buildingId, companyId, recipeId, duration, status, progress, times |
| WAITING jobs (transport pending) | Yes | Same | Restored; transport linkage via `productionJobId` on orders |
| Recipe definitions | No (content) | — | Loaded from content on bootstrap |
| Production queues | No | — | Not implemented |
| Reserved inventory | Yes | Inventory snapshot | Part of company inventory state |
| Derived progress on load | Recomputed from times | — | Progress stored explicitly |
| Production sequence counter | Restored | `GameSession` scans existing ids | `#productionSequence` from max id |

`GameStateSerializer.test.ts` includes transport orders with `productionJobId` in migration tests but **no dedicated round-trip test** for an in-progress `RUNNING` job with non-zero progress.

---

## 14. Test Coverage

| Layer | Key tests | Verdict |
|-------|-----------|---------|
| Domain unit | `ProductionJob.test.ts`, `BuildingSupportsRecipeSpecification.test.ts` | **Strong** |
| Application | `StartProductionUseCase.test.ts`, `ProductionInventoryService.test.ts`, `GameSessionDashboardBuilder.test.ts` | **Strong** |
| Simulation | `ProductionSimulationSystem.test.ts` | **Strong** |
| API | `game.controller.test.ts` (validation), m9/m10/m11 E2E flows | **Good** (controller happy-path gap) |
| Presentation | `ProductionScreen.test.tsx` (mocked), mapper tests, notification tests | **Thin** for ProductionScreen |
| Architecture | `presentation-command-id-rules.test.ts`, tick-sync tests | **Good** |
| Integration | m10 industrial chain, m11 phase 5 flow | **Good** |
| E2E | API-level production start in phase 5.6 | **Good** |
| Save/load | Serializer tests (indirect) | **Gap** for production job round-trip |
| Tick | Via simulation system tests | **Good** |
| Accessibility | `dashboard-components.a11y.test.tsx` (production widget labels) | **Partial** |
| Widget | No `PGProductionWidget` dedicated test | **Gap** |

---

## 15. Architecture Violations

| ID | Finding | Severity | Layer |
|----|---------|----------|-------|
| AV-01 | `entityId` always null on production notifications (known C5) | Minor (deferred) | INTEGRATION |
| AV-02 | Schema doc describes queues/BLOCKED; runtime differs | Documentation drift | DOCUMENTATION |
| AV-03 | No presentation access to domain/repos | — | **None found** ✅ |
| AV-04 | No second command pipeline | — | **None found** ✅ |

No Critical or Major architecture violations in production paths.

---

## 16. Gap Analysis

| ID | Gap | Priority | Layer |
|----|-----|----------|-------|
| G-01 | No cancel / stop production | P1 | DOMAIN + APPLICATION + API |
| G-02 | No production queue (schema doc) | P2 | DOMAIN |
| G-03 | `CANCELLED` / `BLOCKED` statuses unused; energy stall invisible | P2 | DOMAIN + PRESENTATION |
| G-04 | One job per building not enforced | P2 | DOMAIN |
| G-05 | `productionCost` not posted to finance | P2 | APPLICATION |
| G-06 | No player event / notification on job completion | P1 | APPLICATION + INTEGRATION |
| G-07 | `entityId` null on notifications (C5) | P2 | PRESENTATION |
| G-08 | Sprint 4 mockups PR-001 … PR-010 not integrated | P1 | PRESENTATION |
| G-09 | No dedicated recipes API / recipe viewer screen | P2 | API + PRESENTATION |
| G-10 | No world map production overlay | P3 | PRESENTATION |
| G-11 | No `PGProductionWidget` unit tests | P3 | TESTING |
| G-12 | No production job save/load round-trip test | P2 | TESTING |
| G-13 | `game.controller.test.ts` missing happy-path start | P3 | TESTING |
| G-14 | ProductionScreen tests heavily mocked | P2 | TESTING |
| G-15 | No production analytics / efficiency UI | P3 | PRESENTATION |
| G-16 | Context menu has no production actions | P3 | PRESENTATION |

**P0 blocking gaps:** **None** — core start → tick → complete → inventory loop works end-to-end.

---

## 17. Priority Matrix

| Priority | Gaps | Recommended package |
|----------|------|---------------------|
| **P0** | — | — |
| **P1** | G-01, G-06, G-08 | 6.2 Runtime/Events + 6.3 Operations UI |
| **P2** | G-02–G-05, G-07, G-09, G-12, G-14 | 6.2, 6.3, 6.4 |
| **P3** | G-10, G-11, G-13, G-15, G-16 | 6.5 Polish + 6.6 E2E |

---

## 18. Do Not Rebuild

Verified areas that are **correct and must be preserved**:

1. **`ProductionJob` aggregate** — lifecycle, progress tick, domain events (`src/domain/production/ProductionJob.ts`)
2. **`ProductionSimulationSystem`** — energy + worker gating, event enqueue (`src/simulation/systems/production/`)
3. **`StartProductionUseCase`** — validation chain, transport deferral, inventory reserve (`src/application/use-cases/StartProductionUseCase.ts`)
4. **`ProductionInventoryService`** — reserve / release / complete (`src/application/services/ProductionInventoryService.ts`)
5. **`ProductionJobRepository` contract + in-memory impl** — persistence interface
6. **`GameSession.startProduction` / `listProductionJobs`** — facade sequencing and event log on start
7. **`GameSessionDashboardBuilder.#readProductionHints`** — hint generation with transport/research/milestone logic
8. **REST endpoints** — `POST /api/production/start`, `GET /api/production/jobs`
9. **`command-invalidation-map`** — `production.start` → dashboard + production scopes
10. **`PGProductionWidget`** — DB-006 aligned widget surface
11. **`ProductionScreen`** — tick-synced query + `runCommand` start workflow (extend, do not replace)
12. **World inspector production section** — `world-overlay-mappers` integration
13. **Global search production entries** — `build-global-search-index`
14. **Savegame production job serialization** — `GameStateSerializer` productionJobs slice
15. **Phase 5 runtime pipeline** — `useScreenQuery`, `runCommand`, scoped refresh, notification sync
16. **Content validation** — `validateProductionGraphAcyclicity`, recipe validators
17. **E2E flows** — m9/m10/m11 production start paths

---

## 19. Recommended Phase 6 Packages

### Phase 6.2 — Production Runtime & Event Corrections

| Field | Detail |
|-------|--------|
| **Mission** | Close runtime gaps without redesigning production architecture |
| **Scope** | G-06 completion event log + notification; G-07 entityId extraction where possible; G-03 stalled-job visibility (presentation label or status); G-05 production cost posting if finance hook exists; G-04 optional one-job-per-building guard |
| **Dependencies** | Phase 5 closed; C5 policy from polish backlog |
| **Required changes** | `GameSession` or tick handler for completion events; optional `ProductionJobRepository.findByBuildingId`; finance integration for `productionCost`; notification mapper entityId |
| **Tests** | Completion event test; save/load round-trip (G-12); controller happy-path |
| **Completion criteria** | Completing a job creates player event; notifications deep-link when entity parseable; no regression in m11 E2E |
| **Risk** | Low–medium (touch simulation event path) |

### Phase 6.3 — Production Operations UI (Sprint 4 Core)

| Field | Detail |
|-------|--------|
| **Mission** | Integrate Sprint 4 production mockups into existing screens |
| **Scope** | PR-001 Overview, PR-002 Factory, PR-003 Recipe viewer surfaces; enhance `ProductionScreen` layout; optional `GET /api/recipes` read-only |
| **Dependencies** | 6.2 recommended first for completion feedback |
| **Required changes** | New PG sections or screen tabs; mappers from existing dashboard DTOs; no new simulation rules |
| **Tests** | ProductionScreen integration with real query client mock; widget interaction tests |
| **Completion criteria** | PR-001/002/003 visual parity per style guide; all data from ViewData |
| **Risk** | Medium (UI scope) |

### Phase 6.4 — Facility & Inspector Integration

| Field | Detail |
|-------|--------|
| **Mission** | Tie building/facility selection to production context |
| **Scope** | Building inspector production jobs; filter hints by selected building; PR-005 Warehouse linkage in UI |
| **Dependencies** | 6.3 screen structure |
| **Tests** | Inspector mapper tests; selection navigation tests |
| **Completion criteria** | Selecting building shows its jobs; world → production navigation works |
| **Risk** | Low |

### Phase 6.5 — Production Analytics & Efficiency (Optional)

| Field | Detail |
|-------|--------|
| **Mission** | PR-008 Analytics, PR-009 Efficiency read-only surfaces |
| **Scope** | Derived KPIs from existing job/history data; no new simulation |
| **Dependencies** | 6.3 |
| **Risk** | Low |

### Phase 6.6 — Production E2E Validation & Closeout

| Field | Detail |
|-------|--------|
| **Mission** | Gate-ready validation mirroring Phase 5.6 pattern |
| **Scope** | API + presentation E2E: start → tick progress → complete → inventory; cancel if implemented |
| **Dependencies** | 6.2–6.4 |
| **Tests** | New `m11-phase6-production-flow.test.ts`; presentation closeout tests |
| **Completion criteria** | Gate doc PASS; docs updated |
| **Risk** | Low |

---

## 20. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Rebuilding production domain for schema-doc parity | Medium if mis-scoped | High | **Do Not Rebuild** list; extend incrementally |
| Silent energy/worker stall confuses players | High | Medium | 6.2 visibility or 6.3 UX copy |
| Sprint 4 scope creep (10 mockups) | Medium | Medium | Package 6.3 limits to PR-001–003 first |
| C5 entityId deferred blocks notification UX | Known | Low | Parse from message or extend event log contract in 6.2 |
| Cancel production scope debate | Medium | Medium | Confirm gameplay need before G-01 implementation |

---

## 21. Recommendations

1. **Proceed with Phase 6.2 first** — smallest vertical slice improving player feedback (completion events, entity links, stalled state).
2. **Extend `ProductionScreen`, do not replace** — current tick sync and command pipeline are correct.
3. **Integrate mockups incrementally** — DB-006 widget proves the pattern; PR-001–003 before PR-008–010.
4. **Defer queue/cancel** unless gameplay design confirms P1 — schema doc ahead of implementation.
5. **Add production job save/load test** before any serializer changes.
6. **Keep finance production cost** scoped to posting at completion — do not invent new cost rules.
7. **Update `Production.Schema.md` or implementation** in a dedicated alignment task to resolve AV-02.

---

## 22. Final Decision

**PRODUCTION SYSTEM READY FOR TARGETED INTEGRATION**

The repository contains a working recipe-based production loop integrated with buildings, inventory, transport, energy, employees, milestones, research, dashboards, world inspector, commands, tick synchronization, and save/load. Phase 6 work is **UX surfacing, event completeness, schema alignment, and test hardening** — not foundational reconstruction.

**Recommended next package:** **Phase 6.2 — Production Runtime & Event Corrections**

---

## Audit Capability Table

| Capability | Domain | API | UI | Runtime Bound | Command | Tick | Save/Load | Tests | Status |
|------------|--------|-----|----|---------------|---------|------|-----------|-------|--------|
| Start production | COMPLETE | COMPLETE | COMPLETE | COMPLETE | COMPLETE | N/A | N/A | COMPLETE | **COMPLETE** |
| List active jobs | COMPLETE | COMPLETE | COMPLETE | COMPLETE | N/A | COMPLETE | COMPLETE | COMPLETE | **COMPLETE** |
| Tick progress | COMPLETE | N/A | COMPLETE | COMPLETE | N/A | COMPLETE | COMPLETE | COMPLETE | **COMPLETE** |
| Complete → inventory | COMPLETE | N/A | PARTIAL | COMPLETE | N/A | COMPLETE | COMPLETE | COMPLETE | **PARTIAL** (no completion UI event) |
| Production hints | COMPLETE | COMPLETE | COMPLETE | COMPLETE | N/A | COMPLETE | N/A | COMPLETE | **COMPLETE** |
| Inbound transport deferral | COMPLETE | COMPLETE | PARTIAL | COMPLETE | N/A | COMPLETE | COMPLETE | COMPLETE | **PARTIAL** (UI copy only) |
| Energy gating | COMPLETE | N/A | MISSING | COMPLETE | N/A | COMPLETE | N/A | COMPLETE | **PARTIAL** |
| Worker efficiency | COMPLETE | N/A | MISSING | COMPLETE | N/A | COMPLETE | N/A | PARTIAL | **PARTIAL** |
| Cancel / stop | MISSING | MISSING | MISSING | N/A | MISSING | N/A | N/A | MISSING | **MISSING** |
| Production queue | MISSING | MISSING | MISSING | N/A | MISSING | N/A | N/A | MISSING | **MISSING** |
| Recipe viewer | CONTENT | MISSING | MISSING | PARTIAL | N/A | N/A | N/A | PARTIAL | **PARTIAL** |
| Dashboard widget | N/A | COMPLETE | COMPLETE | COMPLETE | N/A | COMPLETE | N/A | MISSING | **PARTIAL** |
| World inspector | N/A | COMPLETE | COMPLETE | COMPLETE | N/A | COMPLETE | N/A | COMPLETE | **COMPLETE** |
| World map overlay | N/A | N/A | MISSING | N/A | N/A | N/A | N/A | N/A | **MISSING** |
| Global search | N/A | N/A | COMPLETE | COMPLETE | N/A | N/A | N/A | PARTIAL | **COMPLETE** |
| Notifications | PARTIAL | COMPLETE | PARTIAL | PARTIAL | N/A | N/A | N/A | COMPLETE | **PARTIAL** |
| Production cost (finance) | CONTENT | N/A | MISSING | MISSING | N/A | N/A | N/A | MISSING | **MISSING** |
| AI start production | COMPLETE | N/A | N/A | COMPLETE | INTERNAL | COMPLETE | COMPLETE | PARTIAL | **COMPLETE** |
| Analytics / efficiency | MISSING | MISSING | MISSING | N/A | N/A | N/A | N/A | MISSING | **MISSING** |
| Place production building | COMPLETE | COMPLETE | COMPLETE | COMPLETE | COMPLETE | N/A | COMPLETE | COMPLETE | **COMPLETE** |

---

*End of M11 Phase 6.1 Production System Audit.*
