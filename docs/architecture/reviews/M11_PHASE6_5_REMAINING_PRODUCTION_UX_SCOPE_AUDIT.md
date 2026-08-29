# M11 Phase 6.5 — Remaining Production UX Scope Audit

**Project:** Project Genesis  
**Milestone:** M11 — Visual Production & User Experience  
**Phase:** 6.5 — Remaining Production UX Scope Audit  
**Report type:** Read-only scope verification audit  
**Report date:** 2026-08-29  
**Branch:** `master`  
**HEAD:** `0532c4a` — *Complete M11 Phase 6.4 facility and inspector integration.*  
**Phase 6.4 baseline:** `0532c4a` (Gate: **PASS WITH NON-BLOCKING DEFERRED ITEMS**)

---

## 1. Executive Summary

Phase 6.5 re-evaluated the original Sprint-4 Production UX backlog (PR-004 … PR-010, CH-004) against the **current** repository at `0532c4a`, after Phases 6.2 (runtime corrections), 6.3 (PR-001–PR-003 on `ProductionScreen`), and 6.4 (facility/inspector integration).

**Key finding:** The core Production player loop is **functionally complete** for M11 integration scope. PR-001–PR-003 and Phase 6.4 building context, inspector linkage, and thin warehouse navigation cover the essential production operations UX. Most remaining backlog items are either **already partially covered** on the Company Operations Dashboard, **blocked by undefined gameplay semantics** (G-04, G-05, queues, cancel/pause), or **lack authoritative runtime data** (analytics, efficiency trends, historical production metrics).

**No PR-004 … PR-010 mockup PNG files exist in the repository** (`docs/design/` glob for `PR-00*.png` → 0 files). Backlog entries in `VISUAL_PRODUCTION_BACKLOG.md` remain unchecked design references only.

**Test baseline verified:** `pnpm test` → **240** files, **891** tests, **891 / 891 PASS** (2026-08-29, 97.75s).

**Primary recommendation:** **OPTION B — READY FOR PRODUCTION CLOSEOUT**

`Recommended next package: Production E2E Validation & Closeout`

Not because Production is “finished forever,” but because the **next meaningful work** is validation, test hardening, and documentation alignment — not additional mockup surfaces that would duplicate existing UI or invent gameplay semantics.

---

## 2. Audit Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD | `0532c4a` |
| Phase 6.4 commit | `0532c4a` |
| Phase 6.3 implementation | `db7e3a9` |
| Phase 6.2 implementation | `c3ae71e` |
| Tests at audit | **891 / 891** (240 files) |
| Phase 6.4 test baseline | 891 / 891 (unchanged) |
| Audit constraint | Read-only — no code changes |

---

## 3. Audit Method

### Documents inspected

| Document | Purpose |
|----------|---------|
| `docs/architecture/reviews/M11_PHASE6_1_PRODUCTION_SYSTEM_AUDIT.md` | Original capability map, G-01 … G-13 |
| `docs/architecture/reviews/M11_PHASE6_2_PRODUCTION_RUNTIME_EVENT_CORRECTIONS_REPORT.md` | Runtime/event corrections, deferred G-04/G-05 |
| `docs/architecture/reviews/M11_PHASE6_3_PRODUCTION_OPERATIONS_UI_REPORT.md` | PR-001–PR-003 delivery |
| `docs/architecture/reviews/M11_PHASE6_4_FACILITY_INSPECTOR_INTEGRATION_REPORT.md` | Building/production integration, thin PR-005 |
| `docs/project-management/M11_VISUAL_PRODUCTION_PLAN.md` | Phase 6 scope intent |
| `docs/design/VISUAL_PRODUCTION_BACKLOG.md` | PR/CH backlog checklist |
| `docs/design/MOCKUP_GALLERY.md` | Production screen layout intent |
| `docs/design/UI_DATA_BINDING_GUIDELINES.md` | Binding conventions |
| `docs/design/UI_TEXT_GUIDELINES.md` | Production Queue terminology |
| `docs/design/UI_LAYOUT_GUIDELINES.md` | Layout patterns |
| `docs/development/IMPLEMENTATION_PROGRESS.md` | Current milestone status |
| `docs/schemas/Production.Schema.md` | Target vs runtime model drift |

