# M12.5 V1 Savegame Compatibility & Stability Certification Report

**Project:** Project Genesis  
**Workstream:** M12.5 — V1 Savegame Compatibility & Stability Certification  
**Report date:** 2026-09-01  
**Branch:** `master`  
**RC tag:** `v1.0.0-rc.1` → `442665cd6437bdebff88fd1540cedc689238c240` (unchanged)  
**M11 / Production status:** Unchanged — CLOSED / PASS

---

## A. Executive Summary

| Item | Result |
|------|--------|
| Authoritative contract identified | **Yes** — DD-033 + GameSaveSnapshotV1/V2/V3 schema docs |
| Current schema | **V3** (`schemaVersion: 3`) |
| Supported migration chain | **V1 → V2 → V3** (sequential, production entry point) |
| Automated regression | **911 / 911 PASS** (247 files, newly executed) |
| Production API save/load | **PASS** (newly executed) |
| Required compatibility paths | **All PASS** |
| M12 Stable Savegames deliverable | **CLOSED / PASS** |
| **Final decision** | **OPTION A — V1 SAVEGAME COMPATIBILITY & STABILITY CERTIFIED — PASS** |

No savegame schema, migration, or runtime semantic changes were made in this slice. No new certification tests were required — existing evidence covers the authoritative contract.

---

## B. Repository / RC Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| Current HEAD | `794c336f77d197d6739c0f88992748f36cbe0ac8` |
| RC tag | `v1.0.0-rc.1` |
| RC candidate | `442665cd6437bdebff88fd1540cedc689238c240` |
| Tag integrity verified | **Yes** — `git rev-list -n 1 v1.0.0-rc.1` → `442665c` |

### Post-RC change classification

| Commit | Classification | Savegame impact |
|--------|----------------|-----------------|
| `794c336` | **DOC_ONLY** | None — M12.4 declaration report + progress update |

**No SAVE_RUNTIME_RELEVANT changes** after the tagged RC candidate. Certification applies to the **formal RC savegame implementation** at `442665c`.

---

## C. Authoritative Savegame Contract

| Source | Role | Key requirements |
|--------|------|------------------|
| `DD-033-Savegame-and-Persistence-Strategy.md` | **AUTHORITATIVE** | Deterministic snapshots; backward compatibility; sequential migration; validation before hydration; invalid saves fail before runtime mutation |
| `GameSaveSnapshotV3.schema.md` | **AUTHORITATIVE** | V3 field contract; V1/V2 frozen; migration rules; reference integrity rules |
| `GameSaveSnapshotV2.schema.md` | **AUTHORITATIVE** | Frozen V2 contract |
| `GameSaveSnapshotV1.schema.md` | **AUTHORITATIVE** | Frozen V1 contract |
| `QUALITY_GATES.md` Release Gates | **AUTHORITATIVE** | Savegame Compatibility required for major releases |
| `TESTING_STRATEGY.md` | Supporting | Migration tests per format change; corruption/missing/invalid data |
| `RC_RUNTIME_CONTRACT.md` | Supporting | Production save path `saves/`; save/load in smoke checklist |

**No CONTRACT_CONFLICT** identified.

---

## D. Supported Schema Versions

| Version | Constant | Introduced | Primary addition |
|---------|----------|------------|------------------|
| **1** | `schemaVersion: 1` | M4/M5 | Core aggregates, global `markets[]` |
| **2** | `schemaVersion: 2` | M7 | `world`, `marketRegionMappings`, required regions |
| **3** | `schemaVersion: 3` | M8 Phase 8 | `companyBrains[]`, `regionalMarkets[]` (replaces `markets`) |

**Current write target:** V3 only (`GameStateSerializer.serialize`).

---

## E. Migration Architecture

**Production entry point:** `GameStateSerializer.parse()` in `src/infrastructure/persistence/savegame/GameStateSerializer.ts`

```text
schemaVersion 1  →  #parseV1  →  migrateGameSaveSnapshotV1ToV2  →  migrateGameSaveSnapshotV2ToV3
schemaVersion 2  →  #parseV2  →  migrateGameSaveSnapshotV2ToV3
schemaVersion 3  →  #parseV3  (direct)
other            →  ValidationError (unsupported)
```

**Sequential migration is mandatory** per DD-033 and schema docs. Direct V1→V3 without V2 intermediate is **not** the supported contract — the production path executes both stages for V1 input.

**Hydration boundary:** `restoreApplicationFromSnapshot()` after successful parse/migration validation.

**Load path:** `FileSavegameStore.load` → parse (via serializer in store/use case chain) → `LoadGameUseCase` → `restoreApplicationFromSnapshot`.

