# POST-V1 PDM-001 — Direct Map Building Placement Bounded Implementation Close Candidate

**Mode:** Bounded implementation + tests — no commit / no push / no tag  
**Date:** 2026-09-29  
**Authority:** `docs/development/Prompts/POST_V1_PDM_001_BOUNDED_IMPLEMENTATION.md`, `docs/architecture/reviews/POST_V1_PDM_001_PRODUCT_UX_CONTRACT.md`, coordinate consistency closeout + semantics delta  
**Implementation baseline HEAD:** `500a00a086fa083c1bca461ccbe87b1f23f9b675` (unchanged commit; task-owned diff local only)

---

## A. Executive result

**PDM-001** replaces raw X/Y normal building placement with **Buildings → Position auf Karte wählen → World placement mode → map pick → preview → Gebäude platzieren / Abbrechen**, using a transient placement session in `GameWorkspaceProvider`, a bounded coordinate adapter, shared marker projection, and existing `placeBuilding` / `runCommand` on confirm only.

**Final decision:** **CLOSE CANDIDATE — LIFECYCLE TEST DELTA CLOSED; PASS FOR RUNTIME EVIDENCE** (not sealed; runtime evidence gate is next)

---

## Confirm / Rejection Lifecycle Test Delta (2026-10-04)

**Prompt:** `docs/development/Prompts/POST_V1_PDM_001_CONFIRM_REJECTION_LIFECYCLE_TEST_DELTA.md`

**Gap closed:** Provider-level confirm / rejection / cancel / navigation-away integration was not isolated in a dedicated test. This delta adds `building-map-placement-lifecycle.integration.test.tsx` exercising real `GameWorkspaceProvider` context actions with mocked `placeBuilding`.

**Production code:** **None** (tests only).

**Double-confirm:** Not duplicated here; authoritative shared coverage in `execute-command.test.ts` (generation / cancellation) plus provider `runCommand` `isBusyRef` guard.

### Delta evidence table

| Lifecycle invariant | Test / evidence | Result |
|---|---|---|
| Pick does not place | start + P1 | PASS |
| Repick does not place | P1 → P2 | PASS |
| Confirm calls placeBuilding once | success confirm | PASS |
| Confirm uses exact candidate x/y | payload assert | PASS |
| Confirm preserves building type/name | payload assert | PASS |
| Region semantics unchanged | keys `buildingTypeId,name,x,y` only | PASS |
| Success clears session | post-confirm waitFor | PASS |
| Success remains on World | `navigation.screen === 'world'` | PASS |
| Rejection retains session | reject mock | PASS |
| Rejection retains candidate | same P1 after reject | PASS |
| Rejection remains World/placement mode | screen world + session | PASS |
| Rejection not converted to no-pick | candidate unchanged | PASS |
| Cancel does not place | cancel test | PASS |
| Cancel clears session | cancel test | PASS |
| Cancel returns Buildings | `navigation.screen === 'buildings'` | PASS |
| Navigation away does not place | navigate to production | PASS |
| Navigation away clears session | effect on leave world | PASS |
| Stale session does not resurrect | world → production → world | PASS |

**Focused command:** `pnpm exec vitest run apps/web/src/presentation/state/building-map-placement-lifecycle.integration.test.tsx` — **5/5 PASS**

---

## B. Baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD | `500a00a086fa083c1bca461ccbe87b1f23f9b675` |
| HEAD subject | WORKFORCE-NAV-001: navigate from STALLED_WORKFORCE to Personal focus. |
| `origin/master` | Aligned with HEAD at implementation time |
| Task commit | **None** (per prompt) |
| Unrelated WIP | Extensive (doc moves, pilots, saves, assets, dev pages, etc.) — not staged |

---

## C. Task-owned files

