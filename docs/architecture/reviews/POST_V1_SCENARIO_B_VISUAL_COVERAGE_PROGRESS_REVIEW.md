# Post-V1 Scenario B — Visual Coverage Progress Review

**Workstream:** POST-V1-SCENARIO-B-VISUAL-COVERAGE-PROGRESS  
**Date:** 2026-09-19  
**Mode:** Read-only portfolio / coverage review (no art, no production code, no content)  
**Authority prompt:** `docs/development/Prompts/POST_V1_SCENARIO_B_VISUAL_COVERAGE_PROGRESS_REVIEW.md`

**Final decision:** **OPTION A — SCENARIO B HAS A CLEAR NEXT MATERIAL VISUAL WORKSTREAM**

**NEXT VISUAL WORKSTREAM:** Technology / Research Visual Identity (**ICON-004** family)  
**FIRST BOUNDED SLICE:** Technology category icon contract + **6 representative category glyphs** (pilot), human visual gate before full 11-category or 22-tech production.

---

## A. Executive Summary

Building Visual Identity is **complete and sealed** at **23/23** ICON-003 primary + compact coverage. Scenario B planning envelope (**380–520 authored + ~12 procedural**) remains **appropriate**; confirmed authored production is roughly **42 primary concepts + 23 compacts** (~**65** design deliverables if secondaries counted), plus **~5 procedural systems** — early in the envelope by design, not a failure.

The player still experiences **text/table-led** Research, Transport, Milestones, Workforce, and **dot markers** on World buildings despite strong menu, resource, building-catalog, and procedural map identity.

**One next workstream:** establish **technology/research visual identity** (stable `TechnologyCategory` + 22 technology IDs) — highest combination of exposure, progression value, blur-test failure, and scalable family structure. **Not** building art, World Slice 1 reopen, or ICON-001/002/003/BR/MM sealed tracks.

---

## B. Repository Baseline

| Item | Value |
|------|--------|
| HEAD | `ee16a05bb9a6df48ead115b2791c88f0f476afd6` |
| Latest commit | `ee16a05` — Complete ICON-003 … 23/23 infrastructure production |
| Branch | `master` |
| 23/23 committed & pushed | **YES** (`93e5413..ee16a05` on `origin/master`) |

**Unrelated working tree (not absorbed):** dashboard/shell mappers, M11/M12 doc edits, design Bilder deletions, dev building-pilot pages, api saves, etc.

**Task-owned by this review:** `GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md` (Scenario B ledger + stale fixes), this report.

---

## C. Scenario-B Authority

| Rule | Status |
|------|--------|
| Scenario | **B — Target Production Quality** |
| Authored envelope | 380–520 (planning, not quota) |
| Procedural envelope | ~12 systems |
| Target changed in this review | **NO** |
| Building track | **SEALED** — 23/23, grammars 20 VOLUMETRIC + 1 LINEAR + 2 TERMINAL/YARD |

---

## D. Current Production Visual Portfolio

| Family | Production state | Class |
|--------|------------------|-------|
| Main menu scenics | MM-001/006/007 raster+webp runtime | Authored primary + derived |
| Brand | BR-001 SVG | Authored primary |
| Resources | 9× ICON-001 png/webp | Authored primary + derived |
| Building categories | 6× ICON-002 SVG | Authored primary (fallback architecture) |
| Building types | 23× ICON-003 primary + 23 compact | Authored primary + secondary |
| Dashboard KPI | ~11 `DashboardIcon` inline SVGs | Generic reusable UI |
| Charts | CH-010 + recharts | Procedural / UI-led |
| World map | Biome patterns, routes, minimap | Procedural (Slice 1 sealed) |
| Research | Text catalog + tables | **GAP** |
| Milestones / employees | Text hints | **GAP** |
| Transport orders | Tables + generic icons | **WEAK** |
| Building state overlays | Text status | **GAP** (overlay art not produced) |
| World building markers | Circles | **GAP** (reuse opportunity, not new authored family) |

Runtime registry pattern: `visual-asset-registry.ts` + `apps/web/public/assets/**`.

---

## E. Counting Method

