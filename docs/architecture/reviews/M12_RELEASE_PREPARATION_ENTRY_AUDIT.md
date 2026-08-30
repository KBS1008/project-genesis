# M12 Release Preparation Entry Audit

**Project:** Project Genesis  
**Workstream:** M12 Release — Entry Audit (read-only)  
**Report date:** 2026-08-30  
**Audit type:** READ-ONLY RELEASE PREPARATION AUDIT — no implementation, no config changes  
**Repository baseline:** branch `master`, HEAD `958e94f` (M11 Gate 4 closeout, pushed)  
**M11 status:** CLOSED — PASS (unchanged)  
**M11 Production track:** CLOSED — PASS (unchanged)

---

## 1. Executive Summary

This audit reconstructs the M12 release contract from repository evidence and determines what is required to produce the first believable Release Candidate (RC) for Project Genesis v1.0.

| # | Mission Question | Answer |
|---|------------------|--------|
| 1 | Runtime/build artifacts for release? | **Two runtime processes:** Next.js web (`apps/web/.next`) + NestJS API (simulation, REST, WebSocket). Shared monorepo domain code under `src/`. Content at `game-content/`. Saves under `saves/`. |
| 2 | Build commands required for RC? | **`pnpm test`** and **`pnpm build:web`** — both **PASS** today. API has no passing production compile; dev/runtime uses `tsx`. |
| 3 | Is root `pnpm build` a release gate? | **No** — it is root monorepo `tsc` validation over `src/`, `tests/`, `tools/`; not referenced as a release gate in `QUALITY_GATES.md` or M11/M12 closeout evidence. |
| 4 | Is `pnpm typecheck` a release gate? | **No** — not listed in Release Gates; `next build` runs its own web typecheck and **passes**. Root/API typecheck fails on historical dev-tooling debt. |
| 5 | Is `pnpm lint` a release gate? | **Partially for web only** — `next build` enforces ESLint on web sources and **passes** (warnings only). Root `pnpm lint` is **not** a documented release gate and **fails** (12 errors). |
| 6 | API separate build/deploy? | **Yes — runtime-required, packaging undefined.** API must run for gameplay. Separate NestJS app on port 3001. No Dockerfile/CI/deploy docs. `pnpm --filter @project-genesis/api build` **FAIL**. Production start script uses **`tsx src/main.ts`**, not compiled output. |
| 7 | What does “Release Candidate” mean here? | **M12 deliverable** — a verified project state between Quality Gates and Release Validation (`RELEASE_STRATEGY.md` lifecycle). No RC packaging script, tag convention, or artifact bundle exists in-repo yet. Closest operational definition: **reproducible commit + passing regression + `pnpm build:web` + dual-process runtime (`web` + `api`) manually validated.** |
| 8 | Status of five M12 deliverables? | See §12 — all **partial or not started**; web build readiness improved; RC packaging/QA/formal validation **not started**. |
| 9 | Quality gates for M12? | Standard nine gates + **Release Gates** (Executive Review, Performance Review, Savegame Compatibility, Regression Suite, Documentation Review). M12 **exit criteria** add Quality Gates passed, Executive Review approved, Version 1.0 tagged. |
| 10 | Next smallest M12 package? | **M12 RC Baseline Commit & Dual-Runtime Start Contract** — commit uncommitted M12 prep stack, then define/document minimal RC runtime (web `.next` + API `tsx`/compiled path, env vars, content/saves layout). Do **not** invent full deployment infra in the same slice. |

**Artifact model classification:** **ARTIFACT MODEL B — WEB + API** (see §10).

**Working tree warning:** All M12 technical work since M11 Gate 4 remains **uncommitted**. RC cannot be reproducible from `958e94f` alone.

---

## 2. Repository Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD | `958e94f60f2b9e8292f49eb022c2a186e768be6c` — *Complete M11 Gate 4 final milestone closeout with validated exit criteria.* |
| Working tree | **NOT CLEAN** — M12 prep + UI stability + layout + tests + reports uncommitted; unrelated design assets/prompts/saves also present |
| Last M11 closeout | `958e94f` (Gate 4 report references prior HEADs `6da0473`, production `072e01b`) |
| Last M12 build-readiness state | Uncommitted — `M12_RELEASE_BUILD_READINESS_STABILIZATION_REPORT.md` |
| Current regression baseline | **909 / 909 PASS** (246 test files), exit 0, ~105 s |
| Current web build baseline | **`pnpm build:web` PASS**, exit 0 (Next.js 15.5.20) |