| Path | Role |
|------|------|
| `apps/web/src/presentation/adapters/mappers/company-building-placement-coordinates.ts` | Domain ↔ world logical projection, canvas extent, no-pick |
| `apps/web/src/presentation/adapters/mappers/company-building-placement-coordinates.test.ts` | Adapter round-trip, high coords, no-pick, preview/final anchor |
| `apps/web/src/presentation/adapters/mappers/world-overlay-mappers.ts` | Default-region markers via shared projection |
| `apps/web/src/presentation/adapters/mappers/world-overlay-mappers.test.ts` | Default-region anchor from `building.x/y` |
| `apps/web/src/presentation/hooks/world-viewport-pointer.ts` | Viewport → world logical inverse; drag threshold |
| `apps/web/src/presentation/hooks/world-viewport-pointer.test.ts` | Camera pan/zoom does not change domain pick for same world point |
| `apps/web/src/presentation/navigation/building-map-placement-session.ts` | Typed transient session + candidate helper |
| `apps/web/src/presentation/navigation/building-map-placement-session.test.ts` | Session create/update/clear |
| `apps/web/src/presentation/state/GameWorkspaceProvider.tsx` | Session lifecycle, navigate to World, confirm/cancel, clear on leave World |
| `apps/web/src/presentation/screens/buildings/BuildingsScreen.tsx` | Removed X/Y; **Position auf Karte wählen** |
| `apps/web/src/presentation/screens/buildings/BuildingsScreen.test.tsx` | Map entry; no `runCommand` on start |
| `apps/web/src/presentation/screens/world/WorldScreen.tsx` | Wires session + placement callbacks |
| `apps/web/src/presentation/components/world/PGWorldWorkspace.tsx` | Placement chrome, pick handling, canvas extent, preview |
| `apps/web/src/presentation/components/world/PGWorldViewport.tsx` | Pass-through canvas extent + preview + placement cursor |
| `apps/web/src/presentation/components/world/PGWorldCanvas.tsx` | Extended SVG size, suppress entity selection, preview layer |
| `apps/web/src/presentation/components/world/PGWorldBuildingMarker.tsx` | `isPreview` non-interactive marker |
| `apps/web/src/presentation/components/world/world-components.css` | Placement bar + preview styling |
| `apps/web/src/presentation/testing/game-workspace-mock.ts` | Placement API mocks |
| `apps/web/src/presentation/state/building-map-placement-lifecycle.integration.test.tsx` | Provider confirm/rejection/cancel/navigation lifecycle |
| `docs/architecture/reviews/POST_V1_PDM_001_BOUNDED_IMPLEMENTATION_CLOSE_CANDIDATE.md` | This report |

---

## D. Unrelated WIP

Not modified for PDM except where listed above. Working tree remains dirty with unrelated assets, dev pilots, saves, documentation relocations, and tooling.

---

## E. Architecture implemented

- **Single coordinate adapter** (`company-building-placement-coordinates.ts`) for domain Position ↔ world logical; camera conversion stays in `world-viewport-pointer.ts`.
- **Transient session** in React context (`BuildingMapPlacementSession`), not persisted.
- **Authoritative placement** unchanged: `confirmBuildingMapPlacement` → `runCommand` → `placeBuilding({ buildingTypeId, name, x, y })` (no region ID added).
- **World shell reused**; placement mode adds a compact banner (building name, instruction, candidate text, confirm/cancel).

---

## F. Placement-session lifecycle

| Phase | Behavior |
|-------|----------|
| Start | `startBuildingMapPlacement` from Buildings; navigates to `world`; clears entity selection via navigation target |
| Candidate | `setBuildingMapPlacementCandidate` from World map tap (no command) |
| Confirm success | `placeBuilding` inside `runCommand` action; session cleared only after successful await |
| Confirm rejection | Session retained (clear only in success path of action callback) |
| Cancel | `cancelBuildingMapPlacement` clears session; navigates to `buildings` |
| Navigate away | `useEffect`: session cleared when `navigation.screen !== 'world'` |

---

## G. Buildings entry

- Catalog, prerequisites, and cost hints preserved.
- Primary action: **Position auf Karte wählen** (disabled when `canPlace !== true` or missing name/type).
- No normal-flow X/Y inputs.

---

## H. World placement mode

- Banner shows building name, type label, instruction, candidate coordinates or “Noch keine Position gewählt.”
- **Gebäude platzieren** / **Abbrechen**; confirm disabled without candidate or when busy / not `canPlace`.
- Inspector and region table hidden during placement to reduce accidental region navigation.
- Map entity selection suppressed while placement mode active.

---

## I. Coordinate adapter

- Anchor **O** from default region (`region_default`) inset; **s = 1**.
- Forward: `world = O + position * s`.
- Inverse: `round` on non-negative raw; **no-pick** if raw &lt; 0 (no clamp).
- `resolveWorldCanvasExtent` extends SVG when markers/candidate exceed base grid.

---

## J. Camera/pointer integration

- Pan/zoom via existing `useWorldCamera`.
- Tap vs pan: pointer down/up with `isPointerDrag` threshold; pick only on non-drag release.
- Pick path: viewport local → `viewportPointerToWorldLogical` → `unprojectWorldLogicalPoint`.

---

## K. Candidate / no-pick semantics

- Below-origin world logical → `unproject` returns `null` → candidate cleared via `setBuildingMapPlacementCandidate(null)`.
- Pickability ≠ gameplay validity; domain validation remains on command.

---

## L. Preview

- Preview marker at `projectDomainPlacementPosition(candidate, context)` with `isPreview` styling (dashed ground ring, non-interactive).

---

## M. Existing building-marker projection