### Code areas inspected

- **Domain/Application:** `ProductionJob`, `StartProductionUseCase`, `GameSession`, `GameSessionDashboardBuilder`, `Building` construction, `EmployeeAllocationService`, `PlayerEventLogService`, `GameStateSerializer`
- **API:** `game.controller.ts`, E2E flows (`m9`, `m10`, `m11-phase5`)
- **Presentation:** `ProductionScreen`, `BuildingsScreen`, `CompanyOperationsPanels`, `PGInventoryWidget`, `PGProductionWidget`, `WorldScreen`, inspector mappers, navigation helpers, `visual-asset-registry.ts`
- **Tests:** Production mapper/screen tests, `GameSession.test.ts`, `game.controller.test.ts`, notification tests, save/load serializer tests

### Tests executed

| Command | Result | Date |
|---------|--------|------|
| `pnpm test` | 240 files, 891 tests PASS, 97.75s, exit 0 | 2026-08-29 |

---

## 4. Current Production Capability Summary (Post 6.2–6.4)

| Capability | Status | Evidence |
|------------|--------|----------|
| Start production | ✅ Runtime + API + UI | `StartProductionUseCase`, `POST /api/production/start`, `ProductionScreen` hints |
| Job progress & `operationalState` | ✅ | `GameSession.#resolveProductionOperationalState`, `ProductionScreen` overview + table |
| Stalled energy / workforce visibility | ✅ Presentation | `STALLED_ENERGY` / `STALLED_WORKFORCE` labels via `formatProductionStatus` |
| Recipe catalog & start hints | ✅ PR-003 | `recipeCatalog` on dashboard, authoritative `hints.production` |
| Factory grouping by building | ✅ PR-002 | `mapProductionFactoryGroups` |
| Production entity selection | ✅ | `selectEntity({ kind: 'production', id })` |
| Building → Production context | ✅ Phase 6.4 | `buildProductionBuildingNavigationTarget`, scoped filtering |
| Inspector production jobs | ✅ | Building `relatedItems` + `entityRef`, **Produktion öffnen** |
| World → Production navigation | ✅ Phase 6.4 | Building marker → production with building context |
| Thin warehouse linkage | ✅ Phase 6.4 | `Lager am Standort` card + `buildWarehouseNavigationTarget` |
| Completion events + notification linkage | ✅ Phase 6.2 | `entityId` on start/complete |
| Save/load production jobs | ✅ Serializer | `GameStateSerializer` unit test for running job |
| Executive production widget | ✅ DB-006 | `PGProductionWidget` on dashboard |
| Company inventory/warehouse read-only | ✅ S18 | `PGInventoryWidget` on company ops |
| Production queue | ❌ | Schema only — not implemented |
| Cancel / pause | ❌ | Not implemented |
| `productionCost` finance posting | ❌ | Content field only (G-05) |
| Production analytics/history time series | ❌ | No tick/production history read model |
| World map production overlay layer | ❌ | Inspector section only |
| Full PR-004 … PR-010 mockup surfaces | ❌ | No mockup assets; not implemented |

---

## 5. PR-004 Inventory Audit

### Original intent

PR-004 mockup (`PR-004_Inventory.png`) — dedicated inventory surface for production context: site resources, reserved/available quantities, visibility during manufacturing. Phase 6.1 classified as **PARTIAL** via `PGInventoryWidget`.

### Current runtime

| Layer | State |
|-------|-------|
| **Read model** | `InventoryReadModel` on `GameSessionDashboard.inventory` |
| **ViewData** | `companyViewData.inventoryItems` (`InventoryItemRowViewData`) |
| **UI** | `PGInventoryWidget` on Company Operations (site panel + search); `MarketScreen` “Lagerbestand”; `PGInventoryHistoryChart` on company charts |
| **Production linkage** | Recipe I/O shown in recipe catalog; no dedicated inventory section on `ProductionScreen` |
| **Mockup asset** | **Not in repository** |