### 2.1 Commits Since Key Milestones

| Milestone marker | Commits on `master` since? | Notes |
|------------------|---------------------------|-------|
| M11 Gate 4 (`958e94f`) | **0** | HEAD is Gate 4 closeout |
| M12 Build Readiness | **0 committed** | Fixes live in working tree only |
| M12 Flicker Incident | **0 committed** | `useScreenQuery.ts`, tests — uncommitted |
| M12 Layout Delta | **0 committed** | CSS/KPI strips — uncommitted |

### 2.2 Uncommitted M12-Relevant Changes (RC Risk)

**Presentation / runtime (M12 prep):**

- `apps/web/src/presentation/state/navigation-state.ts` — warehouse `EntitySelection` integration
- `apps/web/src/presentation/navigation/entity-selection-labels.ts`
- `apps/web/src/presentation/screens/company/CompanyDashboardScreen.tsx`
- `apps/web/src/presentation/hooks/useScreenQuery.ts` + `useScreenQuery.test.ts` (flicker fix)
- `apps/web/src/presentation/state/GameWorkspaceProvider.tsx` (WebSocket lifecycle / query invalidation)
- Screen query key stability across: Buildings, ExecutiveDashboard, Market, Production, Query, Reports, Research, Transport, World screens
- Layout containment: `operations-dashboard-layout.css`, `OperationsKpiStrip.tsx`, `OperationsOverviewStrip.tsx`, dashboard/layout CSS
- Tests: reconnect, layout, tick-sync rules, screen-query-key-stability, operations-dashboard-layout, world-search-selection, etc.

**Root tooling:**

- `package.json` — `dev:stop`, `dev:restart` scripts (dev convenience, not release artifact)

**Documentation (untracked M12 reports):**

- `M12_RELEASE_BUILD_READINESS_STABILIZATION_REPORT.md`
- `M12_RUNTIME_FLICKER_PLAYABILITY_INCIDENT_REPORT.md`
- `M12_UI_STABILITY_FLICKER_LAYOUT_INCIDENT_REPORT.md`
- `M12_DASHBOARD_LAYOUT_OVERFLOW_DELTA_REPORT.md`
- `M12_DASHBOARD_LAYOUT_CONTAINMENT_DELTA_REPORT.md`

**Excluded from M12 RC scope (also dirty):** design assets, prompt drafts, `saves/` test files, unrelated doc edits.

**Diff magnitude (M12-relevant paths):** 28 files, +285 / −89 lines (apps/web, package.json, tests).

---

## 3. Authoritative M12 Contract

From `docs/project-management/MILESTONE_PLAN.md` § M12:

| Category | Items |
|----------|-------|
| **Goal** | Ship Version 1.0 |
| **Deliverables** | Release Candidate, Final Documentation, QA Approval, Stable Savegames, Performance Validation |
| **Exit Criteria** | Quality Gates passed, Executive Review approved, Version 1.0 tagged |
| **Status** | ⚪ Planned |

**Boundary correction (from M11 Gate 4 §21):** The five deliverables are completed **during** M12, not prerequisites to **start** M12 planning. Prerequisite to M12 **implementation** is M11 closure + this entry audit.

---

## 4. Mandatory Source Review

