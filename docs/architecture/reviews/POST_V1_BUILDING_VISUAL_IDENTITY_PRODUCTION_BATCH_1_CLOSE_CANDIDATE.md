# Post-V1 Building Visual Identity — Production Batch 1 Close Candidate

**Date:** 2026-09-18  
**Authority:** `docs/development/Prompts/POST_V1_BUILDING_VISUAL_IDENTITY_PRODUCTION_BATCH_1.md`  
**Art direction:** B2 **APPROVED** → **ICON-003** production family

---

## A. Executive Summary

Production **Batch 1** delivers **8/8** ICON-003 primary masters (1024 PNG + alpha QA), **8/8** compact SVG glyphs, **VISUAL_ASSET_REGISTRY** entries with **ICON-002 category fallback**, reusable **`BuildingTypeIcon`**, and **BuildingsScreen** Baukatalog integration (72px primary art for covered types). Remaining **15/23** building types keep category fallback. World / ProductionScreen / gameplay / content unchanged.

**Final decision (runtime closeout):** **OPTION A — FINAL CLOSE READY** (§AN).

---

## B. Repository Baseline

| Item | Value |
|------|--------|
| Branch | `master` (local working tree) |
| B2 pilot | Closed; promoted through Batch 1 QA |
| Commit | **NONE** (per prompt) |

---

## C. Approved B2 Authority

`docs/design/buildings/BUILDING_VISUAL_IDENTITY_B2_ART_SPEC.md` — **APPROVED / PRODUCTION AUTHORITY** with Batch 1 contract delta (camera, occupancy, alpha, runtime derivatives).

---

## D. Batch Scope

| ID | DE name | Category |
|----|---------|----------|
| sawmill | Sägewerk | PRODUCTION |
| smelter | Schmelze | PRODUCTION |
| warehouse | Lagerhaus | STORAGE |
| coal_power_plant | Kohlekraftwerk | ENERGY |
| machine_shop | Maschinenwerkstatt | PRODUCTION |
| logistics_hub | Logistikzentrum | INFRASTRUCTURE |
| research_campus | Forschungscampus | RESEARCH |
| corporate_headquarters | Konzernzentrale | ADMINISTRATION |

---

## E. Production Contract Delta

See B2 art spec Batch 1 table + `docs/design/buildings/BUILDING_B2_PRODUCTION_PROMPT_TEMPLATE.md` (`b2-production-v1`).

---

## F–I. Camera / Occupancy / Lighting / Density

Frozen per template: southeast 3/4 family, ~58–72% height occupancy, upper-left light, L1/L2/L3 detail hierarchy. Family QA board: `docs/architecture/reviews/evidence/BUILDING_BATCH_1_PRIMARY_BOARD.png`.

---

## J. Alpha / Transparency Contract

Programmatic validation: `tools/building-art-alpha.ts` + `docs/design/buildings/production/batch-1/ICON_003_BATCH_1_ALPHA_REPORT.json` — **8/8 PASS** (real alpha, no baked checkerboard leak >5% neutral white).

---

## K. Final Asset Naming

| Role | Pattern |
|------|---------|
| Primary | `ICON-003-{buildingTypeId}` |
| Compact | `ICON-003-{buildingTypeId}-compact` |
| Fallback | `ICON-002-{category}` |

---

## L. Registry Architecture

`apps/web/src/presentation/assets/visual-asset-registry.ts` — `icon003RegistryEntries()` with `fallbackId` to matching ICON-002 category asset.

---

## M. BuildingType Visual Component

`apps/web/src/presentation/components/assets/BuildingTypeIcon.tsx` — resolves primary/compact via registry; **onError** → category SVG fallback.

---

## N–U. Building identities

All eight primaries under `docs/design/buildings/production/batch-1/primary/`; runtime WebP/PNG under `apps/web/public/assets/buildings/`. Research campus **regenerated** for alpha QA; sawmill/coal promoted from B2 pilot after reprocessing.

---

## V. Compact Glyphs

`docs/design/buildings/production/batch-1/compact/` — target **READABLE @ 32px** (pilot-derived + five new silhouettes). Board: `BUILDING_BATCH_1_COMPACT_BOARD.png`.

---

## W. Cross-Building Recognition

Distinct silhouettes: warehouse (wide hall bays) vs logistics_hub (cross-dock wing); machine_shop (compact workshop) vs sawmill/smelter; research (dome/glass) vs corporate HQ (tower/plaza).

---

## X. Family Consistency

QA board shows one dark-ui family; minor generative density variance remains within Batch 1 contract band.

---

## Y. Alpha Validation

See `ICON_003_BATCH_1_ALPHA_REPORT.json` — all **pass: true**.

---

## Z. Runtime Derivatives / File Sizes

Runtime catalog loads **WebP preferred** (~80–135 KB) not 1024 masters. Masters ~1.2–1.9 MB design-only.

---

## AA. BuildingsScreen Integration

Baukatalog rows include **72px `BuildingTypeIcon` primary** + existing category row (ICON-002) + text.

---

## AB. Mixed Coverage / Fallback

Batch-1 types → ICON-003; others → `BuildingTypeIcon` resolves null → **BuildingCategoryIcon**.

---

## AC. Locked-State Compatibility

Unchanged locked/canPlace semantics; art visible regardless where catalog row renders.

---

## AD. Runtime Desktop Validation

**PASS** — real **BuildingsScreen / Baukatalog** with active session.

| Item | Value |
|------|--------|
| Session | `saves/e2e-m11-phase6-production-closeout.json` via `/api/session/load` |
| Services | `@project-genesis/api` + `@project-genesis/web` dev |
| Evidence | `docs/architecture/reviews/evidence/BUILDING_BATCH_1_CATALOG_DESKTOP.png` |

