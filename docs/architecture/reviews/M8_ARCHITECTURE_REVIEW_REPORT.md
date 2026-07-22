# M8 Architecture Review Report

**Project:** Project Genesis  
**Milestone:** M8 – Economy Simulation (NPC Economy)  
**Audit ID:** M8-0 (mandatory pre-implementation review)  
**Date:** 2026-07-19  
**Commit audited:** `03dc747` (master)  
**Reference documents:**

- `docs/architecture/reviews/M8_ARCHITECTURE_REVIEW.md`
- `docs/project-management/M8_ECONOMY_SIMULATION_PLAN.md`
- `docs/development/IMPLEMENTATION_PROGRESS.md`
- `docs/project-management/MILESTONE_PLAN.md`
- `docs/quality/M7_WORLD_SIMULATION_GATE_REVIEW_REPORT.md` (AUD-005)

**Method:** Full-repository search and file inspection. No source code modified.

---



# Executive Summary

M7 is complete (AUD-005). The repository provides a **mature, deterministic simulation stack** (M4–M7) with a single-player session model, one global instant-trade market, and a **no-op** `CompanySimulationSystem` **stub** ready for extension.

**No M8 AI components exist today.** Verified absent: `CompanyBrain`, `Strategy`, `Goal`, `DecisionQueue`, `Knowledge`, `Memory`, `MarketHistory`, regional markets, autonomous NPC companies, and planning simulation systems.

M8 **can** be implemented by **extending** the existing `Company` aggregate, `Market` aggregate, simulation pipeline, application use cases, and savegame serializer — **without** a second engine, scheduler, or duplicate economy models.

However, **three architecture decisions must be resolved in ADRs before implementation proceeds beyond M8-1 scaffolding:**

1. **Regional market model** — M8 plan requires one market per region with history/indicators; code has one global price book with instant trades (`market_global`).
2. **Planning pipeline placement** — M8 plan §55 tick-order diagram conflicts with authoritative `createDefaultSimulationSystems` order (DD-032).
3. **Savegame schema V3** — M8 runtime state (brain, strategy, decision queue, market history) does not fit `GameSaveSnapshotV2`.

Additional documentation drift exists (M8 plan use-case names, order-book vs instant-trade model). These are resolvable without replacing existing systems.

**Verdict:** **ARCHITECTURE CHANGES REQUIRED** (ADR-level clarifications and contracts) before M8-2+ implementation. M8-1 greenfield aggregates may start **after** planning-pipeline ADR is accepted.

---



# Repository Status


| Area                | Status         | Notes                                                                 |
| ------------------- | -------------- | --------------------------------------------------------------------- |
| M7 World Simulation | ✅ Complete     | Regions, map, cities, regional resources, save V2, queries            |
| M6 Logistics        | ✅ Complete     | Transport orders, routes, throughput queues (DD-022 abstract network) |
| M5 Economy          | ✅ Complete     | Dynamic pricing, fees, contracts, inflation dampening                 |
| M4 Core Gameplay    | ✅ Complete     | Company, building, production, research, employees                    |
| M8 NPC / AI economy | ❌ Not started  | No brain, strategy, NPC companies, regional markets                   |
| Tests               | 528 passing    | `pnpm test` at audit commit                                           |
| Savegame            | Schema V2      | `GameSaveSnapshotV2`; v1→v2 migration in serializer                   |
| Session model       | Single company | `GameSession` defaults to `company_001` / `player_001`                |


**Git:** `03dc747` on `origin/master`. Untracked docs (`M8_ECONOMY_SIMULATION_PLAN.md` was present locally during audit) do not affect code audit.

---



# Existing Systems



## Simulation engine


