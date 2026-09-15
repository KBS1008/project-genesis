# Post-V1 Production Operational State Visual Integration — Close Candidate Report

## A. Executive Summary

Bounded **code-only** integration adds decorative **`DashboardIcon`** cues to **ProductionScreen** PR-001 summary cards for **STALLED_ENERGY**, **STALLED_WORKFORCE**, and **FINISHED**. Authoritative German labels unchanged. Job table and factory rows remain **text + progress only** to limit visual noise. No new art, registry, or domain changes.

## B. Repository Baseline

| Item | Value |
|------|--------|
| Branch | `master` (working tree) |
| HEAD | `51c414bb5a56a1f2d1388a9f66ec7bb344f8d00a` |
| MM-007 closeout (`51c414b`) | Present at HEAD |
| `origin/master` (local ref) | `730ed190bb9c3b64c426b185a32fe36528c4bda7` |
| `v1.0.0` | `c4bb643df6fda7792906f34fbbb20ff07e9bfeef` |
| `v1.0.0-rc.1` | `442665cd6437bdebff88fd1540cedc689238c240` |
| fetch | Not re-run this pass; prior sessions noted EPERM on `FETCH_HEAD` in some environments |

## C. Existing Production State Presentation

- **PR-001 summary grid** (`ProductionScreen.tsx`): six metric cards — Aktive Jobs, Laufend, Energie fehlt, Keine Mitarbeiter, Wartend, Abgeschlossen — counts from `mapProductionOverviewSummary`.
- **Job table**: `statusLabel` via `formatProductionStatus` + `ProductionProgressCell` (percent bar).
- **Factory groups**: per-job `statusLabel` text only.
- **API states** (`client.ts`): `WAITING`, `RUNNING`, `FINISHED`, `STALLED_ENERGY`, `STALLED_WORKFORCE`.

## D. Existing DashboardIcon Vocabulary

Verified names in `DashboardIcon.tsx`: `cash`, `energy`, `transport`, `warehouse`, `onsite`, `employees`, `success`, `error`, `info`, `check`.

- **Stroke / color**: `stroke: currentColor`, `fill: none`, `strokeWidth: 1.75`.
- **A11y**: `aria-hidden: true` on all variants (decorative).
- **Completion precedent**: `PGTutorialPanel` uses `success` for completion; `check` not used for completion elsewhere.

## E. State-by-State Decision

| State | Current presentation | Icon available | Adds value | Selected | Rationale |
|-------|---------------------|----------------|------------|----------|-----------|
| **WAITING** | Card “Wartend” + row labels (material/transport) | `info` | NO | **NONE** | Text already specific; `info` risks neutral-alert reading |
| **RUNNING** | “Laufend” card + progress bar/% | — | NO | **NONE** | Progress cell is established running signal |
| **FINISHED** | “Abgeschlossen” card + row status | `success`, `check` | YES | **`success`** | Matches tutorial completion icon |
| **STALLED_ENERGY** | “Energie fehlt” card + rows | `energy` | YES | **`energy`** | Reinforces blocking resource category |
| **STALLED_WORKFORCE** | “Keine Mitarbeiter” card + rows | `employees` | YES | **`employees`** | Reinforces workforce stall |

**Unknown / unexpected state** → **NONE** (no throw).

## F. Selected Integration Boundary

- **Consumer**: `ProductionScreen` PR-001 summary card titles only.
- **Shared presentation**:
  - `production-operational-state-dashboard-icon.ts` — state → icon \| null
  - `ProductionOperationalStateIconLabel.tsx` — icon + visible text
- **Primitive**: `Card` `title` widened to `ReactNode` (minimal; no geometry change).
- **Not in scope**: dashboard, world, buildings, market, warehouse screens; job table cells; factory list rows.

## G. Implementation

| File | Change |
|------|--------|
| `production-operational-state-dashboard-icon.ts` | Mapping + documented decisions |
| `ProductionOperationalStateIconLabel.tsx` | Inline flex label wrapper |
| `ProductionScreen.tsx` | Icons on Energie fehlt, Keine Mitarbeiter, Abgeschlossen titles |
| `operation-screen.css` | `.pg-production-state-icon-label`, `.pg-production-state-icon` |
| `Card.tsx` | `title?: ReactNode` |
| Tests | `production-operational-state-dashboard-icon.test.ts`, `ProductionScreen.test.tsx` |

**New assets**: none. **Registry / sync**: unchanged.

## H. Accessibility

- State **text remains in the DOM** and in card `<h2>` headings.
- Icons **`aria-hidden="true"`** via `DashboardIcon`; no duplicate accessible name.
- Unknown states: text-only, no crash.

## I. Focused Test Matrix

| Suite | Tests | Result |
|-------|-------|--------|
| `production-operational-state-dashboard-icon.test.ts` | 3 | **PASS** |
| `ProductionScreen.test.tsx` | 9 (incl. new decorative-icon case) | **PASS** |
| **Total** | **12** | **PASS** |

Task-introduced failures: **none**.

## J. Typecheck / Build

