# M12 Dashboard Layout Overflow — Delta Report

**Project:** Project Genesis  
**Report date:** 2026-08-30  
**Type:** Presentation layout delta (post-flicker fix)  
**Severity:** P1 — Major visual defect (KPI tiles clipped)

---

## 1. Executive Summary

Company Dashboard KPI tiles (including **Mitarbeiter**) extended beyond the visible workspace and were clipped on the right. Root cause was a **nested width contract mismatch** combined with a **12-column span grid** that did not reflow like the executive dashboard’s responsive KPI grid.

**Fix:** Constrain operations layout to available workspace width; align operations KPI strip with existing `.pg-kpi-grid` responsive pattern; harden `.pg-kpi-grid` with `min(100%, 11rem)` for shrink-safe columns.

**Decision:** **OPTION A — LAYOUT DEFECT RESOLVED — PASS**

---

## 2. Baseline

| Item | Value |
|------|-------|
| Branch | `master` (uncommitted M12 fixes) |
| Prior tests | 901 PASS |
| Flicker fix | Present (`useScreenQuery` background refresh) — **unchanged** |
| build:web | PASS before this delta |

---

## 3. Reproduction

1. Start game, open **Unternehmen** → **Operatives Dashboard**
2. Observe KPI row below header
3. **Symptom:** tiles extend past right viewport edge; last tiles (e.g. Mitarbeiter) clipped
4. Shell left navigation renders correctly; content starts beside nav + operations sidebar

---

## 4. Screenshot Observations

- Double sidebar context: game shell nav + operations actions sidebar
- KPI strip horizontal overflow on single visual row
- Main workspace content wider than available column
- Stale-connection banner may appear transiently — **separate follow-up** (see §13)

---

## 5. Layout Hierarchy

```text
pg-workspace (max-width: --shell-max-width)
└─ pg-application-shell-body [sidebar | main]
   └─ pg-workspace-screen
      └─ pg-operations-layout  ← was max-width: 90rem inside narrower main
         └─ pg-operations-body [operations-sidebar | pg-operations-content]
            └─ pg-operations-kpi-strip
               └─ PGDashboardGrid (12× span-3)  ← 8 KPIs, poor reflow vs executive pg-kpi-grid
```

---

## 6. Root Cause

| Class | Evidence |
|-------|----------|
| **A — Main workspace width** | `.pg-operations-layout { max-width: 90rem }` assumed standalone page width inside already-constrained shell main column |
| **B — Grid column definition** | Operations KPI used fixed 12-column `span-3` grid (4× per row) instead of established `.pg-kpi-grid` auto-fit |
| **C — Card min width** | `.pg-kpi-grid` used `minmax(11rem, 1fr)` without `min(100%, …)`, allowing intrinsic minimum to exceed narrow containers |
| **D — Flex/grid min-width** | Missing `min-width: 0` / `width: 100%` on layout + grid containers |

**Primary:** **A + B + C**

---

## 7. Files Changed

| File | Change |
|------|--------|
| `operations-dashboard-layout.css` | Layout uses `width/max-width: 100%`, `min-width: 0` |
| `dashboard-components.css` | `.pg-kpi-grid` → `minmax(min(100%, 11rem), 1fr)` + width constraints |
| `layout-components.css` | `.pg-dashboard-grid` width/min-width guard |
| `OperationsKpiStrip.tsx` | Use `.pg-kpi-grid` (same as executive dashboard) instead of 12-col span-3 |
| `operations-dashboard-layout.test.ts` | CSS contract regression |
| `operations-dashboard.test.tsx` | KPI strip uses `.pg-kpi-grid` |

---

## 8. Why This Fix Is Correct

- Matches **UI_LAYOUT_GUIDELINES.md** 12-column responsive grid intent via existing `.pg-kpi-grid` token (`11rem` min from design system)
- Does not alter ViewData, simulation, queries, or shell architecture
- Operations KPI strip now matches **Executive Dashboard** KPI presentation pattern
- Fixes width at the **container contract** layer (first wrong sizing boundary), not via `overflow-x: hidden`

---