| Component                        | Path                                                       | Role                                                                        |
| -------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------- |
| `SimulationEngine`               | `src/simulation/engine/SimulationEngine.ts`                | Single tick loop: advance clock → run systems → drain event queue → publish |
| `SimulationState`                | `src/simulation/state/SimulationState.ts`                  | Tick number, paused flag                                                    |
| `EventQueue`                     | `src/simulation/events/EventQueue.ts`                      | FIFO domain-event buffer per tick                                           |
| `TickContext`                    | `src/simulation/engine/TickContext.ts`                     | `{ tickNumber, clock }` passed to systems                                   |
| `createDefaultSimulationSystems` | `src/simulation/systems/createDefaultSimulationSystems.ts` | Authoritative pipeline factory                                              |


**Authoritative system order** (factory + test):

```text
Company → Building → Transport → Production → Research → Market → Contract → Finance
```

No `SimulationScheduler`, `SimulationContext`, or second engine exists.

## Simulation systems (all verified)


| System                       | Mutations                                      | M8 relevance                           |
| ---------------------------- | ---------------------------------------------- | -------------------------------------- |
| `CompanySimulationSystem`    | **None** (stub loop)                           | Primary M8 extension candidate         |
| `BuildingSimulationSystem`   | Construction ticks                             | AI building via `PlaceBuildingUseCase` |
| `TransportSimulationSystem`  | Transport progress, deterministic region order | AI reuses M6 logistics                 |
| `ProductionSimulationSystem` | Job ticks                                      | AI via `StartProductionUseCase`        |
| `ResearchSimulationSystem`   | Research ticks                                 | AI via `StartResearchUseCase`          |
| `MarketSimulationSystem`     | Global price updates on interval               | Must evolve for regional markets       |
| `ContractSimulationSystem`   | NPC purchase contracts                         | Stabilizer, not full NPC company       |
| `FinanceSimulationSystem`    | Payroll, tax                                   | Shared player/NPC rules                |




## Application layer


| Category  | Count | Examples                                                                                                                                    |
| --------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Use cases | 14    | `CreateCompany`, `StartNewGame`, `PlaceBuilding`, `StartProduction`, `BuyResource`, `SellResource`, `StartResearch`, `SaveGame`, `LoadGame` |
| Services  | 12+   | `MarketTradeService`, `TransportLogisticsService`, `WorldBootstrapService`, `TickHistoryService`                                            |
| Queries   | 10+   | `ListRegions`, `GetRegionDetails`, `GetRegionalResources`, `GetMarketPrices`                                                                |


**Verified missing use cases referenced in M8 plan:** `ConstructBuildingUseCase`, `CreateTransportRouteUseCase`, `PurchaseResourceUseCase` (aliases exist: `PlaceBuildingUseCase`, transport via `TransportLogisticsService`, `BuyResourceUseCase`).

## Domain layer


| Aggregate                                        | Region-aware         | Notes                                                                      |
| ------------------------------------------------ | -------------------- | -------------------------------------------------------------------------- |
| `Company`                                        | No home region       | Identity only; `CompanyStatus.BANKRUPT` enum exists, no transition methods |
| `Building`                                       | ✅ `regionId`         | Required since M7-3                                                        |
| `Market`                                         | ❌ Global             | Single price book; `GLOBAL_MARKET_ID = 'market_global'`                    |
| `Inventory`, `FinanceAccount`                    | Per company          | Shared model for all companies                                             |
| `ProductionJob`, `ResearchJob`, `TransportOrder` | Via building/company | No duplicate region fields (M7 decision)                                   |
| `SupplyContract`                                 | NPC stabilizer       | `NPC_PURCHASE` kind; not autonomous company                                |
| `World`, `Region`, `City`, `WorldMap`            | ✅                    | Bootstrapped from content; static graph                                    |




## Repositories (in-memory implementations)

All major aggregates have `InMemory*Repository` with `findAll()` **sorted by id** where implemented (verified: `Company`, `Building`, `Market`, `Region`, etc.).

## Content


| Registry                                | Path                      | M8 gap                         |
| --------------------------------------- | ------------------------- | ------------------------------ |
| Worlds, regions, biomes, maps, cities   | `game-content/`           | ✅ 3 regions, 1 world           |
| Resources, buildings, recipes, research | `game-content/`           | ✅ Starter set                  |
| Transport routes                        | `game-content/logistics/` | ✅ Intra/inter-region via M6–M7 |
| **Strategy definitions**                | —                         | ❌ Missing                      |
| **NPC company seeds**                   | —                         | ❌ Missing                      |
| **Regional market config**              | —                         | ❌ Missing (global market only) |




