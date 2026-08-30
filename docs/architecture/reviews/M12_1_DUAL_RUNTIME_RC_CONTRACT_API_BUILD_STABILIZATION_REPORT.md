# M12.1 Dual-Runtime RC Contract & API Build Stabilization Report

**Project:** Project Genesis  
**Workstream:** M12.1 — Dual-Runtime RC Contract & API Build Stabilization  
**Report date:** 2026-08-30  
**Repository baseline (start):** branch `master`, HEAD `958e94f` (M11 Gate 4 closeout)  
**Prior audit:** `M12_RELEASE_PREPARATION_ENTRY_AUDIT.md` — PASS WITH NEXT-SCOPE CORRECTION  
**M11 / Production status:** Unchanged — CLOSED / PASS

---

## 1. Executive Summary

| Question | Answer |
|----------|--------|
| API production path decision | **PATH A — COMPILED API IS THE INTENDED PRODUCTION PATH** |
| `pnpm --filter @project-genesis/api build` | **PASS** (after minimal compile-scope fix) |
| Compiled API runtime validated? | **Yes** — `NODE_ENV=production pnpm start:prod` serves REST + WebSocket |
| Dual-runtime production smoke | **PASS** — web `next start` + compiled API; `/game` playable |
| RC runtime contract documented? | **Yes** — `docs/development/RC_RUNTIME_CONTRACT.md` |
| Regression | **911 / 911 PASS** (+2 production-build-scope tests) |
| Root build / typecheck / lint | **Still FAIL** — historical debt; not RC gates |

**Final decision:** **OPTION A — COMPILED API PRODUCTION PATH ESTABLISHED**

---

## 2. Repository Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD | `958e94f` — M11 Gate 4 closeout |
| Working tree clean? | **No** — M12 stack + this slice uncommitted |
| Staged files | 0 |
| Unstaged M12 files | Presentation/runtime fixes, layout CSS, navigation-state, tests, package.json, IMPLEMENTATION_PROGRESS |
| Unrelated dirty files | Design assets, prompts, saves/, deleted legacy design scripts |
| Test baseline (start) | 909 / 909 PASS |
| Test baseline (end) | **911 / 911 PASS** |
| Web build baseline | **PASS** (before and after) |
| API build baseline (start) | **FAIL** — dev tooling in compile scope |
| API build baseline (end) | **PASS** |

---

## 3. API Runtime Intent Audit

| Evidence | Suggests TSX Runtime | Suggests Compiled Runtime | Confidence |
|----------|--------------------:|--------------------------:|------------|
| `build` script: `tsc -p tsconfig.build.json` with `noEmit: false` | 0 | **1** | High |
| `outDir: dist` in API tsconfig | 0 | **1** | High |
| `tsx` in **devDependencies** only | **1** | 0 | High — not available without dev install |
| Legacy `start` used `tsx src/main.ts` | **1** | 0 | Medium — dev convenience, not authoritative |
| No script consumed `dist/` before this slice | 0 | 0 | Neutral — gap, not intent |
| NestJS standard deployment pattern | 0 | **1** | Medium |
| M12 Entry Audit classified compile as implied | 0 | **1** | Medium |

**Decision: PATH A** — compiled artifact is the authoritative production path. Legacy `tsx` start remains for development via separate entry point.

---

## 4. API Runtime Dependency Audit

| Path | Included by TS Config (before fix)? | Runtime Imported by Production API? | Needed for Production API? | Safe to Exclude from Production Build? |
|------|-----------------------------------:|------------------------------------:|---------------------------:|----------------------------------------:|
| `src/tools/svg-generator/*` | Yes | No (dev module only) | **No** | **Yes** |
| `src/tools/visual-asset-manager/*` | Yes | No (dev module only) | **No** | **Yes** |
| `tools/sync-runtime-visual-assets.ts` | Root only | No | **No** | N/A (not in API include) |
| `apps/api/src/dev/**` | Yes | No in production (`AppModule`) | **No** | **Yes** |
| `src/application/facade/GameSession.ts` | Yes | **Yes** | **Yes** | **No** |
| Shared domain/application/infrastructure | Yes | **Yes** | **Yes** | **No** |

Production API import chain: `main.ts` → `AppModule` → `GameModule` / `DashboardModule` → `GameSession` → shared `src/`.

---

## 5. API Build Failure Reproduction (Before Fix)

Primary error clusters:

| Error Cluster | File Area | Production Runtime Relevant? | Blocks Compiled API? |
|---------------|-----------|-----------------------------:|---------------------:|
| svg-generator TS debt | `src/tools/svg-generator/*` | No | **Yes** (included via broad tsconfig) |
| visual-asset-manager TS debt | `src/tools/visual-asset-manager/*` | No | **Yes** |
| dev controller optional props | `apps/api/src/dev/*` | No | **Yes** |
| `GameSession.ts` regionId | `src/application/facade/GameSession.ts` | **Yes** | **Yes** |
| `game.controller.ts` regionId | `apps/api/src/game/game.controller.ts` | **Yes** | **Yes** |

---

## 6. Minimal Fix Applied (PATH A)

### 6.1 Production compile scope (`apps/api/tsconfig.build.json`)

- Explicit **include** for production API modules + shared `../../src/**/*.ts`
- **Exclude** `../../src/tools/**`, dev tests, and (via separate entry) dev-only API sources

### 6.2 Split entry points

| File | Role |
|------|------|
| `main.ts` | Production entry → `AppModule` (gameplay only) |
| `main.dev.ts` | Development entry → `AppDevModule` (includes DevModule) |
| `api-bootstrap.ts` | Shared NestJS bootstrap |
| `app.module.ts` | Production root module (GameModule only) |
| `app.dev.module.ts` | Development root module (GameModule + DevModule) |

### 6.3 Scripts (`apps/api/package.json`)

| Script | Command |
|--------|---------|
| `dev` / `start` | `tsx src/main.dev.ts` |
| `start:prod` | `node dist/apps/api/src/main.js` |
| `build` | `tsc -p tsconfig.build.json` |

### 6.4 Runtime type fix (production closure)

- `GameSession.ts` — conditional spread for optional `regionId` on `PlaceBuildingCommand`
- `game.controller.ts` — same pattern for HTTP DTO → facade

### 6.5 Tests

- Dev controller tests updated to boot `AppDevModule`
- New `production-build-scope.test.ts` — verifies tsconfig boundaries and production AppModule has no DevModule

---

## 7. API Build Artifact Inspection

| Property | Value |
|----------|-------|
| Output directory | `apps/api/dist/` |
| Production entry JS | `dist/apps/api/src/main.js` |
| Shared runtime JS | `dist/src/**` (domain, application, infrastructure, simulation, content) |
| Expected cwd for `start:prod` | `apps/api/` |
| Required sibling paths | Monorepo root with `game-content/` (resolved by walking up from module location) |
| Save dependency | `saves/` under monorepo root |
| Dev sources in dist | **No** — dev module and tools excluded from production build |

---

## 8. Production Environment Contract

| Variable | Consumer | Build / Runtime | Default | Required for Local RC? |
|----------|----------|-----------------|---------|:---------------------:|
| `API_ORIGIN` | Next.js rewrites | Build-time | `http://127.0.0.1:3001` | No |
| `NEXT_PUBLIC_API_ORIGIN` | WebSocket client | Build-time | `http://127.0.0.1:3001` | No |
| `HOST` | API bind | Runtime | `127.0.0.1` | No |
| `PORT` | API listen | Runtime | `3001` | No |
| `WEB_ORIGIN` | API CORS / WS | Runtime | `http://127.0.0.1:3000` | No |
| `NODE_ENV` | Production module selection | Runtime | unset (dev) | **Yes** — `production` for compiled API |

Save path: `saves/browser-session.json` (default). Content: `game-content/` at monorepo root.

---

## 9. Dual-Runtime Production-Style Validation

### Commands used

```bash
pnpm build:web
pnpm --filter @project-genesis/api build
cd apps/api && NODE_ENV=production pnpm start:prod
pnpm --filter @project-genesis/web start
```

### Startup

| Check | Result |
|-------|--------|
| API starts cleanly (compiled) | **PASS** — Nest bootstrap, content loaded (9 resources, 23 buildings) |
| Web starts cleanly | **PASS** — Next.js 15.5.20 ready |
| Dev routes absent in production API | **PASS** — `/api/dev/visual-assets` → **404** (not registered) |
| Health endpoint | **PASS** — `GET /health` → 200 |

### Connectivity

| Check | Result |
|-------|--------|
| REST via API direct | **PASS** — `/api/dashboard` → 200 |
| REST via web proxy | **PASS** — `localhost:3000/api/dashboard` → 200 |
| WebSocket / live ticks | **PASS** — tick advanced 12 → 31+ during session |
| Reconnect oscillation | **PASS** — no stale banner observed |

### Gameplay smoke (browser @ production web)

