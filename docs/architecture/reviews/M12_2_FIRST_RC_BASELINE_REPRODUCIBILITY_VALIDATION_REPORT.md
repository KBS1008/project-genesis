# M12.2 First RC Baseline & Reproducibility Validation Report

**Project:** Project Genesis  
**Workstream:** M12.2 — First RC Baseline & Reproducibility Validation  
**Report date:** 2026-08-30  
**Branch:** `master`  
**M11 / Production status:** Unchanged — CLOSED / PASS

---

## A. Executive Summary

| Item | Result |
|------|--------|
| RC baseline commit | **`ce08704`** — already present at slice start (created end of M12.1 session) |
| Reproducibility from committed source | **PASS** |
| `pnpm test` | **911 / 911 PASS** |
| `pnpm build:web` | **PASS** |
| `pnpm --filter @project-genesis/api build` | **PASS** |
| Production dual-runtime smoke | **PASS** |
| Save/load + post-load tick continuation | **PASS** |
| Documentation correction (403 vs 404) | **Applied** (uncommitted doc delta) |
| **Final decision** | **OPTION A — FIRST RC BASELINE REPRODUCIBLE — PASS** |

The first M12 RC source baseline is **`ce08704`**. That commit rebuilds, starts as Web + compiled API, and supports playable production-style runtime with REST, WebSocket ticks, gameplay commands, and save/load continuation.

---

## B. Starting Repository State

| Item | Value |
|------|-------|
| Branch | `master` |
| Starting HEAD | `ce08704` — *Establish M12 release baseline with compiled API production path, dual-runtime RC contract, and UI stability fixes.* |
| Prior reference HEAD | `958e94f` (M11 Gate 4 closeout) |
| Dirty at slice start | **Yes** — unrelated local work only |
| Staged at slice start | **None** |
| Untracked at slice start | Design assets, prompts, saves, M12.2 prompt file |

**Note:** M12.2 did not need a second baseline commit — the coherent RC source set was committed and pushed as `ce08704` immediately before this slice.

---

## C. Documentation Correction

### 403/404 finding

M12.1 runtime validation observed `/api/dev/visual-assets` → **404 Not Found** under production `AppModule`.  
`RC_RUNTIME_CONTRACT.md` incorrectly stated dev routes return **403 Forbidden** when `NODE_ENV=production`.

### Authoritative behavior (verified)

| Runtime | Module | Dev routes registered? | `/api/dev/*` response |
|---------|--------|------------------------|---------------------|
| Production RC | `AppModule` | **No** — `DevModule` not imported | **404 Not Found** |
| Development | `AppDevModule` | Yes | 200 (routes active); `DevOnlyGuard` would return 403 only if `NODE_ENV=production` while DevModule is loaded |

Evidence: `apps/api/src/app.module.ts` imports only `GameModule`. Production smoke: `GET /api/dev/visual-assets` → **404**.

### Files changed (M12.2, uncommitted)

- `docs/development/RC_RUNTIME_CONTRACT.md` — corrected dev-route behavior; clarified production vs development paths

No runtime code changed. Existing `production-build-scope.test.ts` already asserts `AppModule` excludes `DevModule`.

---

## D. Working Tree Classification

| Path | Classification | Included in RC baseline? | Justification |
|------|----------------|-------------------------:|---------------|
| `apps/api/**`, `apps/web/src/presentation/**` (M12) | M12_REQUIRED | **Yes** (in `ce08704`) | Runtime fixes, API production path, tests |
| `src/application/facade/GameSession.ts` | M12_REQUIRED | **Yes** | Production type fix |
| `docs/development/RC_RUNTIME_CONTRACT.md` | M12_REPORT_DOC | **Yes** (in `ce08704`; M12.2 doc delta pending) | RC contract |
| `docs/architecture/reviews/M12_*.md` | M12_REPORT_DOC | **Yes** (in `ce08704`) | M12 evidence |
| `docs/development/IMPLEMENTATION_PROGRESS.md` | M12_REPORT_DOC | **Yes** (in `ce08704`) | Status tracking |
| `package.json` (`dev:stop`/`dev:restart`) | M12_REQUIRED | **Yes** | Dev convenience |
| `docs/design/**` | UNRELATED_DESIGN_ASSET | **No** | Design/mockup churn |
| `docs/development/Prompts/**` | PROMPT_LOCAL_NOTE | **No** | Local prompt drafts |
| `saves/**`, `apps/api/saves/**` | TEMP_SAVE | **No** | Smoke/test artifacts |
| `apps/api/dist/**`, `apps/web/.next/**` | GENERATED | **No** | Build outputs (gitignored) |
| `docs/architecture/reviews/M11_GATE_3_*` (modified) | UNKNOWN / unrelated | **No** | Pre-existing local edits |
| `docs/architecture/reviews/M11_PHASE6_4_*` (modified) | UNKNOWN / unrelated | **No** | Pre-existing local edits |
| Deleted design scripts/images | UNRELATED_DESIGN_ASSET | **No** | Unrelated local cleanup |