## Persistence


| Item                 | Status                                                                         |
| -------------------- | ------------------------------------------------------------------------------ |
| `GameSaveSnapshotV2` | World metadata, building `regionId`, transport regions, `marketRegionMappings` |
| Migration            | Central v1→v2 in `GameStateSerializer.parse()`                                 |
| AI state fields      | ❌ Not present                                                                  |
| `TickHistoryService` | Optional per-company dashboard metrics in save; **not** market history         |


---



# Reusable Components

M8 must reuse these; do **not** replace.


| Component                                                           | Reuse pattern                                                              |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `Company` aggregate                                                 | NPC companies = same aggregate, different `ownerId` / future `CompanyType` |
| `CreateCompanyUseCase` + sibling use cases                          | AI actions **must** call same use cases as player (M8 plan §59)            |
| `MarketTradeService` + `BuyResourceUseCase` / `SellResourceUseCase` | Instant trade pipeline; extend for regional market selection               |
| `MarketSimulationSystem` + price calculators                        | Extend for per-region supply/demand                                        |
| `TransportLogisticsService`                                         | Cross-region AI logistics; no AI-only transport                            |
| `PlaceBuildingUseCase`                                              | Expansion/construction decisions                                           |
| `StartProductionUseCase`                                            | Production decisions (already region-resource aware)                       |
| `StartResearchUseCase`                                              | Research decisions                                                         |
| `SimulationEngine` + `EventQueue`                                   | Single loop; add systems, not duplicate                                    |
| `GameStateSerializer`                                               | Extend to V3 with migration boundary                                       |
| `WorldBootstrapService` + region repos                              | Regional context for AI and markets                                        |
| `SupplyContract` + `ContractSimulationSystem`                       | Keep as stabilizer layer (DD-018 contract market)                          |


---



# Missing Components

Verified **absent** from `src/` (grep + glob, 2026-07-19):


| M8 concept                               | Status    |
| ---------------------------------------- | --------- |
| `CompanyBrain`                           | ❌ Missing |
| `Strategy` / strategy profiles           | ❌ Missing |
| `Goal` system                            | ❌ Missing |
| `DecisionQueue`                          | ❌ Missing |
| `Knowledge` model                        | ❌ Missing |
| `Memory` model                           | ❌ Missing |
| `MarketHistory` / regional price history | ❌ Missing |
| Regional markets (one per region)        | ❌ Missing |
| Autonomous NPC company bootstrap         | ❌ Missing |
| `CompanyBrainRepository`                 | ❌ Missing |
| `StrategyRepository`                     | ❌ Missing |
| `DecisionQueueRepository`                | ❌ Missing |
| `MarketHistoryRepository`                | ❌ Missing |
| Planning simulation systems              | ❌ Missing |
| `CompanyBankrupt` domain event           | ❌ Missing |
| `DecisionQueued`, `GoalCreated`, etc.    | ❌ Missing |
| Strategy content loaders                 | ❌ Missing |
| Multi-company session orchestration      | ❌ Missing |


---



# Partially Implemented Components


| Concept                       | Current state                                                                                           | M8 gap                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **NPC economy**               | `SupplyContract` (`NPC_PURCHASE`) + `ContractSimulationSystem`                                          | Scripted stabilizer, not autonomous competitor                 |
| **Market**                    | Global instant price book + interval supply/demand adjustment                                           | No regions, no order book, no transaction history aggregate    |
| **Company lifecycle**         | `CompanyStatus.BANKRUPT` enum, no transitions                                                           | Bankruptcy simulation not implemented                          |
| **Company tick processing**   | `CompanySimulationSystem` iterates companies, no-op                                                     | Intended hook for M8 planning                                  |
| **Market history**            | `TickHistoryService` stores dashboard KPI snapshots including `marketPrices` for **one active company** | Not simulation-grade regional market history                   |
| **Regional market mapping**   | Save V2 `marketRegionMappings`: `market_global` → `region_default`                                      | Placeholder for M8 regional markets (TD-M7-01)                 |
| **World-aware companies**     | Buildings have `regionId`; company has no home region                                                   | M8 expansion needs company↔region policy                       |
| **DD-018 multi-layer market** | Player instant trade + contract layer partially present                                                 | NPC economy layer and order-book player market not implemented |