| Source | Role | Finding |
|--------|------|---------|
| `MILESTONE_PLAN.md` | M12 contract | Deliverables + exit criteria as above |
| `QUALITY_GATES.md` | Gate definitions | Nine standard gates; Release Gates for major releases |
| `RELEASE_STRATEGY.md` | Lifecycle | RC is a lifecycle stage; **no RC packaging procedure defined** (document ends after lifecycle diagram) |
| `IMPLEMENTATION_PROGRESS.md` | Status | M12 ~25 % avg; build readiness 100 %; RC/QA/validation 0 % |
| `M11_FINAL_MILESTONE_CLOSEOUT_GATE4_REPORT.md` | M11 baseline | 897 tests; build/typecheck/lint non-blocking for M11; M12 boundary verified |
| `M12_RELEASE_BUILD_READINESS_STABILIZATION_REPORT.md` | Build prep | `build:web` PASS; root build/typecheck/lint fail — classified non-blocking for web RC |
| `M12_RUNTIME_FLICKER_PLAYABILITY_INCIDENT_REPORT.md` | Playability | Flicker fixed via `useScreenQuery`; 901 tests at report time |
| `M12_UI_STABILITY_FLICKER_LAYOUT_INCIDENT_REPORT.md` | Runtime stability | WebSocket reconnect loop fixed; stable query keys |
| `M12_DASHBOARD_LAYOUT_CONTAINMENT_DELTA_REPORT.md` | Layout | Containment PASS @ 1236×697 |
| `AUDIT_PROCESS.md` | RC audit timing | Release readiness audit scheduled at RC stage |
| `PERFORMANCE_GUIDELINES.md` | Performance gates | Qualitative thresholds; formal M12 validation deferred |
| `RUNTIME_RESILIENCE_AND_PERFORMANCE_GUIDE.md` | Engineering guardrails | Reconnect/stale-data policy; no numeric release gate |

---

## 5. Workspace Audit

| Workspace | Runtime Role | Build Command | Artifact | Required for V1.0? | Evidence |
|-----------|--------------|---------------|----------|-------------------|----------|
| **Root** (`.`) | Domain, application, simulation, infrastructure, tools, tests; shared TS library surface | `pnpm build` → `tsc -p tsconfig.json` | `dist/` (declarations + JS for `src/`, `tests/`, `tools/`) | **Indirect** — consumed by API via path imports; **not** a standalone distributable | `tsconfig.json` includes `src`, `tests`, `tools`; root `package.json` `"build": "tsc -p tsconfig.json"` |
| **`@project-genesis/web`** | Next.js 15 UI; proxies `/api/*` to API; WebSocket client to API | `pnpm build:web` → `next build` | `apps/web/.next/`; served via `next start --port 3000` | **Yes** | `apps/web/package.json`; M9/M11 closeout production build evidence; audit **PASS** |
| **`@project-genesis/api`** | NestJS REST + Socket.IO; hosts simulation session, save/load, dashboard WS | `pnpm --filter @project-genesis/api build` → `tsc -p tsconfig.build.json` | Intended `apps/api/dist/` — **build FAIL** today | **Yes** — gameplay requires live API | Web client fetches `/api/*`; `dashboard-socket.ts` connects to `:3001`; E2E tests exercise API directly |
| **`game-content/`** | YAML/JSON content definitions | `pnpm validate-content` (validation, not build) | Content files on disk | **Yes** | `project-paths.ts` resolves `gameContentRoot`; API fails without it |
| **`saves/`** | Persisted sessions (`saves/browser-session.json` default) | N/A (runtime writes) | JSON save files | **Yes** for Stable Savegames deliverable | `project-paths.ts` `savePath`; E2E save/load flows |
| **`packages/`** | Placeholder only (`readme.md`) | N/A | N/A | **No** | Empty workspace member |
| **Dev tooling** (`src/tools/*`, `tools/*`) | SVG generator, visual asset manager, content sync | Included in root `tsc` | N/A | **No** for V1.0 runtime | Dev routes under `/dev/*`; `dev-only.guard.ts` blocks in `NODE_ENV=production` |

---

## 6. Release Artifact Model — Web

### 6.1 What `pnpm build:web` Produces

- Command: `pnpm --filter @project-genesis/web build` → `next build`
- Output: optimized production bundle in **`apps/web/.next/`**
- Routes built (audit run):

| Route | Type | First Load JS |
|-------|------|---------------|
| `/` | Static | 113 kB |
| `/game` | Static | 282 kB |
| `/dev/svg-generator` | Static | 105 kB |
| `/dev/visual-assets` | Static | 106 kB |

- **Production artifact:** Yes — standard Next.js 15 production build.
- **Start:** `pnpm --filter @project-genesis/web start` → `next start --port 3000`
- **Runtime dependencies:**
  - **`API_ORIGIN`** (build-time rewrite target in `next.config.ts`, default `http://127.0.0.1:3001`) — proxies browser `/api/*` to NestJS
  - **`NEXT_PUBLIC_API_ORIGIN`** (WebSocket origin in `dashboard-socket.ts`, default `http://127.0.0.1:3001`)
  - Node.js ≥ 22
- **Audit result:** **PASS** (exit 0). ESLint warnings only (6 unused-var warnings in web sources); types valid for production build.

