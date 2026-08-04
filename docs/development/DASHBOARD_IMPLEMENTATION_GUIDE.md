# Dashboard Implementation Guide

**Project:** Project Genesis  
**Milestone:** M11 Phase 3 — Dashboard System  
**Audience:** Frontend developers working on executive and operations dashboards

---

## Overview

M11 Phase 3 consolidates the legacy monolithic company dashboard into the **PG presentation stack**. Two surfaces share widgets, mappers, and charts:

| Surface | Component | Purpose |
|---------|-----------|---------|
| Executive | `ExecutiveDashboardScreen` | DB-001 widget grid, compact charts, inspector |
| Operations | `CompanyDashboardScreen` | Full tables, charts, sidebar actions, tutorial |
| Market | `MarketScreen` | Regional prices (`PGMarketWidget`) + trade forms |

All screens consume **view-data** from `GameWorkspaceProvider` — no `GameSessionDashboard` DTOs in JSX.

---

## Architecture

```text
GameWorkspaceProvider
  └── companyViewData (CompanyDashboardViewData)
        ├── ExecutiveDashboardScreen
        │     ├── ExecutiveDashboardCharts (PG charts)
        │     ├── PGDashboardGrid + PG* widgets
        │     └── PGInspectorPanel
        └── CompanyDashboardScreen
              ├── OperationsKpiStrip / OverviewStrip / LogisticsBanner
              ├── PGTutorialPanel
              ├── CompanyOperationsCharts (7 PG charts)
              ├── CompanyOperationsPanels (PG* widgets)
              ├── CompanyOperationsInspector → PGInspectorPanel
              └── PGOperationsSidebar → employees-client
```

**CSS:** Token-based layout in `operations-dashboard-layout.css` (`pg-operations-*`). Widget chrome in `dashboard-components.css`. No `dashboard.css`.

---

## View-data and mappers

| Mapper path | Output |
|-------------|--------|
| `company-dashboard-view-mappers.ts` | `CompanyDashboardViewData` (workspace aggregate) |
| `company-operations-view-mappers.ts` | KPI / overview cards for operations strips |
| `company-operations-table-mappers.tsx` | `PGOperationsTableRow`, market rows, economy panel |
| `company-detail-inspector-mappers.ts` | Inspector sections for `CompanyOperationsInspector` |
| `executive-dashboard-view-mappers.ts` | Executive widget grid view-data |

Rule: **map API/DTO → view-data in adapters; screens only render view-data.**

---

## PG widgets

| Widget | Operations | Executive |
|--------|------------|-----------|
| `PGKpiCard` | KPI / overview strips | KPI grid |
| `PGBuildingsWidget` | S10 | — |
| `PGEmployeesWidget` | S11 | — |
| `PGEconomyWidget` | S12 | — |
| `PGMarketWidget` | S13, inspector footer, MarketScreen | — |
| `PGProductionWidget` | S14 | ✅ |
| `PGResearchWidget` | S15 | ✅ |
| `PGSupplyChainWidget` | S16 | ✅ |
| `PGFinanceWidget` | S17 (ledger) | ✅ (summary) |
| `PGInventoryWidget` | S18 | — |
| `PGCompanyWidget` | — | ✅ |
| `PGStatusPanel` / `PGNotificationCenter` | — | ✅ |
| `PGReportWidget` | — | ✅ |
| `PGTutorialPanel` | ✅ | — |

Shared table primitive: `PGOperationsTable` inside widget surfaces (`PGWidgetSurface`).

---

## Charts

Location: `presentation/components/dashboard/charts/`

| Component | Data source |
|-----------|-------------|
| `PGTickHistoryCharts` | `chartPoints` |
| `PGInventoryHistoryChart` | `chartPoints` |
| `PGEnergyHistoryChart` | `chartPoints` |
| `PGMarketPriceHistoryChart` | `chartPoints` + `labelResource` |
| `PGMarketSupplyDemandChart` | `marketPrices` |
| `PGMarketPressureHistoryChart` | `chartPoints` |
| `PGPriceIndexHistoryChart` | `chartPoints` |

Shell: `PGChartWidget` — title, empty state, responsive canvas. Colors from design tokens (`chart-components.css`).

---

## Commands

Typed HTTP clients in `presentation/adapters/api/`:

| Client | Endpoints | Used by |
|--------|-----------|---------|
| `gameplay-client` | buildings, production, research | Buildings / Production / Research screens |
| `market-client` | buy, sell | `MarketScreen` |
| `employees-client` | hire, assign | `PGOperationsSidebar` |
| `simulation-client` | pause, resume, step, speed | `SimulationControlsBar` |

All user actions wrap `runCommand()` from `GameWorkspaceProvider` (busy state, notifications, refresh).

---

## Inspector and selection

- Operations: `company-detail-selection.ts` + `CompanyOperationsInspector`
- Executive: entity selection via `navigation.entitySelection` + `PGInspectorPanel`
- Primitive: `PGInspectorPanel` supports entries, sections, related items, footer

---

## Testing

| Area | Test files |
|------|------------|
| Mappers | `company-operations-table-mappers.test.ts`, `company-detail-inspector-mappers.test.ts` |
| Inspector / sidebar | `company-operations-inspector.test.tsx`, `PGOperationsSidebar.test.tsx` |
| Charts | `chart-components.test.tsx`, `chart-components.a11y.test.tsx` |
| Market | `MarketScreen.test.tsx` |
| Executive | `ExecutiveDashboardScreen.test.tsx` |
| Accessibility | `dashboard-components.a11y.test.tsx` |
| Architecture | `adapter-dependency-rules.test.ts` (no `@/components/` in presentation screens) |

Run: `pnpm test`

---

## Legacy retirement (Phase 3)

| Removed | Replacement |
|---------|-------------|
| `apps/web/src/app/dashboard.css` | `operations-dashboard-layout.css` + `dashboard-components.css` |
| `DataTable`, `MarketPricesTable` | `PGOperationsTable` + widgets |
| Legacy `@/components/*Chart*` | `presentation/charts/PG*` |
| `CompanyDetailPanel` | `CompanyOperationsInspector` |
| `DashboardDetailPanel` | Unused — deleted |
| `@/components/TutorialPanel` | `PGTutorialPanel` |

Remaining alias: `apps/web/src/components/DashboardShell.tsx` re-exports `CompanyDashboardScreen` for backward compatibility.

---

## Related documents

- `docs/architecture/reviews/M11_PHASE3_COMPANY_DASHBOARD_AUDIT.md` — section migration map
- `docs/architecture/reviews/M11_GATE_3_DASHBOARD_REVIEW.md` — gate verdict
- `docs/development/UI_FOUNDATION_GUIDE.md` — design tokens and PG primitives
- `docs/design/CHART_GUIDELINES.md` — chart data and accessibility rules
