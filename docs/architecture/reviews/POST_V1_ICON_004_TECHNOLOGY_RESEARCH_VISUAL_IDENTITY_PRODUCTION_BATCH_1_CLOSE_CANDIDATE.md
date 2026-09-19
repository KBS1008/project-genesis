# Post-V1 ICON-004 Technology / Research Visual Identity — Production Batch 1 Close Candidate

**Prompt:** `POST_V1_ICON_004_TECHNOLOGY_RESEARCH_VISUAL_IDENTITY_PRODUCTION_BATCH_1.md`  
**Date:** 2026-09-19  
**Final decision:** **OPTION A — ICON-004 TECHNOLOGY / RESEARCH VISUAL IDENTITY PRODUCTION BATCH 1 FINAL CLOSE CANDIDATE READY**

---

## A. Executive Summary

ICON-004 **Production Batch 1** is complete: contract **APPROVED / PRODUCTION AUTHORITY**, **8/8** Tier-1 detailed primaries, **10/10** category compacts, registry/resolver, bounded **ResearchScreen** integration, alpha **8/8 PASS**, static evidence **6/6**, and **real runtime** desktop/narrow Research captures **PASS** after bounded repairs (dark catalog pad, PNG primary URLs, capture wait/scroll). **No commit** in this slice.

---

## B. Repository Baseline

| Item | Value |
|------|--------|
| HEAD (start) | `5703404098f19c7db99229879f40c98794c1214e` |
| Branch | `master` |
| Predecessor ICON-004 pilot work | working tree (may be uncommitted vs HEAD) |
| Unrelated churn | dashboard/shell, M11/M12 docs, building pilots, etc. |

---

## C. Human Visual Authority

Per prompt: detailed Tier-1, category Tier-2, and two-tier contract **APPROVED / SEALED**. Promoted pilots **not regenerated** (copy-derived from pilot masters).

---

## D. ICON-004 Production Contract

`docs/design/research/TECHNOLOGY_RESEARCH_ICON_004_VISUAL_CONTRACT.md` — **APPROVED / PRODUCTION AUTHORITY**; §32 Batch 1 activation recorded.

---

## E. Current Research Content Audit

**22** enabled technologies · **10** categories in YAML · **11** enum values (`BUILDING` unused). Content unchanged (firewall).

---

## F. Visual-Risk Classification (summary)

| Class | Count (approx.) | Batch-1 action |
|-------|-----------------|----------------|
| SAFE_DETAILED | 8 | **In Batch 1** |
| CONDITIONAL_DETAILED | ~6 | Deferred |
| ABSTRACT_HIGH_RISK | ~6 | Deferred |
| SEMANTICALLY_BLOCKED | 0 | — |

---

## G. Batch-1 Selection

| Technology | Category | Risk Class | Actual Meaning | Visual Subject | Why Batch 1 |
|------------|----------|------------|----------------|----------------|-------------|
| precision_machining | PRODUCTION | SAFE | Precision machining | CNC vignette | **PROMOTED APPROVED PILOT** |
| renewable_energy | ENERGY | SAFE | Renewables / hybrid | Panel + inverter pad | **PROMOTED APPROVED PILOT** |
| semiconductor_process | ELECTRONICS | SAFE | Fab processes | Process chamber cluster | **PROMOTED APPROVED PILOT** |
| advanced_metallurgy | PRODUCTION | SAFE | Advanced metal processing | Arc furnace / ladle apparatus | **NEW BATCH-1 PRIMARY** |
| coal_efficiency | ENERGY | SAFE | Coal plant efficiency | Boiler / steam subsystem | **NEW BATCH-1 PRIMARY** |
| intermodal_logistics | LOGISTICS | SAFE | Intermodal logistics | Container handling gear | **NEW BATCH-1 PRIMARY** |
| circuit_design | ELECTRONICS | SAFE | Circuit design | PCB bench assembly | **NEW BATCH-1 PRIMARY** |
| factory_automation | AUTOMATION | SAFE | Factory automation | Robot cell + control rack | **NEW BATCH-1 PRIMARY** |

---

## H. Promoted Pilot Primaries

| Technology | Pilot source | Production master | Byte-identical copy | Alpha | Runtime |
|------------|--------------|-------------------|---------------------|-------|---------|
| precision_machining | `pilot-icon-004/detailed-primary/...-pilot.png` | `production/batch-1/primary/ICON-004-precision_machining-primary.png` | yes | PASS | `/assets/research/` |
| renewable_energy | same pattern | same | yes | PASS | synced |
| semiconductor_process | same pattern | same | yes | PASS | synced |