---



# Duplicate Concepts


| Risk                               | Finding                                                  | Resolution                                                                                                        |
| ---------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Second company model               | None found                                               | Keep single `Company` aggregate                                                                                   |
| Second market                      | None found                                               | Extend `Market` with `regionId` or region-keyed instances — do not add parallel price store                       |
| Second inventory/finance/transport | None found                                               | Reuse per-company repos                                                                                           |
| NPC contract vs NPC company        | `SupplyContract` ≠ autonomous company                    | Keep both; contracts remain stabilizer, companies compete via same use cases                                      |
| Tick metrics vs market history     | `TickHistoryService` overlaps M8 “market history” naming | Separate aggregates: dashboard ring buffer ≠ `MarketHistoryRepository`                                            |
| Planning in use case vs simulation | M8 requires both                                         | Simulation **plans** (queue decisions); application **executes** (use cases) — not duplicate if boundary enforced |


---



# Architecture Conflicts



## 1. Regional markets (M8 plan §24 vs code)


| Source      | Says                                                                                            |
| ----------- | ----------------------------------------------------------------------------------------------- |
| M8 plan §24 | Every region owns exactly one market; stores offers, history, liquidity, indicators             |
| Code        | One `Market` aggregate (`market_global`); instant trade via `MarketTradeService`; no order book |
| M7 save V2  | Maps global market to default region only                                                       |
| DD-018      | Three-layer model (player order book, NPC economy, contracts) — aspirational vs code            |


**Conflict severity:** High for M8-2. Requires ADR before regional market implementation.

## 2. Simulation tick order (M8 plan §55 vs code)


| Source                           | Order                                                        |
| -------------------------------- | ------------------------------------------------------------ |
| M8 plan §55 diagram              | … → Market Systems → **Company Planning** → Production → …   |
| `createDefaultSimulationSystems` | Company (first) → … → Production → Research → **Market** → … |
| M7 gap audit / DD-032            | **Factory order is authoritative**                           |


**Conflict severity:** Medium. M8 planning system placement must be reconciled via ADR (see Simulation Review).

## 3. M8 plan use-case names vs repository

M8 plan lists `ConstructBuildingUseCase`, `CreateTransportRouteUseCase`, `PurchaseResourceUseCase`. Code uses `PlaceBuildingUseCase`, `TransportLogisticsService`, `BuyResourceUseCase`.

**Conflict severity:** Low (documentation only). Map names in M8 plan to existing entry points.

## 4. M8 excluded scope vs existing features

M8 excludes taxation and employment expansion; codebase already has `FinanceSimulationSystem` tax collection and `Employee` aggregate from prior milestones. M8 must **not add new** tax/workforce simulation — existing systems remain.

**Conflict severity:** Low (scope discipline, not code conflict).

## 5. Application layer imports content types

Verified in application (not domain): `StartNewGameUseCase`, `TransportLogisticsService`, `EnergyBalanceService`, `ProductionInventoryService` import `content/*` or `GameContentLoadResult`. Domain layer test-only exception: `Market.test.ts` imports content helpers.

Dependency-rules test enforces domain/simulation boundaries; application→content is **undocumented but established**. M8 should not worsen coupling; inject content via bootstrap/context (existing pattern).

---



# Determinism Review



## Compliant patterns (verified)


