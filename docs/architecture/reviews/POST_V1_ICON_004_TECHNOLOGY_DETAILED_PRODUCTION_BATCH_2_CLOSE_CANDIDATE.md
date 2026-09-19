# Post-V1 ICON-004 Technology / Research Visual Identity — Detailed Production Batch 2 Close Candidate

**Prompt:** `POST_V1_ICON_004_TECHNOLOGY_DETAILED_PRODUCTION_BATCH_2.md`  
**Selection authority:** `POST_V1_ICON_004_TECHNOLOGY_DETAILED_PRODUCTION_BATCH_2_SELECTION_REVIEW.md` (OPTION A)  
**Date:** 2026-09-19  
**Final decision:** **OPTION A — ICON-004 TECHNOLOGY / RESEARCH VISUAL IDENTITY PRODUCTION BATCH 2 FINAL CLOSE CANDIDATE READY**

---

## A. Executive Summary

ICON-004 **Production Batch 2** adds **6/6** approved Tier-1 detailed primaries, extends resolver/registry to **14/22**, preserves sealed Batch 1 and category compacts (**10/10**), reuses the Batch 1 alpha/derivative pipeline, passes static QA boards and **real** Research runtime captures (desktop, narrow, mixed coverage). **ResearchScreen** unchanged. **No commit** in this slice.

---

## B. Repository Baseline

| Item | Value |
|------|--------|
| HEAD (start) | `116b0841f2990c2aefba6d16984ebb9415a62525` |
| Branch | `master` |
| Batch 1 sealed at HEAD | YES |
| Unrelated churn | dashboard/shell, M11/M12 docs, building pilots, etc. (excluded) |

---

## C. Sealed Authority

- ICON-004 contract: **APPROVED / PRODUCTION AUTHORITY** (Batch 1 + Batch 2 activation note in contract header).
- Batch 1 primaries, category compacts, ResearchScreen integration: **unchanged / not regenerated**.
- Art direction, two-tier hierarchy, technology-vs-building rule: **frozen**.

---

## D. Exact Batch-2 Scope

1. `basic_woodworking`  
2. `industrial_assembly`  
3. `smart_grid`  
4. `warehouse_systems`  
5. `process_automation`  
6. `organic_chemistry`  

**6/6** delivered — no substitutions.

---

## E. Authoritative Semantic Verification

Content YAML inspected (names/categories/descriptions); **no content edits**. All six align with Selection Review subject boundaries and prompt §7–12.

---

## F. New Primary Art

| Technology | Master (1024×1024 RGBA) | Alpha QA |
|------------|---------------------------|----------|
| basic_woodworking | `docs/design/research/production/batch-2/primary/ICON-004-basic_woodworking-primary.png` | PASS |
| industrial_assembly | `.../ICON-004-industrial_assembly-primary.png` | PASS |
| smart_grid | `.../ICON-004-smart_grid-primary.png` | PASS |
| warehouse_systems | `.../ICON-004-warehouse_systems-primary.png` | PASS |
| process_automation | `.../ICON-004-process_automation-primary.png` | PASS |
| organic_chemistry | `.../ICON-004-organic_chemistry-primary.png` | PASS |

Sources: `assets/ICON-004-tech-{id}-primary-source.png` → `removeBuildingArtBackground` → production master (same as Batch 1 new primaries).

---

## G. Per-Technology Subject Boundaries

| ID | Approved subject (dominant) | Avoided |
|----|----------------------------|---------|
| basic_woodworking | Workbench + table saw + planer, wood material | Sawmill building, CNC repeat |
| industrial_assembly | Fixture + torque tooling + workpiece | Robot cell, plant exterior |
| smart_grid | Switchgear + SCADA cabinet + bus bars | Solar/coal generation heroes |
| warehouse_systems | Rack + shuttle/conveyor + control terminal | Warehouse building exterior |
| process_automation | PLC rack + sensors + HMI + line segment | Robot-arm factory_automation duplicate |
| organic_chemistry | Reactor + distillation + piping cluster | Consumer lab glassware, plant facade |

---

## H. Generated-Art QA

