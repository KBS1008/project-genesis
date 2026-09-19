# Post-V1 ICON-004 Technology / Research — Detailed Production Batch 2 Selection Review

**Prompt:** `POST_V1_ICON_004_TECHNOLOGY_DETAILED_PRODUCTION_BATCH_2_SELECTION_REVIEW.md`  
**Date:** 2026-09-19  
**Mode:** Read-only / planning  
**Final decision:** **OPTION A — ICON-004 DETAILED PRODUCTION BATCH 2 CLEARLY DEFINED AND READY FOR IMPLEMENTATION PROMPT**

---

## A. Executive Summary

Verified **HEAD `116b084`** contains sealed **Production Batch 1** (8 detailed primaries, 10 category compacts, resolver, ResearchScreen). **14** technologies remain without Tier-1 art — list matches Batch-1 close candidate exactly. Classified all 14; **6** are **Batch-2 eligible** (honest A/B/C subjects, manageable building/repetition risk). **4** defer to **ABSTRACT ART-DIRECTION PILOT** (MANAGEMENT/FINANCE/AI). **4** defer to **LATER DETAILED BATCH** (logistics/chemistry/agriculture follow-ons). Recommended Batch 2 size: **6** new primaries → projected **14/22** detailed. No art, code, or registry changes in this review.

---

## B. Repository Baseline

| Item | Value |
|------|--------|
| HEAD | `116b0841f2990c2aefba6d16984ebb9415a62525` |
| Latest commit | `116b084` — Deliver ICON-004 research visual identity production Batch 1 |
| Branch | `master` |
| Batch 1 committed | **YES** |
| Unrelated working tree churn | dashboard/shell, M11/M12 docs, prompt moves, etc. (excluded) |

---

## C. Sealed Batch-1 Authority

Batch-1 detailed primaries (unchanged, not re-evaluated):  
`precision_machining`, `renewable_energy`, `semiconductor_process`, `advanced_metallurgy`, `coal_efficiency`, `intermodal_logistics`, `circuit_design`, `factory_automation`.

Art direction, two-tier contract, category compacts, `TechnologyVisual`, and ResearchScreen integration remain **sealed**.

---

## D. Current Production Coverage

| Metric | Verified value | Source |
|--------|----------------|--------|
| Enabled technologies | **22** | `game-content/research/*.yaml` + `ICON_004_TECHNOLOGY_CATEGORY_BY_ID` |
| Detailed Tier-1 primaries | **8** | `ICON_004_BATCH_1_DETAILED_TECHNOLOGY_IDS` + `apps/web/public/assets/research/*-primary.*` |
| Category-only (no Tier-1) | **14** | complement of Batch 1 |
| Used `TechnologyCategory` in content | **10** | enum `BUILDING` unused |
| Production category compacts | **10/10** | `ICON-004-category-{CAT}.svg` in design + runtime |

Matches sealed Batch-1 close candidate; no count drift.

---

## E. Remaining Technology Audit

Verified remaining set (**14** — identical to Batch-1 deferred list):

| ID | Player name | Category | Description (content) | Notes |
|----|-------------|----------|---------------------|--------|
| basic_woodworking | Basic Woodworking | PRODUCTION | Early wood processing | Root gate: milestone `profit_100` |
| industrial_assembly | Industriemontage | PRODUCTION | Assembly lines / QA for complex machinery | Chain after production line |
| smart_grid | Intelligentes Stromnetz | ENERGY | Grid control / load balancing | Requires `renewable_energy` |
| distribution_networks | Distributionsnetze | LOGISTICS | Regional distribution / transshipment | Network semantics |
| warehouse_systems | Lagersysteme | LOGISTICS | Storage / inventory control | Distinct from intermodal |
| corporate_management | Unternehmensfuehrung | MANAGEMENT | Org structures / leadership processes | Abstract org semantics |
| executive_leadership | Executive Leadership | MANAGEMENT | Strategic steering / corporate structures | Abstract |
| process_automation | Prozessautomatisierung | AUTOMATION | Control / sensors for production lines | Distinct grammar from `factory_automation` |
| financial_planning | Finanzplanung | FINANCE | Budget / cashflow / investment planning | Abstract finance |
| organic_chemistry | Organische Chemie | CHEMISTRY | Industrial chemical processes / recycling | Process apparatus |
| polymer_science | Polymerwissenschaft | CHEMISTRY | Plastics / composites | Process/extrusion |
| sustainable_agriculture | Nachhaltige Landwirtschaft | AGRICULTURE | Resource-efficient farming / supply chains | Ag tech installation |
| crop_optimization | Ertragsoptimierung | AGRICULTURE | Yield / harvest methods | Ag process/system |
| predictive_analytics | Predictive Analytics | AI | Forecasting for production/market/planning | Abstract analytics |

