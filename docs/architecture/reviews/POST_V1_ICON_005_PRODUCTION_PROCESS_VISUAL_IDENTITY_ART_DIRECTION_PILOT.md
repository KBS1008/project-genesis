# Post-V1 ICON-005 — Production / Process Visual Identity Art-Direction Pilot

**Prompt:** `POST_V1_ICON_005_PRODUCTION_PROCESS_VISUAL_IDENTITY_ART_DIRECTION_PILOT.md`  
**Date:** 2026-09-20  
**Final decision:** **OPTION A — ICON-005 ART DIRECTION PILOT READY FOR HUMAN VISUAL APPROVAL**

**Not production.** No registry, no ProductionScreen integration, no runtime paths.

---

## A. Executive Summary

At **HEAD `b5f3348`**, three **ICON-005 process primary pilots** (`recipe_planks`, `recipe_steel`, `recipe_advanced_electronics`) establish a **detailed industrial process vignette** grammar distinct from ICON-003 buildings, ICON-001 resource icons, and ICON-004 technology apparatus. Alpha **3/3 PASS**, scale/cross-family/semantic evidence boards generated. Awaiting human visual approval before any production batch.

---

## B. Repository Baseline

| Item | Value |
|------|--------|
| HEAD | `b5f33481a77546da6666880491c9c326ffdca4b3` |
| Branch | `master` |
| Unrelated churn | Present (shell, dashboard, etc.) — not absorbed |

---

## C. Authority / Sealed Tracks

ICON-001, ICON-002, ICON-003 (23/23), ICON-004 (22/22), World Slice 1, menu scenics, BR-001 — **frozen**; no changes in this slice.

---

## D. Recipe Semantic Audit

| Recipe | Player name | Inputs | Outputs | Facility (`buildingTypes`) | Safe visual cues | Forbidden inferences |
|--------|-------------|--------|---------|----------------------------|------------------|----------------------|
| `recipe_planks` | Bretter herstellen | wood ×10 | planks ×20 | sawmill | log cutting, plank stack, saw line | full sawmill building hero |
| `recipe_steel` | Stahl schmelzen | iron_ore ×5 | steel ×3 | smelter | crucible, heat, pour, ingots | smelter building duplicate |
| `recipe_advanced_electronics` | Advanced Elektronik produzieren | industrial_machinery ×1, steel ×1 | advanced_electronics ×2 | electronics_factory | precision assembly, boards, placement arms | factory exterior / fab lab |

All three **enabled** in YAML; no content drift.

---

## E. ICON-005 Semantic Role

Tier-1 **process / transformation** identity — answers “what is being manufactured?” not “where” (ICON-003) or “what stock item” alone (ICON-001).

---

## F. Proposed Visual Grammar

**Detailed industrial process vignette:** 3/4 apparatus-focused composition, active material transformation, compact platform, real alpha, no infographic input→output diagram layout, no people, no text.

---

## G. Pilot Subject Selection

Frozen per prompt: `recipe_planks`, `recipe_steel`, `recipe_advanced_electronics` — simple / heavy / precision stress test.

---

## H. recipe_planks

Wood→plank cutting apparatus; process read at 96–128 **candidate PASS** on scale board; distinct from sawmill building row on cross-family board.

---

## I. recipe_steel

Thermal metallurgical transformation; differentiated from **ICON-003 smelter** building primary on cross-family board **candidate PASS**.

---

## J. recipe_advanced_electronics

Precision assembly process; differentiated from **electronics_factory** building and **circuit_design** research **candidate PASS**.

---

## K. Alpha / Technical QA

`ICON_005_PROCESS_VISUAL_PILOT_ALPHA_REPORT.json` — **3/3 PASS**, 1024² RGBA, transparent % ~48–57%, no checkerboard suspect.

---

## L. Scale QA

`ICON_005_PROCESS_ART_DIRECTION_SCALE_BOARD.png` — 64 / 96 / 128 / 256 per pilot.

---

## M. Active Process Read

Vignettes emphasize machinery + material in transformation (not static props only) — **candidate PASS** pending human gate.

---

## N. Building-vs-Process Test

Cross-family row 0 (process) vs row 1 (matching buildings) — **candidate PASS**.

---

## O. Technology-vs-Process Test

Cross-family row 0 vs row 2 (related tech) — **candidate PASS**.

