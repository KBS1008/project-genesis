# M11 Gate 3 — Dashboard System Review Report

**Project:** Project Genesis  
**Milestone:** M11 — Visual Production & User Experience  
**Gate:** M11.3 — Dashboard System (Phase 3 consolidation)  
**Review date:** 2026-08-04  
**Commit audited:** `6717f6b` (master, synced with `origin/master`)  
**Reference:** `docs/development/Prompts/M11_PHASE_3_DASHBOARD_SYSTEM.md`  
**Baseline:** M11 Phase 2 CLOSED (`M11_GATE_2_APPLICATION_SHELL_REVIEW.md`, 748 tests)  
**Reviewer:** Mandatory independent audit (read-only)

---

# Executive Summary

M11 Phase 3 closes the **dual-dashboard gap** between the legacy `CompanyDashboardScreen` monolith and the PG presentation stack. The operations dashboard now uses PG widgets, charts, inspector, sidebar, and token-based layout CSS. `apps/web/src/app/dashboard.css` (~25 KB) is **removed**; regional `MarketScreen` uses `PGMarketWidget`; employee hire/assign uses typed `employees-client` commands.

All **776 tests pass** at audit time (+28 from Phase 2 baseline of 748; +20 from Phase 3 kickoff baseline of 756).

Core migration objectives (P1–P5, S7–S19, charts, tables, inspector, sidebar, `dashboard.css` retirement) are **delivered**. Remaining debt is **non-blocking** for World Module planning: TutorialPanel still in `@/components/`, unused `DashboardDetailPanel.tsx`, Step 8 documentation gaps, and missing axe coverage on `PGChartWidget`.

**Gate decision:** **PASS WITH CORRECTIONS**

M11 Phase 3 dashboard consolidation is suitable to close. Tracked corrections (C1–C5) should be addressed before treating the dashboard layer as fully production-documented.

**Final statement:** **DASHBOARD SYSTEM READY**

---

# Scope

| Area | Included |
|------|----------|
| Operations dashboard | `CompanyDashboardScreen`, panels, charts, inspector, sidebar |
| Executive dashboard | `ExecutiveDashboardScreen`, `ExecutiveDashboardCharts` |
| Market screen | `MarketScreen` → `PGMarketWidget` |
| PG dashboard primitives | Widgets, `PGChartWidget`, `PGInspectorPanel`, tables |
| CSS migration | `dashboard.css` removal, `operations-dashboard-layout.css`, `legacy-dashboard.css` |
| Commands | `employees-client`, sidebar `runCommand` wiring |
| Tests | Component, mapper, architecture, chart tests; full suite |
| Documentation | Audit doc, gate review; Step 8 guide debt noted |

**Out of scope:** World Module (Phase 4), mockup pixel parity, full `apps/web/src/components/` purge beyond dashboard-related files.

---

# Phase 3 Commit Trail

| Commit | Summary |
|--------|---------|
| `833d3d7` | P3 — operations tables → PG widgets |
| `f025d13` | P4 — legacy charts → `presentation/charts/PG*` |
| `b5af54a` | S19 inspector, S7 sidebar, retire `dashboard.css` |
| `6717f6b` | P5 employee commands, MarketScreen → `PGMarketWidget`, delete `DataTable` |

---

# Gate Checklist (STEP 9)

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Single dashboard design system (no `dashboard.css`) | ✅ PASS | `dashboard.css` deleted; `globals.css` imports `legacy-dashboard.css` + `operations-dashboard-layout.css` only |
| Legacy `CompanyDashboardScreen` removed or &lt;200 lines | ⚠️ PARTIAL | **256 lines** — thin orchestrator (PG strips, panels, charts, inspector, sidebar); no inline `DataTable` / legacy charts |
| Charts on executive dashboard | ✅ PASS | `ExecutiveDashboardCharts` in `ExecutiveDashboardScreen.tsx` L188–192 — 5 PG chart components |
| Token compliance (no new hardcoded colors) | ✅ PASS | No `#` / `rgb(` in `presentation/screens/company/*.css` or `dashboard/*.css`; chart CSS uses tokens |
| Accessibility (axe on new chart widget) | ⚠️ PARTIAL | `dashboard-components.a11y.test.tsx` covers KPI/status/inspector; `chart-components.test.tsx` has render tests only — **no axe on `PGChartWidget`** |
| All tests passing | ✅ PASS | **776 tests**, 210 files (`pnpm test` at audit) |