### Answers

1. **Intended use case:** View/manage site inventory relevant to production inputs/outputs.
2. **Already exists:** Read-only site inventory table on company dashboard; market inventory view; tick history for on-site units.
3. **Still a standalone surface?** Only if pursuing full mockup fidelity — **not required** for core loop.
4. **Would duplicate?** **Yes** — a dedicated Inventory screen would largely repeat `PGInventoryWidget` + market views without new data.
5. **Missing authoritative data:** Per-building site inventory split (inventory is company aggregate, not per-factory); inventory mutation commands (transfer, allocate) — **not in runtime**.
6. **Small delta?** Optional production-context link to company inventory (symmetric to warehouse thin link) — **SMALL**, marginal player value.
7. **Production vs general inventory?** General inventory package; production benefits indirectly via recipe hints and company widget.

**Classification:** **ALREADY COVERED** (read-only ops scope) / **DEFER** (full PR-004 mockup surface, mutations, dedicated screen)

---

## 6. PR-005 Warehouse Audit

### Phase 6.4 baseline

Thin linkage implemented: `ProductionScreen` shows **Lager am Standort** when `warehouseStorage` row exists for active building; navigates to company warehouse detail.

### Current runtime

| Layer | State |
|-------|-------|
| **Read model** | `WarehouseStorageReadModel` per `buildingId` |
| **ViewData** | `warehouseStorage[]`, `detail.warehouseStorage` map, `capacityLabel` / `usedLabel` |
| **UI** | `PGInventoryWidget` warehouse panel; warehouse inspector; logistics summaries; Phase 6.4 production card |
| **Gaps vs mockup** | Capacity not shown in `PGInventoryWidget` (data present, UI omits); no warehouse-dedicated screen; no routing/mutation UI |

### Answers

1. **Still missing:** Full mockup layout, dedicated warehouse screen, capacity in widget, item-level production card, routing controls.
2. **Functional detail flow?** **Yes** — click warehouse row → inspector; production → company warehouse navigation.
3. **Visual only or missing function?** Mostly **visual polish**; core read path exists.
4. **Capacity/lines authoritative?** **Yes** in DTO/ViewData.
5. **Mockup data not in runtime?** Routing rules, transfer UI, dedicated full-screen layout.
6. **New gameplay semantics?** Mutations/routing would — read-only display would not.
7. **Standalone package justified?** Only for full PR-005 mockup — **low priority** given existing surfaces.

**Classification:** **ALREADY COVERED** (read-only + thin linkage) / **DEFER** (full PR-005 dedicated UI)

---

## 7. PR-006 Build Queue Audit

### What PR-006 means

Asset ID: `PR-006_Build_Queue.png` (not in repo). Repository consensus from Phase 6.1/6.4 reports and `Production.Schema.md`:

- **Primary meaning:** **Production job queue** (per-building manufacturing queue) — linked to **G-04**
- **Secondary ambiguity:** `MOCKUP_GALLERY.md` mentions “Construction Queue” on Buildings Screen — different concept

`UI_TEXT_GUIDELINES.md` uses **“Production Queue”** terminology.

### Runtime

| Check | Result |
|-------|--------|
| Production Queue aggregate | ❌ Not implemented (`Production.Schema.md`) |
| Queue commands (reorder, cancel, pause) | ❌ |
| `ProductionScreen` job list | ✅ Flat list — **not** a queue (no ordering, repeat, capacity) |
| Construction queue | ❌ No aggregate — placement is immediate per building |

### Answers

1. **Fachlich:** Production queue for jobs per building (schema target), not construction placement queue.
2. **Runtime concept?** **No** — jobs only.
3. **Authoritative queue data?** **No**.
4. **Queue manipulation commands?** **No**.
5. **New gameplay rules?** **Yes** — G-04 (concurrency, ordering, capacity) undefined.
6. **Read-only job list possible?** **Already exists** on `ProductionScreen` — would be redundant.
7. **Redundant?** **Yes** for read-only; full queue UI requires domain work first.