Dependencies/milestones taken from YAML; no content mutation.

---

## F. Visual Classification Model

Single class per remaining technology (prompt §8–14):

| Class | Count | Meaning in this review |
|-------|------:|------------------------|
| A — DIRECT_DETAILED | 3 | Concrete apparatus |
| B — PROCESS_VIGNETTE | 2 | Transformation / process cluster |
| C — SYSTEM_VIGNETTE | 5 | Connected equipment / network hardware |
| D — ABSTRACT_SPECIAL | 4 | Needs separate visual grammar |
| E — CATEGORY_ONLY_CANDIDATE | 0 | None recommended without human gate |
| F — SEMANTICALLY_BLOCKED | 0 | All 14 have sufficient content for honest direction |

---

## G. Remaining-Tech Matrix

| Technology | Player Name | Category | Class | Preferred Subject | Building Risk | Repetition Risk | Reward Value | Batch 2? |
|------------|-------------|----------|-------|-------------------|---------------|-----------------|--------------|----------|
| basic_woodworking | Basic Woodworking | PRODUCTION | A | Bench/table saw + hand-planer workstation vignette | LOW | LOW | HIGH | **YES** |
| industrial_assembly | Industriemontage | PRODUCTION | A | Modular assembly fixture + torque tooling on line segment | MEDIUM | MEDIUM | HIGH | **YES** |
| smart_grid | Intelligentes Stromnetz | ENERGY | C | Switchgear + SCADA cabinet + bus bars (grid control) | LOW | MEDIUM | HIGH | **YES** |
| distribution_networks | Distributionsnetze | LOGISTICS | C | Regional sortation conveyor + chute hardware | MEDIUM | MEDIUM | MEDIUM | NO |
| warehouse_systems | Lagersysteme | LOGISTICS | C | Rack + shuttle/conveyor + WMS terminal cluster | MEDIUM | MEDIUM | HIGH | **YES** |
| corporate_management | Unternehmensfuehrung | MANAGEMENT | D | (defer) org-process instrumentation — not stock boardroom | HIGH if building | — | MEDIUM | NO |
| executive_leadership | Executive Leadership | MANAGEMENT | D | (defer) strategic ops tableau — not portrait | HIGH | — | MEDIUM | NO |
| process_automation | Prozessautomatisierung | AUTOMATION | C | PLC rack + sensor junction + line control panel | LOW | MEDIUM | HIGH | **YES** |
| financial_planning | Finanzplanung | FINANCE | D | (defer) planning instrumentation — not money chart | HIGH | — | MEDIUM | NO |
| organic_chemistry | Organische Chemie | CHEMISTRY | B | Glass-lined reactor + distillation column cluster | LOW | LOW | HIGH | **YES** |
| polymer_science | Polymerwissenschaft | CHEMISTRY | B | Extruder + pelletizer + hopper vignette | LOW | MEDIUM | MEDIUM | NO |
| sustainable_agriculture | Nachhaltige Landwirtschaft | AGRICULTURE | A | Greenhouse irrigation + nutrient skid (not barn) | MEDIUM | LOW | MEDIUM | NO |
| crop_optimization | Ertragsoptimierung | AGRICULTURE | C | Field sensor mast + irrigation controller pad | MEDIUM | MEDIUM | MEDIUM | NO |
| predictive_analytics | Predictive Analytics | AI | D | (defer) analytics apparatus — not AI face/brain | HIGH | — | MEDIUM | NO |

---

## H. Direct Detailed Candidates

- **basic_woodworking** — early-player anchor; distinct from CNC precision art.  
- **industrial_assembly** — assembly fixture focus, not full hall.  
- **sustainable_agriculture** — deferred to Batch 3+ to avoid pairing two ag primaries in one batch without pilot.

---

## I. Process-Vignette Candidates

