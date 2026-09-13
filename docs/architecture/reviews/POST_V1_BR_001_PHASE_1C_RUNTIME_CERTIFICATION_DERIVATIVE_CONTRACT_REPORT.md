# POST-V1 BR-001 Phase 1C — Runtime Certification & Derivative Contract Report

**Project:** Project Genesis  
**Date:** 2026-09-13  
**Slice:** BR-001 Phase 1C — Runtime certification, derivative contract, registry migration (no consumer integration)  
**HEAD (implementation):** `f512ac7642171d1708c6a6fe143ca922e4e9cc94`  
**Report revision:** 2026-09-13 — favicon contract documentation delta (doc-only; no implementation change)

---

## A. Executive Summary

Phase 1C certifies the sealed Phase-1B SVG master for runtime delivery, removes the historical **BR-001 → MM-006** placeholder, and establishes a deterministic sync + registry contract. **MainMenuHome**, **SplashScreen**, and **layout.tsx** favicon metadata were **not** modified.

| Item | Result |
|------|--------|
| Sealed source gate | **PASS** — SHA-256 unchanged |
| Runtime SVG copy | **PRODUCED / CERTIFIED** — byte-identical; required for planned brand consumer |
| Registry migration | **UPDATED** — `/assets/branding/BR-001.svg`, `format: svg` |
| MM-006 alias | **REMOVED** |
| Sync tooling | **UPDATED** — BR-001 block in `tools/sync-runtime-visual-assets.ts` |
| Favicon PNG 16 / 32 | **PRODUCED / CERTIFIED DERIVATIVE — consumer wiring decision deferred to Phase 1D** |
| Menu PNG/WebP brand | **NOT REQUIRED** — vector-first registry path |
| Consumer integration | **NONE** |
| Focused tests | **13 PASS** (registry + BR-001 certification) |
| `build:web` | **PRE-EXISTING FAILURE** — `EPERM` on `apps/web/.next/trace` (environment) |

**Phase 1C status:** **BR-001 PHASE 1C — CLOSED / PASS**

| Contract layer | Status |
|----------------|--------|
| Runtime SVG contract | **SEALED** |
| Favicon derivative generation | **CERTIFIED** (16×16 and 32×32 PNG candidates exist, hashed, dimension-validated) |
| Final favicon consumer wiring | **DEFERRED TO PHASE 1D** |
| MainMenuHome integration | **DEFERRED TO PHASE 1D** |

**Final decision:** **OPTION A — BR-001 PHASE 1C RUNTIME CERTIFICATION — PASS / READY FOR CONSUMER INTEGRATION**

Phase 1D remains outstanding; **BR-001 Phase 1** is not globally closed.

---

## B. Repository Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD | `f512ac7642171d1708c6a6fe143ca922e4e9cc94` |
| `origin/master` | `730ed190bb9c3b64c426b185a32fe36528c4bda7` (local ahead of origin at audit time) |
| Unrelated dirty work | Preserved (M11/M12 docs, design churn, prompts, saves, reference PNGs, etc.) |
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` ✓ |
| Tags moved | **NO** |

---

## C. Phase-1B Source Gate

| Field | Value |
|-------|-------|
| Authoritative source | `docs/design/branding/BR-001_Logo.svg` |
| Expected sealed SHA-256 | `e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195` |
| Starting SHA-256 | `e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195` |
| Ending SHA-256 | `e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195` |
| Source hash unchanged | **YES** |
| Rejected candidate hash | `c8e10be0af9299451a5bf8f4f3c6e5748749968380f13ea99ce97d63f9b3a006` |
| Rejected hash used in runtime/registry | **NO** (documentation + test constant only) |

---

## D. Runtime Consumer Audit

| Consumer | Phase-1 role | Phase 1C action |
|----------|--------------|-----------------|
| **MainMenuHome** | ~32–48px brand symbol (Phase 1A) | Registry targets `MainMenuHome`; **no UI wiring** |
| **Browser favicon** | Potential tab identity (Phase 1A direction) | **Certified derivative candidates** on disk (`favicon-16x16.png`, `favicon-32x32.png`); **no** finalized wiring mechanism; **no** `layout.tsx` / App Router icon strategy selected |
| **SplashScreen** | Scenic MM-006 only | **Unchanged**; BR-001 decoupled |

**Direct SVG suitable for menu brand:** **YES** — fixed `#2563EB` fills; `PGVisualAssetImage` uses `<img src>` when `webp: null` (same pattern as registry SVG entries).