## 9. Responsive Behavior

| Viewport | Behavior |
|----------|----------|
| Desktop (normal) | KPI tiles wrap with `auto-fit`; fit within main content column |
| Wide desktop | More tiles per row, still bounded by container |
| ≤1024px | Existing dashboard span overrides remain for PGDashboardGrid elsewhere |
| ≤56.25rem | Operations sidebar collapses to drawer (unchanged) |

---

## 10. Tests

| Test | Result |
|------|--------|
| `operations-dashboard-layout.test.ts` | PASS — width contract + responsive grid CSS |
| `operations-dashboard.test.tsx` | PASS — KPI strip uses `.pg-kpi-grid` |
| Full `pnpm test` | **904/904 PASS** |

---

## 11. Manual Viewport Validation

Validated on active session (`LayoutTest`, ticks 273→320+) after `pnpm dev` restart.

| Viewport | Screen | KPI clipped | Horizontal overflow | Notes |
|----------|--------|-------------|---------------------|-------|
| **1905px** (reported) | Executive Dashboard | **0 / 8** | **No** | Mitarbeiter tile fully visible; grid wraps 6+2 |
| **1905px** | Operatives Dashboard | **0 / 8** | **No** | `.pg-kpi-grid` active; MITARBEITER visible |
| **1280px** (narrow desktop) | Operatives Dashboard | **0 / 8** | **No** | Tiles reflow within content column |
| **1280px** | Executive Dashboard | **0 / 8** | **No** | All KPI cards within bounds |
| **1920px** (wide desktop) | Executive Dashboard | **0 / 8** | **No** | No clipping at wider width |
| **1024px** (tablet) | Operatives KPI strip | **0 / 8** | Minor (~10px) | Overflow from `.pg-query-row` panel content, **not KPI tiles** — pre-existing panel width issue, out of scope |
| **Spot-check** | Production | — | **No** | Shell/main layout stable |
| **Spot-check** | World | — | **No** | Shell/main layout stable |
| Tick progression | All screens | — | — | Tick 273→320+ advancing; **no loading flicker** |

CDP measurements: executive KPI grid `right=1673` vs viewport `1905`; operatives content `right=1657`, all cards within bounds.

---

## 12. Flicker Regression Check

**No changes** to `useScreenQuery` refresh semantics. Layout-only delta.

---

## 13. Stale Connection Banner Observation

Banner text: *"Angezeigte Daten können veraltet sein. Live-Verbindung wird wiederhergestellt."* **persisted** during validation while:

- Session showed **Live** badge and tick counter advancing (Tick 7+)
- Dashboard data rendered normally
- No API fetch errors after dev-server restart

**Classification:** **Separate follow-up runtime defect** — banner state does not reflect healthy live connection. Not caused by layout CSS; **not fixed in this slice**.

---

## 14. Full Regression

**904 / 904 PASS** (245 files)

---

## 15. build:web

**PASS** (exit 0)

---

## 16. Remaining Risks

| Risk | Note |
|------|------|
| OperationsOverviewStrip still uses 12-col PGDashboardGrid | Fewer cards; lower overflow risk |
| Stale banner persistence | Separate defect if confirmed |
| Very narrow tablet (1024px) | Minor horizontal scroll from `.pg-query-row` panel rows — not KPI tiles; pre-existing |

---

## 17. Final Decision

## **OPTION A — LAYOUT DEFECT RESOLVED — PASS**

---

## 18. Changed Files

- `apps/web/src/presentation/screens/company/operations-dashboard-layout.css`
- `apps/web/src/presentation/components/dashboard/dashboard-components.css`
- `apps/web/src/presentation/components/layout/layout-components.css`
- `apps/web/src/presentation/screens/company/OperationsKpiStrip.tsx`
- `apps/web/src/presentation/screens/company/operations-dashboard-layout.test.ts`
- `apps/web/src/presentation/screens/company/operations-dashboard.test.tsx`
- `docs/architecture/reviews/M12_DASHBOARD_LAYOUT_OVERFLOW_DELTA_REPORT.md`

---

*End of Report*