Manual pass on all six masters: no pseudo-text, no people heroes, no full building envelopes, apparatus-focused compositions. Bounded alpha pipeline applied; no Batch-1 regressions.

---

## I. Alpha / Technical QA

Report: `docs/design/research/production/batch-2/ICON_004_PRODUCTION_BATCH_2_ALPHA_REPORT.json`  
**6/6 PASS** (real alpha, no checkerboard suspect).

---

## J. Scale QA

Evidence: `docs/architecture/reviews/evidence/ICON_004_PRODUCTION_BATCH_2_SCALE_BOARD.png`  
**6/6** readable @96px, **6/6** pass @128px (inspection board).

---

## K. 14-Primary Family Coherence

Evidence: `docs/architecture/reviews/evidence/ICON_004_PRODUCTION_BATCH_2_DETAILED_FAMILY_BOARD_14.png`  
Batch 1 masters unchanged; six new entries match lighting/material band. **PASS** (no independent human seal).

---

## L. Technology-vs-Building Gate

Evidence: `docs/architecture/reviews/evidence/ICON_004_PRODUCTION_BATCH_2_TECH_VS_BUILDING_BOARD.png`  
Pairs vs ICON-003 sawmill, assembly_plant, warehouse, power_substation, coal_power_plant — **PASS** (capability vs placeable building).

---

## M. Batch-1 / Batch-2 Differentiation

| New | Compared | Key visual difference | Repetition risk |
|-----|----------|----------------------|-----------------|
| basic_woodworking | precision_machining | Wood + mechanical bench vs CNC metal | LOW |
| industrial_assembly | factory_automation | Fixture/tooling vs robot cell | LOW |
| smart_grid | renewable_energy / coal_efficiency | Grid switchgear vs generation equipment | LOW |
| warehouse_systems | intermodal_logistics | Interior rack/shuttle vs container crane | LOW |
| process_automation | factory_automation | PLC/sensors vs motion robotics | LOW |
| organic_chemistry | advanced_metallurgy | Process vessels vs metallurgy furnace | LOW |

---

## N. Production Assets / Derivatives

Runtime: `apps/web/public/assets/research/ICON-004-{id}-primary.png` + `.webp` (quality 82, same as Batch 1).

| Asset | PNG bytes (approx.) |
|-------|---------------------|
| basic_woodworking | 1,291,915 |
| industrial_assembly | 924,525 |
| smart_grid | 1,168,295 |
| warehouse_systems | 1,305,522 |
| process_automation | 877,588 |
| organic_chemistry | 1,771,435 |

Performance optimization **deferred** (recorded only).

---

## O. Production Manifest

`docs/design/research/production/batch-2/ICON_004_PRODUCTION_BATCH_2_MANIFEST.json` — batch `batch-2`, six primaries, alpha paths, cumulative **14** detailed.

---

## P. Registry Extension

`visual-asset-registry.ts` — six new entries via `ICON_004_DETAILED_TECHNOLOGY_IDS`; `designSource` points to `batch-2/primary/` for Batch 2 IDs. **PASS**.

---

## Q. Resolver Coverage

`technology-visual-asset-ids.ts`:

- `ICON_004_DETAILED_TECHNOLOGY_IDS` — **14** IDs  
- `technologyToIcon004PrimaryAssetId` — detailed primary for 14; null for remaining 8  
- Unknown ID → generic `ICON-002-research` fallback **unchanged**

---

## R. Category Compact Compatibility

All six map to existing category compacts (PRODUCTION×2, ENERGY, LOGISTICS, AUTOMATION, CHEMISTRY). **No new glyphs.**

---

## S. ResearchScreen Integration

**No ResearchScreen changes.** `TechnologyVisual` consumes new registry mappings automatically @80px + dark catalog pad (Batch 1).

---

## T. Mixed-Coverage Behavior

**14** detailed + **8** category-only intentional. Evidence: runtime `ICON_004_PRODUCTION_BATCH_2_MIXED_COVERAGE.png` (Batch 2 detailed + Batch 1 detailed + category-only row).

---

## U. Desktop Runtime Validation

