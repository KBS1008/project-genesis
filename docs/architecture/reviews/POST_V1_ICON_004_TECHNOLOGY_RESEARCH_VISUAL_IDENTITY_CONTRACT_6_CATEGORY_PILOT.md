# Post-V1 ICON-004 Technology / Research Visual Identity — Contract + 6-Category Pilot

**Prompt:** `POST_V1_ICON_004_TECHNOLOGY_RESEARCH_VISUAL_IDENTITY_CONTRACT_6_CATEGORY_PILOT.md`  
**Date:** 2026-09-19  
**Final decision:** **OPTION A — ICON-004 CATEGORY VISUAL DIRECTION READY FOR HUMAN VISUAL APPROVAL**

---

## A. Executive Summary

Audited **22** enabled technologies across **10** used `TechnologyCategory` values (enum defines **11**; `BUILDING` unused). Delivered **ICON-004** visual contract, **6** category SVG pilots, manifest, and four evidence boards. **32px / 48px:** **6/6 READABLE**. Repeated-category stress test supports **Model B** (11 category glyphs + selective per-tech identity) as provisional architecture — **not** human-approved yet. **No** production registry, **no** ResearchScreen changes.

---

## B. Repository Baseline

| Item | Value |
|------|--------|
| HEAD | `5703404098f19c7db99229879f40c98794c1214e` |
| Branch | `master` |
| Scenario B review committed | **YES** (`5703404`) |
| Unrelated churn | dashboard/shell, M11/M12 docs, dev building pilots, etc. |

---

## C. Scenario-B Authority

Scenario **B** unchanged. Building track **23/23 SEALED**. This slice: **6 DEV/PILOT** glyphs — do not increment production authored totals.

---

## D. Research Content Audit

**Totals:** 22 technologies · 10 categories in use · enum `TechnologyCategory` has 11 values (`BUILDING` has **0** technologies).

Prior review cited “11 categories” — difference: **`BUILDING` is defined but unused** in current YAML; **10** categories carry all 22 techs.

### Content audit table

| Technology ID | Player Name | Category | Dependencies | Deterministic unlock/effect (content) | Pilot context |
|---------------|-------------|----------|--------------|----------------------------------------|---------------|
| basic_woodworking | Basic Woodworking | PRODUCTION | none | Root production research | Pilot category |
| advanced_metallurgy | Fortgeschrittene Metallurgie | PRODUCTION | chain | Gates later production tech | Pilot / repetition |
| precision_machining | Praezisionsbearbeitung | PRODUCTION | chain | Gates production capabilities | Repetition test |
| industrial_assembly | Industriemontage | PRODUCTION | chain | Gates production capabilities | Repetition test |
| coal_efficiency | Kohlekraft-Effizienz | ENERGY | chain | Energy efficiency research line | Pilot category |
| renewable_energy | Erneuerbare Energie | ENERGY | chain | Energy research line | Pilot category |
| smart_grid | Intelligentes Stromnetz | ENERGY | chain | Energy/grid research line | — |
| distribution_networks | Distributionsnetze | LOGISTICS | chain | Logistics research line | Repetition test |
| intermodal_logistics | Intermodale Logistik | LOGISTICS | chain | Unlocks intermodal building context in content | Pilot category |
| warehouse_systems | Lagersysteme | LOGISTICS | chain | Storage/logistics research line | Pilot category |
| circuit_design | Schaltungsdesign | ELECTRONICS | chain | Electronics research line | Pilot category |
| semiconductor_process | Halbleiterprozesse | ELECTRONICS | chain | Advanced electronics line | Pilot category |
| corporate_management | Unternehmensfuehrung | MANAGEMENT | chain | Management research line | Pilot category |
| executive_leadership | Executive Leadership | MANAGEMENT | chain | Management research line | Pilot category |
| factory_automation | Fabrikautomatisierung | AUTOMATION | chain | Automation research line | Pilot category |
| process_automation | Prozessautomatisierung | AUTOMATION | chain | Automation research line | Pilot category |
| financial_planning | Finanzplanung | FINANCE | chain | Finance research line | Not in 6-pilot |
| organic_chemistry | Organische Chemie | CHEMISTRY | chain | Chemistry line | Not in 6-pilot |
| polymer_science | Polymerwissenschaft | CHEMISTRY | chain | Chemistry line | Not in 6-pilot |
| sustainable_agriculture | Nachhaltige Landwirtschaft | AGRICULTURE | chain | Agriculture line | Not in 6-pilot |
| crop_optimization | Ertragsoptimierung | AGRICULTURE | chain | Agriculture line | Not in 6-pilot |
| predictive_analytics | Predictive Analytics | AI | chain | AI/analytics line | Not in 6-pilot |