**Classification:** **DEFER** — blocked on G-04 gameplay decision and `Production.Schema.md` queue aggregate

---

## 8. PR-007 Construction Audit

### Current runtime

| Layer | State |
|-------|-------|
| **Domain** | `Building.beginConstruction`, `UNDER_CONSTRUCTION`, `tickConstruction` |
| **Simulation** | `BuildingSimulationSystem` |
| **API** | `POST /api/buildings/place`, `GET /api/buildings` |
| **UI** | `BuildingsScreen` — list, Baukatalog, placement form; `BuildingConstructionStatus` in company tables; inspector Baufortschritt |
| **Production interaction** | `StartProductionUseCase` rejects `UNDER_CONSTRUCTION` buildings |

### Answers

1. **Existing functions:** Place building, tick construction, progress display, production blocked until ACTIVE.
2. **Visible?** **Partially** — Buildings screen + company table progress cells.
3. **PR-007 would add:** Dedicated construction screen/queue panel per mockup — **not in repo**.
4. **Production or Building scope?** **Building/Construction** — not Production domain.
5. **Duplicate?** Placement workflow exists; full mockup would extend, not replace.
6. **Small UX delta?** Read-only “under construction” summary on `BuildingsScreen` — possible **SMALL** slice, but **outside Production UX closeout**.

**Classification:** **ALREADY COVERED** (core placement + progress) / **DEFER** (full PR-007 mockup surface)

---

## 9. PR-008 Analytics Audit

### Data basis after 6.2–6.4

| Metric / chart type | Classification | Notes |
|---------------------|----------------|-------|
| Active/running/waiting/stall counts | **SAFE DERIVED** | `mapProductionOverviewSummary` — already on screen |
| Job progress % | **AUTHORITATIVE RUNTIME** | `ProductionJobSessionReadModel.progress` |
| `operationalState` breakdown | **AUTHORITATIVE RUNTIME** | Facade-computed |
| Session finished job count | **SAFE DERIVED** | From current jobs query |
| PRODUCTION event log entries | **AUTHORITATIVE RUNTIME** | Qualitative events only — Reports screen |
| Production volume / rate over time | **UNSUPPORTED** | No tick capture |
| Input/output consumption charts | **UNSUPPORTED** | No per-tick I/O history |
| 7d/30d/YTD trends | **UNSUPPORTED** | `TickMetricsSnapshot` has no production fields |
| Capacity / utilization | **REQUIRES GAMEPLAY SEMANTICS** | No capacity model |
| Downtime % | **REQUIRES GAMEPLAY SEMANTICS** | Not implemented |
| Production pipeline / bottleneck view | **REQUIRES GAMEPLAY SEMANTICS** | No chain rate model |
| Profitability / cost analytics | **REQUIRES GAMEPLAY SEMANTICS** | G-05 deferred |

Phase 6.1 optional analytics phase assumed “derived from existing job/history data” — **optimistic**. Event log gives completion **events**, not volume time series implied by `DB-006` widget spec (`productionRate`, `productionRateTrend7d`).

**Classification:** **DEFER** — requires new read models and/or gameplay semantics before meaningful analytics UI

---

## 10. PR-009 Efficiency Audit

### What “efficiency” means in runtime

| Factor | Source | UI today |
|--------|--------|----------|
| Energy deficit stall | `energyBalanceService` → `STALLED_ENERGY` | Production overview + labels |
| Workforce stall | `getWorkerEfficiency() <= 0` → `STALLED_WORKFORCE` | Production overview + labels |
| Worker efficiency scalar | `EmployeeAllocationService.getWorkerEfficiency` | **Not in read model/API** |
| Energy reserve trend | `chartPoints.energyReserve` | Company charts only |
| Maintenance, research bonuses, quality | Gameplay docs | **Version 2 / not implemented** |

### Answers

