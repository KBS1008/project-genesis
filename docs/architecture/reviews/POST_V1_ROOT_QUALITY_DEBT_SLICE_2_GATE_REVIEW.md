# Post-V1 Root Quality Debt — Slice 2 Gate Review

**Workstream:** POST-V1-WEB-QUALITY-GATE-RESTORATION  
**Date:** 2026-09-16  
**Mode:** Read-only bounded gate review  
**Prompt:** `docs/development/Prompts/POST_V1_ROOT_QUALITY_DEBT_SLICE_2_GATE_REVIEW.md`

---

## A. Executive Summary

**Slice 1 remains green** at HEAD **`3fa8cf0`**: web typecheck, `build:web`, and **954** tests **PASS**.

Remaining **root** `pnpm typecheck` and `pnpm lint` failures are **repository-owned**, **mechanically fixable**, and **mostly concentrated** in dev tooling (`src/tools/svg-generator`, `src/tools/visual-asset-manager`, `tools/sync-runtime-visual-assets.ts`) plus a **small** set of **root `tsc` test typings** and **12 ESLint errors** (including a few in `src/application` production/test files). They do **not** indicate a player-facing runtime defect (`pnpm test` green).

**Recommendation:** **OPTION A — CONTINUE WITH SLICE 2:** **POST-V1-ROOT-QUALITY-GATE-SLICE-2** — restore **`pnpm typecheck`** and **eslint error-free** root **`pnpm lint`** (warnings may remain) via bounded tooling + fixture/lint repairs **without** policy weakening. After a successful Slice 2, the **quality-gate workstream** can be **complete** for material gates; warning cleanup stays **deferred**.

---

## B. Repository Baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| HEAD | `3fa8cf036e5c6aea2c467d1e961be4864d01287d` |
| Slice 1 commit | `3fa8cf0` — present ✓ |
| Remote master | `3fa8cf0…` (ls-remote) |
| `git fetch` | Not run; historical FETCH_HEAD EPERM noted |

---

## C. Slice-1 Gate Reconfirmation

| Command | Result |
|---------|--------|
| `pnpm --filter @project-genesis/web typecheck` | **PASS** |
| `pnpm build:web` | **PASS** |
| `pnpm test` | **PASS** (257 files / 954 tests) |

**Slice-1 regression:** **NO**

---

## D. Current Root Typecheck Result

**FAIL** — root script: `tsc --noEmit && api typecheck && web typecheck` (fails at first step).

**Approximate failure groups (current run):**

| Group | Area | Count (order of magnitude) | Production runtime |
|-------|------|------------------------------|--------------------|
| 1 | `src/application/**/*.test.ts`, `src/content/**/*.test.ts` | ~6 | **NO** (test fixtures / `never` inference) |
| 2 | `src/tools/svg-generator/**` | ~20 | **NO** (dev SVG tooling) |
| 3 | `src/tools/visual-asset-manager/**` | ~15 | **NO** (dev asset tooling) |
| 4 | `tools/sync-runtime-visual-assets.ts` | 1 | **NO** (sync script) |

Web and API package typechecks succeed when reached; root monolith `tsc` includes `src`, `tests`, `tools` per root `tsconfig.json`.

---

## E. Current Root Lint Result

**FAIL** — **12 errors**, **58 warnings** (`eslint .`).

**Errors only:**

| File | Issue class |
|------|-------------|
| `GameSessionDashboardBuilder.test.ts` | duplicate import |
| `companyBrainSnapshotMapper.ts` | `import type` |
| `ListSavegamesQueryHandler.ts` | `import type` |
| `createRegionalModifierResolver.ts` | duplicate import |
| `PlaceBuildingUseCase.ts` | duplicate import |
| `StartProductionUseCase.test.ts` / `StartResearchUseCase.test.ts` | `prefer-const` |
| `svg-generator/*` (3 files) | duplicate import, `no-control-regex` |
| `visual-asset-manager/backlog-parser.ts` | `no-misleading-character-class` (×2) |

**Warnings:** mostly unused vars in domain/application/web production code + `no-console` in CLI scripts — **nonblocking** for Slice 2.

---

## F. Diagnostic Inventory (grouped)

### G1 — Dev tooling TypeScript (`src/tools/*`, `tools/sync-runtime-visual-assets.ts`)

