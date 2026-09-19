# Post-V1 Building Visual Identity — Production Batch 2 Close Candidate

**Date:** 2026-09-18  
**Authority:** `docs/development/Prompts/POST_V1_BUILDING_VISUAL_IDENTITY_PRODUCTION_BATCH_2.md`  
**Art direction:** B2 **APPROVED** → **ICON-003** (unchanged)

---

## A. Executive Summary

Production **Batch 2** adds **8/8** ICON-003 primaries + compacts for normal volumetric building types, extends registry/`BuildingTypeIcon`/BuildingsScreen coverage to **16/23**, defers **3** special infrastructure types, leaves **4** normal types on ICON-002 fallback. Cross-batch family boards and real BuildingsScreen runtime evidence captured. Batch 1 assets untouched.

**Final decision:** **OPTION A — CLOSE CANDIDATE READY** (§AG).

---

## B. Repository Baseline

| Item | Value |
|------|--------|
| Branch | `master` (local working tree) |
| Batch 1 | Sealed @ `793a4aa` |
| Commit | **NONE** (per prompt) |

---

## C. Sealed Batch-1 Authority

No Batch-1 PNG/SVG regeneration. Registry entries retain `batch-1` design paths.

---

## D. Remaining Building Inventory (post Batch 1)

15 building types not in Batch 1.

---

## E. Normal / Special / Ambiguous Classification

| Class | Count |
|-------|------:|
| NORMAL_B2 | 12 |
| SPECIAL_INFRASTRUCTURE | 3 |
| AMBIGUOUS | 0 |

---

## F. Batch-2 Selection (8)

| ID | DE name | Category | Reason |
|----|---------|----------|--------|
| assembly_plant | Montagehalle | PRODUCTION | Core chain visibility; distinct hall + crane |
| headquarters | Firmenzentrale | ADMINISTRATION | Starter/admin identity |
| electronics_factory | Elektronikfabrik | PRODUCTION | High-tech silhouette vs machine_shop |
| consumer_goods_plant | Konsumgüterwerk | PRODUCTION | End-market production identity |
| solar_power_plant | Solarkraftwerk | ENERGY | Renewable counterpart to coal |
| distribution_center | Verteilzentrum | STORAGE | Cross-dock vs warehouse |
| university | Universitaet | RESEARCH | Formal campus vs research_campus |
| power_substation | Umspannwerk | ENERGY | Early-grid energy distribution |

**Not selected (normal, deferred to Batch 3+):** maintenance_facility, recycling_facility, regional_headquarters, training_center.

---

## G. Authoritative Content Evidence

YAML under `game-content/buildings/` — names/descriptions/categories only; no content edits.

---

## H. Frozen B2 Contract

`b2-production-v1` + `BUILDING_VISUAL_IDENTITY_B2_ART_SPEC.md` — camera, occupancy, lighting, alpha policy unchanged.

---

## I. Generation Template / Method

`BUILDING_B2_PRODUCTION_PROMPT_TEMPLATE.md`; Batch-1 family references for generation; post-process `tools/process-icon-003-batch-2.ts`.

**Alpha tooling delta:** edge flood now removes edge-connected **near-black** studio backdrops (generated sources) without changing Batch-1 light-backdrop behavior materially.

---

## J. Batch-2 Primary Assets

Masters: `docs/design/buildings/production/batch-2/primary/ICON-003-{id}.png`  
Runtime: `apps/web/public/assets/buildings/ICON-003-{id}.webp` (+ PNG + compact SVG)

---

## K. Compact Derivatives

`docs/design/buildings/production/batch-2/compact/` — hand-derived 48×48 SVGs, **READABLE @32px** (inspected on family board).

---

## L. Alpha Validation

`docs/design/buildings/production/batch-2/ICON_003_BATCH_2_ALPHA_REPORT.json` — **8/8 PASS**.

---

## M. Cross-Batch Family QA

`docs/architecture/reviews/evidence/BUILDING_BATCH_1_2_PRIMARY_FAMILY_BOARD.png` — Batch 1 + 2 primaries, shared dark board, consistent scale.

---

## N. Cross-Building Recognition

Batch-2 silhouettes distinct from Batch-1 peers (e.g. university vs research_campus; distribution_center vs warehouse; solar vs coal; assembly vs sawmill).

---

## O. Same-Category Differentiation

Production: electronics vs consumer vs assembly vs existing sawmill/smelter/machine_shop. Energy: solar + substation vs coal. Storage: distribution vs warehouse. Admin: headquarters vs corporate HQ. Research: university vs campus.

---

## P. Registry Integration

`visual-asset-registry.ts` — unified `ICON_003_PRODUCTION_BUILDINGS` with per-batch `designSource` paths; ICON-002 fallback preserved.

---

## Q. BuildingTypeIcon Reuse

No fork; `building-type-visual-asset-ids.ts` exposes Batch 1 + Batch 2 via `ICON_003_PRODUCTION_BUILDING_TYPE_IDS`.

