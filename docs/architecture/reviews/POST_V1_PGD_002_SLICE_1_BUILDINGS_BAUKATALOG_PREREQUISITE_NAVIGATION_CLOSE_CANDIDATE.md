# POST-V1 PGD-002 Slice 1 — Buildings Baukatalog Prerequisite Navigation (Close Candidate)

**Task:** PGD-002-S1 — structured navigation affordances for locked Buildings Baukatalog rows (missing research / missing milestone).  
**Base commit:** `3f1dc2383a1f4c91688e360172c2758f0b385637` (PGD-TECH-001 on `origin/master`).  
**Evidence delta:** 2026-09-26 — runtime certification completed (research desktop + narrow).  
**Outcome:** **OPTION A — PGD-002-S1 COMPLETE**

---

## A. Executive result

Locked **Baukatalog** rows expose a secondary navigation control driven by **structured** `prerequisiteNavigation` (no German `reason` parsing). **Missing research** → Research + catalog row for required technology. **Missing milestone** → Company operations + Meilensteine widget. PGD-001/TECH copy unchanged.

**Runtime certification (post-review delta):** Full **Buildings → Zur Forschung → Research** flow captured with deterministic evidence fixture; **480×900** narrow catalog + navigation captured with assertions (no raw technology ID in blocker copy; `screen=research` after click). No production code changes in this delta.

---

## B. Repository baseline

| Item | Value |
|------|--------|
| Branch | `master` |
| PGD-TECH-001 | Committed/pushed @ `3f1dc23` |
| PGD-002-S1 | Local WIP; **no commit** (per prompt) |
| Unrelated WIP | Excluded (shell, BVI binaries, doc deletes, etc.) |

---

## C. Runtime health precheck

Initial `/game` webpack `823.js` failure addressed by **`pnpm dev:stop`**, removing generated `apps/web/.next`, **`pnpm dev`**, and **`pnpm build:web`**. Dev server healthy for capture @ `127.0.0.1:3000`.

---

## D. Confirmed actionability defect

Post–PGD-001/TECH, blockers named prerequisites correctly but provided **no** navigation; players had to infer Forschung / Unternehmen manually.

---

## E. Existing navigation architecture

Reused: `EntityNavigationTarget`, `navigateToTarget`, `buildNavigationQueryString`, `notification-actions` patterns. **Not** used for research technology IDs as `entity:research:*` (catalog uses **job** IDs only).

---

## F. Buildings hint/read-model path

```
GameSessionDashboardBuilder.#readPlaceBuildingHints
  → PlaceBuildingHint { reason, prerequisiteNavigation }
  → API dashboard JSON
  → company-dashboard-view-mappers
  → BuildingsScreen Baukatalog
```

---

## G. Structured navigation contract

```typescript
PlaceBuildingPrerequisiteNavigation =
  | { kind: 'missing_research'; technologyId: string }
  | { kind: 'missing_milestone' }
  | null
```

Set with **same priority** as `reason` (milestone before research before money).

---

## H. Research prerequisite implementation

- Builder emits `missing_research` + `technologyId`.
- Presentation maps to `screen: research`, `entity: none`.
- **`researchCatalogFocusTechnologyId`** (session UI state, not persisted) scrolls/highlights catalog row (`data-technology-id`).

**Entity URL focus:** Not used (would be invalid vs `researchIds` job catalog).

---

## I. Milestone prerequisite implementation

- Builder emits `{ kind: 'missing_milestone' }`.
- Target: `screen: company`, `entity: none`.
- **`pendingCompanyOperationsView`** opens **operations** dashboard (where `PGMilestonesWidget` lives); overview alone does not show milestones.

No milestone-specific entity deep link (per §13–14).

---

## J. Non-navigable blocker behavior

Money-only and other blockers: `prerequisiteNavigation: null` — no button (builder test included).

---

## K. Buildings UI affordance

Secondary **`Button`** (`variant="secondary"`): **Zur Forschung** / **Zu den Meilensteinen**; blocker copy unchanged above.

---

## L. Research destination verification

