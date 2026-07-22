# GameSaveSnapshotV3.schema.md

**Version:** 1.0.0  
**Status:** Active (implementation contract — Phase 8)  
**Schema Version:** 3  
**Created:** 2026-07-22

---

# Purpose

Defines the **concrete JSON snapshot contract** for savegame schema version **3**.

DD-033 describes persistence architecture. This document specifies the **exact fields, types, ordering rules, validation, and migration boundary** required before implementing:

- `GameSaveSnapshotV3.ts`
- `migrateGameSaveSnapshotV2ToV3.ts`
- `GameStateSerializer` v3 serialize/parse/restore

V3 extends V2. It does not replace earlier versions. Migration remains centralized in the serializer.

---

# Version Chain

```text
V1 ──migrate──► V2 ──migrate──► V3
```

| Version | Introduced by | Primary addition |
| ------- | ------------- | ---------------- |
| 1       | M4/M5         | Core aggregates, optional regional fields |
| 2       | M7            | `world`, required building/transport regions, `marketRegionMappings` |
| 3       | M8 Phase 8    | `companyBrains[]`, normalized `regionalMarkets[]` |

Direct load into V3 without sequential migration is **not supported**.

---

# Root Snapshot

```text
GameSaveSnapshotV3
├── schemaVersion: 3
├── savedAtUtc: ISO-8601 string
├── world                          (V2)
├── marketRegionMappings           (V2, legacy global-market mapping)
├── simulation                     (V2)
├── companies[]                    (V2, unchanged)
├── companyBrains[]                (V3, new)
├── regionalMarkets[]              (V3, replaces V2 `markets[]`)
├── buildings[]                    (V2)
├── inventories[]                  (V2)
├── financeAccounts[]              (V2)
├── productionJobs[]               (V2)
├── researchJobs[]                 (V2)
├── companyResearch[]              (V2)
├── companyMilestones[]            (V2)
├── buildingStorages[]             (V2)
├── transportOrders[]              (V2)
├── employees[]                    (V2)
├── supplyContracts?               (V2, optional)
└── tickMetricsHistory?            (V2, optional)
```

**Breaking rename (V2 → V3):** top-level `markets` becomes `regionalMarkets`. No other top-level keys are removed.

---

# TypeScript Contract (target)

Implementation shall mirror these types in `src/application/persistence/GameSaveSnapshotV3.ts`.

```typescript
export const GAME_SAVE_SCHEMA_VERSION = 3 as const;

export type GameSaveSnapshotV3 = {
  readonly schemaVersion: typeof GAME_SAVE_SCHEMA_VERSION;
  readonly savedAtUtc: string;
  readonly world: GameSaveWorldSnapshotV2;
  readonly marketRegionMappings: readonly GameSaveMarketRegionMappingSnapshotV2[];
  readonly simulation: GameSaveSimulationSnapshotV1;
  readonly companies: readonly GameSaveCompanySnapshotV1[];
  readonly companyBrains: readonly GameSaveCompanyBrainSnapshotV3[];
  readonly regionalMarkets: readonly GameSaveRegionalMarketSnapshotV3[];
  readonly buildings: readonly GameSaveBuildingSnapshotV2[];
  readonly inventories: readonly GameSaveInventorySnapshotV1[];
  readonly financeAccounts: readonly GameSaveFinanceAccountSnapshotV1[];
  readonly productionJobs: readonly GameSaveProductionJobSnapshotV1[];
  readonly researchJobs: readonly GameSaveResearchJobSnapshotV1[];
  readonly companyResearch: readonly GameSaveCompanyResearchSnapshotV1[];
  readonly companyMilestones: readonly GameSaveCompanyMilestonesSnapshotV1[];
  readonly buildingStorages: readonly GameSaveBuildingStorageSnapshotV1[];
  readonly transportOrders: readonly GameSaveTransportOrderSnapshotV2[];
  readonly employees: readonly GameSaveEmployeeSnapshotV1[];
  readonly supplyContracts?: readonly GameSaveSupplyContractSnapshotV1[];
  readonly tickMetricsHistory?: GameSaveTickMetricsHistorySnapshotV1;
};
```

Reuse V1/V2 nested types unless noted below. Import from `GameSaveSnapshotV1.ts` / `GameSaveSnapshotV2.ts`.

---

# Company Brains (`companyBrains[]`)

One entry per autonomous company brain aggregate. Player companies without a brain are omitted.

## `GameSaveCompanyBrainSnapshotV3`