- Buildings in `region_default` use `projectDomainPlacementPosition` from persisted `x/y`.
- Other regions retain `distributeMarkerPosition` layout.

---

## N. Preview → final continuity

- Same domain **P** → same world anchor for preview and post-place marker (unit test in coordinate adapter; overlay test for persisted building).

---

## O. Confirm

- Explicit button only; requires candidate + `canPlace` + not busy.
- Double-submit mitigated by existing `isBusy` / `runCommand` guard.

---

## P. Cancel

- **Abbrechen** → clear session, return to Buildings, no mutation.

---

## Q. Navigation-away behavior

- Leaving World screen clears session (provider effect).

---

## R. Command rejection behavior

- Failed `placeBuilding` does not run session clear inside action; user stays in placement mode with candidate.

---

## S. Raw X/Y disposition

- Removed from normal Buildings placement UI; domain Position unchanged; command still receives integer x/y from map session.

---

## T. Desktop behavior

- Placement bar uses flex wrap; existing world responsive rules retained (`world-components.css`).

---

## U. Narrow behavior

- Confirm/cancel in placement actions row with wrap; viewport min-height rules unchanged (~480×900 target not separately captured).

---

## V. Gameplay / Save / API firewall

- No save schema, simulation, or API contract changes.
- No new placement command; `construction.placeBuilding` only on confirm.

---

## W. Focused tests

| Area | File |
|------|------|
| Adapter | `company-building-placement-coordinates.test.ts` |
| Session helpers | `building-map-placement-session.test.ts` |
| Pointer/camera separation | `world-viewport-pointer.test.ts` |
| Marker projection | `world-overlay-mappers.test.ts` |
| Buildings entry | `BuildingsScreen.test.tsx` |
| Provider lifecycle | `building-map-placement-lifecycle.integration.test.tsx` |

Double-confirm while busy: covered by shared `executePresentationCommand` tests + provider `isBusyRef` / `runCommand` guard (not re-tested in PDM lifecycle file).

---

## X. Root gates

| Gate | Result |
|------|--------|
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS (pre-existing warnings only; none introduced as errors) |
| `pnpm test` | PASS — **290** files, **1095** tests |
| `pnpm build:web` | PASS |

---

## Y. Runtime evidence status

**PDM-001 RUNTIME EVIDENCE GATE** is the authorized next step after this lifecycle delta.

No automated capture script run in the bounded implementation pass; manual World placement flow should be verified in the runtime gate (pick, preview, confirm, cancel, pan/zoom pick stability).

---

## Z. Remaining issues

- No dedicated browser/E2E test for full World placement UI chrome.
- ~~Provider confirm/rejection lifecycle could gain an integration test~~ **Closed by lifecycle test delta (2026-10-04).**
- Unrelated lint warnings in touched-adjacent files (e.g. unused args in `world-overlay-mappers.ts`) pre-date or are orthogonal to PDM scope.

---

## AA. Final close-candidate decision

**PDM-001 implementation + confirm/rejection lifecycle tests complete against frozen contract; ready for Runtime Evidence Gate.** Closure/sealing is a review/runtime outcome, not declared here.

---

## Required implementation table

| Contract item | Implementation | Evidence |
|---|---|---|
| Placement entry | **Position auf Karte wählen** on Buildings | `BuildingsScreen.tsx`, `BuildingsScreen.test.tsx` |
| Placement session | `BuildingMapPlacementSession` in provider | `building-map-placement-session.ts`, `GameWorkspaceProvider.tsx` |
| World transition | `startBuildingMapPlacement` → `navigateToTarget({ screen: 'world' })` | `GameWorkspaceProvider.tsx` |
| Coordinate projection | `projectDomainPlacementPosition` | `company-building-placement-coordinates.ts`, tests |
| Coordinate unprojection | `unprojectWorldLogicalPoint` | Same + `world-viewport-pointer.test.ts` |
| Quantization | `round` | `unprojectWorldLogicalPoint` |
| Negative result | no-pick (`null`) | Adapter tests |
| Presentation-derived cap | none | High-coordinate adapter test |
| Pan/zoom | Existing camera + inverse pick | `world-viewport-pointer.test.ts` |
| Preview | `isPreview` marker in canvas | `PGWorldCanvas.tsx`, CSS |
| Existing markers | Shared projection for default region | `world-overlay-mappers.ts`, test |
| Preview→final | Same projection for P | Coordinate + overlay tests |
| Confirm | `confirmBuildingMapPlacement` → `placeBuilding` | `GameWorkspaceProvider.tsx` |
| Cancel | `cancelBuildingMapPlacement` | Provider + World banner |
| Raw X/Y removed (normal flow) | Buildings form | `BuildingsScreen.tsx` |
| Command path unchanged | `placeBuilding` params | Provider confirm callback |