| Check | Result |
|-------|--------|
| Navigates to Research | **Yes** — runtime @ `screen=research` |
| Baukatalog shows research blocker (not milestone-first) | **Yes** — fixture save (see below) |
| Blocker copy authoritative | **Yes** — `Intermodale Logistik`; **0** raw `intermodal_logistics` in reason |
| **Zur Forschung** → required technology row on Research | **Yes** — `[data-technology-id="intermodal_logistics"]` visible with authoritative name |
| Auto-start research | **No** |
| Builder + UI tests | **Yes** (unchanged) |

**Evidence fixture (deterministic, same save schema):** `tools/evidence-fixtures/pgd-002-s1-research-prerequisite-navigation.json` built by `node tools/build-pgd-002-s1-research-evidence-fixture.mjs` from `saves/e2e-m11-phase6-production-closeout.json` with `company_001` **8/8 milestones** + `completedTechnologies: [basic_woodworking]` so **Bahnterminal** surfaces missing **intermodal_logistics** research blocker.

---

## M. Milestone destination verification

| Check | Result |
|-------|--------|
| Button visible on Baukatalog | **Yes** (capture) |
| Lands on operations + `#pg-milestones-widget-title` | **Yes** (`milestonesVisible: true`) |
| Gameplay mutation | **None** |

---

## N. Desktop runtime evidence

| File | Content |
|------|---------|
| `PGD_002_S1_BUILDINGS_RESEARCH_NAV_DESKTOP_1440x900.png` | After **Zur Forschung** — Research catalog + `intermodal_logistics` row |
| `PGD_002_S1_BUILDINGS_CATALOG_NAV_AFFORDANCE_DESKTOP_1440x900.png` | Milestone **Zu den Meilensteinen** (e2e save) |
| `PGD_002_S1_BUILDINGS_MILESTONE_NAV_DESKTOP_1440x900.png` | Company operations + Meilensteine widget |

**Tool:** `node tools/build-pgd-002-s1-research-evidence-fixture.mjs` then `node tools/capture-pgd-002-slice-1-buildings-prerequisite-navigation-runtime-evidence.mjs`

**Capture assertions (research desktop):** reason contains `Intermodale Logistik`; no raw tech ID; URL `screen=research`; catalog row visible.

---

## O. Narrow runtime evidence

| File | Content |
|------|---------|
| `PGD_002_S1_BUILDINGS_RESEARCH_CATALOG_NARROW_480x900.png` | **480×900** Baukatalog — blocker + **Zur Forschung** before click |
| `PGD_002_S1_BUILDINGS_RESEARCH_NAV_NARROW_480x900.png` | **480×900** after navigation — Research catalog |

**Assertions:** navigation button has layout box; same research URL/assertions as desktop; no task-owned overflow failure observed in capture run.

---

## P. Gameplay-state integrity

Navigation only; no commands on click.

---

## Q. PGD-001 / PGD-TECH-001 regression

Formatter files untouched. Builder label tests unchanged. Reason strings unchanged in existing tests.

---

## R. Scope / residual audit

| Check | Pass |
|-------|------|
| No `reason` string parsing in UI | **Yes** |
| Baukatalog only | **Yes** |
| No PDM / resource labels / Tick / art | **Yes** |

---

## S. Focused tests

| Suite | Result |
|-------|--------|
| `GameSessionDashboardBuilder.test.ts` (incl. navigation) | **8 PASS** |
| `place-building-prerequisite-navigation.test.ts` | **2 PASS** |
| `BuildingsScreen.test.tsx` (Zur Forschung click) | **PASS** |
| PGD milestone/technology formatter tests | **PASS** |

---

## T. Root quality gates

| Gate | Result |
|------|--------|
| `pnpm typecheck` | **PASS** |
| `pnpm lint` | **PASS** (0 errors) |
| `pnpm test` | **PASS** (279 / 1048) |
| `pnpm build:web` | **PASS** |

---

## U. Diff ownership

**Implementation (prior slice):** `GameSessionDashboard.ts`, `GameSessionDashboardBuilder.ts` (+ tests), API/view-data/mappers, navigation helper, `GameWorkspaceProvider`, `CompanyScreen`, `BuildingsScreen`, `ResearchScreen`, tests, CSS.

