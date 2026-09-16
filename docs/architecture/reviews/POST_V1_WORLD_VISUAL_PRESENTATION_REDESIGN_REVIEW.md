# Post-V1 World Visual Presentation Redesign Review

**Project:** Project Genesis  
**Date:** 2026-09-16  
**Mode:** Read-only product / UX / visual design audit  
**Scope:** World screen — main map, minimap, region/connection presentation, map chrome (no economy/production logic)  
**Trigger:** User evidence — current map reads as a **technical graph on a grid**, not as a finished **game world map** (screenshot in review prompt).  
**Authority:** `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md`, `POST_V1_GAME_PRESENTATION_AND_TIME_UX_REVIEW.md`, `POST_V1_PLAYER_FACING_SIMULATION_PRESENTATION_SLICE_1_CLOSE_CANDIDATE.md` (time contract sealed separately; world visuals remain distinct).

**Output:** Analysis, design direction, proposed first implementation slice. **NO IMPLEMENTATION** in this review.

---

## A. Executive Summary

The world map is a **mature Phase 4A/4B framework** (SVG canvas, pan/zoom, layers, overlays, inspector, minimap) but its **default visual language** is that of a **debuggable graph editor**: uniform accent rectangles on an explicit grid, straight center-to-center edges, raw content IDs as sublabels, and dot markers for buildings. That matches how it was built (M11 procedural framework + Visual Track decision to defer WM-001…010 rasters), but it **does not match** the user’s post-V1 product expectation of a **recognizable strategy/world map**.

**Recommendation:** Open a **new bounded workstream** — **POST-V1-WORLD-VISUAL-PRESENTATION** — whose first slice should achieve **“map legibility + biome identity + reduced debug chrome”** using **existing SVG/CSS + design tokens + content-linked labels**, without importing WM-001 PNGs or changing simulation/API semantics.

**Final decision:** **OPTION A — REDesign WORKSTREAM RECOMMENDED** (with concrete Slice 1 below). Not blocked on product/gameplay semantics; blocked only on **art-production scope** if stakeholders demand illustrated raster maps immediately.

---

## B. Repository Baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD (review) | `cf6cda35c24a15e3781145d59fe98b4fe8fbd297` |
| Remote `origin/master` | `730ed190bb9c3b64c426b185a32fe36528c4bda7` (local may be behind/ahead) |
| World implementation docs | `docs/development/WORLD_MODULE_IMPLEMENTATION_GUIDE.md` |
| Visual track posture | `POST_V1_VISUAL_TRACK_COMPLETION_REVIEW.md` — procedural world **not** a Bucket-1 gap |
| WM-001 mockup on disk | **Not present** in workspace (`docs/design/mockups/world/` empty); registry references planned path only |
| This review | **Documentation only** — no code changes |

**Relationship to pause / sealed tracks:** Project pause and visual-track completion treated the map as **functionally adequate**. This review accepts **new user-facing evidence** as a **distinct presentation workstream** (same pattern as game time UX restart), without reopening V1 or implying ICON-001/002 work is incomplete.

---

## C. Current Implementation (Evidence)

### C.1 Architecture stack

| Layer | Implementation |
|-------|----------------|
| Screen | `WorldScreen.tsx` — loads map, overlay, inspector via `useScreenQuery` |
| Shell | `PGWorldWorkspace.tsx` — header, legend, toolbar, viewport, minimap, layer panel, region table |
| Viewport | `PGWorldViewport.tsx` — CSS transform pan/zoom |
| Canvas | `PGWorldCanvas.tsx` — **single SVG** drawing all layers |
| Camera | `useWorldCamera.ts`, `world-camera-math.ts` |
| View-data | `world-view-mappers.ts` ← `WorldMapDto` + `RegionDto[]` |
| Overlays | `world-overlay-mappers.ts` ← buildings, transport, region resources |
| Styling | `world-components.css` + token variables |
| Assets | `WM-SVG-GRID` / `WM-SVG-LEGEND` registry entries; decorative `pg-world-asset-frame` inset border only |

**No Canvas 2D, no WebGL, no tile engine** — deliberate, documented procedural SVG.

### C.2 What the player sees (matches user screenshot)

1. **Grid layer on by default** (`DEFAULT_WORLD_LAYERS.grid.enabled: true`) — reads as graph paper.
2. **Regions** — rounded `rect` cells, fill = `color-mix(accent 12%, bg)` for all biomes; selection = stronger accent stroke.
3. **Connections** — straight `line` between region centers; width scales with transport intensity when transport layer on.
4. **Labels** — region **display name** + **`biomeId` string** (e.g. `biome_temperate_forest`), not biome **name** from YAML (`Temperate Forest`).
5. **Buildings** — 5px `circle` markers in a 3-column grid inside the cell.
6. **Presence** — numeric badge (building count) in corner.
7. **Minimap** — scaled rectangles + dashed viewport rect; **no routes**, same undifferentiated fills.
8. **Region table** — column “Biom” shows **`biomeId`**, same leak as map sublabel.