---

## R. BuildingsScreen Integration

Registry-driven; 72px catalog art unchanged; eager loading unchanged.

---

## S. Coverage After Batch 2

| Metric | Value |
|--------|------:|
| TOTAL BUILDING TYPES | 23 |
| BATCH 1 ICON-003 | 8 |
| BATCH 2 ICON-003 | 8 |
| TOTAL ICON-003 | 16 |
| REMAINING FALLBACK | 7 |
| SPECIAL INFRASTRUCTURE (deferred) | 3 |
| NORMAL not yet in ICON-003 | 4 |

---

## T. Remaining Fallback

ICON-002 category icons: maintenance_facility, recycling_facility, regional_headquarters, training_center, plus access_road, port, rail_terminal (special).

---

## U. Runtime Desktop Validation

**PASS** — `docs/architecture/reviews/evidence/BUILDING_BATCH_2_CATALOG_DESKTOP.png`  
Session: load `saves/e2e-m11-phase6-production-closeout.json` (fallback `session/new`); web `http://localhost:3011` (clean prod after `.next` rebuild); real `/game?screen=buildings`.

---

## V. Runtime Mixed-Fallback Validation

**PASS** — `docs/architecture/reviews/evidence/BUILDING_BATCH_2_CATALOG_MIXED_FALLBACK.png`  
Montagehalle (ICON-003 assembly_plant) + Hafenanlage (ICON-002 infrastructure fallback).

---

## W. Runtime Narrow Validation

**PASS** — `docs/architecture/reviews/evidence/BUILDING_BATCH_2_CATALOG_NARROW.png` (480×900).

---

## X. Runtime Visual Honesty

1. Same family as Batch 1? **Yes** (minor generative variance within band).  
2. Camera outliers? **None material**.  
3. Density outliers? **None material**.  
4. Recognizable without labels? **Yes**.  
5. Same-category distinct? **Yes**.  
6. Alpha clean on dark UI? **Yes**.  
7. Fallback coexistence? **Yes**.  
8. Narrow usable? **Yes**.

---

## Y. Loading / Performance Observation

No new lazy-load grey slots; catalog eager load unchanged; no measured regression.

---

## Z. Tests / Gates

| Gate | Result |
|------|--------|
| typecheck | PASS (final gate restore 2026-09-19) |
| test | PASS (974) |
| build:web | PASS |
| lint (root) | PASS (0 errors; 73 pre-existing warnings) |
| alpha validation | PASS 8/8 |

**Lint gate restore (2026-09-19):** Root `pnpm lint` failed on `no-undef` in building runtime evidence scripts. **Cause:** ESLint flat config does not apply browser globals to `page.waitForFunction()` bodies referencing `document` / `HTMLImageElement`; Batch-2 script also referenced `console`, `process`, `fetch` without declarations. **Ownership:** Building Visual Identity evidence tooling — `tools/capture-batch-1-runtime-evidence.mjs` shipped in sealed Batch-1 commit `793a4aa` with the same pattern; duplicate `tools/capture-evidence-tmp/run.mjs`; Batch-2 `tools/capture-batch-2-runtime-evidence.mjs` partially fixed earlier. **Repair:** Added file-level `/* global … */` declarations (semantics-neutral); no capture logic changes. **Typecheck note:** `tools/process-icon-003-batch-{1,2}.ts` imports updated from `./building-art-alpha.ts` → `./building-art-alpha.js` (NodeNext-compatible; runtime unchanged under `tsx`).

---

## AA. Inventory Update

`docs/design/GAME_ART_VISUAL_CONTENT_MASTER_INVENTORY.md` — Batch-2 types **ACTIVE (Batch 2)**; special infra marked deferred.

---

## AB. Scenario B Accounting

| Item | Count |
|------|------:|
| New authored primaries (Batch 2) | 8 |
| New derived compacts | 8 |
| Cumulative building primaries (ICON-003) | 16 |
| Global 380–520 + ~12 target | UNCHANGED |

---

## AC. Special-Infrastructure Handover

| ID | Name | Class | Reason |
|----|------|-------|--------|
| access_road | Zufahrtsstrasse | LINEAR | Connects plot to network — not hall-on-pad |
| port | Hafenanlage | TERMINAL/YARD | Seaport import/export — yard/terminal grammar |
| rail_terminal | Bahnterminal | TERMINAL/YARD | Rail network attachment — not volumetric hall |

---

## AD. Gameplay / Content / World Firewalls

**NONE** — no YAML, simulation, World, or ProductionScreen changes.

---

## AE. Repository Integrity

Task-owned: batch-2 design/runtime assets, registry/ids/tests, tools (`process-icon-003-batch-2.ts`, `building-batch-1-2-evidence-boards.ts`, `capture-batch-2-runtime-evidence.mjs`, `building-art-alpha.ts` dark-edge), evidence PNGs, this report, inventory.  
Pre-existing unrelated local modifications remain unstaged.