---

## F. Existing Test / Fixture Inventory

| File | Type | Coverage |
|------|------|----------|
| `GameStateSerializer.test.ts` | UNIT + INTEGRATION | parse, migrate V1/V2/V3, hydrate, roundtrip, reference rejection, determinism after load |
| `migrateGameSaveSnapshotV2ToV3.test.ts` | UNIT | V2→V3 migration function |
| `LoadGameUseCase.test.ts` | INTEGRATION | file load, invalid JSON, unsupported schema, V1 migration, region/building validation failures |
| `SaveGameUseCase.test.ts` | INTEGRATION | save + reload |
| `m10SavegameRoundTrip.test.ts` | INTEGRATION | M10 domains through V3 serialize/restore |
| `apps/api/src/game/game.controller.test.ts` | API | save/load round-trip via HTTP |
| `apps/api/src/e2e/m9-save-load-flow.test.ts` | API_E2E | pause/save/load/finance/events after load |
| `apps/api/src/e2e/m11-phase5-simulation-integration-flow.test.ts` | API_E2E | save/load in simulation integration |
| `apps/api/src/e2e/m11-phase6-production-closeout-flow.test.ts` | API_E2E | production closeout save/load |

### Fixture classification

| Evidence type | Used? | Notes |
|---------------|:-----:|-------|
| A. Genuine historical player saves | **No** | No archived production player files in repo |
| B. Hand-authored static fixtures | **Yes** | JSON written in test temp dirs / inline objects matching frozen V1/V2/V3 contracts |
| C. Dynamically generated objects | **Yes** | `bootstrapApplication` + gameplay seeding → serialize (synthetic but semantically valid) |
| D. No fixture evidence | — | N/A — evidence exists |

All fixtures are **CERTIFICATION_FIXTURE** or **SYNTHETIC_OBJECT** — not mislabeled as historical player saves.

---

## G. Compatibility Certification Matrix

| Certification Area | Evidence | Result | Classification |
|--------------------|----------|--------|----------------|
| Current V3 roundtrip | `GameStateSerializer.test.ts` round trip + schema v3 tests; `m10SavegameRoundTrip.test.ts` | **PASS** | ALREADY_SATISFIED |
| V2 → V3 migration | `GameStateSerializer.test.ts` "migrates v2 snapshots…"; `migrateGameSaveSnapshotV2ToV3.test.ts` | **PASS** | ALREADY_SATISFIED |
| V1 → V2 → V3 migration | `GameStateSerializer.parse` V1 path; `LoadGameUseCase.test.ts` "loads a legacy v1 savegame" | **PASS** | ALREADY_SATISFIED |
| Unsupported schema rejection | `GameStateSerializer.test.ts`; `LoadGameUseCase.test.ts` schema 99 | **PASS** | ALREADY_SATISFIED |
| Invalid JSON rejection | `LoadGameUseCase.test.ts` invalid JSON | **PASS** | ALREADY_SATISFIED |
| Structural validation | `GameStateSerializer.test.ts` missing metadata; `LoadGameUseCase.test.ts` unknown region, invalid building id | **PASS** | ALREADY_SATISFIED |
| Reference integrity | `GameStateSerializer.test.ts` invalid aggregate IDs; `LoadGameUseCase.test.ts` unknown region | **PASS** | ALREADY_SATISFIED |
| API save/load | `game.controller.test.ts`; `m9-save-load-flow.test.ts` | **PASS** | ALREADY_SATISFIED |
| Production runtime save/load | M12.5 REST smoke on compiled API (this slice) | **PASS** | VALIDATION_REQUIRED → satisfied |
| Post-load simulation continuation | M12.5 smoke + E2E tests | **PASS** | ALREADY_SATISFIED |
| Required domain persistence | See §N | **PASS** | ALREADY_SATISFIED |
| Failure-state safety | `GameSession.loadGame` + LoadGameUseCase error paths | **PASS** | ALREADY_SATISFIED |

---

## H. V3 Roundtrip Certification

**Evidence:** `GameStateSerializer.test.ts` — "preserves session state through serialize, parse and hydrate"; M10/supply-contract/employee roundtrips; "produces identical outcomes after save/load for subsequent ticks".

**Verified semantics preserved (non-exhaustive, schema-backed):**

- Simulation tick / pause state
- Companies, buildings, inventories, finance
- Production jobs, research jobs, transport orders
- World + regional markets + company brains (V3)
- Employees, supply contracts, tick metrics history (optional)

**Result:** **PASS**

---

