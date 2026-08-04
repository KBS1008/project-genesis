# M11 Phase 3 — CompanyDashboardScreen Audit

**Date:** 2026-08-04  
**File:** `apps/web/src/presentation/screens/company/CompanyDashboardScreen.tsx` (~260 lines)  
**Purpose:** Migration map for Phase 3 consolidation (Option A — incremental)

---

## Migratable sections

| ID | Section | Lines (approx) | Legacy | Target (PG / presentation) | Priority |
|----|---------|----------------|--------|----------------------------|----------|
| S1 | `KpiStrip` | 31–130 | `kpi-strip`, `dashboard.css` | `OperationsKpiStrip` + `PGKpiCard` | **P2** ✅ |
| S2 | `OverviewStrip` | 132–171 | `overview-strip` | `OperationsOverviewStrip` + `PGKpiCard` grid | **P2** ✅ |
| S3 | `LogisticsBanner` | 173–193 | `logistics-banner` | `OperationsLogisticsBanner` + `StatusBanner` | **P2** ✅ |
| S4 | Busy loading overlay | 432–439 | `loading-overlay`, `dashboard.css` | `PGLoadingOverlay` + `LoadingState` | **P1** ✅ |
| S5 | Initial load skeleton | 590–602 | `card-loading`, `skeleton-block` | `PGWidgetSurface` / `PGSkeleton` | **P1** ✅ |
| S6 | Header + theme toggle | 450–525 | `header`, `theme-toggle` | `pg-operations-header` + `Button` | **P1** ✅ |
| S7 | `SidebarActions` | 240–311 | `toolbar-group`, `HintButton` | `PGOperationsSidebar` | **S7** ✅ |
| S8 | Charts (7 components) | 565–586 | `@/components/*Chart*` | `presentation/charts/PG*Chart*` | **P4** ✅ |
| S9 | `TutorialPanel` | 563 | `@/components/TutorialPanel` | Defer or move to `presentation/` | P6 |
| S10 | Buildings table | 605–657 | `DataTable`, `card` | `PGBuildingsWidget` | **P3** ✅ |
| S11 | Employees table | 659–698 | `DataTable` | `PGEmployeesWidget` | **P3** ✅ |
| S12 | Economy / contracts | 700–750 | `DataTable`, hardcoded `5 %` | `PGEconomyWidget` + mapper | **P3** ✅ |
| S13 | Market table | 752–773 | `MarketPricesTable` | `PGMarketWidget` | **P3** ✅ |
| S14 | Production table | 776–813 | `DataTable` | `PGProductionWidget` | **P3** ✅ |
| S15 | Research table | 815–857 | `DataTable` | `PGResearchWidget` | **P3** ✅ |
| S16 | Transport table | 860–906 | `DataTable` | `PGSupplyChainWidget` (detailed) | **P3** ✅ |
| S17 | Finance transactions | 908–947 | `DataTable` | `PGFinanceWidget` (ledger mode) | **P3** ✅ |
| S18 | Inventory + warehouse | 949–1053 | `DataTable` | `PGInventoryWidget` | **P3** ✅ |
| S19 | `CompanyDetailPanel` | 1058–1065 | side panel | `CompanyOperationsInspector` + `PGInspectorPanel` | **S19** ✅ |
| S20 | `ConstructionStatus` | 221–237 | `progress-bar` | `BuildingConstructionStatus` | **P3** ✅ |

---

## Dependencies to retire (after full migration)

| Path | Notes |
|------|-------|
| `apps/web/src/app/dashboard.css` | **Removed** — replaced by `legacy-dashboard.css` + `operations-dashboard-layout.css` |
| `apps/web/src/components/DataTable.tsx` | MarketScreen only (S13 inspector uses PGMarketWidget) |
| `apps/web/src/components/TickHistoryCharts.tsx` etc. | **Removed** |
| `apps/web/src/components/icons/DashboardIcons.tsx` | TutorialPanel (S9) |

---

## Runtime / quality debt (from Gate reviews)

| Issue | Location | Fix phase |
|-------|----------|-----------|
| Hardcoded `5 %` tax fallback | economy mapper | **Fixed** (P3) |
| Inline `rgba` energy pill | header pills | **Fixed** (P1 token class) |
| `aria-hidden` on busy overlay | loading | **Fixed** (`PGLoadingOverlay`) |
| Duplicate theme controls | embedded header | **Fixed** (P1) |

---

## Remaining for Gate 3

- S9 TutorialPanel → `presentation/` (optional, tracked C2)
- Gate 3 review document — **done** (`M11_GATE_3_DASHBOARD_REVIEW.md`, PASS WITH CORRECTIONS)