### 6.2 Web Alone Is Insufficient

The web shell does not embed the simulation. All gameplay data flows through proxied REST and WebSocket to the API process. Static export is not configured; `/game` expects live backend.

---

## 7. Release Artifact Model — API / Server

### 7.1 Separate NestJS Application

- Package: `@project-genesis/api` (`apps/api/`)
- Entry: `apps/api/src/main.ts` — NestJS + Socket.IO adapter
- Default bind: `HOST=127.0.0.1`, `PORT=3001`
- CORS/WS origin: `WEB_ORIGIN` (default `http://127.0.0.1:3000`)
- Resolves monorepo root via `game-content/` marker (`project-paths.ts`)

### 7.2 Required for Gameplay?

**Yes.** Evidence:

- `client.ts` calls `/api/dashboard`, `/api/dashboard/history`, etc.
- `dashboard-socket.ts` connects to `${API_ORIGIN}/ws/v1/dashboard`
- `next.config.ts` rewrites `/api/:path*` → `${apiOrigin}/api/:path*`
- Full E2E suite (`apps/api/src/e2e/*`) runs gameplay against NestJS HTTP server
- `pnpm dev` starts **both** API and web in parallel

### 7.3 Build vs Runtime

| Mode | Command | Mechanism | Audit Result |
|------|---------|-----------|--------------|
| Development | `pnpm dev:api` / `pnpm dev` | `tsx watch src/main.ts` | Works (manual/dev evidence) |
| Declared production start | `pnpm --filter @project-genesis/api start` | **`tsx src/main.ts`** (not node on compiled JS) | No compiled artifact required today |
| Declared build | `tsc -p tsconfig.build.json` | Emits to `apps/api/dist/` | **FAIL** (exit 2) |

**Build failure root cause:** `apps/api/tsconfig.json` includes `../../src/**/*.ts`, pulling in **`src/tools/visual-asset-manager/*`** and **`src/tools/svg-generator/*`** dev-tooling that fails strict TS. Same clusters break root `pnpm build` and `pnpm typecheck`.

### 7.4 API Artifact Status for V1.0

- **Runtime component:** Required
- **Compiled distributable:** **Not established** — build fails; production script uses `tsx` against TypeScript sources
- **Shared code coupling:** API imports monorepo `src/` domain/application/infrastructure directly (not a published npm package)

---

## 8. Release Artifact Model — Root Build

### 8.1 What `pnpm build` Does

```json
"build": "tsc -p tsconfig.json"
```

- Compiles **`src/`**, **`tests/`**, **`tools/`** → **`dist/`**
- Emits declarations + source maps
- **Not** invoked by `build:web` or API dev start
- **Not** a Next.js or NestJS packaging step

### 8.2 Classification

| Hypothesis | Verdict | Evidence |
|------------|---------|----------|
| Release artifact build | **No** | No deploy script consumes `dist/` as release bundle |
| Aggregate workspace build | **Partial intent** | Only root package; web/API have separate builds |
| Dev/CI validation command | **Yes** | Used in IMPLEMENTATION_PROGRESS as compile check |
| Historical convenience | **Yes** | Readme still references `npm run build` generically |

**Audit result:** **FAIL** (exit 2) — dev-tooling TS clusters (`svg-generator`, `visual-asset-manager`, `sync-runtime-visual-assets.ts`), plus `GameSession.ts` regionId typing.

**Release gate?** **No** — not in `QUALITY_GATES.md` Release Gates; M11 Gate 4 and M12 build-readiness explicitly classify as non-blocking for web RC.

---

## 9. Deployment Evidence Audit

