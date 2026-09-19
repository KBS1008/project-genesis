# Post-V1 ICON-004 Technology / Research — Detailed Primary-Art Art Direction Pilot

**Prompt:** `POST_V1_ICON_004_TECHNOLOGY_DETAILED_VISUAL_IDENTITY_ART_DIRECTION_PILOT.md`  
**Date:** 2026-09-19  
**Final decision:** **OPTION A — ICON-004 DETAILED TECHNOLOGY ART DIRECTION READY FOR HUMAN VISUAL APPROVAL**

---

## A. Executive Summary

Extended ICON-004 with **three** 1024×RGBA detailed technology primaries (precision machining, renewable energy, semiconductor process) while **preserving** six category SVG pilots. Defined **two-tier** contract extension (Tier-1 raster primary + Tier-2 category compact). Alpha **3/3 PASS**; scale evidence @64–256; six evidence boards. Technology-vs-building distinction **PASS** for 3/3. Research fantasy and reward tests **materially positive** (2/3 STRONG reward). 22-tech scalability assessed — **Model B** (category + selective detailed) reaffirmed. **No** production registry, **no** ResearchScreen changes, **no** commit.

---

## B. Repository Baseline

| Item | Value |
|------|--------|
| HEAD | `5703404098f19c7db99229879f40c98794c1214e` |
| Branch | `master` |
| Category pilot | present in working tree (may be uncommitted vs HEAD) |
| Unrelated churn | dashboard/shell, M11/M12 docs, dev building pilots, `.next`, etc. |

---

## C. Human Direction / Pilot Reason

Scenario B requires more than compact category glyphs: test whether **per-technology detailed art** can feel tangible, on-brand with ICON-003 B2 quality, and **not** building catalog art. Exactly **three** technologies span PRODUCTION / ENERGY / ELECTRONICS semantics.

---

## D. Existing Category Glyph Layer

Six SVGs unchanged under `docs/design/research/pilot-icon-004/category/`. Manifest: `ICON_004_CATEGORY_PILOT_MANIFEST.json`. Category review: **OPTION A** (category direction ready for human approval — separate gate).

---

## E. Research Semantic Audit

**22** enabled technologies · **10** categories in YAML · enum **11** (`BUILDING` unused). Selected technologies verified against content names/categories:

| Technology ID | Player name | Category | Content meaning (summary) |
|---------------|-------------|----------|---------------------------|
| precision_machining | Praezisionsbearbeitung | PRODUCTION | Precision machine tools / machining capability |
| renewable_energy | Erneuerbare Energie | ENERGY | Solar and hybrid renewable energy systems |
| semiconductor_process | Halbleiterprozesse | ELECTRONICS | Semiconductor microfabrication processes |

---

## F. Three Selected Technologies

| Technology | Category | Why selected | Primary subject hypothesis |
|------------|----------|--------------|----------------------------|
| precision_machining | PRODUCTION | High repetition stress in category; physical apparatus | CNC spindle / tool / workpiece vignette |
| renewable_energy | ENERGY | Distinct from coal line; building confusion risk | Panel + inverter assembly on pad |
| semiconductor_process | ELECTRONICS | Advanced line; non-building equipment | Fab process chamber + wafer handler |

Selection matrix (prompt §11): covers **physical**, **energy**, **microelectronics** apparatus families without duplicating ICON-003 building IDs.

---

## G. Detailed Primary-Art Contract Extension

`TECHNOLOGY_RESEARCH_ICON_004_VISUAL_CONTRACT.md` — added §18–31: two-tier hierarchy, camera/composition, alpha, runtime sizes, semantic honesty, building/resource boundaries, naming, fallback, pilot findings.

---

## H. Art Direction

**Stylized detailed industrial technology vignette** — B2 material/lighting band, 3/4 object camera, transparent alpha, dominant apparatus subject. Explicit anti-patterns: full building mass, resource piles, emoji UI symbols, invented mechanics.

---

## I. Primary Masters

| File | Technology |
|------|------------|
| `detailed-primary/ICON-004-tech-precision_machining-primary-pilot.png` | precision_machining |
| `detailed-primary/ICON-004-tech-renewable_energy-primary-pilot.png` | renewable_energy |
| `detailed-primary/ICON-004-tech-semiconductor_process-primary-pilot.png` | semiconductor_process |

Sources processed from `assets/ICON-004-tech-*-primary-pilot-source.png`.

---

## J. Alpha / Technical QA

Report: `ICON_004_DETAILED_TECHNOLOGY_PILOT_ALPHA_REPORT.json`

| Technology | 1024×1024 | Channels | Transparent % | Checkerboard | Result |
|------------|-----------|----------|---------------|--------------|--------|
| precision_machining | yes | 4 | 41.6 | no | **PASS** |
| renewable_energy | yes | 4 | 69.9 | no | **PASS** |
| semiconductor_process | yes | 4 | 56.9 | no | **PASS** |

Tooling: `tools/process-icon-004-detailed-pilot-alpha.ts` (shared `building-art-alpha` pipeline).

