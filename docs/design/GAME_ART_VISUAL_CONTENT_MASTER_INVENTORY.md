# Game Art & Visual Content — Master Inventory

**Purpose:** Machine-readable planning inventory for post-V1 visual content.  
**Authority:** `POST_V1_GAME_ART_VISUAL_CONTENT_MASTER_PLAN_REVIEW.md` · `POST_V1_SCENARIO_B_VISUAL_COVERAGE_PROGRESS_REVIEW.md` · `POST_V1_SCENARIO_B_VISUAL_COVERAGE_PROGRESS_REVIEW_02.md`  
**Baseline HEAD:** `5f24b61` (ICON-005 7/7 sealed; Scenario-B progress review 02)  
**Content root:** `game-content/` (YAML counts below)

**Legend — STATUS:** `ACTIVE` runtime certified | `PROCEDURAL` code-driven | `GENERIC` functional not game-identified | `GAP` no distinct identity | `FUTURE` mechanics absent | `SEALED` closed workstream

**Legend — TARGET MODE:** `UNIQUE` | `SHARED` | `MODULAR` | `ICON` | `PROCEDURAL` | `OVERLAY` | `UI-ONLY`

---

## Summary counts (enabled content)

| Domain | Count | Source |
|--------|------:|--------|
| Building types | 23 | `game-content/buildings/*.yaml` |
| Resources | 9 | `game-content/resources/*.yaml` |
| Recipes | 7 | `game-content/recipes/*.yaml` |
| Technologies | 22 | `game-content/research/*.yaml` |
| Employees | 19 | `game-content/employees/*.yaml` |
| Milestones | 8 | `game-content/milestones/*.yaml` |
| Regions | 4 | `game-content/regions/*.yaml` |
| Cities | 7 | `game-content/cities/*.yaml` |
| Biomes | 3 | `game-content/biomes/*.yaml` |

---

## Scenario B progress ledger (2026-09-20)

**Planning envelope (unchanged):** ~380–520 **authored** deliverables + ~**12 procedural** visual systems. Not a quota.

| Class | Confirmed minimum | Notes |
|-------|------------------:|-------|
| Authored primary concepts | **79** | prior **71** sealed families + **8 WFV-001** Workforce Batch-1 hybrids (partial **8/19**) |
| Authored secondary (compact glyphs) | **33** | ICON-003 compacts **23** + ICON-004 category SVGs **10** |
| Generic reusable UI icons | **~11** | `DashboardIcon` inline glyphs (not registry PNG family) |
| Decorative / scenic (runtime) | **3** | MM-001/006/007; MM-002–005 reference mockups separate |
| Procedural systems (production) | **~5** | World biomes + routes + minimap; dashboard/recharts + CH-010 chart language |
| Derived runtime | excluded | WebP/PNG copies of masters — not independent concepts |
| Fallback | **6** | ICON-002 category SVGs (defensive + legacy path) |
| Dev / pilot / evidence | excluded | `infrastructure-pilot/`, evidence PNGs, dev compare pages |

**Estimated authored range:** **~112–122** if counting primary + secondary concepts separately toward envelope; **~79** distinct primary art directions including partial Workforce track.

**WFV-001 (Workforce role identity):** **PRODUCTION BATCH 1 ACTIVE — 8/19** hybrid primaries (`WorkforceRoleVisual` + `PGEmployeesWidget` art column). Pilot DEV assets excluded from production totals.

**Next after WFV Batch 1 close:** Batch 2 planning or transport (**TRV**) per deferred list.

**Deferred (not rejected):** transport mode/vehicle identity, milestone medallions (**MSV-001**), market trend visualization polish, building state overlay badges, shell nav icon family, tutorial step vignettes (UX-heavy).

---

## FAMILY: Scenic / Brand / Menu

