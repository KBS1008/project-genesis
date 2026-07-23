# Implementation Progress

Version: 1.0.0

Status: Active

Last Updated: 2026-07-22

---

# Purpose

This document tracks implemented source code against the Project Genesis architecture.

It records what exists in `src/`, which Architecture Decision Records (ADRs) were followed, and what remains planned.

Update this document whenever a meaningful implementation milestone is completed.

---

# Current Status

| Area                             | Status                                                                                                                                                                |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Common foundation                | Implemented                                                                                                                                                           |
| Domain aggregates                | Implemented (Company, Building, Inventory, ProductionJob, FinanceAccount, Market, SupplyContract, CompanyResearch, ResearchJob, CompanyMilestones, Employee, **CompanyBrain**) |
| Domain value objects             | Partial (Money, Quantity, ResourceAmount, Capacity, Position)                                                                                                         |
| Domain specifications & policies | Partial (foundation + production/market/employee rules)                                                                                                               |
| Content loaders                  | Partial (ResourceType, BuildingType, Recipe, Technology, Milestone, Employee, TransportRoute, **StrategyDefinition**)                                              |
| Simulation                       | Partial (SimulationEngine, systems pipeline incl. regional market, company planning/execution, contracts, payroll, tax, inflation dampening)                          |
| Infrastructure                   | Partial (in-memory repositories incl. **CompanyBrain**, JSON savegames V3 on disk; employees, supply contracts, tick metrics history)   |
| Application layer                | Implemented (bootstrap, use cases, queries, dashboard facade, tutorial progress)                                                                                      |
| UI                               | Partial (Next.js dashboard dev shell; M9 Gate 0 audit complete — navigation/screens pending) |
| M9 User Interface                | 🟡 In Progress (Gate 0 ✅ · Phase 1–3 ✅) |
| Energy system                    | Partial (balance service, production gating, baseline grid)                                                                                                           |
| Transport / logistics            | ✅ M6 completed — capacities, route durations, throughput queue (DD-022)                                                                                              |
| World simulation                 | ✅ M7 completed — regions, map, biomes, cities, regional resources, save V2 (AUD-005)                                                                               |
| M4 Core Gameplay                 | Completed                                                                                                                                                             |
| M5 Economy                       | Completed                                                                                                                                                             |
| M6 Logistics                     | ✅ Completed (Gate AUD-004, 2026-07-19)                                                                                                                               |
| M7 World Simulation              | ✅ Completed (Gate AUD-005, 2026-07-19)                                                                                                                               |
| M8 NPC Economy                   | ✅ Completed (Gate AUD-006, 2026-07-22) |
| Phase 1 Core Domain              | ✅ Completed (Gate 2026-07-19) — see `PHASE1_CORE_DOMAIN_REPORT.md`                                                                                                   |

**Tests:** 588 (run `pnpm test` for current count)

---

# Release Progress (M1 → M12)

Trackable estimate of progress toward **Release 1.0** (`MILESTONE_PLAN.md`).

**Last calculated:** 2026-07-22 · **Commit:** uncommitted (Phase 9 local)

## Summary

| Metric                         |    Value | Notes                                                     |
| ------------------------------ | -------: | --------------------------------------------------------- |
| **Release progress (primary)** | **79 %** | Average of milestone completion % (see below)             |
| Deliverable work invested      |     73 % | Average including partial pre-work (e.g. dashboard in M9) |
| Playable prototype readiness   |    ~85 % | M1–M7 core + M8 planning loop; not a release metric       |
| Milestones completed           |   7 / 12 | M1, M2, M4, M5, M6, M7, M8                                    |
| Milestones in progress         |   2 / 12 | M3, M9                                                |
| Tests                          |      588 | `pnpm test`                                               |

**Primary formula:**

```text
Release % = sum(milestone_completion_%) / 12
```

Update deliverable rows when a step ships; set milestone % to the **average of its deliverable rows**, or **100** when exit criteria are met and the milestone is closed in `MILESTONE_PLAN.md`.

## Milestone Rollup

| MS  | Name                   | Status         |     MS % |    Weight | Contribution |
| --- | ---------------------- | -------------- | -------: | --------: | -----------: |
| M1  | Foundation             | ✅ Completed   |      100 |     8,3 % |        8,3 % |
| M2  | Architecture           | ✅ Completed   |      100 |     8,3 % |        8,3 % |
| M3  | Governance & Standards | 🟡 In Progress |       85 |     8,3 % |        7,1 % |
| M4  | Core Gameplay          | ✅ Completed   |      100 |     8,3 % |        8,3 % |
| M5  | Economy                | ✅ Completed   |      100 |     8,3 % |        8,3 % |
| M6  | Logistics              | ✅ Completed   |      100 |     8,3 % |        8,3 % |
| M7  | World Simulation       | ✅ Completed   |      100 |     8,3 % |        8,3 % |
| M8  | NPC Economy            | ✅ Completed   |      100 |     8,3 % |        8,3 % |
| M9  | User Interface         | 🟡 In Progress |       65 |     8,3 % |        5,4 % |
| M10 | Content Expansion      | ⚪ Planned     |       10 |     8,3 % |        0,8 % |
| M11 | Polish                 | ⚪ Planned     |        0 |     8,3 % |          0 % |
| M12 | Release                | ⚪ Planned     |        0 |     8,3 % |          0 % |
|     | **Total**              |                | **76 %** | **100 %** |     **76 %** |

\*M9 is officially planned; dashboard, charts, tutorial and WebSocket from M4/M5 count as pre-work in the deliverable matrix below.

## Deliverable Matrix

### M1 – Foundation ✅ (100 %)

| Deliverable               |       % | Evidence                    |
| ------------------------- | ------: | --------------------------- |
| Repository / Monorepo     |     100 | Git repo, pnpm workspaces   |
| Build system / TypeScript |     100 | `pnpm build`, `tsc`, Vitest |
| Tooling                   |     100 | ESLint, CI hooks            |
| Documentation structure   |     100 | `docs/` tree, ADRs          |
| **Milestone average**     | **100** | Closed                      |

### M2 – Architecture ✅ (100 %)

| Deliverable                     |       % | Evidence                                      |
| ------------------------------- | ------: | --------------------------------------------- |
| Clean Architecture / DDD layers |     100 | `src/domain`, `application`, `infrastructure` |
| Repository pattern              |     100 | Domain repository ports + in-memory impl      |
| Event system                    |     100 | `DomainEvent`, `SimulationEngine` queue       |
| CQRS lite                       |     100 | Use cases + query handlers                    |
| Simulation architecture         |     100 | `SimulationEngine`, systems pipeline          |
| **Milestone average**           | **100** | AUD-001                                       |

### M3 – Governance & Standards 🟡 (85 %)

| Deliverable                                    |      % | Evidence                                  |
| ---------------------------------------------- | -----: | ----------------------------------------- |
| Project quality / roadmap / milestone plan     |     95 | `docs/project-management/*`               |
| Release & quality gates                        |     85 | `QUALITY_GATES.md`, metrics               |
| Error / logging / validation / result patterns |     90 | Implemented + docs                        |
| Testing & dependency rules                     |     85 | `TESTING_STRATEGY.md`, architecture tests |
| Cursor rules alignment                         |     60 | Partial; ongoing                          |
| **Milestone average**                          | **85** | Exit criteria not formally closed         |

### M4 – Core Gameplay ✅ (100 %)

| Deliverable                       |       % | Evidence                             |
| --------------------------------- | ------: | ------------------------------------ |
| Companies / buildings / resources |     100 | Domain + content loaders             |
| Recipes / production              |     100 | `ProductionJob`, simulation system   |
| Warehouses (phase 1)              |     100 | `BuildingStorage`, inbound transport |
| Employees / research / finance    |     100 | Full loops + savegame                |
| Save / load                       |     100 | `GameStateSerializer`, schema v1     |
| **Milestone average**             | **100** | M4 closure report                    |

### M5 – Economy ✅ (100 %)

| Deliverable                      |       % | Evidence                               |
| -------------------------------- | ------: | -------------------------------------- |
| Dynamic prices / supply & demand |     100 | M5-1, `MarketPriceCalculator`          |
| Trading / market fees            |     100 | M5-3, `MarketFeePolicy`                |
| Taxes / contracts / inflation    |     100 | M5-4, finance + contract systems       |
| Dashboard economy UX             |     100 | M5-2, KPIs, charts, Wirtschaft section |
| **Milestone average**            | **100** | AUD-003                                |

### M6 – Logistics ✅ (100 %)

| Deliverable                  |       % | Evidence                                                            |
| ---------------------------- | ------: | ------------------------------------------------------------------- |
| Capacities                   |     100 | M6-1 ✅ `storageCapacity`, enforcement, dashboard                   |
| Warehouses                   |     100 | Phase-1 storage + inbound transport (multi-warehouse routing → M7+) |
| Transport routes             |     100 | M6-2 ✅ content routes, duration policy, dashboard                  |
| Networks                     |     100 | M6-3 ✅ `throughputCapacity`, WAITING queue, FIFO dispatch          |
| Vehicles                     |     100 | DD-022 V1 waiver — schema/art docs; no sim entities (AUD-004)       |
| **Milestone average (gate)** | **100** | Gate review `M6_LOGISTICS_GATE_REVIEW_REPORT.md`                    |
| **Deliverable average**      | **100** |                                                                     |

### M7 – World Simulation ✅ (100 %)

