# POST-V1 RESEARCH-STATUS-001 — Player-Facing Research Job Status Labels — Close Candidate

## A. Executive result

**RESEARCH-STATUS-001:** `CLOSE CANDIDATE / PASS`

Forschung job table, Company research widget rows, and Company research inspector **`Status`** now use **`formatResearchStatus`**. Domain/API **`ResearchJobStatus`** values are unchanged. **Gameplay, save, and API unchanged.** Active-research KPI comparison **`IN_PROGRESS` vs `RUNNING`** deliberately **not** modified.

---

## B. Baseline & working tree

| Item | Value |
|------|--------|
| Branch | `master` |
| Baseline HEAD | `0aca0551a5e7ae55e38e2762d82288bf2ffd3a4a` |
| Baseline subject | WORKFORCE-GUIDANCE-001: add Production workforce stall resolution copy. |
| `origin/master` | Same SHA at slice start |
| HEAD = origin at start | **Yes** |
| Unrelated WIP | BVI PNGs, mass doc deletes/moves, pilots, saves, `.next`, design artifacts — **untouched** |

**Task-owned files:** `presentation-formatters.ts` (+ tests), `workspace-view-mappers.ts` (+ tests), `company-dashboard-view-mappers.ts` (+ tests), `tools/build-research-status-001-evidence-fixture.mjs`, `tools/capture-research-status-001-runtime-evidence.mjs`, `tools/evidence-fixtures/research-status-001-representative-jobs.json`, runtime PNGs under `docs/architecture/reviews/evidence/`.

**No commit / push / tag** per slice rules.

---

## C. Authoritative Research status contract

**Type:** `src/domain/research/ResearchJobStatus.ts`

| Internal | Player-facing (`formatResearchStatus`) |
|----------|----------------------------------------|
| `WAITING` | Wartend |
| `RUNNING` | Laufend |
| `FINISHED` | Abgeschlossen |
| `CANCELLED` | Abgebrochen |

Research uses **`RUNNING`** / **`FINISHED`**, not Transport’s **`IN_PROGRESS`** / **`COMPLETED`**.

**Unknown values:** passthrough (non-throwing), consistent with `formatTransportStatus`.

---

## D. Player-facing terminology evidence

| Source | Evidence |
|--------|----------|
| Production summary cards | **Wartend**, **Laufend**, **Abgeschlossen** (`ProductionScreen`, operational-state reviews) |
| Transport formatter | **`Abgebrochen`** for `CANCELLED` |
| Research domain | Four-value lifecycle distinct from Transport naming |

**Terminology ambiguous?** **No** — cross-feature German operational vocabulary is consistent; Research semantics remain domain-authoritative.

---

## E. Pre-fix defect evidence

| Surface | Before |
|---------|--------|
| `mapResearchJobRowsViewData` | `statusLabel: job.status` |
| `company-dashboard-view-mappers.ts` research rows | `statusLabel: job.status` |
| Research inspector kv | `kv('Status', job.status)` |

---

## F. Central formatter implementation

**Authority:** `apps/web/src/presentation/formatting/presentation-formatters.ts` → **`formatResearchStatus`**

No duplicate local maps in ResearchScreen or Company mappers.

---

## G. Internal status vs presentation separation

Forschung table displays **`statusLabel` only** (no row logic on status today). Company research rows expose formatted **`statusLabel`**; metrics still filter on raw **`job.status === 'IN_PROGRESS'`** (unchanged). **No logic compares German labels.**

---

## H. Forschung screen result

**PASS** — `mapResearchJobRowsViewData` uses `formatResearchStatus`.

Runtime: fixture save with **WAITING / RUNNING / FINISHED** jobs; table shows **Wartend / Laufend / Abgeschlossen**; raw enums absent from status column.

**Evidence:** `docs/architecture/reviews/evidence/RESEARCH_STATUS_001_RESEARCH_SCREEN_DESKTOP_1440x900.png`, `…_NARROW_480x900.png`

---

## I. Company Research result

**PASS** — `PGResearchWidget` rows receive formatted `statusLabel` from dashboard mapper.

Runtime: Operatives Dashboard research widget shows German labels; raw enums absent from widget text.

**Evidence:** `docs/architecture/reviews/evidence/RESEARCH_STATUS_001_COMPANY_RESEARCH_DESKTOP_1440x900.png`, `…_NARROW_480x900.png`

---

## J. Research inspector result

**PASS** — inspector **`Status`** → `formatResearchStatus(job.status)`.

**Job-ID** kv unchanged (`research_status_evidence_done` visible in runtime).

---

## K. Focused tests

| Suite | Coverage |
|-------|----------|
| `presentation-formatters.test.ts` | All four statuses + unknown passthrough |
| `workspace-view-mappers.test.ts` | `mapResearchJobRowsViewData` labels |
| `company-dashboard-view-mappers.test.ts` | Research rows, inspector Status, Job-ID preserved; overview Forschung card still **0** with `RUNNING` jobs (metrics defect isolated) |

**Focused tests:** PASS (full suite **1066** tests).

---

## L. Runtime evidence

