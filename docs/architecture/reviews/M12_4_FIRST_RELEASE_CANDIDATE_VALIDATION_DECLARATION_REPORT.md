# M12.4 First Release Candidate Validation & Declaration Report

**Project:** Project Genesis  
**Workstream:** M12.4 — First Release Candidate Validation & Declaration  
**Report date:** 2026-09-01  
**Branch:** `master`  
**M11 / Production status:** Unchanged — CLOSED / PASS

---

## A. Executive Summary

| Item | Result |
|------|--------|
| RC identifier | **`1.0.0-rc.1`** (M12 release decision) |
| RC git tag | **`v1.0.0-rc.1`** (annotated, local) |
| RC candidate commit | **`442665cd6437bdebff88fd1540cedc689238c240`** |
| Runtime baseline | `ce08704` (unchanged); post-baseline deltas **DOC_ONLY** |
| Package versions | **Unchanged** at `0.1.0` — RC identity via git tag |
| Automated RC gates | **911 / 911 PASS** |
| Production dual-runtime smoke | **PASS** |
| Save/load continuation | **PASS** (`tickAfterLoad > tickAtLoad`) |
| Viewport 1236×697 regression guard | **PASS** |
| Pre-tag RC gate decision | **PASS** |
| QA baseline | **OPENED** — target `v1.0.0-rc.1` @ `442665c` |
| Tag remote push | **`TAG_PUSH_PENDING`** — no repo policy requires immediate push |
| **Final decision** | **OPTION A — FIRST FORMAL RELEASE CANDIDATE DECLARED — PASS** |

Project Genesis is now a **formally declared Release Candidate**. This is **not** Version 1.0. M12 remains open.

---

## B. Starting Repository State

| Item | Value |
|------|-------|
| Branch | `master` |
| Starting HEAD | `442665cd6437bdebff88fd1540cedc689238c240` |
| Prior RC baseline | `ce08704` |
| Prior doc closeout | `3721162` |
| Prior gate audit | `442665c` — M12.3 report |
| Git tags (start) | **None** |
| Working tree | Unrelated local design/M11/prompt/save artifacts present — **excluded from candidate** |

### Post-`ce08704` change classification

| Commit | Classification | RC-relevant? |
|--------|----------------|:------------:|
| `3721162` | **DOC_ONLY** | No |
| `442665c` | **DOC_ONLY** (M12.3 audit report) | No |

**No RUNTIME_RELEVANT changes** after validated M12.2 baseline.

---

## C. RC Identifier / Tag Convention Decision

### Repository search results

| Source | Finding |
|--------|---------|
| Git tags | **None** existed before this slice |
| `package.json` versions | `0.1.0` (root, web, api) |
| `RELEASE_STRATEGY.md` | Lifecycle mentions RC; **no tag naming convention** |
| `M12_3` audit | Recommended `v1.0.0-rc.1` as decision delta |
| Changelog / release scripts | **None** |

### Decision

| Field | Value | Classification |
|-------|-------|----------------|
| Product RC version | `1.0.0-rc.1` | **M12 RELEASE DECISION** (SemVer pre-release) |
| Git tag | `v1.0.0-rc.1` | **M12 RELEASE DECISION** |
| Pre-existing policy | **None** for RC naming | — |

**Rationale:** Smallest defensible SemVer pre-release identifier; explicitly recorded here as an M12 decision, not misrepresented as prior repository policy.

---

## D. Package Version Decision

| Package | Version | Changed? |
|---------|---------|:--------:|
| Root | `0.1.0` | No |
| `@project-genesis/web` | `0.1.0` | No |
| `@project-genesis/api` | `0.1.0` | No |

**Decision:** Package versions **not required** for operational RC identity. RC is represented by **git tag + declaration artifact**. Final `1.0.0` remains for M12 close (M12.9).

No candidate-preparation metadata commit was needed.

---

## E. Candidate Preparation

| Step | Action | Result |
|------|--------|--------|
| M12.3 report committed? | Yes — already at `442665c` | **Done** |
| Runtime/metadata commit needed? | No | **Skipped** |
| Unrelated files staged? | No | **Verified** |

No additional preparation commit before validation.

---

## F. RC Candidate Commit

```text
RC_CANDIDATE_COMMIT=442665cd6437bdebff88fd1540cedc689238c240
```