`docs/architecture/reviews/evidence/ICON_004_PRODUCTION_BATCH_2_RESEARCH_DESKTOP.png` (1440×900, full catalog scroll, **14** `-primary` images loaded). **PASS**

---

## V. Narrow Runtime Validation

`docs/architecture/reviews/evidence/ICON_004_PRODUCTION_BATCH_2_RESEARCH_NARROW.png` (480×900). **PASS** — no broken images, no ICON-004 horizontal overflow observed.

---

## W. Full 22-Technology Coverage Matrix

| Technology | Player Name | Category | Detailed Primary | Batch | Compact | Runtime Result |
|------------|-------------|----------|------------------|-------|---------|----------------|
| basic_woodworking | Basic Woodworking | PRODUCTION | YES | 2 | PRODUCTION | Tier-1 PNG |
| advanced_metallurgy | Advanced Metallurgy | PRODUCTION | YES | 1 | PRODUCTION | Tier-1 PNG |
| precision_machining | Precision Machining | PRODUCTION | YES | 1 | PRODUCTION | Tier-1 PNG |
| industrial_assembly | Industrial Assembly | PRODUCTION | YES | 2 | PRODUCTION | Tier-1 PNG |
| coal_efficiency | Coal Efficiency | ENERGY | YES | 1 | ENERGY | Tier-1 PNG |
| renewable_energy | Renewable Energy | ENERGY | YES | 1 | ENERGY | Tier-1 PNG |
| smart_grid | Smart Grid | ENERGY | YES | 2 | ENERGY | Tier-1 PNG |
| distribution_networks | Distribution Networks | LOGISTICS | NO | — | LOGISTICS | Compact |
| intermodal_logistics | Intermodal Logistics | LOGISTICS | YES | 1 | LOGISTICS | Tier-1 PNG |
| warehouse_systems | Warehouse Systems | LOGISTICS | YES | 2 | LOGISTICS | Tier-1 PNG |
| circuit_design | Circuit Design | ELECTRONICS | YES | 1 | ELECTRONICS | Tier-1 PNG |
| semiconductor_process | Semiconductor Process | ELECTRONICS | YES | 1 | ELECTRONICS | Tier-1 PNG |
| corporate_management | Corporate Management | MANAGEMENT | NO | deferred abstract | MANAGEMENT | Compact |
| executive_leadership | Executive Leadership | MANAGEMENT | NO | deferred abstract | MANAGEMENT | Compact |
| factory_automation | Factory Automation | AUTOMATION | YES | 1 | AUTOMATION | Tier-1 PNG |
| process_automation | Process Automation | AUTOMATION | YES | 2 | AUTOMATION | Tier-1 PNG |
| financial_planning | Financial Planning | FINANCE | NO | deferred abstract | FINANCE | Compact |
| organic_chemistry | Organic Chemistry | CHEMISTRY | YES | 2 | CHEMISTRY | Tier-1 PNG |
| polymer_science | Polymer Science | CHEMISTRY | NO | later detailed | CHEMISTRY | Compact |
| sustainable_agriculture | Sustainable Agriculture | AGRICULTURE | NO | later detailed | AGRICULTURE | Compact |
| crop_optimization | Crop Optimization | AGRICULTURE | NO | later detailed | AGRICULTURE | Compact |
| predictive_analytics | Predictive Analytics | AI | NO | deferred abstract | AI | Compact |

---

## X. Deferred Eight Technologies

**Later detailed batch:** `distribution_networks`, `polymer_science`, `sustainable_agriculture`, `crop_optimization`  
**Abstract art-direction pilot:** `corporate_management`, `executive_leadership`, `financial_planning`, `predictive_analytics`  
**DEFERRED — NOT REJECTED.** Not produced in Batch 2.

---

## Y. Scenario-B Accounting

**+6** unique authored Tier-1 concepts this slice; derivatives/WebP not counted. Master inventory ledger updated (cumulative **14** ICON-004 Tier-1). Planning envelope unchanged.

---

## Z. Master Inventory Update

`docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md` — Research row **PARTIAL — ICON-004 PRODUCTION BATCH 2** (14/22 detailed, 10/10 category compact).

---

## AA. Performance Boundary

