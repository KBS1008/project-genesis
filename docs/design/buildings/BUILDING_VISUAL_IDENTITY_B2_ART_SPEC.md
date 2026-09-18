# Building Visual Identity — B2 Art Specification

**Status:** **APPROVED / PRODUCTION AUTHORITY** (human B2 approval + Batch 1 integration)  
**Approval date:** 2026-09-18 (Batch 1 contract freeze)  
**Naming:** `ICON-003-{buildingTypeId}` primary · `ICON-003-{buildingTypeId}-compact` glyph · `ICON-002-{category}` fallback  
**Scenario:** B — Target Production Quality (380–520 authored + ~12 procedural)

## Batch 1 contract delta (2026-09-18)

| Rule | Frozen value |
|------|----------------|
| Camera / projection | 3/4 isometric-like **southeast** family; no per-asset camera drift |
| Object occupancy | **~58–72%** frame height (footprint may scale wider for large types) |
| Ground pad | Shared industrial pad + ellipse shadow orientation |
| Light / shadow | **Upper-left** key; consistent contrast band |
| Detail density | Strong L1 silhouette, L2 function, **restrained** L3 |
| Alpha | **Real PNG alpha**; programmatic QA (`tools/building-art-alpha.ts`); no baked checkerboard |
| Runtime derivatives | Master 1024 PNG in design tree; runtime **WebP+PNG** via batch processor; catalog uses browser scaling (~72px slot) |
| Compact | Derived SVG; **READABLE @ 32px** |
| State overlays | Shared overlay-safe upper region (overlays deferred) |

---

## 1. Visual intent

B2 is **stylized 3/4 / isometric economic-strategy game building art**. The player should read **a physical structure in an industrial world**, not an admin icon or pictogram.

## 2. Perspective and camera

| Rule | Value |
|------|--------|
| Family perspective | Single coherent 3/4 isometric-like angle |
| Light direction | Upper-left (consistent across family) |
| Ground contact | Foundation slab / industrial pad + restrained elliptical ground shadow |
| Scale convention | Comparable footprint mass across types; larger YAML footprints may read slightly wider in art |
| Forbidden | Three unrelated cameras; photorealistic HDR; full landscape scenes |

## 3. Composition

- Subject = building only; no UI chrome, labels, or title cards in source assets.
- Background: **transparent or composition-safe** (alpha PNG master).
- Master resolution: **1024×1024** raster source (derivatives at runtime after approval).

## 4. Detail hierarchy

1. **Silhouette** — distinct at medium distance; three pilot types distinguishable with detail removed.
2. **Architectural identity** — function readable (production / energy / research) without text.
3. **Material / industrial detail** — rewards 128px+ display; not required for Level 1.

## 5. Material language

Restrained industrial palette compatible with dark UI: steel, concrete, siding, glass, wood/logs, pipes, stacks, machinery as appropriate per building. No rainbow category coding in primary art; no neon mobile-game saturation.

## 6. Category treatment

Primary art **must remain identifiable without category badge**. Category color may frame UI elsewhere; do not bake mandatory category frames into primary masters.

## 7. Runtime roles (conceptual)

| Role | Asset | Typical scale |
|------|--------|----------------|
| Primary | Authored B2 master (+ card derivatives) | 128–256px strong; 64px lower useful limit |
| Compact glyph | Derived simplified silhouette | 24–48px; target **READABLE @ 32px** |
| World (future) | Primary and/or compact per zoom | Dev-only mocks in pilot |

## 8. Compact derivation

- **Authored:** primary raster (or rich vector if later chosen).
- **Derived:** compact SVG (or raster downscale pipeline) preserving silhouette + one signature cue.
- Do not treat 23 primaries + 23 compacts as 46 fully independent art directions unless derivation fails in practice.

## 9. State overlay compatibility

Shared overlays (under construction, paused, blocked, maintenance) apply **on top** of primary/compact; no per-building state redraws. Overlays must remain legible on both raster primary and flat glyph.

## 10. Forbidden patterns

Generic boxes/cubes as primary completion; wireframes; stock art; emoji; gameplay numbers/unlocks in art; nuclear tropes for coal plant; flask/lightning as sole identity; copying identifiable third-party game buildings.

## 11. Pilot asset IDs

- `BUILDING-PILOT-B2-SAWMILL` (+ `-COMPACT`)
- `BUILDING-PILOT-B2-COAL_POWER_PLANT` (+ `-COMPACT`)
- `BUILDING-PILOT-B2-RESEARCH_CAMPUS` (+ `-COMPACT`)

Manifest: `docs/design/buildings/pilot-b2/PILOT_B2_MANIFEST.json`.

## 12. Production method (B2 pilot)

Primary: **generated raster concept masters** (Cursor GenerateImage workflow) with documented prompts.  
Compact: **hand-authored SVG** silhouettes derived from primary identity (pilot derivation test).

If human approves B2, production batch should freeze: prompt template, QA checklist (§4–9), derivative pipeline, and registry naming (post ICON-003 contract).
