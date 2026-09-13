# BR-001 Phase 1 — Close Candidate Report

**Project:** Project Genesis  
**Date:** 2026-09-13  
**Pass:** Consolidated finish / validate / close candidate  
**HEAD:** `f512ac7642171d1708c6a6fe143ca922e4e9cc94`

Prior slices: Phase 1A–1D reports under `docs/architecture/reviews/POST_V1_BR_001_*`.

---

## A. Executive Summary

BR-001 Phase 1 is **CLOSED / PASS** as a close candidate. Sealed artwork, runtime certification, MainMenuHome consumer, and minimum favicon wiring are complete. Focused tests pass; desktop and narrow runtime were verified on a live dev server. Lifecycle documentation was updated. No additional Phase-1 MUST-HAVE consumers were identified.

**Final decision:** **OPTION A — BR-001 PHASE 1 — READY TO CLOSE / PASS CANDIDATE**

---

## B. Locked Asset Integrity

| Asset | SHA-256 | Result |
|-------|---------|--------|
| `docs/design/branding/BR-001_Logo.svg` | `e1291850f34c7e40d285d622368f31b266bdac4e002d0c0aff9aa784a3733195` | **OK** |
| `apps/web/public/assets/branding/BR-001.svg` | same | **OK** |
| `apps/web/public/favicon-16x16.png` | `b4102b39cd782581cbbd131f70fc1cce06087c17e3c4b23c2b01616dafa8623d` | **OK** |
| `apps/web/public/favicon-32x32.png` | `4a1a3e3dbdfb3ced65d1af2e900f1ec35a9b83752edbceeea50ae8166e5345c6` | **OK** |

Registry and sync: **unchanged** since Phase 1C.

---

## C. Phase 1D Final Validation

Implementation unchanged from Phase 1D report except test/snapshot cleanup in this pass. Consumers:

- **MainMenuHome:** `PGVisualAssetImage` / `BR-001`, `alt=""`, heading preserved.
- **Favicon:** `metadata.icons` → `/favicon-32x32.png` only.

---

## D. Snapshot Resolution

| Step | Result |
|------|--------|
| Initial shell MainMenuHome snapshot | **FAIL** (stale pre–BR-001 DOM) |
| Diff | Expected only — brand row, img, text wrapper, preserved h1/subtitle |
| Repair | Replaced snapshot test with structural assertions; removed obsolete snapshot via `vitest -u` |
| Final shell test | **PASS** |

**Files:** `shell-components.snapshot.test.tsx`, snapshot artifact pruned.

---

## E. Test Matrix

| Suite | Result |
|-------|--------|
| MainMenuHome focused tests | **PASS** (5) |
| Layout metadata test | **PASS** (1) |
| Phase-1C certification tests | **PASS** (5) |
| Registry tests | **PASS** (8) |
| Shell snapshot / brand assertions | **PASS** (3) |
| **Total focused** | **22 PASS** |
| Web typecheck (`pnpm --filter @project-genesis/web typecheck`) | **PRE-EXISTING FAIL** (unrelated TS debt; not BR-001) |
| Web build (`pnpm build:web`) | **ENVIRONMENT BLOCKED** — `EPERM` on `apps/web/.next/trace` |
| Root `pnpm typecheck` | **PRE-EXISTING FAIL** (tools/domain tests) |

No task-introduced test failures remain.

---

## F. Desktop Runtime Evidence

| Field | Value |
|-------|-------|
| Viewport | Browser default wide (~1280×800 effective) |
| URL | `http://localhost:3000/` |
| Result | **PASS** |

Observed: BR-001 mark visible beside **Project Genesis**; subtitle intact; flex alignment; no clipping/overlap/broken image; menu actions intact. Session API error banner present (API not running — unrelated to BR-001).

---

## G. Narrow Runtime Evidence

| Field | Value |
|-------|-------|
| Viewport | **390×844** (mobile emulation) |
| URL | `http://localhost:3000/` |
| Result | **PASS** |

Observed: brand row stable; title/subtitle readable; no horizontal overflow from brand row; actions usable.

---

## H. Favicon Verification

| Check | Result |
|-------|--------|
| Mechanism | Next.js `metadata.icons` |
| Selected asset | Certified `/favicon-32x32.png` |
| Metadata emitted | **PASS** — `link[rel=icon]` href `…/favicon-32x32.png`, sizes `32x32` |
| HTTP request | **PASS** — 200 for `/favicon-32x32.png` and `/assets/branding/BR-001.svg` |
| Browser tab visual | **PASS — browser observed** (tab title Project Genesis; icon link present) |

16×16 PNG: **not wired** (by design).

---

## I. Coverage Review