- **Command:** TYPECHECK  
- **Cause:** `exactOptionalPropertyTypes`, readonly assignments, index-signature access, strict undefined  
- **Runtime impact:** NO  
- **Dev impact:** HIGH when running SVG/asset dev tools or `pnpm sync-visual-assets`  
- **Fix type:** Tooling types / guards / immutable patterns  
- **Coherent with Slice 2:** **YES**

### G2 — Root-included domain/content **test** TypeScript

- **Command:** TYPECHECK  
- **Files:** e.g. `regionalModifierIntegration.test.ts`, `validateWorldReferences.test.ts`  
- **Cause:** Stale fixtures vs current domain props (`regionalModifiers`, mock `never`)  
- **Runtime impact:** NO  
- **Dev impact:** MEDIUM — root `tsc` noise  
- **Fix type:** Test fixture alignment (no gameplay change)  
- **Coherent with Slice 2:** **YES** (same “restore root tsc signal” goal)

### G3 — ESLint **errors** (application + tooling)

- **Command:** LINT  
- **Cause:** Mechanical duplicate imports, `import type`, regex flags, `prefer-const`  
- **Runtime impact:** NO (duplicate imports / lint hygiene)  
- **Dev impact:** MEDIUM — root lint exits nonzero  
- **Fix type:** Lint-safe mechanical edits  
- **Coherent with Slice 2:** **YES** (same slice if limited to **errors only**)

---

## G. Diagnostic Classification

| Group | Classification |
|-------|------------------|
| G1 | **A** — Root tooling type defect |
| G2 | **D** — Test-source (root tsc scope) |
| G3 | **B/C** — Tooling lint + minor production lint |

No **F** environment failures in typecheck/lint output. EPERM on `tsconfig.tsbuildinfo` observed historically on web typecheck — not reproduced as blocker this run.

---

## H. Tooling Usage / Relevance

| Tool | Relevance | Evidence |
|------|-----------|----------|
| **`sync-runtime-visual-assets.ts`** | **OCCASIONAL / ACTIVE** | `package.json` script `sync-visual-assets`; used in ICON/MM integration history |
| **`visual-asset-manager`** (+ svg-generator) | **OCCASIONAL** | Dev API routes, M11 asset workflow; visual track **paused** but tooling retained for catalog/backlog maintenance |

Not **LEGACY** (still scripted and documented), but no longer daily driver post visual-track pause.

---

## I. Root Typecheck Coherence

**ROOT TYPECHECK FAILURE SET: MIXED** — but **two repairable bands**:

1. **Dev tooling cluster** (svg-generator + visual-asset-manager + sync script) — **coherent**  
2. **Small root test fixture cluster** — **coherent** as part of one “root gate” slice

Do **not** split into five micro-slices; one implementation pass with clear file boundaries is appropriate.

---

## J. Root Lint Coherence

**Errors: MIXED** (application + tooling) but **only 12 lines** — mechanically unified as “error zero” objective.

**Can root lint exit 0 be restored in the same slice as root typecheck?** **YES** — fix **errors only**; leave **58 warnings** (accepted/informational for now).

---

## K. Warning Assessment

| Bucket | Treatment |
|--------|-----------|
| Web production unused vars | **LATER** |
| Domain/application unused imports | **LATER** |
| CLI `no-console` in `tools/*` | **ACCEPTED / INFORMATIONAL** for dev scripts |
| Tooling unused vars | **LATER** |

Slice 2 **does not** require warning elimination.

---

## L. Quality Policy Integrity

Slice 2 must fix code/tooling — **no** global tsconfig/eslint weakening, **no** excluding `src/tools` from compilation to fake green.

Policy conflict: **NONE** identified; fixes are strictness-compatible.

---

## M. Generated / Environment Boundary

- No recommendation to hand-edit generated runtime assets.  
- Tooling operates on **source** markdown/backlog and **sync** copies — diagnostics are in **hand-authored** TypeScript.  
- **FETCH_HEAD EPERM:** environment — **out of scope**.

---

## N. Production Impact Check

Root lint/type failures reviewed: **not** material user-facing correctness issues. Duplicate imports and test fixtures do not change shipped behavior if repaired mechanically.

**Real production correctness issue from root debt:** **NO**

---

## O. Materiality Assessment

| Criterion | Assessment |
|-----------|------------|
| Repository-owned | **YES** |
| Weakens dev signal when ignored | **YES** — reviewers routinely classify as “pre-existing” |
| Tooling still used occasionally | **YES** |
| Bounded, mechanical fixes | **YES** |
| Worth Slice 2 | **YES** — but **not** automatic; justified by restored **root** gates after web Slice 1 |