| Field            | Type                                      | Required | Description |
| ---------------- | ----------------------------------------- | -------- | ----------- |
| `brainId`        | string                                    | yes      | Stable brain identifier (`brain_{companyId}` convention) |
| `companyId`      | string                                    | yes      | Owning company; must exist in `companies[]` |
| `createdAt`      | number                                    | yes      | Simulation tick/time when brain was created |
| `activeStrategy` | `GameSaveActiveStrategySnapshotV3`        | no       | Omitted when no strategy assigned |
| `goals`          | `GameSaveGoalSnapshotV3[]`                | yes      | May be empty |
| `knowledge`      | `GameSaveKnowledgeSnapshotV3[]`           | yes      | May be empty |
| `memory`         | `GameSaveMemorySnapshotV3[]`              | yes      | May be empty |
| `decisionQueue`  | `GameSaveCompanyDecisionSnapshotV3[]`     | yes      | Full queue in execution order; may be empty |

### `GameSaveActiveStrategySnapshotV3`

| Field                    | Type   | Required |
| ------------------------ | ------ | -------- |
| `strategyDefinitionId`   | string | yes      |
| `appliedAtTick`          | number | yes      |

References content in `game-content/strategies/` (see `Strategy.schema.md`). Strategy **definitions** are not embedded.

### `GameSaveGoalSnapshotV3`

| Field             | Type   | Required | Notes |
| ----------------- | ------ | -------- | ----- |
| `id`              | string | yes      | Goal identifier |
| `kind`            | string | yes      | One of `GoalKind` (`src/domain/brain/GoalKind.ts`) |
| `description`     | string | yes      | Human-readable label |
| `priority`        | number | yes      | `>= 0` |
| `status`          | string | yes      | `ACTIVE` \| `COMPLETED` \| `CANCELLED` |
| `createdAtTick`   | number | yes      | Simulation tick when goal was created |
| `regionId`        | string | no       | Context for regional goals |
| `resourceId`      | string | no       | Context for resource goals |
| `buildingTypeId`  | string | no       | Context for expansion goals |
| `technologyId`    | string | no       | Context for research goals |

### `GameSaveKnowledgeSnapshotV3`

| Field             | Type                              | Required |
| ----------------- | --------------------------------- | -------- |
| `id`              | string                            | yes      |
| `kind`            | string                            | yes      | One of `KnowledgeKind` |
| `key`             | string                            | yes      | Deterministic lookup key |
| `observedAtTick`  | number                            | yes      |
| `value`           | `GameSaveKnowledgeValueSnapshotV3`| yes      |
| `regionId`        | string                            | no       |
| `resourceId`      | string                            | no       |
| `companyId`       | string                            | no       |
| `technologyId`    | string                            | no       |

### `GameSaveKnowledgeValueSnapshotV3`

Discriminated union:

| `kind`    | `value` type |
| --------- | ------------ |
| `NUMBER`  | number       |
| `STRING`  | string       |
| `BOOLEAN` | boolean      |

### `GameSaveMemorySnapshotV3`

| Field             | Type                              | Required |
| ----------------- | --------------------------------- | -------- |
| `id`              | string                            | yes      |
| `kind`            | string                            | yes      | One of `MemoryKind` |
| `observedAtTick`  | number                            | yes      |
| `payload`         | `Record<string, string \| number \| boolean>` | yes | Deterministically keyed (see ordering) |
| `expiresAtTick`   | number                            | no       |
| `regionId`        | string                            | no       |
| `resourceId`      | string                            | no       |
| `companyId`       | string                            | no       |

### `GameSaveCompanyDecisionSnapshotV3`

| Field           | Type                                   | Required |
| --------------- | -------------------------------------- | -------- |
| `id`            | string                                 | yes      |
| `type`          | string                                 | yes      | One of `CompanyDecisionType` |
| `status`        | string                                 | yes      | One of `CompanyDecisionStatus` |
| `layer`         | string                                 | yes      | `STRATEGIC` \| `OPERATIONAL` \| `TACTICAL` |
| `priority`      | number                                 | yes      | `>= 0` |
| `createdAtTick` | number                                 | yes      |
| `payload`       | `GameSaveCompanyDecisionPayloadSnapshotV3` | yes  |

#### Decision payload variants

Payload uses the same discriminated shape as `CompanyDecisionPayload`:

| `payload.type`      | `payload.data` fields |
| ------------------- | --------------------- |
| `PURCHASE_RESOURCE` | `resourceId`, `quantity`, `regionId` |
| `SELL_RESOURCE`     | `resourceId`, `quantity`, `regionId` |
| `START_PRODUCTION`  | `jobId`, `buildingId`, `recipeId`, `batches` |
| `PLACE_BUILDING`    | `buildingId`, `buildingTypeId`, `name`, `regionId`, `mapX`, `mapY` |
| `START_RESEARCH`    | `jobId`, `technologyId` |
| `EXPAND_REGION`     | `targetRegionId` |

