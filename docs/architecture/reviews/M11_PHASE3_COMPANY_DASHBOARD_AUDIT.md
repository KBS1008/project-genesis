# M11 Phase 3 — CompanyDashboardScreen Audit

**Date:** 2026-08-04  
**File:** `apps/web/src/presentation/screens/company/CompanyDashboardScreen.tsx` (~1,072 lines)  
**Purpose:** Migration map for Phase 3 consolidation (Option A — incremental)

---

## Migratable sections

| ID | Section | Lines (approx) | Legacy | Target (PG / presentation) | Priority |
|----|---------|----------------|--------|----------------------------|----------|
| S1 | `KpiStrip` | 31–130 | `kpi-strip`, `dashboard.css` | `OperationsKpiStrip` + `PGKpiCard` | **P2** ✅ this sprint |
| S2 | `OverviewStrip` | 132–171 | `overview-strip` | `OperationsOverviewStrip` + `PGKpiCard` grid | **P2** ✅ this sprint |
| S3 | `LogisticsBanner` | 173–193 | `logistics-banner` | `OperationsLogisticsBanner` + `StatusBanner` | **P2** ✅ this sprint |
| S4 | Busy loading overlay | 432–439 | `loading-overlay`, `dashboard.css` | `PGLoadingOverlay` + `LoadingState` | **P1** ✅ this sprint |
| S5 | Initial load skeleton | 590–602 | `card-loading`, `skeleton-block` | `PGWidgetSurface` / `PGSkeleton` | P1 partial (tables remain) |
| S6 | Header + theme toggle | 450–525 | `header`, `theme-toggle` | Remove when embedded; shell `useTheme()` | **P1** ✅ this sprint |
| S7 | `SidebarActions` | 240–311 | `toolbar-group`, `HintButton` | Future: `PGSidebarActions` panel | P5 |
| S8 | Charts (7 components) | 565–586 | `@/components/*Chart*` | `PGChartWidget` wrap (Phase 3 P4) | P4 |
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
| S19 | `CompanyDetailPanel` | 1058–1065 | side panel | `PGInspectorPanel` alignment | P3+ |
| S20 | `ConstructionStatus` | 221–237 | `progress-bar` | `BuildingConstructionStatus` | **P3** ✅ |

---

## Dependencies to retire (after full migration)

| Path | Notes |
|------|-------|
| `apps/web/src/app/dashboard.css` | Loaded via `globals.css` |
| `apps/web/src/components/DataTable.tsx` | Used throughout S10–S18 |
| `apps/web/src/components/TickHistoryCharts.tsx` etc. | S8 |
| `apps/web/src/components/icons/DashboardIcons.tsx` | S1 legacy icons |

---

## Runtime / quality debt (from Gate reviews)

| Issue | Location | Fix phase |
|-------|----------|-----------|
| Hardcoded `5 %` tax fallback | L706 | P3 (S12) |
| Inline `rgba` energy pill | L483, L519 | P1 (token class) |
| `aria-hidden` on busy overlay | L433 | P1 (`PGLoadingOverlay`) |
| Duplicate theme controls | L467–474, L508–515 | P1 (remove when `hideHeader`) |

---

## This sprint scope (P1 + P2)

- ✅ S1–S4, S6 migrated to PG components
- Audit document created
- Tests for mappers + operations strips + loading overlay

**Not in this sprint:** charts (S8), tables (S10–S18), tutorial (S9), World Module.