- **organic_chemistry** — **Batch 2** (establishes chemistry family).  
- **polymer_science** — defer until chemistry visual family exists (differentiation: extrusion vs reactor).

---

## J. System-Vignette Candidates

- **smart_grid**, **warehouse_systems**, **process_automation** — **Batch 2**.  
- **distribution_networks** — defer (overlap with intermodal + batch-1 logistics grammar).  
- **crop_optimization** — defer with agriculture pair.

---

## K. Abstract-Special Candidates

| Technology | Content supports physical vignette? | Recommendation |
|------------|-------------------------------------|----------------|
| corporate_management | Partial (process/org only) | **ABSTRACT pilot** — avoid HQ building / org-chart clipart |
| executive_leadership | Weak physical anchor | **ABSTRACT pilot** |
| financial_planning | Weak — planning semantics | **ABSTRACT pilot** — not ledger/stock chart |
| predictive_analytics | Weak — forecasting semantics | **ABSTRACT pilot** — not brain/robot |

---

## L. Category-Only Candidates

**None** recommended for permanent category-only without human gate. Tier-2 compacts remain adequate interim for deferred techs.

---

## M. Semantic Blockers

**None** among the 14. All descriptions support at least a bounded honest direction or explicit abstract deferral.

---

## N. Semantic Boundary Matrix (Batch-2 A/B/C only)

| Technology | Depicted Capability | Must Not Imply | Honesty Confidence | Special Rule |
|------------|---------------------|----------------|--------------------|--------------|
| basic_woodworking | Wood processing tools/process | Sawmill building unlock | HIGH | Subsystem only |
| industrial_assembly | Assembly/QA line segment | Full assembly plant exterior | HIGH | Not duplicate `factory_automation` robot hero |
| smart_grid | Grid control hardware | Smart city / new power gen | HIGH | Not solar plant repeat |
| warehouse_systems | Storage automation hardware | Warehouse building type | HIGH | Not ICON-003 warehouse silhouette |
| process_automation | Line control/sensor stack | Autonomous workforce | HIGH | Control-focused vs robot cell (Batch 1) |
| organic_chemistry | Chemical process vessels | Pharmaceutical/fantasy lab | HIGH | Industrial B2 palette |

---

## O. Building-Confusion Assessment

Batch-2 selections use **apparatus / skid / cabinet** compositions; **MEDIUM** risk only on `industrial_assembly` and **warehouse_systems** — mitigated by close crop and no roofline/envelope.

---

## P. Repetition / Family-Diversity Assessment

| Risk | Mitigation |
|------|------------|
| Second PRODUCTION line art | Woodworking = craft bench; assembly = fixture (not CNC) |
| Second AUTOMATION | `process_automation` = PLC/sensors; Batch 1 = robot cell |
| Second ENERGY grid | `smart_grid` = switchgear; Batch 1 = renewables + coal boiler |
| Chemistry pair | Only **organic** in Batch 2; polymer deferred |

---

## Q. Progression Reward Assessment

**HIGH** reward for Batch-2 picks: early catalog visibility (`basic_woodworking`), mid-tree industrial/energy/logistics/automation/chemistry anchors. **MEDIUM** for deferred ag/distribution/abstract.

---

## R. Batch-2 Eligibility

**6 eligible** (A/B/C, honest subjects, manageable risks). **8 ineligible** for normal Batch 2 (4 abstract + 4 deferred concrete follow-ons).

---

## S. Exact Batch-2 Production Set

**Recommended size: 6** (not 8 — candidate pool quality over symmetry with Batch 1).

| Technology | Category | Class | Primary Subject | Differentiation Rule | Production Notes |
|------------|----------|-------|-----------------|----------------------|------------------|
| basic_woodworking | PRODUCTION | A | Workbench + table saw + planer vignette | Not sawmill building; not CNC spindle (Batch 1) | Early-game catalog visibility |
| industrial_assembly | PRODUCTION | A | Assembly fixture + power tools on line module | Not robot cell; not assembly plant hall | Pair with production family |
| smart_grid | ENERGY | C | Switchgear + SCADA cabinet + buswork | Not renewable panels; not coal boiler | Energy tier-2 after renewables |
| warehouse_systems | LOGISTICS | C | Rack/shuttle + conveyor + terminal | Not warehouse building; not port crane (intermodal) | Logistics inventory semantics |
| process_automation | AUTOMATION | C | PLC/sensor/control panel on line segment | Not duplicate factory_automation arm | Control vs motion grammar |
| organic_chemistry | CHEMISTRY | B | Reactor + distillation industrial cluster | Not consumer lab glassware; not polymer extruder yet | Opens chemistry family |