Large PNG masters in catalog; no optimization slice. Sizes recorded §N. **DEFER** unless future evidence of material load failure.

---

## AB. Tests

Extended: `technology-visual-asset-ids.test.ts` (14 detailed, 8 category-only), `TechnologyVisual.test.tsx` (batch-2 primary + category-only corporate_management). **991** tests pass.

---

## AC. Root Gates

| Gate | Result |
|------|--------|
| pnpm typecheck | PASS |
| pnpm lint | PASS |
| pnpm test | PASS |
| pnpm build:web | PASS |

---

## AD. Firewalls

Research content, gameplay, ResearchScreen redesign, ICON-001/002/003, world, Batch 3, abstract pilot: **NONE** (comparison-only for ICON-003 on tech-vs-building board).

---

## AE. Repository Integrity

**Task-owned:** batch-2 masters/runtime, manifest/alpha JSON, registry/resolver/tests, tools (`process-*`, `icon-004-production-batch-2-evidence-boards.ts`, `capture-icon-004-batch-2-runtime-evidence.mjs`), evidence PNGs, close candidate, inventory + contract header, source PNGs in `assets/`.  
**Unrelated:** pre-existing working-tree churn — not absorbed.  
**Commit / push / tag:** NONE.

---

## AF. Remaining Risks

- Independent human visual review may request **one bounded art repair** from evidence boards.  
- Prerequisite copy still shows raw technology IDs in catalog (pre-existing; out of scope).  
- Runtime capture requires API on **3001** + `next start` proxy (documented for local evidence runs).

---

## AG. Human Visual Review Evidence

| Artifact | Path |
|----------|------|
| 14-family board | `docs/architecture/reviews/evidence/ICON_004_PRODUCTION_BATCH_2_DETAILED_FAMILY_BOARD_14.png` |
| New six board | `docs/architecture/reviews/evidence/ICON_004_PRODUCTION_BATCH_2_NEW_SIX_FAMILY_BOARD.png` |
| Scale board | `docs/architecture/reviews/evidence/ICON_004_PRODUCTION_BATCH_2_SCALE_BOARD.png` |
| Tech vs building | `docs/architecture/reviews/evidence/ICON_004_PRODUCTION_BATCH_2_TECH_VS_BUILDING_BOARD.png` |
| Desktop runtime | `docs/architecture/reviews/evidence/ICON_004_PRODUCTION_BATCH_2_RESEARCH_DESKTOP.png` |
| Narrow runtime | `docs/architecture/reviews/evidence/ICON_004_PRODUCTION_BATCH_2_RESEARCH_NARROW.png` |
| Mixed coverage | `docs/architecture/reviews/evidence/ICON_004_PRODUCTION_BATCH_2_MIXED_COVERAGE.png` |

Additional QA: `ICON_004_PRODUCTION_BATCH_2_NEW_SIX_FAMILY_BOARD.png` for close inspection of Batch 2 only.

---

## AH. Final Decision

## OPTION A —
ICON-004 TECHNOLOGY / RESEARCH VISUAL IDENTITY  
PRODUCTION BATCH 2 FINAL CLOSE CANDIDATE READY

(Cursor implementation + QA complete; **not** an independent human seal.)

---

## Batch-2 QA Matrix

| Technology | Subject | 1024 Master | Alpha | 96px | 128px | Semantic Honesty | Building Confusion | Result |
|------------|---------|-------------|-------|------|-------|------------------|--------------------|--------|
| basic_woodworking | Wood workstation | PASS | PASS | READ | PASS | PASS | PASS | PASS |
| industrial_assembly | Assembly fixture | PASS | PASS | READ | PASS | PASS | PASS | PASS |
| smart_grid | Grid control gear | PASS | PASS | READ | PASS | PASS | PASS | PASS |
| warehouse_systems | Rack/shuttle system | PASS | PASS | READ | PASS | PASS | PASS | PASS |
| process_automation | PLC/sensor cluster | PASS | PASS | READ | PASS | PASS | PASS | PASS |
| organic_chemistry | Reactor/column cluster | PASS | PASS | READ | PASS | PASS | PASS | PASS |