| Deliverable             |     % | Evidence                                                                 |
| ----------------------- | ----: | ------------------------------------------------------------------------ |
| Regions / map / biomes  |     100 | M7-1–M7-4: content loaders, `WorldBootstrapService`, queries, policies   |
| Infrastructure / cities |     100 | Cities + map connectivity; biome/route modifiers (no infra platform)       |
| Regional resources      |     100 | M7-5 Option A; `GetRegionalResourcesQuery`, production eligibility       |
| Transport integration   |     100 | M7-6 cross-region routes, deterministic ordering                         |
| Persistence / queries   |     100 | M7-7 save V2 + migration; M7-8 overview/region queries + minimal API     |
| **Milestone average (gate)** | **100** | Gate review `M7_WORLD_SIMULATION_GATE_REVIEW_REPORT.md` (AUD-005)   |

### M8 – NPC Economy ✅ (100 %)

| Deliverable                         |     % | Evidence                                                                 |
| ----------------------------------- | ----: | ------------------------------------------------------------------------ |
| Company Brain foundation (M8-1)     |     100 | `src/domain/brain/**`, `CompanyBrainRepository`, domain events           |
| Strategy content (M8-1)             |     100 | `game-content/strategies/`, `StrategyLoader`, `Strategy.schema.md`       |
| Regional markets (M8-2)             |     100 | Extended `Market`, `MarketRegionalSupplyAggregator`, `MarketPriceSeeder` |
| Planning pipeline (M8-3)            |     100 | `CompanyPlanningPipeline`, observer/analyser/goal/decision planners      |
| Decision execution (M8-5)           |     100 | `CompanyDecisionExecutionService` → existing use cases incl. `EXPAND_REGION` |
| Simulation integration (M8-6)       |     100 | `CompanyPlanningSystem`, tick order, domain ports                        |
| Expansion / production / research   |     100 | Cross-region expansion, liquidity/cost goals, production/research planning |
| Brain persistence V3 (M8-7)         |     100 | `GameSaveSnapshotV3`, V2→V3 migration, serializer V3                     |
| Gate review / test matrix (M8-8/9)  |     100 | `docs/quality/M8_IMPLEMENTATION_REPORT.md` (AUD-006); 567 tests          |
| **Milestone average (gate)**        | **100** | Gate report **PASSED** — milestone closed                                  |

### M8 known gaps (closed in Phase 9)

All **TD-M8-01 … TD-M8-06** resolved — see `docs/quality/M8_IMPLEMENTATION_REPORT.md` and `TECHNICAL_DEBT_REGISTER.md`.

### M9 – User Interface 🟡 (~65 % · Gate 0 ✅ · Phase 1–3 ✅ · Consolidation ✅)

| Deliverable                         |     % | Evidence                                                                 |
| ----------------------------------- | ----: | ------------------------------------------------------------------------ |
| Gate 0 architecture review (M9-0)   |     100 | `docs/architecture/reviews/M9_ARCHITECTURE_REVIEW_REPORT.md`             |
| Gate 1 foundation consolidation     |     100 | `docs/architecture/reviews/M9_FOUNDATION_CONSOLIDATION_REPORT.md`        |
| Presentation ADR (DD-038)           |     100 | `docs/decisions/DD-038-Presentation-Architecture.md`                     |
| Presentation foundation (M9-1)    |     100 | shell, primitives, notifications, UI test harness                        |
| Navigation & UI state (M9-2)        |     100 | primary nav, URL state, dialogs, `GameWorkspaceProvider`                 |
| Query adapters / view-data (M9-3)   |     100 | `presentation/adapters/` query clients, mappers, screen queries          |
| Company screen (consolidated)       |      85 | `CompanyDashboardScreen` — section split deferred post-Phase 4           |
| Main menu / save-load UX (M9-4)     |      90 | Main menu, new/load/save flows, API round-trip test                      |
| Simulation controls (pause/speed)   |       0 | **Next:** Phase 5                                                         |
| Accessibility baseline              |      25 | Menu + save dialogs; full audit in Phase 10                              |
| **Milestone average (gate)**        |  **72** | Phase 4 main menu/save-load complete                                     |

**Post-Phase 4 deferred (non-blocking):** `CompanyDashboardScreen` section split, legacy chart migration, optional per-domain queries for company tables, removal of unused `DashboardDetailPanel.tsx`.

### M10 – Content Expansion ⚪ (10 %)

| Deliverable                     |      % | Evidence                                     |
| ------------------------------- | -----: | -------------------------------------------- |
| Buildings / resources / recipes |     25 | Starter set in `game-content/`               |
| Technologies / employees        |     15 | Loaders + small catalog                      |
| Industries / scenarios          |      0 | Not started                                  |
| Vehicles (content)              |      5 | `Vehicle.schema.md`, art library docs        |
| Content pipeline / registry     |     20 | Loaders, validation; global registry partial |
| **Milestone average**           | **10** |                                              |

### M11 – Polish ⚪ (0 %)

| Deliverable                  |     % | Next step     |
| ---------------------------- | ----: | ------------- |
| Animations / effects / audio |     0 | Art docs only |
| Localization / balancing     |     0 | Not started   |
| Optimization pass            |     0 | Not started   |
| **Milestone average**        | **0** | After M9–M10  |

### M12 – Release ⚪ (0 %)

| Deliverable                               |     % | Next step                         |
| ----------------------------------------- | ----: | --------------------------------- |
| Release candidate / QA approval           |     0 | Not started                       |
| Final documentation                       |     0 | Partial                           |
| Stable savegames / performance validation |     0 | v1 saves exist; release gate open |
| **Milestone average**                     | **0** | Final gate                        |

## Maintenance

When completing a milestone step:

1. Update the deliverable **%** and **Evidence** column.
2. Recompute milestone **%** (average of deliverables, or 100 on formal closure).
3. Update **Release progress (primary)** = sum of milestone % ÷ 12.
4. Update **Last calculated** date and commit hash in this section.
5. Sync `MILESTONE_PLAN.md` status and add a row under **Recently Completed** below.

---

# Implemented Components

## Common Module (`src/common/`)

Foundation building blocks shared across the project.

| Component               | Path                         | Description                                   |
| ----------------------- | ---------------------------- | --------------------------------------------- |
| `Identifier<T>`         | `core/Identifier.ts`         | Strongly typed, immutable global identifiers  |
| `Entity<TBrand>`        | `core/Entity.ts`             | Base class for identity-based domain objects  |
| `ValueObject`           | `core/ValueObject.ts`        | Base class for immutable value-based equality |
| `AggregateRoot<TBrand>` | `core/AggregateRoot.ts`      | Entity with domain event collection           |
| `Result<T>`             | `result/Result.ts`           | Explicit success/failure handling             |
| `DomainEvent`           | `events/DomainEvent.ts`      | Immutable domain event base class             |
| `IEventBus`             | `events/IEventBus.ts`        | Event bus contract for domain event dispatch  |
| `InMemoryEventBus`      | `events/InMemoryEventBus.ts` | Deterministic in-process event bus            |
| `DomainError`           | `errors/DomainError.ts`      | Structured domain error base class            |
| `ValidationError`       | `errors/ValidationError.ts`  | Validation-specific domain error              |
| `Guard`                 | `validation/Guard.ts`        | Shared validation helpers returning `Result`  |
| `Clock`                 | `time/Clock.ts`              | Time abstraction interface                    |
| `ManualClock`           | `time/ManualClock.ts`        | Deterministic clock for tests and simulation  |

### Design decisions

- Identifiers use phantom generic branding (`Identifier<'Company'>`).
- Expected failures return `Result` instead of throwing exceptions.
- Domain events receive simulation time from `Clock` (never `Date.now()`).
- `Identifier.create()` uses `Result<Identifier<T>, IdentifierValidationError>`.

### ADRs

- DD-003 – Global Identifiers
- DD-009 – Deterministic Simulation
- DD-027 – Event-Driven Simulation Architecture

---

## Domain Module (`src/domain/`)

Business aggregates and domain events.

### Company aggregate

| Item         | Path                                             |
| ------------ | ------------------------------------------------ |
| Aggregate    | `company/Company.ts`                             |
| Identifiers  | `company/CompanyId.ts` (`CompanyId`, `PlayerId`) |
| Status enum  | `company/CompanyStatus.ts`                       |
| Domain event | `company/events/CompanyFounded.ts`               |
| Tests        | `company/Company.test.ts`                        |

**Behaviour:**

- Factory: `Company.create()` validates name via `Guard`, reads `foundedAt` from `Clock`.
- Initial status: `ACTIVE`.
- Raises `CompanyFounded` on creation.

**References:** `docs/schemas/Company.Schema.md`, `docs/architecture/domain-model.md`

### Building aggregate

| Item         | Path                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| Aggregate    | `building/Building.ts`                                                                                    |
| Identifiers  | `building/BuildingId.ts` (`BuildingId`, `BuildingTypeId`)                                                 |
| Value object | `building/Position.ts`                                                                                    |
| Status enum  | `building/BuildingStatus.ts`                                                                              |
| Domain event | `building/events/BuildingPlaced.ts`, `BuildingConstructionStarted.ts`, `BuildingConstructionCompleted.ts` |
| Tests        | `building/Building.test.ts`                                                                               |

**Behaviour:**

- Factory: `Building.create()` validates name and non-negative coordinates.
- References static type via `buildingTypeId` (content definition).
- Owned by company via `companyId`.
- Initial status: `PLANNED`, level `1`.
- `beginConstruction(duration, clock)` transitions to `UNDER_CONSTRUCTION` or immediately `ACTIVE` when duration is zero.
- `tickConstruction(clock)` advances progress; completion raises `BuildingConstructionCompleted`.
- Raises `BuildingPlaced` on creation.

**References:** DD-014 (template vs instance), DD-015 (static vs dynamic), `docs/schemas/Building.schema.md`

### Inventory aggregate

