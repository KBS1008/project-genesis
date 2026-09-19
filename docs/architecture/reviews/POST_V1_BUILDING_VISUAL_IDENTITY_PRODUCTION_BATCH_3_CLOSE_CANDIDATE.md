# Post-V1 Building Visual Identity — Production Batch 3 Close Candidate

**Date:** 2026-09-19  
**Authority:** `docs/development/Prompts/POST_V1_BUILDING_VISUAL_IDENTITY_PRODUCTION_BATCH_3.md`  
**Baseline HEAD:** `3a5dd61` (Batch 2 sealed on `master`)

---

## A. Executive Summary

Final **normal B2** batch adds **4/4** ICON-003 primaries + compacts (`maintenance_facility`, `recycling_facility`, `regional_headquarters`, `training_center`). Total ICON-003 coverage **20/23**; **3** special infrastructure types remain on ICON-002 fallback by design. Batch 1/2 unchanged.

**Final decision:** **OPTION A — FINAL NORMAL-BUILDING CLOSE CANDIDATE READY** (§AF).

---

## B. Repository Baseline

| Item | Value |
|------|--------|
| Branch | `master` (local) |
| Commit | **NONE** (per prompt) |

---

## C. Sealed Batch-1 / Batch-2 Authority

No regeneration or registry path changes for sealed batches.

---

## D. Exact Batch-3 Scope

| ID | DE name | Category |
|----|---------|----------|
| maintenance_facility | Wartungswerk | INFRASTRUCTURE |
| recycling_facility | Recyclinganlage | INFRASTRUCTURE |
| regional_headquarters | Regionalzentrale | ADMINISTRATION |
| training_center | Ausbildungszentrum | ADMINISTRATION |

---

## E. Authoritative Content Evidence

YAML under `game-content/buildings/` — read-only; 3×3 footprints where defined; no content edits.

---

## F. Frozen B2 Contract

`b2-production-v1`; alpha via `tools/building-art-alpha.js` (incl. near-black edge flood).

---

## G–J. Assets & Compacts

Masters: `docs/design/buildings/production/batch-3/primary/`  
Runtime: `apps/web/public/assets/buildings/` (WebP + PNG + compact SVG)  
Compacts: `batch-3/compact/` — **READABLE @32px** on family board.

---

## K. Alpha Validation

`ICON_003_BATCH_3_ALPHA_REPORT.json` — **4/4 PASS**.

---

## L–M. 20-Asset Family QA

- `BUILDING_BATCH_1_2_3_PRIMARY_FAMILY_BOARD.png` — **PASS WITH MINOR NON-BLOCKING VARIANCE**
- `BUILDING_BATCH_1_2_3_COMPACT_FAMILY_BOARD.png` — **PASS**

---

## N. Cross-Building Differentiation

| New | Peers | Result |
|-----|-------|--------|
| maintenance_facility | machine_shop / assembly_plant | PASS — service bays/crane vs production hall |
| recycling_facility | smelter / distribution_center | PASS — sorting/conveyor vs furnace/ cross-dock |
| regional_headquarters | headquarters / corporate_headquarters | PASS — winged campus vs starter office vs tower HQ |
| training_center | university / research_campus | PASS — vocational halls vs classical campus vs research glass |

---

## O–Q. Registry / BuildingTypeIcon / BuildingsScreen

Extended `ICON_003_PRODUCTION_BUILDING_TYPE_IDS` (20) and registry `batch-3` design paths; catalog remains registry-driven with eager load unchanged.

---

## R. Runtime Asset Resolution

All four Batch-3 types resolve ICON-003 → runtime WebP; `port`, `access_road`, `rail_terminal` → ICON-002 only (no broken ICON-003 refs).

---

## S–U. Runtime Validation

| Evidence | Result |
|----------|--------|
| `BUILDING_BATCH_3_CATALOG_DESKTOP.png` | PASS |
| `BUILDING_BATCH_3_CATALOG_MIXED_INFRA_FALLBACK.png` | PASS (Wartungswerk + Hafenanlage) |
| `BUILDING_BATCH_3_CATALOG_NARROW.png` | PASS |

Session: `saves/e2e-m11-phase6-production-closeout.json`; prod web `http://localhost:3012` after `build:web`.

---

## V. Runtime Visual Honesty

1. Four Batch-3 primaries load in catalog — **YES**  
2. Gray covered slots on ICON-003 types — **NO**  
3. Only intentional fallbacks: access_road, port, rail_terminal — **YES**  
4. Batch 1+2+3 one family — **YES**  
5–8. Differentiation questions — **YES** (see §N)  
9. Alpha on dark UI — **YES**  
10. Narrow usable — **YES**  
11. 20/23 coherent with 3 infra fallbacks — **YES**

---

## W. Loading / Performance

No material regression; eager catalog loading unchanged.

---

## X. Coverage After Batch 3

| Metric | Count |
|--------|------:|
| TOTAL | 23 |
| BATCH 1 | 8 |
| BATCH 2 | 8 |
| BATCH 3 | 4 |
| TOTAL ICON-003 | 20 |
| NORMAL_B2 remaining | 0 |
| SPECIAL_INFRASTRUCTURE | 3 |
| ICON-002 fallback | 3 |

---

## Y. Remaining Special Infrastructure

`access_road` (LINEAR), `port` (TERMINAL/YARD), `rail_terminal` (TERMINAL/YARD) — deferred to **Infrastructure Visual Contract Extension**.

---

## Z. Tests / Technical Gates

| Gate | Result |
|------|--------|
| typecheck | PASS |
| lint | PASS (0 errors) |
| test | PASS (976) |
| build:web | PASS |
| alpha | 4/4 PASS |

---

## AA. Inventory / Manifest

`GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md` updated; `ICON_003_BATCH_3_MANIFEST.json`.

---

## AB. Scenario B Accounting

+4 primaries, +4 compacts → **20** cumulative building primaries; global 380–520 + ~12 unchanged.

---

## AC. Firewalls

Gameplay, content, World, ProductionScreen, player guidance, deployment — **NONE**.

---

## AD. Repository Integrity

Task-owned: batch-3 design/runtime assets, registry/ids/tests, tooling, evidence, report, inventory. Unrelated working-tree churn excluded.

---

## AE. Definition of Done

All Batch-3 DoD items **PASS**; root gates **PASS**.

---

## AF. Final Decision

**OPTION A — BUILDING VISUAL IDENTITY PRODUCTION BATCH 3 FINAL NORMAL-BUILDING CLOSE CANDIDATE READY**

---

## Required Asset Matrix

| Building | Primary | Master | Runtime | Compact | Alpha | 32px | Registry | Real Runtime |
|----------|---------|--------|---------|---------|-------|------|----------|--------------|
| maintenance_facility | ICON-003-maintenance_facility | batch-3 | webp | svg | PASS | PASS | PASS | PASS |
| recycling_facility | ICON-003-recycling_facility | batch-3 | webp | svg | PASS | PASS | PASS | PASS |
| regional_headquarters | ICON-003-regional_headquarters | batch-3 | webp | svg | PASS | PASS | PASS | PASS |
| training_center | ICON-003-training_center | batch-3 | webp | svg | PASS | PASS | PASS | PASS |