---

## I. Five New Detailed Primaries

Generated → alpha pipeline → production masters + WebP runtime. All **PASS** @1024 RGBA.

---

## J. Category Compact Production Family

**10/10** used categories: 6 promoted from pilot SVGs (geometry unchanged), 4 new (`FINANCE`, `CHEMISTRY`, `AGRICULTURE`, `AI`). `BUILDING` enum **UNSUPPORTED** → generic `ICON-002-research` fallback.

---

## K. Detailed Technical / Alpha QA

`ICON_004_PRODUCTION_BATCH_1_ALPHA_REPORT.json` — **8/8 PASS**.

---

## L. Scale QA

`ICON_004_PRODUCTION_BATCH_1_SCALE_BOARD.png` — 64/96/128/256 for all eight primaries.

---

## M. Semantic Honesty / N. Technology-vs-Building

**8/8 PASS** — apparatus vignettes, not placeable building masses.

---

## O. Production Manifest

`docs/design/research/production/batch-1/ICON_004_PRODUCTION_BATCH_1_MANIFEST.json`

---

## P. Production Registry / Resolver

`visual-asset-registry.ts` — `icon004RegistryEntries()`  
`technology-visual-asset-ids.ts` — single resolver hierarchy  
`TechnologyVisual.tsx` — presentation primitive

---

## Q. Fallback Behavior

Unknown tech → `ICON-002-research`. Category-only tech → category compact @48px (no empty 80px slot). Batch-1 tech → 80px detailed primary.

---

## R. ResearchScreen Integration

`ResearchScreen.tsx` — catalog rows use `TechnologyVisual` @80px, `loading="eager"`. No layout redesign; spacing aligned with Buildings catalog pattern.

---

## S. Mixed-Coverage Runtime

Live ResearchScreen (save `e2e-m11-phase6-production-closeout.json`) shows **8** detailed primaries and **category compact** icons for non-batch technologies in the same catalog — intentional mixed coverage, not broken placeholders.

---

## T. Desktop Runtime Validation

**PASS** — `ICON_004_PRODUCTION_BATCH_1_RESEARCH_DESKTOP.png` @ ~1440×900 full page.

Verified: all **8** batch-1 detailed primaries visible (metallurgy, coal, intermodal, precision, renewable, semiconductor, circuit, automation); category-only rows use compact glyphs (e.g. Basic Woodworking gear); no broken-image icons; no empty gray slots after load; Forschungskatalog controls unchanged. Prerequisite copy still references content technology IDs inside localized sentences (pre-existing dashboard semantics — not ICON-004 regression).

---

## U. Narrow Runtime Validation

**PASS** — `ICON_004_PRODUCTION_BATCH_1_RESEARCH_NARROW.png` @ ~480×900 full page.

Verified: detailed primaries remain visible; compact fallbacks scale correctly; no horizontal overflow from ICON-004 art; names and buttons usable.

---

## V. Full Technology Coverage Matrix

| Technology | Player Name (content) | Category | Risk | Detailed | Compact | Runtime | Batch Status |
|------------|----------------------|----------|------|----------|---------|---------|--------------|
| precision_machining | (DE content) | PRODUCTION | SAFE | YES | YES | primary | **BATCH 1** |
| renewable_energy | … | ENERGY | SAFE | YES | YES | primary | **BATCH 1** |
| semiconductor_process | … | ELECTRONICS | SAFE | YES | YES | primary | **BATCH 1** |
| advanced_metallurgy | … | PRODUCTION | SAFE | YES | YES | primary | **BATCH 1** |
| coal_efficiency | … | ENERGY | SAFE | YES | YES | primary | **BATCH 1** |
| intermodal_logistics | … | LOGISTICS | SAFE | YES | YES | primary | **BATCH 1** |
| circuit_design | … | ELECTRONICS | SAFE | YES | YES | primary | **BATCH 1** |
| factory_automation | … | AUTOMATION | SAFE | YES | YES | primary | **BATCH 1** |
| *14 others* | … | various | conditional/abstract | NO | YES | compact | **DEFERRED — NOT REJECTED** |

---

## W. Deferred Technologies