| Item          | Path                                   |
| ------------- | -------------------------------------- |
| Aggregate     | `inventory/Inventory.ts`               |
| Identifiers   | `inventory/InventoryId.ts`             |
| Status enum   | `inventory/InventoryStatus.ts`         |
| Item snapshot | `inventory/InventoryItem.ts`           |
| Domain event  | `inventory/events/InventoryChanged.ts` |
| Repository    | `inventory/InventoryRepository.ts`     |
| Tests         | `inventory/Inventory.test.ts`          |

**Behaviour:**

- `Inventory.create()` — empty inventory per company.
- `addQuantity()` / `reserveQuantity()` / `removeQuantity()` / `releaseReserved()` / `consumeReserved()` — non-negative validation, `InventoryChanged` events; zero-quantity lines are removed after consumption.

**References:** `docs/schemas/Inventory.Schema.md`

### Employee aggregate

| Item          | Path                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| Aggregate     | `employee/Employee.ts`                                                                                   |
| Identifiers   | `employee/EmployeeId.ts` (`EmployeeId`, `EmployeeTypeId`)                                                |
| Status enum   | `employee/EmployeeStatus.ts`                                                                             |
| Domain events | `employee/events/EmployeeHired.ts`, `EmployeeAssignedToBuilding.ts`, `EmployeeUnassignedFromBuilding.ts` |
| Repository    | `employee/EmployeeRepository.ts`                                                                         |
| Tests         | `employee/Employee.test.ts`                                                                              |

**Behaviour:**

- `Employee.hire()` — validates display name, salary > 0, productivity > 0; raises `EmployeeHired`.
- `assignToBuilding()` / `unassignFromBuilding()` — single building assignment; raises assignment events.
- `restore()` — rehydrates persisted state without domain events.
- Salary and productivity are supplied by the application layer from static content definitions.

**References:** `docs/schemas/Employee.schema.md`, `docs/gameplay/employees.md`, `docs/architecture/domain-model.md`

### ProductionJob aggregate

| Item          | Path                                                               |
| ------------- | ------------------------------------------------------------------ |
| Aggregate     | `production/ProductionJob.ts`                                      |
| Identifiers   | `production/ProductionJobId.ts`, `production/RecipeId.ts`          |
| Status enum   | `production/ProductionJobStatus.ts`                                |
| Domain events | `production/events/ProductionStarted.ts`, `ProductionCompleted.ts` |
| Repository    | `production/ProductionJobRepository.ts`                            |
| Tests         | `production/ProductionJob.test.ts`                                 |

**Behaviour:**

- `ProductionJob.create()` — waiting job with recipe duration from application layer.
- `start()` / `tick()` — progress 0–100, completes with `ProductionCompleted`.

**References:** DD-011, `docs/schemas/Production.Schema.md`

### FinanceAccount aggregate

| Item                 | Path                                                                          |
| -------------------- | ----------------------------------------------------------------------------- |
| Aggregate            | `finance/FinanceAccount.ts`                                                   |
| Identifiers          | `finance/FinanceAccountId.ts`, `finance/FinanceTransactionId.ts`              |
| Transaction snapshot | `finance/FinanceTransaction.ts`                                               |
| Enums                | `finance/FinanceTransactionType.ts`, `finance/FinanceTransactionDirection.ts` |
| Constants            | `finance/FinanceConstants.ts` (`STARTING_MONEY`), `finance/TaxConstants.ts`   |
| Tax                  | `finance/TaxCalculator.ts`                                                    |
| Domain events        | `finance/events/FinanceAccountCreated.ts`, `FinanceTransactionRecorded.ts`    |
| Repository           | `finance/FinanceRepository.ts`                                                |
| Tests                | `finance/FinanceAccount.test.ts`                                              |

**Behaviour:**

- `FinanceAccount.create()` — account per company with `STARTING_MONEY` (100,000 GC) and initial SYSTEM credit transaction.
- `credit()` / `debit()` / `reserveCash()` / `releaseReserved()` / `consumeReserved()` — all balance changes recorded as transactions; debits fail when available cash is insufficient.
- `closeTaxPeriod()` — marks end of a corporate tax assessment window via `lastTaxCollectedAt`.
- `TaxCalculator` — computes taxable profit and flat corporate tax on ledger entries since the last assessment.

**References:** `docs/schemas/Finance.Schema.md`, `docs/schemas/FinanceTransaction.Schema.md`, `docs/gameplay/economy.md`

### SupplyContract aggregate

| Item        | Path                                   |
| ----------- | -------------------------------------- |
| Aggregate   | `contract/SupplyContract.ts`           |
| Identifiers | `contract/SupplyContractId.ts`         |
| Constants   | `contract/SupplyContractConstants.ts`  |
| Repository  | `contract/SupplyContractRepository.ts` |
| Tests       | `contract/SupplyContract.test.ts`      |

**Behaviour:**

- `createStarterNpcWoodPurchase()` — seeds the documented NPC wood buy contract (5 units / 125 GC / 20 ticks).
- `shouldFulfill()` / `markFulfilled()` — interval-based fulfillment guard.

**References:** `docs/gameplay/economy.md`, `docs/gameplay/market.md`

### Market aggregate

| Item             | Path                                                                                                                                                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aggregate        | `market/Market.ts`                                                                                                                                                                                             |
| Identifiers      | `market/MarketId.ts`                                                                                                                                                                                           |
| Price snapshot   | `market/ResourceMarketPrice.ts`                                                                                                                                                                                |
| Constants        | `market/MarketConstants.ts` (`createRegionalMarketId`, legacy `GLOBAL_MARKET_ID`)                                                                                                                              |
| Price history    | `market/MarketPriceHistoryEntry.ts`                                                                                                                                                                            |
| Regional stats   | `market/MarketRegionalStatistics.ts`, `market/MarketRegionalSupplyAggregator.ts`                                                                                                                               |
| Price simulation | `market/MarketPriceCalculator.ts`, `market/MarketPriceConstants.ts`, `market/MarketPressureCalculator.ts`, `market/MarketRegionalSupplyAggregator.ts`, `market/InflationCalculator.ts`, `market/InflationConstants.ts` |
| Read projection  | `read-models/projectMarketPrice.ts`, `read-models/EconomyReadModel.ts`                                                                                                                                         |
| Domain event     | `market/events/MarketPriceChanged.ts`                                                                                                                                                                          |
| Repository       | `market/MarketRepository.ts` (incl. `findByRegionId`)                                                                                                                                                          |
| Tests            | `market/Market.test.ts`                                                                                                                                                                                        |

**Behaviour:**

- `Market.seedFromResources()` — regional price book per enabled region; `lastPrice` starts at `basePrice`.
- `updateLastPrice()` / `updateSupplyDemand()` — records price changes, liquidity, embedded price history (limit 100), emits `MarketPriceChanged`.
- `MarketPriceSeeder` seeds one market per enabled region during bootstrap (`market_{regionId}`).
- `MarketTradeService` executes instant regional buy/sell; legacy `market_global` fallback for old saves.
- `MarketSimulationSystem` updates all regional markets from building-storage supply and baseline demand.
- Instant trade only — no order book (DD-018 deferred).

**References:** `docs/gameplay/market.md`, `docs/gameplay/economy.md`, DD-018

### Shared value objects

| Item             | Path                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| `Money`          | `shared/Money.ts`                                                                                             |
| `Quantity`       | `shared/Quantity.ts`                                                                                          |
| `ResourceAmount` | `shared/ResourceAmount.ts`                                                                                    |
| `ResourceTypeId` | `shared/ResourceTypeId.ts`                                                                                    |
| `Capacity`       | `shared/Capacity.ts`                                                                                          |
| Tests            | `shared/Money.test.ts`, `shared/Quantity.test.ts`, `shared/ResourceAmount.test.ts`, `shared/Capacity.test.ts` |

**Behaviour:**

- `Money.create()` — non-negative amount, non-empty currency (default `GC`).
- `Quantity.create()` — non-negative count.
- `ResourceAmount.create()` — resource type id + non-negative amount.
- `Capacity.create()` — non-negative capacity limit (zero for unused dimensions per DD-021).
- All types extend `ValueObject` with structural equality and immutability.

**References:** `docs/schemas/Finance.Schema.md`, `docs/schemas/Inventory.Schema.md`, `docs/decisions/DD-021-Unified-Building-Capacity-Model.md`, `docs/architecture/domain-model.md`

### Repository interfaces

| Item                       | Path                                    |
| -------------------------- | --------------------------------------- |
| `CompanyRepository`        | `company/CompanyRepository.ts`          |
| `BuildingRepository`       | `building/BuildingRepository.ts`        |
| `InventoryRepository`      | `inventory/InventoryRepository.ts`      |
| `ProductionJobRepository`  | `production/ProductionJobRepository.ts` |
| `FinanceRepository`        | `finance/FinanceRepository.ts`          |
| `MarketRepository`         | `market/MarketRepository.ts`            |
| `CompanyBrainRepository`   | `brain/CompanyBrainRepository.ts`     |
| `SupplyContractRepository` | `contract/SupplyContractRepository.ts`  |
| `EmployeeRepository`       | `employee/EmployeeRepository.ts`        |

Persistence contracts for aggregate roots. Implementations belong in Infrastructure.

### Domain services and ports

| Item                           | Path                                       |
| ------------------------------ | ------------------------------------------ |
| `EmployeeAllocationCalculator` | `employee/EmployeeAllocationCalculator.ts` |
| `EmployeeAllocationPort`       | `employee/EmployeeAllocationPort.ts`       |
| `EmployeePayrollConstants`     | `employee/EmployeePayrollConstants.ts`     |
| `EnergyBalancePort`            | `energy/EnergyBalancePort.ts`              |

### Specifications and policies