| Evidence | Exists? | What It Proves | Release Relevance |
|----------|---------|----------------|-------------------|
| `Dockerfile` / `docker-compose` | **No** | — | No containerized release path defined |
| `.github/workflows/*` | **No** | — | No CI release pipeline |
| `vercel.json` / `netlify.toml` / `Procfile` | **No** | — | No hosted deploy config |
| Root/`apps/*` production start scripts | **Partial** | Web: `next start`; API: `tsx src/main.ts` | Dual-process manual start only |
| `next.config.ts` API rewrite | **Yes** | Web expects API at `API_ORIGIN` | **Required** env for production web |
| `dashboard-socket.ts` `NEXT_PUBLIC_API_ORIGIN` | **Yes** | WebSocket targets API host | **Required** for live dashboard |
| `apps/api/src/main.ts` env vars | **Yes** | `HOST`, `PORT`, `WEB_ORIGIN` | API runtime configuration |
| `apps/api/src/config/project-paths.ts` | **Yes** | Requires repo layout (`game-content/`, `saves/`) | **RC must ship or mount content + saves paths** |
| `.env.example` | **No** | — | Env contract undocumented in repo |
| Deployment docs | **No** dedicated doc | `RELEASE_STRATEGY.md` lifecycle only | **Deployment architecture undefined** |
| `pnpm dev` / `dev:stop` / `dev:restart` | **Yes** | Local dual-process dev | Not production deployment |
| Version tags (`v1.0.0`) | **No** | All `package.json` at `0.1.0` | M12 exit criterion not met |
| M11 E2E save/load tests | **Yes** | Save/load works in test harness | Baseline for Stable Savegames — not release matrix |

**Conclusion:** Runtime **topology** is inferable (web + API + content + saves). **Packaging, hosting, and promotion to RC** are **not defined** in repository artifacts.

---

## 10. Release Artifact Decision

### ARTIFACT MODEL B — WEB + API

Both runtime processes are required for Version 1.0 gameplay:

1. **Web** — Next.js production build (`apps/web/.next/`)
2. **API** — NestJS simulation server (today: `tsx`-based; compiled path broken)

Additional non-optional **data dependencies** (not separate deployable services):

- `game-content/` — loaded at API startup
- `saves/` — persistence directory (default `saves/browser-session.json`)

**Caveat — deployment packaging remains undefined (sub-aspect of Model D):** The repository does not yet define *how* to bundle, host, or promote WEB + API as an RC artifact (no Docker, no CI, no env template, no version tag procedure). Artifact **topology** is B; artifact **delivery mechanism** is still to be authored in M12.

---

## 11. Current Command Validation

Audit run on 2026-08-30 against **uncommitted working tree** (includes all M12 prep fixes).

| Command | Exit | Result | Primary Failure Cluster (if FAIL) |
|---------|-----:|--------|-----------------------------------|
| `pnpm test` | 0 | **909 / 909 PASS** (246 files) | — |
| `pnpm build:web` | 0 | **PASS** — Next.js 15.5.20 optimized build | 6 ESLint warnings (unused vars); no errors |
| `pnpm build` | 2 | **FAIL** | `src/tools/svg-generator/*`, `src/tools/visual-asset-manager/*`, `tools/sync-runtime-visual-assets.ts`, `GameSession.ts` |
| `pnpm typecheck` | 2 | **FAIL** | Root tooling (~30+ errors) + web test-only TS (~8 errors) + `GameSession.ts` |
| `pnpm lint` | 1 | **FAIL** — 12 errors, 53 warnings | Tooling duplicate imports, control-regex, misleading char class; not web presentation |
| `pnpm --filter @project-genesis/api build` | 2 | **FAIL** | Same dev-tooling paths via `../../src/**/*.ts` include |
| `pnpm --filter @project-genesis/web typecheck` | 2 | **FAIL** | Test-only: a11y matchers, integration test types |
| `pnpm --filter @project-genesis/api typecheck` | 2 | **FAIL** | Dev-tooling via shared src include |

### 11.1 Gate Classification Summary

| Command | Release Gate for RC? | Rationale |
|---------|---------------------|-----------|
| `pnpm test` | **Yes** | `QUALITY_GATES.md` Release Gates — Regression Suite |
| `pnpm build:web` | **Yes** | Sole verified production web artifact; M11/M12 evidence |
| `pnpm build` (root) | **No** | Dev validation; fails on non-runtime tooling |
| `pnpm typecheck` (root) | **No** | Not in Release Gates; web prod build typechecks independently |
| `pnpm lint` (root) | **No** | Not in Release Gates; `next build` lint pass is sufficient for web |
| `pnpm --filter @project-genesis/api build` | **Undefined / de facto needed if compiled API required** | Build fails; no release doc resolves tsx-vs-compiled policy |

---

## 12. M12 Deliverable & Exit Criteria Status

### 12.1 Official Deliverables