- **One** 1024 PNG master + WebP + PNG runtime = **one** authored primary.
- Pilot promoted to production = **one** concept (not double-counted).
- Evidence boards / Playwright PNGs = **not** deliverables.
- Compacts counted as **authored secondary** when manually designed SVG glyphs.
- DashboardIcon React paths = **generic UI**, not Scenario B authored inventory.
- Procedural = code-driven systems with player-visible output (World, charts).

---

## F. Scenario-B Counting Ledger

| Family | Authored Primary | Authored Secondary | Derived Runtime | Procedural Systems | Production Active | Notes |
|--------|------------------|--------------------|-----------------|--------------------|-------------------|-------|
| ICON-001 resources | 9 | — | 9 webp | — | YES | Sealed |
| ICON-002 categories | 6 | — | 6 svg | — | YES | Defensive fallback |
| ICON-003 buildings | 23 | 23 compacts | 23× webp+png | — | YES | Sealed 23/23 |
| BR-001 | 1 | — | 1 svg | — | YES | Sealed |
| MM scenics | 3 | — | webp derivatives | — | YES | 001/006/007 |
| MM dialogs | 0 runtime unique | — | ref png | — | reference | MM-002–005 |
| DashboardIcon | 0 files | — | inline | — | YES | Generic |
| CH-010 / charts | 1 ref svg | — | — | recharts KPI | YES | Mixed |
| World | 0 raster | — | — | biomes+routes+minimap | YES | Slice 1 sealed |
| Research tech | 0 | 0 | — | — | NO | 22 YAML entities |
| Milestones | 0 | 0 | — | — | NO | 8 entities |
| Employees | 0 | 0 | — | — | NO | 19 types |
| Building overlays | 0 | 0 | — | — | NO | Planned OVERLAY |
| Transport vehicles | 0 | 0 | — | routes only | PARTIAL | No vehicle art |

---

## G. Scenario-B Progress

| Metric | Value |
|--------|--------|
| Confirmed authored primary concepts | **42** (minimum) |
| Confirmed authored secondary | **23** compacts |
| Confirmed generic UI icon names | **~11** DashboardIcon |
| Confirmed procedural systems | **~5** |
| Derived runtime files | **excluded** from authored tally |
| % of 380–520 (primary-direction only) | **~11%** (42/380) — **indicative** |
| Remaining authored envelope | **large by design** |
| Target assessment | **YES — STILL APPROPRIATE**; mix should shift off buildings toward research/progression/procedural overlays |

---

## H. Player-Experience Coverage Matrix

| Domain | Current Visual Language | Production Coverage | Player Exposure | Text/Table Dependence | Progression Value | Status |
|--------|-------------------------|---------------------|-----------------|-----------------------|-------------------|--------|
| Main Menu | Scenic + UI | STRONG | Medium | Low | Low | **STRONG** |
| World | Procedural map | STRONG system | High | Medium | Medium | **STRONG** (not scenic raster) |
| Buildings | ICON-003 catalog | COMPLETE | High | Medium (forms) | High | **STRONG** |
| Production | Tables + ICON-001 | PARTIAL | High | High | High | **PARTIAL** |
| Research | Text catalog | ABSENT icons | High | Very high | Very high | **WEAK** |
| Transport | Tables | WEAK | Medium | High | Medium | **WEAK** |
| Market | Charts + tables | BALANCED | Medium | High | Medium | **PARTIAL** |
| Warehouse | ICON-001 widgets | STRONG inventory | Medium | Medium | Medium | **STRONG** |
| Workforce | Text | ABSENT | Low–medium | High | Medium | **WEAK** |
| Company | Dashboard + text | PARTIAL | Medium | High | Medium | **PARTIAL** |
| Milestones | Text / raw IDs in hints | ABSENT badges | Medium | High | High | **WEAK** |
| Tutorial/Guidance | Text panel | ABSENT art | Medium | Very high | Medium | **WEAK** (UX-heavy) |
| Dashboard | KPI + charts | PARTIAL | High | Medium | Medium | **PARTIAL** |

### Required coverage matrix (blur / gap)