| Item                                  | Path                                                                                                                          |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `Specification<TCandidate, TContext>` | `specifications/Specification.ts`                                                                                             |
| `AndSpecification`                    | `specifications/AndSpecification.ts`                                                                                          |
| `BuildingSupportsRecipeSpecification` | `specifications/production/BuildingSupportsRecipeSpecification.ts`                                                            |
| `RequiredResearchSpecification`       | `specifications/research/RequiredResearchSpecification.ts`                                                                    |
| `RequiredMilestonesSpecification`     | `specifications/research/RequiredMilestonesSpecification.ts`                                                                  |
| `BuildingPrerequisitesSpecification`  | `specifications/building/BuildingPrerequisitesSpecification.ts`                                                               |
| `EmployeePrerequisitesSpecification`  | `specifications/employee/EmployeePrerequisitesSpecification.ts`                                                               |
| `RequiredBuildingTypesSpecification`  | `specifications/employee/RequiredBuildingTypesSpecification.ts`                                                               |
| `ResourceListedOnMarketSpecification` | `specifications/market/ResourceListedOnMarketSpecification.ts`                                                                |
| `Policy<TContext, TDecision>`         | `policies/Policy.ts`                                                                                                          |
| `ConstructionCostPolicy`              | `policies/building/ConstructionCostPolicy.ts`                                                                                 |
| `InstantTradePricingPolicy`           | `policies/market/InstantTradePricingPolicy.ts`                                                                                |
| `MarketFeePolicy`                     | `policies/market/MarketFeePolicy.ts`                                                                                          |
| Tests                                 | `specifications/**/*.test.ts`, `policies/**/*.test.ts`, `finance/TaxCalculator.test.ts`, `market/InflationCalculator.test.ts` |

**Behaviour:**

- Specifications return `Result<void, ValidationError>` for composable eligibility checks.
- Policies return typed decisions (e.g. unit price, construction cost) from context snapshots.
- Application layer passes content-derived context; domain does not import `src/content/`.
- `StartProductionUseCase` uses `BuildingSupportsRecipeSpecification` and `RequiredResearchSpecification`.
- `PlaceBuildingUseCase` uses `BuildingPrerequisitesSpecification` and debits `constructionCost` via `ConstructionCostPolicy`.
- `HireEmployeeUseCase` uses `EmployeePrerequisitesSpecification` and debits `cost` as `RECRUITMENT_COST`.
- `MarketTradeService` uses `ResourceListedOnMarketSpecification` and `InstantTradePricingPolicy`.

**References:** `src/domain/readme.md`

### CompanyResearch aggregate

| Item         | Path                                                        |
| ------------ | ----------------------------------------------------------- |
| Aggregate    | `research/CompanyResearch.ts`                               |
| Identifiers  | `research/CompanyResearchId.ts`, `research/TechnologyId.ts` |
| Domain event | `research/events/TechnologyCompleted.ts`                    |
| Repository   | `research/CompanyResearchRepository.ts`                     |
| Tests        | `research/CompanyResearch.test.ts`                          |

**Behaviour:**

- `CompanyResearch.create()` — empty completed-technology set per company.
- `completeTechnology()` — permanently records a completed technology id.
- Created alongside company, inventory and finance in `CreateCompanyUseCase`.
- Persisted in savegame snapshots as `companyResearch`.

### ResearchJob aggregate

| Item          | Path                                                         |
| ------------- | ------------------------------------------------------------ |
| Aggregate     | `research/ResearchJob.ts`                                    |
| Identifiers   | `research/ResearchJobId.ts`                                  |
| Status        | `research/ResearchJobStatus.ts`                              |
| Domain events | `research/events/ResearchStarted.ts`, `ResearchCompleted.ts` |
| Repository    | `research/ResearchJobRepository.ts`                          |
| Tests         | `research/ResearchJob.test.ts`                               |

**Behaviour:**

- Timed research effort for one technology per company.
- `StartResearchUseCase` debits `researchCost`, starts job; simulation ticks progress.
- On completion, `ResearchCompletionService` invokes `CompleteTechnologyUseCase`.

### CompanyMilestones aggregate

| Item         | Path                                                           |
| ------------ | -------------------------------------------------------------- |
| Aggregate    | `milestone/CompanyMilestones.ts`                               |
| Identifiers  | `milestone/CompanyMilestonesId.ts`, `milestone/MilestoneId.ts` |
| Domain event | `milestone/events/CompanyMilestoneReached.ts`                  |
| Repository   | `milestone/CompanyMilestonesRepository.ts`                     |
| Tests        | `milestone/CompanyMilestones.test.ts`                          |

**Behaviour:**

- Tracks permanently completed milestone ids per company.
- Created alongside company research in `CreateCompanyUseCase`.
- Persisted in savegame snapshots as `companyMilestones`.

### CompanyBrain aggregate (M8)

| Item          | Path                                                                 |
| ------------- | -------------------------------------------------------------------- |
| Aggregate     | `brain/CompanyBrain.ts`                                              |
| Identifiers   | `brain/CompanyBrainId.ts`, `brain/GoalId.ts`, `brain/CompanyDecisionId.ts`, … |
| Strategy ref  | `brain/ActiveStrategy.ts`                                            |
| Decision queue| `brain/DecisionQueue.ts`                                             |
| Goals         | `brain/Goal.ts`, `GoalKind.ts`, `GoalStatus.ts`                      |
| Knowledge     | `brain/KnowledgeEntry.ts`, `KnowledgeKind.ts`, `KnowledgeValue.ts`   |
| Memory        | `brain/MemoryEntry.ts`, `MemoryKind.ts`, `MemoryPayload.ts`          |
| Decisions     | `brain/CompanyDecision.ts`, `CompanyDecisionPayload.ts`, `PlanningLayer.ts` |
| Domain events | `brain/events/StrategyChanged.ts`, `GoalCreated.ts`, `GoalCompleted.ts`, `DecisionQueued.ts` |
| Ports         | `brain/CompanyPlanningPort.ts`, `CompanyDecisionExecutionPort.ts`    |
| Repository    | `brain/CompanyBrainRepository.ts`                                  |
| Tests         | `brain/CompanyBrain.test.ts`                                         |

**Behaviour:**

- One brain per autonomous company; references `companyId` without replacing the `Company` aggregate.
- Planning mutates only the brain repository; execution flows through application use cases (DD-037).
- `CreateCompanyUseCase` with `autonomous: true` bootstraps via `CompanyBrainBootstrapService`.
- Persisted in savegames via `companyBrains[]` on schema V3 (`GameSaveSnapshotV3`).

**References:** `docs/architecture/decisions/DD-037-Company-Brain-and-Decision-Queue.md`, `docs/project-management/M8_ECONOMY_SIMULATION_PLAN.md`

---

## Content Module (`src/content/`)

Loads and validates static game content from `game-content/`.

### Shared

| Item           | Path                         |
| -------------- | ---------------------------- |
| Content errors | `errors/ContentLoadError.ts` |

### ResourceType loader

| Item       | Path                                  |
| ---------- | ------------------------------------- |
| Definition | `resource/ResourceTypeDefinition.ts`  |
| Validator  | `resource/ResourceTypeValidator.ts`   |
| Registry   | `resource/ResourceTypeRegistry.ts`    |
| Loader     | `resource/ResourceTypeLoader.ts`      |
| Tests      | `resource/ResourceTypeLoader.test.ts` |

**Pipeline:** discover YAML files → parse → validate schema → check duplicate IDs → register

**Content files:**

```text
game-content/resources/
├── wood.yaml
└── iron_ore.yaml
```

**Validation highlights:**

- Global ID format: `^[a-z0-9_]+$` (DD-003)
- Required schema fields per `docs/schemas/ResourceType.Schema.md`
- Deterministic load order (sorted file names)

### BuildingType loader

| Item       | Path                                  |
| ---------- | ------------------------------------- |
| Definition | `building/BuildingTypeDefinition.ts`  |
| Validator  | `building/BuildingTypeValidator.ts`   |
| Registry   | `building/BuildingTypeRegistry.ts`    |
| Loader     | `building/BuildingTypeLoader.ts`      |
| Tests      | `building/BuildingTypeLoader.test.ts` |

**Content files:**

```text
game-content/buildings/
├── sawmill.yaml
└── warehouse.yaml
```

**References:** DD-014, DD-031, `docs/schemas/Building.schema.md`

### Recipe loader

| Item       | Path                          |
| ---------- | ----------------------------- |
| Definition | `recipe/RecipeDefinition.ts`  |
| Validator  | `recipe/RecipeValidator.ts`   |
| Registry   | `recipe/RecipeRegistry.ts`    |
| Loader     | `recipe/RecipeLoader.ts`      |
| Tests      | `recipe/RecipeLoader.test.ts` |

**Content files:**

```text
game-content/recipes/
└── recipe_planks.yaml
```

**Reference validation:**

- `inputs` / `outputs` → `ResourceTypeRegistry`
- `buildingTypes` → `BuildingTypeRegistry`

**References:** DD-011, DD-031, `docs/schemas/Recipe.Schema.md`

### Technology loader

| Item       | Path                                |
| ---------- | ----------------------------------- |
| Definition | `research/TechnologyDefinition.ts`  |
| Validator  | `research/TechnologyValidator.ts`   |
| Registry   | `research/TechnologyRegistry.ts`    |
| Loader     | `research/TechnologyLoader.ts`      |
| Tests      | `research/TechnologyLoader.test.ts` |

**Content files:**

```text
game-content/research/
└── basic_woodworking.yaml
```

**Reference validation:**

- `requiredResearch` on buildings, recipes and technologies → `TechnologyRegistry` via `validateResearchReferences.ts`

**References:** `docs/gameplay/research.md`, DD-031