**Evidence delta (this task):** `tools/build-pgd-002-s1-research-evidence-fixture.mjs`, `tools/evidence-fixtures/pgd-002-s1-research-prerequisite-navigation.json` (generated), updated `tools/capture-pgd-002-slice-1-buildings-prerequisite-navigation-runtime-evidence.mjs`, evidence PNGs (`PGD_002_S1_*`), this close candidate.

**Production source:** **unchanged** in evidence-only delta.

---

## V. Deferred issues

PGD-002 Slice 2+, PDM-001, resource IDs, categories, Transport, Tick UX, TUT-001 (unchanged list from materiality review).

---

## W. Final decision

> **PGD-002-S1 DEFECT:**  
> `BUILDINGS PREREQUISITES EXPLAIN WHAT IS MISSING BUT NOT WHERE TO ACT`

> **BUILDINGS RESEARCH PREREQUISITE NAVIGATION:**  
> `WORKING` (runtime certified with evidence fixture)

> **NARROW RUNTIME (480×900):**  
> `PASS`

> **BUILDINGS MILESTONE PREREQUISITE NAVIGATION:**  
> `WORKING`

> **NAVIGATION SEMANTICS:**  
> `STRUCTURED — NO LOCALIZED STRING PARSING`

> **PGD-001 MILESTONE COPY:**  
> `UNCHANGED / SEALED`

> **PGD-TECH-001 TECHNOLOGY COPY:**  
> `UNCHANGED / SEALED`

> **GAMEPLAY / PREREQUISITES:**  
> `UNCHANGED`

> **SAVE CONTRACT:**  
> `UNCHANGED`

> **PDM / WORLD PLACEMENT:**  
> `UNCHANGED / DEFERRED`

> **NEW ART:**  
> `NONE`

> **SCENARIO-B:**  
> `REMAINS PAUSED`

> **READY FOR INDEPENDENT REVIEW:**  
> `YES`

---

## §76 Blocker contract table

| Blocker type | Existing reason | Navigation intent | Destination | Entity focus | Status |
|--------------|-----------------|-------------------|-------------|--------------|--------|
| Missing research | `Forschung „{name}“ fehlt.` | `{ kind: missing_research, technologyId }` | Research | Catalog focus id (UI state) | **PASS** |
| Missing milestone | `Meilenstein „{name}“ fehlt.` | `{ kind: missing_milestone }` | Company operations | None (widget visible) | **PASS** |
| Money / cost | `Benötigt $…` | `null` | — | — | **PASS** |
| Baubar | — | `null` | — | — | **PASS** |

---

## §77 Navigation path table

| Case | Source | Structured target | Mechanism | Destination behavior | Runtime verified? |
|------|--------|-------------------|-----------|----------------------|-------------------|
| Research | Baukatalog | `missing_research` + technologyId | `navigatePlaceBuildingPrerequisite` | Research + catalog row | **Yes** (fixture + capture) |
| Milestone | Baukatalog | `missing_milestone` | Same + `pendingCompanyOperationsView` | Operations + Meilensteine | **Yes** (e2e save + capture) |

---

## §78 Firewall table

| Area | Changed? |
|------|----------|
| Milestone/technology labels & formatters | **NO** |
| Prerequisites / rules / saves | **NO** |
| Domain commands | **NO** |
| API shape | **Additive optional** `prerequisiteNavigation` on place-building hints |
| Currency, resources, categories, Tick, PDM, tutorial, art | **NO** |

---

## §80 Factual questions (selected)

6. **UI parse German reasons?** **No**  
12. **Research technology id structural?** **Yes**  
13. **Research entity URL focus?** **No** — catalog focus via ephemeral UI state (documented)  
16. **Milestone focus entity?** **No** — operations view flag  
17. **Milestones visible at destination?** **Yes** after operations flag  
39–41. **Desktop research / milestone / narrow** — **all runtime PASS** (2026-09-26 capture)  
42. **Gameplay mutation?** **No**  
43–44. **Tests / gates** — **green**  
47. **Ready to close?** **Yes**

---

## §81 Final decision

**OPTION A — PGD-002-S1 COMPLETE**