| Command | Result | Classification |
|---------|--------|----------------|
| `pnpm --filter @project-genesis/web typecheck` | Fail (multiple TS errors + EPERM on `tsconfig.tsbuildinfo`) | **PRE-EXISTING FAIL** / env |
| `pnpm --filter @project-genesis/web build` | Fail at ESLint: unused `render` in `MainMenuHome.test.tsx` | **PRE-EXISTING FAIL** |

Next.js compile step succeeded before lint gate.

## K. Runtime / Layout Validation

No extended browser automation. Evidence:

- CSS: inline-flex + `gap: var(--space-xs)`, 1.125rem icon, `flex-shrink: 0`.
- Tests: three summary icons only; Laufend/Wartend headings and jobs table icon-free.
- Responsive grid unchanged (`auto-fit`, `minmax(10rem, 1fr)`).

**Result**: **PASS** (deterministic contract).

## L. Visual Noise Assessment

**Decision**: Icons on **summary cards only** (3 of 6 cards). Repeated row-level icons rejected — fixture shows multiple “Energie fehlt” rows; row icons would triple noise without adding scan value beyond card-level aggregates.

## M. New-Art Assessment

**NEW ICON-008 ART REQUIRED: NO**

Existing `energy`, `employees`, and `success` cover the integrated states. No vocabulary gap for this slice.

## N. Coverage Boundary

| State | Coverage |
|-------|----------|
| WAITING | **TEXT-ONLY** |
| RUNNING | **TEXT-ONLY** |
| FINISHED | **ICON** (`success` on summary card) |
| STALLED_ENERGY | **ICON** (`energy`) |
| STALLED_WORKFORCE | **ICON** (`employees`) |

## O. Must-Have Gap Assessment

**ADDITIONAL PRODUCTION-STATE VISUAL MUST-HAVE GAP: NO**

Optional future polish (e.g. row-level icons) is not required for comprehension.

## P. Documentation Impact

- **Lifecycle / catalog**: not changed (no ICON-008 art produced).
- **Backlog**: `VISUAL_PRODUCTION_BACKLOG.md` still lists `ICON-008_Status.svg`; priority review already classifies production states as **code-only**. No backlog edit in this pass — not materially blocking; close report records sufficiency of `DashboardIcon`.

## Q. Scope Verification

Task-owned code changes limited to production presentation + `Card` title type + shared operation CSS + tests + this report. Sealed families (ICON-001/002, BR-001, MM-001/006/007) untouched.

## R. Repository Integrity

- **Commit**: none (per prompt)
- **Push**: none
- **Tags moved**: none
- Working tree contains unrelated doc/design churn; **do not bundle** with this integration commit.

## S. Final Decision

**OPTION A — PRODUCTION OPERATIONAL STATE VISUAL INTEGRATION — READY TO CLOSE / PASS CANDIDATE**

---

# Production Operational State Visual Integration
## Close Candidate Execution Summary

### Baseline

- Branch: `master`
- HEAD: `51c414bb5a56a1f2d1388a9f66ec7bb344f8d00a`
- MM-007 closeout present: **yes** (HEAD)
- fetch: not verified this pass
- origin/master / remote master: local ref `730ed190…` (divergence from HEAD possible without fresh fetch)
- tags moved: no

### Existing Vocabulary

- DashboardIcon names relevant: `energy`, `employees`, `success` (+ unused for this task: `info`, `check`, …)
- accessibility contract: decorative `aria-hidden`
- color contract: `currentColor` stroke

### State Mapping

- WAITING: TEXT-ONLY
- RUNNING: TEXT-ONLY
- FINISHED: `success`
- STALLED_ENERGY: `energy`
- STALLED_WORKFORCE: `employees`
- unknown fallback: null / text-only

### Implementation

- consumer: `ProductionScreen` summary cards
- helper/mapping: `resolveProductionOperationalStateDashboardIcon`, `ProductionOperationalStateIconLabel`
- files changed: 7 task files (see §G)
- CSS changed: yes (minimal)
- new assets: no
- registry changed: no

### Accessibility

- text authoritative: yes
- icons decorative: yes
- duplicate announcements: none
- unknown state: text-only

### Tests

- suites: 2
- tests: 12
- result: PASS
- task-introduced failures: none
- typecheck: PRE-EXISTING FAIL
- build: PRE-EXISTING FAIL (ESLint)

### Runtime / Layout

- desktop: contract via CSS + tests
- narrow: same grid primitive
- alignment: inline-flex center
- wrapping: unchanged card titles
- visual noise: controlled (summary only)
- result: PASS (deterministic)

### Art Assessment

- ICON-008 new art required: **NO**
- reason: DashboardIcon reuse sufficient

### Coverage

- states with icons: FINISHED, STALLED_ENERGY, STALLED_WORKFORCE (summary)
- intentionally text-only states: WAITING, RUNNING; all job/factory rows
- additional MUST-HAVE gap: NO

### Documentation

- lifecycle docs changed: no
- backlog correction: no (noted in report only)
- reason: priority review already documents code-only path

### Repository Integrity

- final HEAD: `51c414bb5a56a1f2d1388a9f66ec7bb344f8d00a`
- commit: none
- push: none
- tags moved: none

### Final Decision

**OPTION A**