---

# Migration Matrix (Audit S1–S20)

| ID | Target | Status |
|----|--------|--------|
| S1–S6 | KPI, overview, logistics, loading, skeleton, header | ✅ |
| S7 | `PGOperationsSidebar` | ✅ |
| S8 | PG charts (7) | ✅ |
| S9 | `TutorialPanel` | ⚠️ Deferred (P6) — still `@/components/TutorialPanel` |
| S10–S18 | PG table widgets | ✅ |
| S19 | `CompanyOperationsInspector` + `PGInspectorPanel` | ✅ |
| S20 | `BuildingConstructionStatus` | ✅ |

Source: `docs/architecture/reviews/M11_PHASE3_COMPANY_DASHBOARD_AUDIT.md`

---

# Architecture Review

## Presentation stack

```text
CompanyDashboardScreen (~256 lines)
  ├── OperationsKpiStrip / OverviewStrip / LogisticsBanner
  ├── CompanyOperationsCharts (7 PG charts)
  ├── CompanyOperationsPanels (PG* widgets)
  ├── CompanyOperationsInspector → PGInspectorPanel
  ├── PGOperationsSidebar → employees-client + runCommand
  └── TutorialPanel (legacy @/components)

ExecutiveDashboardScreen
  ├── ExecutiveDashboardCharts (5 PG charts)
  ├── PGDashboardGrid + PG* widgets
  └── PGInspectorPanel (entity selection)

MarketScreen
  └── PGMarketWidget + mapMarketPriceRows
```

## View-data discipline

| Screen | DTOs in JSX | Mappers |
|--------|-------------|---------|
| Operations dashboard | ❌ None observed | `company-operations-*`, `company-detail-inspector-mappers` |
| Executive dashboard | ❌ None observed | `executive-dashboard-view-mappers` |
| Market screen | ❌ None observed | `mapMarketPriceRows`, workspace labels |

## Command clients

| Workflow | Client | Screen |
|----------|--------|--------|
| Place building | `gameplay-client` | BuildingsScreen |
| Production / research | `gameplay-client` | Production / Research screens |
| Market buy/sell | `market-client` | MarketScreen |
| Hire / assign employee | `employees-client` | `PGOperationsSidebar` |

All commands route through `GameWorkspaceProvider.runCommand` (busy state, notifications, refresh).

---

# Legacy Dependency Status

| Path | Status |
|------|--------|
| `apps/web/src/app/dashboard.css` | **Deleted** |
| `apps/web/src/app/legacy-dashboard.css` | TutorialPanel + `dashboard-icon` only |
| `apps/web/src/components/DataTable.tsx` | **Deleted** |
| `apps/web/src/components/MarketPricesTable.tsx` | **Deleted** |
| `apps/web/src/components/MarketTrendBadge.tsx` | **Deleted** |
| Legacy chart files (`TickHistoryCharts.tsx` etc.) | **Deleted** from `components/` |
| `apps/web/src/components/TutorialPanel.tsx` | Active — sole `@/components/` import in presentation screens |
| `apps/web/src/components/DashboardDetailPanel.tsx` | **Unused** (~663 lines dead code) |
| `apps/web/src/components/DashboardShell.tsx` | Re-export alias to `CompanyDashboardScreen` |

Architecture test `adapter-dependency-rules.test.ts` documents one remaining legacy import path: `CompanyDashboardScreen.tsx` → `TutorialPanel`.

---

# Testing