| Subfamily | Entity | Source | Current visual | Target mode | Priority | Status |
|-----------|--------|--------|----------------|-------------|----------|--------|
| Main menu | MM-001 background | registry | raster + webp | UNIQUE scenic | P2 | ACTIVE |
| Main menu | MM-006 splash | registry | raster | UNIQUE scenic | P2 | ACTIVE |
| Main menu | MM-007 loading | registry | raster | UNIQUE scenic | P2 | ACTIVE |
| Dialog refs | MM-002–005 | registry | reference mockups | UI-ONLY | P3 | ACTIVE (reference) |
| Brand | BR-001 logo | registry | SVG | UNIQUE | P0 | ACTIVE |

---

## FAMILY: Resources / Goods

| Entity ID | Name (DE) | Category | Current | Target | Unique/Shared | Priority | Status |
|-----------|-----------|----------|---------|--------|---------------|----------|--------|
| wood | Holz | PRIMARY_RESOURCE | ICON-001 png/webp | ICON | UNIQUE | P1 | ACTIVE |
| stone | Stein | PRIMARY_RESOURCE | ICON-001 | ICON | UNIQUE | P1 | ACTIVE |
| iron_ore | Eisenerz | PRIMARY_RESOURCE | ICON-001 | ICON | UNIQUE | P1 | ACTIVE |
| planks | Bretter | PROCESSED_RESOURCE | ICON-001 | ICON | UNIQUE | P1 | ACTIVE |
| steel | Stahl | PROCESSED_RESOURCE | ICON-001 | ICON | UNIQUE | P1 | ACTIVE |
| machine_parts | Maschinenteile | COMPONENT | ICON-001 | ICON | UNIQUE | P1 | ACTIVE |
| advanced_electronics | Advanced Elektronik | COMPONENT | ICON-001 | ICON | UNIQUE | P1 | ACTIVE |
| industrial_machinery | Industriemaschinen | INDUSTRIAL_MATERIAL | ICON-001 | ICON | UNIQUE | P1 | ACTIVE |
| consumer_goods | Konsumgüter | PRODUCT | ICON-001 | ICON | UNIQUE | P1 | ACTIVE |

**Gap:** none for enabled tradable resources at icon tier; **expansion** only if new resources added to content.

---

## FAMILY: Building categories (ICON-002)

| Category | Current | Target | Status |
|----------|---------|--------|--------|
| PRODUCTION | SVG ICON-002 | SHARED family base | ACTIVE (BuildingsScreen) |
| ENERGY | SVG | SHARED | ACTIVE |
| STORAGE | SVG | SHARED | ACTIVE |
| INFRASTRUCTURE | SVG | SHARED | ACTIVE |
| ADMINISTRATION | SVG | SHARED | ACTIVE |
| RESEARCH | SVG | SHARED | ACTIVE |

---

## FAMILY: Building types (per-type identity)

| Entity ID | Category | Current visual | Target mode | State overlays | Priority | Status |
|-----------|----------|----------------|-------------|----------------|----------|--------|
| access_road | INFRASTRUCTURE | ICON-003 primary + compact (LINEAR) | UNIQUE silhouette | OVERLAY | P0 | **ACTIVE (Infrastructure 23/23)** |
| assembly_plant | PRODUCTION | ICON-003 primary + compact | UNIQUE + MODULAR | OVERLAY | P0 | **ACTIVE (Batch 2)** |
| coal_power_plant | ENERGY | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 1)** |
| consumer_goods_plant | PRODUCTION | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 2)** |
| corporate_headquarters | ADMINISTRATION | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 1)** |
| distribution_center | STORAGE | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 2)** |
| electronics_factory | PRODUCTION | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 2)** |
| headquarters | ADMINISTRATION | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 2)** |
| logistics_hub | INFRASTRUCTURE | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 1)** |
| machine_shop | PRODUCTION | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 1)** |
| maintenance_facility | INFRASTRUCTURE | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 3)** |
| port | INFRASTRUCTURE | ICON-003 primary + compact (TERMINAL/YARD) | UNIQUE | OVERLAY | P0 | **ACTIVE (Infrastructure 23/23)** |
| power_substation | ENERGY | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 2)** |
| rail_terminal | INFRASTRUCTURE | ICON-003 primary + compact (TERMINAL/YARD) | UNIQUE | OVERLAY | P0 | **ACTIVE (Infrastructure 23/23)** |
| recycling_facility | INFRASTRUCTURE | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 3)** |
| regional_headquarters | ADMINISTRATION | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 3)** |
| research_campus | RESEARCH | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 1)** |
| sawmill | PRODUCTION | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 1)** |
| smelter | PRODUCTION | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 1)** |
| solar_power_plant | ENERGY | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 2)** |
| training_center | ADMINISTRATION | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 3)** |
| university | RESEARCH | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 2)** |
| warehouse | STORAGE | ICON-003 primary + compact | UNIQUE | OVERLAY | P0 | **ACTIVE (Batch 1)** |