Observed: multiple **ICON-003** primaries visible (e.g. Kohlekraftwerk, Konzernzentrale, Logistikzentrum, Maschinenwerkstatt) at **72px**; no checkerboard; clean alpha on dark/light row backgrounds; names/category/status readable; catalog reads as building list not admin-only glyphs.

---

## AE. Runtime Narrow Validation

**PASS** — viewport **480×900** (Playwright).

| Evidence | `docs/architecture/reviews/evidence/BUILDING_BATCH_1_CATALOG_NARROW.png` |

Observed: art remains visible; no horizontal overflow; text/status usable; mixed ICON-003 + ICON-002 rows coherent.

---

## AD-bis. Mixed Fallback Runtime Validation

**PASS**

| Evidence | `docs/architecture/reviews/evidence/BUILDING_BATCH_1_CATALOG_MIXED_FALLBACK.png` |

Observed in one viewport: **Montagehalle** / **Zufahrtsstrasse** (ICON-002-style fallback glyphs) alongside **Kohlekraftwerk** (**ICON-003** primary). No broken-image icon; aligned rows; intentional staged rollout appearance.

---

## Locked-state evidence

**NOT OBSERVED IN REPRESENTATIVE RUNTIME STATE** for a dedicated `BUILDING_BATCH_1_CATALOG_LOCKED.png`. Unavailable catalog entries show existing milestone/reason text (e.g. „Meilenstein … fehlt“) without fabricated lock UX. Semantics covered by existing BuildingsScreen tests.

---

## AF–AK. Accessibility / Tests / Firewalls

Names/category text remain authoritative; decorative art `aria-hidden`. **typecheck PASS**, **build:web PASS**, focused **vitest PASS** (BuildingsScreen, BuildingTypeIcon, registry, asset IDs). No gameplay/content/World changes.

---

## AL. Repository Integrity

Task-owned: `docs/design/buildings/production/batch-1/**`, ICON-003 registry/component, BuildingsScreen/CSS, tools `building-art-alpha.ts`, `process-icon-003-batch-1.ts`, evidence boards, inventory/spec updates, this report.

---

## AM. Definition of Done

| Criterion | Status |
|-----------|--------|
| 8 primaries + alpha | ✅ |
| 8 compacts @ 32px | ✅ |
| Registry + component | ✅ |
| BuildingsScreen 8 types | ✅ |
| 15 fallback | ✅ |
| Real desktop catalog runtime | ✅ |
| Real mixed-fallback runtime | ✅ |
| Real narrow catalog runtime | ✅ |
| Gates (typecheck/build/tests) | ✅ (closeout: typecheck + focused tests rerun) |
| Durable art + runtime evidence | ✅ |

---

## AM-bis. Runtime Visual Honesty (manual inspect)

1. **72px usefulness:** **YES** — primaries materially change catalog recognition vs category-only rows.  
2. **Family in dark UI:** **YES** — shared isometric industrial read among visible Batch-1 assets.  
3. **Camera/occupancy outliers:** **Minor** — acceptable within Batch-1 contract; no blocking mismatch.  
4. **Alpha/checkerboard/halo:** **NO material defect** observed in runtime captures.  
5. **Mixed coverage staged:** **YES** — fallback glyphs adjacent to ICON-003 without broken slots.  
6. **Game-object identity:** **YES** — catalog materially more game-like.  
7. **Narrow usability:** **YES** — usable layout at 480px width.

---

## AN. Final Decision

**OPTION A — BUILDING VISUAL IDENTITY PRODUCTION BATCH 1 FINAL CLOSE READY**

---

## Closeout fixes (2026-09-18)

- `BuildingTypeIcon`: optional `loading` prop; catalog uses **`loading="eager"`** to avoid lazy-load grey slots in long Baukatalog lists.  
- `tools/capture-batch-1-runtime-evidence.mjs`: Playwright capture helper (session load + image readiness waits).

---

## Required Asset Matrix

| Building | Primary ID | Master | Runtime | Compact | Alpha | 32px | Registry | Runtime consumer |
|----------|------------|--------|---------|---------|-------|------|----------|------------------|
| sawmill | ICON-003-sawmill | batch-1/primary | webp/png | compact svg | PASS | READABLE | ✅ | BuildingsScreen |
| smelter | ICON-003-smelter | ✓ | ✓ | ✓ | PASS | READABLE | ✅ | BuildingsScreen |
| warehouse | ICON-003-warehouse | ✓ | ✓ | ✓ | PASS | READABLE | ✅ | BuildingsScreen |
| coal_power_plant | ICON-003-coal_power_plant | ✓ | ✓ | ✓ | PASS | READABLE | ✅ | BuildingsScreen |
| machine_shop | ICON-003-machine_shop | ✓ | ✓ | ✓ | PASS | READABLE | ✅ | BuildingsScreen |
| logistics_hub | ICON-003-logistics_hub | ✓ | ✓ | ✓ | PASS | READABLE | ✅ | BuildingsScreen |
| research_campus | ICON-003-research_campus | ✓ | ✓ | ✓ | PASS | READABLE | ✅ | BuildingsScreen |
| corporate_headquarters | ICON-003-corporate_headquarters | ✓ | ✓ | ✓ | PASS | READABLE | ✅ | BuildingsScreen |

---

## Required Alpha Matrix

All entries: **1024×1024**, **alpha present**, **transparent ≥15%**, **background leak ≤5%**, **PASS** — see JSON report.