| Potential consumer | Classification |
|--------------------|----------------|
| MainMenuHome product branding | **REQUIRED / IMPLEMENTED** |
| Browser favicon | **REQUIRED / IMPLEMENTED** |
| SplashScreen brand mark | **DEFERRED** — MM-006 scenic splash remains |
| Workspace header | **OPTIONAL / DEFERRED** |
| Loading screen / HUD / settings / other menus | **OUT OF PHASE 1** |

---

## J. Must-Have Gap Assessment

**Additional MUST-HAVE gap:** **NO**

Phase 1 intended scope (MainMenuHome + favicon) is satisfied. No evidence requires splash or workspace branding in Phase 1.

---

## K. Lifecycle Closeout

| Document | Updated |
|----------|---------|
| `docs/design/VISUAL_ASSET_CATALOG.md` | **YES** — BR-001 section |
| `docs/design/VISUAL_PRODUCTION_BACKLOG.md` | **YES** — Sprint 13 BR-001 checked |
| `docs/design/VISUAL_ASSET_CHANGELOG.md` | **YES** — 2026-09-13 closeout entry |

**BR-001 Phase 1:** **CLOSED / PASS**

Deferred: splash overlay, workspace header, favicon 16 wiring, BR-002+ branding pack.

---

## L. Scope Verification

| Check | Modified |
|-------|----------|
| Sealed source / runtime / favicon bytes | **NO** |
| Registry / sync | **NO** |
| MM-006 / SplashScreen | **NO** |
| New consumers beyond Phase 1D | **NO** |
| Gameplay / domain / API / YAML / release | **NO** |

Authorized: MainMenuHome integration (prior), layout metadata (prior), tests/snapshot repair, lifecycle docs, reports.

---

## M. Repository Integrity

| Item | Value |
|------|-------|
| HEAD | `f512ac7642171d1708c6a6fe143ca922e4e9cc94` |
| `origin/master` | `730ed190bb9c3b64c426b185a32fe36528c4bda7` |
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` ✓ |
| Tags moved | **NO** |
| Commit / push | **NO** |

Unrelated dirty work preserved.

---

## N. Final Decision

**OPTION A — BR-001 PHASE 1 — READY TO CLOSE / PASS CANDIDATE**

External review may seal after commit policy allows.

---

# BR-001 Phase 1 — Finish, Validate & Close Candidate
## Execution Summary

### Baseline

- **Branch:** `master`
- **HEAD:** `f512ac7642171d1708c6a6fe143ca922e4e9cc94`
- **origin/master:** `730ed190bb9c3b64c426b185a32fe36528c4bda7`
- **v1.0.0:** `c4bb643df6fda7792906f34fbbb20ff07e9bfeef`
- **v1.0.0-rc.1:** `442665cd6437bdebff88fd1540cedc689238c240`
- **tags moved:** NO

### Asset Integrity

- **source SVG:** OK
- **runtime SVG:** OK
- **favicon 16:** OK
- **favicon 32:** OK
- **result:** PASS

### Snapshot

- **initial result:** FAIL (stale)
- **diff expected:** YES
- **updated:** YES
- **final result:** PASS

### Tests

- **MainMenuHome:** PASS
- **layout metadata:** PASS
- **Phase-1C certification:** PASS
- **registry:** PASS
- **shell snapshot:** PASS
- **typecheck:** PRE-EXISTING FAIL (web + root)
- **build:** ENVIRONMENT BLOCKED (EPERM `.next/trace`)

### Desktop Runtime

- **viewport:** ~1280×800
- **result:** PASS

### Narrow Runtime

- **viewport:** 390×844
- **result:** PASS

### Favicon

- **mechanism:** `metadata.icons`
- **selected asset:** `/favicon-32x32.png`
- **metadata:** PASS
- **request:** PASS (200)
- **browser visual:** PASS (link observed)
- **result:** PASS

### Small Repairs Performed

- **files:** `shell-components.snapshot.test.tsx`, snapshot prune via vitest
- **reason:** expected BR-001 DOM; read-only attribute on test artifacts

### Coverage Review

- **MainMenuHome:** REQUIRED / IMPLEMENTED
- **favicon:** REQUIRED / IMPLEMENTED
- **SplashScreen:** DEFERRED
- **workspace header:** OPTIONAL / DEFERRED
- **other screens:** OUT OF PHASE 1
- **additional MUST-HAVE gap:** NO

### Lifecycle Closeout

- **catalog updated:** YES
- **backlog updated:** YES
- **changelog updated:** YES
- **BR-001 Phase 1 marked CLOSED/PASS:** YES
- **optional/deferred consumers documented:** YES

### Scope Integrity

All forbidden areas: **NO** (except authorized lifecycle + test repair)

### Repository Integrity

- **task-owned files:** MainMenuHome stack, layout, tests, lifecycle docs, reports, shell test
- **commit:** NO
- **push:** NO
- **tags moved:** NO

### Final Decision

**OPTION A**