**Derivative certification vs consumer requirement:** Existence of both favicon PNGs proves **deterministic generation and hash certification** in Phase 1C. It does **not** predetermine that Phase 1D must wire both files (or either) — the **minimum wired favicon set** remains to be chosen during Phase 1D after repository/framework inspection.

---

## E. Existing Asset Architecture

| Pattern | Evidence | BR-001 choice |
|---------|----------|---------------|
| Runtime PNG + WebP | MM-*, ICON-001 | **Not used** for brand (different asset class) |
| Runtime byte-identical SVG | ICON-002, CH-010 | **Used** — copy from design master |
| Registry `runtimeSvg()` | ICON-002 | **Used** with `baseDir: /assets/branding` |
| Preload boot list | MM-001, MM-006, MM-007 | BR-001 **excluded** (no consumer yet) |

**Favicon architecture today:** `apps/web/src/app/layout.tsx` has title/description only — no `metadata.icons`, no App Router `app/icon.*` convention in use. Public favicon PNGs are **certified derivatives on disk**; **consumer wiring is not implemented** and **final mechanism unset** until Phase 1D.

---

## F. Derivative Decision Matrix

| Format | Classification | Rationale |
|--------|----------------|-----------|
| **SOURCE MASTER** | **CERTIFIED** | Sealed Phase 1B SVG |
| **RUNTIME SVG** | **PRODUCED / CERTIFIED / REQUIRED FOR PLANNED BRAND CONSUMER** | Registry + static serve; byte-identical copy |
| **PNG (menu brand)** | **NOT REQUIRED** | Vector-first; `format: svg` + loader `<img>` path |
| **WebP (menu brand)** | **NOT REQUIRED** | No PNG primary; no `<picture>` benefit for fixed-color SVG |
| **FAVICON SVG** | **NOT REQUIRED IN PHASE 1C / FINAL WIRING DECISION DEFERRED** | No wired consumer; Phase 1D selects mechanism |
| **FAVICON 16 PNG** | **PRODUCED / CERTIFIED DERIVATIVE / WIRING DECISION DEFERRED TO PHASE 1D** | Deterministic sharp render; hash + dimensions validated; not declared mandatory wired output |
| **FAVICON 32 PNG** | **PRODUCED / CERTIFIED DERIVATIVE / WIRING DECISION DEFERRED TO PHASE 1D** | Same |
| **favicon.ico** | **NOT REQUIRED IN PHASE 1C** | Not referenced; optional later |
| **APPLE TOUCH ICON** | **NOT REQUIRED / OUT OF PHASE-1 SCOPE** | Art brief out-of-scope |

---

## G. Runtime Path Contract

| Asset | Runtime path |
|-------|----------------|
| Brand symbol SVG | `/assets/branding/BR-001.svg` → `apps/web/public/assets/branding/BR-001.svg` |
| Favicon 16 (derivative candidate) | `/favicon-16x16.png` → `apps/web/public/favicon-16x16.png` |
| Favicon 32 (derivative candidate) | `/favicon-32x32.png` → `apps/web/public/favicon-32x32.png` |

Paths document **where certified derivatives live**; Phase 1D decides which path(s), if any, enter the browser favicon consumer contract.

**Note:** Phase 1A art brief mentioned `assets/logos/`; repository design authority lives under `docs/design/branding/`. Phase 1C prompt prefers a **branding** namespace — chosen for alignment with design path and to avoid duplicating DD-040 `logos/` without an existing tree.

**Certified derivative set (Phase 1C):** runtime SVG + favicon 16/32 PNG **candidates** (generated, hashed, validated).

**Minimum wired favicon set:** **Not determined in Phase 1C** — Phase 1D chooses the smallest sufficient wired set after App Router / metadata audit.

---

## H. Registry Migration

| Field | Before | After |
|-------|--------|-------|
| `format` | `png` | **`svg`** |
| `path` | `/assets/main-menu/MM-006.png` | **`/assets/branding/BR-001.svg`** |
| `webp` | `/assets/main-menu/MM-006.webp` | **`null`** |
| `component` | `SplashScreen` | **`MainMenuHome`** (future consumer) |
| `preload` | `true` | **`false`** |
| `designSource` | MM-006 splash PNG | **`docs/design/branding/BR-001_Logo.svg`** |