| Step | Command |
|------|---------|
| Fixture | `node tools/build-research-status-001-evidence-fixture.mjs` |
| Capture | `node tools/capture-research-status-001-runtime-evidence.mjs` (requires `pnpm dev`, `PG_WEB_ORIGIN` default `http://127.0.0.1:3000`) |

**Visible at runtime:** **WAITING → Wartend**, **RUNNING → Laufend**, **FINISHED → Abgeschlossen**.

**CANCELLED:** formatter + unit tests only (no legitimate runtime job in fixture).

---

## M. Scoped raw-enum audit

Owned Research status presentation (table/widget/inspector **Status** cells): **0** raw `WAITING` / `RUNNING` / `FINISHED` / `CANCELLED` after fix (runtime script asserts).

---

## N. Root gates

| Gate | Result |
|------|--------|
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS — **0 errors**, **144** warnings (unchanged) |
| `pnpm test` | PASS — **283** files, **1066** tests |
| `pnpm build:web` | PASS |

---

## O. Deferred Research metrics defect

**RESEARCH-METRICS residual — `IN_PROGRESS` vs `RUNNING`**

`company-dashboard-view-mappers.ts` still counts active research with `job.status === 'IN_PROGRESS'` while API/domain emit **`RUNNING`**. **Intentionally unchanged** in RESEARCH-STATUS-001. Test asserts overview Forschung card value **`0`** despite **`RUNNING`** fixture jobs.

---

## P. Deferred adjacent semantic families

| Item | Status |
|------|--------|
| Research **Job-ID** inspector leakage | Deferred |
| Transport **Route-ID** | Deferred |
| Building category / **BuildingStatus** | Deferred |
| World **production** job raw status | Deferred |
| WORKFORCE-NAV-001 | Not ready |
| PDM / Tutorial | Not in scope |
| Scenario-B art | Paused |

---

## Q. Final decision — OPTION A

> **RESEARCH-STATUS-001:**  
> `CLOSE CANDIDATE / PASS`

> **PLAYER-FACING STATUS AUTHORITY:**  
> `ResearchJobStatus → formatResearchStatus`

> **FORSCHUNG SCREEN:**  
> `PASS`

> **COMPANY RESEARCH:**  
> `PASS`

> **RESEARCH INSPECTOR:**  
> `PASS`

> **INTERNAL STATUS SEMANTICS:**  
> `UNCHANGED`

> **RESEARCH METRICS:**  
> `UNCHANGED / KNOWN RESIDUAL DEFERRED`

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

## Required factual questions (Q1–Q82)

| Q | Answer |
|---|--------|
| 1 | `master` |
| 2 | `0aca0551a5e7ae55e38e2762d82288bf2ffd3a4a` |
| 3 | Same as baseline HEAD |
| 4 | **Yes** |
| 5 | BVI PNGs, doc mass deletes/moves, pilots, saves, `.next`, etc. |
| 6 | **Yes** (ancestry) |
| 7 | **Yes** (ancestry) |
| 8 | `ResearchJobStatus` |
| 9 | WAITING, RUNNING, FINISHED, CANCELLED |
| 10 | **RUNNING** (not IN_PROGRESS for Research) |
| 11 | **FINISHED** (not COMPLETED for Research) |
| 12 | Production cards + Transport Abgebrochen pattern |
| 13–16 | Wartend / Laufend / Abgeschlossen / Abgebrochen |
| 17 | **No** |
| 18 | Established German operational UI vocabulary + domain four-value set |
| 19 | Passthrough raw string |
| 20 | `formatResearchStatus` in `presentation-formatters.ts` |
| 21 | **No** |
| 22 | `mapResearchJobRowsViewData` |
| 23 | `company-dashboard-view-mappers.ts` research row map |
| 24 | Research inspector `kv('Status', …)` |
| 25–27 | **Yes** / **Yes** / **Yes** |
| 28 | N/A — no row logic field added (display-only path) |
| 29–30 | **No** / **No** |
| 31–35 | **No** changes |
| 36–38 | **No** / **No** / **No** |
| 39 | **No** |
| 40 | **Yes** — deferred |
| 41 | **No** |
| 42–50 | **No** changes (World production, buildings, transport, production, workforce, tutorial, PDM) |
| 51 | **No** |
| 52 | **Yes** — paused |
| 53–55 | **Yes** / **Yes** / **Yes** |
| 56–59 | **Yes** — mapper/inspector tests; no German-label logic |
| 60 | **Yes** |
| 61 | **Yes** |
| 62 | Wartend, Laufend, Abgeschlossen |
| 63 | **Yes** |
| 64 | **Yes** |
| 65 | **Yes** |
| 66 | **Yes** |
| 67 | **Yes** |
| 68 | Formatter-only for CANCELLED |
| 69 | **Yes** — 480×900 Forschung + Company captures |
| 70 | **0** in owned scope |
| 71–76 | typecheck PASS; lint 0 errors / 144 warnings; tests PASS 283/1066; build:web PASS |
| 77 | **None** task-owned |
| 78 | **Yes** |
| 79 | **No** |
| 80 | See §P |
| 81 | **Yes** |
| 82 | **No** commit/push/tag |
