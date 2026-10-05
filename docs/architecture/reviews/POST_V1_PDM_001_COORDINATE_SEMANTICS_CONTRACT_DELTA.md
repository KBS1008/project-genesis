# POST-V1 PDM-001 — Coordinate Semantics Contract Delta

**Mode:** Read-only contract delta  
**Date:** 2026-09-29  
**Authority:** `docs/development/Prompts/POST_V1_PDM_001_COORDINATE_SEMANTICS_CONTRACT_DELTA.md`  
**Amends:** coordinate portions of `POST_V1_PDM_001_PRODUCT_UX_CONTRACT.md`  
**Review HEAD:** `500a00a086fa083c1bca461ccbe87b1f23f9b675`

Non-coordinate PDM decisions remain **frozen** per the product/UX contract and baseline recheck.

---

## A. Delta result

**OPTION A — COORDINATE CONTRACT REPAIRED / PDM IMPLEMENTATION READY**

> **PDM-001 COORDINATE SEMANTICS:** `REPAIRED / PASS`  
> **DOMAIN POSITION AUTHORITY:** `UNCHANGED`  
> **PRESENTATION-DERIVED GAMEPLAY CAP:** `NONE`  
> **PICKABILITY / DOMAIN VALIDITY:** `SEPARATED`  
> **QUANTIZATION:** `round to nearest integer grid step — PDM ADAPTER SEMANTICS`  
> **DOMAIN → WORLD PROJECTION:** `CONTRACTED`  
> **WORLD → DOMAIN UNPROJECTION:** `CONTRACTED`  
> **EXISTING BUILDING PROJECTION:** `CONTRACTED`  
> **PREVIEW → FINAL CONTINUITY:** `GUARANTEED BY SHARED PROJECTION`  
> **GAMEPLAY RULES:** `UNCHANGED`  
> **SAVE / API:** `UNCHANGED`  
> **PDM-001 PRODUCT / UX CONTRACT:** `COMPLETE / PASS` (coordinate sections amended)  
> **IMPLEMENTATION READY:** `YES`  
> **NEXT PROMPT TYPE:** `PDM-001 BOUNDED IMPLEMENTATION`

---

## B. Baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD | `500a00a086fa083c1bca461ccbe87b1f23f9b675` |
| HEAD = `origin/master` | **Yes** |
| Unrelated WIP | Local only — untouched |

---

## C. Original coordinate defect

The first PDM contract mapped pointer picks with:

- domain `(x,y) = floor(wx - left, wy - top)` inside the default-region **inner footprint** (`size = WORLD_MAP_CELL_SIZE - 8` → **88×88** index range);
- **outside footprint** labeled invalid candidate / “outside Grundstück”.

That implicitly treated **finite presentation geometry** as a **gameplay upper bound**, while domain authority only requires **non-negative integers** with **no established maximum** (`Building.create`, `PlaceBuildingDto`, save snapshot). Gameplay doc V1 states **unbegrenzte Baufläche** (`docs/gameplay/buildings.md` §Grundstück). Repository tests already place buildings at **x up to 60** (`game.controller.test.ts`) and **x = 30 + index×5** (`GameSession.test.ts`); UI defaults **x = buildingCount × 2** can exceed **87** in normal play.

`floor` was also mislabeled as **existing domain authority**; domain accepts integers from any source but does not mandate `floor` for map picks.

---

## D. Domain Position authority

| Item | Truth |
|------|--------|
| Type | `Position` value object — `x`, `y` numbers (`src/domain/building/Position.ts`) |
| Integers | Required in practice via UI `parseInt` / persisted snapshots; domain stores numbers |
| Negative | **Rejected** — `Guard.againstNegative` in `Building.create` |
| Upper X/Y | **NOT ESTABLISHED** in domain, API DTO, or save schema |
| Gameplay doc | V1 **unlimited build area** — not a numeric cap |
| Collision / occupancy | **NOT ESTABLISHED** |
| Region | `regionId` on building; web omits → `DEFAULT_REGION_ID` — **not** derived from pointer |
| Old X/Y form | `Number.parseInt(value, 10) \|\| 0` — **OLD UI BEHAVIOR**, not a universal projection rule |