*Dependencies: `requiredResearch` / milestone gates per YAML; building unlocks resolved through content graph — not inferred from names.*

---

## E. TechnologyCategory Audit

| Category | Tech Count | Semantic meaning (evidence) | Visual stability | Overlap risk | Pilot? |
|----------|------------|-----------------------------|------------------|--------------|--------|
| PRODUCTION | 4 | Manufacturing/material processing knowledge | High | vs AUTOMATION | **YES** |
| ENERGY | 3 | Power generation/grid knowledge | High | vs ELECTRONICS | **YES** |
| LOGISTICS | 3 | Networks, warehousing, intermodal flow | High | vs INFRASTRUCTURE buildings | **YES** |
| ELECTRONICS | 2 | Circuits/semiconductors | High | vs ENERGY | **YES** |
| MANAGEMENT | 2 | Corporate/executive capability | Medium | vs ADMIN buildings | **YES** |
| AUTOMATION | 2 | Factory/process automation | High | vs PRODUCTION | **YES** |
| FINANCE | 1 | Financial planning | Medium | vs MANAGEMENT | no |
| CHEMISTRY | 2 | Materials/chemistry science | Medium | vs PRODUCTION | no |
| AGRICULTURE | 2 | Agricultural optimization | Medium | — | no |
| AI | 1 | Analytics/AI | Medium | abstract | no |
| BUILDING | 0 | (enum only) | N/A | — | no |

Six pilot categories selected for **semantic diversity** (physical industry, energy, logistics, electronics, organization, automation).

---

## F. Six Pilot Categories

| Category | Technologies in category | Why selected | Main visual risk |
|----------|--------------------------|--------------|-------------------|
| PRODUCTION | 4 | Core industrial research volume; repetition stress | Confusion with AUTOMATION |
| ENERGY | 3 | Distinct infrastructure-energy domain | Confusion with ELECTRONICS |
| LOGISTICS | 3 | Movement/network identity | Confusion with transport UI tables only |
| ELECTRONICS | 2 | Technical/electronic systems | Thin category count |
| MANAGEMENT | 2 | Organizational domain | Abstract org-chart read |
| AUTOMATION | 2 | Advanced/automation domain | Confusion with PRODUCTION |

---

## G. ICON-004 Role

Knowledge/capability/domain glyphs — **not** buildings, resources, or generic dashboard strokes.

---

## H. Visual Contract

`docs/design/research/TECHNOLOGY_RESEARCH_ICON_004_VISUAL_CONTRACT.md` — **PILOT / PENDING HUMAN APPROVAL**, vector-first @32–48px.

---

## I. Six Pilot Glyphs

| File | Size (B) |
|------|---------|
| `ICON-004-category-PRODUCTION-pilot.svg` | 665 |
| `ICON-004-category-ENERGY-pilot.svg` | 603 |
| `ICON-004-category-LOGISTICS-pilot.svg` | 672 |
| `ICON-004-category-ELECTRONICS-pilot.svg` | 582 |
| `ICON-004-category-MANAGEMENT-pilot.svg` | 729 |
| `ICON-004-category-AUTOMATION-pilot.svg` | 738 |

Path: `docs/design/research/pilot-icon-004/category/`

---

## J. Technical SVG QA

Valid SVG, 48×48 viewBox, no external deps, no text, no raster embed — **PASS** (6/6). Lightweight (<1 KB each).

---

## K. Scale QA — 32 / 48 / 64

| Category | 32px | 48px | 64px |
|----------|------|------|------|
| All six | READABLE | READABLE | inspection OK (not empty) |

