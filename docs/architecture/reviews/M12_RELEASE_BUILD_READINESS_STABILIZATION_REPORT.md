# M12 Release Build Readiness Stabilization Report

**Project:** Project Genesis  
**Workstream:** M12 Release Preparation — Release Build Readiness  
**Report date:** 2026-08-30  
**Repository baseline:** branch `master`, HEAD `958e94f` (M11 Gate 4 closeout)  
**M11 status:** CLOSED — PASS (unchanged)  
**Production track:** CLOSED — PASS (unchanged)

---

## 1. Executive Summary

| Question | Answer |
|----------|--------|
| Required web production build (`pnpm build:web`)? | **PASS** (after fixes) |
| Primary release blocker resolved? | **Yes** — warehouse `EntitySelection` type integration (W1) |
| Additional blockers found & fixed? | **Yes** — missing `PGOperationsSidebar` import; ESLint duplicate import in integration test |
| Full regression? | **898 / 898 PASS** (+1 targeted navigation test) |
| Root `pnpm build` / `pnpm typecheck`? | **Still FAIL** — pre-existing dev-tooling + test debt (non-blocking for web RC artifact) |
| Lint? | **Still FAIL** — 12 errors, 53 warnings (non-blocking) |

**Final decision:** **OPTION A — RELEASE BUILD READINESS RESTORED**

**Recommended next M12 package:** **M12 Release Preparation Entry Audit** — formal inventory of remaining M12 deliverables (RC packaging, QA, savegame release validation, performance validation, documentation) before implementation sprints.

---

## 2. Repository Baseline

| Item | Value |
|------|-------|
| Branch | `master` |
| HEAD at start | `958e94f` — M11 Gate 4 closeout |
| Commits since Gate 4 | None (work in working tree) |
| Uncommitted unrelated | Design assets, prompts, review drafts (excluded) |
| Test baseline (Gate 4) | 243 files / 897 tests |
| Test baseline (this slice) | 243 files / **898 tests** |

---

## 3. Initial Command Results

| Command | Exit | Result | Error Count | Primary Cluster |
| ------- | ---: | ------ | ----------: | --------------- |
| `pnpm test` | 0 | **897 / 897 PASS** | 0 | — |
| `pnpm typecheck` | 2 | **FAIL** | ~39 TS errors | Dev tooling, tests, `GameSession.ts`, web tests |
| `pnpm build` | 2 | **FAIL** | Same as typecheck | Root `tsc -p tsconfig.json` (global monorepo compile) |
| `pnpm build:web` | 1 | **FAIL** | 1 ESLint error (+ latent TS) | `world-search-selection.integration.test.ts` duplicate import; `warehouse` not in `EntitySelection` |
| `pnpm lint` | 1 | **FAIL** | 66 (13 errors, 53 warnings) | Tooling duplicate imports, test style, dev scripts |

---

## 4. Error Cluster Inventory

| Cluster | Command(s) | Layer | Known Since | Runtime Impact | RC Impact | Classification |
| ------- | ---------- | ----- | ----------- | -------------- | --------- | -------------- |
| `warehouse` missing from `EntitySelection` | typecheck, build:web | Presentation navigation | Phase 6.4 | Low (runtime worked; TS/build failed) | **Blocked Next.js build** | **RELEASE BLOCKER** → **RESOLVED** |
| Missing `PGOperationsSidebar` import | web tsc | Presentation runtime | Unknown (latent) | **Runtime ReferenceError** on company screen | **Blocked compile** | **RELEASE-RELEVANT DEFECT** → **RESOLVED** |
| Duplicate import `entity-navigation` | build:web ESLint | Presentation test | Pre-existing | None | **Blocked Next.js build** | **RELEASE BLOCKER** → **RESOLVED** |
| `GameSession.ts` `regionId` optional | typecheck, build | Application runtime | POLISH-05 | Low — tests cover placement | Root tsc only | **NON-BLOCKING TYPE DEBT** |
| `svg-generator/*` | typecheck, build | Dev tooling | POLISH-05 | None | None | **DEV-TOOLING DEBT** |
| `visual-asset-manager/*` | typecheck, build, api build | Dev tooling | POLISH-05 | None | Blocks root/api tsc | **DEV-TOOLING DEBT** |
| `sync-runtime-visual-assets.ts` | typecheck, build | Dev tooling | POLISH-05 | None | None | **DEV-TOOLING DEBT** |
| Test-only TS (a11y, reconnect, transport) | typecheck | Tests | Pre-existing | None | None | **TEST-ONLY DEBT** |
| ESLint remaining (12 errors) | lint | Mixed | Pre-existing | None | Not enforced on web build pass | **LINT-ONLY / NON-BLOCKING** |
| ESLint warnings (53) | lint | Mixed | Pre-existing | None | None | **WARNING ONLY** |

