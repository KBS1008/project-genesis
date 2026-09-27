# POST-V1 WORKFORCE-GUIDANCE-001 — Production Workforce Blocker Actionability — Close Candidate

## A. Executive result

**WORKFORCE-GUIDANCE-001:** `CLOSE CANDIDATE / PASS`

When Production enters **`STALLED_WORKFORCE`**, the screen now shows **copy-only** resolution guidance naming **Unternehmen → Operatives Dashboard → Personal** and assignment to the **betroffenen Gebäude**. Status label **`Keine Mitarbeiter`** is unchanged. **No navigation, no employee commands, no simulation changes.**

---

## B. Baseline & working tree

| Item | Value |
|------|--------|
| Branch | `master` |
| Baseline HEAD | `c2282083a07e07f52cc0f85a480f5aaf6accc467` |
| Baseline subject | TRANSPORT-STATUS-001: localize transport status labels on player surfaces. |
| `origin/master` | Matched baseline at implementation start |
| TIME-UX-R1 / TRANSPORT-STATUS-001 | Present in ancestry |
| Unrelated WIP | BVI assets, doc moves/deletes, pilots, saves — **excluded** |

**No commit/push/tag** per slice rules.

---

## C. Authoritative workforce semantics

| Topic | Current truth |
|-------|----------------|
| Stall state | `operationalState: 'STALLED_WORKFORCE'` |
| Condition | Running job, energy OK, `getWorkerEfficiency(building, recipe) <= 0` |
| Assignment rule | Headcount at building; **no employee-type filter** |
| `employee_production_worker` | Content/flavor only; **not** a simulation gate |
| `recipe_planks` workers | `2` in content; **not** surfaced in guidance |

---

## D. Pre-fix player problem

Production showed **`Keine Mitarbeiter`** / **Gestoppt wegen Personal** and building/recipe context, but **no** explanation of **Unternehmen → Operatives Dashboard → Personal** hire/assign workflow.

---

## E. Selected guidance boundary

**Single authoritative surface:** Production **`StatusBanner`** when `mapProductionOverviewSummary` reports `stalledWorkforceCount > 0` (`workforceStallGuidance`).

Not duplicated on every job row. **`formatProductionStatus`** remains a short status label only.

---

## F. Final player-facing copy

> Keine Mitarbeiter am Gebäude zugewiesen. Unter Unternehmen → Operatives Dashboard → Personal bei Bedarf einen Mitarbeiter einstellen und dem betroffenen Gebäude zuweisen.

**Authority:** `apps/web/src/presentation/formatting/production-workforce-guidance.ts` → `PRODUCTION_WORKFORCE_STALL_GUIDANCE` / `resolveProductionWorkforceStallGuidance`.

---

## G. Implementation

| File | Role |
|------|------|
| `production-workforce-guidance.ts` | Central guidance copy + structured resolver |
| `workspace-view-mappers.ts` | `workforceGuidance` on rows; `workforceStallGuidance` on overview |
| `workspace-view-data.ts` | View-data fields |
| `ProductionScreen.tsx` | Renders warning `StatusBanner` when guidance non-null |

---

## H. Semantic safeguards

| Guard | Result |
|-------|--------|
| Mandatory `Produktionsmitarbeiter` | **Not stated** |
| Hardcoded worker count | **Not stated** |
| German-string parsing | **Not used** — `operationalState === 'STALLED_WORKFORCE'` |
| Navigation / hire / assign in Production | **None** |

---

## I. Focused tests

| Suite | Coverage |
|-------|----------|
| `production-workforce-guidance.test.ts` | Resolver + destination terms + negative type/count |
| `production-screen-view-mappers.test.ts` | Row guidance + overview `workforceStallGuidance` |
| `ProductionScreen.test.tsx` | Visible guidance; no `navigateToTarget` |

**1065** tests pass (root suite).

---

## J. Runtime evidence

| Item | Path |
|------|------|
| Fixture builder | `tools/build-workforce-guidance-001-evidence-fixture.mjs` |
| Fixture | `tools/evidence-fixtures/workforce-guidance-001-stalled-workforce.json` |
| Capture | `tools/capture-workforce-guidance-001-runtime-evidence.mjs` |
| PNG 1440×900 | `docs/architecture/reviews/evidence/WORKFORCE_GUIDANCE_001_PRODUCTION_STALL_DESKTOP_1440x900.png` |
| PNG 480×900 | `docs/architecture/reviews/evidence/WORKFORCE_GUIDANCE_001_PRODUCTION_STALL_NARROW_480x900.png` |

Runtime shows **`Keine Mitarbeiter`**, guidance with **Operatives Dashboard → Personal**, no mandatory type copy.

---

## K. Narrow viewport

**480×900:** guidance readable; **PASS** (dedicated PNG).

---

## L. Root gates

| Gate | Result |
|------|--------|
| `pnpm typecheck` | **PASS** |
| `pnpm lint` | **PASS** (0 errors, 144 warnings) |
| `pnpm test` | **PASS** — 283 files / **1065** tests |
| `pnpm build:web` | **PASS** |

---

## M. Deferred structured navigation

**WORKFORCE-GUIDANCE structured-navigation follow-up** — open-operations / Personal focus contract not defined; copy-only slice intentionally stops here.

---

## N. Deferred related work

Route-ID, Research/Production/Building status labels, PDM, tutorial, Scenario-B art — unchanged / out of scope.

---

## O. Final decision — OPTION A

> **WORKFORCE-GUIDANCE-001:**  
> `CLOSE CANDIDATE / PASS`

> **PLAYER PROBLEM:**  
> `STALLED_WORKFORCE now includes actionable resolution guidance`

> **GUIDANCE DESTINATION:**  
> `Unternehmen → Operatives Dashboard → Personal`

> **REPAIR MODE:**  
> `COPY-ONLY`

> **EMPLOYEE TYPE REQUIREMENT:**  
> `NO FALSE MANDATORY TYPE CLAIM`

> **WORKER COUNT:**  
> `NO RECIPE-SPECIFIC GENERALIZATION`

> **NAVIGATION:**  
> `UNCHANGED / NONE ADDED`

> **WORKFORCE LOGIC:**  
> `UNCHANGED`

> **PRODUCTION LOGIC:**  
> `UNCHANGED`

> **SAVE / API:**  
> `UNCHANGED`

> **ART:**  
> `NONE`

> **STRUCTURED NAVIGATION:**  
> `DEFERRED`

> **COMMIT / PUSH / TAG:**  
> `NONE`

> **READY FOR INDEPENDENT REVIEW:**  
> `YES`

---

*Required factual questions (prompt §35): answered inline in sections B–O; baseline includes committed TRANSPORT-STATUS-001 on `c228208`; destination labels reverified in `ExecutiveDashboardScreen` / `PGOperationsSidebar` / `CompanyScreen`; no employee APIs in Production; sealed families untouched.*