1. **Authoritative efficiency KPI?** **No** single metric.
2. **Only influence factors?** **Yes** — binary stall detection + hidden scalar.
3. **Deterministic display possible?** Partial — staffing ratio from employees + recipe workers (**not displayed**); exposing `workerEfficiency` needs small read-model extension.
4. **Percent efficiency invent semantics?** **Yes** — without defined formula.
5. **Better as Operational Health?** **Yes** — aligns with existing `operationalState`.
6. **Overlap with PR-008?** **Yes** — both need metrics infrastructure.

**Classification:** **DEFER** — no authoritative efficiency KPI; thin “operational health” largely **ALREADY COVERED** by PR-001 overview

---

## 11. PR-010 Production Audit

### Comparison to current `ProductionScreen`

| PR-010 section (MOCKUP_GALLERY) | Phase 6.3/6.4 |
|----------------------------------|---------------|
| Factory list | ✅ PR-002 |
| Recipes | ✅ PR-003 |
| Overview KPIs | ✅ PR-001 |
| Building context | ✅ Phase 6.4 |
| Thin warehouse | ✅ Phase 6.4 |
| Production chain diagram | ❌ |
| Charts (Input/Output/Efficiency/Utilization) | ❌ |
| Inventory section (PR-004) | ❌ on ProductionScreen (exists on company) |
| Build queue (PR-006) | ❌ |
| Construction (PR-007) | ❌ |
| Full mockup chrome/layout | ❌ — uses `pg-operation-*` patterns |

PR-010 functions as a **composite design reference** for sections now delivered incrementally. Remaining gaps are PR-004/005/006/007/008/009 items — not a separate use case.

**Classification:** **NOT APPLICABLE** as standalone implementation package (composite mockup superseded by PR-001–003 + 6.4); remaining sections classified under their PR IDs

---

## 12. CH-004 Asset Audit

| Check | Result |
|-------|--------|
| Asset file `CH-004_Production.svg` | **Not in repository** |
| `VISUAL_PRODUCTION_BACKLOG.md` | Sprint 10 — ☐ unchecked |
| `visual-asset-registry.ts` | **CH-010 registered**; **no CH-004 entry** |
| Production UI charts | **None** on `ProductionScreen` |
| Phase 6.1 classification | SVG RUNTIME (planned) |

**Classification:** **DEFER** — asset not created; integration blocked on asset + analytics data (PR-008)

---

## 13. Remaining Runtime / Test Gaps

See **Gap Matrix (§16)**. Summary:

- **G-04, G-05:** Deferred — gameplay decisions required
- **STALLED_ENERGY GameSession test:** Gap — workforce case tested, energy case not (`GameSession.test.ts` line 514)
- **Controller production happy path:** Partial — validation tests only; E2E covers success
- **PGProductionWidget:** No dedicated unit test (G-11)
- **World Production Overlay:** Not implemented (G-10) — inspector section exists
- **Cancel/Pause:** Not implemented (G-01)
- **Production Queue:** Documented drift — intentional (G-02)
- **Save/Load:** Serializer covered; E2E does not assert in-progress job after reload
- **Notification linkage:** Resolved for start/complete (G-06/G-07)
- **CH-004:** Not registered, asset missing

---

## 14. UX-06.4-01 World Building Navigation Review

| Aspect | Finding |
|--------|---------|
| **Previous behavior (pre-6.4)** | `WorldScreen` → `buildBuildingNavigationTarget` → Buildings screen |
| **Current behavior (`0532c4a`)** | `WorldScreen` → `buildProductionBuildingNavigationTarget` → Production screen with building context |
| **Tests** | `entity-navigation.test.ts` covers helper; **no `WorldScreen` integration test** |
| **Documentation** | `WORLD_MODULE_IMPLEMENTATION_GUIDE.md` may still reference old Buildings navigation — **doc drift** |
| **UX patterns** | Region inspector still offers **Produktion öffnen** (unfiltered); Buildings screen reachable via sidebar |
| **Player value** | Stronger production integration; trades direct Buildings access from map click |

**Determination:** **UX VALIDATION NEEDED** (not a code defect)