**ICON-003 per-type coverage (current authoritative 23 building types):** **23 / 23** — 20 VOLUMETRIC (Batches 1–3) + 1 LINEAR (`access_road`) + 2 TERMINAL/YARD (`port`, `rail_terminal`). ICON-002 remains defensive category fallback in `BuildingTypeIcon`.

**World map:** **WBM-001** — ICON-003 compact markers via `PGWorldBuildingMarker` (generic `buildingTypeId` resolver) — **ACTIVE** pending human seal.

---

## FAMILY: Building states (gameplay)

| State | Domain | Current UI | Target | Deliverable type |
|-------|--------|------------|--------|------------------|
| PLANNED / UNDER_CONSTRUCTION | BuildingStatus | text status | OVERLAY badge | 1 shared overlay |
| ACTIVE | BuildingStatus | text | base art | — |
| PAUSED / BLOCKED / MAINTENANCE | BuildingStatus | text | OVERLAY tint/badge | 2–3 shared overlays |
| DAMAGED / DEMOLISHED | BuildingStatus | rare in UI | OVERLAY or UI-ONLY | defer |

No content-defined building **tiers/upgrades** in YAML; `level` fixed at 1 in domain create — **no tier art** unless product adds progression.

---

## FAMILY: World / Biomes (SEALED presentation foundation)

| Entity | Current | Target (long-term) | Status |
|--------|---------|-------------------|--------|
| biome_coastal_lowlands | PROCEDURAL pattern + palette | + optional scenic plate, prop kit | PROCEDURAL + MODULAR | SEALED slice 1 |
| biome_industrial_plains | PROCEDURAL | same | SEALED |
| biome_temperate_forest | PROCEDURAL | same | SEALED |
| Map routes | PROCEDURAL SVG | styled infrastructure | PROCEDURAL | SEALED |
| Minimap | PROCEDURAL | same language | SEALED |

---

## FAMILY: Regions / Environments

| Entity ID | Biome link | Current | Target | Priority |
|-----------|------------|---------|--------|----------|
| region_default | content | procedural region rects | optional vista / prop kit | P2 |
| region_north | content | same | MODULAR accent | P2 |
| region_south | content | same | MODULAR accent | P2 |
| region_east | content | same | MODULAR accent | P2 |

---

## FAMILY: Research / Technology

| Scope | Count | Current | Target | Priority | Status |
|-------|------:|---------|--------|----------|--------|
| All technologies | 22 | **ResearchScreen** — **22/22** Tier-1 detailed + 10 Tier-2 category (`TechnologyVisual`) | evidence-driven Tier-1 + category fallback | P1 | **SEALED — ICON-004 22/22** (Batch 4 abstract completion @ `b5f3348`) |

*Per-technology rows omitted here; inventory model = 22 entities × ICON (family or unique).*

---

## FAMILY: Production