---

## E. RC Baseline Manifest

**Commit:** `ce08704` — 51 files, +2944 / −138 lines

| Area | Files |
|------|-------|
| API production path | `apps/api/package.json`, `tsconfig.build.json`, `main.ts`, `main.dev.ts`, `api-bootstrap.ts`, `app.module.ts`, `app.dev.module.ts`, `game.controller.ts`, dev test updates, `production-build-scope.test.ts` |
| Web runtime stability | `useScreenQuery.ts`, `GameWorkspaceProvider.tsx`, screen query keys, navigation-state, layout CSS, KPI strips, dashboard CSS |
| Tests | `useScreenQuery.test.ts`, `screen-query-key-stability.test.ts`, reconnect/layout/tick-sync tests, etc. |
| Shared runtime | `GameSession.ts` (regionId spread) |
| Tooling | Root `package.json` dev:stop/restart |
| Documentation | `RC_RUNTIME_CONTRACT.md`, 7× M12 review reports, `IMPLEMENTATION_PROGRESS.md` |

Full file list: `git show ce08704 --stat`

---

## F. Explicit Exclusion Manifest

| Category | Excluded paths | Reason |
|----------|----------------|--------|
| Design assets | `docs/design/Bilder/**`, `docs/design/Mockups/**`, UI guideline drafts | Unrelated to RC source |
| Prompts | `docs/development/Prompts/**` | Local notes |
| Saves | `saves/**`, `apps/api/saves/m12-2-smoke-temp.json` | Temporary smoke artifacts |
| Generated | `apps/api/dist/`, `apps/web/.next/` | Rebuilt from source |
| Unrelated M11 doc edits | `M11_GATE_3_*`, `M11_PHASE6_4_*` modifications | Not part of M12 RC |
| Unrelated deletions | Legacy design scripts/images | Accidental/local cleanup — not required for RC |

---

## G. Pre-Commit Validation

Executed on HEAD `ce08704` with `NODE_ENV` unset (critical — `NODE_ENV=production` breaks React Testing Library with `React.act is not a function`).

| Command | Exit | Result |
|---------|-----:|--------|
| `pnpm test` | 0 | **911 / 911 PASS** (247 files) |
| `pnpm build:web` | 0 | **PASS** |
| `pnpm --filter @project-genesis/api build` | 0 | **PASS** |
| `pnpm build` | 2 | **FAIL** — dev tooling TS debt |
| `pnpm typecheck` | 2 | **FAIL** — same clusters |
| `pnpm lint` | 1 | **FAIL** — 12 errors, 53 warnings |

No new error clusters introduced by M12.2 (doc-only delta).

---

## H. Baseline Commit

| Item | Value |
|------|-------|
| Commit message | `Establish M12 release baseline with compiled API production path, dual-runtime RC contract, and UI stability fixes.` |
| Commit hash | **`ce08704`** |
| Files committed | 51 |
| Staged verification | Explicit staging — no design assets, prompts, or saves included |
| Push status | Pushed to `origin/master` (prior session) |

M12.2 validated this existing commit rather than creating a duplicate baseline commit.

---

## I. Post-Commit Repository State

| Item | Value |
|------|-------|
| HEAD | `ce08704` |
| Remaining dirty (tracked) | M11 review edits, design deletions/changelog |
| Remaining untracked | Design assets, prompts, saves, M12.2 prompt + this report |
| Uncommitted M12.2 delta | `RC_RUNTIME_CONTRACT.md` (403→404 correction), this report |

**Classification of remainder:** unrelated pre-existing local work (A) + smoke-generated saves (B) + M12.2 doc/report artifacts (E — pending commit).

---

## J. Rebuild From Committed Baseline

Rebuilt after validation (fresh `pnpm build:web` + API build on `ce08704`):

| Artifact | Path |
|----------|------|
| Web production bundle | `apps/web/.next/` |
| API compiled entry | `apps/api/dist/apps/api/src/main.js` |
| Shared runtime JS | `apps/api/dist/src/**` |

Both builds **PASS** from committed source.

---

## K. Dual-Runtime Production Smoke

### API (`NODE_ENV=production`, `pnpm start:prod`)

| Check | Result |
|-------|--------|
| Starts successfully | **PASS** — `node dist/apps/api/src/main.js` |
| Compiled JS executing | **PASS** — log shows `AppModule` only (no DevModule) |
| Content loads | **PASS** — 9 resources, 23 buildings |
| Health | **PASS** — `GET /health` → `{ ok: true }` |
| DevModule absent | **PASS** — `/api/dev/visual-assets` → **404** |

### Web (`pnpm --filter @project-genesis/web start`)

| Check | Result |
|-------|--------|
| Production build start | **PASS** |
| `/game` loads | **PASS** — session restored, dashboard rendered |

### Connectivity