---

## 5. Release-Blocker Classification

**Blockers addressed in this slice:**

1. Warehouse `EntitySelection` type gap (Gate 4 documented)
2. Missing production component import (`PGOperationsSidebar`)
3. ESLint duplicate import blocking `next build`

**Deferred (not release-blocking for web artifact):**

- Root monorepo `tsc` / `pnpm build`
- API package `tsc` (fails on shared dev-tooling paths)
- Remaining lint errors in tooling/tests
- `GameSession.ts` regionId typing (safe fix candidate for future slice)

---

## 6. Warehouse EntitySelection Analysis

| Question | Finding |
|----------|---------|
| Where is `EntitySelectionKind` defined? | `apps/web/src/presentation/state/navigation-state.ts` |
| Discriminated union? | Yes — `{ kind, id? }` per kind |
| Existing kinds | region, building, resource, production, transport, research, employee, event (+ none) |
| Phase 6.4 warehouse usage | `buildWarehouseNavigationTarget`, inspector mappers, `DetailSelection`, `CompanyDashboardScreen`, `ProductionScreen` link |
| Screen assignment | **company** screen |
| Catalog validation | `EntityCatalogViewData.warehouseIds` already exists; URL recovery used `EntityCatalog` without warehouse |
| Tests expecting warehouse | `entity-navigation.test.ts`, `ProductionScreen.test.tsx` |

**Conclusion:** Warehouse is an intentional Phase 6.4 entity selection kind; only shared navigation-state integration was incomplete.

---

## 7. Warehouse Decision

**OPTION W1 — MISSING TYPE INTEGRATION**

Evidence: runtime consumers, detail selection, inspector mappers, and tests all treat `warehouse` as authoritative selection kind on the company screen.

---

## 8. Changes Made

### Warehouse integration (W1)

**File:** `apps/web/src/presentation/state/navigation-state.ts`

- Added `'warehouse'` to `EntitySelectionKind`, `EntitySelection` union, `ENTITY_KINDS`
- Added `warehouseIds` to `EntityCatalog`
- Extended `isEntityKnown` and `isEntitySelectionCompatibleWithScreen` (company screen)
- Extended `buildEntityCatalogFromDashboard` with optional `warehouseStorage` → `warehouseIds`

**File:** `apps/web/src/presentation/navigation/entity-selection-labels.ts`

- Added warehouse kind label and formatter case

### Release compile fixes

**File:** `apps/web/src/presentation/screens/company/CompanyDashboardScreen.tsx`

- Added missing `PGOperationsSidebar` import

**File:** `apps/web/src/presentation/runtime/world-search-selection.integration.test.ts`

- Merged duplicate `entity-navigation` imports (ESLint `no-duplicate-imports`)

---

## 9. Targeted Tests

**File:** `apps/web/src/presentation/state/navigation-state.test.ts`

Added coverage for:

- URL parse `warehouse:building-wh-1`
- Company screen compatibility for warehouse selection
- Catalog recovery keeps valid warehouse / clears invalid warehouse

