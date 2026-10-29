# Project Genesis — World Web Visual Baseline (Post-V1)

**Status:** `POST_V1_VISUAL_BASELINE_FROZEN`  
**Git reference at freeze documentation:** `master` @ `0d3dc7eb699792a75b4950c07482ec308e7dfcfc` (working tree may include uncommitted scenic increments — file paths below reflect **on-disk** implementation).  
**Implementation guide:** `docs/development/CURSOR_IMPLEMENTATION_GUIDE.md` (SHA-256 `6d7e426c9557b5a119c1c5e1d451449a1a4b843e268dd9ac41f8dd97e446c821`)

---

## 1. Purpose

Define the **accepted Post-V1 World Web visual baseline** so future work preserves owner-approved presentation without reopening closed scenic-polish cycles.

This is **not** a claim that artwork or scale relationships are permanently final.

---

## 2. Baseline status

| Rule | Meaning |
|------|---------|
| `REGION_LABEL_PRESENTATION_FROZEN` | Owner-approved ivory/outline scenic labels — no cosmetic rework without new approval |
| `BUILDING_SCALE_FROZEN` | ICON-003 marker dimensions and scenic counter-scale — no resize without explicit owner approval |
| `SCENIC_TERRAIN_ARTWORK_FROZEN` | Scenic JPEG plate and region grid art — no image replacement in drive-by tasks |
| `BUILDING_ARTWORK_FROZEN` | ICON-003 compact assets — identity preserved |
| `CURRENT_SCENIC_POLISH_ITERATION_CLOSED` | No further CSS/SVG shadow tuning passes without a new scoped prompt |

---

## 3. Owner-approved decisions

- **Region labels:** Light warm text (~15px / 17px selected desktop), dark stroke, inverse zoom scaling, layer after buildings (`PGWorldCanvas` scenic label layer).
- **Building sizes:** Frozen despite landscape prominence; scale review documented `REQUIRES_EXPLICIT_OWNER_APPROVAL` for any resize.
- **Terrain:** Static scenic plate only; trees/rivers/paths are **baked raster**, not simulated entities.
- **Polish iteration:** Closed after grounding slice (limited visible delta at overview zoom).

---

## 4. Current visual architecture

| Layer | Component / module | Notes |
|-------|-------------------|--------|
| Entry | `WorldScreen.tsx` → `PGWorldWorkspace.tsx` | World route, layers, inspector |
| Viewport | `PGWorldViewport.tsx` | CSS `translate` + `scale` on `.pg-world-canvas-transform` |
| Scenic terrain | `PGWorldScenicBackgroundLayer.tsx` | Letterboxed JPEG when scenic profile active |
| Scenic flag | `world-scenic-feature.ts` | `NEXT_PUBLIC_PG_WORLD_SCENIC_BACKGROUND` = `1` or `true` |
| Profile | `world-scenic-presentation-profile.ts` | UV region anchors, plate 1280×720 |
| Projection | `world-scenic-visual-projection.ts`, `world-scenic-calibration.ts` | Presentation-only marker/anchor mapping |
| Canvas | `PGWorldCanvas.tsx` | SVG: routes, scenic regions, buildings, scenic labels |
| Labels | `world-scenic-region-label-scale.ts`, `world-scenic-region-label-layout.ts` | Inverse scale + visibility threshold **0.92** |
| Buildings | `PGWorldBuildingMarker.tsx`, `world-building-marker-visual.ts` | ICON-003; scenic counter-scale via `world-scenic-building-marker-scale.ts` |
| Grounding | `world-scenic-building-grounding.ts` | Contact shadow + stack offset (scenic only) |
| Transport | `PGWorldCanvas` route groups, `world-transport-route-presentation.ts` | Separate from baked terrain paths |
| Minimap | `PGMiniMap.tsx` | Aligned to world camera state |

---

## 5. Terrain artwork

- **Path:** `apps/web/public/assets/world/world-plate-2d-scenic-static-industry-removed.jpg`
- **SHA-256:** `44a1291d7216cfbdaebdd2ccc109d2fd6f239f1e5abe465e1206cdc48d14776b`
- **Constants:** `WORLD_SCENIC_PLATE_*` in `world-scenic-presentation-profile.ts`