| Item | Value |
|------|-------|
| Short hash | `442665c` |
| Message | *M12: add release gate readiness audit report* |
| Runtime source | Same as `ce08704` + documentation-only commits |

---

## G. Candidate Isolation / Working Tree Assessment

| Check | Result |
|-------|--------|
| `git rev-parse HEAD` == `RC_CANDIDATE_COMMIT` at validation start | **Yes** |
| Staged diff empty | **Yes** |
| Tracked candidate files modified during validation | **No** |
| Unrelated dirty files affect TS/Next/API build? | **No** |
| Temp smoke save affects runtime? | **No** — `saves/m12-4-rc-smoke-temp.json` excluded from commits |

**Candidate sufficiently isolated** for reproducible validation.

---

## H. Automated RC Gates

Executed **NEWLY** on `442665c` with shell `NODE_ENV` cleared before `pnpm test`.

| Command | Exit | Result | RC Gate? |
|---------|-----:|--------|:--------:|
| `pnpm test` | 0 | **911 / 911 PASS** (247 files, ~104 s) | **Yes** |
| `pnpm build:web` | 0 | **PASS** (Next.js 15.5.20) | **Yes** |
| `pnpm --filter @project-genesis/api build` | 0 | **PASS** | **Yes** |

**Operational note:** `NODE_ENV=production` in shell breaks React Testing Library — cleared before test run per M12.2.

---

## I. Diagnostic Root Commands

| Command | Exit | Classification vs M12.2/M12.3 |
|---------|-----:|-------------------------------|
| `pnpm build` | 2 | **PRE_EXISTING_NON_RC_DEBT** — svg-generator, visual-asset-manager, sync-runtime-visual-assets |
| `pnpm typecheck` | 2 | **PRE_EXISTING_NON_RC_DEBT** — same clusters |
| `pnpm lint` | 1 | **PRE_EXISTING_NON_RC_DEBT** — 12 errors, 53 warnings (unchanged) |

**No NEW_RC_REGRESSION** identified.

---

## J. Production Runtime Startup

### API

```powershell
cd apps/api
$env:NODE_ENV='production'
pnpm start:prod
```

| Check | Result |
|-------|--------|
| Executes `dist/apps/api/src/main.js` | **PASS** |
| `AppModule` only (no `DevModule`) | **PASS** — log shows GameModule + DashboardModule only |
| Content loads | **PASS** — 9 resources, 23 buildings |
| `GET /health` | **PASS** — `{ ok: true }` |
| `GET /api/dev/visual-assets` | **404 Not Found** | **PASS** |

### Web

```powershell
pnpm --filter @project-genesis/web start
```

| Check | Result |
|-------|--------|
| Next.js production server | **PASS** — `http://127.0.0.1:3000` |
| `/game` loads playable session | **PASS** |
| Dev server not used | **PASS** |

---

## K. Connectivity Validation

| Check | Result | Evidence |
|-------|--------|----------|
| REST direct (`:3001/api/dashboard`) | **PASS** | HTTP 200 |
| REST web proxy (`:3000/api/dashboard`) | **PASS** | `ok: true` |
| WebSocket / live ticks | **PASS** | Browser tick 25→85 without manual refresh; notification stream updating |
| Reconnect oscillation | **PASS** | No permanent stale banner observed |
| Stale banner regression | **PASS** | `staleBanner: false` over 12 s CDP observation |

---

## L. Gameplay Smoke

| Step | Result |
|------|--------|
| Playable session | **PASS** — M12.4 RC Smoke Corp |
| ≥ 10 live ticks | **PASS** — observed ticks 25→85+ |
| Company navigation | **PASS** — Executive dashboard, Kernkennzahlen visible |
| World navigation | **PASS** — `/game?screen=world`, Genesis World map |
| Production navigation | **PASS** — `/game?screen=production`, Rezeptkatalog |
| Gameplay command | **PASS** — `POST /api/simulation/step` |
| State update | **PASS** — tick and finance changed after commands |
| Save | **PASS** — `saves/m12-4-rc-smoke-temp.json` |
| Load | **PASS** — session restored |

---

## M. Save / Load Continuation

Production API smoke (pause-before-save pattern):