**Registry entry:** **UPDATED**

---

## I. MM-006 Placeholder Separation

| Check | Result |
|-------|--------|
| MM-006 asset | Unchanged — splash background |
| SplashScreen | Unchanged — still `PGVisualAssetBackground assetId="MM-006"` |
| BR-001 resolves to MM-006 paths | **NO** |
| BR-001 → MM-006 alias remains | **NO** |

---

## J. Sync Contract

| Item | Detail |
|------|--------|
| Tool | `tools/sync-runtime-visual-assets.ts` |
| BR-001 SVG | `copyFile` from `docs/design/branding/BR-001_Logo.svg` → `apps/web/public/assets/branding/BR-001.svg` |
| Favicons | `sharp` resize `contain`, transparent background, PNG to `apps/web/public/favicon-{16,32}x{16,32}.png` |
| Deterministic | **YES** — fixed source + fixed sharp settings |
| Source authoritative | **YES** |
| Byte-identical SVG copy | **YES** — verified in tests |

**Environment note:** Full `pnpm sync-visual-assets` may hit `EPERM` on overwriting locked main-menu PNGs on some Windows hosts; BR-001 segment is independent and was verified via hash tests after sync outputs exist.

---

## K. Derivative Generation Contract

| Derivative | Generator | Settings |
|------------|-----------|----------|
| `BR-001.svg` | Filesystem copy | Byte-identical |
| `favicon-16x16.png` | sharp | 16×16, `fit: contain`, alpha 0 background |
| `favicon-32x32.png` | sharp | 32×32, same |

No reference PNG (`BR-001_Logo.png` design artifacts) used as production input.

---

## L. Favicon Contract

### Phase 1C — completed

- Sealed source certification (unchanged).
- Runtime SVG certification (byte-identical public copy).
- Deterministic favicon derivative generation from sealed SVG.
- **16×16 PNG derivative certification** — file exists; SHA-256 `b4102b39cd782581cbbd131f70fc1cce06087c17e3c4b23c2b01616dafa8623d`; dimensions validated in tests.
- **32×32 PNG derivative certification** — file exists; SHA-256 `4a1a3e3dbdfb3ced65d1af2e900f1ec35a9b83752edbceeea50ae8166e5345c6`; dimensions validated in tests.
- Visual fidelity checks at 16 / 32 / 48px (historical validation session) — three-module silhouette, transparent ground, `#2563EB`.

### Phase 1C — not completed

- Browser metadata wiring.
- App Router icon strategy selection (`metadata.icons`, `app/icon.*`, or other repository-supported mechanism).
- Determination of which certified derivative(s) the **final consumer** actually requires.
- Favicon consumer integration.

### Phase 1D — must determine

- Actual repository/framework favicon wiring mechanism.
- Whether `metadata.icons`, App Router file convention, or another existing pattern is appropriate.
- Which **already-certified** derivative(s), if any, are required in the wired set.
- Whether both 16 and 32 PNGs are necessary, or a single size / alternate representation is sufficient.

Phase 1D must prefer the **minimum sufficient wired set**. Phase 1C does **not** mandate wiring both PNGs.

### Content rules (unchanged)

- Same three-module symbol; no monogram, background plate, or color change.
- Raster outputs are direct renders of sealed SVG (not upscaled PNG references).

---

## M. Preload Decision

| Value | **FALSE** |
|-------|-----------|
| Reason | No MainMenuHome consumer yet; prior `preload: true` was an artifact of MM-006 alias; avoids loading brand bytes during splash boot |

---

## N. Fallback / Accessibility Contract for Phase 1D

| Topic | Contract |
|-------|----------|
| Fallback | Visible **Project Genesis** text remains authoritative; failed brand load must not remove product name |
| Accessibility | Decorative brand beside heading → **`alt=""`** (or equivalent) to avoid duplicate SR announcement |
| Favicon | Browser metadata only — no image `alt` |

**Not implemented in Phase 1C.**

---

## O. Targeted Tests

