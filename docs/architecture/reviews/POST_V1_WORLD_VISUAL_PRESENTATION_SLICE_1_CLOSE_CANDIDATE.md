# Post-V1 World Visual Presentation — Slice 1 Close Candidate

**Workstream:** POST-V1-WORLD-VISUAL-PRESENTATION  
**Slice:** SLICE 1 — BIOME IDENTITY + MAP FOUNDATION  
**Date:** 2026-09-16  
**Authority:** `POST_V1_WORLD_VISUAL_PRESENTATION_SLICE_1.md`, `POST_V1_WORLD_VISUAL_PRESENTATION_REDESIGN_REVIEW.md`

---

## A. Executive Summary

Slice 1 delivers **authoritative biome presentation metadata** on region read models, **player-facing biome names** (no raw `biome_*` ids on map/table/inspector in World scope), **biome-differentiated SVG regions** (token/pattern-based), **map plate** viewport styling, **grid off by default**, **curved route paths**, **minimap** alignment (biome fills + routes), and an **extended legend** (biomes + layers). SVG architecture preserved; no new raster art; no gameplay changes.

**Quality gates:** `pnpm typecheck` **PASS**, `pnpm lint` **0 errors**, `pnpm test` **PASS** (262 files), `pnpm build:web` **PASS**.

**Runtime visual validation:** **Executed** via `pnpm dev` (web :3000, API :3001) and Cursor browser walkthrough on **2026-09-16** — session **Fortsetzen → Test**, in-app nav **Welt** → `?screen=world`. Desktop + **narrow (480×900, mobile metrics)** re-validated in **Final Visual Closeout** pass; durable screenshots in §R. Slice-1-local responsive corrections: **none**.

**Git:** Per prompt §46 — **no commit/push** of implementation in this handoff unless user requests.

---

## B. Repository Baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| Docs baseline | `bff04ab` (review + Slice 1 prompt) |
| Implementation | Local working tree (uncommitted) |

---

## C. Slice Scope

Implemented: A–G per prompt (biome source, region identity, labels, map plate/grid default, routes, minimap, legend, tests). Deferred: BuildingCategoryIcon markers, minimap click-to-pan, WM art, inspector redesign.

---

## D. Architecture Confirmation

| Check | Result |
|-------|--------|
| `PGWorldCanvas` SVG | Retained |
| Pan/zoom / layers | Retained |
| Topology / coordinates | Unchanged |

---

## E. Biome Presentation Source

**Path:** `game-content/biomes` → `BiomeRegistry` → `mapRegionReadModel()` → API `RegionReadModel` / web `RegionDto` (`biomeName`, `biomeCategory`).

**Files:** `src/application/read-models/mapRegionReadModel.ts`, `ListRegionsQueryHandler.ts`, `GetRegionDetailsQueryHandler.ts`, `apps/web/.../query-client.ts`, `world-view-mappers.ts`.

No duplicated frontend biome name catalog.

---

## F. Player-Facing Biome Labels

| Surface | Before | After |
|---------|--------|-------|
| Map sublabel | `biomeId` | `biomeLabel` (content name) |
| Region table | `biomeId` | `biomeLabel` |
| World inspector / overlay | `biomeId` | `biomeLabel` |
| Workspace region rows | — | `biomeLabel` on view-data |

---

## G. Region Visual Identity

- SVG **patterns** per authoritative category (`FOREST`, `PLAINS`, `COASTAL`, fallback `unknown`).
- Stroke/fill via **`world-biome-presentation.ts`** + `world-components.css` tokens.
- Selection/hover via existing classes + filter/ stroke emphasis.

---

## H. Map Plate / Grid

- Viewport **radial gradient** map plate (`world-components.css`).
- **`DEFAULT_WORLD_LAYERS.grid.enabled: false`**; label **Orientierungsraster**.
- `useWorldLayers` initializes from layer `enabled` flags only.

---

## I. Route Presentation

- `world-route-geometry.ts` — deterministic quadratic paths.
- `PGWorldCanvas` / `PGMiniMap` use `path` instead of straight `line` for connections.

Transport active styling preserved (`pg-world-route-active`).

---

## J. Minimap

Shared biome surface classes; simplified routes; viewport rect retained.

---

## K. Legend

`PGWorldLegend` — biome section from `buildWorldBiomeLegendEntries(map.regions)` + existing layer list.

---

## L. Interaction Preservation

Region click/keyboard, building markers, pan/zoom, layer toggles — unchanged semantics.

---

## M. Accessibility / Responsive

Region `aria-label` includes biome name; existing keyboard targets retained. Existing breakpoint: `@media (max-width: 56.25rem)` → `.pg-world-layout { grid-template-columns: 1fr; }`. Narrow closeout: **no CSS changes**; map reachable via vertical page scroll after shell chrome (see §P).

---

## N. Tests

New/updated: `world-biome-presentation.test.ts`, `world-route-geometry.test.ts`, `world-view-data.test.ts`, `world-view-mappers.test.ts`, `ListRegionsQueryHandler.test.ts`, `GetRegionDetailsQueryHandler.test.ts`, fixture updates for `RegionDto` fields.

---

## O. Quality Gates

All green at closeout (see Executive Summary).

---

## P. Runtime Visual Validation