---

## P. Resource-vs-Process Test

Semantic board pairs process vs ICON-001 resource — process shows apparatus beyond single icon — **candidate PASS**.

---

## Q. Family Coherence

`ICON_005_PROCESS_ART_DIRECTION_FAMILY_BOARD.png` — shared industrial lighting/material language.

---

## R. Cross-Family Differentiation

`ICON_005_PROCESS_ART_DIRECTION_CROSS_FAMILY_BOARD.png`.

---

## S. Production Context Mock Findings

`ICON_005_PROCESS_ART_DIRECTION_PRODUCTION_CONTEXT_MOCK.png` — static composite at ~88px row height; illustrates future recipe list density (not runtime certified).

---

## T. Progression / Reward Mock

`ICON_005_PROCESS_ART_DIRECTION_PROGRESSION_BOARD.png` — early → late recipe reward sizing at 256px.

---

## U. Remaining Recipe Scalability

Holdout four (`recipe_machine_parts`, `recipe_industrial_machinery`, `recipe_consumer_goods`, `recipe_advanced_planks`) fit same grammar classes (precision metal, heavy assembly, hybrid consumer, wood upgrade) — **no grammar conflict identified**; `recipe_advanced_planks` may need differentiation from `recipe_planks` in production batch via apparatus variant not duplicate.

---

## V. Full Seven-Recipe Matrix

| Recipe | Class | Pilot? | Production active |
|--------|-------|--------|-------------------|
| recipe_planks | early wood | **YES** | no |
| recipe_advanced_planks | wood+research | holdout | no |
| recipe_steel | smelting | **YES** | no |
| recipe_machine_parts | precision metal | holdout | no |
| recipe_industrial_machinery | heavy assembly | holdout | no |
| recipe_advanced_electronics | precision electronics | **YES** | no |
| recipe_consumer_goods | hybrid assembly | holdout | no |

---

## W. Compact-Tier Decision

**Defer.** No runtime evidence that recipe rows require a separate compact tier; 64–96px primaries sufficient if human gate passes.

---

## X. Scenario-B Accounting

**3 pilot concepts** (planning only, **not** production ledger inflation). Eventual family up to **7** primaries if sealed. Envelope unchanged.

---

## Y. Firewalls

Gameplay, content, recipes, balance, ICON-001/003/004, World, ProductionScreen runtime, registry — **UNCHANGED**.

---

## Z. Repository Integrity

Task-owned: pilot masters, manifest, contract, tools, evidence PNGs, this report. **No commit/push/tag** per prompt.

---

## AA. Human Gate Package

Review order:

1. `ICON_005_PROCESS_ART_DIRECTION_FAMILY_BOARD.png`  
2. `ICON_005_PROCESS_ART_DIRECTION_CROSS_FAMILY_BOARD.png`  
3. `ICON_005_PROCESS_ART_DIRECTION_SCALE_BOARD.png`  
4. `ICON_005_PROCESS_ART_DIRECTION_PRODUCTION_CONTEXT_MOCK.png`  
5. Pilot masters under `docs/design/production/pilot-icon-005/process-primary/`

Confirm: beautiful at 256, readable at 96/128, process-not-building, three distinct, Scenario-B game feel.

---

## AB. Final Decision

**OPTION A — ICON-005 ART DIRECTION PILOT READY FOR HUMAN VISUAL APPROVAL**

---

## Root gates

| Gate | Result |
|------|--------|
| typecheck | PASS (2026-09-20) |
| lint | PASS (0 errors) |
| test | PASS (no app registry changes) |
| build:web | PASS |

---

## Asset paths

| Artifact | Path |
|----------|------|
| Manifest | `docs/design/production/pilot-icon-005/ICON_005_PROCESS_VISUAL_PILOT_MANIFEST.json` |
| Contract | `docs/design/production/PRODUCTION_PROCESS_ICON_005_VISUAL_CONTRACT.md` |
| Masters | `docs/design/production/pilot-icon-005/process-primary/ICON-005-{recipeId}-primary-pilot.png` |
| Sources | `assets/ICON-005-{recipeId}-primary-pilot-source.png` |
| Tools | `tools/process-icon-005-pilot-alpha.ts`, `tools/icon-005-pilot-evidence-boards.ts` |
