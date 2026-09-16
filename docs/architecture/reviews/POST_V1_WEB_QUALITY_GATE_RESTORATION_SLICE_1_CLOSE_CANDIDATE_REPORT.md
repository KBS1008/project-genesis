# Post-V1 Web Quality Gate Restoration — Slice 1 Close Candidate Report

**Workstream:** POST-V1-WEB-QUALITY-GATE-RESTORATION  
**Date:** 2026-09-16  
**HEAD (pre-commit):** `a1eff254549911da3d3d1d7c249499b4ee934bcd`

---

## A. Executive Summary

Slice 1 restores **`pnpm --filter @project-genesis/web typecheck`** and **`pnpm build:web`** to **PASS** by fixing bounded **test/lint** issues only. **`pnpm test`** remains **PASS** (954 tests). No production, gameplay, API, YAML, or visual changes.

---

## B. Repository Baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD | `a1eff25…` |
| Workstream review | `POST_V1_NEXT_WORKSTREAM_REVIEW.md` at `a1eff25` ✓ |
| Remote master | `a1eff25…` (ls-remote) |

---

## C. Initial Gate Failures

| Command | Initial |
|---------|---------|
| Web typecheck | FAIL — KPI fixtures, axe matchers, integration typings, Buildings/Transport mocks |
| build:web | FAIL — unused `render` in `MainMenuHome.test.tsx` |
| pnpm test | PASS — 954 tests |

---

## D. Diagnostic Classification

| Area | Class |
|------|-------|
| `pendingTaxLabel` on KPI fixtures | **A** — stale test field |
| `toHaveNoViolations` | **C** — matcher type setup |
| World search / dashboard reconnect fixtures | **A** — fixture drift |
| Buildings workspace mock | **A** — partial mock vs `GameWorkspaceContextValue` |
| Transport navigation mock | **A** — readonly / literal narrowing |
| MainMenuHome unused import | **B** |
| Root visual-asset-manager TS | **F** — out of scope |

---

## E. Files Changed (task-owned)

- `apps/web/src/presentation/screens/menu/MainMenuHome.test.tsx`
- `apps/web/src/presentation/adapters/mappers/company-operations-view-mappers.test.ts`
- `apps/web/src/presentation/screens/company/operations-dashboard.test.tsx`
- `apps/web/src/presentation/testing/vitest.setup.ts`
- `apps/web/src/presentation/testing/vitest-axe.d.ts` *(new)*
- `apps/web/src/presentation/components/dashboard/*.a11y.test.tsx` *(via setup/types only)*
- `apps/web/src/presentation/runtime/dashboard-reconnect.integration.test.tsx`
- `apps/web/src/presentation/runtime/world-search-selection.integration.test.ts`
- `apps/web/src/presentation/screens/buildings/BuildingsScreen.test.tsx`
- `apps/web/src/presentation/screens/transport/TransportScreen.test.tsx`

---

## F. MainMenuHome Lint Repair

Removed unused `render` import; tests continue using `renderPresentation`.

---

## G. Presentation Test Typing Repairs

- Removed obsolete `pendingTaxLabel` from `KpiStripViewData` fixtures.
- `BuildingsScreen.test.tsx`: complete `SidebarHintsViewData` hint arrays; `as unknown as GameWorkspaceContextValue` for partial workspace mocks.
- `TransportScreen.test.tsx`: mutable navigation test double + `as NavigationState` for provider mock.
- Integration tests: full `RegionDto` fixture; `EntitySelection` satisfies; dashboard reconnect mock signatures aligned with `WorkspaceRefreshInput`.

---

## H. Test Type / Matcher Setup

- `vitest.setup.ts`: `import 'vitest-axe/extend-expect'`
- `vitest-axe.d.ts`: Vitest assertion augmentation for `toHaveNoViolations`

---

## I. Production-Code Impact

**NONE** — production components unchanged.

---

## J. Focused Test Results

Target suites exercised during repair; full suite run at close.

---

## K. Web Package Typecheck

**PASS** — `pnpm --filter @project-genesis/web typecheck`

---

## L. build:web

**PASS** — `pnpm build:web` (Next.js 15.5.20; ESLint warnings only in unrelated production files)

---

## M. Full Test Suite

**PASS** — 257 files / **954 tests**

---

## N. Root Typecheck / Lint Observation

| Command | Result | Classification |
|---------|--------|----------------|
| `pnpm typecheck` | FAIL | **PRE-EXISTING / OUT-OF-SCOPE** — `visual-asset-manager`, `sync-runtime-visual-assets.ts` |
| `pnpm lint` | FAIL | **PRE-EXISTING / OUT-OF-SCOPE** — 12 errors, 58 warnings (root + tools) |

Acceptable for Slice 1 per workstream boundary.

---

## O. Regression Classification

| Gate | Result |
|------|--------|
| Web typecheck | PASS |
| build:web | PASS |
| pnpm test | PASS |
| Root typecheck | OUT-OF-SCOPE FAIL |
| Root lint | OUT-OF-SCOPE FAIL |

No task-introduced failures.

---

## P. Scope Verification

| Check | Value |
|-------|-------|
| Production behavior changed | **NO** |
| Gameplay / API / YAML / visuals | **NO** |
| Quality rules weakened | **NO** |
| Tests deleted/skipped | **NO** |

Unrelated doc/design churn in working tree **not modified** by this slice.

---

## Q. Remaining Engineering Debt (Slice 2+)

- Root `pnpm typecheck` — dev tooling under `src/tools/visual-asset-manager`
- Root `pnpm lint` error subset
- CI/CD pipeline (POST_V1)
- Optional doc alignment (`V1_0_KNOWN_ISSUES.md` header vs released tag)

---

## R. Repository Integrity

No commit / push / tag movement (per prompt).

---

## S. Workstream Status

**Slice 1 complete.** Workstream **POST-V1-WEB-QUALITY-GATE-RESTORATION** may proceed to **Slice 2** (root tooling TS) separately.

---

## T. Final Decision

**OPTION A — POST-V1 WEB QUALITY GATE RESTORATION — SLICE 1 READY TO CLOSE / PASS CANDIDATE**

---

# Post-V1 Web Quality Gate Restoration — Slice 1
## Close Candidate Execution Summary

### Baseline

- branch: master · HEAD: a1eff25 · workstream review present: yes · tags unchanged: yes

### Initial Gates

- web typecheck: FAIL → **PASS**
- build:web: FAIL → **PASS**
- pnpm test: PASS → **PASS**

### Repairs

- files changed: 9 web test/setup files (see §E)
- production files changed: **NO**
- config changed: **NO** (setup + local `.d.ts` only)

### Required Final Gates

- web typecheck: **PASS**
- build:web: **PASS**
- pnpm test: **PASS** (954)

### Root Observation

- pnpm typecheck: **FAIL** (tooling — out of scope)
- pnpm lint: **FAIL** (mixed — out of scope)

### Final Decision

**OPTION A**