### C.3 Data available vs data shown

| Data | Source | Used on map? |
|------|--------|----------------|
| Region name | `RegionDto.name` | Yes (label) |
| Biome id | `RegionDto.biomeId` | Yes (sublabel + table) — **should not be player-primary** |
| Biome name / category | `game-content/biomes/*.yaml` (`name`, `category`) | **Not exposed** on web `RegionDto` |
| Connection distance | `WorldMapDto.connections[].distance` | Mapped to `distanceLabel` but **not drawn on canvas** |
| Map topology | Grid coordinates `mapX`, `mapY` | Drives layout — **looks like graph layout**, not geography |

---

## D. Why It Looks Like a Technical Visualization

| Factor | Mechanism | Player perception |
|--------|-----------|-------------------|
| Explicit grid | Default-on orthogonal lines | Debug / editor surface |
| Homogeneous nodes | Same shape, same accent family for all biomes | Graph nodes, not terrain |
| Raw IDs | `biomeId` as visible copy | Internal schema exposed |
| Straight edges | Center-to-center lines | Network diagram |
| Minimal cartography | No base “land”, water, or biome texture | Empty data viz |
| Operational dots | Circles + count badges | Overlay chart on graph |
| Minimap as micro-grid | Rects only | Thumbnail of same diagram |
| Layer manager prominence | “Raster”, “Verbindungen” toggles | Power-user tooling visible by default |

The implementation **correctly** prioritized **framework completeness** (Phase 4A/4B). The gap is **product art direction applied to that framework**, not missing pan/zoom or missing overlay data.

---

## E. Design Direction (Target Experience)

**North star:** A **readable regional strategy map** — player understands **where** regions are, **what biome character** they have, and **how they connect**, without seeing engine IDs or dev grids.

### E.1 Principles (aligned with DD-039 / DD-041)

1. **Biome first** — color and legend keyed to biome **category** (forest, plains, coastal, industrial), not global `--accent`.
2. **Map plate** — viewport background suggests a **map surface** (subtle gradient/vignette/tokenized “paper” or “dark atlas”), grid **off by default** or relegated to optional dev-oriented layer.
3. **Routes, not edges** — connections styled as **trade/route links** (gentle curve or offset polyline, muted idle, accent when transport active); optional distance in **inspector/tooltip**, not cluttering the canvas.
4. **Player language** — biome **names** (from content) on map and table; keep `biomeId` internal/tests only.
5. **Markers with identity** — replace anonymous dots with **`BuildingCategoryIcon`** (existing ICON-002) at map scale where layout allows; preserve click → Production navigation.
6. **Minimap as compass** — same biome colors + thin route lines + viewport box; optional click-to-pan in a later slice.
7. **Progressive disclosure** — default layer preset: **regions, labels, connections, selection, buildings**; grid/resources/transport as opt-in power layers.

### E.2 Explicit non-goals for early slices

- Full **WM-001 illustrated raster** map (no mockup file in repo; large art scope).
- **Irregular region polygons** / true geography (would need new layout model or authored paths).
- **3D**, **parallax**, **animated weather**.
- Gameplay changes (travel time, distances, region rules).

### E.3 Reference alignment

- **WM-001** in registry = **directional mockup only** — use for mood (atlas, biome contrast, softer routes) when art is produced; **Slice 1 should not depend on it**.
- M11 Phase 3 mission asked for a **production-ready framework** — this redesign **extends presentation on top**, consistent with `WORLD_MODULE_IMPLEMENTATION_GUIDE.md`.

---

## F. Reuse Inventory

| Asset / system | Reuse in redesign |
|----------------|-------------------|
| `PGWorldCanvas` / layer toggles | Keep; extend drawing primitives |
| Camera / minimap math | Keep |
| Overlay mappers | Keep; optional marker size/layout tweak |
| Design tokens / themes | **Primary** biome palette source |
| `BuildingCategoryIcon` | High-value marker upgrade |
| `PGWorldLegend` | Extend with **biome** swatches, not only layer toggles |
| `ResourceIcon` | Defer — not map-critical in Slice 1 |
| WM-001…010 PNGs | **Not in repo** — future optional track |
| Menu scenic pipeline (MM-001) | Pattern for backgrounds — **lightweight** map plate only |

---

## G. Asset & API Gaps (for planning)

| Need | Options | Slice 1 preference |
|------|---------|-------------------|
| Biome display name | (1) Extend read API with `biomeName`; (2) presentation map synced to `game-content/biomes`; (3) add biomes to `contentNames` | Prefer **(1) or (3)** — single source of truth; avoid duplicated YAML in web |
| Biome visual category | Expose `biomeCategory` or map id→category in view-data | Required for deterministic colors |
| Connection labels | Already in view-data | Use in **inspector** or hover, not permanent on canvas |
| Illustrated regions | WM series | **Defer** |

