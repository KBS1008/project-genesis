# GameSaveSnapshotV2.schema.md

**Version:** 1.0.0 (frozen)  
**Status:** Historical contract — **do not extend**  
**Schema Version:** 2  
**Frozen at commit:** `03dc747` (M7 gate closure, 2026-07-19)

---

# Purpose

Defines the **immutable on-disk meaning** of savegame schema version **2** (M7 world simulation layer).

V2 adds world/region ownership metadata. It does **not** introduce regional market economics, price history, or company brain state — those belong to **V3**.

**Reference implementation (frozen):** `git show 03dc747:src/application/persistence/GameSaveSnapshotV2.ts`

---

# Version Chain Position

```text
GameSaveSnapshotV1  (frozen)
        ↓
migrateV1ToV2
        ↓
GameSaveSnapshotV2  (frozen — this document)
        ↓
migrateV2ToV3
        ↓
GameSaveSnapshotV3  (M8 state)
```

---

# Root Snapshot

```text
GameSaveSnapshotV2
├── schemaVersion: 2
├── savedAtUtc
├── world                          (new in V2)
│   └── activeWorldId
├── marketRegionMappings[]         (new in V2 — legacy global market → default region)
├── simulation                     (V1 shape)
├── companies[]                    (V1 shape)
├── buildings[]                    (V2 — required regionId)
├── inventories[]                  (V1 shape)
├── financeAccounts[]              (V1 shape)
├── markets[]                      (V1 market shape — global semantics)
├── productionJobs[]               (V1 shape)
├── researchJobs[]                 (V1 shape)
├── companyResearch[]              (V1 shape)
├── companyMilestones[]            (V1 shape)
├── buildingStorages[]             (V1 shape)
├── transportOrders[]              (V2 — required source/destination regionId)
├── employees[]                    (V1 shape)
├── supplyContracts?               (V1 shape, optional)
└── tickMetricsHistory?            (V1 shape, optional)
```

---

# V2-only additions

### `GameSaveWorldSnapshotV2`

| Field            | Type   | Required |
| ---------------- | ------ | -------- |
| `activeWorldId`  | string | yes      |

### `GameSaveMarketRegionMappingSnapshotV2`

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `marketId` | string | yes      |
| `regionId` | string | yes      |

Used when a V1 save contained `market_global`; migration maps it to `region_default`.

### Building / transport region requirements

- `GameSaveBuildingSnapshotV2`: `regionId` **required**
- `GameSaveTransportOrderSnapshotV2`: `sourceRegionId`, `destinationRegionId` **required**

---

# Markets in V2

`markets[]` still uses the **frozen V1 market contract** (`GameSaveSnapshotV1.schema.md`):

- Typically one row: `id: market_global`
- Price lines: `resourceId`, `basePrice`, `lastPrice`, `tradeVolume`, `updatedAt` only
- **No** per-market `regionId`, **no** `priceHistory`, **no** supply/demand/liquidity columns

Regional price discovery and history are **M8 / V3** concerns.

---

# Migration

| Direction | Function |
| --------- | -------- |
| V1 → V2    | `migrateGameSaveSnapshotV1ToV2()` |
| V2 → V3    | `migrateGameSaveSnapshotV2ToV3()` (Phase 8) |

---

# Known deviation (M8 Phases 1–7)

While `schemaVersion: 2` saves written after `ba627fa` may contain extra JSON keys on `markets[]` (regional fields serialized via polluted V1 types), those keys are **outside the V2 contract**. Phase 8 migration treats them as transitional input only when upgrading to V3; new saves after Phase 8 must use `schemaVersion: 3`.

---

# Related Documentation

- `docs/schemas/GameSaveSnapshotV1.schema.md`
- `docs/schemas/GameSaveSnapshotV3.schema.md`
- `docs/quality/M7_WORLD_SIMULATION_GATE_REVIEW_REPORT.md`