The behavior is **intentional per Phase 6.4** and architecturally consistent (shared selection → production context). Recommend player UX validation in closeout; update world module docs if confirmed. **No Phase 6.5 code change.**

---

## 15. Required Decision Matrix

| Item | Current Runtime | Current UI | Authoritative Data | Missing Dependency | Classification | Size | Recommendation |
| ---- | --------------- | ---------- | ------------------ | ------------------ | -------------- | ---- | -------------- |
| PR-004 Inventory | Site inventory on dashboard DTO | `PGInventoryWidget`, MarketScreen, history chart | `inventoryItems` read model | Per-building site split; mutation commands | **ALREADY COVERED** (read-only) / **DEFER** (full mockup) | SMALL (link only) / LARGE (full) | Keep on company ops; defer dedicated screen |
| PR-005 Warehouse | Per-building `warehouseStorage` DTO | Widget + inspector + Phase 6.4 thin link | Capacity, items, used | Routing/mutation rules | **ALREADY COVERED** (read-only + link) / **DEFER** (full mockup) | SMALL (capacity in widget) / MEDIUM (full screen) | Optional widget polish later; defer PR-005 screen |
| PR-006 Build Queue | Flat jobs only | `ProductionScreen` job table | Job list, no queue aggregate | **G-04** gameplay decision; queue domain | **DEFER** | LARGE | Blocked — do not implement before G-04 |
| PR-007 Construction | Placement + tick progress | `BuildingsScreen`, progress cells | Building status, progress % | Dedicated mockup asset | **ALREADY COVERED** (core) / **DEFER** (mockup) | SMALL–MEDIUM | Building scope; defer full PR-007 |
| PR-008 Analytics | Snapshot jobs + event log | Overview KPIs only | No production time series | Tick/history read model; gameplay metrics | **DEFER** | LARGE | Requires data layer before UI |
| PR-009 Efficiency | Stall flags; hidden worker scalar | Overview stall cards | Partial (no efficiency %) | Efficiency formula; read-model exposure | **DEFER** | MEDIUM | Operational health largely covered |
| PR-010 Production | PR-001–003 + 6.4 integration | `ProductionScreen` component-based | Same as above | Composite mockup sections = other PRs | **NOT APPLICABLE** | — | No separate package |
| CH-004 | No asset | No production charts | N/A | Asset file + PR-008 data | **DEFER** | SMALL (asset only) | Backlog with analytics |

---

## 16. Required Gap Matrix

| Gap | Current Status | Blocking? | Gameplay Decision Needed? | Recommended Phase |
| --- | -------------- | --------: | ------------------------: | --------------- |
| G-04 one-job-per-building | Allowed at runtime; UI tolerates multi-job | No (for closeout) | **Yes** | Pre-PR-006 / future gameplay pass |
| G-05 productionCost | Content field only; no finance posting | No | **Yes** | Future finance integration |
| STALLED_ENERGY integration fixture | Resolver implemented; `GameSession.test` covers workforce only | No | No | **Closeout** test hardening |
| Controller production happy path | E2E/facade yes; controller unit test no | No | No | **Closeout** |
| PGProductionWidget test | No dedicated test | No | No | **Closeout** |
| World Production Overlay | Not implemented; inspector section yes | No | No | Defer beyond M11 |
| Cancel/Pause | Not implemented | No | **Yes** | Defer (G-01) |
| Production Queue | Schema ahead of runtime | No | **Yes** | Defer with G-04 |
| UX-06.4-01 | Production navigation from map; doc drift | No | UX validation only | **Closeout** doc + optional playtest |

---

## 17. Dependency Analysis

### PR-006 Build Queue

```
PR-006 UI
  → Production Queue aggregate (Domain) — MISSING
    → G-04 gameplay decision — UNDEFINED
  → Queue commands (cancel/reorder/pause) — MISSING
    → G-01 cancel/pause semantics — UNDEFINED
```

**Verdict:** **DEFER** — gameplay decision dependency blocks all layers.

### PR-008 Analytics

