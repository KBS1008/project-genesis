# M7_WORLD_SIMULATION_PLAN.md

**Project:** Project Genesis  
**Milestone:** M7 – World Simulation  
**Status:** Planned  
**Planning Baseline:** Repository state after M6 closure  
**Primary Goal:** Introduce a deterministic, persisted and content-driven spatial world model without implementing M8 NPC economy.

---

# 1. Executive Summary

M7 adds the world structure in which the existing economic simulation operates.

The repository already contains:

- a deterministic `SimulationEngine`,
- a `SimulationState`,
- ordered simulation systems,
- production, research, market, finance, contract, building, company and transport systems,
- M6 transport routes, capacities and throughput queues,
- savegame snapshots,
- data-driven content loaders and registries,
- the accepted region-ready decision `DD-007`,
- the deterministic processing decision `DD-032`.

M7 therefore does **not** create a second simulation engine.

M7 extends the existing engine and domain model with:

- worlds,
- regions,
- biomes,
- map structure,
- cities and infrastructure nodes,
- regional resource availability,
- deterministic region processing,
- regional references on spatial runtime entities,
- savegame support,
- application read models for later UI integration.

M8 remains responsible for:

- autonomous AI companies,
- competitive market behavior,
- AI expansion,
- bankruptcy,
- long-term NPC decision-making.

---

# 2. Official Milestone Scope

The existing milestone plan defines these M7 deliverables:

```text
Regions / map / biomes
Infrastructure / cities
Regional resources
```

This plan translates them into implementable work packages.

---

# 3. Architectural Baseline

M7 must preserve the existing dependency direction:

```text
Content
    ↓
Domain
    ↓
Application
    ↓
Simulation
    ↓
Infrastructure / API / UI
```

The actual repository may use more specific module boundaries. Existing dependency rules and ADRs remain authoritative.

Relevant decisions and documents:

```text
DD-002 Data Driven
DD-003 Global Identifiers
DD-007 Region-Ready Architecture
DD-008 No Magic Numbers
DD-009 Deterministic Simulation
DD-015 Static Definitions vs Dynamic State
DD-024 Data-Driven Game Configuration
DD-025 ECS-Inspired Simulation Architecture
DD-027 Event-Driven Simulation Architecture
DD-029 Modular Monolith Architecture
DD-030 Configuration-Driven Game Content
DD-031 Game Content Organization
DD-032 Deterministic Tick Processing
DD-033 Savegame and Persistence Strategy
docs/gameplay/world.md
docs/architecture/runtime-view.md
docs/project-management/Biome.schema.md
```

Before implementation, Cursor must verify these documents against the current code and resolve contradictions through the established ADR process.

---

# 4. Core Principles

## 4.1 One Existing Simulation Engine

M7 uses the current `SimulationEngine`.

It must not introduce:

- a second world loop,
- a second scheduler,
- a separate real-time clock,
- direct `Date.now()` use,
- unordered parallel processing.

## 4.2 Static Content vs Runtime State

Static definitions:

```text
WorldDefinition
RegionDefinition
BiomeDefinition
MapDefinition or MapLayoutDefinition
CityDefinition
InfrastructureDefinition
RegionalResourceDefinition
```

Runtime state:

```text
WorldState
RegionState
CityState
InfrastructureState
RegionalResourceState
```

Only introduce a runtime type when mutable state is required.

## 4.3 Deterministic Ordering

World processing must be stable:

```text
World ID
    ↓
Region ID
    ↓
City / infrastructure / resource node ID
    ↓
Existing entity ID
```

Never rely on:

- filesystem iteration order,
- insertion order from unverified external sources,
- object property order as a business rule,
- random UUID ordering,
- system time.

## 4.4 Region-Ready, Single-Region Compatible

M7 must support multiple regions but remain compatible with a default single-region game.

Existing saves and tests must receive a deterministic default region through an explicit migration or bootstrap rule.

No scattered fallback such as:

```ts
regionId ?? 'default'
```

may be introduced throughout the codebase.

The fallback belongs in one migration/bootstrap boundary.

## 4.5 No M8 Behavior

M7 models the world and regional constraints.

It does not implement autonomous economic actors.

---

# 5. Target Domain Model

## 5.1 World

A world is the top-level spatial runtime context.

Minimum identity:

```text
WorldId
```

Expected responsibilities:

- identify the active world,
- expose its region membership,
- preserve deterministic region order,
- hold only genuinely global mutable state,
- provide controlled region lookup.

A world must not become a god object containing all business logic.

## 5.2 Region

Each spatial entity belongs to exactly one region, as required by `DD-007`.

Minimum region information:

```text
RegionId
WorldId
RegionDefinitionId
```

Potential runtime state, only where required:

```text
development level
infrastructure state
regional modifiers
resource deposits
city membership
```

The static `RegionDefinition` should describe stable content data such as:

```text
id
name
description
biomeId
mapId or map coordinates
neighborRegionIds
cityIds
infrastructure profile
regional resource profile
enabled
version
```

The exact contract must be derived from real gameplay needs and approved before implementation.

## 5.3 Biome

Biome is static content.

M7 must first audit the existing `docs/project-management/Biome.schema.md`.

That document currently appears broader and older than the implemented content conventions. It must not be copied directly into code without verification.

A v1 Biome contract should be minimal and tied to actual M7 rules.

Recommended v1 concerns:

```text
id
name
description
category
terrain class
construction cost modifier
transport duration or cost modifier
resource affinity/modifier data
enabled
version
```

Climate simulation, weather, wildlife and environmental hazards remain out of scope unless an existing accepted requirement demands them.

## 5.4 Map

The first M7 map model should be abstract and deterministic.

It must support:

- region placement,
- adjacency,
- distance or route-cost input,
- stable identifiers,
- validation of references.

It does not require:

- tile rendering,
- pathfinding,
- terrain meshes,
- procedural visual generation,
- geographic information systems,
- vehicle movement.

Recommended minimal representation:

```text
MapDefinition
├── id
├── name
├── regions[]
│   ├── regionId
│   ├── x
│   └── y
├── connections[]
│   ├── fromRegionId
│   ├── toRegionId
│   └── distance
├── enabled
└── version
```

The exact field names must follow repository conventions.

## 5.5 Cities

A city is a regional economic/infrastructure node.

M7 should implement only the minimum required model:

```text
CityId
RegionId
CityDefinitionId
```

Potential static data:

```text
name
category
base infrastructure capacity
market availability
workforce capacity or modifier
```

Potential mutable data:

```text
development level
active infrastructure
capacity usage
```

Do not implement population simulation unless explicitly required for M7 acceptance.

## 5.6 Infrastructure

Infrastructure represents regional capacities and connectivity.

M7 v1 should focus on constraints that integrate with existing systems:

- transport capacity modifiers,
- route availability,
- construction eligibility,
- regional storage or logistics hubs,
- optional energy connectivity only if the current energy model supports it.

Avoid introducing generic infrastructure abstractions with no consuming use case.

## 5.7 Regional Resources

Regional resources describe where resources can originate or be extracted.

Separate:

```text
RegionalResourceDefinition
    = static availability and parameters

RegionalResourceState
    = remaining quantity / regeneration / depletion
```

A minimal static model may contain:

```text
resourceTypeId
regionId
availability
extraction modifier
finite or renewable classification
```

A mutable deposit model is only necessary if M7 includes depletion.

M7 must explicitly decide between:

### Option A – Availability-only v1

Regions declare that certain resources are available.

No depletion is simulated.

### Option B – Deposits v1

Regions hold finite or renewable quantities that change during simulation.

Recommendation:

Start with **Option A**, unless existing production/extraction gameplay already requires deposit quantities.

---

# 6. Spatial Ownership Migration

M7 must audit all runtime entities that are spatial.

Candidates include:

- Building
- Company headquarters or company operating region
- Inventory tied to buildings or warehouses
- Market
- Transport route
- Transport order
- Contract endpoints
- Production jobs through their building
- City infrastructure

Not every entity needs a direct `regionId`.

Prefer deriving region through an unambiguous aggregate relationship.

Example:

```text
ProductionJob
    → BuildingId
    → Building.regionId
```

rather than duplicating `regionId` on the production job.

Direct region references are appropriate where the region is part of the entity's identity or routing contract.

---

# 7. Content Pipeline Plan

M7 should use the existing content pattern for each new static asset:

```text
Definition
Validator
Loader
Registry
YAML Content
Tests
Cross-Registry Validation
Schema Documentation
```