Evidence: `ICON_004_CATEGORY_PILOT_SCALE_BOARD.png` — **6/6 @32**, **6/6 @48**.

---

## L. Semantic Honesty Matrix

| Category | Actual content meaning | Visual motif | Reads without text | Confusion risk | Result |
|----------|------------------------|--------------|--------------------|----------------|--------|
| PRODUCTION | Manufacturing knowledge | Gear + tool | Yes | AUTOMATION | PASS |
| ENERGY | Power/grid knowledge | Pylon + bolt | Yes | ELECTRONICS | PASS |
| LOGISTICS | Network/flow knowledge | Hub nodes | Yes | Building infra | PASS |
| ELECTRONICS | Chip/circuit knowledge | Chip package | Yes | ENERGY | PASS |
| MANAGEMENT | Org capability | Hierarchy | Yes | HQ building | PASS |
| AUTOMATION | Automated processes | Loop + stations | Yes | PRODUCTION | PASS |

---

## M. Pairwise Confusion Check

| Pair | @32 | @48 | Separator |
|------|-----|-----|-----------|
| PRODUCTION vs AUTOMATION | Yes | Yes | Gear vs closed loop frame |
| ENERGY vs ELECTRONICS | Yes | Yes | Pylon/bolt vs chip |
| LOGISTICS vs (building infra) | Yes | Yes | Network nodes vs volumetric building compacts |

Not color-only — **PASS**.

---

## N. Cross-Family Comparison

| Question | Result |
|----------|--------|
| Mistaken for ICON-001 resource? | **NO** |
| Mistaken for ICON-002 building category? | **NO** (framed knowledge glyphs) |
| Mistaken for ICON-003 compact building? | **NO** |
| Generic shell DashboardIcon? | **NO** (filled industrial symbols) |

---

## O. Real Technology Context

`ICON_004_CATEGORY_PILOT_RESEARCH_CONTEXT.png` — dark row mock with **German/authoritative names** + 48px glyphs — **PASS**.

---

## P. Repeated-Category Stress Test

`ICON_004_CATEGORY_PILOT_REPETITION_TEST.png` — 4× PRODUCTION + 3× LOGISTICS rows sharing glyphs.

**Conclusion:** **CATEGORY + SELECTIVE PER-TECH IDENTITY RECOMMENDED** (provisional) — catalog remains usable with strong text, but repeated rows need names; high-branch technologies may deserve unique symbols later.

### Repetition matrix

| Category | Technology A | Technology B | Same glyph useful? | Repetition problem | Future per-tech need |
|----------|--------------|--------------|--------------------|--------------------|----------------------|
| PRODUCTION | Basic Woodworking | Praezisionsbearbeitung | Yes at domain level | Moderate in dense lists | Selective for late-tree tech |
| PRODUCTION | Industriemontage | Fortgeschrittene Metallurgie | Yes | Same | Selective |
| LOGISTICS | Distributionsnetze | Intermodale Logistik | Yes | Moderate | Low unless hero unlock |
| LOGISTICS | Lagersysteme | Intermodale Logistik | Yes | Same | Low |

---

## Q. Category-Only vs Per-Tech Assessment

| Model | Description | Recognition | Progression reward | Repetition | Art cost | Scalability | Recommendation |
|-------|-------------|-------------|--------------------|------------|----------|-------------|----------------|
| A | 11 category only | Good domain | Weak per-tech | High in dense categories | Low | High | Viable baseline |
| B | 11 category + selective per-tech | Strong | Better unlock moments | Reduced | Medium | High | **Provisional preferred** |
| C | 22 per-tech + category fallback | Max | Strong | Low | High | Medium | Overkill for v1 |

**Provisional recommendation:** **Model B** — complete **10–11 category** set after pilot approval; add **selective** per-tech icons only where dependency depth / player-facing prominence evidence supports (no name-based importance).

---

## R. Research UI Context

Static evidence uses current dark operation-row language (`#161b22`, list rows) — **not** a redesigned ResearchScreen.

---

## S. State Treatment Boundary

Documented in contract — UI overlays only. **No** `ICON_004_CATEGORY_PILOT_STATE_TEST.png` (ResearchScreen state semantics not fully mirrored in static mock; avoid inventing states).