```
PR-008 charts
  → Production tick history / volume metrics — MISSING (Application read model)
    → TickMetricsSnapshot has no production fields
  → Utilization/downtime — MISSING (Gameplay semantics)
```

**Verdict:** **DEFER** — application + gameplay dependencies.

### PR-005 full UI

```
PR-005 screen
  → warehouseStorage ViewData — PRESENT
  → Warehouse detail inspector — PRESENT
  → Thin production linkage — PRESENT (6.4)
  → Full mockup layout — DESIGN REFERENCE ONLY (no PNG)
  → Routing/mutations — MISSING (Gameplay)
```

**Verdict:** Read-only **ALREADY COVERED**; full UI **DEFER** or optional polish.

### PR-004 full UI

```
PR-004 screen
  → inventoryItems ViewData — PRESENT
  → PGInventoryWidget — PRESENT
  → Per-building inventory — MISSING (Domain semantics)
  → Mutations — MISSING (Commands)
```

**Verdict:** Read-only **ALREADY COVERED**; dedicated screen **DEFER** (duplication).

### Production E2E Closeout (recommended)

```
Closeout package
  → Existing runtime — PRESENT
  → Test gaps — IDENTIFIED (no new features)
  → E2E save/load + in-progress job — PARTIAL
  → Doc sync (world navigation) — PRESENTATION DOCS ONLY
```

**Verdict:** **No domain/API blockers** — validation and hardening only.

---

## 18. Candidate Package Sizing

| Candidate | Size | Blockers | Fit as next package? |
|-----------|------|----------|----------------------|
| Production E2E Validation & Closeout | **SMALL–MEDIUM** | None | **Yes — recommended** |
| PR-005 widget capacity display | **SMALL** | None | Optional polish inside closeout |
| PR-004 production inventory link | **SMALL** | Low player value | No — marginal |
| PR-007 construction read-only panel | **SMALL** | Building scope | No — not Production UX |
| PR-006 Build Queue | **LARGE** | G-04, domain queue | No |
| PR-008 Analytics | **LARGE** | Read models, semantics | No |
| PR-009 Efficiency | **MEDIUM–LARGE** | KPI definition | No |
| CH-004 asset integration | **SMALL** | Asset creation, PR-008 | No |

---

## 19. Closeout Readiness

### BLOCKING BEFORE CLOSEOUT

| Item | Notes |
|------|-------|
| *None identified* | Core production loop operational; 891/891 tests pass |

No mockup-only backlog item is a fundamental blocker.

### SHOULD FIX BEFORE CLOSEOUT

| Item | Rationale |
|------|-----------|
| `STALLED_ENERGY` `GameSession` integration test | Regression protection for operational state resolver |
| E2E save/load with in-progress production job | Serializer tested; full path not |
| `game.controller` production start `200` unit test | G-13 partial coverage |
| `PGProductionWidget` dedicated test | G-11 presentation gap |
| World navigation documentation sync | UX-06.4-01 doc drift |
| M11 Production track gate review | Formal closeout sign-off |

### SAFE TO DEFER BEYOND M11

| Item |
|------|
| PR-004/PR-005 full mockup screens |
| PR-006 Production Queue (G-04) |
| PR-007 full Construction mockup |
| PR-008 Analytics / PR-009 Efficiency |
| PR-010 composite mockup parity |
| CH-004 asset (without analytics) |
| World Production Overlay map layer |
| Cancel / Pause production |
| G-05 `productionCost` posting |
| G-04 enforcement |

---

## 20. Recommended Next Implementation Package

### Primary recommendation (exactly one)

**`Recommended next package: Production E2E Validation & Closeout`**

### Precise scope

**In scope:**

1. **E2E validation** — save/load round-trip with active in-progress production job; world → building → production → start → stall/complete paths
2. **Test hardening** — `STALLED_ENERGY` in `GameSession.test.ts`; `POST /api/production/start` success in `game.controller.test.ts`; `PGProductionWidget` smoke test
3. **Documentation alignment** — update world module guide for `buildProductionBuildingNavigationTarget`; production closeout register for deferred G-04/G-05/PR-006–010
4. **Gate review** — M11 Production UX track formal closeout decision

