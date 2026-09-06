# POST-V1 ICON-002 Phase 1C — Certification & Runtime Readiness Report

**Project:** Project Genesis  
**Date:** 2026-09-06  
**Slice:** ICON-002 Phase 1C — Certification, ingestion, runtime readiness (no consumer integration)  
**HEAD (start):** `5285214812e543b4cff4fa39645a19b59c6fbc0b`

---

## A. Executive Summary

ICON-002 Phase 1C delivers **certified, ingested, runtime-ready** building category icons for all six `BuildingCategory` values without integrating any UI consumer.

| Item | Result |
|------|--------|
| Source SVG certification | **PASS** — all six masters |
| Geometry integrity | **PASS** — byte-identical ingest; no visual delta |
| Runtime delivery | **Inline SVG markup** + **public SVG copies** + registry |
| `currentColor` theming | **PASS** — inline SVG via `BuildingCategoryIcon`; no themed `<img>` |
| BuildingCategory mapping | **PASS** — six explicit mappings; unknown → null |
| Consumer integration | **NONE** (Phase 1D deferred) |
| Tests | **19 targeted tests PASS** |
| `build:web` | **PASS** |

**Final decision:** **OPTION A — PHASE 1C CLOSED / PASS**

---

## B. Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD (start) | `5285214812e543b4cff4fa39645a19b59c6fbc0b` |
| `origin/master` | Up to date at start |
| Unrelated dirty work | Preserved (M11/M12 docs, design churn, prompts, saves) |

---

## C. V1 / ICON-001 Integrity

