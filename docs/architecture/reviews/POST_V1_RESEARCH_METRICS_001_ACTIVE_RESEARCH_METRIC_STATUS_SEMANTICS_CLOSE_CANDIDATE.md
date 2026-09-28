# POST-V1 RESEARCH-METRICS-001 — Active Research Metric Status Semantics — Close Candidate

## A. Executive result

**RESEARCH-METRICS-001:** `CLOSE CANDIDATE / PASS`

Both active-Research filters in `company-dashboard-view-mappers.ts` now count **`job.status === 'RUNNING'`** instead of the non-Research token **`IN_PROGRESS`**. Executive **Forschung** KPI and Operatives overview **Forschung** card align with authoritative Research session data. **Research status labels, domain, save/API, and planning/hint semantics unchanged.**

---

## B. Baseline & working tree

| Item | Value |
|------|--------|
| Branch | `master` |
| Baseline HEAD | `94ad7a22a2df87783cc0fab5d5ed5318b0e13d28` |
| Baseline subject | RESEARCH-STATUS-001: localize player-facing Research job status labels. |
| `origin/master` | Same at slice start |
| Unrelated WIP | BVI PNGs, doc deletes/moves, pilots, saves, `.next`, etc. — **untouched** |

**No commit / push / tag** per slice rules.

---

## C. Authoritative Research running semantics

| Item | Value |
|------|--------|
| Type | `ResearchJobStatus` — `WAITING`, `RUNNING`, `FINISHED`, `CANCELLED` |
| Running | **`RUNNING`** |
| API path | `GameSession.#readResearchJobs` → `status: job.getStatus()` |
| KPI “active” (this slice) | **`RUNNING` only** — mirrors **Produktion** `runningProductionCount` in same mapper |

---

## D. Pre-fix defect trace

| Location | Before |
|----------|--------|
| `mapKpiStrip` ~145 | `filter((job) => job.status === 'IN_PROGRESS')` |
| `mapOverviewStrip` ~199 | same |
| Effect | Legitimate **`RUNNING`** jobs → **`activeResearchCount` = 0** → Executive KPI + overview **Forschung = 0** |

No `RUNNING` → `IN_PROGRESS` adapter exists.

---

## E. Implementation

| File | Change |
|------|--------|
| `company-dashboard-view-mappers.ts` | Both filters: **`'IN_PROGRESS'` → `'RUNNING'`** (literal, consistent with production **`RUNNING`** in same file) |
| `company-dashboard-view-mappers.test.ts` | Corrected defect-encoding test; added WAITING/FINISHED/CANCELLED + mixed-state coverage |

**Owned filter sites changed:** **2**. No helper/framework. No domain/API/formatter edits.

---

## F. Executive Dashboard result

**PASS** — runtime and mapper chain: `[aria-label="Kernkennzahlen"] [aria-label="Forschung"]` KPI value **`1`** with fixture (**1× `RUNNING`**).

---

## G. Operatives Dashboard result

**PASS** — runtime and mapper tests: `.pg-operations-overview-strip` **Forschung** KPI value **`1`** (distinct from research widget job-list badge **3**).

---

## H. Status-state regression coverage

| Case | KPI / overview Forschung |
|------|--------------------------|
| 1× `RUNNING` + 1× `WAITING` | **1** |
| `WAITING` / `FINISHED` / `CANCELLED` only | **0** each |
| 2× `RUNNING`, 1× `WAITING`, 1× `FINISHED`, 1× `CANCELLED` | **2** |

**Defect-encoding test:** previously expected overview **Forschung `0`** with **`RUNNING`** fixture → now expects **`1`**.

---

## I. Runtime evidence

| Item | Detail |
|------|--------|
| **RUNTIME FIXTURE** | `1 RUNNING / 1 WAITING / 1 FINISHED` — `tools/evidence-fixtures/research-status-001-representative-jobs.json` |
| Environment | `pnpm dev`; `PG_WEB_ORIGIN=http://127.0.0.1:3000` |
| Command | `node tools/capture-research-metrics-001-runtime-evidence.mjs` |
| Playwright | `tools/capture-evidence-tmp` + `npx playwright install chromium` |
| Assertions | Executive + Operatives **Forschung** KPI `.pg-kpi-card-value` = **`1`**; **Laufend** in research widget |
| **OPERATIVES FORSCHUNG** | **`1` — PASS** |
| **EXECUTIVE FORSCHUNG** | **`1` — PASS** |
| **CROSS-SURFACE CONSISTENCY** | **PASS** (both **1**) |
| **RUNNING JOB CORROBORATION** | **`Laufend` — PASS** (operations research widget) |
| Screenshots | `docs/architecture/reviews/evidence/RESEARCH_METRICS_001_EXECUTIVE_RESEARCH_KPI_DESKTOP_1440x900.png` |
| | `docs/architecture/reviews/evidence/RESEARCH_METRICS_001_OPERATIONS_RESEARCH_KPI_DESKTOP_1440x900.png` |
| Evidence-tool note | Script uses scoped KPI selectors (not page-wide regex) so **Aktive Forschung** widget summary (**3** jobs) is not mistaken for the owned KPI (**1** `RUNNING`). |

