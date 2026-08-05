/** Dashboard mockup → PG component mapping (Phase 4C Step 6). */
export const DASHBOARD_MOCKUP_COMPONENT_MAP = Object.freeze([
  Object.freeze({ mockupId: 'DB-001', component: 'ExecutiveDashboardScreen', widget: null }),
  Object.freeze({ mockupId: 'DB-002', component: 'PGKpiCard', widget: 'KPI strip / executive grid' }),
  Object.freeze({ mockupId: 'DB-003', component: 'PGStatusPanel', widget: 'Executive status rail' }),
  Object.freeze({ mockupId: 'DB-004', component: 'PGNotificationCenter', widget: 'Notification center' }),
  Object.freeze({ mockupId: 'DB-005', component: 'PGFinanceWidget', widget: 'Finance ledger / summary' }),
  Object.freeze({ mockupId: 'DB-006', component: 'PGProductionWidget', widget: 'Production jobs table' }),
  Object.freeze({ mockupId: 'DB-007', component: 'PGResearchWidget', widget: 'Research jobs table' }),
  Object.freeze({ mockupId: 'DB-008', component: 'PGSupplyChainWidget', widget: 'Transport / supply chain' }),
  Object.freeze({ mockupId: 'DB-009', component: 'PGCompanyWidget', widget: 'Company overview' }),
  Object.freeze({ mockupId: 'DB-010', component: 'PGReportWidget', widget: 'Executive report widget' }),
] as const);
