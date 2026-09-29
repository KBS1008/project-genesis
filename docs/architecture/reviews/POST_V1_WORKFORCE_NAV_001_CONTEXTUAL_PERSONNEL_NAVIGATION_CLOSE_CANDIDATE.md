# POST-V1 WORKFORCE-NAV-001 — Contextual Personnel Navigation Close Candidate

**Mode:** Bounded UX / navigation implementation — no commit  
**Date:** 2026-09-28  
**Authority:** `docs/development/Prompts/POST_V1_WORKFORCE_NAV_001_CONTEXTUAL_PERSONNEL_NAVIGATION.md`  
**Implementation baseline HEAD:** `9864fa0454c19ed16b41999dc90b3078078c1bfa` (unchanged commit; task-owned diff local only)

---

## A. Executive result

**WORKFORCE-NAV-001** implements approved contextual navigation from Production **`STALLED_WORKFORCE`** via **`Personal verwalten`** → **Unternehmen → Operatives Dashboard → Personal**, carrying **`buildingId`** as one-shot transient intent and focusing the existing Personal / assignment controls (Mitarbeiter widget + sidebar Zuweisungen). No hire/assign commands on navigation. Sealed **WORKFORCE-GUIDANCE-001** copy unchanged.

**Final decision:** **OPTION A — RUNTIME EVIDENCE COMPLETE / CLOSE CANDIDATE PASS**

Runtime certification executed on **2026-09-28** via `node tools/capture-workforce-nav-001-runtime-evidence.mjs` (Desktop **1440×900** + Narrow **480×900**). Machine assertions **PASS**; four PNGs captured under `docs/architecture/reviews/evidence/`.

---

## B. Baseline & working tree

| Item | Value |
|------|--------|
| Branch | `master` |
| Baseline HEAD | `9864fa0454c19ed16b41999dc90b3078078c1bfa` |
| Baseline subject | RESEARCH-METRICS-001: count active Forschung KPIs using RUNNING status. |
| `origin/master` | Same SHA at implementation start |
| Task commit | **None** (per prompt) |
| Unrelated WIP | Unchanged (BVI PNGs, doc moves, pilots, saves, etc.) |

---

## C. Approved product/UX contract

**Resolved contract (traceability):**

> `STALLED_WORKFORCE` → **`Personal verwalten`** → Unternehmen / Operatives Dashboard / Personal → affected **`buildingId`** workforce-assignment context → player manually hires/assigns as needed.

---

## D. Existing navigation architecture

| Layer | Role |
|-------|------|
| **PGD-002-S1** | `PlaceBuildingPrerequisiteNavigationViewData` + `resolvePlaceBuildingPrerequisiteNavigation` → `navigateToTarget` + transient focus (`researchCatalogFocusTechnologyId`) + `pendingCompanyOperationsNavigation` for milestones |
| **`GameWorkspaceProvider`** | Owns pending operations navigation + `navigatePlaceBuildingPrerequisite` / new `navigateProductionWorkforcePersonnel` |
| **`CompanyScreen`** | Switches `overview` → `operations` when pending intent present |
| **`CompanyDashboardScreen`** | Consumes `workforce_assignment` intent, scrolls to Personal widget, selects building, highlights sidebar assign actions |

No parallel router; boolean `pendingCompanyOperationsView` replaced by discriminated **`CompanyOperationsPendingNavigation`**.

---

## E. Architecture-fit result

**PASS** — bounded extension of existing PGD pending-intent pattern; no save/API/domain changes.

---

## F. Structured navigation intent

**Type:** `CompanyOperationsPendingNavigation` (`company-operations-pending-navigation.ts`)

```typescript
| { kind: 'milestone_overview' }
| { kind: 'workforce_assignment'; buildingId: string }
```

**Resolver:** `resolveProductionWorkforcePersonnelNavigation(buildingId)` → `{ target: company screen, pendingNavigation }`.

Transient React state in `GameWorkspaceProvider` only.

---

## G. STALLED_WORKFORCE source action

| Item | Detail |
|------|--------|
| Condition | `job.operationalState === 'STALLED_WORKFORCE'` → `workforcePersonnelNavigationBuildingId` on row view-data |
| CTA | **`Personal verwalten · {buildingLabel}`** below workforce `StatusBanner` (deduped per building) |
| Handler | `navigateProductionWorkforcePersonnel(buildingId)` — **no** `runCommand` |
| German parsing | **None** |

---

## H. Company / Operatives / Personal destination

1. `navigateToTarget({ screen: 'company', entitySelection: { kind: 'none' } })`
2. `CompanyScreen` sets operations view (workforce intent **not** cleared here)
3. `CompanyDashboardScreen` consumes intent, clears pending, scrolls to `#pg-employees-widget-title`

---

## I. Affected-building focus

