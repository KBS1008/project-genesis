# M8 Phase 8 — Persistence Decision

**Date:** 2026-07-22  
**Status:** Accepted  
**Baseline commit (Phases 1–7):** `ba627fa`  
**Gate 2 report:** `M8_IMPLEMENTATION_GATE_2_REPORT.md`

---

# Decision

**Phase 8 (Savegame V3) is approved** under the conditions below.

---

# Versioning Rule (mandatory)

Snapshot versions are **historical contracts**. They must not receive retroactive semantic extensions.

```text
GameSaveSnapshotV1   frozen (M4–M6 + M7 pre-world fields)
        ↓
migrateV1ToV2
        ↓
GameSaveSnapshotV2   frozen (M7 world / region ownership)
        ↓
migrateV2ToV3
        ↓
GameSaveSnapshotV3   full M8 runtime state
```

| Version | Contains | Must not contain |
| ------- | -------- | ---------------- |
| V1      | Core aggregates, global `markets[]` | Regional market economics, brain state |
| V2      | V1 + `world`, `marketRegionMappings`, required building/transport regions | `companyBrains`, `regionalMarkets`, price history |
| V3      | V2 state + `companyBrains[]`, `regionalMarkets[]` | — |

**Frozen contracts:** `docs/schemas/GameSaveSnapshotV1.schema.md`, `docs/schemas/GameSaveSnapshotV2.schema.md`  
**Implementation contract:** `docs/schemas/GameSaveSnapshotV3.schema.md`

---

# Architectural Issue Identified (Gate 2 follow-up)

M8 Phases 1–7 (`ba627fa`) **extended `GameSaveSnapshotV1` market types** with fields that belong to V3 only:

- `GameSaveMarketSnapshotV1.regionId`
- `GameSaveMarketSnapshotV1.priceHistory`
- `GameSaveMarketPriceSnapshotV1.supply`, `demand`, `liquidity`
- `GameSaveMarketPriceHistorySnapshotV1` (new type)

`GameStateSerializer` currently writes these fields while emitting `schemaVersion: 2`.

**Impact:** On-disk V2 files may contain keys outside the frozen V2 contract. It is ambiguous whether those fields are authoritative V2 semantics or accidental M8 leakage.

**Severity:** Architectural — the only Gate 2 finding that affects persistence design.

---

# Phase 8 Remediation (required before V3 ship)

1. **Revert V1 market type extensions** in `GameSaveSnapshotV1.ts` to match frozen V1 contract (`03dc747` market shape).
2. **Introduce V3-only types** in `GameSaveSnapshotV3.ts` (`regionalMarkets[]`, `companyBrains[]`, nested M8 types).
3. **Change serializer output** to `schemaVersion: 3` for new saves.
4. **Implement `migrateGameSaveSnapshotV2ToV3`**:
   - Copy unchanged V2 sections verbatim.
   - Promote `markets[]` → `regionalMarkets[]` with normalization (including transitional saves that already contain M8 keys).
   - Initialize `companyBrains: []` when absent.
5. **Restore path** reads brain and regional market state **only from V3 sections** after migration.

Runtime regional markets (in-memory) remain as implemented in Phases 1–7; only the **persistence contract** is corrected.

---

# Phase 8 Exit Criteria

| Criterion | Required |
| --------- | -------- |
| Phases 1–7 baseline committed | ✅ `ba627fa` |
| Progress docs + ADR metadata synced | ✅ through `50c3df2` |
| V1 / V2 frozen contract docs published | ✅ schema docs |
| M8 state persisted **only in V3** | Implement |
| Round-trip tests (V3 save/load) | Implement |
| Migration tests (V1→V2→V3 chain) | Implement |
| Multi-tick determinism after load | Implement |
| V1 type pollution reverted | Implement |

Functional AI gaps (TD-M8-01 … TD-M8-06) remain **non-blocking** for Phase 8.

---

# Testing Matrix (Phase 8)

| Test | Validates |
| ---- | --------- |
| V3 round-trip | Brain + regional markets survive save/load |
| V2 → V3 migration | Frozen V2 fixture + transitional M8-key fixture |
| V1 → V2 → V3 chain | Full migration path, no semantic drift |
| Determinism replay | N ticks after load match uninterrupted session |
| Contract guard | Serialized V3 has no authoritative M8 data under `markets[]` using V1 shape |

---

# Related Documents

- `docs/schemas/GameSaveSnapshotV1.schema.md`
- `docs/schemas/GameSaveSnapshotV2.schema.md`
- `docs/schemas/GameSaveSnapshotV3.schema.md`
- `docs/decisions/DD-033-Savegame-and-Persistence-Strategy.md`
- `docs/project-management/TECHNICAL_DEBT_REGISTER.md`