### Milestone loader

| Item       | Path                                |
| ---------- | ----------------------------------- |
| Definition | `milestone/MilestoneDefinition.ts`  |
| Validator  | `milestone/MilestoneValidator.ts`   |
| Registry   | `milestone/MilestoneRegistry.ts`    |
| Loader     | `milestone/MilestoneLoader.ts`      |
| Tests      | `milestone/MilestoneLoader.test.ts` |

**Content files:**

```text
game-content/milestones/
├── first_profit.yaml
├── first_production.yaml
└── profit_100.yaml
```

**Reference validation:**

- `requiredMilestones` on buildings, recipes and technologies → `MilestoneRegistry` via `validateMilestoneReferences.ts`

**Trigger types (v1):** `FIRST_SALE`, `PRODUCTION_VOLUME` (`count`, optional `recipeId`), `PROFIT_THRESHOLD` (`amount` = cumulative sale revenue in GC).

### StrategyDefinition loader (M8)

| Item       | Path                                  |
| ---------- | ------------------------------------- |
| Definition | `strategy/StrategyDefinition.ts`      |
| Validator  | `strategy/StrategyValidator.ts`       |
| Registry   | `strategy/StrategyRegistry.ts`        |
| Loader     | `strategy/StrategyLoader.ts`          |
| Tests      | `strategy/StrategyLoader.test.ts`     |

**Content files:**

```text
game-content/strategies/
├── strategy_balanced.yaml
├── strategy_conservative.yaml
├── strategy_expansionist.yaml
├── strategy_manufacturer.yaml
└── strategy_trading.yaml
```

**References:** `docs/schemas/Strategy.schema.md`, DD-037

### Content validation orchestration

| Item                           | Path                                                                       |
| ------------------------------ | -------------------------------------------------------------------------- |
| Orchestrator                   | `validateGameContent.ts`                                                   |
| Building/recipe consistency    | `validateBuildingRecipeConsistency.ts`                                     |
| Research reference validation  | `validateResearchReferences.ts`                                            |
| Milestone reference validation | `validateMilestoneReferences.ts`                                           |
| CLI tool                       | `tools/validate-content.ts`                                                |
| Tests                          | `validateGameContent.test.ts`, `validateBuildingRecipeConsistency.test.ts` |

Run with: `pnpm validate-content` (add `--strict` for bidirectional building/recipe checks)

---

## Simulation Module (`src/simulation/`)

Deterministic simulation engine (first increment).

| Item               | Path                                                           |
| ------------------ | -------------------------------------------------------------- |
| `SimulationEngine` | `engine/SimulationEngine.ts`                                   |
| `SimulationSystem` | `engine/SimulationSystem.ts`                                   |
| `TickContext`      | `engine/TickContext.ts`                                        |
| `SimulationState`  | `state/SimulationState.ts`                                     |
| `EventQueue`       | `events/EventQueue.ts`                                         |
| `TickClock`        | `time/TickClock.ts`                                            |
| Tests              | `engine/SimulationEngine.test.ts`, `events/EventQueue.test.ts` |

**Tick sequence:**

1. Advance clock
2. Execute registered systems (deterministic order)
3. Publish queued domain events via `IEventBus`
4. Update simulation state

**Simulation systems:**

| Item                         | Path                                               |
| ---------------------------- | -------------------------------------------------- |
| `CompanySimulationSystem`    | `systems/company/CompanySimulationSystem.ts`       |
| `CompanyPlanningSystem`      | `systems/company/CompanyPlanningSystem.ts`         |
| `BuildingSimulationSystem`   | `systems/building/BuildingSimulationSystem.ts`     |
| `TransportSimulationSystem`  | `systems/transport/TransportSimulationSystem.ts`   |
| `ProductionSimulationSystem` | `systems/production/ProductionSimulationSystem.ts` |
| `ResearchSimulationSystem`   | `systems/research/ResearchSimulationSystem.ts`     |
| `MarketSimulationSystem`     | `systems/market/MarketSimulationSystem.ts`         |
| `MarketRegionalSupplyAggregator` | `domain/market/MarketRegionalSupplyAggregator.ts` |
| `ContractSimulationSystem`   | `systems/contract/ContractSimulationSystem.ts`     |
| `FinanceSimulationSystem`    | `systems/finance/FinanceSimulationSystem.ts`       |
| Factory                      | `systems/createDefaultSimulationSystems.ts`        |

Default order: Company → Building → Transport → Production → Research → Market → **CompanyPlanning** → Contract → Finance

`CompanySimulationSystem` executes queued brain decisions at tick start (prior-tick market prices).

`CompanyPlanningSystem` runs the planning pipeline after regional market updates.

Building system advances {@link Building} construction progress each tick for aggregates in `UNDER_CONSTRUCTION` status.

Production system advances running {@link ProductionJob} aggregates each tick, gates on energy and worker efficiency (`recipe.workers` vs assigned employees), and invokes an optional completion callback for inventory delivery.

Research system advances running {@link ResearchJob} aggregates each tick and invokes an optional completion callback for technology unlock.

Finance system debits combined employee salaries every `PAYROLL_INTERVAL_TICKS` ticks as `SALARY` transactions and collects flat corporate tax every `TAX_INTERVAL_TICKS` ticks as `TAX` transactions.

Market system adjusts **regional** resource prices every `MARKET_PRICE_UPDATE_INTERVAL_TICKS` ticks from building-storage supply and baseline demand via `MarketPriceCalculator`, scaled by `InflationCalculator`.

Contract system fulfills active NPC supply contracts before finance processing; starter wood purchase contract is seeded by `StartNewGameUseCase`.

**References:** DD-009, DD-011, DD-027, `docs/architecture/runtime-view.md`

---

## Application Module (`src/application/`)

Coordinates use cases between domain, infrastructure and simulation.