`basic_woodworking`, `industrial_assembly`, `smart_grid`, `distribution_networks`, `warehouse_systems`, `corporate_management`, `executive_leadership`, `process_automation`, `financial_planning`, `organic_chemistry`, `polymer_science`, `sustainable_agriculture`, `crop_optimization`, `predictive_analytics` — **DEFERRED — NOT REJECTED** (Batch 2 / abstract semantics slice).

---

## X. Scenario-B Accounting

| Ledger item | Count |
|-------------|------:|
| New authored detailed concepts (Batch 1) | **8** (once each; no pilot double-count) |
| New authored category compacts (net new glyphs) | **4** (+ 6 promoted production copies of existing pilot concepts) |
| Research visual identity complete | **NO** (8/22 detailed) |

---

## Y. Master Inventory Update

Research family → **PARTIAL — ICON-004 PRODUCTION BATCH 1** (8/22 detailed, 10/10 category).

---

## Z. Tests

`technology-visual-asset-ids.test.ts`, `TechnologyVisual.test.tsx`, `visual-asset-registry.test.ts` (ICON-004), `ResearchScreen.test.tsx` — **PASS** (full `pnpm test`).

---

## AA. Root Gates

typecheck · lint · test · build:web — **PASS**

---

## AB–AC. Firewalls / Repository Integrity

No research content/gameplay/ICON-001–003/building/world changes. Task-owned paths under `docs/design/research/production/batch-1/`, `apps/web/public/assets/research/`, presentation assets, tools, evidence (partial). **No commit/push.**

---

## AD. Remaining Risks

- Abstract/high-risk technologies remain category-only until a later slice.  
- Prerequisite strings still embed technology IDs in quotes (content/dashboard; unchanged).  
- Large PNG primaries (~0.8–1.7 MB) — acceptable for Batch 1; derivative/WebP policy may evolve.

### Bounded runtime-evidence repairs (this pass)

1. `.pg-technology-catalog-art` dark pad (`#161b22`) for transparent Tier-1 vignettes on light UI.  
2. `TechnologyVisual` uses **PNG** URLs for detailed primaries (`preferWebp: false`).  
3. `capture-icon-004-batch-1-runtime-evidence.mjs` scrolls all catalog rows and waits for **8** `-primary` images before capture.

---

## AE. Final Decision

**OPTION A — ICON-004 TECHNOLOGY / RESEARCH VISUAL IDENTITY PRODUCTION BATCH 1 FINAL CLOSE CANDIDATE READY**

Independent seal/review still required before commit.

---

## Evidence index

| File | Status |
|------|--------|
| `ICON_004_PRODUCTION_BATCH_1_DETAILED_FAMILY_BOARD.png` | present |
| `ICON_004_PRODUCTION_CATEGORY_COMPACT_FAMILY_BOARD.png` | present |
| `ICON_004_PRODUCTION_BATCH_1_MIXED_COVERAGE_BOARD.png` | present |
| `ICON_004_PRODUCTION_BATCH_1_SCALE_BOARD.png` | present |
| `ICON_004_PRODUCTION_BATCH_1_RESEARCH_DESKTOP.png` | **present — PASS** |
| `ICON_004_PRODUCTION_BATCH_1_RESEARCH_NARROW.png` | **present — PASS** |

---

# Execution Summary

### Baseline

- **HEAD:** `5703404098f19c7db99229879f40c98794c1214e`
- **branch:** master

### Contract

- detailed Tier 1: **APPROVED / PRODUCTION AUTHORITY**
- category Tier 2: **APPROVED / PRODUCTION AUTHORITY**
- contract path: `docs/design/research/TECHNOLOGY_RESEARCH_ICON_004_VISUAL_CONTRACT.md`

### Detailed Batch

- target: **8** · promoted: **3/3** · new: **5/5** · total: **8/8**

### Batch Technologies

1. precision_machining  
2. renewable_energy  
3. semiconductor_process  
4. advanced_metallurgy  
5. coal_efficiency  
6. intermodal_logistics  
7. circuit_design  
8. factory_automation  

### Category Compact Coverage

- used categories: **10** · production glyphs: **10/10** · 32px/48px: **PASS** (board QA)

### Gates

- typecheck/lint/test/build:web/alpha/manifest/resolver: **PASS**
- runtime desktop/narrow: **PASS**

### Final Decision

**OPTION A**
