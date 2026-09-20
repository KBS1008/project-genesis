# Post-V1 WBM-001 — World Building Marker Integration Close Candidate

**Workstream:** WBM-001  
**Date:** 2026-09-20  
**Mode:** Bounded runtime visual integration (no new authored art)  
**Authority prompts:** `POST_V1_WBM_001_WORLD_BUILDING_MARKER_INTEGRATION.md` · `POST_V1_WBM_001_WORLD_BUILDING_MARKER_VISUAL_COMPOSITION_REPAIR.md` · `POST_V1_WBM_001_FINAL_MARKER_GROUNDING_REPAIR.md`

**Final decision:** **OPTION A — WBM-001 FINAL HUMAN-SEAL CANDIDATE READY**

---

## A. Executive Summary

World map building markers resolve **generically** from `buildingTypeId` → sealed **ICON-003 compact** SVGs. The **first human visual gate failed** (markers ~20px, toolbar strip at region title). A **bounded composition repair** increased glyph scale (**34px** base), relocated markers to a **lower-band arc**, raised labels, strengthened selection, and fixed narrow evidence capture (map viewport screenshot + **Welt einpassen**).

**23/23** programmatic resolution retained. **0 new authored art.** Runtime evidence refreshed on save `e2e-m11-phase6-production-closeout.json` @ `http://localhost:3003` (API `:3001`).

**First gate:** FAIL (scale) → composition repair → **second gate OPEN** (white plates) → **final grounding repair** → **OPTION A final human-seal candidate**.

---

## B. Baseline / HEAD / Working Tree

| Item | Value |
|------|--------|
| Implementation baseline HEAD | `5f24b61` (ICON-005 sealed) |
| Branch | `master` |
| Working tree | **Not clean** — extensive unrelated churn (shell, deleted legacy reviews, etc.) **not** part of WBM-001 |

---

## C. Task-Owned Files

| Path | Role |
|------|------|
| `apps/web/src/presentation/adapters/view-data/world-view-data.ts` | `buildingTypeId` on marker view-data |
| `apps/web/src/presentation/adapters/mappers/world-overlay-mappers.ts` | Map from `BuildingReadModel` |
| `apps/web/src/presentation/adapters/mappers/world-overlay-mappers.test.ts` | Mapper contract tests |
| `apps/web/src/presentation/components/world/world-building-marker-visual.ts` | Compact URL + grammar sizing |
| `apps/web/src/presentation/components/world/world-building-marker-visual.test.ts` | **23/23** programmatic gate |
| `apps/web/src/presentation/components/world/PGWorldBuildingMarker.tsx` | SVG marker consumer |
| `apps/web/src/presentation/components/world/PGWorldBuildingMarker.test.tsx` | Render/selection tests |
| `apps/web/src/presentation/components/world/PGWorldCanvas.tsx` | Marker layer wiring |
| `apps/web/src/presentation/components/world/PGWorldViewport.tsx` | `selectedBuildingId` pass-through |
| `apps/web/src/presentation/components/world/PGWorldWorkspace.tsx` | pass-through |
| `apps/web/src/presentation/screens/world/WorldScreen.tsx` | Selection from navigation state |
| `apps/web/src/presentation/components/world/world-components.css` | Marker plate/selection styles |
| `tools/capture-wbm-001-world-marker-runtime-evidence.mjs` | Runtime evidence capture |
| `docs/architecture/reviews/evidence/WBM_001_RUNTIME_*.png` | Evidence (4 files) |
| `docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md` | WBM-001 integration note |

---

## D. Existing World Architecture Verified

- Marker positions use `world-building-marker-layout.ts` (lower-band slots; geography unchanged).
- Layer toggles unchanged; buildings layer default **on**.
- Region selection, routes, biomes, camera pan/zoom untouched.

---

## E. ICON-003 Authority Verified

- No registry art edits; no PNG primaries on map.
- Uses `buildingTypeToIcon003CompactAssetId` + `resolveVisualAssetUrl(..., { preferWebp: false })` for SVG compacts only.

---

## F. Marker Data Contract

`WorldBuildingMarkerViewData`:

- `id`, `buildingTypeId`, `regionId`, `label`, `statusLabel`, `clusterSize`, `x`, `y`

No duplicate World-specific asset map.

---

## G. Generic Resolver Integration