---

## 6. Region labels (frozen)

- CSS: `.pg-world-scenic-region-label*` in `world-components.css` (ivory fill `#f3e8d0`, stroke `#2a1810`, ~15–17px apparent via inverse scale).
- Logic: `resolveScenicRegionLabelInverseScale`, `shouldRenderScenicRegionLabel`.
- **Do not modify** in unrelated tasks.

---

## 7. Building presentation (frozen scale)

- Default glyph ~34×34 user units; scenic apparent width ~**37 CSS px** with counter-scale (see `SCENIC_BUILDING_MARKER_SCREEN_BOOST` = 1.1).
- Grounding: `scenicGroundingPresentation` + `--scenic-grounding` class (presentation-only).
- World positions and hit targets unchanged by grounding.

---

## 8. Camera and minimap

- Camera math: `world-camera-math.ts`, hooks on `WorldScreen` / workspace.
- Minimap: reflects camera; not modified in scenic increments.

---

## 9. Transport and resource overlays

- Transport: SVG connections + optional active route styling (scenic calibrated opacity).
- Resources: heat rects on grid regions when layer enabled.
- **Not** the same as painted paths on the scenic plate.

---

## 10. Known limitations (accepted)

- Orthographic ICON-003 sprites on oblique scenic plate (`MINOR_INCONSISTENCY` / scale review).
- Building prominence vs baked forest texture (`SIGNIFICANT_INCONSISTENCY` at composition level; sizes frozen).
- Grounding slice: **limited** overview visibility of improvement (handoff OPTION B).
- Trees/rivers not independently addressable without art pipeline.

Classification for future work: `FUTURE_OPTIONAL_IMPROVEMENT` — not defects requiring silent polish.

---

## 11. Preservation contract

Future World Web visual changes require:

1. Explicit owner approval for any **Category B+** change (labels, scale, terrain art, building art).
2. New scoped prompt — not drive-by CSS in gameplay tasks.
3. Focused before/after evidence when visual behavior changes.

---

## 12. Change-control rules

| Category | Examples | Default |
|----------|----------|---------|
| A — Safe | Bug fix with zero visual delta | Allowed with tests |
| B — Presentation | Label color, shadow tweak | **Requires approval** |
| C — Scale / art | Building resize, new plate | **Blocked without owner** |
| D — Architecture | Renderer replacement | Separate program |

---

## 13. Relevant source files

See `VISUAL_BASELINE_SOURCE_REFERENCES.json` in the baseline freeze handoff.

---

## 14. Relevant tests (focused)

- `PGWorldViewport.scenic.test.tsx`
- `world-scenic-region-label-scale.test.ts`
- `world-scenic-building-marker-scale.test.ts`
- `world-scenic-building-grounding.test.ts`
- `PGWorldBuildingMarker.test.tsx`
- `WorldScreen.escape.test.tsx`
- `world-scenic-feature.test.ts`

---

## 15. Historical handoff references

| Increment | Archive (under `docs/architecture/reviews/`) |
|-----------|-----------------------------------------------|
| Scenic map visual enhancement | `project-genesis-post-v1-world-web-scenic-map-visual-enhancement-handoff.zip` |
| Composition upgrade | `project-genesis-post-v1-world-web-scenic-map-visual-composition-upgrade-handoff.zip` |
| Building integration | `project-genesis-post-v1-world-web-scenic-building-integration-handoff.zip` |
| Scale & perspective review | `project-genesis-post-v1-world-web-scenic-scale-and-perspective-review-handoff.zip` |
| Building grounding | `project-genesis-post-v1-world-web-scenic-building-grounding-and-perspective-handoff.zip` (SHA-256 `5d1405dbef2e611a1768aa21401546664921895e63e033071ea411c0d1c03507`) |

Administrative verdicts were often **OPTION B** — do not upgrade to OPTION A retroactively.

---

## 16. Future developer checklist

Before changing World Web visuals:

- [ ] Read this baseline and owner freeze rules.
- [ ] Confirm change category (A/B/C/D).
- [ ] Do **not** adjust labels, building scale, or terrain JPEG without approval.
- [ ] Run focused tests above + browser evidence if presentation changes.
- [ ] Do not reopen closed increment acceptance matrices.