| Domain | Coverage | Exposure | Text/Table Dependence | Blur Test | Progression Value | Material Gap |
|--------|----------|----------|-----------------------|-----------|-------------------|--------------|
| Main Menu | STRONG | Medium | Low | YES | Low | No |
| World | STRONG | High | Medium | PARTIAL | Medium | System ok; marker reuse later |
| Buildings | STRONG | High | Medium | YES | High | No (sealed) |
| Production | PARTIAL | High | High | PARTIAL | High | Reuse > new art |
| Research | WEAK | High | Very high | **NO** | Very high | **YES** |
| Transport | WEAK | Medium | High | NO | Medium | Moderate |
| Market | PARTIAL | Medium | High | PARTIAL | Medium | Procedural > static |
| Warehouse/Logistics | STRONG/PARTIAL | Medium | Medium | PARTIAL | Medium | Low |
| Workforce | WEAK | Low–Med | High | NO | Medium | Deferred |
| Company | PARTIAL | Medium | High | PARTIAL | Medium | Low |
| Milestones | WEAK | Medium | High | NO | High | Moderate |
| Tutorial/Guidance | WEAK | Medium | Very high | NO | Medium | Separate WS |
| Dashboard | PARTIAL | High | Medium | PARTIAL | Medium | Low |

---

## I. Game-Fantasy / Blur Test

| Screen | Blur result | Notes |
|--------|-------------|-------|
| Main Menu | **YES** | MM-001 scenic |
| World | **PARTIAL** | Map reads as strategy world; building dots generic |
| Buildings | **YES** | 23 distinct ICON-003 in catalog |
| Production | **PARTIAL** | Resource icons help; rows dominate |
| Research | **NO** | Name + button list only |
| Transport | **NO** | Tables |
| Market | **PARTIAL** | Charts help |
| Dashboard | **PARTIAL** | Icons + charts |
| Warehouse | **PARTIAL** | ICON-001 in widgets |
| Company / Workforce | **NO** | Text cards |

---

## J. Building Track Impact

**Solved:** BuildingsScreen catalog identity; game-object recognition for 23 types; ICON-002 no longer expected for current content; infrastructure honest grammars; production pipeline proof.

**Did not solve:** Research/tech identity; milestone reward visuals; world building type markers; production facility row identity; transport fantasy; progression beyond text; shell navigation icon family; shared construction/state overlays.

---

## K. World Visual State

World Slice 1 **sealed** — biome/route/minimap procedural identity is **STRONG**. **Visual system gap:** building markers remain **non-type-specific** (circles). **Missing content art:** optional regional vistas/props (P2). **Not** a generic beautification pass — **ICON-003 compact reuse** is integration deferred until marker scale policy is fixed.

---

## L. Research / Technology

| Evidence | Value |
|----------|--------|
| Technologies (YAML) | **22** enabled |
| Categories (`TechnologyCategory`) | **11** enum values used in content |
| `ResearchScreen` | Text hints, tables, buttons — **no tech icons** |
| Unlock importance | **High** — gates buildings, logistics, milestones |

**Approaches (not implemented):** per-tech ICON-004-{id}; or category family + optional hero techs; tree node styling procedural.

**Material Scenario B candidate:** **YES** — compare candidates §W.

---

## M. Production / Recipes

7 recipes; resource ICON-001 wired in places; **ICON-003 exists but not reused** on ProductionScreen for facility identity. **Art gap:** low if reuse slice; **UX gap:** row editing feel separate. Operational DashboardIcon slice **sealed partial**.

---

## N. Workforce / Employees

19 employee types; **text-only** presentation. Archetype silhouettes possible later; **lower exposure** than research/buildings. **Deferred** — not rejected.

---

## O. Milestones / Achievements

8 milestones; **text** in hints (raw ID issue = Player Guidance WS). **8 badges** bounded scope; progression value **high** but narrower than research. **Deferred** after ICON-004 or parallel later.

---

## P. Transport / Logistics

Procedural world routes **sealed**; orders UI **table-led**; no vehicle art; mechanics do not justify fleet art. **Procedural route styling** > vehicle sprites short term.

---

## Q. Market / Economy

CH-010 + recharts — **procedural data viz** appropriate. Resource ICON-001 partial. **Not** a large static art family priority.

---

## R. Dashboard / Company

DashboardIcon integration **sealed generic**. Weakness is **acceptable abstraction** for KPIs, not missing 20 bespoke illustrations.

---

## S. Tutorial / Guidance

Text-first `PGTutorialPanel`; problems primarily **interaction/navigation** (separate WS). Optional vignettes **low priority** vs research identity.