| Area | Coverage | Notes |
|------|----------|-------|
| Operations mappers | ✅ | `company-operations-table-mappers.test.ts` (5 tests incl. `mapMarketPriceRows`) |
| Inspector | ✅ | `company-detail-inspector-mappers.test.ts`, `company-operations-inspector.test.tsx` |
| Sidebar commands | ✅ | `employees-client.test.ts`, `PGOperationsSidebar.test.tsx` |
| Market screen | ✅ | `MarketScreen.test.tsx` — PG table cells + `runCommand` |
| Charts | ⚠️ Partial | `chart-components.test.tsx` — empty state; no axe |
| Dashboard a11y | ✅ | `dashboard-components.a11y.test.tsx` — KPI, status, inspector, status bar |
| Executive dashboard | ✅ | `ExecutiveDashboardScreen.test.tsx` |
| Architecture | ✅ | API/presentation boundary; legacy import inventory |
| Full suite | ✅ | **776 passed** |

**Test delta:** +28 vs Gate 2 (748); +20 vs Phase 3 start (756). Meets briefing target (+15–25).

---

# Documentation (STEP 8)

| Document | Required action | Status |
|----------|-----------------|--------|
| `DASHBOARD_IMPLEMENTATION_GUIDE.md` | Create | ❌ Missing |
| `IMPLEMENTATION_PROGRESS.md` | Update M11 Phase 3 | ⚠️ Partial (this gate updates row) |
| `M11_VISUAL_PRODUCTION_PLAN.md` | Mark Phase 3 complete | ⚠️ Not updated |
| `UI_FOUNDATION_GUIDE.md` | Single-dashboard diagram | ⚠️ Not verified |
| `M11_PHASE3_COMPANY_DASHBOARD_AUDIT.md` | Migration map | ✅ Present |

---

# Scoring

| Category | Score | Rationale |
|----------|------:|-----------|
| Architecture | 88 | Single PG stack; one legacy tutorial import; dead `DashboardDetailPanel` |
| Design | 86 | Token CSS; `legacy-dashboard.css` residual |
| Implementation | 90 | Full S1–S20 except P6 tutorial |
| Performance | 82 | Smaller global CSS; chart debounce unchanged |
| Accessibility | 74 | Inspector/sidebar axe OK; chart widget axe gap |
| Security | 90 | No new attack surface |
| Maintainability | 80 | Dead legacy panel; docs incomplete |
| Testing | 85 | +20 tests; chart axe missing |
| Documentation | 62 | Gate review + audit; implementation guide absent |

**Overall score: 82 / 100** (unweighted arithmetic mean)

---

# Corrections (Tracked)

| ID | Priority | Item | Suggested fix |
|----|----------|------|---------------|
| C1 | Medium | `DASHBOARD_IMPLEMENTATION_GUIDE.md` missing | Create per Step 8 — widget map, mapper paths, CSS layout |
| C2 | Low | `TutorialPanel` in `@/components/` | Move to `presentation/` or ADR defer (P6) |
| C3 | Low | `DashboardDetailPanel.tsx` unused | Delete or archive |
| C4 | Low | `PGChartWidget` axe test | Add to `chart-components.a11y.test.tsx` |
| C5 | Low | `M11_VISUAL_PRODUCTION_PLAN.md` Phase 3 | Mark dashboard phase complete |
| C6 | Low | `CompanyDashboardScreen` 256 lines | Optional further split (overview vs operations shell) |

None of C1–C6 block World Module (Phase 4) scheduling.

---

# Gate Decision

**PASS WITH CORRECTIONS**

M11 Phase 3 fulfills the mandatory deliverables: operations dashboard consolidated to PG widgets/charts/inspector/sidebar, executive dashboard charts wired, `dashboard.css` retired, MarketScreen on `PGMarketWidget`, typed employee commands, passing test suite, and migration audit documentation.

**Final statement:** **DASHBOARD SYSTEM READY**

---

# Next Step

With Gate 3 passed, **World & Regional Visualization (M11 Phase 4)** may proceed per `M11_VISUAL_PRODUCTION_PLAN.md`. Apply corrections C1–C5 in parallel or as a short documentation/cleanup slice.

---

M11 PHASE 3 CLOSED