| Mechanism | Behavior |
|-----------|----------|
| Building selection | `selectEntity({ kind: 'building', id })` when building exists in dashboard |
| Personal widget | `PGEmployeesWidget` — `data-workforce-assignment-focus-building`, focus hint with building **name** |
| Sidebar | `PGOperationsSidebar` — `pg-workforce-assignment-focus-action` on assign buttons matching `buildingId` |
| Stale `buildingId` | No building select; intent still cleared; no unrelated building forced |

---

## J. One-shot consumption

| Step | Owner |
|------|--------|
| Set intent | `navigateProductionWorkforcePersonnel` |
| Open operations | `CompanyScreen` effect |
| Apply focus + **clear** | `CompanyDashboardScreen` effect → `clearPendingCompanyOperationsNavigation()` |
| Milestone path | Cleared immediately in `CompanyScreen` (unchanged behavior) |

Later Company visits without new navigation: **no** pending intent re-applied (provider state null).

---

## K. No-auto-action safety

Navigation path calls **only** `navigateToTarget` + pending state. **No** `hireEmployee`, **no** `assignEmployee`, **no** production commands. Tests assert `runCommand` not called on CTA click.

---

## L. Focused regression tests

| Area | File | Status |
|------|------|--------|
| Resolver / payload | `production-workforce-personnel-navigation.test.ts` | PASS |
| Pending discriminator | `company-operations-pending-navigation.test.ts` | PASS |
| CTA + buildingId call | `ProductionScreen.test.tsx` | PASS |
| Operations view routing | `CompanyScreen.test.tsx` | PASS |
| Mapper field | `production-screen-view-mappers.test.ts` | PASS |
| Guidance sealed | `production-workforce-guidance.test.ts` | PASS (unchanged) |

---

## M. Desktop runtime evidence

| Item | Value |
|------|--------|
| Command | `PG_WEB_ORIGIN=http://127.0.0.1:3000 node tools/capture-workforce-nav-001-runtime-evidence.mjs` |
| Fixture | `tools/evidence-fixtures/workforce-guidance-001-stalled-workforce.json` |
| Affected building | **`building_005`** — **Closeout Sawmill** (sawmill, zero assigned workers, `production_001` **RUNNING** / stall) |
| Dev stack | `pnpm dev` (API **3001**, web **3000**); Playwright Chromium via `tools/capture-evidence-tmp` |
| Result | **PASS** (exit 0) |

**Screenshots**

- `docs/architecture/reviews/evidence/WORKFORCE_NAV_001_PRODUCTION_CTA_DESKTOP_1440x900.png`
- `docs/architecture/reviews/evidence/WORKFORCE_NAV_001_COMPANY_PERSONAL_FOCUS_DESKTOP_1440x900.png`

**Machine checks (desktop):** scoped Production stall copy (**Keine Mitarbeiter** + guidance); CTA **`Personal verwalten · Closeout Sawmill`**; click → **`.pg-operations-panels`** + **`#pg-employees-widget-title`**; `data-workforce-assignment-focus-building="building_005"`; focus hint contains **Closeout Sawmill**; highlighted sidebar assign control; **`/api/dashboard` employee assignment snapshot unchanged** (no hire/assign).

---

## N. Narrow runtime evidence

| Item | Value |
|------|--------|
| Viewport | **480×900** |
| Result | **PASS** (same script pass) |

**Screenshots**

- `docs/architecture/reviews/evidence/WORKFORCE_NAV_001_PRODUCTION_CTA_NARROW_480x900.png`
- `docs/architecture/reviews/evidence/WORKFORCE_NAV_001_COMPANY_PERSONAL_FOCUS_NARROW_480x900.png`

CTA reachable; destination Personal + building focus preserved; no auto-hire/auto-assign (dashboard employee snapshot).

---

## N2. Runtime evidence table

| Check | Desktop 1440×900 | Narrow 480×900 |
|---|---|---|
| `STALLED_WORKFORCE` source | PASS | PASS |
| Workforce guidance visible | PASS | PASS |
| `Personal verwalten` visible/reachable | PASS | PASS |
| Company / Operatives reached | PASS | PASS |
| Operatives Dashboard reached | PASS | PASS |
| Personal context reached | PASS | PASS |
| Source building = focused building (`building_005`) | PASS | PASS |
| Assignment controls reachable | PASS | PASS |
| Auto-hire | NONE | NONE |
| Auto-assign | NONE | NONE |

**One-shot consumption:** not re-captured in browser; **`CompanyScreen.test.tsx`** + **`production-workforce-personnel-navigation.test.ts`** prove pending payload and milestone vs workforce clear semantics.

---

## O. Evidence-only script changes (this gate)

`tools/capture-workforce-nav-001-runtime-evidence.mjs` — **evidence-only** fixes:

1. **Session hydration:** load fixture → reload `/game?screen=production` (avoids empty session on first paint).
2. **CTA locator:** partial accessible name `/Personal verwalten/` + text assert **Closeout Sawmill** (Playwright exact-name mismatch on middle dot).
3. **Destination wait:** assert **`.pg-operations-panels`** instead of `screen=company` URL (navigation sets `entity=building:building_005`).
4. **Assertions:** stall/guidance scoped to **`.pg-operation-screen`**; focus building id **`building_005`**; **`/api/dashboard` employee assignment snapshot** before/after navigation.

**Production / product-test code:** unchanged during this evidence completion pass.

| Check | Result |
|-------|--------|
| CTA from `operationalState` | PASS |
| `buildingId` from session read model | PASS |
| Pending intent typed | PASS |
| Not persisted | PASS |
| Navigation-only | PASS |

---

## P. Root gates (prior PASS — not re-run this evidence pass)

| Gate | Result |
|------|--------|
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS — **0 errors**, **144** warnings |
| `pnpm test` | PASS — **286** files, **1077** tests (+5 vs RESEARCH-METRICS baseline) |
| `pnpm build:web` | PASS |

---

## Q. Root gates

WORKFORCE-GUIDANCE, RESEARCH-METRICS/STATUS, TRANSPORT-STATUS, TIME-UX, PGD families — **not reopened**. Scenario-B **PAUSED**.

---

## R. Sealed-work integrity

BUILDING-CATEGORY, BUILDING-STATUS, Route-ID, World production status, Research Job-ID, Tutorial, PDM — unchanged.

---

## S. Deferred adjacent issues

None opened by this slice.

---

## T. Final decision — OPTION A (runtime evidence complete)

> **WORKFORCE-NAV-001:** `RUNTIME EVIDENCE COMPLETE / CLOSE CANDIDATE PASS`  
> **DESKTOP 1440×900:** `PASS`  
> **NARROW 480×900:** `PASS`  
> **SOURCE BUILDING = FOCUSED BUILDING:** `PASS` (`building_005` / Closeout Sawmill)  
> **AUTO-HIRE / AUTO-ASSIGN:** `NONE`  
> **GAMEPLAY MUTATION FROM NAVIGATION:** `NONE`  
> **PRODUCT CODE CHANGED DURING EVIDENCE PASS:** `NO`  
> **PRODUCT TEST CODE CHANGED DURING EVIDENCE PASS:** `NO`  
> **ROOT GATES:** `PRIOR PASS REMAINS APPLICABLE` (286 files / 1077 tests)  
> **REPORT UPDATED:** `YES`  
> **COMMIT / PUSH / TAG:** `NONE`  
> **READY FOR INDEPENDENT FINAL CLOSURE:** `YES`

---

## Required factual questions (Q1–Q104) — abbreviated

| Q | Answer |
|---|--------|
| 1–5 | `master`, `9864fa0`, RESEARCH-METRICS subject, origin aligned |
| 6 | WORKFORCE-NAV **uncommitted** (local task-owned diff on baseline HEAD) |
| 7–8 | Task-owned: navigation provider, Company/Production screens, mappers, tests, evidence script; unrelated WIP unchanged |
| 9–15 | Structured implementation sanity **PASS**; fixture **`workforce-guidance-001-stalled-workforce.json`**; **`building_005` / Closeout Sawmill** |
| 12–30 | PGD pending pattern; `workforce_assignment` + `buildingId`; transient only; `STALLED_WORKFORCE` source — **no** German parsing; `buildingId` from read model |
| 31–42 | Destination + focus + **no** auto hire/assign/start |
| 43–51 | Simulation/hire/assign unchanged; WORKFORCE-GUIDANCE copy unchanged |
| 52–60 | One-shot clear; stale safe; per-building CTAs |
| 61–67 | Focused tests **PASS** |
| 16–20 | Dev stack **yes**; **`PG_WEB_ORIGIN=http://127.0.0.1:3000 node tools/capture-workforce-nav-001-runtime-evidence.mjs`**; Playwright via `tools/capture-evidence-tmp` |
| 21–54 | Desktop + narrow runtime **executed**; machine assertions **PASS**; four PNGs under `docs/architecture/reviews/evidence/` |
| 55–57 | One-shot: **CompanyScreen.test.tsx** (not browser re-test) |
| 58–63 | Script changed evidence-only (§O); **no** production/product-test changes during evidence pass |
| 64–73 | Sealed slices unchanged; Scenario-B **paused** |
| 74–82 | Prior root gates applicable; report updated; stale runtime-not-executed removed |
| 83–86 | Ready for independent final closure **YES**; commit/push/tag **none** |
| 94–99 | typecheck/lint/test/build:web **PASS** (1077 tests — prior run, unchanged this pass) |