| Concept | Count | Current | Target | Status |
|---------|------:|---------|--------|--------|
| Recipes | 7 | **ICON-005** process primaries on ProductionScreen catalog + jobs context | Tier-1 process primary per recipe | **SEALED — ICON-005 7/7** @ `5f24b61` |
| Operational state | — | DashboardIcon integration (sealed slice) | OVERLAY + icon | PARTIAL |

---

## FAMILY: Energy

| Concept | Current | Target | Status |
|---------|---------|--------|--------|
| KPI / charts | DashboardIcon + charts | PROCEDURAL + plant UNIQUE icons | UI-LED |
| Power buildings | ICON-003 per type (sealed) | tie to building type art | **ACTIVE (ICON-003)** |

---

## FAMILY: Transport / Infrastructure

| Concept | Current | Target | Status |
|---------|---------|--------|--------|
| Routes (world) | PROCEDURAL curved paths | optional infra styling | SEALED / PROCEDURAL |
| Transport orders | tables | vehicle ICON + cargo resource icons | GAP |
| Logistics YAML routes | content | no vehicle art | FUTURE optional |

---

## FAMILY: Warehouse / Storage

| Concept | Current | Target | Status |
|---------|---------|--------|--------|
| Site inventory | ICON-001 in widgets (sealed) | ACTIVE | ACTIVE |
| Warehouse building | ICON-003 (Batch 1) | building type art | **ACTIVE (Batch 1)** |

---

## FAMILY: Market / Economy

| Concept | Current | Target | Status |
|---------|---------|--------|--------|
| Prices / supply-demand | charts (CH-010), tables | PROCEDURAL | BALANCED |
| Resource rows | ICON-001 where wired | ICON | PARTIAL |

---

## FAMILY: Workforce / Employees

| Scope | Count | Current | Target | Priority | Status |
|-------|------:|---------|--------|----------|--------|
| Employee types | 19 | WFV Batch-1 primaries + ICON-002 category fallback | detailed hybrid primary + fallback | P2 | **PARTIAL — 8/19 ACTIVE** |

---

## FAMILY: Milestones / Progression

| Scope | Count | Current | Target | Priority | Status |
|-------|------:|---------|--------|----------|--------|
| Milestones | 8 | text in hints | achievement ICON | P2 | GAP |

---

## FAMILY: Events / Notifications

| Concept | Current | Target | Status |
|---------|---------|--------|--------|
| Player events / notifications | text list | optional illustration | FUTURE (no rich event catalog) |

---

## FAMILY: Tutorial / Guidance visuals

| Concept | Current | Target | Priority |
|---------|---------|--------|----------|
| PGTutorialPanel steps | text only | step ICON + optional screen vignette | P2 (UX separate) |

---

## FAMILY: UI Navigation

| Screen ID | Current | Target | Priority |
|-----------|---------|--------|----------|
| world … reports (9) | text nav pills | screen ICON family | P2 |

---

## FAMILY: Economic visualization

| System | Current | Status |
|--------|---------|--------|
| Dashboard charts | CH-010 SVG + recharts | PROCEDURAL ACTIVE |
| KPI strip | DashboardIcon outlines | UI-LED |

---

## Dependency notes

| Consumer | Depends on |
|----------|------------|
| BuildingsScreen catalog | ICON-003 registry (**23/23 ACTIVE**) |
| World map | **WBM-001** compact glyphs (`PGWorldBuildingMarker`) | **ACTIVE** |
| ProductionScreen | **ICON-005 SEALED** — `ProductionProcessVisual` in Rezeptkatalog |
| ResearchScreen | ICON-004 **SEALED 22/22** Tier-1 detailed + category compact |
| Player guidance (separate WS) | milestone icons optional overlap |

---

## Registry reference

Runtime entries: `apps/web/src/presentation/assets/visual-asset-registry.ts`  
Loader: `visual-asset-loader.ts`  
Tooling: `src/tools/visual-asset-manager/`
