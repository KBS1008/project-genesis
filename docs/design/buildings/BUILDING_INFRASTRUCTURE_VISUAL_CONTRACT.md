# Building Infrastructure Visual Contract

**Status:** APPROVED / PRODUCTION AUTHORITY  
**Human approval:** APPROVED / PASS / SEALED (2026-09-19)  
**Scope:** `access_road` (LINEAR), `port` and `rail_terminal` (TERMINAL/YARD)  
**Production coverage:** 23/23 ICON-003 (infrastructure production slice activated)  
**Related:** `BUILDING_VISUAL_IDENTITY_B2_ART_SPEC.md`, sealed Batches 1–3

---

## 1. Purpose

Extend the sealed ICON-003 B2 family with **two additional physical grammars** so the last three building types receive honest individual visual identity without pretending they are volumetric halls on a standard presentation pad. This document defines invariants, allowed variation, forbidden patterns, and pilot findings. Production activation is governed by `production/infrastructure/` and the 23/23 close candidate.

---

## 2. Authority

| Source | Role |
|--------|------|
| `BUILDING_VISUAL_IDENTITY_B2_ART_SPEC.md` | Shared family invariants (camera, light, alpha, compact) |
| Sealed Batch 1–3 close candidates | 20 production ICON-003 types |
| `game-content/buildings/{access_road,port,rail_terminal}.yaml` | Semantic firewall (names, footprints, unlocks) |
| `building-type-visual-asset-ids.ts` | Production mapping (23/23 including infrastructure) |
| `BuildingTypeIcon` | Primary @ catalog ~72px; compact @ lists; ICON-002 defensive fallback |
| Pilots under `infrastructure-pilot/` | Provenance only; production masters under `production/infrastructure/` |

---

## 3. Existing ICON-003 Relationship

ICON-003 remains the **single asset-family identifier** for per-building-type art. Infrastructure uses **sub-grammars** within that family:

```
ICON-003
├── VOLUMETRIC BUILDING (sealed Batches 1–3)
├── LINEAR — access_road
└── TERMINAL/YARD — port, rail_terminal
```

No separate namespace is required: registry entries still map `buildingTypeId → ICON-003-{id}` when activated.

---

## 4. Semantic Firewall

| ID | Player Name | Footprint | Placement Semantics | Network Semantics | Orientation | Visual Truths | Must Not Imply |
|----|-------------|-----------|---------------------|-------------------|-------------|---------------|----------------|
| `access_road` | Zufahrtsstrasse | 5×2 | Placeable INFRASTRUCTURE; zero cost/time; no recipes | Description: connects start plot to transport network; no adjacency/connectivity fields in YAML | Not modeled in content | Physical access connection segment on ground | Intersections, traffic, vehicles, lane capacity, road network simulation |
| `port` | Hafenanlage | 6×4 | Gated: research `intermodal_logistics`, milestone `profit_100` | Import/export large volumes (description only); no water routing in YAML | Not modeled | Terminal/yard facility at quay scale | Ships, ocean vista, multi-berth ops, container logistics mechanics |
| `rail_terminal` | Bahnterminal | 5×3 | Gated: `intermodal_logistics`, `first_industrial_machinery` | Regional rail for heavy transport (description only) | Not modeled | Loading hall + short track interface | Full network, switches, trains in motion, signals, passenger service |

**Extended matrix (contract QA):**

| ID | Name | Grammar | Footprint | Actual Semantics | Safe Visual Cues | Unsupported Implications |
|----|------|---------|-----------|------------------|------------------|--------------------------|
| access_road | Zufahrtsstrasse | LINEAR | 5×2 | Starter connectivity piece; INFRASTRUCTURE | Paved segment, shoulders, ground tie-in | Network topology, traffic |
| port | Hafenanlage | TERMINAL/YARD | 6×4 | Late-game bulk trade facility | Quay edge, crane, yard stacks, shed | Navigation, fleet, animated cargo |
| rail_terminal | Bahnterminal | TERMINAL/YARD | 5×3 | Late-game heavy transport hook | Platform hall, rails at yard edge, gantry | Routing, rolling stock simulation |

**Product ambiguity:** NO — YAML is sufficient for honest facility/linear depiction at icon scale.

---

## 5. Shared Family Invariants

All grammars **must** share:

- Stylized economic-strategy rendering (non-photoreal band per B2)
- 3/4 isometric-like **southeast** camera family; upper-left key light
- Controlled industrial palette; strong L1 silhouette
- Physical-object identity (not pictogram-only)
- Real PNG alpha via `tools/building-art-alpha.ts`; no baked checkerboard or opaque studio fill
- No UI chrome, text, or category badge inside artwork
- Compact SVG derivative architecture; READABLE @ 32px target
- Semantic IDs: `ICON-003-{buildingTypeId}` / `-compact` when promoted
- Runtime pipeline: design master → alpha process → public WebP+PNG + compact SVG (unchanged)

---

## 6. Volumetric Building Grammar Reference

Sealed rule (Batches 1–3): bounded industrial **pad + ellipse shadow**, subject **~58–72% frame height**, central mass reads as enclosed structure. Catalog slot ~72px. Reference only — infrastructure **must not** copy the pad-as-building trick for roads.

---

## 7. LINEAR Infrastructure Grammar

**Type:** `access_road` only.

- **Subject:** Representative **access road segment** (connection geometry), not a building volume.
- **Composition:** Elongated band across square 1024 canvas; diagonal or horizontal acceptable if camera family holds.
- **Cues:** pavement, curbs/shoulders, subtle grading; optional edge where segment meets ground.
- **Forbidden:** Office/warehouse mass, road-sign icon, floating symbol, tiny road on generic hall.
- **Compact:** Simplified band + edge highlight; no text.

---

## 8. TERMINAL/YARD Infrastructure Grammar

**Types:** `port`, `rail_terminal`.

- **Subject:** **Interface + yard + terminal infrastructure**; lower/wider than volumetric halls.
- **Port:** Quay edge, terminal shed, crane, container/cargo yard; **minimal** water strip — not scenic harbor.
- **Rail:** Platform/hall, **short** track interface, cargo yard, loading equipment — not network map.
- **Differentiation:** Port emphasizes quay/water-edge and crane; rail emphasizes parallel rails and loading hall.
- **Forbidden:** Generic warehouse silhouette interchangeable with `distribution_center` / `warehouse`.

---

## 9. Perspective

| Grammar | Camera | Framing variance |
|---------|--------|------------------|
| Volumetric | SE 3/4 family | Standard pad-centered |
| LINEAR | Same family | Horizontal/diagonal elongation within canvas |
| TERMINAL/YARD | Same family | Wider ground-plane occupancy; lower apex height |

No per-type camera drift. Viewer must read one world.

---

## 10. Ground Plane

| Grammar | Ground rule |
|---------|-------------|
| Volumetric | Industrial pad + ellipse shadow (sealed) |
| LINEAR | **Continuous ground plane** under pavement; **no building podium**; optional soft edge shadow under segment |
| TERMINAL/YARD | **Yard-grade concrete/asphalt** integrated with structures; **no decorative pedestal**; shadow anchors yard |

---

## 11. Occupancy

| Grammar | Guidance |
|---------|----------|
| Volumetric | ~58–72% height (B2) |
| LINEAR | **~35–55% height**, **~55–75% width** of subject band; comparable **visual weight** via contrast and stroke at catalog scale |
| TERMINAL/YARD | **~40–58% height**, **~65–85% width**; mass spread horizontally |

---

## 12. Lighting

Upper-left key; consistent shadow direction. LINEAR: slightly flatter top surfaces acceptable. TERMINAL/YARD: equipment highlights same band as B2 steel/concrete.

---

## 13. Materials

Road: asphalt/concrete, muted lane wear. Terminal yards: concrete, steel structures, container/stack blocks. Rails: steel rails, ballast suggestion. **No gameplay state** (idle/active) baked into base primary.

---

## 14. Detail Hierarchy

L1: grammar-readable silhouette (band / quay+crane / hall+tracks). L2: functional cues. L3: restrained equipment detail — optional at 128px+, stripped in compact.

---

## 15. Alpha

Same QA as production: edge-connected background removal, transparent pixels, no halo. Pilots: **3/3 PASS** (`INFRASTRUCTURE_VISUAL_CONTRACT_ALPHA_REPORT.json`).

---

## 16. Compact Glyph Grammar

Authored SVG 48×48 viewBox; ellipse shadow optional; **physical cue** from primary geometry. Test 24/32/48px. Do not reuse ICON-002 category shapes as compacts.

---

## 17. Catalog-Scale Rules