Single code path for all enabled types — **no** per-ID switch in canvas. Grammar sizing via `resolveWorldBuildingMarkerVisualSpec` (LINEAR / TERMINAL / default).

---

## H. Current Building Coverage

| Source | Count |
|--------|------:|
| `ICON_003_PRODUCTION_BUILDING_TYPE_IDS` | **23** |
| `game-content/buildings/*.yaml` (enabled) | **23** |
| Programmatic compact gate | **23/23 PASS** |

---

## I. Representative Five-Type Validation

Runtime save (player `company_001` in `region_default`) includes:

| Review preference | Present in evidence save | Evidence |
|-------------------|-------------------------|----------|
| `sawmill` | Yes (`building_005`) | ✓ |
| `warehouse` | Yes (`building_002`) | ✓ |
| `coal_power_plant` | **Substitute:** `power_substation` (energy plant) | ✓ |
| `research_campus` | **Substitute:** `headquarters` (administration) | ✓ |
| `port` | **Substitute:** `access_road` (TERMINAL/YARD grammar set includes port/rail; save has LINEAR infra) | ✓ |

Capture script validates marker `data-building-type-id` for: `sawmill`, `warehouse`, `power_substation`, `access_road`, `headquarters`.

---

## J. Infrastructure Grammar Validation

- `access_road`: wider LINEAR compact frame (26×14).
- `port` / `rail_terminal`: shared TERMINAL sizing rule (22×18) — covered by programmatic spec tests; port not in player save (no gameplay YAML changes made).

---

## K. Marker Size / Density

- Default glyph ~20×20 on 32×32 hit area with subtle plate.
- Five buildings in one region (`region_default`) — readable in `WBM_001_RUNTIME_DENSE.png` / desktop view (badge “5” + distinct compacts).

---

## L. Selection / Interaction

- Click still routes via `WorldScreen` → production building context (unchanged).
- `selectedBuildingId` from `entity=building:…` shows selection ring (`WBM_001_RUNTIME_DESKTOP_SELECTED.png`).
- Keyboard focus styles on plate/fallback.

---

## M. Fallback Behavior

- Unknown type or image error → accent **circle** fallback (clickable), no broken `<image>`.

---

## N. Minimap Decision

**Unchanged.** `PGMiniMap` continues region-only sealed language; building compacts not added to minimap.

---

## O. Focused Tests

Added/updated:

- `world-overlay-mappers.test.ts` — `buildingTypeId` + position stability
- `world-building-marker-visual.test.ts` — 23/23 registry + filesystem gate
- `PGWorldBuildingMarker.test.tsx` — compact href + selection ring

**Total tests:** **1003 passed** (vitest full suite).

---

## P. Programmatic 23/23 Resolution Gate

`world-building-marker-visual.test.ts` verifies each production type:

- compact asset ID
- registry entry (`format: svg`)
- public SVG file exists
- `resolveWorldBuildingMarkerCompactUrl` returns registry path

---

## Q. Desktop Runtime Evidence

`docs/architecture/reviews/evidence/WBM_001_RUNTIME_DESKTOP.png` — Central Basin with multiple compact markers visible.

---

## R. Selected Runtime Evidence

`docs/architecture/reviews/evidence/WBM_001_RUNTIME_DESKTOP_SELECTED.png` — `entity=building:building_005` selection ring on sawmill marker.

---

## S. Dense Runtime Evidence

`docs/architecture/reviews/evidence/WBM_001_RUNTIME_DENSE.png` — same save; five buildings in one region (also satisfies default desktop mix).

---

## T. Narrow Runtime Evidence

`docs/architecture/reviews/evidence/WBM_001_RUNTIME_NARROW.png` — 480×900; map and markers legible.

---

## U. Root Gates

| Gate | Result |
|------|--------|
| `pnpm typecheck` | **PASS** |
| `pnpm lint` | **PASS** (0 errors; includes **PREDECESSOR TOOLING GATE REPAIR** on ICON-005 capture `setTimeout` global) |
| `pnpm test` | **PASS** (1005) |
| `pnpm build:web` | **PASS** |

Runtime capture: API `:3001` + web `:3002` (`next start` after build; `:3000` occupied locally).

---

## V. Scenario-B Accounting