---

## T. Progression / Reward Visuals

| Moment | Status |
|--------|--------|
| Unlock building | **PARTIAL** — catalog art exists when player opens Buildings; unlock hint still text |
| Unlock technology | **WEAK** — text only |
| Milestone | **WEAK** |
| Region expansion | **PARTIAL** — map procedural |
| Production capability | **PARTIAL** |
| Company capability | **WEAK** |

Overall: **PARTIAL** — building catalog upgrade is real; **research/milestone completion still text rewards**.

---

## U. Existing-Art Reuse Opportunities

| Opportunity | Classification |
|-------------|----------------|
| ProductionScreen facility column | **HIGH VALUE / LOW COST** (BuildingTypeIcon) |
| World map markers | **HIGH VALUE / LOW COST** (compact ICON-003) — scale policy needed |
| Unlock toasts / hints | **USEFUL LATER** |
| Transport facility context | **USEFUL LATER** (port/rail_terminal already distinct) |
| Tutorial illustrations | **NOT APPROPRIATE** now |

No implementation in this review.

---

## V. Procedural-System Opportunities

| Candidate | Value vs static art |
|-----------|---------------------|
| Construction / state overlays on ICON-003 | **High** — shared overlays |
| Production progress flow | **High** |
| Map activity / regional heat | **Medium** |
| Economic trend (existing charts extend) | **Medium** |
| Route emphasis | **Partially exists** |

Highest procedural follow-on: **shared building state overlay system** (not selected as *next* workstream — research identity is higher blur/progression payoff first).

---

## W. Material Gap Candidate Matrix

| Candidate Family | Current State | Exposure | Game-Fantasy Gain | Progression Gain | Reuse | Est. Scope | Procedural Alt. | Material? |
|------------------|---------------|----------|-------------------|------------------|-------|------------|-------------------|-----------|
| **Technology ICON-004** | Text only | High | High | Very high | Med | 11 cat or 22 tech authored | Tree styling | **YES** |
| Milestone badges | Text | Med | Med | High | Low | 8 authored | — | YES |
| Building state overlays | Text status | Med | Med | Med | High | 3–5 overlay assets | Tint system | YES |
| Production ICON-003 reuse | Tables | High | Med | Med | **Very high** | 0–3 integration | Progress bars | PARTIAL (integration) |
| World marker reuse | Dots | High | Med | Med | **Very high** | Integration | — | PARTIAL |
| Workforce silhouettes | Text | Low–Med | Low | Med | Med | 5–8 archetypes | — | NO (now) |
| Shell nav icons | Text pills | Med | Low | Low | Med | 9 icons | — | NO (now) |
| Transport vehicles | None | Med | Med | Low | Low | High if mechanics | Routes | NO |

---

## X. Scope / Cost / Value Comparison

| Candidate | Why It Matters | Authored Range | Procedural | Art Cost | Integration Cost | Player Value | Reuse | Dependency |
|-----------|----------------|----------------|------------|----------|------------------|--------------|-------|------------|
| **ICON-004 Research** | Core loop screen fails blur test | 11 category OR 22 unique; compacts optional | Tree/node | MED | MED | **HIGH** | MED | Stable tech IDs ✓ |
| Milestone badges | Progression reward | 8 | — | LOW | LOW | MED | LOW | Guidance text separate |
| State overlays | Construction feel | 3–5 | overlay engine | LOW | MED | MED | HIGH | Overlay architecture |
| Production reuse | Facility identity | 0 new | progress UI | LOW | MED | MED | **HIGH** | None |
| World markers | Map identity | 0 new | marker layout | LOW | MED | MED | **HIGH** | Zoom/footprint policy |

---

## Y. Dependencies

- **ICON-004:** `game-content/research/*.yaml` + `TechnologyCategory` — **stable**.
- **World markers:** marker scale/orientation for LINEAR infra — **policy** before production.
- **Milestone art:** does not require fixing raw IDs first (visual separate from guidance copy).
- **Transport vehicles:** **blocked** by absent vehicle mechanics.

---

## Z. Recommended Next Visual Workstream

**WORKSTREAM NAME:** Technology / Research Visual Identity (**ICON-004**)