| Step | Observation |
|------|-------------|
| Dev stack | `pnpm dev` — Next.js **http://localhost:3000**, Nest API **http://127.0.0.1:3001** |
| Session | Main menu **Fortsetzen** (save **Test**) → `/game` → nav **Welt** → `?screen=world` (avoid cold load of `?screen=world` without session) |
| Default map | Map plate (gradient), **no** orientation grid by default; four regions with distinct biome fills/patterns |
| Labels | Region nodes and table: *Temperate Forest*, *Industrial Plains*, *Coastal Lowlands* — **no** `biome_*` strings in World UI |
| Routes | Curved connection paths on main map; minimap shows matching simplified routes + biome-colored rects |
| Legend | **Biome** block lists three content names; **Ebenen** lists active layers |
| Grid toggle | **Orientierungsraster** layer checkbox **unchecked** by default; label matches Slice 1 copy |
| Selection | **Central Basin** selected — selection ring, banner *Auswahl: Region: Central Basin*, inspector shows *Temperate Forest* |
| Shell (out of slice) | Header **Zyklus N** visible (simulation presentation slice); dashboard elsewhere may still show *Tick* |
| Desktop re-check | **1440×900** — biome differentiation, region + biome sublabels, routes, legend, minimap, grid default off, selection chrome, pan/zoom + *Welt einpassen* — **PASS** |
| Narrow **480×900** | Single-column world layout; game shell (header, nav pills, simulation bar) visible at top; **map + minimap below initial fold** — modest vertical scroll (~400px) required; then region names + biome sublabels readable, routes visible, legend/layers in document flow (no legend–map overlap at map scroll position), controls reachable, no nested-scroll trap, pan/zoom OK — **PASS** (usable with scroll; no Slice-1-local fix applied) |

**Accessibility tree:** Region buttons exposed as e.g. `Region Central Basin, Temperate Forest`.

**Result:** Runtime validation **PASS** for Slice-1 World scope at **desktop and narrow** widths.

**Prior gap correction:** An earlier revision of this document stated Definition of Done was complete while **narrow viewport was not re-checked**; that was **incorrect** until this closeout pass (§P narrow rows + §R screenshots).

---

## Q. Visual Acceptance Questions (implementation checklist)

| Q | Expected | Verified |
|---|----------|----------|
| A Default reads like graph paper | NO | **YES** — grid off; map plate instead of bare grid |
| B Biome identity before reading ID | YES | **YES** — color/pattern differ by biome |
| C Raw biome IDs in normal World UI | NO | **YES** — names only on map, legend, table, inspector |
| D Connections read as routes | YES | **YES** — curved paths; minimap routes |
| E Minimap same visual language | YES | **YES** — biome fills + routes |
| F Selection immediately clear | YES | **YES** — ring + inspector + selection banner |
| G Readable in dark theme | YES | **YES** |
| H Materially more game-like than baseline | YES | **YES** — matches redesign intent vs prior graph/grid/`biomeId` screenshot |

---

## Q2. Final Visual Honesty Check (closeout — runtime)

| Q | Answer | Notes |
|---|--------|-------|
| A. World still primarily a technical node graph? | **NO** | Biome fills/patterns, map plate, curved routes, player-facing labels |
| B. Biomes meaningfully distinguishable without raw IDs? | **YES** | Color + SVG pattern + legend; sublabels on map |
| C. Map plate intentional vs editor canvas? | **YES** | Gradient plate, framed viewport, minimap aligned |
| D. Connections read as strategic routes? | **YES** | Curved paths; not bare orthogonal graph edges |
| E. Minimap belongs to redesigned map? | **YES** | Shared biome styling + route simplification |
| F. Narrow presentation genuinely usable? | **YES** | Usable after vertical scroll; labels/routes/controls OK; no Slice-1-local defect fixed |
| G. Improvement immediately visible vs original baseline? | **YES** | At a glance: biome presentation, no grid default, no `biomeId` on map — not merely a CSS diff |

---

## R. Visual Evidence

Durable **runtime** screenshots (Cursor browser tool → repo evidence; **not** mockups):

| File | Content |
|------|---------|
| `docs/architecture/reviews/evidence/WORLD_SLICE_1_DESKTOP_DEFAULT.png` | Desktop **1440×900** — default World (no selection); shell + map plate, biomes, legend, minimap, routes, grid off |
| `docs/architecture/reviews/evidence/WORLD_SLICE_1_DESKTOP_SELECTED.png` | Desktop **1440×900** — **Central Basin** selected; banner, inspector, selection ring |
| `docs/architecture/reviews/evidence/WORLD_SLICE_1_NARROW.png` | Narrow **480×900** — game shell + World workspace (selection banner, legend, layer toggles; map below fold in first viewport — scroll to map documented in §P) |

Reproduce via steps in §P.

---

## S. Gameplay / API / Persistence Integrity

Read-only API enrichment (`biomeName`, `biomeCategory` from existing content). No YAML edits, no simulation/save changes.

---

## T. Deferred Work

BuildingCategoryIcon on map, tooltips, minimap pan, WM illustrations, irregular shapes — per redesign review §43.

---

## U. Repository Integrity

**Task-owned (Slice 1):** application region read-model + handlers; web world components/CSS/hooks/formatters/mappers/view-data/tests listed in `git diff` / untracked world-biome and route files.

**Unrelated churn in working tree:** simulation presentation slice files, M11/M12 docs, design assets — **not part of this slice**; do not batch-commit without review.

---

## V. Definition of Done

**COMPLETE (after narrow closeout)** — automated gates green; runtime Slice-1 checklist §Q **PASS** on World screen at desktop and narrow (§P–Q2); durable evidence §R. **Earlier “complete” without narrow validation was wrong** — corrected in this revision.

---

## W. Final Decision

**OPTION A — WORLD VISUAL PRESENTATION SLICE 1 FINAL VISUAL CLOSE READY**

Desktop passes; narrow passes (with documented vertical scroll to map); screenshots exist at §R paths; runtime result is materially more game-like than the original baseline.

**Not OPTION B/C.**