Potential content directories:

```text
game-content/worlds/
game-content/regions/
game-content/biomes/
game-content/maps/
game-content/cities/
game-content/infrastructure/
```

Do not create all directories automatically.

Only add asset types that are justified by the approved minimal contracts.

## 7.1 Required Reference Validation

Examples:

```text
RegionDefinition.biomeId
    ↓
BiomeRegistry

RegionDefinition.mapId
    ↓
MapRegistry

MapDefinition.regions[].regionId
    ↓
RegionRegistry

RegionDefinition.cityIds
    ↓
CityRegistry

RegionalResourceDefinition.resourceTypeId
    ↓
ResourceTypeRegistry
```

Circular loading dependencies must be avoided.

Where references are cyclic, use post-load cross-registry validation rather than loader-time resolution.

## 7.2 Bootstrap Integration

The global content bootstrap must:

1. load independent registries,
2. load dependent registries,
3. execute cross-registry validation,
4. construct the world bootstrap context,
5. fail before simulation startup on invalid content.

---

# 8. Simulation Integration

## 8.1 Region Processing

Existing simulation systems should not be duplicated per region unless profiling proves that architecture necessary.

Preferred initial strategy:

- repositories return deterministic spatial entities,
- systems group or filter by region,
- regions are processed in sorted `RegionId` order,
- each system preserves its existing business responsibility.

A new `WorldSimulationSystem` is justified only for world-specific state transitions, not as a wrapper around every existing system.

## 8.2 System Ordering

The current system order in `createDefaultSimulationSystems` and accepted runtime decisions is authoritative.

M7 may add a world/region system only after determining:

- what state it changes,
- which systems consume that state,
- its deterministic position,
- event ordering consequences.

Any ordering change requires tests and potentially an ADR update.

## 8.3 Events

Introduce domain events only for meaningful state changes, such as:

```text
WorldInitialized
RegionActivated
CityDevelopmentChanged
InfrastructureCapacityChanged
RegionalResourceAvailabilityChanged
```

Do not emit events every tick when nothing changed.

Event payloads must use stable IDs and simulation time.

## 8.4 Performance

Initial target:

- deterministic processing of multiple regions,
- no full scans where indexed repository queries exist,
- no premature parallelization,
- no map-rendering concerns in simulation code.

Add focused performance tests or benchmarks for region grouping and cross-region routing if the repository has an established benchmark pattern.

---

# 9. Logistics Integration

M6 established abstract routes and throughput queues.

M7 should extend, not replace, that model.

Required M7 integration:

- route endpoints become region-aware,
- interregional route definitions validate both regions,
- distance and biome/infrastructure modifiers may influence duration through policies,
- queues remain deterministic and isolated per route,
- existing M6 savegames are migrated to a default region.

Not in M7:

- physical vehicles,
- pathfinding,
- rendered movement,
- dynamic traffic simulation.

---

# 10. Market and Economy Integration

M7 should prepare regional market separation without implementing M8 AI behavior.

Minimum target:

- market identity can be associated with a region,
- trades can identify their regional market,
- regional market data remains deterministic,
- existing single-market flows remain functional through the default region.

Potentially in scope, only if required by accepted world design:

- regional price calculation inputs,
- transport cost between regional markets,
- market availability by city or region.

Out of scope:

- AI arbitrage,
- AI expansion decisions,
- competitive pricing strategy,
- NPC bankruptcy.

---

# 11. Building and Company Integration

## Buildings

A runtime building should belong to exactly one region.

Placement must validate:

- region exists,
- building is allowed in the region if constraints exist,
- map/region position is valid,
- infrastructure or city requirement is met if part of v1.

## Companies

A company may have:

- a home region,
- operations in multiple regions,
- buildings distributed across regions.

Do not constrain a company to exactly one region if `DD-007` and future expansion require multi-region operation.

A minimal M7 solution can introduce a deterministic home/default region while deriving operating regions from owned buildings.

---

# 12. Persistence and Migration

M7 changes the savegame model.

Required work:

- extend the snapshot schema,
- persist world identity and region state,
- persist region ownership for affected entities,
- restore in deterministic order,
- add migration from the current save schema,
- verify round-trip equality,
- reject invalid cross-region references,
- preserve old save compatibility according to `DD-033`.