---

## T. Accessibility Boundary

Labels authoritative; icons supplementary; documented in contract §11.

---

## U. Production Architecture Proposal (not implemented)

`TechnologyCategory → ICON-004-category-{id}` via single resolver; optional `technologyId` override map; fallback generic research glyph.

---

## V. Future Fallback Model

**Model B path:** `technologyId? → category ICON-004 → generic research fallback`.

---

## W. Scenario-B Accounting

6 pilot concepts = **DEV/PILOT** only. Production authored totals **unchanged**.

---

## X. Master Inventory Status

Updated: Research family **GAP — ICON-004 6-category PILOT IN REVIEW**. Not ACTIVE.

---

## Y. Technical Gates

| Gate | Result |
|------|--------|
| pnpm typecheck | PASS |
| pnpm lint | PASS (0 new errors) |
| pnpm test | PASS |
| pnpm build:web | PASS |
| SVG QA | PASS |

---

## Z. Repository Integrity

Task-owned: contract, pilot SVGs, manifest, evidence PNGs, `tools/icon-004-category-pilot-evidence-boards.ts`, inventory delta, this report. **No** production registry / ResearchScreen / content changes. **No** commit/push.

---

## AA. Human Visual Gate

**PENDING** — options: APPROVE ICON-004 CATEGORY DIRECTION · APPROVE WITH CATEGORY + SELECTIVE PER-TECH · REVISE · REJECT.

---

## AB. Final Decision

**OPTION A — ICON-004 CATEGORY VISUAL DIRECTION READY FOR HUMAN VISUAL APPROVAL**

---

# Project Genesis
# ICON-004 Technology / Research Visual Identity
## Contract + 6-Category Pilot — Execution Summary

### Baseline

- **HEAD:** `5703404098f19c7db99229879f40c98794c1214e`
- **branch:** master
- **working tree:** unrelated churn present

### Research Authority

- enabled technologies: **22**
- TechnologyCategory values in content: **10 used** (11 enum; BUILDING unused)
- content changed: **NO**

### Pilot Selection

1. PRODUCTION  
2. ENERGY  
3. LOGISTICS  
4. ELECTRONICS  
5. MANAGEMENT  
6. AUTOMATION  

### Contract

- path: `docs/design/research/TECHNOLOGY_RESEARCH_ICON_004_VISUAL_CONTRACT.md`
- status: **PILOT / PENDING HUMAN APPROVAL**
- vector-first: **YES**
- primary target: **32–48px**

### Pilot Assets

- SVG glyphs: **6 / 6**
- manifest: **PASS**
- production registry: **NOT ACTIVATED**
- ResearchScreen production: **UNCHANGED**

### Scale QA

- 32px: **6 / 6 READABLE**
- 48px: **6 / 6 READABLE**
- 64px: acceptable inspection

### Semantic QA

- semantic honesty: **PASS**
- pairwise differentiation: **PASS**
- color-only differentiation: **NO**
- generic UI appearance: **NO**

### Cross-Family

- distinct from ICON-001/002/003: **YES**
- Project Genesis family fit: **PASS**

### Real Technology Context

- real technologies used: **YES**
- repeated categories tested: **PRODUCTION, LOGISTICS**
- context evidence: **PASS**

### Category Repetition

- category-only result: **acceptable with text**
- repetition problem: **moderate in 4-tech categories**
- selective per-tech need: **YES (provisional)**
- full 22 per-tech need: **NO**

### Future Model

- Model A: viable baseline  
- Model B: **provisional recommendation**  
- Model C: overkill for v1  

### Evidence

- scale / family / Research context / repetition boards: **created**

### Gates

- typecheck / lint / tests / build:web: **PASS**

### Scenario B

- pilot concepts: **6 DEV/PILOT**
- production authored total changed: **NO**

### Firewalls

- gameplay / research content / ResearchScreen / ICON-001–003 / World / milestones / guidance: **NONE**

### Repository Integrity

- commit / push / tag: **NONE**

### Human Visual Gate

**PENDING**

### Final Decision

**OPTION A**

**STOP.**
