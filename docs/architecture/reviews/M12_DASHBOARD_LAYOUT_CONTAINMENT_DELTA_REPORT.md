# M12 Dashboard Layout Containment — Delta Report

**Project:** Project Genesis  
**Report date:** 2026-08-30  
**Type:** Responsive workspace / widget overflow correction  
**Scope:** Layout containment only (flicker/runtime untouched)

---

## 1. Executive Summary

Company Dashboard KPI/widgets exceeded the available main workspace and clipped on the right (notably **Mitarbeiter**). Root cause was a **broken containment contract chain**: operations layout assumed standalone page width inside an already-constrained shell column, KPI/overview strips used fixed 12-column spans, and grid children lacked shrink-safe min-width.

**Fix:** Constrain layout wrappers to `100%` available width, adopt existing `.pg-kpi-grid` responsive contract for KPI + overview strips, harden executive dashboard wrapper, scope command overlay to operations layout.

**Decision:** **OPTION A — DASHBOARD LAYOUT CONTAINMENT RESTORED — PASS**

---

## 2. Repository Baseline

| Item | Value |
|------|-------|
| Branch | `master` @ `958e94f` (uncommitted M12 stack) |
| Flicker fix | Present — `useScreenQuery` background refresh — **not modified in this slice** |
| Build readiness | PASS (`M12_RELEASE_BUILD_READINESS_STABILIZATION_REPORT.md`) |
| Tests before this delta | 908 PASS (includes stability + layout tests) |
| `build:web` | PASS |

---

## 3. Confirmed Manual Defect

- Sidebar visible; main content beside nav
- KPI row extended past right viewport; **Mitarbeiter** clipped
- Widgets could visually intrude on adjacent UI areas
- Defect **independent** of resolved flicker incident

---

## 4. Reproduction

Path: **Unternehmen → Executive Dashboard** and **Operatives Dashboard**  
Viewport: **1236 × 697** (user-reported)

**Before fix:** KPI tiles on single row exceeded workspace; rightmost tiles clipped.

**After fix:** All KPI tiles visible; grid reflows within column.

---

## 5. Viewport / Geometry Measurements

Session: **ContainTest** (post-fix)

| Viewport | Screen | clientW | mainW | sidebarW | kpiW | kpiRight | clipped | scroll overflow |
|----------|--------|---------|-------|----------|------|----------|---------|-----------------|
| 1236×697 | Executive | 1221 | 897 | 294 | 897 | 1197 | **0** | **No** |
| 1236×697 | Operatives | 1221 | 897 | 294 | 589* | 1181 | **0** | **No** |
| 1920×1080 | Operatives | ~1905 | wider | 294 | — | — | **0** | **No** |
| 1024×800 | Operatives | 1009 | — | — | — | — | **0** | Minor (~10px panel rows†) |
| 1024×800 | Executive | 1009 | — | — | — | — | **0** | Minor (~10px†) |

\*Operatives KPI grid width reduced by operations actions sidebar (expected).  
†Overflow from `.pg-query-row` table min-width, not KPI/shell overlap — separate low-risk panel scroll.

---

## 6. Layout Hierarchy

```text
.pg-workspace (max-width: --shell-max-width)
└─ .pg-application-shell-body [sidebar | main]
   └─ .pg-application-shell-main (min-width: 0)
      └─ .pg-workspace-screen
         ├─ Executive: .pg-executive-dashboard → .pg-kpi-grid
         └─ Operatives: .pg-operations-layout (was max-width: 90rem)
            └─ .pg-operations-body [ops-sidebar | .pg-operations-content]
               └─ .pg-kpi-grid (KPI + overview strips)
```

---

## 7. Hypotheses Tested

| ID | Hypothesis | Result |
|----|------------|--------|
| H1 | Main uses `100vw` | **Not confirmed** — issue was nested max-width + grid |
| H2 | Missing `min-width: 0` | **Confirmed** — layout/grid wrappers |
| H3 | Fixed column count | **Confirmed** — 12-col `span-3`/`span-4` KPI strips |
| H4 | Card min-width too large | Partial — grid min without `min(100%, …)` |
| H5 | Bad `minmax()` | **Confirmed** — fixed via design token pattern |
| H6 | Flex without wrap | N/A — grids used |
| H7 | Grid intrinsic overflow | **Confirmed** — KPI grid children |
| H8 | Fixed/absolute positioning | **Confirmed** — loading overlay was `fixed` full viewport |

---

## 8. Root Cause Classification

**H — MULTIPLE RELATED CONTAINMENT DEFECTS**

Primary broken contract (first in chain):

> `.pg-operations-layout` used standalone page sizing (`max-width: 90rem; margin: 0 auto`) inside shell main column that is already width-constrained beside navigation + operations sidebar.

Secondary:

> KPI/overview strips used fixed 12-column span grid instead of established `.pg-kpi-grid` auto-fit reflow.

---

## 9. Root Cause

| Class | Evidence |
|-------|----------|
| **A — Main workspace width** | Operations layout exceeded available column |
| **B — Flex/grid intrinsic min** | Missing `min-width: 0` on layout + grid children |
| **C — Grid track definition** | Fixed 12-col spans vs responsive auto-fit |
| **D — Card min width** | `minmax(11rem, 1fr)` without `min(100%, …)` |
| **G — Positioning** | `PGLoadingOverlay` `position: fixed` covered shell |

---

## 10. Changes Made