| Item                                  | Path                                                                                                                                                                                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ApplicationContext`                  | `bootstrap/ApplicationContext.ts`                                                                                                                                                                |
| `bootstrapApplication`                | `bootstrap/bootstrapApplication.ts`                                                                                                                                                              |
| `CreateCompanyCommand`                | `commands/CreateCompanyCommand.ts`                                                                                                                                                               |
| `PlaceBuildingCommand`                | `commands/PlaceBuildingCommand.ts`                                                                                                                                                               |
| `CreateCompanyUseCase`                | `use-cases/CreateCompanyUseCase.ts`                                                                                                                                                              |
| `PlaceBuildingUseCase`                | `use-cases/PlaceBuildingUseCase.ts`                                                                                                                                                              |
| `ProductionInventoryService`          | `services/ProductionInventoryService.ts`                                                                                                                                                         |
| `MarketPriceSeeder`                   | `services/MarketPriceSeeder.ts`                                                                                                                                                                  |
| `MarketTradeService`                  | `services/MarketTradeService.ts`                                                                                                                                                                 |
| `CompanyPlanningPipeline`             | `planning/CompanyPlanningPipeline.ts`                                                                                                                                                          |
| `CompanyDecisionExecutionService`     | `services/CompanyDecisionExecutionService.ts`                                                                                                                                                    |
| `CompanyBrainBootstrapService`        | `services/CompanyBrainBootstrapService.ts`                                                                                                                                                        |
| `StartProductionCommand`              | `commands/StartProductionCommand.ts`                                                                                                                                                             |
| `SellResourceCommand`                 | `commands/SellResourceCommand.ts`                                                                                                                                                                |
| `BuyResourceCommand`                  | `commands/BuyResourceCommand.ts`                                                                                                                                                                 |
| `StartProductionUseCase`              | `use-cases/StartProductionUseCase.ts`                                                                                                                                                            |
| `SellResourceUseCase`                 | `use-cases/SellResourceUseCase.ts`                                                                                                                                                               |
| `CompleteTechnologyCommand`           | `commands/CompleteTechnologyCommand.ts`                                                                                                                                                          |
| `CompleteTechnologyUseCase`           | `use-cases/CompleteTechnologyUseCase.ts`                                                                                                                                                         |
| `StartResearchCommand`                | `commands/StartResearchCommand.ts`                                                                                                                                                               |
| `StartResearchUseCase`                | `use-cases/StartResearchUseCase.ts`                                                                                                                                                              |
| `HireEmployeeCommand`                 | `commands/HireEmployeeCommand.ts`                                                                                                                                                                |
| `AssignEmployeeCommand`               | `commands/AssignEmployeeCommand.ts`                                                                                                                                                              |
| `HireEmployeeUseCase`                 | `use-cases/HireEmployeeUseCase.ts`                                                                                                                                                               |
| `AssignEmployeeUseCase`               | `use-cases/AssignEmployeeUseCase.ts`                                                                                                                                                             |
| `ResearchCompletionService`           | `services/ResearchCompletionService.ts`                                                                                                                                                          |
| `MilestoneEvaluationService`          | `services/MilestoneEvaluationService.ts`                                                                                                                                                         |
| `EnergyBalanceService`                | `services/EnergyBalanceService.ts`                                                                                                                                                               |
| `TransportLogisticsService`           | `services/TransportLogisticsService.ts`                                                                                                                                                          |
| `EmployeeAllocationService`           | `services/EmployeeAllocationService.ts`                                                                                                                                                          |
| `TickHistoryService`                  | `services/TickHistoryService.ts`                                                                                                                                                                 |
| `ListFinanceTransactionsQueryHandler` | `queries/ListFinanceTransactionsQueryHandler.ts`                                                                                                                                                 |
| `GameSession`                         | `facade/GameSession.ts`                                                                                                                                                                          |
| `GameSessionDashboardBuilder`         | `facade/GameSessionDashboardBuilder.ts`                                                                                                                                                          |
| `SaveGameCommand`                     | `commands/SaveGameCommand.ts`                                                                                                                                                                    |
| `LoadGameCommand`                     | `commands/LoadGameCommand.ts`                                                                                                                                                                    |
| `SaveGameUseCase`                     | `use-cases/SaveGameUseCase.ts`                                                                                                                                                                   |
| `LoadGameUseCase`                     | `use-cases/LoadGameUseCase.ts`                                                                                                                                                                   |
| `restoreApplicationFromSnapshot`      | `bootstrap/restoreApplicationFromSnapshot.ts`                                                                                                                                                    |
| `GetCompanyQueryHandler`              | `queries/GetCompanyQueryHandler.ts`                                                                                                                                                              |
| `ListBuildingsQueryHandler`           | `queries/ListBuildingsQueryHandler.ts`                                                                                                                                                           |
| `GetInventoryQueryHandler`            | `queries/GetInventoryQueryHandler.ts`                                                                                                                                                            |
| `GetFinanceQueryHandler`              | `queries/GetFinanceQueryHandler.ts`                                                                                                                                                              |
| `GetMarketPricesQueryHandler`         | `queries/GetMarketPricesQueryHandler.ts`                                                                                                                                                         |
| Market dashboard charts               | `apps/web/src/components/MarketSupplyDemandChart.tsx`, `MarketPressureHistoryChart.tsx`, `MarketPricesTable.tsx`                                                                                 |
| Read models                           | `read-models/CompanyReadModel.ts`, `BuildingReadModel.ts`, `InventoryReadModel.ts`, `FinanceReadModel.ts`, `MarketPriceReadModel.ts`, `TickMetricsSnapshot.ts`, `FinanceTransactionReadModel.ts` |
| Tests                                 | `bootstrap/bootstrapApplication.test.ts`, `planning/CompanyPlanningPipeline.test.ts`, `services/CompanyDecisionExecutionService.test.ts`, `services/*.test.ts`, `queries/*.test.ts`, `use-cases/*.test.ts`, `facade/GameSession.test.ts` |

**Behaviour:**

- Bootstrap loads validated game content and wires in-memory repos, clock, event bus, simulation engine with default systems (incl. brain repo, planning pipeline, decision execution).
- Use cases create domain aggregates, persist via repository interfaces and enqueue domain events for the next tick.
- `CreateCompanyUseCase` also creates an empty company inventory and finance account with starting capital; optional `autonomous: true` bootstraps a `CompanyBrain`.
- `PlaceBuildingUseCase` resolves `constructionCost` via `ConstructionCostPolicy`, debits company finance, calls `beginConstruction()` with content `constructionTime`, and rolls back nothing on debit failure because the building is not persisted yet.
- `StartProductionUseCase` validates recipe/building compatibility against loaded content, reserves recipe inputs via `ProductionInventoryService`, rejects non-`ACTIVE` buildings, and rolls back reservations if job creation fails.
- `ProductionInventoryService` reserves inputs on production start; simulation invokes `completeJob()` on completion to consume inputs and deliver outputs.
- Bootstrap seeds **regional** market prices from resource `basePrice` via `MarketPriceSeeder` (one market per enabled region).
- `MarketTradeService` executes instant buy/sell at regional `lastPrice`, updating inventory, finance and market trade volume.
- `CompanyPlanningPipeline` observes repo state read-only, analyses strategy-weighted goals, validates decisions, and queues them on the company brain only.
- `CompanyDecisionExecutionService` drains the brain queue through `BuyResource`, `SellResource`, `PlaceBuilding`, `StartProduction`, and `StartResearch` use cases (max 50 per company per tick).

### Company planning (M8)

| Item                        | Path                                      |
| --------------------------- | ----------------------------------------- |
| `CompanyPlanningObserver`   | `planning/CompanyPlanningObserver.ts`     |
| `CompanyPlanningAnalyser`   | `planning/CompanyPlanningAnalyser.ts`     |
| `CompanyGoalPlanner`        | `planning/CompanyGoalPlanner.ts`          |
| `CompanyDecisionPlanner`    | `planning/CompanyDecisionPlanner.ts`      |
| `CompanyDecisionValidator`  | `planning/CompanyDecisionValidator.ts`    |
| `CompanyPlanningPipeline`   | `planning/CompanyPlanningPipeline.ts`     |

- Query handlers (`GetCompany`, `ListBuildings`, `GetInventory`, `GetFinance`, `GetMarketPrices`) read repository state and return immutable read models without mutating aggregates.
- `SaveGameUseCase` serializes all aggregate repositories (including employees), simulation metadata and dashboard tick metrics history into a versioned JSON snapshot; saves are rejected while domain events remain queued.
- `LoadGameUseCase` reads a snapshot file and `restoreApplicationFromSnapshot` hydrates fresh in-memory repositories, clock, simulation engine state and tick chart history.
- `CompleteTechnologyUseCase` marks technologies as completed (internal completion path after research jobs finish).
- `StartResearchUseCase` debits `researchCost`, enforces research and milestone prerequisites and starts timed research jobs.
- `HireEmployeeUseCase` debits one-time recruitment `cost` as `RECRUITMENT_COST`, enforces employee type prerequisites and persists hired employees.
- `AssignEmployeeUseCase` assigns employees to `ACTIVE` buildings owned by the same company.
- `GameSession.hireEmployee()` / `assignEmployee()` expose employee workflows with generated employee ids.
- Dashboard exposes `employees[]`, hire/assign hints and employee KPIs (count, payroll per interval).
- `ResearchCompletionService` unlocks technologies when research jobs complete via simulation ticks.
- `MilestoneEvaluationService` completes milestones from domain events: first sale → `first_profit`, cumulative sale revenue → `profit_100`, finished production jobs → `first_production`.
- `GameSession` exposes browser-facing dashboard, tick history, save/load and simulation actions; records per-tick KPI snapshots after each simulation tick.
- `TickHistoryService` stores a ring buffer (max 500 points) of cash, energy reserve and active transport counts for dashboard charts.
- `ListFinanceTransactionsQueryHandler` exposes finance ledger entries for dashboard drill-down.
- `PlaceBuildingUseCase` and `StartProductionUseCase` enforce `requiredResearch` / `requiredMilestones` via domain specifications.

---

## Infrastructure Module (`src/infrastructure/`)

| Item                              | Path                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------- |
| `InMemoryCompanyRepository`       | `persistence/InMemoryCompanyRepository.ts`                                                        |
| `InMemoryBuildingRepository`      | `persistence/InMemoryBuildingRepository.ts`                                                       |
| `InMemoryInventoryRepository`     | `persistence/InMemoryInventoryRepository.ts`                                                      |
| `InMemoryEmployeeRepository`      | `persistence/InMemoryEmployeeRepository.ts`                                                       |
| `InMemoryProductionJobRepository` | `persistence/InMemoryProductionJobRepository.ts`                                                  |
| `InMemoryFinanceRepository`       | `persistence/InMemoryFinanceRepository.ts`                                                        |
| `InMemoryMarketRepository`        | `persistence/InMemoryMarketRepository.ts`                                                         |
| `InMemoryCompanyBrainRepository`  | `persistence/InMemoryCompanyBrainRepository.ts`                                                     |
| `GameSaveSnapshotV1`              | `persistence/savegame/GameSaveSnapshotV1.ts` (frozen contract — M8 fields reverted) |
| `GameSaveSnapshotV2`              | `persistence/savegame/GameSaveSnapshotV2.ts` (M7 world layer; markets[] = global V1 shape) |
| `GameSaveSnapshotV3`              | `persistence/savegame/GameSaveSnapshotV3.ts` — `docs/schemas/GameSaveSnapshotV3.schema.md` |
| `GameStateSerializer`             | `persistence/savegame/GameStateSerializer.ts`                                                     |
| `FileSavegameStore`               | `persistence/savegame/FileSavegameStore.ts`                                                       |
| NestJS API                        | `apps/api/`                                                                                       |
| Dashboard WebSocket               | `apps/api/src/dashboard/` (`/ws/v1/dashboard`)                                                    |
| Next.js web app                   | `apps/web/`                                                                                       |
| Tests                             | `persistence/InMemory*.test.ts`, `use-cases/SaveGameUseCase.test.ts`, `apps/api/src/**/*.test.ts` |

---

## API Module (`apps/api/`)

| Item                | Path                                 |
| ------------------- | ------------------------------------ |
| Entry point         | `src/main.ts`                        |
| Root module         | `src/app.module.ts`                  |
| Game module         | `src/game/game.module.ts`            |
| Session service     | `src/game/game-session.service.ts`   |
| REST controller     | `src/game/game.controller.ts`        |
| Path resolution     | `src/config/project-paths.ts`        |
| API envelope filter | `src/common/api-exception.filter.ts` |

**Behaviour:**

- `pnpm dev` starts the NestJS API on `http://127.0.0.1:3001`.
- Controllers delegate exclusively to `GameSession`; no direct domain access.
- JSON envelope matches the browser shell: `{ ok: true, data }` / `{ ok: false, error }`.
- `GET /` redirects browsers to the Next.js frontend.

**API routes:**

| Method | Path                     | Action                                                                   |
| ------ | ------------------------ | ------------------------------------------------------------------------ |
| GET    | `/api/dashboard`         | Aggregated session snapshot                                              |
| GET    | `/api/dashboard/history` | Tick metrics history for charts (`fromTick`, `toTick`, `limit`)          |
| WS     | `/ws/v1/dashboard`       | Live refresh event `dashboard:refresh` after ticks and session mutations |
| POST   | `/api/session/new`       | Start new game                                                           |
| POST   | `/api/session/save`      | Persist to `saves/browser-session.json`                                  |
| POST   | `/api/session/load`      | Restore from save file                                                   |
| POST   | `/api/simulation/tick`   | Advance one or more ticks (`{ count?: number }`)                         |
| POST   | `/api/buildings/place`   | Place building                                                           |
| POST   | `/api/production/start`  | Start recipe on building                                                 |
| POST   | `/api/research/start`    | Start technology research                                                |
| POST   | `/api/employees/hire`    | Hire employee                                                            |
| POST   | `/api/employees/assign`  | Assign employee to building                                              |
| POST   | `/api/market/sell`       | Sell resources                                                           |
| POST   | `/api/market/buy`        | Buy resources                                                            |

