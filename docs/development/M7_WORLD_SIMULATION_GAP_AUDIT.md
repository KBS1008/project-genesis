# M7-0 — World Simulation Gap Audit

**Project:** Project Genesis  
**Date:** 2026-07-19  
**Baseline:** Phase 1 complete (`5835930`), M6 closed (AUD-004)  
**Plan:** `docs/project-management/M7_WORLD_SIMULATION_PLAN.md`  
**Status:** Audit complete — **no implementation in this step**

---

# Executive Summary

M7 is **greenfield in code and content**. The repository has a mature deterministic simulation stack (M4–M6) on a **flat, single-region-equivalent** spatial model:

- Buildings use company-local grid `Position` (x/y) only.
- One global market (`market_global`).
- M6 transport routes resolve by building category/type, not geography.
- Savegames are frozen at **`GameSaveSnapshotV1`** with strict version rejection and **no migration**.
- **`regionId` / `worldId` do not appear anywhere in `src/`.**

Accepted ADRs (`DD-007`, `DD-032`) and gameplay docs (`world.md`, `domain-model.md`) describe multi-region worlds that **are not implemented**. Implementation must follow **current tested code + ADRs**, not copy aspirational prose or DD-007’s example file layout verbatim.

**Recommended v1 path:**

1. M7-1 — minimal content (1 world, 2–4 regions, 2–3 biomes, 1 map, 1–3 cities)
2. M7-2 — runtime world/region bootstrap from content
3. M7-3 — `Building.regionId` + placement validation (derive region elsewhere)
4. M7-7 — `GameSaveSnapshotV2` + **single** v1→v2 migration boundary
5. M7-4/5/6 — map connectivity, Option A regional resources, region-aware transport policies
6. M7-8/9 — gate report and progress sync

**No new ADR required** unless market regionalization or simulation ordering cannot be resolved during M7-1 contract review.

---

# 1. Already Present (reuse, do not replace)

## Simulation engine (keep)

| Component | Path |
| --- | --- |
| Simulation engine | `src/simulation/engine/SimulationEngine.ts` |
| Tick context / state | `src/simulation/engine/TickContext.ts`, `SimulationState.ts` |
| System pipeline factory | `src/simulation/systems/createDefaultSimulationSystems.ts` |
| Pipeline order test | `src/simulation/systems/createDefaultSimulationSystems.test.ts` |

**Authoritative system order** (line 23 comment + test):

```text
Company → Building → Transport → Production → Research → Market → Contract → Finance
```

Do **not** create a second engine or per-region duplicate systems in v1.

## Spatial model today (company-local)

| Component | Path | Notes |
| --- | --- | --- |
| Position VO | `src/domain/building/Position.ts` | x/y only |
| Building aggregate | `src/domain/building/Building.ts` | No `regionId` |
| Place building | `src/application/use-cases/PlaceBuildingUseCase.ts` | Validates position, not region |
| Starter layout | `src/application/new-game/NewGameSetupConstants.ts` | Hard-coded x/y |

## Market (global v1 baseline)

| Component | Path |
| --- | --- |
| Global market ID | `src/domain/market/MarketConstants.ts` (`market_global`) |
| Market aggregate | `src/domain/market/Market.ts` |
| Market seeder | `src/application/services/MarketPriceSeeder.ts` |

## Transport (M6 — extend, do not replace)

| Component | Path |
| --- | --- |
| Route content | `src/content/logistics/TransportRouteDefinition.ts`, `game-content/logistics/` |
| Duration policy | `src/domain/policies/transport/TransportRouteDurationPolicy.ts` |
| Throughput policy | `src/domain/policies/transport/TransportNetworkThroughputPolicy.ts` |
| Transport orders | `src/domain/transport/TransportOrder.ts` |
| Logistics service | `src/application/services/TransportLogisticsService.ts` |

## Content pipeline (pattern to copy)

| Component | Path |
| --- | --- |
| Orchestrator | `src/content/validateGameContent.ts` |
| Load result type | `GameContentLoadResult` (7 registries today) |
| Cross-validators | `validateEmployeeReferences`, `validateResearchReferences`, `validateMilestoneReferences`, `validateBuildingRecipeConsistency`, `validateTransportRouteReferences` |
| Implemented dirs | `game-content/{resources,milestones,research,buildings,employees,recipes,logistics}/` |