| Field | Content |
|-------|---------|
| **PLAYER PROBLEM** | Research screen reads as admin task list; completing tech feels like new text, not industrial advancement. |
| **CURRENT EVIDENCE** | 22 technologies, 11 categories; `ResearchScreen` text-only; blur test **NO**. |
| **WHY MATERIAL** | High exposure, high progression, high text dependence, cross-screen potential (jobs, hints, dashboard). |
| **WHY NOW** | Building track sealed; registry/loader patterns proven; no competing P0 art family. |
| **VISUAL FAMILY** | Shared research icon grammar (compact SVG + optional raster); map `technologyId` → asset; category fallback within family. |
| **CONTENT SOURCE** | `game-content/research/*.yaml`, `TechnologyCategory` |
| **EXPECTED AUTHORED RANGE** | Phase 1: **6** pilot category glyphs; full track: **11 category** (+ optional 22 per-tech later) |
| **EXPECTED PROCEDURAL** | 0 in first slice; later tree/link styling |
| **REUSE** | BR-001 / ICON-002 stroke grammar; not building primaries |
| **DEPENDENCIES** | Naming convention in registry; ResearchScreen consumer only (no content edits) |
| **OUT OF SCOPE** | Content YAML changes; tree layout redesign; Player Guidance copy |
| **STOP CONDITIONS** | Category semantics too ambiguous; icons fail 32px; family fractures from ICON-001 |

---

## AA. First Bounded Slice

**FIRST BOUNDED SLICE:** **ICON-004 Technology Category Icon — Contract + 6-Category Pilot**

| Item | Detail |
|------|--------|
| **Scope** | Visual contract doc + **6** representative `TechnologyCategory` glyphs (e.g. PRODUCTION, ENERGY, LOGISTICS, ELECTRONICS, MANAGEMENT, AUTOMATION) |
| **Proof goal** | Research catalog rows read as **industrial research domains** at 32–48px; coherent with ICON-001/002 stroke band |
| **Expected size** | 6 authored SVGs (+ contract); not 22 in slice 1 |
| **Production integration** | **LIMITED** — dev/pilot paths first; registry activation in follow-on bounded batch |

---

## AB. Deferred Candidates

| Candidate | Reason |
|-----------|--------|
| Milestone badges (8) | **DEFERRED** — lower daily exposure than research; do after ICON-004 pilot |
| Building state overlays | **DEFERRED** — high reuse but lower blur-test impact than Research |
| Production ICON-003 reuse | **DEFERRED** — integration slice, not new family; after ICON-004 contract |
| World compact markers | **DEFERRED** — marker scale/orientation policy |
| Workforce archetypes | **DEFERRED** — lower exposure |
| Shell nav icon family | **DEFERRED** — polish vs identity |
| Transport vehicle art | **DEFERRED** — mechanics absent |

---

## AC. Non-Art Findings

| Workstream | Classification |
|------------|----------------|
| Player Guidance / raw milestone IDs | **SEPARATE** |
| Responsive / catalog density / X-Y placement | **SEPARATE** |
| Deployment / auth / persistence | **PARKED** |
| Performance | No measured blocker for 23 catalog images |
| Accessibility | Separate unless ICON-004 contract mandates |

---

## AD. Historical 600–800 Assessment

**NO — PLAUSIBLE RICH SCENARIO** (Scenario C-style), not invalid.

**PARTIALLY — DERIVATIVE COUNTING INFLATED IT:** counting every WebP/PNG/copy as independent graphics inflated historical 600–800; building track proved **master + derivative** discipline.

Scenario B **380–520 authored** remains the selected envelope; current honest counting aligns with **~42 primaries** delivered, not hundreds of duplicate files.

---

## AE. Production Lessons (Building Track)

Standardize for Scenario B: **evidence → family contract → pilot → human gate → bounded batch → alpha → runtime derivatives → family board → real screen capture → close candidate**. Compact @32px gate; no double-counting pilots; preserve ICON-002 fallback; table-driven registry tests.

---

## AF. Recommended Scenario-B Production Pipeline

```
EVIDENCE (screen + content audit)
→ FAMILY CONTRACT
→ SMALL PILOT (3–6)
→ HUMAN VISUAL GATE
→ BOUNDED PRODUCTION BATCH
→ ALPHA + REGISTRY
→ REAL RUNTIME QA
→ FAMILY / COVERAGE BOARD
→ CLOSE CANDIDATE
```