---

# Regional Markets (`regionalMarkets[]`)

Authoritative persisted state for regional `Market` aggregates. Replaces V2 `markets[]` with required regional economics fields.

## `GameSaveRegionalMarketSnapshotV3`

| Field          | Type                                           | Required |
| -------------- | ---------------------------------------------- | -------- |
| `id`           | string                                         | yes      | Market aggregate id (e.g. `market_{regionId}`) |
| `regionId`     | string                                         | yes      | Owning region |
| `createdAt`    | number                                         | yes      |
| `prices`       | `GameSaveRegionalMarketPriceSnapshotV3[]`      | yes      | May be empty only before seeding |
| `priceHistory` | `GameSaveRegionalMarketPriceHistorySnapshotV3[]` | yes    | Required array; empty allowed |

### `GameSaveRegionalMarketPriceSnapshotV3`

| Field         | Type   | Required | Notes |
| ------------- | ------ | -------- | ----- |
| `resourceId`  | string | yes      | |
| `basePrice`   | number | yes      | From content at seed time |
| `lastPrice`   | number | yes      | |
| `tradeVolume` | number | yes      | `>= 0` |
| `updatedAt`   | number | yes      | Simulation tick of last update |
| `supply`      | number | yes      | `>= 0` (required in V3; was optional in V1 market snapshot) |
| `demand`      | number | yes      | `>= 0` |
| `liquidity`   | number | yes      | `>= 0` |

### `GameSaveRegionalMarketPriceHistorySnapshotV3`

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| `tick`        | number | yes      |
| `resourceId`  | string | yes      |
| `price`       | number | yes      |
| `tradeVolume` | number | yes      |
| `supply`      | number | yes      |
| `demand`      | number | yes      |
| `liquidity`   | number | yes      |

History length is bounded at runtime by `MARKET_PRICE_HISTORY_LIMIT` (100). Serializer persists the full in-memory ring buffer as stored at save time.

---

# Deterministic Ordering Rules

Byte-identical JSON is not required, but **semantic restore order must be stable**. The serializer **must** emit arrays in the orders below. On parse, the serializer **may re-sort** into canonical order before validation and hydration.

All string comparisons use **UTF-16 code unit order** (`localeCompare` default in TypeScript / ECMAScript).

## Top-level arrays

| Array               | Sort key |
| ------------------- | -------- |
| `companies`         | `id` ascending |
| `companyBrains`     | `companyId` ascending; tie-break `brainId` ascending |
| `regionalMarkets`   | `regionId` ascending; tie-break `id` ascending |
| All other V2 arrays | Existing repository iteration order preserved; implementation should sort by primary aggregate `id` ascending where not already guaranteed |

## Within each `companyBrains[]` entry

| Array            | Sort key |
| ---------------- | -------- |
| `goals`          | `id` ascending |
| `knowledge`      | `kind` ascending, then `id` ascending |
| `memory`         | `observedAtTick` ascending, then `id` ascending |
| `decisionQueue`  | Execution order: `priority` **descending**, then `createdAtTick` ascending, then `id` ascending (same as `compareDecisionsForExecution`) |

## Within each `regionalMarkets[]` entry

| Array          | Sort key |
| -------------- | -------- |
| `prices`       | `resourceId` ascending |
| `priceHistory` | `tick` ascending, then `resourceId` ascending |

## Object key ordering (JSON)

For deterministic file diffs and replay tests, nested objects with dynamic keys shall be serialized with keys sorted ascending:

- `memory[].payload` — sort keys lexicographically before write

---

# Restore Mapping

| Snapshot section    | Domain hydration |
| ------------------- | ---------------- |
| `companyBrains[]`   | `CompanyBrain.restore()` via `InMemoryCompanyBrainRepository` |
| `regionalMarkets[]` | `Market` restore path in `GameStateSerializer` (existing `#restoreMarket`, extended for required fields) |
| V2 sections         | Unchanged restore helpers |

Brain restore input maps directly to `RestoreCompanyBrainParams`:

- `decisionQueue` → `decisions` argument to `CompanyBrain.restore()`
- Duplicate ids within a brain fail validation before hydration

---

# Validation on Load

Before mutating repositories:

1. `schemaVersion === 3` after migration chain completes.
2. Every `companyBrains[].companyId` references an existing `companies[].id`.
3. At most **one** brain per `companyId`; unique `brainId` values.
4. Every `regionalMarkets[].regionId` is non-empty; unique per market row.
5. Enum fields match domain constants (`GoalKind`, `KnowledgeKind`, `MemoryKind`, decision type/status/layer).
6. No duplicate ids inside `goals`, `knowledge`, `memory`, or `decisionQueue` within one brain.
7. `decisionQueue` order matches canonical execution order (re-sort or reject if violated — implementation should **re-sort** then validate uniqueness).
8. `regionalMarkets[].prices` has unique `resourceId` per market.
9. Pending domain events must be **empty** before save (unchanged from V2).

Invalid snapshots fail with `ValidationError` before repository hydration.

---

# Migration V2 → V3

Single function: `migrateGameSaveSnapshotV2ToV3(v2: GameSaveSnapshotV2): GameSaveSnapshotV3`

Rules:

| V2 field    | V3 mapping |
| ----------- | ---------- |
| `markets`   | → `regionalMarkets` with normalization (see below) |
| (missing)   | → `companyBrains: []` |
| all others  | copied unchanged |

Normalization for each V2 market row:

```text
regionalMarkets[] = markets.map(market => ({
  id: market.id,
  regionId: market.regionId ?? DEFAULT_REGION_ID,
  createdAt: market.createdAt,
  prices: market.prices.map(price => ({
    ...price,
    supply: price.supply ?? 0,
    demand: price.demand ?? 0,
    liquidity: price.liquidity ?? 0,
  })),
  priceHistory: market.priceHistory ?? [],
}))
```

After normalization, apply deterministic sorting rules before returning the snapshot.

**Semantic note:** migration must not change simulation economics — missing optional fields default to zero / empty array only where V2 allowed omission.

---

# Transient State (never serialized)

Per DD-033 and DD-037:

- planning observer caches
- analyser heuristics / scores
- search trees
- intermediate calculations
- domain event queues
- DI / bootstrap wiring

---

# Example (minimal)

```json
{
  "schemaVersion": 3,
  "savedAtUtc": "2026-07-22T17:00:00.000Z",
  "world": { "activeWorldId": "world_default" },
  "marketRegionMappings": [],
  "simulation": {
    "clockTime": 42,
    "tickNumber": 42,
    "paused": false,
    "tickDuration": 1
  },
  "companies": [
    {
      "id": "company_npc_001",
      "name": "NPC Steel Co",
      "ownerId": "owner_system",
      "foundedAt": 0,
      "status": "ACTIVE"
    }
  ],
  "companyBrains": [
    {
      "brainId": "brain_company_npc_001",
      "companyId": "company_npc_001",
      "createdAt": 0,
      "activeStrategy": {
        "strategyDefinitionId": "strategy_manufacturer",
        "appliedAtTick": 0
      },
      "goals": [],
      "knowledge": [],
      "memory": [],
      "decisionQueue": []
    }
  ],
  "regionalMarkets": [
    {
      "id": "market_region_default",
      "regionId": "region_default",
      "createdAt": 0,
      "prices": [
        {
          "resourceId": "wood",
          "basePrice": 10,
          "lastPrice": 10,
          "tradeVolume": 0,
          "updatedAt": 0,
          "supply": 100,
          "demand": 50,
          "liquidity": 1
        }
      ],
      "priceHistory": []
    }
  ],
  "buildings": [],
  "inventories": [],
  "financeAccounts": [],
  "productionJobs": [],
  "researchJobs": [],
  "companyResearch": [],
  "companyMilestones": [],
  "buildingStorages": [],
  "transportOrders": [],
  "employees": []
}
```

---

# Testing Requirements (Phase 8)

Before closing M8 Phase 8:

| Test | Requirement |
| ---- | ----------- |
| Round-trip | serialize → parse → hydrate reproduces brain and regional market state |
| V2 migration | known V2 fixture migrates to valid V3; economics unchanged |
| Ordering | unsorted input arrays normalize to canonical order on parse |
| Integrity | duplicate brain/goal/decision ids rejected |
| Determinism | save → load → N ticks equals continue-without-save baseline |

---

# Related Documentation

- `docs/decisions/DD-033-Savegame-and-Persistence-Strategy.md`
- `docs/architecture/decisions/DD-037-Company-Brain-and-Decision-Queue.md`
- `docs/schemas/Strategy.schema.md`
- `src/application/persistence/GameSaveSnapshotV2.ts`
- `src/domain/brain/DecisionQueue.ts` (`compareDecisionsForExecution`)
- `docs/project-management/M8_ECONOMY_SIMULATION_PLAN.md` (Phase 8)