Recommended migration rule:

```text
Existing save without world/region metadata
    ↓
assign configured default WorldId
    ↓
assign configured default RegionId to existing spatial entities
    ↓
validate migrated graph
```

The actual version increment must follow the existing savegame versioning strategy.

---

# 13. Application Layer

Required application capabilities may include:

```text
InitializeWorldUseCase
GetWorldOverviewQuery
GetRegionDetailsQuery
ListRegionsQuery
ListCitiesQuery
GetRegionalResourcesQuery
PlaceBuildingInRegionUseCase extension
CreateTransportRoute extension
```

Only implement commands and queries required for M7 acceptance or testability.

Read models should be UI-neutral.

---

# 14. API and UI Boundary

M7 is primarily domain/content/application/simulation work.

Minimal API/read-model exposure is acceptable to prove integration.

Do not turn M7 into M9.

Allowed:

- world overview endpoint/read model,
- region list,
- region details,
- map connectivity data,
- regional resource availability.

Not required:

- polished interactive map,
- animations,
- drag-and-drop map editing,
- accessibility polish beyond existing standards,
- complex visualization.

---

# 15. Work Packages

## M7-0 – Architecture and Contract Audit

Deliverables:

- audit existing world, scenario and biome documentation,
- inspect current simulation ordering,
- inspect spatial assumptions in entities and repositories,
- identify savegame migration impact,
- decide minimal v1 contracts,
- document contradictions,
- create ADR only where an unresolved architecture decision exists.

Exit criteria:

- implementation plan references exact existing files,
- no speculative asset type remains unexplained,
- default world/region migration strategy approved.

## M7-1 – World, Region and Biome Content Foundation

Deliverables:

- minimal definitions,
- validators,
- loaders,
- registries,
- YAML starter content,
- schema documents,
- deterministic loading,
- duplicate detection,
- reference validation.

Starter content should be minimal:

```text
1 world
2–4 regions
2–3 biomes
1 map
```

Exit criteria:

- invalid content fails before bootstrap,
- all references resolve,
- strict validation succeeds.

## M7-2 – Runtime World and Region Model

Deliverables:

- IDs/value objects,
- world/region runtime state where needed,
- repositories/ports,
- bootstrap creation,
- deterministic lookups,
- domain tests.

Exit criteria:

- world initializes from content,
- region order is deterministic,
- invalid membership is rejected.

## M7-3 – Spatial Ownership

Deliverables:

- region association for buildings,
- company home/default region if required,
- route endpoint migration,
- repository query updates,
- use-case validation,
- backwards-compatible constructors only where justified.

Exit criteria:

- every spatial building has one valid region,
- no duplicate region state exists on dependent entities,
- existing core gameplay remains operational.

## M7-4 – Map, Cities and Infrastructure

Deliverables:

- abstract map connectivity,
- city nodes,
- minimal infrastructure model,
- region/city reference validation,
- deterministic distance/connectivity policies.

Exit criteria:

- regions and cities form a valid graph,
- disconnected or invalid references are handled explicitly,
- no pathfinding or visual map dependency is introduced.

## M7-5 – Regional Resources

Deliverables:

- regional resource availability content,
- resource reference validation,
- query/service for availability,
- integration with extraction/building eligibility only if such flows exist,
- tests for unavailable resources and deterministic results.

Exit criteria:

- regional resources affect at least one real gameplay decision or remain explicitly read-only for M8/M10,
- no unsupported depletion model is implied.

## M7-6 – Simulation and Logistics Integration

Deliverables:

- deterministic region ordering,
- region-aware transport routes,
- optional biome/infrastructure duration policy,
- event integration,
- multi-region system tests.

Exit criteria:

- cross-region transport works,
- route queues remain isolated,
- repeated runs produce identical state and events.

## M7-7 – Persistence, Queries and Minimal Presentation Contract

Deliverables:

- save schema update,
- migration from current schema,
- round-trip tests,
- world/region read models,
- minimal API exposure if the current architecture requires it,
- no full map UI.

Exit criteria:

- old saves migrate,
- new saves round-trip,
- world data can be queried without exposing domain internals.

## M7-8 – Gate Audit and Closure

Deliverables:

- full quality gate execution,
- M7 audit report,
- implementation progress update,
- milestone plan update,
- technical debt entries for deferred features.

