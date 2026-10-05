# POST-V1 PDM-001 — Direct Map Building Placement — Product / UX Contract

**Mode:** Read-only contract definition  
**Date:** 2026-09-29  
**Authority:** `docs/development/Prompts/POST_V1_PDM_001_PRODUCT_UX_CONTRACT_DEFINITION.md`  
**Review HEAD:** `500a00a086fa083c1bca461ccbe87b1f23f9b675`  
**Coordinate semantics:** amended by `POST_V1_PDM_001_COORDINATE_SEMANTICS_CONTRACT_DELTA.md`; consistency closeout 2026-09-29 (`POST_V1_PDM_001_COORDINATE_CONTRACT_CONSISTENCY_CLOSEOUT.md`)

---

## A. Executive contract result

**OPTION A — PDM CONTRACT COMPLETE / IMPLEMENTATION READY**

> **PDM-001 PRODUCT / UX CONTRACT:** `COMPLETE / PASS`  
> **MATERIALITY:** `HIGH`  
> **PLACEMENT MODE:** `CONTRACTED`  
> **MAP → DOMAIN POSITION:** `CONTRACTED`  
> **PAN / ZOOM:** `CONTRACTED`  
> **PREVIEW:** `CONTRACTED`  
> **VALIDITY:** `EXISTING AUTHORITY REUSED` (pickability via adapter + hints/command; no presentation cap)  
> **CONFIRM:** `CONTRACTED`  
> **CANCEL:** `CONTRACTED`  
> **PREVIEW → FINAL CONTINUITY:** `CONTRACTED` (requires domain→World marker projection in implementation)  
> **RAW X/Y NORMAL FLOW:** `REMOVED`  
> **NARROW:** `CONTRACTED`  
> **GAMEPLAY RULES:** `UNCHANGED`  
> **SAVE / API:** `UNCHANGED`  
> **ART:** `NONE`  
> **IMPLEMENTATION READY:** `YES`  
> **NEXT PROMPT TYPE:** `PDM-001 BOUNDED IMPLEMENTATION`

---

## B. Baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD | `500a00a086fa083c1bca461ccbe87b1f23f9b675` |
| HEAD subject | WORKFORCE-NAV-001: navigate from STALLED_WORKFORCE to Personal focus. |
| `origin/master` | Same SHA — aligned |
| Unrelated WIP | Local only (BVI assets, doc moves, pilots, saves, etc.) — untouched |
| WORKFORCE-NAV-001 | Sealed on HEAD |
| Scenario-B | **PAUSED** |

---

## C. Existing placement authority

| Layer | Authority |
|-------|-----------|
| **Player entry today** | `BuildingsScreen.tsx` — Baukatalog + **Platzierung** (type, name, **X/Y**, **Gebäude platzieren**) |
| **Web command** | `placeBuilding()` → `POST /api/buildings/place` (`PlaceBuildingDto`: `buildingTypeId`, `name`, `x`, `y`, optional `regionId`) |
| **Application** | `GameSession.placeBuilding` → `PlaceBuildingUseCase.execute` |
| **Domain position** | `Position(x, y)` — **non-negative integers only** (`Building.create` / `Guard.againstNegative`) |
| **Normalization** | UI uses `Number.parseInt(..., 10) \|\| 0`; domain rejects negative; **no upper bound** in domain |
| **Region** | `resolveBuildingRegionId` — **`DEFAULT_REGION_ID` (`region_default`)** when web omits `regionId` (current web never sends `regionId`) |
| **Prerequisites / cost** | `BuildingPrerequisitesSpecification`, `ConstructionCostPolicy`, finance debit — same as today |
| **Occupancy / collision** | **NOT ESTABLISHED** — no domain collision rules found |
| **Catalog gating** | Dashboard `PlaceBuildingHint.canPlace` / `reason` (`GameSessionDashboardBuilder.#readPlaceBuildingHints`) — milestones, research, cash |

PDM **must not** add gameplay validity rules. Region footprint is **presentation-only** (anchor `O`); **no-pick** from the adapter is not domain rejection (see §I, §M).

---

## D. Existing World/map authority