---

## Web Module (`apps/web/`)

| Item                       | Path                                         |
| -------------------------- | -------------------------------------------- |
| Next.js app                | `src/app/page.tsx`, `src/app/layout.tsx`     |
| Dashboard shell            | `src/components/DashboardShell.tsx`          |
| Detail panel               | `src/components/DashboardDetailPanel.tsx`    |
| Tick history charts        | `src/components/TickHistoryCharts.tsx`       |
| Inventory history chart    | `src/components/InventoryHistoryChart.tsx`   |
| Energy history chart       | `src/components/EnergyHistoryChart.tsx`      |
| Market price history chart | `src/components/MarketPriceHistoryChart.tsx` |
| Data table                 | `src/components/DataTable.tsx`               |
| Dashboard socket client    | `src/lib/dashboard-socket.ts`                |
| API client                 | `src/lib/api.ts`                             |
| Styles                     | `src/app/dashboard.css`                      |

**Behaviour:**

- `pnpm dev` starts API (`:3001`) and Next.js (`:3000`) in parallel.
- Next.js rewrites `/api/*` to the NestJS backend.
- Dashboard layout per `DASHBOARD_STYLE_GUIDE.md`: sidebar actions, KPI strip, overview strip, sticky detail panel, table area.
- Dashboard actions: new game, tick / 10× tick, build, produce, research, market buy/sell, save/load.
- Line charts (Recharts) for cash, energy reserve and active transports; KPI trend arrows from tick history.
- Inventory, energy (generation/consumption/reserve) and market price history charts from tick metrics.
- Drill-down: selectable table rows update the detail panel (buildings, production, transport, research).
- Sortable, searchable tables with sticky headers and numeric alignment.
- Live dashboard refresh via WebSocket (`dashboard:refresh` → automatic refetch).
- Finance drill-down: KPI cash card, Finanzbuchungen table, detail panel focus for account and single transactions.
- Light/dark theme toggle; separate on-site inventory and warehouse storage panels.
- Content-driven toolbar hints with disable reasons; energy panel; localized resource/building names.

---

## UI Module (`src/ui/`)

The active browser UI lives in `apps/web/`. This folder remains reserved for future shared UI assets and documentation.

| Item          | Path        |
| ------------- | ----------- |
| Module readme | `readme.md` |

**Behaviour:**

- Presentation logic stays in Next.js (`apps/web/`).
- `GameSession` coordinates bootstrap, use cases and query handlers for the dashboard shell.
- Dashboard shows construction progress, milestone catalog, production/research jobs and action availability hints.

---

## Tooling and Configuration

| Change                | Description                                      |
| --------------------- | ------------------------------------------------ |
| `vitest.config.ts`    | Co-located tests under `src/**/*.test.ts`        |
| `package.json`        | `packageManager: pnpm@11.3.0`, dependency `yaml` |
| `pnpm-workspace.yaml` | `allowBuilds: esbuild: true`                     |
| Git                   | Initial repository commit with foundation layer  |

---

# Static vs Dynamic Model (DD-015)

| Static definition (content) | Dynamic instance (domain) |
| --------------------------- | ------------------------- |
| `ResourceType`              | Inventory item (planned)  |
| `BuildingType`              | `Building`                |
| `Recipe`                    | `ProductionJob`           |

Content loaders produce immutable definitions. Domain aggregates represent player-specific state.

---

# Test Coverage Summary

| Module                            | Test file                                                                                                      | Focus                                                                                         |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Common / Identifier               | `Identifier.test.ts`                                                                                           | Creation, validation, equality, immutability                                                  |
| Common / Entity                   | `Entity.test.ts`                                                                                               | Identity, equality                                                                            |
| Common / ValueObject              | `ValueObject.test.ts`                                                                                          | Structural equality                                                                           |
| Common / AggregateRoot            | `AggregateRoot.test.ts`                                                                                        | Domain event collection                                                                       |
| Common / Result                   | `Result.test.ts`                                                                                               | ok/fail, map, flatMap, unwrap                                                                 |
| Common / Guard                    | `Guard.test.ts`                                                                                                | Null, empty string, negative checks                                                           |
| Common / ManualClock              | `ManualClock.test.ts`                                                                                          | Deterministic time control                                                                    |
| Common / EventBus                 | `InMemoryEventBus.test.ts`                                                                                     | Subscribe, publish, order                                                                     |
| Domain / Company                  | `Company.test.ts`                                                                                              | Creation, validation, events                                                                  |
| Domain / Building                 | `Building.test.ts`                                                                                             | Placement, construction lifecycle, validation, events                                         |
| Domain / Inventory                | `Inventory.test.ts`                                                                                            | Quantities, reservations, removal, events                                                     |
| Domain / Employee                 | `Employee.test.ts`                                                                                             | Hire, assign, unassign, validation, restore                                                   |
| Domain / ProductionJob            | `ProductionJob.test.ts`                                                                                        | Start, tick, completion                                                                       |
| Domain / FinanceAccount           | `FinanceAccount.test.ts`                                                                                       | Credit, debit, reserve, transactions                                                          |
| Domain / Market                   | `Market.test.ts`, `MarketPriceCalculator.test.ts`                                                              | Seed prices, update price, supply-demand formula                                              |
| Domain / CompanyResearch          | `CompanyResearch.test.ts`                                                                                      | Create, complete technology                                                                   |
| Domain / Specifications           | `RequiredResearchSpecification.test.ts`, `BuildingPrerequisitesSpecification.test.ts`, ...                     | Research eligibility, building prerequisites                                                  |
| Application / CompleteTechnology  | `CompleteTechnologyUseCase.test.ts`                                                                            | Complete technology for company                                                               |
| Application / StartResearch       | `StartResearchUseCase.test.ts`                                                                                 | Timed research, milestone gate, cost debit, tech unlock                                       |
| Domain / ResearchJob              | `ResearchJob.test.ts`                                                                                          | Create, start, tick completion                                                                |
| Domain / CompanyMilestones        | `CompanyMilestones.test.ts`                                                                                    | Create, complete milestone                                                                    |
| Application / MilestoneEvaluation | `MilestoneEvaluationService.test.ts`                                                                           | First sale, profit threshold, production volume                                               |
| Domain / Policies                 | `ConstructionCostPolicy.test.ts`, `InstantTradePricingPolicy.test.ts`                                          | Construction cost resolution, instant trade pricing                                           |
| Domain / Money                    | `Money.test.ts`                                                                                                | Amount, currency, validation                                                                  |
| Domain / Quantity                 | `Quantity.test.ts`                                                                                             | Non-negative values                                                                           |
| Domain / ResourceAmount           | `ResourceAmount.test.ts`                                                                                       | Resource id + amount                                                                          |
| Domain / Capacity                 | `Capacity.test.ts`                                                                                             | Non-negative capacity limits                                                                  |
| Content / ResourceType            | `ResourceTypeLoader.test.ts`                                                                                   | Load, validate, duplicates                                                                    |
| Content / BuildingType            | `BuildingTypeLoader.test.ts`                                                                                   | Load, validate, duplicates                                                                    |
| Content / Recipe                  | `RecipeLoader.test.ts`                                                                                         | Load, reference validation                                                                    |
| Content / Consistency             | `validateBuildingRecipeConsistency.test.ts`                                                                    | Cross-registry checks                                                                         |
| Content / All                     | `validateGameContent.test.ts`                                                                                  | Full content pipeline                                                                         |
| Simulation / Engine               | `SimulationEngine.test.ts`                                                                                     | Tick, determinism, pause                                                                      |
| Simulation / EventQueue           | `EventQueue.test.ts`                                                                                           | Enqueue, drain, peek                                                                          |
| Simulation / Systems              | `createDefaultSimulationSystems.test.ts`, `MarketSimulationSystem.test.ts`, `ContractSimulationSystem.test.ts`, `CompanySimulationSystem.test.ts`, `CompanyEconomySimulation.integration.test.ts` | Default pipeline order, regional prices, NPC contracts, brain planning loop |
| Domain / CompanyBrain             | `CompanyBrain.test.ts`, `InMemoryCompanyBrainRepository.test.ts`                                                                               | Goals, decision queue, strategy, repository round-trip                        |
| Content / Strategy                | `StrategyLoader.test.ts`                                                                                                                       | Load, validate strategy YAML                                                  |
| Application / Planning            | `CompanyPlanningPipeline.test.ts`                                                                                                                | Observer → analyser → goal/decision planners → queue                          |
| Application / DecisionExecution   | `CompanyDecisionExecutionService.test.ts`                                                                                                        | Buy/sell/place/start production/research via use cases                          |
| Simulation / Finance              | `FinanceSimulationSystem.test.ts`, `TaxCalculator.test.ts`                                                     | Payroll and corporate tax debits                                              |
| Domain / Market                   | `MarketPriceCalculator.test.ts`, `InflationCalculator.test.ts`, `MarketFeePolicy.test.ts`                      | Price formula, inflation dampening, trade fees                                                |
| Domain / Contract                 | `SupplyContract.test.ts`                                                                                       | Starter contract defaults and fulfillment guard                                               |
| Simulation / Production           | `ProductionSimulationSystem.test.ts`                                                                           | Worker shortage and full staffing                                                             |
| Application / EmployeeAllocation  | `EmployeeAllocationService.test.ts`                                                                            | Assigned count and recipe efficiency                                                          |
| Domain / EmployeeAllocation       | `EmployeeAllocationCalculator.test.ts`                                                                         | Efficiency scaling and cap                                                                    |
| Infrastructure / Company repo     | `InMemoryCompanyRepository.test.ts`                                                                            | Save, find, ordering                                                                          |
| Infrastructure / Building repo    | `InMemoryBuildingRepository.test.ts`                                                                           | Save, find by company, under construction                                                     |
| Application / GameSession         | `GameSession.test.ts`                                                                                          | Dashboard facade, market buy, batch ticks, save/load, employees                               |
| API / GameController              | `apps/api/src/game/game.controller.test.ts`                                                                    | NestJS route contract, validation envelope                                                    |
| API / Project paths               | `apps/api/src/config/project-paths.test.ts`                                                                    | Monorepo root and static asset resolution                                                     |
| Application / Bootstrap           | `bootstrapApplication.test.ts`                                                                                 | Content load, wiring                                                                          |
| Application / CreateCompany       | `CreateCompanyUseCase.test.ts`                                                                                 | Create, events, duplicates                                                                    |
| Application / PlaceBuilding       | `PlaceBuildingUseCase.test.ts`                                                                                 | Place, construction time, cost debit, events, validation                                      |
| Application / HireEmployee        | `HireEmployeeUseCase.test.ts`                                                                                  | Hire, recruitment debit, prerequisites, events                                                |
| Application / AssignEmployee      | `AssignEmployeeUseCase.test.ts`                                                                                | Assign, active building, duplicate assignment                                                 |
| Application / StartProduction     | `StartProductionUseCase.test.ts`                                                                               | Active-building guard, milestone gate, input reservation, tick completion, inventory transfer |
| Application / ProductionInventory | `ProductionInventoryService.test.ts`                                                                           | Reserve, release, complete job inventory                                                      |
| Application / GetCompany          | `GetCompanyQueryHandler.test.ts`                                                                               | Company read model, not found                                                                 |
| Application / ListBuildings       | `ListBuildingsQueryHandler.test.ts`                                                                            | Building list, empty company                                                                  |
| Application / GetInventory        | `GetInventoryQueryHandler.test.ts`                                                                             | Stock levels, available quantity                                                              |
| Application / GetFinance          | `GetFinanceQueryHandler.test.ts`                                                                               | Starting balance, not found                                                                   |
| Application / GetMarketPrices     | `GetMarketPricesQueryHandler.test.ts`                                                                          | Seeded prices, not initialized                                                                |
| Application / MarketPriceSeeder   | `MarketPriceSeeder.test.ts`                                                                                    | Bootstrap seed, idempotent                                                                    |
| Application / MarketTrade         | `MarketTradeService.test.ts`                                                                                   | Instant buy/sell, insufficient stock/cash                                                     |
| Application / SaveGame            | `SaveGameUseCase.test.ts`                                                                                      | Snapshot round-trip, pending event guard, tick metrics history                                |
| Application / TickHistory         | `TickHistoryService.test.ts`                                                                                   | Record, filter, ring buffer, save/restore                                                     |
| Application / FinanceTransactions | `ListFinanceTransactionsQueryHandler.test.ts`                                                                  | Ledger listing, newest first                                                                  |
| Application / SellBuyResource     | `MarketTradeUseCases.test.ts`                                                                                  | Use case validation, trade flow                                                               |
| Infrastructure / Finance repo     | `InMemoryFinanceRepository.test.ts`                                                                            | Save, find by company                                                                         |
| Infrastructure / Savegame         | `GameStateSerializer.test.ts`                                                                                  | Snapshot parse/hydrate, employee round-trip, supply contracts + tax timestamps                |