---

## K. Scale QA — 64 / 96 / 128 / 256

Evidence: `ICON_004_DETAILED_TECHNOLOGY_SCALE_BOARD.png` — uniform sharp resize (no per-column sharpening).

| Technology | 64px | 96px | 128px | 256px | Detail dependency | Result |
|------------|------|------|-------|-------|-------------------|--------|
| precision_machining | READABLE | READABLE | READABLE | REWARDING | Medium — spindle read @96 | **PASS** |
| renewable_energy | READABLE | READABLE | READABLE | REWARDING | Low — panel silhouette @96 | **PASS** |
| semiconductor_process | READABLE | READABLE | READABLE | REWARDING | Medium — chamber silhouette @96 | **PASS** |

**96px 3/3 · 128px 3/3** — meets OPTION A scale gate.

---

## L. Semantic Honesty

| Technology | Actual content meaning | Depicted capability | Unsupported implication | Building confusion | Result |
|------------|------------------------|---------------------|-------------------------|--------------------|--------|
| precision_machining | Precision machining knowledge | Machine tool subsystem | Full automated factory line | Low (not hall exterior) | **PASS** |
| renewable_energy | Renewable / hybrid energy systems | Panels + inverter pad | Grid-wide map / smart grid UI | Medium mitigated (not plant building) | **PASS** |
| semiconductor_process | Semiconductor fabrication | Process chamber + handler | Consumer gadget product shot | Low (not factory facade) | **PASS** |

---

## M. Technology Differentiation

Three subjects differ by **apparatus grammar** (rotary metal cutting vs planar energy capture vs sealed process chamber). Not palette swaps or generic “factory” masses.

---

## N. Relationship to ICON-003 B2

Cross-family board compares ICON-001 Steel, ICON-002 Production, machine_shop primary + compact, ICON-004 category + detailed primary. **Shared:** lighting, industrial palette, stylized realism. **Distinct:** building mass vs apparatus vignette; placeable structure vs knowledge subject.

---

## O. Relationship to ICON-004 Category Glyphs

Two-tier board shows primary + category SVG per tech. Primary answers **which technology**; glyph answers **which domain** — complementary, not redundant.

---

## P. Research Fantasy Test

Research context mock (`ICON_004_DETAILED_TECHNOLOGY_RESEARCH_CONTEXT.png`) inserts detailed art on three rows among glyph-only rows. **Finding:** list reads less like admin spreadsheet; density still fits row-height band (~56px art) — full integration may need a later UI slice for larger cards, but **bounded mock** shows material improvement without redesigning ResearchScreen.

---

## Q. Visual Reward Test

Progression mock (`ICON_004_DETAILED_TECHNOLOGY_PROGRESSION_CONTEXT.png`) uses semiconductor_process as completed hero. **Reward:** precision_machining **STRONG**, semiconductor_process **STRONG**, renewable_energy **GOOD** → **2/3 STRONG** (meets pilot bar).

---

## R. Research Context

See evidence PNG; real technology names; no invented descriptions.

---

## S. Progression / Unlock Context

Static completion card mock only — no mechanics changes.

---

## T. 22-Tech Scalability Matrix

| Technology | Category | Proposed Tier-1 subject class | Repeat risk | Tier-1 recommendation |
|------------|----------|--------------------------------|-------------|------------------------|
| basic_woodworking | PRODUCTION | Workshop tools / bench process | Medium | Optional selective |
| advanced_metallurgy | PRODUCTION | Furnace/metal process vignette | Medium | Optional selective |
| precision_machining | PRODUCTION | CNC apparatus | Low (pilot) | **Pilot done** |
| industrial_assembly | PRODUCTION | Assembly station / fixture | Medium | Optional selective |
| coal_efficiency | ENERGY | Boiler/turbine subsystem | Medium | Optional selective |
| renewable_energy | ENERGY | Panel + inverter pad | Low (pilot) | **Pilot done** |
| smart_grid | ENERGY | Switchgear / control cabinet | High abstract | Category + maybe hero |
| distribution_networks | LOGISTICS | Network hub hardware | Medium | Category-first |
| intermodal_logistics | LOGISTICS | Container handling gear | Medium | Optional selective |
| warehouse_systems | LOGISTICS | Rack/conveyor subsystem | Medium | Category-first |
| circuit_design | ELECTRONICS | PCB / bench electronics | Medium | Optional selective |
| semiconductor_process | ELECTRONICS | Fab chamber cluster | Low (pilot) | **Pilot done** |
| corporate_management | MANAGEMENT | Org/process diagram vignette | High abstract | Category-first |
| executive_leadership | MANAGEMENT | Strategy/boardroom abstract | High abstract | Category-first |
| factory_automation | AUTOMATION | Robot cell / PLC rack | Medium | Optional selective |
| process_automation | AUTOMATION | Control loop hardware | Medium | Optional selective |
| financial_planning | FINANCE | Ledger/analytics abstract | High abstract | Category-only likely |
| organic_chemistry | CHEMISTRY | Lab reactor / vessels | Medium | Optional selective |
| polymer_science | CHEMISTRY | Extruder / polymer line | Medium | Optional selective |
| sustainable_agriculture | AGRICULTURE | Ag tech installation | Medium | Optional selective |
| crop_optimization | AGRICULTURE | Sensor/irrigation hardware | Medium | Category-first |
| predictive_analytics | AI | Server/analytics rack | High abstract | Category-first |