| Mechanism                  | Evidence                                                                                                                                      |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Simulation time            | `ManualClock` / `Clock` abstraction; aggregates use `clock.now()`                                                                             |
| System order               | Fixed array in `createDefaultSimulationSystems`                                                                                               |
| Repository iteration       | `findAll()` sorted by id in `InMemoryCompanyRepository`, `InMemoryBuildingRepository`, `InMemoryMarketRepository`, transport/production repos |
| Market prices export       | `Market.getPrices()` sorted by resource id                                                                                                    |
| Transport completion order | `TransportSimulationSystem` sorts by region + order id                                                                                        |
| Event queue                | FIFO append/drain in `EventQueue`                                                                                                             |
| No RNG                     | No `Math.random` / `crypto.random` in `src/`                                                                                                  |
| Save restore order         | Deterministic hydrate sequence in `GameStateSerializer`                                                                                       |




## Findings (document before M8)


| ID   | Location                          | Issue                                                        | M8 impact                                                                          |
| ---- | --------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| D-01 | `GameStateSerializer.serialize()` | `savedAtUtc: new Date().toISOString()` — wall-clock metadata | Acceptable for file metadata; must not affect simulation state                     |
| D-02 | `ConsoleLogger`                   | `new Date().toISOString()` for log timestamps                | Infrastructure only; no simulation impact                                          |
| D-03 | `ProjectGenesisError`             | Default `timestamp: Date.now()`                              | Error diagnostics only                                                             |
| D-04 | `CompanySimulationSystem`         | Iterates `findAll()` (sorted) but no mutations yet           | M8 planning must preserve sorted company iteration                                 |
| D-05 | `MarketSimulationSystem`          | Scans **all** inventories globally for supply aggregation    | Deterministic but O(companies × resources); acceptable at M8 scale if order stable |
| D-06 | `InMemoryEventBus.publishAll`     | Event order depends on enqueue order during tick             | M8 must enqueue AI decision events in stable company/id order                      |
| D-07 | `TickHistoryService`              | Ring buffer mutation order deterministic                     | Not part of core simulation state unless serialized                                |


No non-deterministic collections found in hot simulation paths without subsequent sorting.

---



# Persistence Review



## Current savegame (V2)

Persisted today (`GameSaveSnapshotV2`):

- Simulation metadata (tick, clock, paused)
- World (`activeWorldId`)
- All company-scoped aggregates (companies, buildings, inventories, finance, jobs, employees, contracts, transport)
- Global market prices
- `marketRegionMappings` (global → default region)
- Optional tick metrics history (dashboard)



## M8 must persist (per M8 plan §61)


| State                          | V2 support | Recommendation                                                            |
| ------------------------------ | ---------- | ------------------------------------------------------------------------- |
| Company Brain                  | ❌          | New snapshot section in **V3**                                            |
| Strategy / goals               | ❌          | V3                                                                        |
| Knowledge / memory             | ❌          | V3                                                                        |
| Decision queue                 | ❌          | V3                                                                        |
| Pending plans                  | ❌          | V3                                                                        |
| Regional markets (N instances) | ❌          | Extend `markets[]`; add `regionId` per market in V3                       |
| Market history                 | ❌          | New `marketHistory` or embedded in regional market snapshots              |
| NPC companies                  | ✅          | Same `companies[]` shape; distinguish via `ownerId` or new optional field |




## Integration points


| Layer     | File                                | Change                                                            |
| --------- | ----------------------------------- | ----------------------------------------------------------------- |
| Schema    | `GameSaveSnapshotV3.ts` (new)       | Add brain/strategy/queue/history; required regional market fields |
| Migration | `migrateGameSaveSnapshotV2ToV3.ts`  | Single boundary in `GameStateSerializer.parse()`                  |
| Serialize | `GameStateSerializer.serialize()`   | Include new repos                                                 |
| Hydrate   | `GameStateSerializer.hydrate()`     | Restore + validate against world graph                            |
| Restore   | `restoreApplicationFromSnapshot.ts` | Wire new repositories after bootstrap                             |


**Do not serialize:** planning caches, transient analysis, non-replay-critical derived data.

---



# Performance Risks

Report only — no optimization proposed.


