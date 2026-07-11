# Implementation Progress

Version: 1.0.0

Status: Active

Last Updated: 2026-07-11

---

# Purpose

This document tracks implemented source code against the Project Genesis architecture.

It records what exists in `src/`, which Architecture Decision Records (ADRs) were followed, and what remains planned.

Update this document whenever a meaningful implementation milestone is completed.

---

# Current Status

| Area | Status |
|---|---|
| Common foundation | Implemented |
| Domain aggregates | Partial (Company, Building) |
| Domain value objects | Partial (Money, Quantity, Position) |
| Content loaders | Partial (ResourceType, BuildingType, Recipe) |
| Simulation | Partial (SimulationEngine, first tick) |
| Infrastructure | Not started |
| Application layer | Not started |
| UI | Not started |

**Tests:** 130 (run `pnpm test` for current count)

---

# Implemented Components

## Common Module (`src/common/`)

Foundation building blocks shared across the project.

| Component | Path | Description |
|---|---|---|
| `Identifier<T>` | `core/Identifier.ts` | Strongly typed, immutable global identifiers |
| `Entity<TBrand>` | `core/Entity.ts` | Base class for identity-based domain objects |
| `ValueObject` | `core/ValueObject.ts` | Base class for immutable value-based equality |
| `AggregateRoot<TBrand>` | `core/AggregateRoot.ts` | Entity with domain event collection |
| `Result<T>` | `result/Result.ts` | Explicit success/failure handling |
| `DomainEvent` | `events/DomainEvent.ts` | Immutable domain event base class |
| `IEventBus` | `events/IEventBus.ts` | Event bus contract for domain event dispatch |
| `InMemoryEventBus` | `events/InMemoryEventBus.ts` | Deterministic in-process event bus |
| `DomainError` | `errors/DomainError.ts` | Structured domain error base class |
| `ValidationError` | `errors/ValidationError.ts` | Validation-specific domain error |
| `Guard` | `validation/Guard.ts` | Shared validation helpers returning `Result` |
| `Clock` | `time/Clock.ts` | Time abstraction interface |
| `ManualClock` | `time/ManualClock.ts` | Deterministic clock for tests and simulation |

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

| Item | Path |
|---|---|
| Aggregate | `company/Company.ts` |
| Identifiers | `company/CompanyId.ts` (`CompanyId`, `PlayerId`) |
| Status enum | `company/CompanyStatus.ts` |
| Domain event | `company/events/CompanyFounded.ts` |
| Tests | `company/Company.test.ts` |

**Behaviour:**

- Factory: `Company.create()` validates name via `Guard`, reads `foundedAt` from `Clock`.
- Initial status: `ACTIVE`.
- Raises `CompanyFounded` on creation.

**References:** `docs/schemas/Company.Schema.md`, `docs/architecture/domain-model.md`

### Building aggregate

| Item | Path |
|---|---|
| Aggregate | `building/Building.ts` |
| Identifiers | `building/BuildingId.ts` (`BuildingId`, `BuildingTypeId`) |
| Value object | `building/Position.ts` |
| Status enum | `building/BuildingStatus.ts` |
| Domain event | `building/events/BuildingPlaced.ts` |
| Tests | `building/Building.test.ts` |

**Behaviour:**

- Factory: `Building.create()` validates name and non-negative coordinates.
- References static type via `buildingTypeId` (content definition).
- Owned by company via `companyId`.
- Initial status: `PLANNED`, level `1`.
- Raises `BuildingPlaced` on creation.

**References:** DD-014 (template vs instance), DD-015 (static vs dynamic), `docs/schemas/Building.schema.md`

### Shared value objects

| Item | Path |
|---|---|
| `Money` | `shared/Money.ts` |
| `Quantity` | `shared/Quantity.ts` |
| Tests | `shared/Money.test.ts`, `shared/Quantity.test.ts` |

**Behaviour:**

- `Money.create()` — non-negative amount, non-empty currency (default `GC`).
- `Quantity.create()` — non-negative count.
- Both extend `ValueObject` with structural equality and immutability.

**References:** `docs/schemas/Finance.Schema.md`, `docs/architecture/domain-model.md`

---

## Content Module (`src/content/`)

Loads and validates static game content from `game-content/`.

### Shared

| Item | Path |
|---|---|
| Content errors | `errors/ContentLoadError.ts` |

### ResourceType loader

| Item | Path |
|---|---|
| Definition | `resource/ResourceTypeDefinition.ts` |
| Validator | `resource/ResourceTypeValidator.ts` |
| Registry | `resource/ResourceTypeRegistry.ts` |
| Loader | `resource/ResourceTypeLoader.ts` |
| Tests | `resource/ResourceTypeLoader.test.ts` |

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

| Item | Path |
|---|---|
| Definition | `building/BuildingTypeDefinition.ts` |
| Validator | `building/BuildingTypeValidator.ts` |
| Registry | `building/BuildingTypeRegistry.ts` |
| Loader | `building/BuildingTypeLoader.ts` |
| Tests | `building/BuildingTypeLoader.test.ts` |