BuildingsScreen catalog uses `BuildingTypeIcon` **size={72}**. Infrastructure primaries must remain readable at 72px without registry integration (static evidence: `INFRASTRUCTURE_VISUAL_CONTRACT_CATALOG_SCALE.png`). LINEAR types need **width-forward** composition and value contrast.

---

## 18. World-Scale Feasibility

| Asset | Assessment |
|-------|------------|
| Primary | **PRIMARY SUITABLE** for future map markers at medium zoom with footprint-aware placement |
| Compact | **COMPACT SUITABLE** for minimap/list at high zoom-out |
| Notes | **NEEDS FUTURE WORLD-SPECIFIC DERIVATIVE** for `access_road` if map shows true 5×2 orientation on tile grid — icon grammar is representative, not oriented tile art |

No World integration in this slice.

---

## 19. State Overlay Compatibility

**SHARED OVERLAYS SUFFICIENT** for construction/paused/blocked/maintenance at catalog and list scales. Overlays apply above raster/SVG bounds; LINEAR and TERMINAL/YARD lack a single “roof cap” but rectangular overlay frames remain legible. No infrastructure-specific overlay extension required for v1 production slice.

---

## 20. Naming

| Phase | Primary | Compact |
|-------|---------|---------|
| Pilot (now) | `ICON-003-{id}-infra-pilot` | `ICON-003-{id}-infra-pilot-compact` |
| Proposed production | `ICON-003-{id}` | `ICON-003-{id}-compact` |

---

## 21. Production Pipeline Compatibility

Existing tools apply: `removeBuildingArtBackground`, `validateBuildingArtAlpha`, batch-style sync to `apps/web/public/assets/buildings/`, registry extension in `ICON_003_PRODUCTION_BUILDING_TYPE_IDS` **only after human approval**. Pilots processed by `tools/process-infrastructure-pilot-alpha.ts` (design tree only).

---

## 22. Forbidden Patterns

- Road as normal volumetric building or road icon on generic hall
- Port or rail terminal as generic warehouse
- Unrelated camera; full scenic landscape; giant harbor or rail network panorama
- UI text; category badge dependency; baked checkerboard; opaque black studio background
- Photorealistic mismatch; dominant vehicles/trains/ships; invented capacity or network complexity

---

## 23. Pilot Findings

| ID | Grammar | Primary | Alpha | Family | Catalog @72 | Compact @32 | Semantic truth | Result |
|----|---------|---------|-------|--------|-------------|-------------|----------------|--------|
| access_road | LINEAR | `infrastructure-pilot/primary/...` | PASS | PASS | PASS | PASS | PASS | **PASS** |
| port | TERMINAL/YARD | same | PASS | PASS | PASS | PASS | PASS | **PASS** |
| rail_terminal | TERMINAL/YARD | same | PASS | PASS | PASS | PASS | PASS | **PASS** |

Evidence boards under `docs/architecture/reviews/evidence/INFRASTRUCTURE_VISUAL_CONTRACT_*.png`.

---

## 24. Production Readiness

Contract and pilots demonstrate **feasibility** for a later **three-asset production slice**. Activation requires: human visual approval, registry + runtime sync, alpha re-run on production IDs, runtime evidence — **not** part of this task.

---

## 25. Human Approval Status

**APPROVED / PASS / SEALED** (2026-09-19). Production promotion completed under `docs/design/buildings/production/infrastructure/`. Pilot masters retained under `infrastructure-pilot/` for provenance.

---

## Grammar Matrix

| Property | Volumetric B2 | LINEAR | TERMINAL/YARD |
|----------|---------------|--------|---------------|
| Camera | SE 3/4 family | Same | Same |
| Ground plane | Pad + ellipse | Continuous ground, no podium | Integrated yard |
| Occupancy | 58–72% height | 35–55% H, 55–75% W band | 40–58% H, 65–85% W |
| Horizontal extent | Footprint-scaled mass | Dominant | Dominant |
| Functional cue | Enclosed volume | Connection segment | Interface + yard |
| Detail hierarchy | L1 hall/stack | L1 band | L1 quay/crane or tracks/hall |
| Compact strategy | Hall silhouette | Diagonal band | Quay or track+hall |
| Catalog role | 72px primary | 72px primary | 72px primary |
| World potential | Marker OK | May need oriented derivative | Marker OK |