Exit criteria:

- all M7 acceptance criteria pass,
- M8 is unblocked,
- no M8 behavior was implemented accidentally.

---

# 16. Acceptance Criteria

M7 is complete when all of the following are true:

1. A world with multiple regions is loaded from validated content.
2. Every spatial building belongs to exactly one valid region.
3. The map defines deterministic region placement and connectivity.
4. Biome references are validated and affect only approved policies.
5. Cities and infrastructure nodes are associated with valid regions.
6. Regional resource availability is queryable and validated.
7. Interregional transport uses the existing M6 route/queue architecture.
8. Region processing order is deterministic.
9. Re-running the same simulation produces identical state and event order.
10. Savegames persist and restore the world and region graph.
11. Existing saves migrate to a deterministic default world and region.
12. Existing M4–M6 gameplay remains functional.
13. Content validation and strict content validation pass.
14. No NPC company decision-making is added.
15. No visual pathfinding or vehicle simulation is added.
16. Documentation and progress reports are synchronized.

---

# 17. Required Test Matrix

## Content

- valid world/region/biome/map content,
- malformed fields,
- invalid IDs,
- duplicate IDs,
- missing biome,
- missing region,
- invalid map connection,
- invalid ResourceType reference,
- deterministic loader order.

## Domain

- world creation,
- region membership,
- duplicate region prevention,
- immutable definitions,
- map connectivity,
- city-region membership,
- regional resource lookup.

## Application

- initialize world,
- list regions,
- get region details,
- place building in valid region,
- reject invalid region,
- create valid cross-region route,
- reject unknown endpoint.

## Simulation

- sorted region processing,
- deterministic event order,
- independent route queues,
- multi-region production/market isolation where implemented,
- no mutation when a regional validation fails.

## Persistence

- current save migration,
- new snapshot serialization,
- round-trip equality,
- invalid region reference rejection,
- deterministic restore order.

## Regression

- all existing tests,
- M4 core gameplay,
- M5 economy,
- M6 logistics,
- strict content validation.

---

# 18. Quality Gates

Run:

```bash
pnpm format
pnpm lint
pnpm typecheck
pnpm test
pnpm validate-content
pnpm validate-content --strict
pnpm build
pnpm build:web
```

Also run any repository-documented architecture, dependency or coverage checks.

No new ESLint errors are allowed.

Warnings may not increase without explicit justification.

---

# 19. Explicit Non-Goals

M7 does not include:

- AI companies,
- NPC expansion,
- NPC market strategy,
- bankruptcy simulation,
- world politics,
- weather simulation,
- seasons,
- environmental disasters,
- population simulation,
- detailed workforce geography,
- procedurally rendered terrain,
- pathfinding,
- traffic simulation,
- physical vehicles,
- multiplayer synchronization,
- full map UI,
- map editor,
- content expansion beyond minimal demonstration assets.

---

# 20. Key Risks and Controls

## Risk: World god object

Control:

- keep behavior in domain services/simulation systems,
- keep definitions immutable,
- use focused repositories and policies.

## Risk: Region ID duplication

Control:

- add region only where identity/routing requires it,
- derive it through aggregate relationships elsewhere.

## Risk: Savegame breakage

Control:

- explicit versioned migration,
- migration tests,
- no hidden defaults outside migration/bootstrap.

## Risk: Accidental M8 implementation

Control:

- no autonomous actors,
- no AI decisions,
- list all deferred NPC work in M8.

## Risk: Old documentation copied into code

Control:

- audit `Biome.schema.md`, `world.md` and `Scenario.schema.md`,
- derive minimal contracts from current needs,
- update docs only after code contract is agreed.

## Risk: Conflicting simulation descriptions

The repository contains both tick-oriented implementation/ADRs and older event-driven prose.

Control:

- current accepted ADRs and implemented engine are authoritative,
- do not create a second model,
- document or update stale prose through the normal governance process.

---

# 21. Definition of Done

M7 is done only when:

```text
Validated content
    +
deterministic runtime world
    +
region-aware spatial entities
    +
map/city/infrastructure foundation
    +
regional resources
    +
M6 logistics integration
    +
savegame migration
    +
tests and documentation
```

are complete and the milestone gate report explicitly marks M7 as passed.