---

## E. Presentation geometry authority

| Item | Classification |
|------|----------------|
| `WORLD_MAP_CELL_SIZE` (96) | **PRESENTATION AUTHORITY** — region tile size on SVG |
| Region inset `4` | **PRESENTATION AUTHORITY** — region rect padding in `PGWorldCanvas` |
| `mapX` / `mapY` | **PRESENTATION AUTHORITY** — region layout on world map grid |
| SVG `columns×cellSize` | **PRESENTATION AUTHORITY** — default canvas bbox |
| `distributeMarkerPosition` | **PRESENTATION ONLY** — slot layout, not domain |
| Pan/zoom | **EXISTING PRESENTATION AUTHORITY** — `WorldCameraState`, CSS transform |

**Firewall:** None of the above may define maximum domain `Position`, collision, placement capacity, or region membership from pointer geometry.

---

## F. Existing Position evidence

| Source | Examples |
|--------|----------|
| Unit/integration | `(0,0)`, `(1,2)`, `(2,2)`, `(4,4)`, `(20,4)`, `(40,40)`, `(60,20)`, `(22,22)`, `(30,30)`, `(30+5i,30)` |
| Save serializer tests | `(0,0)`, `(1,1)`, `(1,2)` |
| Footprint-derived max index | **87** if wrongly equated to `size-1` |

Values **above 87** are **not** observed in fixtures but are **valid** under domain authority (e.g. `buildingCount×2`). Absence of high saves does **not** establish a maximum.

---

## G. Finite-map / unbounded-domain resolution

**Mismatch:** SVG default bbox is finite; domain is **unbounded non-negative** (V1).

**Rejected families:**

- **Adaptive scale from max building coordinate** — rescales all markers when a larger building is placed → breaks preview→final stability.
- **Footprint-bounded domain** — invents gameplay maximum (~88).

**Accepted family:** **Fixed linear company placement plane (Family B)** — presentation adapter only:

- Fixed **anchor** `O` in world logical SVG space (ties **visual** origin of domain `(0,0)` to default region presentation — does **not** cap domain).
- Fixed **scale** `s = 1` world logical unit per domain grid step — **PDM ADAPTER CONSTANT** (integer grid + invertible linear map; **not** gameplay authority).
- Domain coordinates map to **unbounded** world logical points `O + (x·s, y·s)`; camera **pan/zoom** explores them.
- **Dynamic SVG content extent** (max of default map bbox and projected building/candidate bounds + margin) — **presentation-only**, recomputed from authoritative domain positions; **no save**, **no rescale** of `s` or `O`.

Multi-region pointer→region gameplay remains **out of scope**.

---

## H. Repaired projection contract

### Projection context (`CompanyPlacementProjectionContext`)

Stable adapter inputs (not persisted):

| Field | Source |
|-------|--------|
| `originWorld` `(Ox, Oy)` | `Ox = region.mapX * cellSize + inset`, `Oy = region.mapY * cellSize + inset` for `DEFAULT_REGION_ID` on current `WorldMapViewData` |
| `scale` `s` | **Constant `1`** — PDM adapter module (documented constant, not gameplay) |
| `cellSize`, `inset` | Presentation constants from existing World rendering (`WORLD_MAP_CELL_SIZE`, region rect inset **4**) |

No field in context is an upper domain bound.

### Forward — domain → world logical

`projectDomainPosition(position, ctx)`:

- `worldX = Ox + position.x * s`
- `worldY = Oy + position.y * s`

Used for: existing buildings, preview, newly placed building.

### Inverse — world logical → domain candidate

