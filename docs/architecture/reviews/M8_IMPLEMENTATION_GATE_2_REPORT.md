# M8 Implementation Gate 2 Review Report

**Project:** Project Genesis  
**Milestone:** M8 – Economy Simulation  
**Gate:** Implementation Gate 2 (post Phases 1–7)  
**Date:** 2026-07-22  
**Last committed baseline:** `03dc747` — *Complete M7 persistence, queries, and gate closure.*  
**Implementation under review:** Uncommitted working tree (M8 Phases 1–7)  
**Reference documents:**

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/project-management/M8_ECONOMY_SIMULATION_PLAN.md`
- `docs/architecture/reviews/M8_ARCHITECTURE_REVIEW.md`
- `docs/architecture/reviews/M8_ARCHITECTURE_REVIEW_REPORT.md` (pre-implementation, M8-0)
- `docs/architecture/decisions/DD-0XX_COMPANY_BRAIN_AND_DECISION_QUEUE.md`
- `docs/architecture/decisions/DD-018 – Economy & Market Architecture.md`
- `docs/decisions/DD-033-Savegame-and-Persistence-Strategy.md`
- `docs/decisions/DD-032-Deterministic-Tick-Processing.md`
- `docs/decisions/DD-029-Modular-Monolith-Architecture.md`
- `docs/decisions/DD-025-ECS-Inspired-Simulation-Architecture.md`
- `docs/decisions/DD-015-static-definitions-vs-dynamic-state.md`
- `docs/decisions/DD-027-Event-Driven-Simulation-Architecture.md`

**Method:** Full-repository inspection, targeted grep/glob audits, test inventory, ADR cross-check. **No source code modified.**

---

# Executive Summary

M8 Phases **1–7 are substantially implemented** in the current working tree. The pre-implementation blockers identified in `M8_ARCHITECTURE_REVIEW_REPORT.md` (regional markets, planning pipeline placement, simulation/application boundary) have been **addressed in code**.

Verified outcomes:

| Area | Verdict |
|------|---------|
| Company Brain foundation (Phase 1) | ✅ Complete |
| Strategy content pipeline (Phase 2) | ✅ Complete |
| Regional markets extension (Phase 3) | ✅ Substantially complete |
| Planning pipeline (Phase 4) | ✅ Complete with minor functional gaps |
| Decision execution via use cases (Phase 5) | ✅ Complete |
| Simulation integration (Phase 6) | ✅ Complete |
| Expansion / production / research planning (Phase 7) | ✅ Substantially complete; financial/regional depth partial |
| Order books | ✅ Correctly absent (DD-018 deferred) |
| Single engine / single scheduler | ✅ Verified |
| Simulation → Application import boundary | ✅ Verified via domain ports |
| Determinism | ✅ No simulation-critical randomness found |
| Savegame V3 / brain persistence | ❌ Not implemented (planned Phase 8) |
| Documentation sync | ❌ `IMPLEMENTATION_PROGRESS.md` stale |

**559 tests passing** at review time (`pnpm test` after Phase 7 completion).

The implementation **extends** existing aggregates and use cases rather than introducing parallel economy or AI systems. Remaining gaps are primarily **Phase 8 persistence**, **documentation updates**, and **functional refinements** (liquidity goals without decisions, no default NPC seeding in `StartNewGame`, cross-region expansion not modeled).

**Final recommendation:** **READY FOR PHASE 8**

---

# Repository Status

| Area | Status | Notes |
|------|--------|-------|
| M7 World Simulation | ✅ Complete | Baseline commit `03dc747` |
| M8 Company Brain | ✅ Implemented | 30 domain files under `src/domain/brain/` |
| M8 Strategy content | ✅ Implemented | 5 YAML strategies + loader/registry/validator |
| M8 Regional markets | ✅ Implemented | Extended `Market` aggregate; per-region seeding |
| M8 Planning pipeline | ✅ Implemented | 13 application planning files |
| M8 Decision execution | ✅ Implemented | `CompanyDecisionExecutionService` |
| M8 Simulation wiring | ✅ Implemented | `CompanySimulationSystem`, `CompanyPlanningSystem` |
| M8 Persistence (brain) | ❌ Missing | No `CompanyBrain` in `GameStateSerializer` |
| Git state | Uncommitted | All M8 work sits on top of `03dc747` |
| Tests | 559 passing | +31 vs pre-M8 baseline (528) |

---

# Implemented Components

## New (M8 greenfield)

| Component | Path | Classification |
|-----------|------|----------------|
| Company Brain domain module | `src/domain/brain/**` (30 files) | New |
| Brain repository | `src/domain/brain/CompanyBrainRepository.ts` | New |
| Brain in-memory persistence | `src/infrastructure/persistence/InMemoryCompanyBrainRepository.ts` | New |
| Simulation ports | `src/domain/brain/CompanyPlanningPort.ts`, `CompanyDecisionExecutionPort.ts` | New |
| Planning pipeline | `src/application/planning/**` (13 files) | New |
| Decision execution service | `src/application/services/CompanyDecisionExecutionService.ts` | New |
| Brain bootstrap service | `src/application/services/CompanyBrainBootstrapService.ts` | New |
| Strategy content module | `src/content/strategy/**` | New |
| Strategy YAML content | `game-content/strategies/*.yaml` (5 files) | New |
| Strategy schema doc | `docs/schemas/Strategy.schema.md` | New |
| Company planning simulation system | `src/simulation/systems/company/CompanyPlanningSystem.ts` | New |
| Market price history entry | `src/domain/market/MarketPriceHistoryEntry.ts` | New |
| Market regional statistics | `src/domain/market/MarketRegionalStatistics.ts` | New |
| Market regional supply aggregator | `src/domain/market/MarketRegionalSupplyAggregator.ts` | New |
| M8 integration tests | `CompanyEconomySimulation.integration.test.ts`, `CompanySimulationSystem.test.ts`, planning/execution tests | New |
| ADR (draft/untracked) | `docs/architecture/decisions/DD-0XX_COMPANY_BRAIN_AND_DECISION_QUEUE.md` | New |
| M8 plan / review docs | `docs/project-management/M8_ECONOMY_SIMULATION_PLAN.md`, review docs | New |

## Extended (existing systems modified for M8)

| Component | Path | Change |
|-----------|------|--------|
| `Market` aggregate | `src/domain/market/Market.ts` | Regional `regionId`, liquidity, supply/demand, embedded price history |
| `ResourceMarketPrice` | `src/domain/market/ResourceMarketPrice.ts` | Supply, demand, liquidity fields |
| `MarketRepository` | `src/domain/market/MarketRepository.ts` | `findByRegionId()` |
| `MarketConstants` | `src/domain/market/MarketConstants.ts` | `createRegionalMarketId()`, legacy `GLOBAL_MARKET_ID` |
| `MarketPriceSeeder` | `src/application/services/MarketPriceSeeder.ts` | Seeds one market per enabled region |
| `MarketTradeService` | `src/application/services/MarketTradeService.ts` | Regional market selection + legacy fallback |
| `MarketSimulationSystem` | `src/simulation/systems/market/MarketSimulationSystem.ts` | Iterates all regional markets |
| `GetMarketPricesQueryHandler` | `src/application/queries/GetMarketPricesQueryHandler.ts` | Regional pricing |
| `GameStateSerializer` | `src/infrastructure/persistence/savegame/GameStateSerializer.ts` | Regional market snapshots + `priceHistory` |
| `GameSaveSnapshotV1` | `src/application/persistence/GameSaveSnapshotV1.ts` | Regional market fields |
| `BuyResourceUseCase` / `SellResourceUseCase` | Regional `regionId` on commands | Extended |
| `CreateCompanyUseCase` | Autonomous flag + brain bootstrap | Extended |
| `CreateCompanyCommand` | `autonomous`, `strategyDefinitionId` | Extended |
| `CompanySimulationSystem` | Decision execution at tick start | Extended (was stub) |
| `createDefaultSimulationSystems` | Added `CompanyPlanning`; reordered pipeline | Extended |
| `bootstrapApplication` / `restoreApplicationFromSnapshot` | Brain repo, ports, pipeline, execution wiring | Extended |
| `ApplicationContext` / `application/index.ts` | Exported M8 services | Extended |
| `validateGameContent` | Loads strategies | Extended |

---

# Modified Components

All items listed under **Extended** above. Additionally:

- Multiple test files updated for regional markets and M8 wiring (`MarketTradeService.test.ts`, `MarketSimulationSystem.test.ts`, `GameStateSerializer.test.ts`, etc.)
- `docs/decisions/DD-033-Savegame-and-Persistence-Strategy.md` — modified in working tree (M8 persistence notes)

---

# Phase Verification

## Phase 1 — Company Brain Foundation

| Requirement | Status | Evidence |
|-------------|--------|----------|
| `CompanyBrain` aggregate | ✅ | `src/domain/brain/CompanyBrain.ts` — create/restore, goals, knowledge, memory, queue |
| Strategy runtime state | ✅ | `ActiveStrategy.ts` references content `strategyDefinitionId` |
| `Goal` | ✅ | `Goal.ts`, `GoalKind.ts`, `GoalStatus.ts`, `GoalId.ts` |
| `Knowledge` | ✅ | `KnowledgeEntry.ts`, `KnowledgeKind.ts`, `KnowledgeValue.ts` |
| `Memory` | ✅ | `MemoryEntry.ts`, `MemoryKind.ts`, `MemoryPayload.ts`, expiry support |
| `DecisionQueue` | ✅ | `DecisionQueue.ts` — deterministic ordering (priority ↓, tick ↑, id ↑) |
| `CompanyDecision` + payloads | ✅ | Typed discriminated union in `CompanyDecisionPayload.ts` |
| `PlanningLayer` | ✅ | STRATEGIC / OPERATIONAL / TACTICAL |
| Domain events | ✅ | `StrategyChanged`, `GoalCreated`, `GoalCompleted`, `DecisionQueued` |
| Repository | ✅ | `CompanyBrainRepository` + `InMemoryCompanyBrainRepository` |
| Tests | ✅ | `CompanyBrain.test.ts`, `InMemoryCompanyBrainRepository.test.ts` |

**Notes:**

- Brain is a **separate aggregate** referenced by `companyId`; `Company` remains the business identity aggregate. This matches DD-0XX.
- Brain state is **not serialized** in savegames yet (Phase 8 scope).

---

## Phase 2 — Strategy Content

| Requirement | Status | Evidence |
|-------------|--------|----------|
| `StrategyDefinition` | ✅ | `src/content/strategy/StrategyDefinition.ts` |
| Loader | ✅ | `StrategyLoader.ts` |
| Validator | ✅ | `StrategyValidator.ts` |
| Registry | ✅ | `StrategyRegistry.ts` |
| Starter content | ✅ | 5 strategies in `game-content/strategies/` |
| Content validation | ✅ | Wired in `validateGameContent.ts` |
| Schema doc | ✅ | `docs/schemas/Strategy.schema.md` |
| Tests | ✅ | `StrategyLoader.test.ts` |

**Notes:**

- No runtime `StrategyRepository` domain aggregate — strategies are **immutable content** loaded at bootstrap. Appropriate per DD-015 / DD-030.

---

## Phase 3 — Regional Markets

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Existing `Market` extended | ✅ | Single `Market` class with `regionId` |
| No duplicate market implementation | ✅ | One aggregate, one repository interface, one in-memory impl |
| Regional pricing | ✅ | `MarketPriceSeeder` seeds `market_{regionId}` per enabled region |
| Liquidity | ✅ | `ResourceMarketPrice.liquidity`, `Market.updateSupplyDemand()` |
| Statistics | ✅ | `MarketRegionalStatistics.ts`, `Market.getRegionalStatistics()` |
| History | ✅ | Embedded `MarketPriceHistoryEntry[]` (limit 100), serialized in savegame |
| `MarketSimulationSystem` changes | ✅ | Processes all markets; uses `MarketRegionalSupplyAggregator` |
| `MarketTradeService` changes | ✅ | Regional trades with legacy `market_global` fallback |
| Order books **not** introduced | ✅ | Zero matches for `OrderBook` / `order_book` in `src/` |

**Notes:**

- M8 plan mentions `MarketHistoryRepository`; implementation embeds history **inside** `Market` instead. Functionally equivalent for Phase 3; document as an intentional simplification.
- Legacy `GLOBAL_MARKET_ID` retained for save migration and trade fallback — **not** a second market model.
- `MarketSupplyAggregator.ts` (global inventory supply) exists but is **unused**; regional aggregator is authoritative.
- Company-driven demand is not modeled; simulation uses baseline demand constants.

---

## Phase 4 — Planning

**Required pipeline:** Observe → Analyse → Goals → Strategy → Decision Generation → Validation → Decision Queue

| Stage | Status | Implementation |
|-------|--------|----------------|
| Observe | ✅ | `CompanyPlanningObserver` — read-only repo reads |
| Analyse | ✅ | `CompanyPlanningAnalyser` — shortages, surpluses, expansion/production/research candidates |
| Goals | ✅ | `CompanyGoalPlanner` — per-layer goal generation |
| Strategy | ⚠️ Partial | `resolveStrategyDefinition()` selects active/content strategy; no separate `CompanyStrategyPlanner` stage |
| Decision generation | ✅ | `CompanyDecisionPlanner` |
| Validation | ✅ | `CompanyDecisionValidator` |
| Queue | ✅ | `CompanyPlanningPipeline.#applyDraft()` → `brain.enqueueDecision()` |
| Knowledge / memory | ✅ | `CompanyKnowledgePlanner` (parallel to analyse, before layer loop) |

**Planning mutates only brain repository:** ✅ Verified

- `CompanyPlanningPipeline.run()` saves **only** `companyBrainRepository`.
- Test: *"does not mutate inventory, finance, or market repositories"* (`CompanyPlanningPipeline.test.ts`).
- Observer performs **reads only** (no `.save()` calls).

**Planning layer frequency:** ✅

| Layer | Interval | Source |
|-------|----------|--------|
| TACTICAL | Every tick | `PlanningConstants.ts` |
| OPERATIONAL | Every 10 ticks | |
| STRATEGIC | Every 100 ticks | |

**Functional gaps (not architecture violations):**

- `STABILIZE_LIQUIDITY` goal is created but **no decision handler** exists in `CompanyDecisionPlanner`.
- `REDUCE_COSTS` goal kind is defined but **never generated**.
- `EXPAND_REGION` exists as a **decision type** in domain but expansion is expressed as `PLACE_BUILDING` decisions only.

---

## Phase 5 — Decision Execution

| Requirement | Status | Evidence |
|-------------|--------|----------|
| All executable decisions via use cases | ✅ | `CompanyDecisionExecutionService` |
| No direct repository writes from execution service | ✅ | Brain status updates only; mutations flow through use cases |
| PURCHASE_RESOURCE | ✅ | `BuyResourceUseCase` |
| SELL_RESOURCE | ✅ | `SellResourceUseCase` |
| PLACE_BUILDING | ✅ | `PlaceBuildingUseCase` |
| START_PRODUCTION | ✅ | `StartProductionUseCase` |
| START_RESEARCH | ✅ | `StartResearchUseCase` |
| EXPAND_REGION decision type | ⚠️ | Defined in domain; **not executable** (expansion via `PLACE_BUILDING`) |
| Max decisions per run | ✅ | `DECISION_EXECUTION_MAX_PER_RUN = 50` |
| Failed decisions don't abort queue | ✅ | Tested in `CompanyDecisionExecutionService.test.ts` |

**Notes:**

- Execution path matches DD-0XX: Queue → Application Use Cases → Domain → Repositories.

---

## Phase 6 — Simulation Integration

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Planning frequency via layer intervals | ✅ | `resolvePlanningLayersForTick()` |
| System ordering | ✅ | Verified in factory + test |
| Deterministic company iteration | ✅ | `companyRepository.findAll()` in both company systems |
| `CompanySimulationSystem` integration | ✅ | Executes decisions at tick **start** |
| `CompanyPlanningSystem` integration | ✅ | Plans after **Market** system |
| No additional scheduler | ✅ | No `SimulationScheduler` in codebase |
| No additional simulation engine | ✅ | Single production `SimulationEngine` in bootstrap |
| Domain ports (no simulation→application imports) | ✅ | `CompanyPlanningPort`, `CompanyDecisionExecutionPort` |
| NPC bootstrap hook | ✅ | `CreateCompanyUseCase` with `autonomous: true` |

**Authoritative tick order (verified):**

```text
Company → Building → Transport → Production → Research → Market → CompanyPlanning → Contract → Finance
```

Source: `createDefaultSimulationSystems.ts` + `createDefaultSimulationSystems.test.ts`.

**Rationale verified:** Execution before Market uses prior-tick prices; planning after Market observes updated prices. Aligns with DD-032 and resolves the pre-implementation tick-order conflict noted in M8-0.

**Gap:** `StartNewGameUseCase` does **not** seed autonomous NPC companies or brains by default. Multi-company economy requires explicit `CreateCompany` with `autonomous: true`.

---

## Phase 7 — Company Expansion

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Building planning | ✅ | Analyser selects expansion building type; `PLACE_BUILDING` decision |
| Production planning | ✅ | `#resolveProductionCandidate()` → `INCREASE_PRODUCTION` → `START_PRODUCTION` |
| Research planning | ✅ | `#resolveResearchCandidate()` → `INVEST_RESEARCH` → `START_RESEARCH` |
| Financial planning | ⚠️ Partial | Liquidity pressure analysis; trade buy/sell; no dedicated risk evaluator |
| Inventory planning | ✅ | Shortage/surplus analysis drives purchase/sell goals |
| Regional expansion | ⚠️ Partial | Places buildings in `primaryRegionId` only; no cross-region target selection |
| Use-case reuse | ✅ | All five executable types route through existing use cases |
| NPC brain bootstrap | ✅ | `CompanyBrainBootstrapService` + `CreateCompanyCommand.autonomous` |

**Deterministic placement:** `PlanningExpansionHelpers.computeDeterministicBuildingPlacement()` — no randomness.

---

# Architecture Compliance

| Rule | Status | Notes |
|------|--------|-------|
| Exactly one `Company` aggregate model | ✅ | No `NPCCompany`; same `Company` for player and NPC |
| Exactly one `Market` implementation | ✅ | Extended aggregate; legacy ID is compatibility only |
| Exactly one `SimulationEngine` | ✅ | Bootstrap creates one engine |
| Exactly one scheduler | ✅ | Tick loop inside `SimulationEngine` |
| No duplicated business logic | ✅ | AI uses same use cases |
| No duplicate repositories | ✅ | One repo per aggregate |
| No AI-specific domain rules | ✅ | Planning in application layer; brain holds state only |
| Modular monolith layers | ✅ | Domain / Application / Simulation / Infrastructure / Content |
| Event-driven updates | ✅ | Domain events from brain and use cases |
| Content-driven strategy weights | ✅ | YAML → registry → planning |

---

# Company Brain Review

| Concern | Status |
|---------|--------|
| Brain ownership (1:1 with autonomous company) | ✅ Enforced by bootstrap id `brain_{companyId}` |
| Strategy ownership | ✅ `ActiveStrategy` on brain; content definitions external |
| Knowledge ownership | ✅ Stored on brain aggregate |
| Memory ownership | ✅ Stored on brain; pruned by tick expiry |
| Goal ownership | ✅ Stored on brain |
| Decision queue ownership | ✅ `DecisionQueue` inside brain |
| Company remains primary business aggregate | ✅ Brain references `companyId`; does not replace `Company` |
| Brain never mutates other repos directly | ✅ Verified in pipeline and DD-0XX alignment |
| Brain persistence | ❌ Not in savegame (Phase 8) |

---

# Regional Market Review

| Concern | Status |
|---------|--------|
| One market per region | ✅ Seeded for each enabled region |
| Shared `Market` aggregate | ✅ Single class |
| Price formation | ✅ `MarketSimulationSystem` + calculators |
| History | ✅ Embedded in aggregate, serialized |
| Liquidity | ✅ Per-resource on `ResourceMarketPrice` |
| Transport integration | ✅ Unchanged M6 path; trades regional |
| No duplicate economy model | ✅ Verified |
| Order books | ✅ Absent (DD-018 deferred) |

---

# Planning Pipeline Review

Matches DD-0XX with these documented deviations:

1. **Strategy evaluation** is folded into `resolveStrategyDefinition()` + analyser weight usage rather than a standalone planner class.
2. **Knowledge recording** runs before the per-layer goal loop (documented in pipeline orchestrator).
3. **Dead goal paths:** `STABILIZE_LIQUIDITY`, `REDUCE_COSTS` not fully wired to decisions.

Pipeline integrity:

```text
Observe (read-only)
  → Analyse (+ strategy resolve)
  → Knowledge/Memory draft
  → [per layer] Goals → Decisions
  → Validate → Queue (brain only)
  → [next tick start] Execute via use cases
```

---

# Simulation Integration Review

| Check | Result |
|-------|--------|
| `CompanySimulationSystem` at pipeline start | ✅ |
| `CompanyPlanningSystem` after Market | ✅ |
| Companies without brain skipped | ✅ Both systems check `findByCompanyId` |
| Ports registered in bootstrap/restore | ✅ |
| Integration test | ✅ `CompanyEconomySimulation.integration.test.ts` |
| Second engine in tests only | ✅ Test harnesses; not production |

---

# Repository Boundary Review

| Layer | Responsibility | M8 compliance |
|-------|----------------|---------------|
| Simulation | Schedules execution | ✅ Systems call ports only |
| Application | Orchestrates workflows | ✅ Pipeline + execution + use cases |
| Domain | Business rules | ✅ Brain, Market, Company unchanged in role |
| Repositories | State ownership | ✅ Brain repo added; no duplicate stores |
| Infrastructure | Persistence | ✅ In-memory brain repo; serializer extended for markets |
| Content | Immutable config | ✅ Strategies in YAML |

**Violations found:** None in production `src/` layer imports.

- `tests/architecture/dependency-rules.test.ts` enforces domain and simulation import boundaries.
- Simulation layer does **not** import application (verified by grep).
- Application → content coupling follows established bootstrap pattern.

---

# Determinism Review

| Search target | Finding |
|---------------|---------|
| `Math.random()` | ❌ Not found in `src/` |
| `Random()` | ❌ Not found |
| `Date.now()` | ⚠️ `ProjectGenesisError.ts` only — error metadata timestamp, **not** simulation logic |
| Wall-clock in business logic | ✅ `Clock` interface enforced; `ManualClock` in tests |
| Unordered iteration | ✅ Maps iterated with sorted keys or `findAll()` sorted by id |
| HashMap iteration without ordering | ✅ Brain queue comparator explicit; repos sort outputs |
| Parallel planning | ❌ Not found |
| Async planning | ❌ Production planning code is synchronous; tests use async setup only |
| Non-deterministic collections | ❌ Not found in planning path |
| Unstable IDs | ✅ Deterministic id helpers in `PlanningExpansionHelpers`, goal/decision id formulas |
| Unstable serialization | ⚠️ Brain not serialized yet — Phase 8 must define deterministic ordering |

**Determinism tests:**

- `CompanyPlanningPipeline.test.ts` — *"produces identical brain updates for identical initial state"*
- Repository `findAll()` ordering tests for brain repo
- `createDefaultSimulationSystems.test.ts` — fixed system order

---

# Performance Review

Obvious risks identified (report only — no optimization performed):

| Risk | Location | Complexity |
|------|----------|------------|
| Production job scan per observation | `CompanyPlanningObserver` — `productionJobRepository.findAll()` filtered by company | O(all jobs × companies) per planning run |
| Full market iteration in observer | Nested loops over markets × prices per company observe | O(markets × resources × companies) |
| Recipe / technology linear scans | `CompanyPlanningAnalyser` — sorted `getAll()` loops | O(content size); acceptable at current scale |
| Planning runs up to 3 layers per tick | TACTICAL every tick can stack with OPERATIONAL/STRATEGIC on interval ticks | Bounded small constant |
| Decision execution cap | 50 per company per tick | ✅ Bounded |

No O(n³) patterns identified. Scale risk is **multi-company × multi-region** observation scans at Phase 9 performance testing.

---

# Testing Review

| Category | Status | Key files |
|----------|--------|-----------|
| Unit — Domain Brain | ✅ | `CompanyBrain.test.ts`, `DecisionQueue` ordering |
| Unit — Planning | ✅ | `CompanyPlanningPipeline.test.ts` (7 tests) |
| Unit — Execution | ✅ | `CompanyDecisionExecutionService.test.ts` (6 tests) |
| Unit — Strategy content | ✅ | `StrategyLoader.test.ts` |
| Unit — Regional markets | ✅ | `Market.test.ts`, `MarketPriceSeeder.test.ts`, `MarketSimulationSystem.test.ts` |
| Integration — M8 economy tick | ✅ | `CompanyEconomySimulation.integration.test.ts` |
| Simulation — Company systems | ✅ | `CompanySimulationSystem.test.ts`, `createDefaultSimulationSystems.test.ts` |
| Architecture — dependency rules | ✅ | `tests/architecture/dependency-rules.test.ts` |
| Determinism | ⚠️ Partial | Pipeline repeatability test; no dedicated multi-tick replay harness yet |
| Regression | ✅ | Full suite 559 tests |
| Save/load with brain | ❌ | Blocked until Phase 8 |

**Coverage summary:** Core M8 paths are tested. Gaps: brain save/load round-trip, multi-company determinism replay, explicit tests for `PLACE_BUILDING` / `START_PRODUCTION` / `START_RESEARCH` execution from planning output.

---

# Documentation Review

| Document | Status |
|----------|--------|
| `IMPLEMENTATION_PROGRESS.md` | ❌ **Stale** — still shows M8 at 0%, 528 tests, last updated 2026-07-19 |
| `M8_ECONOMY_SIMULATION_PLAN.md` | ✅ Present (untracked) |
| `M8_ARCHITECTURE_REVIEW_REPORT.md` | ⚠️ Pre-implementation snapshot; superseded by this report for Phases 1–7 |
| `DD-0XX_COMPANY_BRAIN_AND_DECISION_QUEUE.md` | ✅ Present; placeholder date `YYYY-MM-DD` should be finalized |
| `Strategy.schema.md` | ✅ Present |
| Domain schema docs for brain | ❌ Not found (goals/decisions may need schema docs in Phase 9) |
| `M8_IMPLEMENTATION_REPORT.md` | ❌ Not created (Phase 9 deliverable) |

---

# Remaining Risks

1. **No brain persistence** — autonomous state lost on save/load until Phase 8.
2. **No default NPC companies** — economy remains single-company in `StartNewGame`; M8 ecosystem requires explicit autonomous company creation.
3. **Incomplete goal→decision coverage** — liquidity and cost-reduction goals do not produce actions.
4. **Cross-region expansion not modeled** — `EXPAND_REGION` goal places buildings in primary region only.
5. **Embedded vs repository market history** — may complicate future analytics if history grows beyond aggregate limit.
6. **Uncommitted M8 work** — large untracked diff; merge/commit discipline required before Phase 8.

---

# Technical Debt

| Item | Severity |
|------|----------|
| Unused `MarketSupplyAggregator.ts` | Low — remove or document |
| `EXPAND_REGION` decision type unused | Low — align domain enum with `PLACE_BUILDING` or implement handler |
| `STABILIZE_LIQUIDITY` / `REDUCE_COSTS` dead goal paths | Medium — functional completeness |
| `ProjectGenesisError` uses `Date.now()` | Low — acceptable for error metadata |
| Strategy ADR date placeholder | Low — documentation hygiene |
| `companyBrainRepository` optional on `CreateCompanyUseCase` | Low — tests omit it; autonomous path requires explicit wiring |

---

# Open Questions

1. Should Phase 8 serialize the full brain (goals, knowledge, memory, queue) or a minimal subset?
2. When should `StartNewGameUseCase` seed competing NPC companies — Phase 8, Phase 9, or separate world bootstrap use case?
3. Should `EXPAND_REGION` remain a decision type or be removed in favor of `PLACE_BUILDING` only?
4. Is embedded market history sufficient long-term, or should `MarketHistoryRepository` be introduced in a later milestone?
5. Should liquidity stabilization produce sell/asset decisions or purchasing constraints rather than orphan goals?

---

# Recommendations Before Phase 8

1. **Commit Phase 1–7** as a coherent baseline before persistence work.
2. **Update `IMPLEMENTATION_PROGRESS.md`** — M8 status, test count (559), implemented modules.
3. **Finalize DD-0XX metadata** (date, cross-links).
4. **Define `GameSaveSnapshotV3` contract** — brain fields, decision queue ordering, active strategy, deterministic serialization order (per DD-033).
5. **Add save/load integration tests** for brain state in Phase 8.
6. **Wire orphan goals** (`STABILIZE_LIQUIDITY`) or remove from goal planner until decisions exist.
7. **Plan NPC seeding strategy** — content-driven competitor companies for integration/determinism tests.
8. **Remove or deprecate** unused `MarketSupplyAggregator.ts`.
9. **Add execution tests** for non-trade decision types from planning output (building, production, research).

---

# Final Recommendation

Phases 1–7 implement the M8 architecture as specified in ADRs and the implementation plan: a deterministic, repository-driven company brain with regional markets, planning pipeline, use-case-based execution, and simulation integration — **without** duplicate engines, markets, or AI domain rules.

Known gaps (brain persistence, documentation drift, partial financial/expansion depth, no default NPC session) are **expected next-phase work** or **functional refinements**, not architectural blockers.

**READY FOR PHASE 8**