## Persistence

| Component | Path |
| --- | --- |
| Save schema v1 | `src/application/persistence/GameSaveSnapshotV1.ts` |
| Serializer | `src/infrastructure/persistence/savegame/GameStateSerializer.ts` |
| Restore | `src/application/bootstrap/restoreApplicationFromSnapshot.ts` |
| Version gate | `parse()` rejects `schemaVersion !== 1` |

## Phase 1 / M7 prep notes in code

| Location | Statement |
| --- | --- |
| `src/domain/company/README.md` | World/region deferred to M7+ |
| `src/simulation/systems/company/CompanySimulationSystem.ts` | Documented no-op stub |

---

# 2. Missing (must implement for M7)

## Content layer (M7-1)

No files under `src/content/` or `game-content/` for:

- World, Region, Biome, Map, City
- Regional resource availability (Option A)
- Cross-registry world graph validation

No schema docs under `docs/schemas/` for World/Region/Map/City (Biome only in `docs/project-management/Biome.schema.md`).

## Domain runtime (M7-2)

No types in `src/domain/`:

- `WorldId`, `RegionId`, `CityId`
- World/Region runtime state (minimal)
- World/Region repositories (ports + in-memory impl)

## Spatial ownership (M7-3)

- `Building.regionId` (required direct field)
- Placement and new-game bootstrap assign valid region
- Optional `Company` home/default region (minimal)
- Region-scoped repository queries where needed

## Map / cities / infrastructure (M7-4)

- Abstract map connectivity (no tiles/pathfinding)
- City nodes bound to regions
- Infrastructure only as **consumed policies** (route duration, construction eligibility)

## Regional resources (M7-5)

- Option A: availability flags + modifiers, **no depletion**

## Simulation integration (M7-6)

- Deterministic region ordering in affected code paths
- Region-aware transport route validation
- Preserve M6 FIFO/throughput behavior
- `WorldSimulationSystem` only if real world state transitions exist (likely minimal or deferred)

## Persistence (M7-7)

- `GameSaveSnapshotV2` (or schema version 2)
- World + region fields on snapshot
- Building (and market) region ownership
- **Central** v1→v2 migration in serializer parse
- Round-trip and migration tests

## Application read models (M7-8)

- `GetWorldOverview`, `ListRegions`, `GetRegionDetails`, `ListCities`, `GetRegionalResources`
- Minimal API only if existing NestJS pattern requires it for acceptance

---

# 3. Must Extend (existing files — targeted changes)

| Area | Files |
| --- | --- |
| Building | `Building.ts`, `BuildingRepository.ts`, `InMemoryBuildingRepository.ts`, `PlaceBuildingUseCase.ts`, `StartNewGameUseCase.ts` |
| Company | `Company.ts` (optional home region), save snapshot types |
| Market | `Market.ts`, `MarketConstants.ts`, seeder/trade — map `market_global` → default region |
| Transport content | `TransportRouteDefinition.ts`, validator — optional inter-region endpoints |
| Transport policy | `TransportRouteDurationPolicy.ts` — map distance/biome modifiers |
| Transport runtime | `TransportLogisticsService.ts` — cross-region rules via building regions |
| Content bootstrap | `validateGameContent.ts`, `GameContentLoadResult`, new validators |
| Application bootstrap | `bootstrapApplication.ts`, `restoreApplicationFromSnapshot.ts`, `ApplicationContext.ts` |
| Savegame | `GameSaveSnapshotV1.ts` → V2, `GameStateSerializer.ts` |
| Simulation | `createDefaultSimulationSystems.ts` — only if world system justified |
| Docs | `src/content/readme.md` (lists non-existent `world/`, `regions/` dirs) |

**Do not duplicate `regionId`** on ProductionJob, TransportOrder, etc. when derivable from Building (per M7 plan §6).

---

# 4. Outdated or Contradictory (docs vs code)