`unprojectWorldPoint(wx, wy, ctx)`:

- `rawX = (wx - Ox) / s`, `rawY = (wy - Oy) / s`
- If `rawX < 0` or `rawY < 0` → **`no-pick`** (never clamp to 0)
- Else `x = round(rawX)`, `y = round(rawY)`; if `x < 0` or `y < 0` after round → **`no-pick`**
- Else candidate `Position(x, y)`

**No upper rejection** in adapter.

### Camera pipeline (unchanged separation)

1. Viewport pointer → inverse `WorldCameraState` → `(wx, wy)`  
2. `(wx, wy)` → `unprojectWorldPoint` → candidate domain  
3. Forward: domain → `(wx, wy)` → camera → screen (preview)

Pan/zoom changes screen position only; candidate domain unchanged for fixed `(wx, wy)`.

### Round-trip

For integer `P` with `P.x ≥ 0`, `P.y ≥ 0`: `unproject(project(P)) === P` when `s = 1` and pick uses same `(wx, wy) = project(P)`.

---

## I. Quantization contract

| Operation | Classification |
|-----------|----------------|
| `round` on `(wx - Ox) / s` | **PDM ADAPTER SEMANTICS** |
| `floor` | **NOT** existing domain authority |
| Old form `parseInt` | **OLD UI BEHAVIOR** — retired with X/Y removal |

Deterministic: same world logical point → same candidate; boundary at domain origin uses **no-pick** below zero, not clamp.

---

## J. Pickability vs domain validity

| Term | Meaning |
|------|---------|
| **Pickability** | Map adapter produced a candidate from pointer (or **no-pick**) |
| **Domain validity** | Prerequisites, cost, hints, and **`PlaceBuildingUseCase`** accept placement |

Pointer outside default region **art** but projecting to non-negative `(x,y)` → **pickable**; not “gameplay-invalid” due to footprint.

Confirm disabled when: **no-pick**, `!canPlace` hints, or command would fail — use distinct copy (pick vs hint vs command error).

**Do not** label footprint/exterior as **invalid gameplay position** unless domain rejects it.

---

## K. Existing-building projection

- **`distributeMarkerPosition`:** **not** authoritative anchor after PDM; optional **presentation-only** micro-offset for overlap **after** anchor is set (must not change submitted domain).
- **Authoritative anchor:** `projectDomainPosition(building.position, ctx)`.
- Clipping: if anchor outside current viewport, **pan**; extend SVG content bounds for render — do not mutate domain.

---

## L. Preview→final continuity

Preview anchor = forward projection of candidate domain. Confirmed building uses **same function** with persisted domain from command. No slot-layout jump.

---

## M. Authority table

| Coordinate concern | Current authority | Contract classification |
|---|---|---|
| Domain x/y type | `Position` numbers | EXISTING AUTHORITY |
| Negative bound | Domain guard | EXISTING AUTHORITY |
| Upper bound | None in code/save/API | NOT ESTABLISHED |
| V1 build area | Unlimited (gameplay doc) | EXISTING PRODUCT DOC (not a numeric cap) |
| Integer semantics | Persisted grid steps | EXISTING AUTHORITY |
| Old UI parseInt | Buildings form | OLD UI BEHAVIOR |
| SVG logical extent | `PGWorldCanvas` | PRESENTATION AUTHORITY |
| WORLD_MAP_CELL_SIZE | 96 px region tile | PRESENTATION AUTHORITY |
| Region inset 4 | Region rect | PRESENTATION AUTHORITY |
| mapX/mapY | Region layout | PRESENTATION AUTHORITY |
| Quantization (map pick) | — | PDM ADAPTER (`round`) |
| Scale s = 1 | — | PDM ADAPTER CONSTANT |
| Origin O | Default region rect | PDM ADAPTER (presentation anchor) |
| Domain→World | — | PDM ADAPTER CONTRACT |
| World→Domain | — | PDM ADAPTER CONTRACT |
| Pan/zoom | `world-camera-math` | EXISTING PRESENTATION AUTHORITY |
| Region membership | Default region on command | EXISTING APPLICATION AUTHORITY |
| Collision | — | NOT ESTABLISHED |