## I. V2 → V3 Certification

**Production path:** `GameStateSerializer.parse` when `schemaVersion === 2`.

**Evidence:**

- `GameStateSerializer.test.ts` — "migrates v2 snapshots with transitional market keys to v3"
- `migrateGameSaveSnapshotV2ToV3.test.ts` — promotes `markets` → `regionalMarkets`, adds `companyBrains: []`

**Verified:**

1. V2 recognized ✓  
2. Migration executes ✓  
3. Result satisfies V3 (`schemaVersion: 3`, `regionalMarkets`, `companyBrains`) ✓  
4. Hydration path available via parse → restore ✓  

**Result:** **PASS**

---

## J. V1 → V2 → V3 Certification

**Production path:** V1 branch in `GameStateSerializer.parse`:

```typescript
migrateGameSaveSnapshotV2ToV3(migrateGameSaveSnapshotV1ToV2(v1Result.value))
```

**Evidence:**

- `GameStateSerializer.test.ts` — "migrates v1 snapshots through v2 to v3 with default world and region ownership"
- `LoadGameUseCase.test.ts` — "loads a legacy v1 savegame and migrates world metadata" (full file load → restore)

**Verified both stages execute** via production parse entry point (not migration helper alone).

**Result:** **PASS**

---

## K. Unsupported Schema Rejection

**Evidence:** `GameStateSerializer.test.ts` — schema 99 → `"Unsupported savegame schema version"`; `LoadGameUseCase.test.ts` — `PersistenceErrorCode.INVALID_SNAPSHOT`.

**Behavior:**

- Deterministic rejection ✓  
- Typed error / message ✓  
- No hydration on failure ✓  
- `GameSession.loadGame` only calls `#replaceContext` on success ✓  

**Result:** **PASS**

---

## L. Invalid JSON / Structural Corruption

### Invalid JSON

**Evidence:** `LoadGameUseCase.test.ts` — `{ invalid json` → `PersistenceError`, message contains read failure.

**Result:** **PASS** — parse failure, no hydration.

### Structurally invalid save

**Evidence:**

- Missing required metadata → `ValidationError` before hydrate (`GameStateSerializer.test.ts`)
- Unknown region → `ValidationError` (`LoadGameUseCase.test.ts`)
- Invalid building id (`id: ''`) → hydration/validation failure (`LoadGameUseCase.test.ts`)

**Result:** **PASS** — failures occur before invalid state enters active runtime.

---

## M. Reference Integrity

**Schema rules (V3):** companyBrains reference companies; regional market uniqueness; enum validity; no duplicate ids within brain structures.

**Evidence:**

- `GameStateSerializer.test.ts` — "rejects invalid aggregate identifiers during restore"
- `GameStateSerializer.test.ts` — "rejects invalid assigned building ids during employee restore"
- `LoadGameUseCase.test.ts` — unknown region rejection

**Result:** **PASS**

---

## N. Domain Persistence Matrix

| Domain | In V3 schema? | Evidence | Status |
|--------|:-------------:|----------|--------|
| Simulation tick / pause | Yes | Serializer roundtrip; E2E save/load | **FULLY_VERIFIED** |
| Session / company identity | Yes | LoadGameUseCase; E2E | **FULLY_VERIFIED** |
| Finance | Yes | m9-save-load-flow (cashBalance); M12.5 smoke | **FULLY_VERIFIED** |
| World / regions | Yes | V1 migration test; m10 roundtrip | **FULLY_VERIFIED** |
| Buildings / inventories | Yes | Serializer roundtrip; m10 | **FULLY_VERIFIED** |
| Production jobs | Yes | m10SavegameRoundTrip; serializer production job restore test | **FULLY_VERIFIED** |
| Research jobs / company research | Yes | m10 roundtrip | **FULLY_VERIFIED** |
| Transport orders | Yes | m10 roundtrip | **FULLY_VERIFIED** |
| Employees | Yes | Serializer employee roundtrip test | **FULLY_VERIFIED** |
| Supply contracts | Yes | Serializer supply contract roundtrip | **FULLY_VERIFIED** |
| Company brains (V3) | Yes | schema v3 company brain test | **FULLY_VERIFIED** |
| Regional markets (V3) | Yes | V2→V3 migration tests | **FULLY_VERIFIED** |
| Tick metrics history | Optional | Serializer tick history tests | **FULLY_VERIFIED** |
| Player event log / UI notifications | **No** | Not in V3 snapshot; `GameSession.loadGame` clears session log on successful load | **NOT_PERSISTED_BY_DESIGN** |
| Pending domain events | Must be empty at save | Schema rule § validation item 9 | **NOT_REQUIRED** (must not be persisted queued) |