Existing tests unchanged: `entity-navigation.test.ts`, `ProductionScreen.test.tsx` (warehouse navigation).

---

## 10. Web Build Result

```bash
pnpm build:web
```

| Run | Exit | Result |
|-----|-----:|--------|
| Before fixes | 1 | FAIL — ESLint duplicate import (+ warehouse TS) |
| After fixes | **0** | **PASS** — Next.js 15 static build complete |

**Classification:** **RESOLVED — RELEASE BLOCKER REMOVED**

---

## 11. Root Build Assessment

| Question | Answer |
|----------|--------|
| What is `pnpm build`? | Root `tsc -p tsconfig.json` over domain, application, API paths, tools, tests |
| Required for M12 RC web artifact? | **No** — distributable web build is `pnpm build:web` |
| QUALITY_GATES.md mandate? | Regression suite for major releases; no explicit root tsc gate |
| Classification | **DEV VALIDATION ONLY** for monorepo-wide compile |

**After slice:** `pnpm build` still **FAIL** (exit 2) — dev-tooling + test clusters unchanged.

---

## 12. Typecheck Assessment

**After slice:** `pnpm typecheck` **FAIL** (exit 2) — ~39 errors

| Cluster | Status |
|---------|--------|
| Warehouse / entity navigation (web) | **RESOLVED** |
| `GameSession.ts` regionId | Open — NON-BLOCKING |
| Dev tooling (svg-generator, VAM, sync script) | Open — DEFER |
| Web test-only TS | Open — TEST-ONLY DEBT |

---

## 13. GameSession Type Assessment

**Error:** `GameSession.ts(661,53)` — `regionId: string | undefined` not assignable to `PlaceBuildingCommand` under `exactOptionalPropertyTypes`.

| Aspect | Assessment |
|--------|------------|
| Runtime risk | Low — placement flows covered by tests |
| Fix pattern | Conditional spread (same as `listCities`) |
| Classification | **SAFE TYPE FIX** — deferred (not required for web RC build) |
| Action this slice | **None** — document for M12 stabilization backlog |

---

## 14. Dev Tooling Debt

Unchanged clusters in `src/tools/visual-asset-manager/*`, `src/tools/svg-generator/*`, `tools/sync-runtime-visual-assets.ts`.

**Classification:** **DEFER TO M12 STABILIZATION BACKLOG** — not required for `build:web` PASS.

---

## 15. Lint Assessment

| Run | Problems | Errors | Warnings |
|-----|----------|--------|----------|
| Before | 66 | 13 | 53 |
| After | **65** | **12** | 53 |

Duplicate-import error removed. Remaining errors: tooling/tests/domain test style — **not release-blocking** per repository policy.

---

## 16. Full Regression

```bash
pnpm test
```

| Metric | Before | After |
|--------|--------|-------|
| Files | 243 | 243 |
| Tests | 897 | **898** |
| Result | PASS | **PASS** |
| Exit | 0 | 0 |
| Duration | ~88s | ~104s |

No architecture, selection, production, or world navigation regressions.

---

## 17. Architecture Compliance

| Risk | Introduced? |
| ---- | ----------- |
| New selection store | **No** |
| New global state | **No** |
| New navigation pipeline | **No** |
| Parallel EntitySelection model | **No** |
| New command pipeline | **No** |
| New event bus | **No** |
| Direct React → Domain access | **No** |
| New Warehouse gameplay semantics | **No** |
| New Production semantics | **No** |
| Browser-time simulation | **No** |

---

## 18. M12 Deliverable Readiness