| Source | Says | Code reality | Resolution |
| --- | --- | --- | --- |
| `DD-007-region-ready.md` §Implementierung | `src/world/Region.ts`, `game-content/regions/` exist | **Zero files** | Implement M7 plan layout under `src/domain/world/` (or equivalent), not blind copy of DD-007 paths |
| `DD-007` | Every spatial object has `regionId` | No region fields | M7-3 adds to Building (+ market mapping) |
| `world.md` | Per-region markets | Single `market_global` | v1: map global market to default region; regional markets later |
| `domain-model.md` | World/Region aggregates | Not in `src/domain/` | Implement minimal subset in M7-2 |
| `Biome.schema.md` | Climate, wildlife, hazards | Over-scoped for M7 v1 | Minimal biome: category + construction/logistics modifiers only |
| `Scenario.schema.md` | `world.biome`, `world.map` | No scenario loader | Out of M7 unless required for acceptance |
| `src/content/readme.md` | `game-content/world/`, `regions/` | Directories absent | Fix when M7-1 lands |
| `validateGameContent.ts` header comment | 6 load steps | 7 loads + 5 cross-validators | Update comment in M7-1 |
| DD-007 §Simulation vs DD-032 vs factory | Different per-region order prose | Single global pipeline | **Factory order is authoritative**; region loops inside systems, not duplicate systems |

**Authority stack** (when docs conflict):

1. Accepted ADRs (behavioral intent)
2. Implemented + tested code
3. M7_WORLD_SIMULATION_PLAN.md
4. Gameplay prose / aspirational architecture docs

---

# 5. Explicitly Out of Scope (M7)

From plan §19 and user prompt:

- AI/NPC companies, competitive behavior, bankruptcy
- Pathfinding, physical vehicles, traffic simulation
- Weather, seasons, population simulation
- Full map UI, map editor
- M8, M9, M10 features
- Procedural terrain / GIS

---

# 6. v1 Content Contract Decisions (M7-0 approval)

These are **minimal** contracts — no speculative fields.

## WorldDefinition

```yaml
id: string
name: string
regionIds: string[]      # sorted unique refs
enabled: boolean
version: number
```

## RegionDefinition

```yaml
id: string
name: string
description: string
worldId: string
biomeId: string
mapPosition: { x: number, y: number }   # embedded in region OR via MapDefinition — pick one in M7-1
neighborRegionIds: string[]
cityIds: string[]
regionalResources: RegionalResourceEntry[]   # Option A embedded, avoids separate asset type
enabled: boolean
version: number
```

## BiomeDefinition

```yaml
id: string
name: string
description: string
category: string
constructionCostModifier: number    # e.g. 1.0 default
transportDurationModifier: number   # e.g. 1.0 default
enabled: boolean
version: number
```

**Exclude from v1:** climate, precipitation, wildlife, hazards, seasonal variation (per `Biome.schema.md` trim).

## MapDefinition

```yaml
id: string
name: string
regions: [{ regionId, x, y }]
connections: [{ fromRegionId, toRegionId, distance }]
enabled: boolean
version: number
```

## CityDefinition

```yaml
id: string
name: string
regionId: string
category: string          # e.g. MARKET_HUB, INDUSTRIAL
enabled: boolean
version: number
```

## Regional resources — **Option A (approved for v1)**

Embed in `RegionDefinition.regionalResources`:

```yaml
- resourceTypeId: wood
  available: true
  extractionModifier: 1.0
```

- No depletion/regeneration state
- Must be queryable and affect at least one decision (building eligibility or read model)

## Separate InfrastructureDefinition?

**Defer** unless M7-4 audit shows no consumer. Prefer biome + map connection modifiers for transport duration in v1.

---

# 7. Default World / Region Migration Strategy

## Content-defined defaults (not scattered magic strings)

```text
game-content/worlds/world_default.yaml     → id: world.default
game-content/regions/region_default.yaml   → id: region.default, worldId: world.default
```

Constants may re-export these IDs from a single module (e.g. `WorldConstants.ts`) **referencing content IDs**, not ad-hoc literals in domain logic.

## Savegame