| Topic | Current truth |
|-------|----------------|
| **Canvas space** | SVG user space: width `columns * cellSize`, height `rows * cellSize`; `WORLD_MAP_CELL_SIZE = 96` (`world-view-data.ts`, `PGWorldCanvas.tsx`) |
| **Region geometry** | Region interactable rect: `(mapX * cellSize + 4, mapY * cellSize + 4)`, size `(cellSize - 8)` — same inset as presentation |
| **Pan/zoom** | CSS transform on `.pg-world-canvas-transform`: `translate(translateX, translateY) scale(scale)` (`PGWorldViewport.tsx`, `WorldCameraState` in `world-camera-math.ts`) |
| **Pointer on map** | Viewport pointer handlers pan on drag (`useWorldCamera`); region rects `onClick` → `onSelectRegion`; building markers → `onSelectBuilding` → Production navigation |
| **Building markers** | **`distributeMarkerPosition(region, index, cellSize)`** — slot layout inside region footprint; **not** domain `Position` (`world-building-marker-layout.ts`, `world-overlay-mappers.ts`) |
| **Decorative vs domain** | **Separated** — marker `(x,y)` is presentation-only; saved buildings carry domain `x/y` but World does not render them there today |

---

## E. Player problem

Normal building placement requires **opaque numeric X/Y** on **Gebäude → Platzierung** while the **World** map is the spatial mental model. List shows `positionLabel` as `"x, y"`. Markers on World **do not** reflect domain coordinates, so the player cannot see where a placement will land or where a placed building “is” on the map.

---

## F. Approved placement flow

**APPROVED PRODUCT DECISION** (defaults §60):

1. Player selects placeable building type and name on **Gebäude** (existing catalog + form fields).
2. Player activates **map placement entry** (replaces immediate command from the form).
3. Application opens **World placement mode** with structured context (`buildingTypeId`, trimmed `name`, `canPlace` snapshot).
4. Player pans/zooms as needed; **tap/click** (without drag) sets **candidate** domain `Position` + **preview** — **no mutation**.
5. UI shows **pickability** (adapter candidate vs **no-pick**) and **placement validity** (existing hints + command authority) separately.
6. Player **confirms** → single `placeBuilding` / `PlaceBuildingUseCase` execution with candidate `x,y`.
7. Player may **cancel** → clear transient state, no mutation.
8. On success → exit mode, remain on **World**, show building at **same logical location as preview** (after marker projection fix).

One building type + one name + one confirm = **one** placement attempt.

---

## G. Placement-mode entry and exit

| Item | Contract |
|------|----------|
| **Entry** | **DERIVED UX CONTRACT** — From **Platzierung** when `canPlace === true`, name non-empty, type selected: primary control **Position auf Karte wählen** (new label; avoids duplicating confirm wording). Baukatalog **Auswählen** still fills form only. |
| **Blocked entry** | Same as today: `canPlace === false` disables entry; show existing `reason` / prerequisite navigation (PGD unchanged). |
| **World transition** | **APPROVED PRODUCT DECISION** — Entry **must** `navigateToTarget({ screen: 'world', entitySelection: { kind: 'none' } })` (or equivalent) automatically; player must not manually switch to World after choosing placement. |
| **Context carried** | **DERIVED UX CONTRACT** — Transient struct: `{ buildingTypeId, name, originScreen: 'buildings' }` using authoritative IDs only (no label parsing). |
| **Visibility** | Compact placement chrome on World (shell/header or existing workspace frame): building **name** + **type label** (from view-data), instruction **Tippen Sie auf die Karte, um die Position zu wählen.**, actions **Gebäude platzieren** (confirm disabled until **pickable candidate** and hints allow) + **Abbrechen**. |
| **Exit success** | Clear mode + candidate; stay on World; refresh overlays so new building appears. |
| **Exit cancel** | Clear mode; **navigateToTarget({ screen: 'buildings' })** — stable return to catalog/form (no history stack required). |
| **Exit navigate away** | **APPROVED PRODUCT DECISION** — Leaving World via primary nav **cancels** placement session (same as Abbrechen, no mutation). |
| **Re-entry** | No stale candidate after cancel/navigation/success. |