---

## AF. Definition of Done

| Item | Status |
|------|--------|
| 8/8 Batch-2 primaries | PASS |
| 8/8 alpha | PASS |
| 8/8 compacts @32px | PASS |
| Registry / BuildingTypeIcon / BuildingsScreen | PASS |
| Batch-1 regression | PASS (unchanged) |
| Cross-batch family boards | PASS |
| Real desktop / mixed / narrow runtime | PASS |
| Inventory / manifest | PASS |
| Root gates (typecheck / lint / test / build:web) | PASS (final gate restore) |
| commit/push/tag | NONE |

---

## AG. Final Decision

**OPTION A — BUILDING VISUAL IDENTITY PRODUCTION BATCH 2 FINAL CLOSE READY**

---

## Required Selection Matrix (remaining 15)

| Remaining ID | Name | Category | Visual Class | Batch 2? | Reason |
|--------------|------|----------|--------------|----------|--------|
| assembly_plant | Montagehalle | PRODUCTION | NORMAL_B2 | **YES** | Selected — core production |
| headquarters | Firmenzentrale | ADMINISTRATION | NORMAL_B2 | **YES** | Selected — starter HQ |
| electronics_factory | Elektronikfabrik | PRODUCTION | NORMAL_B2 | **YES** | Selected |
| consumer_goods_plant | Konsumgüterwerk | PRODUCTION | NORMAL_B2 | **YES** | Selected |
| solar_power_plant | Solarkraftwerk | ENERGY | NORMAL_B2 | **YES** | Selected |
| distribution_center | Verteilzentrum | STORAGE | NORMAL_B2 | **YES** | Selected |
| university | Universitaet | RESEARCH | NORMAL_B2 | **YES** | Selected |
| power_substation | Umspannwerk | ENERGY | NORMAL_B2 | **YES** | Selected |
| maintenance_facility | Wartungswerk | INFRASTRUCTURE | NORMAL_B2 | no | Deferred — next normal batch |
| recycling_facility | Recyclinganlage | INFRASTRUCTURE | NORMAL_B2 | no | Deferred |
| regional_headquarters | Regionalzentrale | ADMINISTRATION | NORMAL_B2 | no | Deferred |
| training_center | Ausbildungszentrum | ADMINISTRATION | NORMAL_B2 | no | Deferred |
| access_road | Zufahrtsstrasse | INFRASTRUCTURE | SPECIAL_INFRASTRUCTURE | no | Linear infra contract |
| port | Hafenanlage | INFRASTRUCTURE | SPECIAL_INFRASTRUCTURE | no | Terminal/yard |
| rail_terminal | Bahnterminal | INFRASTRUCTURE | SPECIAL_INFRASTRUCTURE | no | Terminal/yard |

---

## Required Asset Matrix (Batch 2)

| Building | Primary ID | Master | Runtime | Compact | Alpha | 32px | Registry | Runtime |
|----------|------------|--------|---------|---------|-------|------|----------|---------|
| assembly_plant | ICON-003-assembly_plant | batch-2/primary | webp+png | svg | PASS | PASS | PASS | PASS |
| headquarters | ICON-003-headquarters | batch-2/primary | webp+png | svg | PASS | PASS | PASS | PASS |
| electronics_factory | ICON-003-electronics_factory | batch-2/primary | webp+png | svg | PASS | PASS | PASS | PASS |
| consumer_goods_plant | ICON-003-consumer_goods_plant | batch-2/primary | webp+png | svg | PASS | PASS | PASS | PASS |
| solar_power_plant | ICON-003-solar_power_plant | batch-2/primary | webp+png | svg | PASS | PASS | PASS | PASS |
| distribution_center | ICON-003-distribution_center | batch-2/primary | webp+png | svg | PASS | PASS | PASS | PASS |
| university | ICON-003-university | batch-2/primary | webp+png | svg | PASS | PASS | PASS | PASS |
| power_substation | ICON-003-power_substation | batch-2/primary | webp+png | svg | PASS | PASS | PASS | PASS |

---

## Required Cross-Batch QA Matrix (summary)

All Batch-2 buildings: Camera **PASS**, Occupancy **PASS**, Light **PASS**, Density **PASS**, Silhouette **PASS**, Function **PASS**, Batch-1 Match **PASS**.

---

## Required Alpha Matrix

All eight: 1024×1024, real alpha, transparent pixels present, background clean, no checkerboard leak, **PASS** (see JSON report).

---

## Evidence Index

- `BUILDING_BATCH_1_2_PRIMARY_FAMILY_BOARD.png`
- `BUILDING_BATCH_1_2_COMPACT_FAMILY_BOARD.png`
- `BUILDING_BATCH_2_CATALOG_DESKTOP.png`
- `BUILDING_BATCH_2_CATALOG_MIXED_FALLBACK.png`
- `BUILDING_BATCH_2_CATALOG_NARROW.png`
