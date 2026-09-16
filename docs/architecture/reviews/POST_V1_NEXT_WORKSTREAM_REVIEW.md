# Post-V1 Next Workstream Review

**Project:** Project Genesis  
**Date:** 2026-09-16  
**Mode:** Read-only project-wide priority review  
**Prompt:** `docs/development/Prompts/POST_V1_NEXT_WORKSTREAM_REVIEW.md`

---

## A. Executive Summary

The Post-V1 **Visual Improvement Track** is **paused** with no material production-visual gap (`POST_V1_VISUAL_TRACK_COMPLETION_REVIEW.md`, HEAD **`a5b00d9`**). Runtime gameplay evidence remains strong: **954/954** Vitest tests pass, including API E2E industrial chain flow.

The most justified **next Post-V1 workstream** is **engineering quality gate restoration for the web app** (classification **T**): **`pnpm build:web` currently FAILs** (ESLint error in `MainMenuHome.test.tsx`), and **`pnpm --filter @project-genesis/web typecheck` FAILs** on a bounded set of presentation-layer test typings. This does not indicate a player-facing gameplay defect, but it **does** block the historically authoritative web production build command and weakens TypeScript regression signal on the primary UI package.

**Recommendation:** **OPTION A** — select **POST-V1-WEB-QUALITY-GATE-RESTORATION** with first slice focused on restoring **`build:web` PASS** and **web package typecheck PASS** without expanding into unrelated root tooling debt in slice 1.

---

## B. Repository Baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD | `a5b00d948a3b23d529b6dcb119cf160a22c0abdf` |
| Visual Track Completion commit | `a5b00d9` — present in history ✓ |
| Remote `master` (`git ls-remote`) | `a5b00d9…` ✓ |
| `git fetch` | Not run; EPERM on `FETCH_HEAD` known historically |
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` ✓ |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` ✓ |

---

## C. Immutable Release / Completed Track Baseline

- **V1.0 released**; M12 / Executive Review / Release Gate treated as **closed** (per prompt + tags at HEAD).
- **Post-V1 Visual Track:** COMPLETE / PAUSE — no new visual workstream nominated here.
- **`build:web`** was an RC-class gate (M12 release prep) and is **not passing today** — material change since prior PASS evidence.

---

## D. Current Known-Issue Reassessment

Source: `docs/releases/V1_0_KNOWN_ISSUES.md`.

| Issue | Classification |
|-------|----------------|
| POLISH-08 manual a11y sweep | **B** — nonblocking |
| Root build / typecheck / lint debt | **Still real**; web **build:web regressed** |
| Mockup visual parity | **D** — superseded by visual track pause |
| Session log not persisted | Documentation limitation (by design) |
| POST_V1 CI/CD, i18n, etc. | **F** — future |
| Doc "V1 not yet released" | **D** — stale vs `v1.0.0` tag |

---

## E–N. Family Surveys (Summary)

| Family | Material workstream? |
|--------|---------------------|
| Gameplay / product | **NO** — E2E industrial chain PASS |
| UX (non-visual) | **NO** — no new reproducible blocker |
| Reliability | **NO** — tests green |
| Test infra | Supports web gate workstream |
| TS / build / lint | **YES** — see §O |
| Architecture refactor | **NO** |
| Performance | **NO** |
| Accessibility epic | **NO** — advisory POLISH-08 |
| Documentation | Minor stale lines — not primary |
| DevEx | **build:web** failure is repo health issue |

---

## O. Current Quality Command Results

| Command | Result | Classification |
|---------|--------|----------------|
| `pnpm test` | **PASS** (257 files / 954 tests) | — |
| `pnpm build:web` | **FAIL** — ESLint error `MainMenuHome.test.tsx` unused `render` | **TEST/TOOLING DEBT** (RC gate regression) |
| `pnpm --filter @project-genesis/web typecheck` | **FAIL** — presentation test typings | **TEST/TOOLING DEBT** |
| `pnpm typecheck` (root) | **FAIL** — web + `visual-asset-manager` tooling | **MIXED** |
| `pnpm lint` | **FAIL** — 13 errors, 58 warnings | **MIXED** |

---

## P. Credible Candidate Shortlist

1. **POST-V1-WEB-QUALITY-GATE-RESTORATION** (**T**) — **selected**
2. Root `visual-asset-manager` typecheck (**T**) — later slice
3. `V1_0_KNOWN_ISSUES.md` alignment (**D**) — defer
4. CI/CD pipeline (**F**) — future
5. POLISH-08 manual sweep (**X**) — defer

---

## Q. Candidate Comparison

Web gate restoration wins on **development leverage**, **bounded scope**, and **concrete RC-class command failure** vs optional doc/CI/a11y work.

---

## R. Selected Post-V1 Workstream

**WORKING NAME:** **POST-V1-WEB-QUALITY-GATE-RESTORATION**  
**CLASSIFICATION:** **T**  
**PRIMARY PROBLEM:** `build:web` and web package typecheck fail while tests pass.  
**CURRENT IMPACT:** Blocks reliable web production build / TS regression signal.  
**WHY NOW:** Visual track paused; no material gameplay gap; bounded fixes.  
**BOUNDARY:** `@project-genesis/web` ESLint blockers + presentation test types.  
**OUT OF SCOPE:** Gameplay, visuals, API, root tooling (slice 2).  
**GAMEPLAY DECISION:** **NO**

---

## S. First Slice Contract

**FIRST SLICE:** Web `build:web` + package typecheck green (presentation tests)

**GOAL:** `pnpm build:web` and `pnpm --filter @project-genesis/web typecheck` exit 0 via test/lint fixes only.

**LIKELY FILES:** `MainMenuHome.test.tsx`, company/transport/buildings screen tests, dashboard a11y tests, integration test fixtures, vitest type setup.

**DEFINITION OF DONE:** Both commands PASS; `pnpm test` PASS; no production behavior/API/YAML/visual changes.

---

## T. Later / Deferred / Stale / Future

- **Later:** Root tooling TS; root lint error cleanup; CI/CD
- **Stale:** Mockup parity as blocker; visual backlog as requirement
- **Future:** POST_V1 table (i18n, packaging, etc.)

---

## U. Release / Repository Integrity

Tags unchanged; unrelated working-tree churn untouched; no commit/push.

---

## V. Final Decision

**OPTION A — NEXT POST-V1 WORKSTREAM SELECTED: POST-V1-WEB-QUALITY-GATE-RESTORATION**

---

# Post-V1 Next Workstream Review
## Execution Summary

### Baseline

- Branch: `master` · HEAD: `a5b00d9…` · remote: `a5b00d9…` · Visual completion: **yes** · tags unchanged: **yes**

### Current Product State

- material gameplay / UX / correctness / a11y gaps: **NO**

### Engineering State

- tests: **PASS** (954) · typecheck: **FAIL** · build: **`build:web` FAIL** · lint: **FAIL** · material tooling debt: **YES**

### Known Issues

- material: web build/typecheck gates · nonblocking: POLISH-08, scroll · stale: V1 doc header · env: FETCH EPERM

### Shortlist

1. Web quality gates (**T**) — selected · 2. Tooling TS · 3. Doc align · 4. CI/CD · 5. POLISH-08

### Selected Workstream

- **POST-V1-WEB-QUALITY-GATE-RESTORATION** · **T** · restore `build:web` + web typecheck · gameplay decision: **NO**

### First Slice

- Presentation test + ESLint fixes in `@project-genesis/web` · DoD: both commands PASS, tests PASS

### Final Decision

**OPTION A**