---

## H. Coordinate-space model

| Space | Definition | Authority |
|-------|------------|-----------|
| **Viewport pointer** | Relative to `.pg-world-viewport` | Browser |
| **World logical (SVG user)** | Top-left origin; +X right, +Y down; SVG user units | **PRESENTATION** (`PGWorldCanvas`; default bbox from region grid — may **grow** for content) |
| **Company placement plane** | Linear map: domain `Position` ↔ world logical via anchor `O` + scale `s` | **PDM ADAPTER CONTRACT** (see delta report §H) |
| **Domain `Position`** | Non-negative integer grid `{ x, y }`; **no established upper bound** | **EXISTING AUTHORITY** |
| **Region footprint / inset / cellSize** | Region tile rendering | **PRESENTATION ONLY** — defines anchor `O`, **not** domain maximum |

**Presentation firewall:** `WORLD_MAP_CELL_SIZE`, inset **4**, `mapX/mapY`, and SVG dimensions are **not** gameplay placement bounds.

---

## I. Map → domain Position contract

**Repaired (see Coordinate Semantics Delta).** Pipeline:

1. Viewport pointer → **inverse camera** → world logical `(wx, wy)`  
2. **`unprojectWorldPoint(wx, wy, ctx)`** → candidate `{ x, y }` or **no-pick**  
3. Confirm submits `{ buildingTypeId, name, x, y }` — **no `regionId`**

**Context `ctx`:** `O = (region_default.mapX * cellSize + inset, …)`; **`s = 1`** (PDM adapter constant); no upper bound in context.

**Quantization:** `round((wx - Ox) / s)` — **PDM ADAPTER SEMANTICS** (not existing domain authority).

**Below origin:** **no-pick** (do not clamp to 0).

**Above footprint / outside region art:** still pickable if projection yields non-negative integers — **not** gameplay-invalid by presentation alone.

---

## J. Domain Position → preview/final rendering contract

**`projectDomainPosition(position, ctx)`:** `world = O + (position.x * s, position.y * s)` — same for preview, existing buildings, and post-confirm markers.

**`distributeMarkerPosition`:** not authoritative; optional overlap decoration only.

SVG content extent may expand to include projected buildings; **O** and **s** stay fixed (no rescale on new placement).

---

## Coordinate Semantics Delta (2026-09-29)

Amends §H–§M. Full repair: `POST_V1_PDM_001_COORDINATE_SEMANTICS_CONTRACT_DELTA.md`.

| Topic | Repair |
|-------|--------|
| Footprint as domain cap | **Removed** — V1 unlimited build area; domain has no upper bound |
| Pickability vs validity | **Separated** — no-pick ≠ gameplay rejection |
| `floor` | Reclassified; map pick uses **`round`** (adapter) |
| Scale | **`s = 1`** grid step — explicit PDM adapter constant, not gameplay |

---

## K. Pan/zoom interaction

| Item | Contract |
|------|----------|
| **Pan/zoom** | **APPROVED PRODUCT DECISION** — Remain enabled in placement mode. |
| **Camera invariance** | Candidate **domain** `Position` unchanged when pan/zoom changes; only preview **screen** position updates via forward transform. |
| **Drag vs tap** | **DERIVED UX CONTRACT** — Pointer movement beyond small threshold (e.g. 5px, implementation constant in adapter layer) on viewport = pan; pointer up without drag on map placement layer = candidate pick. Placement mode may attach pick handler to dedicated overlay above regions to avoid region-select side effects. |
| **Wheel zoom** | Unchanged. |

---

## L. Placement candidate / preview

| Item | Contract |
|------|----------|
| **Candidate state** | Transient: `{ domainX, domainY, pickState, hintValid?, commandRejectionReason? }` — **not** persisted (`pickState`: candidate \| no-pick) |
| **Selection** | Does **not** call `runCommand` / API |
| **Preview visual** | Reuse **`BuildingTypeIcon`** / existing marker shell at projected coordinates; **DERIVED UX CONTRACT** — reduced opacity or `is-preview` class (existing CSS tokens) to distinguish from placed markers |
| **Art** | No new assets (Scenario-B paused) |