---

**Progression (game-content):**

| Milestone          | Unlocks                      |
| ------------------ | ---------------------------- |
| `first_profit`     | `warehouse` building         |
| `first_production` | `recipe_advanced_planks`     |
| `profit_100`       | `basic_woodworking` research |

# Planned Next Steps

1. **M9 Phase 5 — Simulation Controls:** pause/resume API + game shell controls
2. Session/auth model for multi-user API access
3. Full tick log / replay per DD-033 (beyond metrics ring buffer)

---

# Recently Completed (2026-07)

- **M9 Gate 1 — Foundation Consolidation:** single session/notification pipeline, `CompanyDashboardScreen` + ViewData layer, Buildings query; verdict **READY FOR GATE 1 DELTA REVIEW** (`docs/architecture/reviews/M9_FOUNDATION_CONSOLIDATION_REPORT.md`)
- **M9 Phase 3 — Read Model & Query Layer:** session/simulation/save/world queries + API routes, presentation adapters/view-data/mappers, query-backed screens (**588 tests**)
- **M9 Phase 2 — Navigation & UI State:** primary navigation, URL-backed workspace state, dialog layer
- **M9 Gate 0 — Architecture Review:** audit of web/API/`GameSession`; verdict **ARCHITECTURE CHANGES REQUIRED**; retain Next.js + NestJS (`docs/architecture/reviews/M9_ARCHITECTURE_REVIEW_REPORT.md`)
- **M8 NPC Economy completed (AUD-006):** Phase 9 closed TD-M8-01 … TD-M8-06 (liquidity/cost goals, cross-region `EXPAND_REGION`, NPC seeding, removed legacy supply aggregator); gate report `docs/quality/M8_IMPLEMENTATION_REPORT.md`; **567 tests**
- **M8 NPC Economy Phase 8 — Savegame V3:** Reverted V1 market type pollution; `GameSaveSnapshotV3` with `companyBrains[]` + `regionalMarkets[]`; V1→V2→V3 migration chain; determinism-after-load tests
- **M7 World Simulation completed (AUD-005):** regions, map, biomes, cities, regional resources, cross-region transport, save V2 + migration, world queries/API (`docs/quality/M7_WORLD_SIMULATION_GATE_REVIEW_REPORT.md`)
- **M6 Logistics completed (AUD-004):** capacities, transport routes, network throughput queue; DD-022 V1 vehicle waiver (`docs/quality/M6_LOGISTICS_GATE_REVIEW_REPORT.md`)
- **M5 Economy completed:** dynamic prices, dashboard supply/demand, market fees, taxes, NPC contracts, inflation dampening (reports in `docs/quality/M5_ECONOMY_*`)
- M5 audit follow-ups: supply-contract savegame test, schema docs, tutorial economy steps, price-index chart
- M6-1 logistics: warehouse `storageCapacity` from content, enforcement, dashboard + market hints
- M6-2 logistics: transport route content, duration policy, dashboard duration display (`docs/quality/M6_LOGISTICS_ROUTES_REPORT.md`)
- M6-3 logistics: network throughput queue, WAITING status, FIFO dispatch (`docs/quality/M6_LOGISTICS_NETWORK_REPORT.md`)
- M5 economy step 3: market trade fees (`MarketFeePolicy`, `MARKET_FEE` ledger entries)
- M5 economy step 2: dashboard supply/demand (extended market read model, charts, market table)
- M5 economy step 1: dynamic market prices (supply & demand via `MarketPriceCalculator`, simulation tick updates)
- Dashboard UX polish (outline KPI icons, auto-dismiss toasts, tutorial panel)
- Employee dashboard & API integration (hire/assign routes, table, KPIs, detail panel)
- Employee savegame persistence (`employees[]` on schema v1, serializer round-trip)
- Employee simulation layer (payroll debits, worker efficiency, `recipe.workers` enforcement)
- Employee application layer (`HireEmployeeUseCase`, `AssignEmployeeUseCase`, GameSession wiring)
- Employee domain layer (`Employee` aggregate, events, repository, in-memory persistence)
- Employee content layer (5 YAML types, loader, validator, registry, validateGameContent integration)
- Core gameplay start via `StartNewGameUseCase` (100k capital, 4 starter buildings, wood/stone/iron)
- Persistence verification tests for `GameStateSerializer` (11) and `LoadGameUseCase` (6)
- Warehouse transport system (Phase 1) with simulation pipeline integration
- Switchable dashboard dark/light theme
- Dashboard layout refactor per `DASHBOARD_STYLE_GUIDE.md`
- Tick metrics history with line charts (`GET /api/dashboard/history`)
- Dashboard drill-down detail panel for buildings, production, transport and research
- Sortable, searchable dashboard tables
- Tick metrics history persisted in savegames (`tickMetricsHistory` on schema v1)
- WebSocket live dashboard refresh (`/ws/v1/dashboard`)
- Finance drill-down with ledger table and transaction detail focus
- Logistics drill-down (overview, warehouse focus) and inventory history chart
- Market price and energy generation/consumption history charts

---

# How to Update This Document

When completing an implementation task:

1. Add or update the component table under the relevant module section.
2. Note behaviour, factory methods, and domain events.
3. List relevant ADRs and schema documents.
4. Update the status table and planned next steps.
5. Run `pnpm test` and note the current test count.

---

# Related Documents

- `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`
- `docs/architecture/reviews/M8_PHASE_8_PERSISTENCE_DECISION.md`
- `docs/schemas/GameSaveSnapshotV1.schema.md`
- `docs/schemas/GameSaveSnapshotV2.schema.md`
- `docs/schemas/GameSaveSnapshotV3.schema.md`
- `docs/project-management/M8_ECONOMY_SIMULATION_PLAN.md`
- `docs/decisions/DD-000-decision-index.md`
- `src/common/readme.md`
- `src/domain/readme.md`
- `src/content/readme.md`
