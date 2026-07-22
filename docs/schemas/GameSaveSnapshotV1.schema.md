# GameSaveSnapshotV1.schema.md

**Version:** 1.0.0 (frozen)  
**Status:** Historical contract — **do not extend**  
**Schema Version:** 1  
**Frozen at commit:** `03dc747` (M7 gate closure, 2026-07-19)

---

# Purpose

Defines the **immutable on-disk meaning** of savegame schema version **1**.

This contract must not receive new semantic fields. Later milestones introduce new schema versions and migrations instead.

**Reference implementation (frozen):** `git show 03dc747:src/application/persistence/GameSaveSnapshotV1.ts`

---

# Root Snapshot

```text
GameSaveSnapshotV1
├── schemaVersion: 1
├── savedAtUtc: ISO-8601 string
├── simulation
├── companies[]
├── buildings[]          (optional regionId on building — pre-M7 field)
├── inventories[]
├── financeAccounts[]
├── markets[]            (global market semantics — see below)
├── productionJobs[]
├── researchJobs[]
├── companyResearch[]
├── companyMilestones[]
├── buildingStorages[]
├── transportOrders[]    (optional source/destination regionId)
├── employees[]
├── supplyContracts?     (optional)
└── tickMetricsHistory?  (optional)
```

---

# Markets (`markets[]`) — V1 semantics

**One global market** (`market_global`) with price lines only.

### `GameSaveMarketSnapshotV1` (frozen)

| Field       | Type     | Required |
| ----------- | -------- | -------- |
| `id`        | string   | yes      |
| `createdAt` | number   | yes      |
| `prices`    | array    | yes      |

**Not part of V1 contract:**

- `regionId` on market
- `priceHistory`
- `supply`, `demand`, `liquidity` on price lines

### `GameSaveMarketPriceSnapshotV1` (frozen)

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| `resourceId`  | string | yes      |
| `basePrice`   | number | yes      |
| `lastPrice`   | number | yes      |
| `tradeVolume` | number | yes      |
| `updatedAt`   | number | yes      |

---

# Migration

V1 loads only through `GameStateSerializer.parse()` → `migrateGameSaveSnapshotV1ToV2()`.

---

# Known deviation (M8 Phases 1–7)

Commit `ba627fa` **incorrectly extended** `GameSaveSnapshotV1.ts` with M8 regional market fields. Those extensions are **not part of this contract** and must be **reverted during Phase 8** (see `GameSaveSnapshotV3.schema.md` § Remediation).

---

# Related Documentation

- `docs/schemas/GameSaveSnapshotV2.schema.md`
- `docs/schemas/GameSaveSnapshotV3.schema.md`
- `docs/decisions/DD-033-Savegame-and-Persistence-Strategy.md`