---

## M. Validity authority and feedback

| Check | Authority |
|-------|-----------|
| Prerequisites / cash | **EXISTING** — entry gated by `canPlace`; re-check on confirm via command (cash may change) |
| Negative coords | **EXISTING** — adapter **no-pick** below origin (never negative candidate) |
| Footprint | **Not** a domain validity rule — presentation anchor only |
| Collision | **NOT ESTABLISHED** — not shown |
| **Pickable + hints OK** | Confirm enabled; copy: **Position gewählt — bestätigen Sie die Platzierung.** |
| **Confirm disabled** | **no-pick**, `!canPlace`, or prior command failure — distinct messaging (no-pick ≠ gameplay-invalid Position) |
| **Prevalidation** | UI mirrors hints where safe; **final** `PlaceBuildingUseCase` remains authoritative |

---

## N. Confirm contract

| Item | Contract |
|------|----------|
| **Control** | World placement chrome: **Gebäude platzieren** (same verb as today’s successful action) |
| **Execution** | `runCommand(() => placeBuilding({ buildingTypeId, name, x, y }), successMessage, { commandId: 'construction.placeBuilding' })` |
| **No pick / blocked hints** | Control **disabled**; no deliberate double-submit |
| **Once per session** | One confirm → one command; success clears mode |

Buildings screen **must not** retain a second **Gebäude platzieren** that executes without map confirmation.

---

## O. Cancel contract

| Item | Contract |
|------|----------|
| **Control** | **Abbrechen** (matches dialog/save patterns) |
| **Optional** | **Escape** may cancel while World focused if placement chrome mounted (consistent with `PGGlobalSearch` / dialog Escape usage) |
| **Effects** | Clear candidate + placement context; **no** `runCommand` |
| **Destination** | Return to **Gebäude** screen |

---

## P. Success and rejection behavior

| Outcome | Behavior |
|---------|----------|
| **Success** | Notification as today; invalidate world/building queries; exit placement mode; **stay on World**; select/highlight new building optional if zero-cost with existing entity navigation |
| **Command rejection** | Stay in placement mode; keep candidate if still valid; show error notification (`translatePresentationError`); allow retry |
| **Gameplay** | Construction timing, cost, workforce, etc. **unchanged** |

---

## Q. Raw X/Y disposition

**APPROVED PRODUCT DECISION — A: REMOVE FROM NORMAL PLAYER FLOW**

- Remove X/Y inputs and numeric **Position** column is **out of scope** for PDM-001 (column may remain raw until a separate presentation slice; not primary placement).
- No secondary coordinate fallback — no established player need; debug needs are not product requirements.
- Domain `Position` remains internal/command data exposed only via map + list labels after placement.

---

## R. Desktop interaction

Pointer pick candidate → preview → **Gebäude platzieren** / **Abbrechen** in placement chrome. Pan via drag on viewport; zoom via toolbar/wheel. Building marker clicks **suppressed** during placement (no navigate-to-Production). Region rect clicks **suppressed** for selection during placement (pick layer owns click).

---

## S. Narrow interaction

**APPROVED PRODUCT DECISION** — Same flow at ~**480×900**; no X/Y fallback. Placement chrome uses existing responsive shell (compact top/bottom bar in `PGWorkspaceFrame` / world header stack). Confirm/cancel always visible without scroll. Map viewport remains usable (existing world layout). Drag-to-pan vs tap-to-place per §K.

---

## T. Existing marker/region interaction during placement

| Interaction | Placement mode |
|-------------|----------------|
| **Region select** | Suppressed (pick handler) |
| **Building marker → Production** | Suppressed |
| **Pan/zoom** | Active |
| **Inspector** | May remain read-only; no action that clears mode without cancel |

---

## U. Transient state / save/API firewall

| Item | Decision |
|------|----------|
| **State owner** | `GameWorkspaceProvider` or dedicated hook — same family as `pendingCompanyOperationsNavigation` / WORKFORCE-NAV |
| **Persisted** | **None** — no save/API/schema changes |
| **API** | Still `POST /api/buildings/place` with same body shape |
| **Domain** | No new aggregates |