| ID   | Pattern                                                                                                                   | Complexity                                            | Trigger                          |
| ---- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | -------------------------------- |
| P-01 | `MarketSimulationSystem`: for each market price, `aggregateResourceSupply(inventories, resourceId)` scans all inventories | O(markets × resources × companies)                    | Grows with NPC count             |
| P-02 | AI planning evaluating all regions × resources × recipes per company per planning tick                                    | O(companies × regions × recipes)                      | M8-3+ if naïve                   |
| P-03 | `DecisionQueue` drain executing full use-case stack per decision per tick                                                 | O(decisions × use-case cost)                          | High decision volume             |
| P-04 | Cross-region transport route resolution per order                                                                         | Already in M7; scales with transport volume × regions | Monitor with multi-NPC logistics |
| P-05 | Save V3 size with market history arrays                                                                                   | Storage linear in ticks × regions × resources         | Long sessions                    |


At starter content scale (3 regions, few companies) risks are acceptable. Document caps (planning interval, max queued decisions per company) in M8 ADR.

---



# Recommended Implementation Order

Aligns with M8 plan work packages, adjusted for verified repository gaps and ADR gates.


| Phase    | Package      | Prerequisite              | Deliverable                                                                                                |
| -------- | ------------ | ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Gate** | **M8-0**     | M7 complete               | **This report**                                                                                            |
| **ADR**  | **Pre-M8-1** | M8-0 accepted             | ADR: planning pipeline placement in `createDefaultSimulationSystems`                                       |
| 1        | M8-1         | Planning ADR              | `CompanyBrain`, strategy, knowledge, memory, goals; repos; content strategy definitions                    |
| **ADR**  | **Pre-M8-2** | M8-1 domain shapes stable | ADR: regional market model (extend `Market` vs new fields; instant trade vs order book scope for M8)       |
| 2        | M8-2         | Regional market ADR       | N regional markets, bootstrap, regional price formation, `MarketHistoryRepository`                         |
| 3        | M8-3         | M8-2 + use cases          | Operational planning, decision queue, wire to `BuyResource`/`SellResource`/`StartProduction`               |
| 4        | M8-4         | M8-3                      | Financial/expansion planning; `PlaceBuildingUseCase` integration                                           |
| 5        | M8-5         | M8-3                      | Research planning; `StartResearchUseCase` integration                                                      |
| 6        | M8-6         | M8-1–5                    | `CompanyPlanningSystem` (or extend stub), `DecisionExecutionService`, NPC bootstrap, multi-company session |
| **ADR**  | **Pre-M8-7** | M8-6 stable               | Save V3 field contract                                                                                     |
| 7        | M8-7         | Save ADR                  | `GameSaveSnapshotV3`, v2→v3 migration, round-trip tests                                                    |
| 8        | M8-8         | M8-7                      | Integration, determinism, regression, performance baselines                                                |
| 9        | M8-9         | M8-8                      | Gate report, progress sync, milestone closure                                                              |


---



# Required ADR Changes


| ADR                                            | Action                 | Reason                                                                                          |
| ---------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------- |
| **New: DD-0XX Company Brain & Decision Queue** | Create                 | Define aggregates, repos, planning vs execution boundary, event set                             |
| **DD-018**                                     | Amend or companion ADR | Reconcile regional markets + order-book scope with current instant-trade implementation         |
| **DD-032**                                     | Clarify amendment      | Insert planning/execution systems into factory order without breaking M6–M7 ordering invariants |
| **DD-033**                                     | Amend                  | Savegame V3 fields for AI + regional markets + market history                                   |
| **DD-006**                                     | Reference only         | Economic simulation intent aligns with M8; no contradiction if reuse rules followed             |
| **DD-007**                                     | Reference only         | Region-ready building ownership satisfied; regional markets deferred to M8 (TD-M7-01)           |
| **DD-009, DD-027**                             | Reuse                  | Deterministic event-driven tick model remains valid                                             |
| **DD-015**                                     | Reuse                  | Strategy definitions in content; brain state in runtime repos                                   |
| **DD-029**                                     | Reuse                  | Modular monolith boundaries preserved                                                           |