| Suite | Result |
|-------|--------|
| `visual-asset-registry.test.ts` | **8 PASS** |
| `br001-runtime-certification.test.ts` | **5 PASS** (sealed hash, byte-identical runtime SVG, no branding PNG/WebP, favicon dimensions, registry + preload) |

No MainMenuHome or Splash UI tests added.

---

## P. Source Integrity Verification

Ending SHA-256 of `docs/design/branding/BR-001_Logo.svg`:

`e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195`

**Source hash unchanged: YES**

---

## Q. Runtime Hash Certification

| File | Format | Dimensions | SHA-256 | Relationship |
|------|--------|------------|---------|--------------|
| `docs/design/branding/BR-001_Logo.svg` | SVG | viewBox 64×64 | `e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195` | **SOURCE MASTER** |
| `apps/web/public/assets/branding/BR-001.svg` | SVG | viewBox 64×64 | `e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195` | **Byte-identical to source** |
| `apps/web/public/favicon-16x16.png` | PNG | 16×16 | `b4102b39cd782581cbbd131f70fc1cce06087c17e3c4b23c2b01616dafa8623d` | Certified derivative candidate (sharp from source) |
| `apps/web/public/favicon-32x32.png` | PNG | 32×32 | `4a1a3e3dbdfb3ced65d1af2e900f1ec35a9b83752edbceeea50ae8166e5345c6` | Certified derivative candidate (sharp from source) |

Hash table records **derivative certification**, not **mandatory wired consumer selection**.

---

## R. Scope Verification

| Area | Modified |
|------|----------|
| Source artwork (`BR-001_Logo.svg`) | **NO** |
| MainMenuHome | **NO** |
| CSS | **NO** |
| SplashScreen | **NO** |
| Gameplay / domain / API / YAML | **NO** |
| ICON-001 / ICON-002 | **NO** |
| Lifecycle global closeout | **NO** |
| Release tags | **NO** |

---

## S. Repository Integrity

**Task-owned files (Phase 1C implementation):**

- `apps/web/src/presentation/assets/visual-asset-registry.ts`
- `tools/sync-runtime-visual-assets.ts`
- `apps/web/public/assets/branding/BR-001.svg`
- `apps/web/public/favicon-16x16.png`
- `apps/web/public/favicon-32x32.png`
- `apps/web/src/presentation/assets/br001-runtime-certification.test.ts`
- This report

**Documentation delta (favicon contract clarification):** this report only — no asset or code changes.

**Unrelated files:** Not cleaned; see `git status` snapshot in implementation session.

**Commit / push:** **NO** (per Phase 1C default policy)

---

## T. Deferred Work

| Item | Phase |
|------|-------|
| MainMenuHome `PGVisualAssetImage` + decorative `alt=""` | **1D** |
| Favicon **consumer** wiring — select App Router / `metadata.icons` / file convention; wire **minimum sufficient** certified derivative(s) | **1D** |
| Decide whether wired set uses 16 PNG, 32 PNG, both, or another supported representation | **1D** |
| Optional `favicon.ico` / apple-touch | Later / out of scope |
| Update `VISUAL_ASSET_INTEGRATION_GUIDE.md` BR-001 row | Documentation hygiene (non-blocking) |
| `visual-asset-registry.test.ts` explicit BR-001 case | Optional — covered by `br001-runtime-certification.test.ts` |

---

## U. Final Gate Recommendation

**OPTION A — BR-001 PHASE 1C RUNTIME CERTIFICATION — PASS / READY FOR CONSUMER INTEGRATION**

**BR-001 PHASE 1C — CLOSED / PASS**

| Layer | Status |
|-------|--------|
| Runtime SVG contract | **SEALED** |
| Favicon derivative generation | **CERTIFIED** |
| Final favicon consumer wiring | **DEFERRED TO PHASE 1D** |
| MainMenuHome integration | **DEFERRED TO PHASE 1D** |

**Not claimed:** BR-001 Phase 1 globally closed (Phase 1D outstanding).

---

# BR-001 Phase 1C — Runtime Certification & Derivative Contract
## Execution Summary

### Baseline

- **Branch:** `master`
- **HEAD:** `f512ac7642171d1708c6a6fe143ca922e4e9cc94`
- **origin/master:** `730ed190bb9c3b64c426b185a32fe36528c4bda7`
- **unrelated dirty work:** preserved
- **v1.0.0:** `c4bb643df6fda7792906f34fbbb20ff07e9bfeef`
- **v1.0.0-rc.1:** `442665cd6437bdebff88fd1540cedc689238c240`
- **tags moved:** NO