---

## V. Validation authority matrix

| Concern | Authority |
|---------|-----------|
| Building type availability | Existing content + hints |
| Prerequisites | `BuildingPrerequisitesSpecification` |
| Cost | `ConstructionCostPolicy` + finance |
| Domain `Position` representation | `Position` + non-negative guard |
| Placement upper bound | **NOT ESTABLISHED** (domain); adapter **must not** cap by presentation |
| Occupancy/collision | **NOT ESTABLISHED** |
| Candidate pointer mapping | **NEW PDM UX/application adapter** |
| Preview state | **NEW transient PDM contract** |
| Confirm/cancel | **NEW PDM UX contract** |
| Final mutation | `PlaceBuildingUseCase` / `GameSession.placeBuilding` |
| World marker position | **NEW projection adapter** (required for continuity) |

---

## W. Implementation boundary forecast

Expected bounded ownership (architecture-consistent):

| Area | Likely touchpoints |
|------|---------------------|
| Transient placement session | `GameWorkspaceProvider` + view-data type |
| Buildings entry | `BuildingsScreen.tsx` — remove X/Y + split entry vs confirm |
| World interaction | `WorldScreen.tsx`, `PGWorldWorkspace`, `PGWorldViewport` / canvas overlay |
| Coordinate adapter | **New module** e.g. `world-building-placement-coordinates.ts` (+ tests) — sole owner of forward/inverse math |
| Preview | `PGWorldBuildingMarker` or sibling preview component |
| Marker projection | `world-overlay-mappers.ts` — domain→logical for real buildings |
| Command | Reuse `gameplay-client.placeBuilding` |
| Tests | Adapter round-trip, pan invariance, no command before confirm, cancel clears, navigation away clears |
| Evidence | New capture script pattern (later gate) |

World components **must not** duplicate domain validation rules.

---

## X. Testability forecast

Deterministic unit tests on adapter: pointer + camera → `(x,y)` via **`round`** quantization; `(x,y)` → world logical; pan/zoom invariance; domain origin **no-pick**; positive Position **above old region-art extent** not adapter-rejected; forward/inverse round-trip; existing-building projection; preview/final same anchor. Component tests: confirm disabled on **no-pick** or `!canPlace`; cancel clears state; `runCommand` not called on pick. Integration: mock `placeBuilding` once with mapped coords.

---

## Y. Runtime certification forecast

**Desktop 1440×900:** Gebäude → select type/name → **Position auf Karte wählen** → World → pick → preview → confirm → building visible at preview location. **No-pick path:** pointer unprojection below domain origin → no candidate, confirm unavailable (separate from command rejection). **Cancel:** no new building. **Narrow 480×900:** same path without coordinate fields.

---

## Z. Remaining blockers

**None** for bounded PDM-001 implementation on default-region, single-company placement path.

**Documented follow-ups (not blockers):**

- Multi-region explicit `regionId` placement (API supports optional `regionId`; web does not) — future contract if product expands beyond `region_default`.
- Raw **Status** / **Position** column presentation on Gebäude list — separate presentation slices.
- Tutorial copy update — **after** implementation (not in this contract).

---

## AA. Final implementation-readiness decision

All material questions in prompt §58 are answered. Coordinate mapping: stable anchor **O** (default-region presentation), **`s = 1`** PDM adapter scale, **`round`** quantization, non-negative domain `Position` with **no presentation-derived upper bound**, shared **`projectDomainPosition`** for preview/existing/final, inverse **`unprojectWorldPoint`** for picks, camera transform separate from domain projection. Preview→final continuity is **required**.

**Implementation prompt justified:** **YES**

---

## Required contract table