**None required** to replace existing engine or aggregates — extensions only.

---



# Risks


| ID   | Risk                                               | Severity        | Mitigation                                                                       |
| ---- | -------------------------------------------------- | --------------- | -------------------------------------------------------------------------------- |
| R-01 | Regional market redesign breaks M5 instant trade   | High            | ADR before M8-2; incremental: multi-market instant trade first, order book later |
| R-02 | Planning system bypasses use cases                 | High            | Code review gate: AI never writes repos directly (M8 plan §59)                   |
| R-03 | Factory order change breaks determinism tests      | Medium          | Extend `createDefaultSimulationSystems.test.ts` with M8 ordering                 |
| R-04 | Save V3 migration errors                           | Medium          | Central migration + v2 round-trip regression                                     |
| R-05 | Single-company session model blocks NPC visibility | Medium          | Extend `GameSession`/API for multi-company read models before NPC competition UX |
| R-06 | M8 plan prose vs code drift                        | Medium          | Treat IMPLEMENTATION_PROGRESS + ADRs as authority over aspirational M8 sections  |
| R-07 | Performance at scale                               | Low (initially) | Cap decisions per tick; interval-based strategic planning                        |


---



# Open Questions

1. **NPC identity:** Distinguish NPC vs player via `ownerId` prefix (`npc_`*), new `CompanyType` field, or content flag?
2. **Regional market M8 scope:** Full order book (DD-018) in M8, or phase 1 = one instant-trade price book per region (closer to current code)?
3. **Planning tick placement:** End-of-tick planning + start-of-next-tick decision execution vs in-pipeline `CompanyPlanningSystem` after Market?
4. **Strategic vs operational frequency:** Exact tick intervals (must be constants, not wall-clock)?
5. **Bankruptcy:** M8 plan includes `CompanyBankrupt` event — implement status transitions in M8 or defer to M8-4/M8-6?
6. **Multi-company new game:** Seed NPC companies at world bootstrap or dedicated `StartWorldEconomyUseCase`?
7. **Market history retention:** Bounded ring buffer per region/resource vs full tick log (DD-033 replay scope)?

These must be answered in ADRs or M8-1 design notes before corresponding packages ship.

---



# Final Recommendation



## ARCHITECTURE CHANGES REQUIRED

The repository **supports** M8 as an extension of the existing deterministic architecture. No second simulation stack is needed. All M8 AI components are **greenfield** and correctly absent today.

Implementation must **not** start M8-2 (regional markets) or M8-7 (persistence) until the three ADR contracts above are accepted.

**Allowed immediately after planning-pipeline ADR:**

- M8-1 domain aggregates (`CompanyBrain`, strategy, knowledge, memory, goals)
- Repository interfaces + in-memory implementations
- Content strategy definitions (minimal)

**Blocked until regional-market ADR:**

- M8-2 regional market simulation and market history

**Blocked until save V3 ADR:**

- M8-7 serialization/migration

Upon ADR acceptance, status moves to **READY FOR IMPLEMENTATION** for the corresponding work packages.

---



# Appendix: Search Verification Log

Keywords searched in `src/` (2026-07-19):


| Term                                                                    | Matches in production code                                   |
| ----------------------------------------------------------------------- | ------------------------------------------------------------ |
| `CompanyBrain`, `DecisionQueue`, `Strategy`, `Knowledge`, `Memory` (AI) | 0                                                            |
| `SimulationScheduler`, `SimulationContext`                              | 0                                                            |
| `TODO`, `FIXME`, `NotImplemented`                                       | 0                                                            |
| `Math.random`                                                           | 0                                                            |
| `Date.now()` / `new Date()`                                             | 3 non-simulation sites (serializer metadata, logger, errors) |
| `Planner`, `Brain`, `Goal` (AI)                                         | 0                                                            |
| `MarketHistory`                                                         | 0                                                            |
| Regional market beyond mapping                                          | 0                                                            |


Architecture dependency test: `tests/architecture/dependency-rules.test.ts` — domain/simulation layer rules enforced in CI.

---

*End of report.*