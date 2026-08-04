# World Module Implementation Guide (Phase 4A)

**Project:** Project Genesis  
**Milestone:** M11 Phase 4 — World & Regional Visualization  
**Scope:** Framework only (no economy/production overlays)

---

## Phase 4A deliverables

| Component | Path | Role |
|-----------|------|------|
| `PGWorldWorkspace` | `components/world/PGWorldWorkspace.tsx` | Shell + map column + region table |
| `PGWorldViewport` | Pan/zoom wrapper |
| `PGWorldCanvas` | SVG regions, connections, labels |
| `PGWorldToolbar` | Zoom / fit controls |
| `PGWorldLayerManager` | Framework layer toggles |
| `PGWorldInspector` | Region overview via `PGInspectorPanel` |
| `PGMiniMap` | Viewport indicator |

## View-data

- `adapters/view-data/world-view-data.ts` — map, layers, inspector types
- `adapters/mappers/world-view-mappers.ts` — API → view-data
- `adapters/api/world-client.ts` — `/api/world/map`, `/api/world/cities`

## Camera

- `hooks/world-camera-math.ts` — pure fit/pan/zoom math
- `hooks/useWorldCamera.ts` — wheel zoom, drag pan, fit world/region
- `hooks/useWorldLayers.ts` — layer visibility state

## Out of scope (Phase 4B+)

Production, research, economy, logistics, and company-building overlays on the world map.

---

See also: `DASHBOARD_IMPLEMENTATION_GUIDE.md`, `M11_PHASE_3_WORLD_AND_REGIONAL_VISUALIZATION.md`.