| Deliverable | Status | Evidence | Remaining Work |
|-------------|--------|----------|----------------|
| **Release Candidate** | **NOT STARTED** (build-ready baseline exists) | `build:web` PASS; regression PASS; no RC tag/bundle/process | Commit M12 stack; define RC manifest; dual-runtime start contract; optional API compile path; RC validation checklist |
| **Final Documentation** | **PARTIAL** | Architecture/gameplay docs extensive; `RELEASE_STRATEGY.md` incomplete; readme outdated (Phase 3); no deploy/runbook | Release runbook, env contract, RC/GA doc refresh, version docs |
| **QA Approval** | **NOT STARTED** | No QA checklist, sign-off record, or test plan artifact | Formal QA cycle against RC build |
| **Stable Savegames** | **PARTIAL — GOOD BASELINE** | V3 schema; E2E save/load in `m9-save-load-flow`, `m11-phase5/6` tests; default path `saves/browser-session.json` | M12 release compatibility matrix; migration validation across RC iterations; player event log still session-scoped (known gap) |
| **Performance Validation** | **PARTIAL — INFORMAL** | Smoke tests in suite; Phase 5.5 guardrails; `PERFORMANCE_GUIDELINES.md` qualitative; no numeric M12 gate executed | Formal M12 performance validation deliverable per milestone plan |

### 12.2 Exit Criteria

| Exit Criterion | Status | Evidence |
|----------------|--------|----------|
| Quality Gates passed | **OPEN** | Regression met; Executive/Performance/Savegame/Documentation release gates not formally closed for M12 |
| Executive Review approved | **NOT STARTED** | No M12 executive sign-off artifact |
| Version 1.0 tagged | **NOT STARTED** | Packages at `0.1.0`; no git tag |

---

## 13. Quality Gates Applicable to M12

From `QUALITY_GATES.md`:

**Standard gates (all implementations):** Architecture, Documentation, Code Quality, Testing, Error Handling, Logging, Validation, Performance, Review.

**Release Gates (major releases — M12):**

| Release Gate | Current Evidence | M12 Status |
|--------------|------------------|------------|
| Executive Review | M11 Gate 4 complete; M12 not started | **OPEN** |
| Performance Review | Qualitative guardrails; smoke tests | **OPEN** |
| Savegame Compatibility | E2E flows pass; no release matrix | **OPEN** |
| Regression Suite | **909/909 PASS** | **MET** (must re-run on RC commit) |
| Documentation Review | Extensive but release/deploy gaps | **OPEN** |

**Definition of Done** (task level) requires all applicable standard gates — distinct from M12 milestone close.

---

## 14. Known Non-Blockers (Documented, Do Not Fix in This Audit)

| Finding | Classification | RC Impact |
|---------|----------------|-----------|
| Root `pnpm build` / `pnpm typecheck` fail | Historical dev-tooling + test debt (POLISH-05) | **Non-blocking** for web RC if API runs via tsx |
| Root `pnpm lint` 12 errors | Tooling/tests | **Non-blocking** — web build lint passes |
| `GameSession.ts` regionId typing | POLISH-05 safe fix candidate | **Non-blocking** |
| `.pg-query-row` horizontal overflow ≤1024 px | UI polish | **Non-blocking** — panel-internal only |
| Player event log not persisted in savegames | Architecture note (M11 Phase 6.6) | **Non-blocking for RC**; affects Stable Savegames completeness long-term |
| API `tsc` build fail | Dev-tooling included in API tsconfig | **Blocking only if policy requires compiled API artifact** — policy undefined |

---

## 15. Release Blockers for First RC

| ID | Blocker | Severity | Smallest Later Delta |
|----|---------|----------|----------------------|
| RC-01 | **Uncommitted M12 stack** — RC not reproducible from HEAD | **High** | Commit M12 prep with report bundle |
| RC-02 | **No RC definition / packaging process** in repo | **High** | Author RC manifest doc + minimal start script contract (web + api + env) |
| RC-03 | **API production artifact policy undefined** (tsx vs compiled) | **Medium** | Decision doc + either exclude dev-tools from API build or document tsx-as-production |
| RC-04 | **No deployment/hosting evidence** | **Medium** for external RC; **Low** for local/internal RC | Define internal RC as dual-process localhost before infra |
| RC-05 | **Version still 0.1.0** | **Low until GA** | Version bump + tag at M12 close, not necessarily first RC |

**Not RC blockers today:** root build, root typecheck, root lint, `.pg-query-row` overflow.