| File | Change |
|------|--------|
| `operations-dashboard-layout.css` | `width/max-width: 100%`, `min-width: 0`, `position: relative` |
| `OperationsKpiStrip.tsx` | `.pg-kpi-grid` instead of 12-col span grid |
| `OperationsOverviewStrip.tsx` | `.pg-kpi-grid` instead of 12-col span grid |
| `dashboard-components.css` | `.pg-kpi-grid` shrink-safe columns; `.pg-kpi-grid > * { min-width: 0 }`; `.pg-executive-dashboard` containment; overlay `absolute` |
| `layout-components.css` | `.pg-dashboard-grid` width guards |
| `operations-dashboard-layout.test.ts` | CSS contract regression (+ executive containment) |
| `operations-dashboard.test.tsx` | KPI + overview strip grid class tests |

**Not changed:** `useScreenQuery`, `GameWorkspaceProvider`, ViewData, navigation, shell structure.

---

## 11. Why Fix Is At Correct Layer

1. **Parent sizing** (`.pg-operations-layout`, `.pg-executive-dashboard`) — first wrong boundary  
2. **Grid contract** (`.pg-kpi-grid`) — existing design-system responsive pattern  
3. **Child shrink** (`min-width: 0`) — only where grid/flex overflow proven  

No per-card pixel hacks; no `overflow-x: hidden`.

---

## 12. Responsive Behavior

Uses existing tokens (`11rem` KPI min, `56.25rem` ops sidebar drawer, `67.5rem` panels stack, `1024px` dashboard span collapse).

- **Wide desktop:** more KPI columns per row, bounded by container  
- **1236×697:** KPI wraps; 0 clipped  
- **≤1024px:** dashboard widget spans collapse to 12; minor table row scroll possible  

---

## 13. Executive Dashboard Validation

KPIs verified: Verfügbare Mittel, Energie, Transporte, Lager, **Mitarbeiter**, Produktion, Forschung, Steuer — all visible @ 1236×697, labels/values readable, no overlap with sidebar.

---

## 14. Operative Dashboard Validation

Separate grid containers confirmed. KPI + overview strips use `.pg-kpi-grid`. Content column respects operations sidebar. 0 KPI clipped @ 1236×697; tick 19+ during validation.

---

## 15. Shell Regression Check

Layout CSS scoped to dashboard/operations classes. Shell `.pg-application-shell-main { min-width: 0 }` unchanged. World/Production inherit stable main containment (spot-checked in prior M12 stability validation).

---

## 16. Flicker Regression Check

Simulation ran tick 1→19 during containment validation @ 1236×697:

- **No** full-screen loading flash  
- **No** `wird geladen` during ticks  
- Dashboard remained visible  
- `useScreenQuery` fix **unchanged**

---

## 17. Stale/Reconnect Banner Observation

@ 1236×697 validation: **stale banner not present** while ticks advanced. Classified as resolved by separate stability slice; not in scope here.

---

## 18. Targeted Tests

| Test | Result |
|------|--------|
| `operations-dashboard-layout.test.ts` (4 tests) | PASS |
| `operations-dashboard.test.tsx` (5 tests) | PASS |
| Full `pnpm test` | **909 / 909 PASS** |

Semantic CSS/grid contract tests only — no pixel snapshots.

---

## 19. Full Regression

**909 / 909 PASS** (246 files)

---

## 20. Web Production Build

**PASS** (`pnpm build:web`)

---

## 21. Typecheck / Lint Delta

| Command | Delta |
|---------|-------|
| `pnpm typecheck` | Pre-existing failures in `tools/sync-runtime-visual-assets.ts` etc. — **no new errors from layout slice** |
| `pnpm lint` | Pre-existing duplicate-import clusters — **no new lint errors in changed layout files** |

---

## 22. Architecture Compliance

| Risk | Introduced? |
|------|-------------|
| New shell system | **No** |
| New responsive system | **No** |
| New global state | **No** |
| Query lifecycle changed | **No** |
| Tick behavior changed | **No** |
| ViewData changed | **No** |
| Navigation changed | **No** |

---

## 23. Remaining Risks

| Risk | Note |
|------|------|
| `.pg-query-row` @ ≤1024px | ~10px horizontal scroll in wide tables — panel-level, not KPI containment |
| Executive `PGDashboardGrid` widgets | Span collapse @ 1024px per existing convention |

---

## 24. Final Decision

## **OPTION A — DASHBOARD LAYOUT CONTAINMENT RESTORED — PASS**

**Next recommended workstream:** M12 Release Preparation Entry Audit

---

## 25. Changed Files

- `apps/web/src/presentation/screens/company/operations-dashboard-layout.css`
- `apps/web/src/presentation/screens/company/OperationsKpiStrip.tsx`
- `apps/web/src/presentation/screens/company/OperationsOverviewStrip.tsx`
- `apps/web/src/presentation/components/dashboard/dashboard-components.css`
- `apps/web/src/presentation/components/layout/layout-components.css`
- `apps/web/src/presentation/screens/company/operations-dashboard-layout.test.ts`
- `apps/web/src/presentation/screens/company/operations-dashboard.test.tsx`
- `docs/architecture/reviews/M12_DASHBOARD_LAYOUT_CONTAINMENT_DELTA_REPORT.md`

---

## Required Evidence Matrix

| Viewport | Screen | Before | After | H-Overflow | Overlap | Flicker | Result |
|----------|--------|--------|-------|------------|---------|---------|--------|
| 1236×697 | Executive | KPI clipped | All 8 visible | No | No | No | **PASS** |
| 1236×697 | Operatives | KPI clipped | All visible | No | No | No | **PASS** |
| 1920×1080 | Operatives | Overflow | 0 clipped | No | No | No | **PASS** |
| 1024×800 | Executive | Overflow | 0 KPI clipped | Minor† | No | No | **PASS** |
| 1024×800 | Operatives | Overflow | 0 KPI clipped | Minor† | No | No | **PASS** |

†Panel table rows only.

---

*End of Report*