| Tag / check | Result |
|-------------|--------|
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` ✓ |
| Tags moved | **NO** |
| ICON-001 Phase 1 | **CLOSED / PASS** — no source/registry/mapping changes |
| ICON-001 runtime | Re-synced by shared sync script (unchanged PNG/WebP pipeline); no artwork edits |
| Market work | **NONE** |

---

## D. Approved Asset Input

Six externally approved SVG masters (Phase 1B):

| Design source | Category |
|---------------|----------|
| `ICON-002_Production.svg` | PRODUCTION |
| `ICON-002_Energy.svg` | ENERGY |
| `ICON-002_Storage.svg` | STORAGE |
| `ICON-002_Infrastructure.svg` | INFRASTRUCTURE |
| `ICON-002_Administration.svg` | ADMINISTRATION |
| `ICON-002_Research.svg` | RESEARCH |

Visual redesign performed: **NO**

---

## E. Source Asset Ingest

Canonical location: `docs/design/icons/`

All six approved masters ingested with exact filenames. No `_v2`, `_final`, or duplicate variants created.

---

## F. SVG Certification

Programmatic certification via `certifyIcon002Svg()` — all six **PASS**:

| Check | Result |
|-------|--------|
| Valid SVG root | ✓ |
| viewBox `0 0 24 24` | ✓ |
| `stroke="currentColor"` | ✓ |
| `stroke-width="1.75"` | ✓ |
| `fill="none"` | ✓ |
| round caps/joins | ✓ |
| no text/image/raster/base64 | ✓ |
| no scripts/filters/animation/external URLs | ✓ |
| no fixed palette colors | ✓ |

---

## G. Geometry Integrity

| Item | Result |
|------|--------|
| Source geometry changed | **NO** |
| Sanitation performed | **NO** — files preserved byte-for-byte |
| Inline runtime constants | Byte-identical to design sources (test-verified) |
| Runtime public copies | Byte-identical to design sources (test-verified) |

**Outcome:** APPROVED SVG MASTERS INGESTED WITHOUT VISUAL DELTA

---

## H. Runtime Delivery Architecture

**Chosen representation:** **Hybrid B + registry**

1. **Inline SVG markup** (`ICON_002_CERTIFIED_SVG_BY_ASSET_ID`) rendered by thin `BuildingCategoryIcon` component — preserves `currentColor`.
2. **Public runtime SVG copies** at `/assets/icons/ICON-002-{category}.svg` — byte-identical sync for traceability and registry paths.
3. **Visual asset registry** — six `runtime` entries, `format: 'svg'`, `webp: null`.

**Rejected:** `<img src="…svg">` for themed rendering — does not inherit CSS `color` into SVG stroke.

**New framework introduced:** **NO**

---

## I. `currentColor` Resolution

| Item | Detail |
|------|--------|
| Problem | External SVG via `<img>` cannot inherit theme color |
| Solution | Inline approved SVG markup inside `BuildingCategoryIcon` |
| Proof | `BuildingCategoryIcon.test.tsx` — asserts `stroke="currentColor"` and computed `color` inherits from parent (`rgb(255, 0, 0)`) |
| `<img>` for themed SVG | **NO** |

---

## J. Registry Decision

**YES** — six entries added to `visual-asset-registry.ts`:

| Asset ID | Path | Format |
|----------|------|--------|
| `ICON-002-production` | `/assets/icons/ICON-002-production.svg` | svg |
| `ICON-002-energy` | `/assets/icons/ICON-002-energy.svg` | svg |
| `ICON-002-storage` | `/assets/icons/ICON-002-storage.svg` | svg |
| `ICON-002-infrastructure` | `/assets/icons/ICON-002-infrastructure.svg` | svg |
| `ICON-002-administration` | `/assets/icons/ICON-002-administration.svg` | svg |
| `ICON-002-research` | `/assets/icons/ICON-002-research.svg` | svg |

Component reference: `BuildingCategoryIcon` (not yet used in screens).

---

## K. BuildingCategory Mapping

Mapping module: `building-category-icon-asset-ids.ts`

| BuildingCategory | Asset ID |
|------------------|----------|
| PRODUCTION | `ICON-002-production` |
| ENERGY | `ICON-002-energy` |
| STORAGE | `ICON-002-storage` |
| INFRASTRUCTURE | `ICON-002-infrastructure` |
| ADMINISTRATION | `ICON-002-administration` |
| RESEARCH | `ICON-002-research` |

**Unknown / future category / invalid value:** returns `null` — no incorrect fallback glyph.

Domain enum verified in `src/content/building/BuildingTypeDefinition.ts` — matches all six mappings.

---

## L. Sync Pipeline

Extended `tools/sync-runtime-visual-assets.ts` with `ICON_002_RUNTIME_ASSETS` — **byte-for-byte SVG copy** to `apps/web/public/assets/icons/`.

| Item | Value |
|------|-------|
| PNG derivatives | **0** |
| WebP derivatives | **0** |
| ICON-001 behavior | Unchanged (PNG/WebP resize pipeline) |

Command: `pnpm sync-visual-assets`

---

## M. Accessibility Readiness

`BuildingCategoryIcon` renders with `aria-hidden="true"` on wrapper; SVG root also carries `aria-hidden="true"` from approved source.

Future consumer contract: decorative icon beside authoritative visible text — prepared, not integrated.

---

## N. Tests

| Suite | Tests |
|-------|------:|
| `icon-002-svg-certification.test.ts` | 4 |
| `building-category-icon-asset-ids.test.ts` | 4 |
| `BuildingCategoryIcon.test.tsx` | 3 |
| `visual-asset-registry.test.ts` (ICON-002 delta) | 8 total (1 new block) |
| **Total targeted** | **19 PASS** |

Coverage: certification, source/runtime byte identity, mapping, unknown behavior, registry entries, currentColor, no raster derivatives, no `<img>` fallback.

---

## O. Build / Validation

| Command | Result |
|---------|--------|
| Targeted vitest | **PASS** (19/19) |
| `pnpm sync-visual-assets` | **PASS** |
| `pnpm build:web` | **PASS** |

No new build failures. Pre-existing ESLint warnings in unrelated files only.

---

## P. Asset Hashes

SHA-256 (source = runtime = inline constants):

| Asset | SHA-256 |
|-------|---------|
| Production (`ICON-002_Production.svg`) | `00855f23ab805a9cffaa6ce1c8e675f2f17c38f3d48b853294fb7e1779aef1e3` |
| Energy | `b842d1259bef710ba10e94908c368ba5435cc4d556465e71a190a55d49ee5121` |
| Storage | `1052ede34e27cce7e539a7f6fd918d75471c3a54800437e55bc5a9f9d86a1c5f` |
| Infrastructure | `9861761fee7356a5f2f2d3fbc48a07d59b37168287877061b7ebfca87ebf96f7` |
| Administration | `8cb5c8badc4fffd74629cde7c0d9ae7a016ede1e5a0ab25681de2c6c3c4f3d98` |
| Research | `9c33e31373c59395b0d9204a1ae1f7fa6fcef845565c677bf1fbc1091fcf06ab` |

---

## Q. Scope Verification

| Area | Changed |
|------|:-------:|
| BuildingsScreen / Baukatalog | **NO** |
| ProductionScreen | **NO** |
| Operations tables / PGCompanyWidget | **NO** |
| PGWorldCanvas | **NO** |
| Domain / game-content YAML | **NO** |
| Gameplay / API | **NO** |
| ICON-001 source/runtime art | **NO edits** (sync-only refresh) |
| Market | **NO** |
| Lifecycle catalog/backlog/changelog | **NO** |

---

## R. Remaining Phase-1D Decisions

| Item | Notes |
|------|-------|
| First consumer | `BuildingsScreen` Baukatalog (per art brief) |
| Layout work | Add icon slot beside hint copy; optional localized category labels |
| Accessibility integration | Decorative icon beside `entry.name` |
| Visual runtime gate | Screenshot evidence after consumer integration |
| Registry URL usage | Phase 1D may use `BuildingCategoryIcon` only; public SVG paths for audit/sync |

---

## S. Final Decision

# **OPTION A — PHASE 1C CLOSED / PASS**

All gates satisfied. Phase 1D (first consumer integration) remains a separate reviewed slice.

---

*End of ICON-002 Phase 1C report.*