| M12 Deliverable | Entry State Before | Evidence After This Slice | New State | Remaining Work |
| --------------- | ------------------ | ------------------------- | --------- | -------------- |
| Release Candidate | **BLOCKED** (web build) | `pnpm build:web` PASS | **BUILD-READY** (web artifact) | RC packaging, API deploy path, QA cycle — not started |
| Final Documentation | Partial | Gate 4 + this report | Partial | M12 documentation sprint |
| QA Approval | NOT STARTED | — | NOT STARTED | Formal QA process |
| Stable Savegames | Partial | Phase 6.6 E2E save/load unchanged | **GOOD BASELINE — REQUIRES M12 VALIDATION** | Release save compatibility matrix |
| Performance Validation | Partial | Smoke tests in suite; no new gates | **REQUIRES M12 VALIDATION** | Formal performance validation deliverable |

---

## 19. M12 Entry Readiness Matrix

| Area | Current Status | Blocking first RC build? | Recommended Next Action |
| ---- | -------------- | -----------------------: | ----------------------- |
| Web production build | **PASS** | **No** | RC packaging when M12 starts |
| Root build | FAIL (tooling tsc) | No (web artifact) | Optional monorepo tsc stabilization slice |
| Typecheck | FAIL (deferred clusters) | No (web builds) | GameSession safe type fix + POLISH-05 subset |
| Lint | FAIL (12 errors) | No | Defer or targeted tooling cleanup |
| Regression | **898 PASS** | No | Maintain on each M12 slice |
| Savegames | Good baseline | No | M12 savegame release validation |
| Performance validation | Qualitative only | No | M12 formal performance deliverable |
| Accessibility | Verified with gaps (Gate 4) | No | POLISH-08 manual sweep in QA |
| Documentation | Partial | No | M12 final documentation deliverable |
| QA | NOT STARTED | Yes (process) | QA approval workflow in M12 |

---

## 20. Remaining Technical Debt

| ID | Item | Layer | Blocks web RC? |
|----|------|-------|----------------|
| POLISH-05 | Root typecheck tooling clusters | Dev | No |
| M12-PREP-01 | `GameSession.ts` regionId safe type fix | Application | No |
| M12-PREP-02 | Root/API monorepo `tsc` if API artifact required | Tooling | Depends on deploy model |
| POLISH-08 | Manual responsive a11y sweep | UX QA | No |

---

## 21. Risks

| Risk | Mitigation |
|------|------------|
| Assuming root `tsc` green = release ready | Documented: web `build:web` is authoritative distributable gate |
| Latent missing imports elsewhere | Full regression + Next build typecheck on app sources |
| Savegame compatibility at 1.0 | Dedicated M12 validation — not this slice |

---

## 22. Recommended Next M12 Package

**M12 Release Preparation Entry Audit**

Formal read-only audit of all five M12 deliverables and exit criteria, deploy artifact model (web-only vs API bundle), and prioritized workstream plan — **before** RC implementation or broad stabilization sprints.

---

## 23. Final Decision

## **OPTION A — RELEASE BUILD READINESS RESTORED**

- Required web production build: **PASS**
- No remaining release-blocking compile regression for Next.js artifact
- Regression: **898 / 898 PASS**
- Root typecheck/lint debt explicitly classified and deferred
- Architecture preserved; M11 and Production remain closed

---

## 24. Changed Files

| File | Change |
|------|--------|
| `apps/web/src/presentation/state/navigation-state.ts` | Warehouse EntitySelection integration |
| `apps/web/src/presentation/state/navigation-state.test.ts` | Warehouse selection tests |
| `apps/web/src/presentation/navigation/entity-selection-labels.ts` | Warehouse label |
| `apps/web/src/presentation/screens/company/CompanyDashboardScreen.tsx` | Missing sidebar import |
| `apps/web/src/presentation/runtime/world-search-selection.integration.test.ts` | ESLint duplicate import fix |
| `docs/architecture/reviews/M12_RELEASE_BUILD_READINESS_STABILIZATION_REPORT.md` | This report |
| `docs/development/IMPLEMENTATION_PROGRESS.md` | M12 prep status sync |

---

*End of M12 Release Build Readiness Stabilization Report*