**Stop condition:** If product insists on **WM-001 raster** as the definition of “done”, scope becomes **art production + integration**, not a small presentation slice.

---

## H. Minimap — Purpose & Target

**Current purpose:** Show **relative region placement** and **viewport window** — functional but visually identical to main map simplification.

**Target purpose:** **Orientation widget** — player sees **biome-colored landmasses** and **links** at a glance; viewport rectangle communicates “where you are looking.”

**Slice 1 minimap deltas (recommended):**

- Paint regions with **same biome fills** as main map.
- Draw **connection lines** (1px, muted).
- Keep viewport indicator; consider **click-to-center** in Slice 2.

---

## I. Interaction & Accessibility (unchanged semantics)

- Region select: click rect / table row / keyboard on SVG buttons — **keep**.
- Building marker → Production — **keep**.
- Layer toggles — **keep**; change **defaults** and labels where “Raster” implies dev tool (e.g. “Orientierungsraster (Experte)”).
- `role="img"` / `aria-label` on canvas — enhance with **selected region name** in live region if easy in a later slice.

---

## J. Proposed Workstream & Slice 1

### Workstream name

**POST-V1-WORLD-VISUAL-PRESENTATION**

### Slice 1 title

**SLICE 1 — BIOME IDENTITY + MAP CHROME (PRESENTATION ONLY)**

### Slice 1 objective

Make the world screen **read as a game map at first glance** without new raster art or API gameplay changes.

### Slice 1 deliverables (implementation prompt fodder)

1. **`world-biome-presentation.ts`** (or extend `world-view-data`) — map `biomeId` → `{ label, category, tokenKeys }` from authoritative content/API.
2. **`PGWorldCanvas`** — region `fill`/`stroke` from biome tokens; optional subtle inner texture via CSS patterns or SVG defs (token-only).
3. **Labels** — sublabel shows biome **name**, not id; region table “Biom” column aligned.
4. **Defaults** — `grid` layer **default off**; viewport **map plate** background in CSS.
5. **Connections** — curved or offset paths; idle vs `pg-world-connection-active` contrast refined.
6. **`PGMiniMap`** — biome fills + connection lines.
7. **`PGWorldLegend`** — biome category swatches (static set matching content).
8. **Tests** — mapper label tests; canvas/minimap render tests for class/token binding; no snapshot PNG dependency.

### Slice 1 firewalls

- No changes to transport/production simulation.
- No WM-001 PNG integration requirement.
- No global icon rollout (Market/Production).
- No tick/time copy (owned by simulation presentation workstream).

### Slice 2+ (inventory only)

- Building markers → `BuildingCategoryIcon`
- Hover tooltips (distance, active transports)
- Minimap click-to-pan
- Optional authored region shapes / WM illustration underlay
- World inspector biome copy + DD-043 text pass

---

## K. Tests & Quality (when implemented)

Follow `CURSOR_IMPLEMENTATION_GUIDE.md`: focused tests on mappers and SVG layer classes; full `pnpm test`, `build:web`, lint unchanged policy.

---

## L. Scope / Firewalls (this review)

| In scope | Out of scope |
|----------|----------------|
| Map, minimap, world chrome, labels | Production, market, transport logic |
| Presentation tokens & SVG/CSS | Save/load, YAML edits (unless biome labels require API read model only) |
| Design direction & slice plan | Image generation, new PNG production |
| | Implementation in this task |

---

## M. Definition of Done (for future Slice 1 — not claimed here)

- [ ] Default map view hides debug grid and shows differentiated biomes.
- [ ] No player-visible `biome_*` ids on map/table in normal mode.
- [ ] Connections read as routes; transport highlight preserved.
- [ ] Minimap reflects biomes + links.
- [ ] No gameplay/API/persistence semantic change.
- [ ] Quality gates green.

---

## N. Final Decision

**OPTION A — POST-V1 WORLD VISUAL PRESENTATION REDesign REVIEW COMPLETE; BOUNDED SLICE 1 RECOMMENDED**

Proceed to an implementation prompt for **Slice 1 — Biome Identity + Map Chrome** when approved.

**Not OPTION B** — no contradictory gameplay time or biome simulation semantics.

**Not OPTION C** — architecture supports redesign within existing SVG framework; no material regression required to **plan** the slice.

---

## O. Execution Summary (review task)

| Field | Value |
|-------|--------|
| Implementation performed | **NO** |
| Report path | `docs/architecture/reviews/POST_V1_WORLD_VISUAL_PRESENTATION_REDESIGN_REVIEW.md` |
| Commit / push | **NONE** |
| Recommended next artifact | Implementation prompt: `POST_V1_WORLD_VISUAL_PRESENTATION_SLICE_1.md` (to be authored after product approval) |