| Check | Result |
|-------|--------|
| REST direct (`:3001/api/dashboard`) | **200** |
| REST web proxy (`:3000/api/dashboard`) | **200** |
| WebSocket / ticks | **PASS** — browser tick 8→40 after load; notification stream updating |
| Reconnect oscillation | **PASS** — no stale banner observed |

---

## L. Gameplay Smoke

| Step | Result |
|------|--------|
| Playable session | **PASS** — Genesis Industries, tick advancing |
| ≥ 10 ticks | **PASS** — observed ticks 8–40+ |
| Company navigation | **PASS** — Executive dashboard, KPI regions visible |
| World / Production navigation | **PASS** (API session active; nav controls enabled in browser) |
| Gameplay command | **PASS** — `POST /api/simulation/step` tick 7→8 |
| State update | **PASS** — cash/transactions updated after ticks |
| Save | **PASS** — `saves/m12-2-smoke-temp.json` |
| Load | **PASS** — browser notification + API session restored |

---

## M. Post-Load Continuation Evidence

REST smoke (production API):

| Metric | Value |
|--------|------:|
| **tickBeforeSave** | **7** |
| tickAtSaveMoment | 9 |
| **tickAtLoad** | **8** |
| **tickAfterLoad** (5s later) | **11** |
| **tickAfterLoad > tickAtLoad** | **YES** (11 > 8) |

Browser after load: tick **40** with live notification stream — simulation continued after restore.

---

## N. Regression Guards

| Guard | Viewport | Result |
|-------|----------|--------|
| Tick-driven loading flicker | Production `/game` | **PASS** — dashboard stable during tick updates |
| Reconnect oscillation | Production `/game` | **PASS** — no permanent stale banner |
| Dashboard KPI overlap/clipping | Observed @ loaded dashboard | **PASS** — Kernkennzahlen articles visible, no overlap observed |
| 1236 × 697 formal pass | Not re-measured with CDP this slice | **Qualitative PASS** from prior M12 containment delta + production observation |

No new layout or flicker regression detected.

---

## O. Full Validation Matrix

| Command | Exit | RC Gate? | Result |
|---------|-----:|:--------:|--------|
| `pnpm test` | 0 | **Yes** | 911/911 PASS |
| `pnpm build:web` | 0 | **Yes** | PASS |
| `pnpm --filter @project-genesis/api build` | 0 | **Yes** | PASS |
| `pnpm build` | 2 | No | FAIL — tooling debt |
| `pnpm typecheck` | 2 | No | FAIL — tooling debt |
| `pnpm lint` | 1 | No | FAIL — 12 errors |

---

## P. Root Debt Delta

| Command | M12.1 cluster | M12.2 cluster | New cluster? |
|---------|---------------|---------------|:------------:|
| `pnpm build` | svg-generator, visual-asset-manager, sync-runtime-visual-assets | Same | **No** |
| `pnpm typecheck` | Same + web test-only TS | Same | **No** |
| `pnpm lint` | 12 errors, 53 warnings | 12 errors, 53 warnings | **No** |

Classification: **PRE_EXISTING_NON_RC_DEBT** — no `NEW_M12_REGRESSION`.

**Operational note:** Running `pnpm test` with `NODE_ENV=production` in the shell causes mass React test failure (`React.act is not a function`). Clear `NODE_ENV` before test runs.

---

## Q. Reproducibility Assessment

**Can this exact committed baseline be rebuilt and started as the actual Project Genesis Web + API player runtime?**

## **YES**

Evidence: commit `ce08704` → builds pass → compiled API + production web start → REST/WebSocket/ticks/gameplay/save/load/continuation all validated.

---

## R. Remaining Release Risks

| Risk | Severity | Notes |
|------|----------|-------|
| No RC tag / version bump | Low | Deferred per M12 plan |
| Root tooling debt (`build`/`typecheck`/`lint`) | Low | Non-RC gates; unchanged |
| Deployment packaging undefined | Medium | Local RC contract only |
| Temp smoke saves in working tree | Low | Excluded from baseline |
| M12.2 doc correction uncommitted | Low | 403→404 fix in `RC_RUNTIME_CONTRACT.md` |
| QA / performance / stable-savegame formal validation | Medium | M12 deliverables still open |

---

## S. Recommended Next M12 Slice

**M12.3 — RC Documentation Delta Commit & Internal QA Checklist**

Smallest next package:

1. Commit M12.2 artifacts: `RC_RUNTIME_CONTRACT.md` correction + this report (+ optional `IMPLEMENTATION_PROGRESS.md` M12.2 status line).
2. Author minimal **RC validation checklist** (extends smoke section of `RC_RUNTIME_CONTRACT.md`) for repeatability by humans/CI later.
3. Begin **formal QA Approval** prep — not full QA sign-off yet.

Do **not** start Docker/CI, version tagging, or performance validation in the same slice.

---

## Final Decision

# **OPTION A — FIRST RC BASELINE REPRODUCIBLE — PASS**

---

*End of M12.2 First RC Baseline & Reproducibility Validation Report.*