**Assessment:** Full **22/22** detailed primaries is feasible but costly for abstract categories (MANAGEMENT, FINANCE, AI); **selective Tier-1** on milestone / capstone technologies scales honestly.

---

## U. Model A / B / C Assessment

| Model | Visual reward | Research fantasy | Repetition | Production cost | Scalability | Scenario-B fit | Recommendation |
|-------|---------------|------------------|------------|-----------------|-------------|----------------|----------------|
| A — category only | Low–medium | Admin list | Low | Lowest | Easy | Partial | Category baseline only |
| B — category + selective detailed | **High** on heroes | **Strong** | Managed | **Moderate** | **Honest** | **Strong** | **Recommended** |
| C — category + 22 detailed | High everywhere | Strong | High sameness risk | Very high | Strained on abstract | Diminishing returns | Not recommended wholesale |

---

## V. Proposed Production Architecture

1. Ship **11 category SVGs** (complete remaining 5 + pilot 6) as Tier-2.  
2. Add **selective Tier-1** raster map for capstone / player-facing milestone technologies (~8–14), not mandatory 22/22.  
3. Single resolver + UI overlays for state (unchanged).  
4. ResearchScreen layout slice later if larger art desired.

---

## W. Scenario-B Accounting

ICON-003 building track **23/23 SEALED**. This slice: **3 PILOT** detailed primaries + contract extension — do not count as production-authored Scenario-B closure.

---

## X. Master Inventory Status

Research family: **GAP — ICON-004 category + detailed primary PILOT IN REVIEW** (see inventory delta).

---

## Y. Technical Gates

| Gate | Result |
|------|--------|
| pnpm typecheck | PASS |
| pnpm lint | PASS |
| pnpm test | PASS |
| pnpm build:web | PASS |
| Alpha QA | PASS 3/3 |
| Manifest / paths | PASS |

---

## Z. Repository Integrity

Task-owned: 3 PNG primaries, detailed manifest, alpha report, contract §18–31, 6 evidence PNGs, `tools/process-icon-004-detailed-pilot-alpha.ts`, `tools/icon-004-detailed-pilot-evidence-boards.ts`, inventory line, this report. **No** registry / ResearchScreen / content / commit / push.

---

## AA. Human Visual Gate

Please review evidence boards and answer:

1. Are the three detailed visuals beautiful enough for Scenario B?  
2. Same game as ICON-003?  
3. Clearly **technology**, not **building**?  
4. Sufficient detail @128–256?  
5. Readable @96?  
6. Transparent vignette approach OK?  
7. Category glyphs still work as lower tier?  
8. Material Research fantasy improvement?  
9. Progression/reward value?  
10. Scalable across 22 technologies?  
11. Selective detailed vs 22/22 detailed for production?

**Cursor does not approve** — human gate pending.

---

## AB. Final Decision

**OPTION A — ICON-004 DETAILED TECHNOLOGY ART DIRECTION READY FOR HUMAN VISUAL APPROVAL**

---

### Required pilot matrix

| Technology | Category | Primary subject | Master | Alpha | 96px | 128px | Fantasy | Reward | Result |
|------------|----------|-----------------|--------|-------|------|-------|---------|--------|--------|
| precision_machining | PRODUCTION | CNC spindle vignette | yes | PASS | READABLE | READABLE | Improved | STRONG | PASS |
| renewable_energy | ENERGY | Panel + inverter pad | yes | PASS | READABLE | READABLE | Improved | GOOD | PASS |
| semiconductor_process | ELECTRONICS | Fab chamber cluster | yes | PASS | READABLE | READABLE | Improved | STRONG | PASS |

---

### Evidence index

- `docs/architecture/reviews/evidence/ICON_004_DETAILED_TECHNOLOGY_PRIMARY_PILOT_FAMILY_BOARD.png`
- `docs/architecture/reviews/evidence/ICON_004_DETAILED_TECHNOLOGY_TWO_TIER_BOARD.png`
- `docs/architecture/reviews/evidence/ICON_004_DETAILED_TECHNOLOGY_SCALE_BOARD.png`
- `docs/architecture/reviews/evidence/ICON_004_DETAILED_TECHNOLOGY_RESEARCH_CONTEXT.png`
- `docs/architecture/reviews/evidence/ICON_004_DETAILED_TECHNOLOGY_PROGRESSION_CONTEXT.png`
- `docs/architecture/reviews/evidence/ICON_004_DETAILED_TECHNOLOGY_CROSS_FAMILY_BOARD.png`