| Metric | Value |
|--------|------:|
| **tickBeforeSave** | **22** |
| **tickAtLoad** | **22** |
| **tickAfterLoad** | **25** |
| **tickAfterLoad > tickAtLoad** | **YES** |
| Cash restored | **YES** |
| Save restored tick match | **YES** |

Browser also showed load notification: *Spielstand geladen: saves/m12-4-rc-smoke-temp.json*.

---

## N. Viewport Regression Validation

### Required: 1236 × 697

| Guard | Observation duration | Result |
|-------|---------------------:|--------|
| Viewport size | — | **1236 × 697 confirmed** (CDP `Emulation.setDeviceMetricsOverride`) |
| Live ticks during observation | 12 s | Tick **40 → 46** (6 ticks) |
| Tick-driven loading flicker | 12 s | **PASS** — `aria-busy` flips: **0** |
| Reconnect/stale overlay | 12 s | **PASS** — `staleBanner: false` |
| Dashboard KPI overlap | Company dashboard | **PASS** — 8 KPI articles visible; no bounding-box overlap detected |
| Workspace overflow | Company dashboard | Minor internal scroll (`overflow: true`) — **NON_BLOCKING** per M12 containment delta; not KPI clipping/overlap |
| Navigation usable | World + Production | **PASS** |

### Recommended: 1920 × 1080

| Check | Result |
|-------|--------|
| Viewport set | **1920 × 1080** |
| Production screen @ tick 85 | **PASS** — layout usable, recipes visible |

---

## O. Known Issue Review

| Issue | M12.3 disposition | M12.4 classification |
|-------|-------------------|----------------------|
| Root build/typecheck/lint debt | NON_BLOCKING | **NON_BLOCKING_RC_DEBT** — unchanged clusters |
| POLISH-08 manual a11y sweep | NON_BLOCKING | **NON_BLOCKING_RC_DEBT** |
| POLISH-05 typecheck clusters | NON_BLOCKING | **NON_BLOCKING_RC_DEBT** |
| Mockup parity gaps | NON_BLOCKING | **NON_BLOCKING_RC_DEBT** |
| Session-scoped event log persistence | NON_BLOCKING | **NON_BLOCKING_RC_DEBT** |
| Undefined numeric performance contract | DECISION_PENDING | **DEFERRED** — M12.6 |
| Outdated README / missing release notes | DOCUMENTATION gap | **V1_BLOCKER** (not RC) |
| Flicker / reconnect / layout regressions | RESOLVED @ ce08704 | **RESOLVED** — no regression observed |

**No unresolved RC_BLOCKER** identified during validation.

---

## P. Pre-Tag RC Gate Decision

# **PASS**

All mandatory pre-tag items satisfied:

- [x] Exact candidate commit identified
- [x] Candidate source immutable during validation
- [x] `pnpm test` PASS
- [x] `pnpm build:web` PASS
- [x] API production build PASS
- [x] No new blocking diagnostic regression
- [x] Compiled API starts (`AppModule`, dev routes 404)
- [x] Production Web starts
- [x] REST direct + proxy PASS
- [x] WebSocket / live ticks PASS
- [x] ≥ 10 ticks observed
- [x] Company / World / Production navigation PASS
- [x] Gameplay command + state update PASS
- [x] Save / load / post-load continuation PASS
- [x] 1236×697 explicit viewport validation PASS
- [x] Known issue review — no RC blocker

---

## Q. RC Tag Creation

| Field | Value |
|-------|-------|
| **RC_TAG** | `v1.0.0-rc.1` |
| **RC_CANDIDATE_COMMIT** | `442665cd6437bdebff88fd1540cedc689238c240` |
| Tag type | Annotated |
| Tag message | *Project Genesis 1.0.0 Release Candidate 1* |
| `git rev-list -n 1 v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` ✓ |
| Pre-existing tag conflict | **None** |
| Remote push | **`TAG_PUSH_PENDING`** — repository does not define mandatory tag-push workflow |

Tag created **only after** Pre-Tag RC Gate Decision **PASS**.

---

## R. Formal RC Declaration

**Project Genesis Release Candidate `1.0.0-rc.1` is hereby declared** as of 2026-09-01.

| Property | Value |
|----------|-------|
| RC identity | `v1.0.0-rc.1` |
| Source commit | `442665c` |
| Runtime topology | Next.js Web (:3000) + compiled NestJS API (:3001) + `game-content/` + `saves/` |
| Operational contract | `docs/development/RC_RUNTIME_CONTRACT.md` |
| Test baseline | **911 / 911 PASS** |
| Runtime baseline | `ce08704` (runtime); documentation through `442665c` |