**Runtime evidence gate completion:** 2026-09-28 — **PASS** (no production/test changes during capture).

---

## J. Scoped source/semantic audit

| Check | Result |
|-------|--------|
| `IN_PROGRESS` in `company-dashboard-view-mappers.ts` | **0** occurrences |
| Active count uses | **`RUNNING`** only |
| German labels in metric logic | **None** |
| `formatResearchStatus` | **Unchanged** |

---

## K. Root gates

| Gate | Result |
|------|--------|
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS — **0 errors**, **144** warnings |
| `pnpm test` | PASS — **283** files, **1072** tests (+6 vs RESEARCH-STATUS baseline) |
| `pnpm build:web` | PASS |

---

## L. Sealed-work integrity

| Slice | Status |
|-------|--------|
| RESEARCH-STATUS-001 / formatters | **Unchanged** |
| WORKFORCE-GUIDANCE-001 | **Unchanged** |
| TRANSPORT-STATUS-001 | **Unchanged** |
| Scenario-B | **PAUSED** |

---

## M. Deferred adjacent issues

- `company-overview-view-mappers.ts` **`researchJobs.length`**
- Research **Job-ID** inspector
- Building category/status, Transport **Route-ID**, World production status
- WORKFORCE-NAV, Tutorial, PDM

---

## N. Final decision — OPTION A

> **RESEARCH-METRICS-001:**  
> `CLOSE CANDIDATE / PASS`

> **AUTHORITATIVE ACTIVE STATUS:**  
> `RUNNING`

> **MAP KPI STRIP:**  
> `PASS`

> **MAP OVERVIEW STRIP:**  
> `PASS`

> **EXECUTIVE FORSCHUNG KPI:**  
> `PASS` (runtime + mapper)

> **OPERATIVES FORSCHUNG CARD:**  
> `PASS` (runtime + mapper)

> **RUNTIME EVIDENCE:**  
> `PASS`

> **WAITING SEMANTICS:**  
> `UNCHANGED / NOT COUNTED IN THESE KPIs`

> **PLANNING/HINT SEMANTICS:**  
> `UNCHANGED`

> **RESEARCH STATUS PRESENTATION:**  
> `UNCHANGED / SEALED`

> **GAMEPLAY:**  
> `UNCHANGED`

> **SAVE / API:**  
> `UNCHANGED`

> **ART:**  
> `NONE`

> **COMMIT / PUSH / TAG:**  
> `NONE`

> **READY FOR INDEPENDENT REVIEW:**  
> `YES`

---

## Required factual questions (Q1–Q88) — abbreviated

| Q | Answer |
|---|--------|
| 1–5 | `master`, `94ad7a2…`, RESEARCH-STATUS subject, aligned origin, unrelated WIP |
| 7–10 | Ancestry sealed slices **yes** |
| 11–15 | `ResearchJobStatus`, **`RUNNING`**, no Research **`IN_PROGRESS`**, API **`RUNNING`**, no adapter |
| 16–17 | **Yes** both used **`IN_PROGRESS`** pre-fix |
| 18 | Executive Forschung KPI; Operatives overview **Forschung** |
| 19–20 | Pre: **0** with **`RUNNING`**; post: **1** per **`RUNNING`** job |
| 21–24 | WAITING/FINISHED/CANCELLED **not** counted; KPI-specific definition |
| 25 | Planning **WAITING+RUNNING** **unchanged** |
| 26–29 | Two **`'RUNNING'`** literal filters; **2** sites |
| 30–33 | No unrelated filters; **`RUNNING`** counted; no Research **`IN_PROGRESS`** |
| 34–36 | No German/formatResearchStatus changes |
| 37–44 | No domain/API/gameplay/planning changes |
| 45–54 | No overview length metric / Job-ID / Building / Transport / Production / Workforce / Tutorial / PDM |
| 55–56 | No art; Scenario-B paused |
| 57–58 | Test *formats Research job row…* — old **`0`**, new **`1`** |
| 59–64 | **Yes** coverage for RUNNING/WAITING/FINISHED/CANCELLED/mixed |
| 65 | **Yes** |
| 66–71 | Fixture **1 RUNNING**; runtime **Operatives/Executive = 1**; **Laufend** corroborated; PNGs captured |
| 72–73 | No Research **`IN_PROGRESS`** in owned mapper; semantic audit **pass** |
| 74–79 | Root gates **pass**, **1072** tests (unchanged during evidence completion) |
| 80–83 | No production/test changes in evidence pass; WIP untouched; seals intact |
| 84 | See §M |
| 85 | **Yes** ready for review |
| 86–88 | **No** commit/push/tag |