Adapt per family (procedural slices skip raster alpha).

---

## AG. Master Inventory Update

Updated `GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md`: baseline HEAD `ee16a05`, Scenario B ledger, research next-candidate flag, energy/production dependency notes, 23/23 confirmation.

---

## AH. Repository Integrity

| Item | Value |
|------|--------|
| Task-owned docs | inventory + this review |
| Production code changed | **NO** |
| Production assets changed | **NO** |
| Commit / push / tag | **NONE** |

---

## AI. Final Decision

**OPTION A — SCENARIO B HAS A CLEAR NEXT MATERIAL VISUAL WORKSTREAM**

- **NEXT VISUAL WORKSTREAM:** Technology / Research Visual Identity (ICON-004)  
- **FIRST BOUNDED SLICE:** ICON-004 category icon contract + 6-category pilot  

STOP.

---

# Project Genesis
# Scenario B — Visual Coverage Progress Review
## Execution Summary

### Baseline

- **HEAD:** `ee16a05bb9a6df48ead115b2791c88f0f476afd6`
- **branch:** master
- **working tree:** unrelated churn present; 23/23 pushed on master

### Scenario Authority

- Scenario: **B — TARGET PRODUCTION QUALITY**
- authored target: **380–520**
- procedural planning target: **~12**
- target changed: **NO**

### Completed Building Track

- authoritative types: **23**
- primary coverage: **23 / 23**
- compact coverage: **23 / 23**
- status: **SEALED**

### Current Visual Portfolio

- authored primary: **~42**
- authored secondary: **23**
- generic reusable: **~11** DashboardIcon
- decorative/scenic: **3** MM runtime scenics
- procedural: **~5**
- derived: excluded
- dev/pilot excluded: infrastructure-pilot, evidence PNGs

### Scenario-B Progress

- confirmed authored (primary concepts): **42**
- estimated authored range: **65–75** with compacts
- confirmed procedural: **~5**
- remaining envelope: **large**
- target assessment: **YES — STILL APPROPRIATE**

### Coverage

- strongest: Main Menu, Buildings, World procedural, Resources, Warehouse inventory
- partial: Dashboard, Market, Production, Company
- weakest: Research, Transport, Milestones, Workforce, Tutorial blur

### Blur Test

- YES: Main Menu, Buildings
- PARTIAL: World, Production, Market, Dashboard, Warehouse
- NO: Research, Transport, Workforce, Milestones, Tutorial

### Progression / Reward

- current status: **PARTIAL**
- strongest: building catalog art when browsing/unlocking types
- weakest: tech completion, milestones (text)

### Reuse

- high-value: Production facility column, World compact markers
- later: unlock hints, transport context

### Procedural Opportunities

- highest-value candidate: shared **building state overlays**
- other: production progress, map activity

### Material Gap Candidates

1. ICON-004 Research — **selected**
2. Milestone badges
3. State overlays / Production reuse / World markers

### Recommended Next Workstream

- name: **Technology / Research Visual Identity (ICON-004)**
- player problem: research feels like software lists
- why material: exposure + progression + blur NO
- why now: building track complete
- expected authored scope: 6 pilot categories → up to 11 + optional 22
- expected procedural scope: 0 in slice 1
- dependencies: stable YAML IDs

### First Bounded Slice

- scope: contract + **6** category pilot glyphs
- proof goal: domain-readable research at 32–48px
- expected size: **6** SVG concepts
- production integration: **LIMITED**

### Deferred

- milestones — after ICON-004 pilot
- overlays / production reuse / world markers — integration or follow-on

### Historical 600–800

- assessment: **NO — PLAUSIBLE RICH SCENARIO**; derivative counting inflated historical totals

### Scenario-B Production Lessons

- standard pipeline: contract → pilot → gate → batch → alpha → runtime evidence → close

### Non-Art Findings

- Player Guidance: **SEPARATE**
- Responsive/Layout: **SEPARATE**
- Deployment: **PARKED**

### Repository Integrity

- task-owned docs only
- production code/assets: **NO**
- commit/push/tag: **NONE**

### Final Decision

**OPTION A**

STOP.