| Step | Result |
|------|--------|
| Open `/game` via new game flow | **PASS** — session "RC Smoke Test" |
| Simulation ticks ≥ 10 | **PASS** — observed tick 31+ |
| Navigate Company dashboard | **PASS** — Executive dashboard widgets rendered |
| Gameplay command (simulation step) | **PASS** — tick 20→21, cash 100000→100125 |
| Save / load (API REST) | **PASS** — save `saves/m12-rc-smoke.json` ok; load ok; dashboard tick 59, company restored |

### Flicker & layout guard

| Check | Result |
|-------|--------|
| Tick-driven loading flicker | **PASS** — dashboard stable during tick updates |
| KPI clipping @ gameplay session | **PASS** — KPI regions visible, no overlap observed |
| Reconnect banner | **PASS** — none |

---

## 10. Required Validation Commands

| Command | Exit | Result |
|---------|-----:|--------|
| `pnpm test` | 0 | **911 / 911 PASS** (247 files) |
| `pnpm build:web` | 0 | **PASS** |
| `pnpm --filter @project-genesis/api build` | 0 | **PASS** |
| `pnpm build` | 2 | **FAIL** — dev tooling debt (unchanged scope) |
| `pnpm typecheck` | 2 | **FAIL** — dev tooling + web test debt |
| `pnpm lint` | 1 | **FAIL** — 12 errors (unchanged) |

---

## 11. Working Tree / RC Baseline Hygiene

| File/Path | Classification | Should Be In RC Baseline? |
|-----------|----------------|---------------------------:|
| `apps/api/src/*` (this slice) | **M12 REQUIRED** | **Yes** |
| `apps/api/tsconfig.build.json` | **M12 REQUIRED** | **Yes** |
| `src/application/facade/GameSession.ts` | **M12 REQUIRED** | **Yes** |
| `docs/development/RC_RUNTIME_CONTRACT.md` | **M12 REPORT/DOC** | **Yes** |
| `apps/web/src/presentation/**` (M12 prep) | **M12 REQUIRED** | **Yes** |
| `apps/web/src/presentation/hooks/*.test.ts` | **M12 REQUIRED** | **Yes** |
| `docs/architecture/reviews/M12_*.md` | **M12 REPORT/DOC** | **Yes** |
| `package.json` (`dev:stop`/`dev:restart`) | **M12 REQUIRED** | Optional (dev convenience) |
| `docs/design/**` assets | UNRELATED DESIGN ASSET | No |
| `docs/development/Prompts/**` | PROMPT / LOCAL NOTE | No |
| `saves/e2e-*.json`, `saves/m12-rc-smoke.json` | TEMP SAVE | No |
| `apps/api/dist/` | GENERATED | No (build output) |
| `apps/web/.next/` | GENERATED | No |

**Commit recommendation:** Single coherent commit containing M12 REQUIRED + M12 REPORT/DOC paths above. Exclude design assets, prompts, test saves, and generated artifacts.

---

## 12. Documentation Delivered

- **`docs/development/RC_RUNTIME_CONTRACT.md`** — authoritative dual-runtime RC contract (prerequisites, build, startup, env vars, layout, smoke checklist, gate summary)

---

## 13. Versioning

All packages remain at **`0.1.0`**. No RC tags or version bumps (deferred to later M12 exit work).

---

## 14. Next Recommended M12 Package

**M12 RC Baseline Commit & Internal Validation** — commit the coherent M12 stack documented in §11, then run full RC checklist from `RC_RUNTIME_CONTRACT.md` on the committed baseline.

---

## 15. Files Changed (This Slice)

| File | Change |
|------|--------|
| `apps/api/tsconfig.build.json` | Production compile scope |
| `apps/api/package.json` | `start:prod`, dev entry via `main.dev.ts` |
| `apps/api/src/main.ts` | Production entry only |
| `apps/api/src/main.dev.ts` | **New** — development entry |
| `apps/api/src/api-bootstrap.ts` | **New** — shared bootstrap |
| `apps/api/src/app.module.ts` | Production module (no DevModule) |
| `apps/api/src/app.dev.module.ts` | **New** — development module |
| `apps/api/src/game/game.controller.ts` | regionId conditional spread |
| `apps/api/src/dev/*.test.ts` | Use AppDevModule |
| `apps/api/src/production-build-scope.test.ts` | **New** |
| `src/application/facade/GameSession.ts` | regionId conditional spread |
| `docs/development/RC_RUNTIME_CONTRACT.md` | **New** |

---

*End of M12.1 Dual-Runtime RC Contract & API Build Stabilization Report.*