**Explicit exclusions:**

- PR-004 … PR-010 new UI surfaces
- Production Queue / G-04 enforcement
- `productionCost` / G-05
- Cancel / pause
- New read models for analytics/efficiency
- CH-004 asset creation (unless gate explicitly requests)
- World map production overlay layer

### Rationale

1. **Clear player value validation** — confirms end-to-end production UX works, not new features
2. **Authoritative runtime exists** — no new data contracts required
3. **No gameplay semantics invented** — tests and docs only
4. **Architecture preserved** — uses existing pipeline
5. **Right size for one gate cycle** — SMALL–MEDIUM, independently reviewable

---

## 21. Alternative Considered

**Strongest rejected alternative:** **PR-006 Build Queue (read-only or full)**

**Why rejected:**

- Repository treats PR-006 as **production queue**, not construction queue
- No queue aggregate, no ordering semantics, no G-04 decision
- `ProductionScreen` already shows active jobs — read-only queue would duplicate without adding rules players can act on
- Implementing queue UI before gameplay definition would invite invented semantics (ordering, capacity, concurrency) — explicitly forbidden by M11 scope guards

**Second rejected alternative:** **PR-008 Analytics thin slice (event log completions)**

- Possible technically but **low player value** vs mockup promise
- Risk of appearing complete while volume/trend charts remain impossible
- Better folded into closeout as “deferred register” than shipped as half-analytics

---

## 22. Architecture Assessment (Recommended Closeout Package)

| Layer | Closeout package |
|-------|------------------|
| **Authoritative source** | Existing `GameSession`, production jobs API, event log — no change |
| **DTO/read model** | Existing — no change |
| **ViewData path** | Existing mappers — no change |
| **Mapper path** | Existing — no change |
| **Query/provider** | Existing `useScreenQuery`, dashboard refresh — no change |
| **React surface** | No new surfaces; optional doc-only UX validation |
| **Command path** | Tests exercise existing `production.start`, `construction.placeBuilding` |
| **Selection/navigation** | E2E validates `buildProductionBuildingNavigationTarget` flow |
| **Tick synchronization** | Verify jobs query debounce on tick (existing) |
| **Persistence** | E2E save/load with `productionJobs` in savegame |

**No missing architecture dependencies** for the recommended package.

---

## 23. Final Audit Decision

## OPTION B — **READY FOR PRODUCTION CLOSEOUT**

After Phases 6.2–6.4, the remaining Sprint-4 Production UX backlog does **not** contain a small, authoritative, gameplay-safe UX slice that outweighs validation and closeout work. PR-001–PR-003 and facility integration deliver the core player experience. PR-004/PR-005 read paths exist on the company dashboard with Phase 6.4 production linkage. PR-006–PR-009 require gameplay decisions and/or new read models. PR-010 is a composite reference superseded by incremental delivery.

**Recommended next package:**

`M11 Phase 6.6 — Production E2E Validation & Closeout`

(Phase number label may be adjusted to project convention; scope is **Production E2E Validation & Closeout** as defined in §20.)

---

## Definition of Done Checklist

- [x] Current HEAD and branch verified (`master` @ `0532c4a`)
- [x] Phase 6.1–6.4 reports reviewed
- [x] Runtime and presentation code reviewed
- [x] PR-004 through PR-010 audited
- [x] CH-004 audited
- [x] G-04/G-05 reclassified
- [x] Known test gaps reviewed
- [x] UX-06.4-01 reviewed
- [x] Decision Matrix created
- [x] Gap Matrix created
- [x] Dependency Analysis created
- [x] Closeout Readiness assessed
- [x] Exactly one next package recommended
- [x] No gameplay rules invented
- [x] No runtime/UI code changes
- [x] `pnpm test` executed — 891/891 PASS
- [x] Audit report created at `docs/architecture/reviews/M11_PHASE6_5_REMAINING_PRODUCTION_UX_SCOPE_AUDIT.md`