Implementation order in table = convenience only.

---

## T. Deferred Set

| Technology | Class | Why Deferred | Next Required Action |
|------------|-------|--------------|----------------------|
| distribution_networks | C | Sortation vs intermodal overlap; better as focused Batch 3 logistics slice | LATER DETAILED BATCH |
| polymer_science | B | Needs chemistry family established by organic_chemistry first | LATER DETAILED BATCH |
| sustainable_agriculture | A | Pair with crop_optimization; avoid two ag primaries without ag grammar | LATER DETAILED BATCH |
| crop_optimization | C | Same agriculture batch as sustainable | LATER DETAILED BATCH |
| corporate_management | D | Org/process abstract | ABSTRACT ART-DIRECTION PILOT |
| executive_leadership | D | Strategic abstract | ABSTRACT ART-DIRECTION PILOT |
| financial_planning | D | Finance abstract | ABSTRACT ART-DIRECTION PILOT |
| predictive_analytics | D | Analytics/AI abstract | ABSTRACT ART-DIRECTION PILOT |

All marked **DEFERRED — NOT REJECTED**.

---

## U. Abstract Visual Grammar Assessment

Hypotheses for future **2–3 tech abstract pilot** (not implemented):

| Hypothesis | Fit | Reject if |
|------------|-----|-----------|
| Operational decision instrumentation | MANAGEMENT | Reads as stock boardroom |
| Planning/analytics apparatus (displays, racks, no faces) | FINANCE / AI | Reads as sci-fi brain or trading floor |
| Control-room instrumentation (existing B2 industrial UI density) | MANAGEMENT / AI | Duplicates dashboard widgets |

**Recommendation:** Separate **ABSTRACT ART-DIRECTION PILOT** for the four D-class technologies before production art. **Do not** fold into Batch 2.

---

## V. Coverage Projection

| | Count |
|--|------:|
| **CURRENT** detailed | **8 / 22** |
| **BATCH 2** | **+6** |
| **PROJECTED** | **14 / 22** detailed |
| **REMAINING** | **8 / 22** |

Remaining breakdown: **4** abstract (D), **4** deferred concrete (2 logistics/chemistry/ag follow-ons).

---

## W. Scenario-B Accounting Projection

Batch 2 adds **6** unique authored Tier-1 concepts (no double-count). Scenario-B envelope unchanged; meaningful game-facing increment without quota chasing.

---

## X. Category Compact Compatibility

**10/10** used categories already have production compacts. All Batch-2 technologies map to existing categories — **no new category glyphs required**.

---

## Y. ResearchScreen Compatibility

**No redesign.** Batch 2 extends `ICON_004_BATCH_*` detailed ID list + registry entries; existing `TechnologyVisual` @80px + dark pad handles new primaries automatically.

---

## Z. Production Pipeline Reuse

| Pipeline Stage | Batch-1 State | Reusable for Batch 2? | Change Needed? |
|----------------|---------------|----------------------|----------------|
| Master generation | 1024 RGBA vignette | **YES** | Same contract |
| Alpha QA | `building-art-alpha` | **YES** | None |
| Derivatives | PNG + WebP to `public/assets/research/` | **YES** | Extend manifest list |
| Manifest | Batch-1 JSON | **YES** | Add Batch-2 section or new manifest |
| Registry | `icon004RegistryEntries` | **YES** | Add 6 IDs |
| Resolver | `technology-visual-asset-ids` | **YES** | Extend batch constant |
| ResearchScreen | Integrated | **YES** | None expected |
| Evidence | Boards + runtime capture script | **YES** | Re-run for 14-family board |
| Runtime capture | Playwright script | **YES** | Same flow |

Architecture churn: **minimal** (data + art + registry extension).

---

## AA. Batch-1 Lessons

- **Dark pad** (`#161b22`) required for transparent vignettes on light Research UI.  
- **PNG** preferred for catalog (`preferWebp: false`) — reliable decode.  
- **Runtime capture** must scroll catalog + wait for all batch primaries.  
- **Technology ≠ building** — apparatus crop discipline.  
- **WebP** still generated for pipeline consistency; catalog may stay PNG-first.