### Explicit boundary

**FORMAL RC ≠ VERSION 1.0 RELEASED**

M12 milestone remains **open**. V1.0 exit criteria (Executive Review, final tag, remaining deliverables) are **not satisfied**.

---

## S. QA Baseline Opening

```text
QA_TARGET_RC=v1.0.0-rc.1
QA_TARGET_COMMIT=442665cd6437bdebff88fd1540cedc689238c240
```

QA approval cycle **opened** (not closed). Known QA categories for M12.7:

| Category | RC baseline evidence |
|----------|---------------------|
| Automated regression | 911/911 @ `442665c` |
| Production runtime smoke | M12.4 PASS (this report) |
| Manual gameplay workflows | Partial — smoke executed; full sign-off pending |
| Save/load | PASS — production path validated |
| Responsive regression | 1236×697 PASS; 1920×1080 spot-check PASS |
| Known issue review | No RC blockers; debt catalogued |

---

## T. Remaining V1.0 Gates

| Gate | Status after M12.4 |
|------|-------------------|
| Formal Release Candidate | **PASS** — declared `v1.0.0-rc.1` |
| Stable Savegames certification | **OPEN** — M12.5 |
| Performance Validation | **OPEN** — M12.6 |
| QA Approval | **OPEN** — M12.7 (baseline opened) |
| Final Documentation | **OPEN** — M12.8 |
| Executive Review | **OPEN** — M12.9 |
| Version 1.0 tag (`v1.0.0`) | **OPEN** — M12.9 |

---

## U. Working Tree After Validation

| Category | Status |
|----------|--------|
| Tracked candidate files | **Unmodified** |
| This report | New (post-tag documentation) |
| `IMPLEMENTATION_PROGRESS.md` | Updated (post-tag status) |
| RC tag | Local annotated tag created |
| Temp smoke save | `saves/m12-4-rc-smoke-temp.json` — untracked, excluded |
| Unrelated local work | Still present — excluded per M12.4 hygiene rules |

---

## V. Recommended Immediate Next Slice

**M12.5 — Savegame Certification Matrix**

Formal evidence-only certification of V1/V2/V3 migration and round-trip coverage against M12 Stable Savegames deliverable. No schema changes expected.

Do **not** begin automatically — await ChatGPT Gate Review.

---

## Validation Matrix (Required)

| Check | Required | Result |
|-------|:--------:|--------|
| Exact candidate commit | Yes | **442665c** |
| RC convention decision | Yes | **1.0.0-rc.1 / v1.0.0-rc.1** |
| `pnpm test` | Yes | **911/911 PASS** |
| `pnpm build:web` | Yes | **PASS** |
| API production build | Yes | **PASS** |
| `pnpm build` root | Diagnostic | **FAIL** (pre-existing) |
| `pnpm typecheck` root | Diagnostic | **FAIL** (pre-existing) |
| `pnpm lint` root | Diagnostic | **FAIL** (pre-existing) |
| Compiled API startup | Yes | **PASS** |
| Production Web startup | Yes | **PASS** |
| REST direct | Yes | **PASS** |
| REST Web proxy | Yes | **PASS** |
| WebSocket | Yes | **PASS** |
| ≥ 10 simulation ticks | Yes | **PASS** |
| Company navigation | Yes | **PASS** |
| World navigation | Yes | **PASS** |
| Production navigation | Yes | **PASS** |
| Gameplay command | Yes | **PASS** |
| State update | Yes | **PASS** |
| Save | Yes | **PASS** |
| Load | Yes | **PASS** |
| Post-load continuation | Yes | **PASS** (25 > 22) |
| 1236×697 regression guard | Yes | **PASS** |
| Larger desktop viewport | Recommended | **PASS** (1920×1080) |
| Known issue review | Yes | **PASS** — no RC blocker |
| RC tag → validated commit | Yes | **PASS** |
| QA baseline opened | Yes | **PASS** |

---

## Final Decision

# **OPTION A — FIRST FORMAL RELEASE CANDIDATE DECLARED — PASS**

---

*End of M12.4 First Release Candidate Validation & Declaration Report.*