---

## P. Slice-2 Candidate Boundary

**SLICE 2 WORKING NAME:** **POST-V1-ROOT-QUALITY-GATE-SLICE-2**

**PRIMARY FAILURE SET:** Root `tsc --noEmit` failures in `src/tools/**`, `tools/sync-runtime-visual-assets.ts`, and root-included `*.test.ts` under `src/application` / `src/content`; plus all **12** eslint **errors**.

**TARGET COMMANDS:**

- `pnpm typecheck` → **PASS**
- `pnpm lint` → exit **0** (errors fixed; warnings may remain)

**OUT OF SCOPE:** Warning cleanup epic; CI/CD; web package (sealed); visual/gameplay/API semantics; config weakening; EPERM repair.

**WARNINGS POLICY:** Fix errors only; document remaining warnings as deferred.

**DEFINITION OF DONE:**

- `pnpm typecheck` PASS  
- `pnpm lint` no errors (exit 0 unless project treats warnings as errors — verify after error fix)  
- `pnpm test` PASS  
- `pnpm build:web` PASS  
- No gameplay/API/YAML/visual changes  
- Close-candidate report  

**STOP CONDITIONS:** Required domain semantic invention; need to exclude tooling from compile; production behavior change.

---

## Q. Workstream Completion Assessment

**If recommended Slice 2 passes:** **YES** — **POST-V1-WEB-QUALITY-GATE-RESTORATION** workstream **complete** for **material** quality gates (web build/typecheck, full test suite, root typecheck, root lint errors).

**Remaining after workstream:** lint **warnings**, CI/CD, optional doc alignment (`V1_0_KNOWN_ISSUES.md`), EPERM — **not** workstream blockers.

---

## R. Deferred / Separate Debt

- 58 eslint warnings (bulk unused vars)  
- CI/CD pipeline (POST_V1 table)  
- Manual POLISH-08 a11y sweep  
- Documentation stale lines  
- Environment FETCH_HEAD EPERM  

---

## S. Repository Integrity

Review-owned file: this report only. No commit/push. Unrelated working-tree churn untouched.

---

## T. Final Decision

**OPTION A — POST-V1 QUALITY GATE RESTORATION — CONTINUE WITH SLICE 2: POST-V1-ROOT-QUALITY-GATE-SLICE-2**

---

# Post-V1 Root Quality Debt — Slice 2 Gate Review
## Execution Summary

### Baseline

- branch: master · HEAD: 3fa8cf0 · remote: 3fa8cf0 · Slice 1 present: yes · tags unchanged: yes

### Slice-1 Gates

- web package typecheck: **PASS** · build:web: **PASS** · pnpm test: **PASS** · regression: **NO**

### Root Commands

- pnpm typecheck: **FAIL** (tooling + root test fixtures)  
- pnpm lint: **FAIL** — **12 errors**, **58 warnings**

### Diagnostic Groups

1. Dev tooling TS (svg-generator, visual-asset-manager, sync script)  
2. Root domain/content test TS fixtures  
3. ESLint errors (tooling + small application set)

### Tooling Relevance

- visual-asset-manager / svg-generator: **OCCASIONAL**  
- sync-runtime-visual-assets: **OCCASIONAL / ACTIVE** (scripted)

### Coherence

- root typecheck: **MIXED** (two bounded bands, one slice OK)  
- root lint errors: **MIXED** but small  
- both gates in one bounded slice: **YES** (errors-only lint policy)

### Materiality

- repository-owned: **YES** · weakens signal: **YES** · environment-only: **NO** · bounded repair: **YES**

### Policy

- weakening required: **NO** · generated hand-edit: **NO** · gameplay decision: **NO**

### Recommended Slice 2

- name: **POST-V1-ROOT-QUALITY-GATE-SLICE-2**  
- targets: `pnpm typecheck`, eslint **errors** cleared for `pnpm lint`  
- scope: tooling TS + sync script + root test typings + 12 lint errors  
- DoD: root typecheck PASS, lint error-free, web gates + test remain PASS

### Workstream Completion

- after Slice 2: workstream **COMPLETE** for material gates  
- remaining: warnings, CI/CD, docs, EPERM

### Final Decision

**OPTION A**
