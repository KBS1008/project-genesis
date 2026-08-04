# World Module Implementation Guide (Phase 4A / 4B)

**Project:** Project Genesis  
**Milestone:** M11 Phase 4 — World & Regional Visualization

---

## Phase 4A — Map framework

Technical shell: pan/zoom viewport, SVG regions, connections, labels, selection ring, mini-map, layer toggles, region overview inspector.

| Component | Path | Role |
|-----------|------|------|
| `PGWorldWorkspace` | `components/world/PGWorldWorkspace.tsx` | Shell + map column + region table |
| `PGWorldViewport` | Pan/zoom wrapper |
| `PGWorldCanvas` | SVG regions, connections, labels |
| `PGWorldToolbar` | Zoom / fit controls |
| `PGWorldLayerManager` | Layer toggles (grouped) |
| `PGWorldInspector` | Region inspector via `PGInspectorPanel` |
| `PGMiniMap` | Viewport indicator |

### View-data (4A)

- `adapters/view-data/world-view-data.ts` — map, layers, inspector types
- `adapters/mappers/world-view-mappers.ts` — API → view-data
- `adapters/api/world-client.ts` — `/api/world/map`, `/api/world/cities`

### Camera

- `hooks/world-camera-math.ts` — pure fit/pan/zoom math
- `hooks/useWorldCamera.ts` — wheel zoom, drag pan, fit world/region
- `hooks/useWorldLayers.ts` — layer visibility state

---

## Phase 4B — Operations overlays

Presentation-only overlays on the world map: resources, buildings, transport flows, company presence. Extended region inspector with buildings, production, and transport sections.

| Component | Path | Role |
|-----------|------|------|
| `PGWorldLegend` | `components/world/PGWorldLegend.tsx` | Legend for active layers |
| Overlay layers | `PGWorldCanvas.tsx` | Resource heat, building markers, transport styling, presence badges |
| `WorldScreen` | `screens/world/WorldScreen.tsx` | Loads overlay + operations inspector data |

### View-data (4B)

- `world-view-data.ts` — `WorldOverlayViewData`, operations layer IDs, `EMPTY_WORLD_OVERLAY`
- `world-overlay-mappers.ts` — session read models → overlays + inspector sections

### Data sources (read-only)

- `fetchBuildingList()` — building markers + presence counts
- `fetchTransportOrders()` — active transport flows between regions
- `fetchProductionJobs()` — production section in region inspector
- `fetchRegionDetails(regionId)` — regional resources for heatmap intensity

### Layer groups

| Group | Layers |
|-------|--------|
| Kartenbasis | grid, regions, connections, labels, selection |
| Betrieb | resources (default off), buildings, transport, presence |

### Navigation

Building marker click → `buildBuildingNavigationTarget(buildingId)` via `navigateToTarget`.

### Out of scope

No new gameplay logic, economy simulation, or production calculations in presentation components — mappers only.

---

See also: `DASHBOARD_IMPLEMENTATION_GUIDE.md`, `M11_PHASE_3_WORLD_AND_REGIONAL_VISUALIZATION.md`.