| Contract item | Decision | Authority | Implementation consequence |
|---|---|---|---|
| Placement entry | **Position auf Karte wählen** from Platzierung when placeable | APPROVED PRODUCT | Replace immediate place on Buildings |
| World transition | Auto-navigate to World with context | APPROVED PRODUCT | `navigateToTarget` + transient state |
| Candidate selection | Tap/click on map (drag = pan) | DERIVED UX | Overlay + threshold |
| Coordinate mapping | Viewport → camera⁻¹ → unproject (round, no upper cap) | PDM ADAPTER | Single adapter module |
| Pan/zoom | Enabled; domain candidate invariant | APPROVED PRODUCT | Retest on camera change |
| Preview | Type icon/marker at projected logical coords | DERIVED UX | Transient overlay |
| Validity | Pickability (adapter) + hints + command | PDM ADAPTER + EXISTING | Disable confirm on no-pick / blocked hints |
| Confirm | **Gebäude platzieren** → `placeBuilding` | EXISTING command | World chrome only |
| Cancel | **Abbrechen** → Buildings, no mutation | APPROVED PRODUCT | Clear state |
| Success | Stay World; project marker via adapter | APPROVED PRODUCT | Change overlay mapper |
| Rejection | Stay in mode; show error | EXISTING | Notifications |
| Raw X/Y | Removed from normal flow | APPROVED PRODUCT | Delete inputs |
| Narrow | Same map flow | APPROVED PRODUCT | Responsive chrome |
| Save/API | Unchanged | EXISTING | None |

---

## Contract validation scenarios (conceptual)

- **A — Enter:** placeable type + name → entry → World shows placement chrome with context.  
- **B — Candidate:** valid map tap → preview + domain coords, no API call.  
- **C — Pan/zoom:** pan/zoom → same domain coords, preview tracks on screen.  
- **D — No-pick:** pointer unprojection below domain origin → **no candidate**, confirm unavailable (not “gameplay-invalid Position”).  
- **D2 — Command rejection:** valid pick + confirm → authoritative error; stay in mode (separate from no-pick).  
- **E — Confirm:** valid candidate → one `placeBuilding` with mapped integers.  
- **F — Cancel:** Abbrechen → no building, back to Gebäude.  
- **G — Continuity:** post-confirm marker at preview logical location.  
- **H — Narrow:** 480×900 — pick, validity, confirm, cancel without X/Y.

---

## Required factual questions (Q1–Q107) — consolidated

| Q | Answer |
|---|--------|
| 1–8 | `master` / `500a00a` / aligned; WIP local; WORKFORCE-NAV sealed; Scenario-B paused |
| 9–11 | Start: **Gebäude → Platzierung**; X/Y: `#building-x-input` / `#building-y-input`; path: **`placeBuilding` → GameSession → PlaceBuildingUseCase** |
| 12–14 | **`Position`**; non-negative integers; **no domain max** |
| 15–18 | Success: prerequisites, cost, finance, type enabled; region via **default**; **no collision** |
| 19 | Region **not** from coordinates — **default region** unless API `regionId` (unused by web) |
| 20–23 | World: SVG user px; placement: domain grid; markers **not** authoritative — slot layout |
| 24–27 | Pan/zoom: CSS transform; inverse **feasible** in adapter |
| 28–32 | Mapping: §I; **O** from cellSize/inset presentation; **`s = 1`**; **`round`** (PDM adapter); **no new snap** |
| 33–34 | Outside region **art** still pickable if projection ≥ 0; **no-pick** only per adapter; region membership **unchanged** (default) |
| 35–39 | Mode from placeable entry; **auto World**; carry typeId+name; provider transient; **not persisted** |
| 40–48 | Tap selects candidate; **no mutation**; preview at domain coords; reuse art; **jump today yes** — **projection fix required** |
| 49–58 | Validity: pickability + hints + command (footprint **not** domain rule); confirm **`placeBuilding`**; command authoritative |
| 59–68 | **Abbrechen**; no mutation; return Buildings; success stay World; reject stay in mode; nav away cancels |
| 69–75 | Pan/zoom active; markers/regions suppressed; narrow map placement **yes** |
| 76–78 | X/Y **removed**; not primary anywhere |
| 79–85 | **No** new gameplay/API/save/domain persistence/framework/art |
| 86 | Scenario-B paused |
| 87–92 | Single **coordinate adapter**; deterministic tests **yes** |
| 93–96 | Runtime flows per §Y |
| 97–101 | Material questions **answered**; **implementation READY**; **bounded implementation prompt yes** |
| 102–107 | No code/commit/push/tag in this task |