---

## 16. What “Release Candidate” Means in This Project (Concrete)

Repository evidence supports this operational definition until `RELEASE_STRATEGY.md` is expanded:

> **Release Candidate** = a **named, reproducible git state** that satisfies:
> 1. Full regression suite pass (`pnpm test`)
> 2. Web production build pass (`pnpm build:web`)
> 3. Documented dual-runtime startup (web on :3000, API on :3001) with env vars set
> 4. Manual or scripted smoke validation of `/game` playability (ticks, dashboard, save/load)
> 5. Release Gates checklist initiated (not necessarily all closed until GA)

**Not yet defined:** artifact archive format, container image, hosted URL, RC numbering (`v1.0.0-rc.1`), or CI promotion workflow.

---

## 17. Recommended M12 Sequencing (Post-Audit)

```text
[M12 Entry Audit] ← this document
        ↓
M12 RC Baseline Commit & Dual-Runtime Start Contract
        ↓
M12 RC Packaging & Internal Validation (smoke + save/load matrix)
        ↓
M12 QA Approval cycle
        ↓
M12 Performance Validation (formal)
        ↓
M12 Final Documentation + Executive Review
        ↓
Version 1.0 tag + M12 close
```

---

## 18. Next Smallest M12 Implementation / Validation Package

### **M12 RC Baseline Commit & Dual-Runtime Start Contract**

**Scope (smallest believable RC prep slice):**

1. **Commit** all M12-relevant uncommitted work (build readiness, flicker, UI stability, layout containment, tests, M12 reports) — exclude unrelated design-asset churn unless explicitly desired.
2. **Author** minimal RC run contract (can be a short doc section or README addendum):
   - Prerequisites: Node ≥ 22, `pnpm install`, `game-content/` present
   - Build: `pnpm build:web`
   - Run: API (`pnpm --filter @project-genesis/api start`) + Web (`pnpm --filter @project-genesis/web start`)
   - Env: `API_ORIGIN`, `NEXT_PUBLIC_API_ORIGIN`, `WEB_ORIGIN`, `HOST`, `PORT`
   - Validate: `pnpm test`, open `/game`, confirm ticks + save/load
3. **Decide** API artifact policy for RC: accept `tsx` production start **or** fix API tsconfig exclude for dev-tools (smallest TS exclude, not broad refactor).
4. **Do not** in this slice: Docker, CI, version bump, tag, lint/typecheck cleanup sprints, UI polish.

**Why this is next:** Entry audit complete; technical baseline is green for web + regression; reproducibility and runtime contract are the gating gaps before calling anything an RC.

---

## 19. Audit Conclusion

Project Genesis M12 entry is **technically viable** for RC preparation:

- Simulation integration is mature (M11 closed; M12 prep fixes playability and web production build).
- **Regression and web production build pass** on current working tree.
- **Dual-process runtime (WEB + API)** is architecturally required and evidenced.
- **RC process, deployment, QA, formal performance/savegame validation, and v1.0 tagging** remain **open M12 work**.

**Do not treat root `pnpm build`, root `pnpm typecheck`, or root `pnpm lint` as RC gates** unless explicitly added to project policy — current authoritative docs and validation evidence do not support that classification.

**Immediate action:** Execute **M12 RC Baseline Commit & Dual-Runtime Start Contract** as the next slice. No implementation was performed in this audit.

---

## 20. Related Documents

- `docs/project-management/MILESTONE_PLAN.md`
- `docs/project-management/QUALITY_GATES.md`
- `docs/project-management/RELEASE_STRATEGY.md`
- `docs/development/IMPLEMENTATION_PROGRESS.md`
- `docs/architecture/reviews/M11_FINAL_MILESTONE_CLOSEOUT_GATE4_REPORT.md`
- `docs/architecture/reviews/M12_RELEASE_BUILD_READINESS_STABILIZATION_REPORT.md`
- `docs/architecture/reviews/M12_RUNTIME_FLICKER_PLAYABILITY_INCIDENT_REPORT.md`
- `docs/architecture/reviews/M12_UI_STABILITY_FLICKER_LAYOUT_INCIDENT_REPORT.md`
- `docs/architecture/reviews/M12_DASHBOARD_LAYOUT_CONTAINMENT_DELTA_REPORT.md`

---

*End of M12 Release Preparation Entry Audit.*