**Content files:**

```text
game-content/buildings/
├── sawmill.yaml
└── warehouse.yaml
```

**References:** DD-014, DD-031, `docs/schemas/Building.schema.md`

### Recipe loader

| Item | Path |
|---|---|
| Definition | `recipe/RecipeDefinition.ts` |
| Validator | `recipe/RecipeValidator.ts` |
| Registry | `recipe/RecipeRegistry.ts` |
| Loader | `recipe/RecipeLoader.ts` |
| Tests | `recipe/RecipeLoader.test.ts` |

**Content files:**

```text
game-content/recipes/
└── recipe_planks.yaml
```

**Reference validation:**

- `inputs` / `outputs` → `ResourceTypeRegistry`
- `buildingTypes` → `BuildingTypeRegistry`

**References:** DD-011, DD-031, `docs/schemas/Recipe.Schema.md`

### Content validation orchestration

| Item | Path |
|---|---|
| Orchestrator | `validateGameContent.ts` |
| Building/recipe consistency | `validateBuildingRecipeConsistency.ts` |
| CLI tool | `tools/validate-content.ts` |
| Tests | `validateGameContent.test.ts`, `validateBuildingRecipeConsistency.test.ts` |

Run with: `pnpm validate-content` (add `--strict` for bidirectional building/recipe checks)

---

## Simulation Module (`src/simulation/`)

Deterministic simulation engine (first increment).

| Item | Path |
|---|---|
| `SimulationEngine` | `engine/SimulationEngine.ts` |
| `SimulationSystem` | `engine/SimulationSystem.ts` |
| `TickContext` | `engine/TickContext.ts` |
| `SimulationState` | `state/SimulationState.ts` |
| `TickClock` | `time/TickClock.ts` |
| Tests | `engine/SimulationEngine.test.ts` |

**Tick sequence:**

1. Advance clock
2. Execute registered systems (deterministic order)
3. Publish queued domain events via `IEventBus`
4. Update simulation state

**References:** DD-009, DD-027, `docs/architecture/runtime-view.md`

---

## Tooling and Configuration

| Change | Description |
|---|---|
| `vitest.config.ts` | Co-located tests under `src/**/*.test.ts` |
| `package.json` | `packageManager: pnpm@11.3.0`, dependency `yaml` |
| `pnpm-workspace.yaml` | `allowBuilds: esbuild: true` |
| Git | Initial repository commit with foundation layer |

---

# Static vs Dynamic Model (DD-015)

| Static definition (content) | Dynamic instance (domain) |
|---|---|
| `ResourceType` | Inventory item (planned) |
| `BuildingType` | `Building` |
| `Recipe` | Production job (planned) |

Content loaders produce immutable definitions. Domain aggregates represent player-specific state.

---

# Test Coverage Summary

| Module | Test file | Focus |
|---|---|---|
| Common / Identifier | `Identifier.test.ts` | Creation, validation, equality, immutability |
| Common / Entity | `Entity.test.ts` | Identity, equality |
| Common / ValueObject | `ValueObject.test.ts` | Structural equality |
| Common / AggregateRoot | `AggregateRoot.test.ts` | Domain event collection |
| Common / Result | `Result.test.ts` | ok/fail, map, flatMap, unwrap |
| Common / Guard | `Guard.test.ts` | Null, empty string, negative checks |
| Common / ManualClock | `ManualClock.test.ts` | Deterministic time control |
| Common / EventBus | `InMemoryEventBus.test.ts` | Subscribe, publish, order |
| Domain / Company | `Company.test.ts` | Creation, validation, events |
| Domain / Building | `Building.test.ts` | Placement, validation, events |
| Domain / Money | `Money.test.ts` | Amount, currency, validation |
| Domain / Quantity | `Quantity.test.ts` | Non-negative values |
| Content / ResourceType | `ResourceTypeLoader.test.ts` | Load, validate, duplicates |
| Content / BuildingType | `BuildingTypeLoader.test.ts` | Load, validate, duplicates |
| Content / Recipe | `RecipeLoader.test.ts` | Load, reference validation |
| Content / Consistency | `validateBuildingRecipeConsistency.test.ts` | Cross-registry checks |
| Content / All | `validateGameContent.test.ts` | Full content pipeline |
| Simulation / Engine | `SimulationEngine.test.ts` | Tick, determinism, pause |

---

# Planned Next Steps

1. Recipe reference validation for `requiredResearch` once research content exists
2. Additional domain value objects: `ResourceAmount`, `Capacity`
3. Simulation systems (production, market, finance)
4. Event queue and persistence integration for domain events
5. Repository interfaces and first infrastructure adapters

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
- `docs/decisions/DD-000-decision-index.md`
- `src/common/readme.md`
- `src/domain/readme.md`
- `src/content/readme.md`