### Sealed Source

- **source:** `docs/design/branding/BR-001_Logo.svg`
- **expected SHA-256:** `e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195`
- **starting SHA-256:** `e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195`
- **ending SHA-256:** `e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195`
- **unchanged:** YES
- **rejected candidate used:** NO

### Runtime Audit

- **direct SVG suitable:** YES
- **runtime asset architecture:** registry `runtimeSvg` + public static copy
- **favicon architecture:** certified PNG derivatives on disk; **no** consumer wiring; **no** final mechanism selected
- **certified derivative set (Phase 1C):** runtime SVG + favicon 16/32 PNG candidates
- **minimum wired favicon set:** **TBD in Phase 1D** (consumer integration)

### Certification Matrix

- **runtime SVG:** PRODUCED / CERTIFIED / REQUIRED FOR PLANNED BRAND CONSUMER
- **PNG (menu brand):** NOT REQUIRED
- **WebP (menu brand):** NOT REQUIRED
- **favicon SVG:** NOT REQUIRED IN PHASE 1C / FINAL WIRING DECISION DEFERRED
- **favicon 16:** PRODUCED / CERTIFIED DERIVATIVE / WIRING DECISION DEFERRED TO PHASE 1D
- **favicon 32:** PRODUCED / CERTIFIED DERIVATIVE / WIRING DECISION DEFERRED TO PHASE 1D
- **favicon.ico:** NOT REQUIRED IN PHASE 1C
- **apple-touch icon:** NOT REQUIRED / OUT OF PHASE-1 SCOPE

### Registry

- **BR-001 entry:** UPDATED
- **previous placeholder:** MM-006 splash PNG/WebP + SplashScreen + preload
- **MM-006 alias removed:** YES
- **runtime path:** `/assets/branding/BR-001.svg`
- **formats:** SVG only (`webp: null`)
- **preload:** FALSE

### Sync

- **sync tooling changed:** YES (implementation session)
- **deterministic:** YES
- **source authoritative:** YES
- **byte-identical SVG copy:** YES

### Runtime Hashes

- `apps/web/public/assets/branding/BR-001.svg` — `e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195`
- `apps/web/public/favicon-16x16.png` — `b4102b39cd782581cbbd131f70fc1cce06087c17e3c4b23c2b01616dafa8623d`
- `apps/web/public/favicon-32x32.png` — `4a1a3e3dbdfb3ced65d1af2e900f1ec35a9b83752edbceeea50ae8166e5345c6`

### Validation

- **focused tests:** PASS (13) — historical implementation session
- **sync/check:** BR-001 outputs verified; full sync EPERM on host for MM overwrites (environment)
- **SVG validation:** sealed master unchanged; runtime SVG byte-equal
- **derivative dimensions:** 16×16, 32×32 PASS (sharp metadata in tests)
- **48px visual:** PASS (SVG viewBox; favicon 32 inspected)
- **32px visual:** PASS — three modules, open center, transparent ground, #2563EB
- **16px visual:** PASS — silhouette recognizable at native size
- **build/typecheck:** PRE-EXISTING FAILURE — Next `EPERM` on `.next/trace`

### Scope

- **source artwork changed:** NO
- **MainMenuHome changed:** NO
- **CSS changed:** NO
- **SplashScreen changed:** NO
- **gameplay changed:** NO
- **domain changed:** NO
- **API changed:** NO
- **YAML changed:** NO
- **lifecycle closeout performed:** NO

### Repository Integrity

- **task-owned files:** listed in §S
- **unrelated files modified:** not by favicon doc delta
- **commit:** NO
- **push:** NO
- **tags moved:** NO

### Final Decision

**OPTION A — BR-001 PHASE 1C RUNTIME CERTIFICATION — PASS / READY FOR CONSUMER INTEGRATION**

**BR-001 PHASE 1C — CLOSED / PASS**

- **Runtime SVG contract:** SEALED
- **Favicon derivatives:** CERTIFIED
- **Favicon consumer wiring:** DEFERRED TO PHASE 1D
- **MainMenuHome integration:** DEFERRED TO PHASE 1D