---

## AB. Performance / Runtime Asset Boundary

Research catalog currently serves **~0.8–1.7 MB PNG masters** scaled in UI (no dedicated 128/256 runtime ladder). **Flag:** Batch 2 multiplies count, not per-file architecture — consider optional **bounded runtime resize** (e.g. 256px PNG) in a future slice if load metrics warrant; **not blocking** Batch 2 selection.

---

## AC. Non-Art Issues

- Prerequisite copy still embeds technology IDs in German sentences — dashboard/content presentation; **out of Batch 2 scope**.  
- Player Guidance, Research UX redesign, deployment — **not absorbed**.

---

## AD. Master Inventory Status

Updated dependency row: ResearchScreen reflects **partial ICON-004 (8/22)**. Main Research family row already **PARTIAL — BATCH 1**. No projected Batch-2 assets recorded as production.

---

## AE. Repository Integrity

Task-owned: this report + minor inventory dependency line. **No** production code, assets, commits, or pushes.

---

## AF. First Production Slice (scope for future implementation prompt)

**Slice:** ICON-004 Technology Detailed **Production Batch 2**

| Item | Scope |
|------|--------|
| **IDs** | `basic_woodworking`, `industrial_assembly`, `smart_grid`, `warehouse_systems`, `process_automation`, `organic_chemistry` |
| **Asset count** | **6** new 1024×1024 RGBA primaries |
| **Contract** | Existing APPROVED Tier-1 (no direction reopen) |
| **Alpha** | 6/6 PASS same gates as Batch 1 |
| **Scale** | 96/128 acceptance |
| **Registry** | Extend batch ID constant + `visual-asset-registry` + sync runtime |
| **Manifest** | Batch-2 production manifest delta |
| **Evidence** | Family board (14 total), scale board for new six, desktop/narrow runtime |
| **Firewalls** | No content/gameplay/ResearchScreen redesign/Batch-1 reopen |
| **Stop** | If honest subject fails for any of six — bounded repair, not scope expansion |

---

## AG. Final Decision

**OPTION A — ICON-004 DETAILED PRODUCTION BATCH 2 CLEARLY DEFINED AND READY FOR IMPLEMENTATION PROMPT**

---

# Execution Summary

### Baseline

- **HEAD:** `116b0841f2990c2aefba6d16984ebb9415a62525`
- **branch:** master
- **working tree:** unrelated churn present
- **Batch 1 committed:** **YES**

### Current Coverage

- enabled technologies: **22**
- detailed primaries: **8**
- category-only: **14**
- used categories: **10**
- category compacts: **10/10**

### Remaining Set

- total: **14**
- verified against content: **YES**

### Classification

- DIRECT_DETAILED: **3**
- PROCESS_VIGNETTE: **2**
- SYSTEM_VIGNETTE: **5**
- ABSTRACT_SPECIAL: **4**
- CATEGORY_ONLY_CANDIDATE: **0**
- SEMANTICALLY_BLOCKED: **0**

### Batch 2

- recommended size: **6**
- exact technologies:

1. basic_woodworking  
2. industrial_assembly  
3. smart_grid  
4. warehouse_systems  
5. process_automation  
6. organic_chemistry  

### Batch-2 Semantics

- honest subjects: **PASS**
- building confusion manageable: **YES**
- repetition manageable: **YES**
- new art direction required: **NO**

### Projected Coverage

- current: **8 / 22**
- Batch 2: **+6**
- projected: **14 / 22**
- remaining: **8 / 22**

### Abstract Technologies

- count: **4**
- separate art-direction pilot likely: **YES**
- category-only candidates: **0**
- semantically blocked: **0**

### Pipeline

- Batch-1 pipeline reusable: **YES**
- architecture changes required: **NO** (data extension only)
- ResearchScreen changes required: **NO**

### Scenario B

- projected unique new authored concepts: **6**
- target changed: **NO**

### Repository Integrity

- report: `POST_V1_ICON_004_TECHNOLOGY_DETAILED_PRODUCTION_BATCH_2_SELECTION_REVIEW.md`
- inventory changed: **YES** (dependency row only)
- production code: **NONE**
- assets: **NONE**
- commit: **NONE**
- push: **NONE**
- tag: **NONE**

### Final Decision

**OPTION A**