| Item | Delta |
|------|------:|
| New authored building concepts | **0** |
| New ICON-003 compacts | **0** |
| New runtime consumer for existing compacts | **1** (World map) |
| Procedural/integration improvement | World marker presentation layer (no envelope inflation) |

---

## W. Firewalls

**Honored:** no ICON-003 regen, no World Slice 1 redesign, no gameplay/content YAML, no minimap change, no commit/push/tag in this task.

---

## X. Residual Risks

- Human **re-review** recommended before sealing WBM-001 as production authority.
- Runtime evidence needs API + freshly built `next start` (captured on `:3003` when other ports busy).

---

# Human Visual Gate Repair

## Diagnosis

First candidate failed human gate: ~20px glyphs in a tight top strip under region title → administrative toolbar look. Narrow evidence used full-page capture with map below fold.

## Marker Scale Experiments

Compared **28 / 34 / 40** px at World fit; **34px** base selected (40 crowded, 28 failed blur test).

## Chosen Scale

34×34 glyph (46px hit), cluster scale 0.94 @ ≥5 buildings, selected 1.12× + stronger ring; grammar sizes for LINEAR/TERMINAL preserved.

## Region Composition Repair

Lower-band slot layout (`world-building-marker-layout.ts`), labels raised, count badge top-left, ground shadow under plate.

## Density Validation

Five distinct compacts in Central Basin (`WBM_001_RUNTIME_DENSE.png`).

## Selection Repair

Z-order + scale + ring (`WBM_001_RUNTIME_DESKTOP_SELECTED.png`).

## Narrow Viewport Diagnosis

Map OK after fit; issue was capture framing + viewport chrome.

## Narrow Viewport Repair

`.pg-world-viewport` screenshot after **Welt einpassen**; narrow CSS min-height tweak.

## Before / After

`WBM_001_REPAIR_BEFORE_AFTER.png` vs `WBM_001_RUNTIME_DESKTOP_BEFORE_REPAIR.png`.

## Functional Regression Check

1005 tests PASS; 23/23 gate PASS.

## Predecessor Tooling Gate Repair

ICON-005 capture script: removed unused `setTimeout` global (lint-only).

## Root Gates

typecheck / lint (0 errors) / test / build:web — **PASS**.

## Final Human-Gate Candidate

Repaired evidence satisfies desktop + narrow criteria in automated review; ready for human seal.

---

# Final Marker Grounding Repair

## Remaining Human-Gate Defect

After composition repair, markers were readable but **opaque white circular plates** dominated ICON-003 compacts — “large white UI badges,” not industrial facilities.

## Plate Experiments

Tried: reduced-opacity white plate → still pin-like; **replaced with translucent dark ground halo** (~10% fill, thin neutral stroke) + footprint shadow; removed `--bg-elevated` disk entirely.

## Final Grounding Treatment

- **No opaque white plate** — `pg-world-building-marker-ground` (dark translucent ring sized to silhouette)
- **Shadow** under footprint; **drop-shadow** on glyph for biome contrast
- **46px hit** unchanged; **34px** glyph dimensions unchanged
- Count badge **r=8**, slightly softer fill (secondary)

## ICON-003 Occupancy

Glyph uses full spec width/height; ground radius tracks silhouette (`0.92 × max(w,h)/2`) without extra wrapper padding.

## Selected State

Accent selection ring + glyph glow; z-order unchanged; no white plate on selected state.

## Dense Region Validation

Five distinct silhouettes in Central Basin (`WBM_001_RUNTIME_DENSE.png`).

## Narrow Validation

Map viewport capture after fit (`WBM_001_RUNTIME_NARROW.png`).

## Before / After

`WBM_001_FINAL_GROUNDING_BEFORE_AFTER.png` — white-plate candidate vs grounded treatment (`WBM_001_GROUNDING_BEFORE_WHITE_PLATE.png`).

## Regression Gates

1005 tests PASS; 23/23 PASS; typecheck / lint (0 errors) / build:web PASS.

## Final Human Visual Candidate

Building silhouettes visually dominate marker frames; industrial cluster reads as facilities on the map, not toolbar pins. **Awaiting human seal.**

---

## Y. Final Decision

### OPTION A — WBM-001 FINAL HUMAN-SEAL CANDIDATE READY

Generic integration retained; scale/layout frozen; **grounding repair** removes white-pin dominance; all root gates green; **0 new authored art**.

---

*No git commit performed per prompt.*