**Events/notifications:** Authoritative schema does **not** define event-log or notification persistence in snapshots. M12.3 partial finding is **NOT_PERSISTED_BY_DESIGN**, not a V1 blocker.

---

## O. API Save / Load

| Item | Value |
|------|-------|
| Save endpoint | `POST /api/session/save` |
| Load endpoint | `POST /api/session/load` |
| List endpoint | `GET /api/saves` |
| Temp certification path | `saves/m12-5-cert-smoke-temp.json` (not committed) |

**Evidence:**

- `game.controller.test.ts` — POST save/load round-trip with tick restoration
- `m9-save-load-flow.test.ts` — finance, pause state, event log after load (session-scoped)

**Result:** **PASS**

---

## P. Production Runtime Save / Load

**Topology:** Compiled NestJS API (`NODE_ENV=production pnpm start:prod`) — RC path, no `pnpm dev`.

**M12.5 execution (NEWLY EXECUTED):**

| Metric | Value |
|--------|------:|
| Save path | `saves/m12-5-cert-smoke-temp.json` |
| **tickBeforeSave** | **11** |
| **tickAtLoad** | **11** |
| **tickAfterLoad** | **14** |
| tickAfterLoad > tickAtLoad | **YES** |
| Cash restored | **YES** |
| SAVE_OK / LOAD_OK | **YES** |

**Result:** **PASS**

---

## Q. Failure-State Safety

| Scenario | Behavior | Classification |
|----------|----------|----------------|
| Invalid JSON load | `PersistenceError` returned; no context swap | **SAFE_REJECTION_ACTIVE_SESSION_PRESERVED** |
| Unsupported schema | `PersistenceError` / `ValidationError`; no `#replaceContext` | **SAFE_REJECTION_ACTIVE_SESSION_PRESERVED** |
| Structural/integrity failure | Validation/hydration error before swap | **SAFE_REJECTION_ACTIVE_SESSION_PRESERVED** |
| Successful load | `#replaceContext` replaces session atomically | Expected |

**Evidence:** `GameSession.loadGame` lines 862–866 — failure returns early without `#replaceContext`.

**Result:** **PASS** — no unsafe partial hydration observed.

---

## R. Automated Regression Result

| Metric | Value |
|--------|-------|
| Execution | **NEWLY EXECUTED** (M12.5) |
| Starting test count | **911** |
| Final test count | **911** |
| Test files | **247** |
| Result | **PASS** (exit 0, ~133 s) |
| New tests added | **0** |

---

## S. Certification Gaps

| Item | Classification | Disposition |
|------|----------------|-------------|
| V3 roundtrip | **ALREADY_SATISFIED** | Closed |
| V1/V2 migration | **ALREADY_SATISFIED** | Closed |
| Rejection paths | **ALREADY_SATISFIED** | Closed |
| Production save/load | **VALIDATION_REQUIRED** → executed | Closed |
| Genuine historical player fixture files | **NOT_REQUIRED** | Synthetic/static fixtures sufficient per contract |
| Event log persistence | **NOT_PERSISTED_BY_DESIGN** | Non-blocking |
| Cloud/autosave/slots | **NOT_REQUIRED** | Out of V1 contract |
| Implementation defects | — | **None found** |

**No IMPLEMENTATION_REQUIRED**, **DECISION_REQUIRED**, or **TEST_EVIDENCE_GAP** blockers remain for required compatibility paths.

---

## T. M12 Stable Savegames Gate Decision

All **authoritatively required** compatibility areas: **PASS** or **NOT_REQUIRED** with evidence.

| M12 Deliverable | Status |
|-----------------|--------|
| **Stable Savegames** | **CLOSED / PASS** |

---

## U. Working Tree / Commit Summary

| Item | Status |
|------|--------|
| Savegame runtime modified | **No** |
| New tests added | **No** |
| RC tag modified | **No** |
| This report | New — pending commit |
| `IMPLEMENTATION_PROGRESS.md` | Updated — pending commit |
| Temp save `saves/m12-5-cert-smoke-temp.json` | Untracked — excluded |

---

## V. Recommended Next Step

**M12.6 — Performance Contract & Validation** (or performance decision slice per M12.3 sequencing).

Do not begin automatically — await ChatGPT Gate Review.

---

## Final Decision

# **OPTION A — V1 SAVEGAME COMPATIBILITY & STABILITY CERTIFIED — PASS**

---

*End of M12.5 V1 Savegame Compatibility & Stability Certification Report.*