| Item | Decision |
| --- | --- |
| New version | `GAME_SAVE_SCHEMA_VERSION = 2` |
| v1 compatibility | Migrate in `GameStateSerializer.parse()` only |
| v1 rule | Assign `world.default` + `region.default` to all buildings and map `market_global` to default region |
| Validation | After migration, validate all region refs against loaded content |
| Forbidden | `regionId ?? 'default'` outside migration/bootstrap |

## New games

- `StartNewGameUseCase` / `PlaceBuildingUseCase`: assign `region.default` (or scenario region when scenarios exist)
- World context initialized once at bootstrap from registries

---

# 8. Cross-Registry Validation (M7-1)

Post-load checks (add to `validateGameContent.ts`):

```text
Region.worldId           → WorldRegistry
Region.biomeId           → BiomeRegistry
Region.cityIds[]         → CityRegistry
Region.regionalResources[].resourceTypeId → ResourceTypeRegistry
Map.regions[].regionId   → RegionRegistry
Map.connections          → RegionRegistry (both endpoints)
City.regionId            → RegionRegistry
World.regionIds[]        → RegionRegistry
Region.neighborRegionIds → RegionRegistry (optional symmetry check)
TransportRoute (if extended) → RegionRegistry for inter-region endpoints
```

Load order proposal:

1. ResourceTypes (existing)
2. Biomes (independent)
3. Worlds (regionIds only — validate after regions loaded OR two-pass)
4. Regions (needs biomes, worlds)
5. Maps (needs regions)
6. Cities (needs regions)
7. Existing: milestones, technologies, buildings, employees, recipes, transport routes
8. Cross-validators (existing + world graph)

**Cycle handling:** World↔Region references resolved by post-load validation, not loader-time eager resolution.

---

# 9. Simulation Integration Notes (M7-6)

- Keep `createDefaultSimulationSystems` order unless profiling + ADR update proves otherwise.
- Process regions in sorted `RegionId` order **inside** existing systems where spatial grouping is needed.
- M6 route queues: remain per-route FIFO; inter-region routes get distinct route IDs.
- Biome/infrastructure effects: extend `TransportRouteDurationPolicy` / `ConstructionCostPolicy` with testable inputs — no new generic infrastructure platform.

---

# 10. Work Package Readiness

| WP | Blockers cleared by M7-0 | Next action |
| --- | --- | --- |
| M7-0 | ✅ This document | User/plan approval |
| M7-1 | Contracts above | Implement loaders + starter YAML |
| M7-2 | M7-1 | Domain IDs + bootstrap |
| M7-3 | M7-2 | Building.regionId |
| M7-4 | M7-1, M7-2 | Map + cities |
| M7-5 | M7-1, M7-2 | Option A queries |
| M7-6 | M7-3, M7-4 | Transport + region ordering |
| M7-7 | M7-3 field shapes | Save V2 + migration |
| M7-8 | M7-7 | Read models / minimal API |
| M7-9 | All | Gate report |

---

# 11. M7-0 Exit Criteria

| Criterion | Status |
| --- | --- |
| Gap plan with present / missing / extend / contradictions / out-of-scope | ✅ |
| v1 contracts decided (no speculative fields) | ✅ |
| Default world/region migration strategy documented | ✅ |
| References exact existing files | ✅ |
| No code changes in M7-0 | ✅ |

---

# 12. Recommended Next Step

**M7-1 — Content Foundation** with starter assets:

```text
1 world (world.default)
3 regions (region.default + 2 neighbors for inter-region tests)
2 biomes
1 map (3 region positions + 2 connections)
2 cities
```

After M7-1: run `pnpm validate-content` and `pnpm validate-content --strict` before M7-2.

---

# References

```text
docs/project-management/M7_WORLD_SIMULATION_PLAN.md
docs/decisions/DD-007-region-ready.md
docs/decisions/DD-033-Savegame-and-Persistence-Strategy.md
docs/quality/PHASE1_CORE_DOMAIN_REPORT.md
src/simulation/systems/createDefaultSimulationSystems.ts
src/application/persistence/GameSaveSnapshotV1.ts
src/content/validateGameContent.ts
```