---

## N. Old vs repaired contract

| Concern | Previous PDM contract | Repaired contract |
|---|---|---|
| Region footprint | Selectable coordinate extent | **Visual anchor only**; not domain bounds |
| Pointer outside footprint | Invalid candidate / gameplay wording | **no-pick** or valid candidate if projection ≥ 0 |
| Domain upper bound | Implicit ~88 | **None** in adapter |
| `floor` | Partly “existing authority” | **`round` — PDM ADAPTER** |
| `WORLD_MAP_CELL_SIZE` | Implicit domain scale | **Presentation tile size only** |
| Inset `4` | Domain origin/boundary | **Presentation anchor for O only** |
| Existing high Positions | Unrepresentable / invalid | **Projected at O + x·s**; pan/extend canvas |
| Preview→final | Required | **Still required** — shared `projectDomainPosition` |
| Existing markers | Replace slots | **Domain-anchored**; slots decoration-only |

---

## O. Deterministic test contract

Later tests must include: **A** origin pick; **B** round-trip; **C/D** pan/zoom invariance of domain candidate; **E** known building projection; **F** preview/final same anchor; **G** domain `(200,100)` not adapter-rejected; **H** below-origin → no-pick, never negative domain.

---

## P. Remaining blockers

**None** for bounded PDM-001 implementation.

**Note:** `s = 1` is an explicit **adapter constant** in the contract (not discovered gameplay scale). It is **not** a gameplay maximum; alternative positive `s` would be a **product presentation choice**, not required for this repair.

---

## Q. Final implementation-readiness decision

Coordinate semantics **repaired**. Broader PDM UX contract **remains valid** with amended §H–§M. **Bounded implementation prompt justified.**

---

## Required factual questions (Q1–Q90) — consolidated

| Q | Answer |
|---|--------|
| 1–8 | `master` / `500a00a` / aligned; WIP local; broader PDM frozen; Scenario-B paused |
| 9–17 | `Position`; integers; rejects negatives; **no upper bounds** in code/API/save |
| 18 | **No** collision layer |
| 19 | Default region on command — **not** pointer-derived |
| 16–17 | parseInt + `\|\| 0` — **OLD UI** |
| 18–21 | **floor not domain authority**; classify **round** as PDM adapter |
| 20–22 | Test coords up to **60+**; can exceed 87; **no max from examples** |
| 23–31 | World SVG user space; cellSize **presentation**; inset **presentation**; mapX/Y **not** building coords; footprint **was wrongly treated as bound — fixed** |
| 32–33 | Pickability ≠ domain validity; **no** gameplay-invalid for outside footprint alone |
| 34–37 | Families A rejected, B accepted, C none, D not needed |
| 38–40 | Fixed O+s; canvas can extend; camera supports pan to projected points |
| 41–47 | Forward/inverse in §H; context has **no** gameplay max; **round**; adapter semantics |
| 48–52 | Below origin **no-pick**; large positions **valid**; render via projection |
| 53–57 | No save/API/regionId/collision/cap/max invention |
| 58–66 | Slots non-authoritative; shared anchor; continuity **yes**; pan/zoom invariant |
| 67–75 | Identical desktop/narrow semantics; frozen confirm/cancel/flow/X-Y removal |
| 76–84 | No gameplay/save/API change; **no** human coordinate decision required for upper bound |
| 81 | Non-arbitrary: **unbounded domain + integer grid + linear anchor** — scale **s** explicit adapter constant |
| 82–84 | Deterministic **yes**; implementation ready **yes** |
| 85–90 | No code/commit/push/tag in this delta |
