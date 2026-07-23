/** Immutable view-data for the company dashboard screen. */

import type { TickMarketPriceSnapshot } from '@/presentation/adapters/api/client';

export type ContentLabelsViewData = {
  readonly resource: (resourceId: string) => string;
  readonly building: (buildingTypeId: string) => string;
  readonly recipe: (recipeId: string) => string;
  readonly technology: (technologyId: string) => string;
  readonly employee: (employeeTypeId: string) => string;
};

export type EntityCatalogViewData = {
  readonly buildingIds: ReadonlySet<string>;
  readonly resourceIds: ReadonlySet<string>;
  readonly productionIds: ReadonlySet<string>;
  readonly transportIds: ReadonlySet<string>;
  readonly researchIds: ReadonlySet<string>;
  readonly employeeIds: ReadonlySet<string>;
  readonly transactionIds: ReadonlySet<string>;
  readonly warehouseIds: ReadonlySet<string>;
};

export type KpiStripViewData = {
  readonly availableCashLabel: string;
  readonly availableCashTrend: string;
  readonly energyReserveLabel: string;
  readonly energyTrend: string;
  readonly energyHasDeficit: boolean;
  readonly activeTransportCount: number;
  readonly activeTransportTrend: string;
  readonly warehouseTotalUnits: number;
  readonly warehouseCapacityHint: string;
  readonly onSiteResourceLines: number;
  readonly onSiteHint: string;
  readonly assignedEmployeeCount: number;
  readonly employeeCount: number;
  readonly employeeCapacityHint: string;
  readonly payrollLabel: string;
  readonly priceIndexLabel: string;
  readonly priceIndexHint: string;
  readonly corporateTaxRateLabel: string;
  readonly taxTrendLabel: string;
  readonly taxPaymentBlocked: boolean;
  readonly runningProductionCount: number;
  readonly productionHint: string;
  readonly activeResearchCount: number;
  readonly researchHint: string;
  readonly completedMilestoneCount: number;
  readonly milestoneHint: string;
  readonly activeContractCount: number;
  readonly economyHint: string;
  readonly taxIntervalTicks: number;
};

export type OverviewCardViewData = {
  readonly label: string;
  readonly value: string;
  readonly hint: string;
};

export type OverviewStripViewData = {
  readonly cards: readonly OverviewCardViewData[];
};

export type BuildingRowViewData = {
  readonly id: string;
  readonly name: string;
  readonly buildingTypeLabel: string;
  readonly statusLabel: string;
  readonly positionLabel: string;
  readonly regionId: string;
  readonly regionLabel: string;
  readonly isUnderConstruction: boolean;
  readonly constructionProgressPercent: number;
};

export type BuildingListRowViewData = {
  readonly id: string;
  readonly name: string;
  readonly buildingTypeLabel: string;
  readonly statusLabel: string;
  readonly positionLabel: string;
  readonly regionId: string;
  readonly regionLabel: string;
};

export type EmployeeRowViewData = {
  readonly id: string;
  readonly displayName: string;
  readonly employeeTypeLabel: string;
  readonly salaryLabel: string;
  readonly productivityLabel: string;
  readonly assignmentLabel: string;
};

export type ContractRowViewData = {
  readonly id: string;
  readonly resourceLabel: string;
  readonly amount: number;
  readonly paymentLabel: string;
  readonly intervalLabel: string;
  readonly statusLabel: string;
};

export type EconomySectionViewData = {
  readonly corporateTaxRateLabel: string;
  readonly taxIntervalTicks: number;
  readonly priceIndexLabel: string;
  readonly taxPaymentBlocked: boolean;
  readonly pendingTaxLabel: string | null;
  readonly contracts: readonly ContractRowViewData[];
};

export type ProductionJobRowViewData = {
  readonly id: string;
  readonly buildingLabel: string;
  readonly recipeLabel: string;
  readonly statusLabel: string;
  readonly progressLabel: string;
};

export type ResearchJobRowViewData = {
  readonly id: string;
  readonly technologyLabel: string;
  readonly statusLabel: string;
  readonly progressLabel: string;
};

export type TransportOrderRowViewData = {
  readonly id: string;
  readonly routeLabel: string;
  readonly resourceLabel: string;
  readonly amountLabel: string;
  readonly recipeLabel: string;
  readonly statusLabel: string;
  readonly durationLabel: string;
  readonly progressLabel: string;
};

export type FinanceTransactionRowViewData = {
  readonly id: string;
  readonly typeLabel: string;
  readonly amountLabel: string;
  readonly balanceLabel: string;
  readonly timestampLabel: string;
  readonly directionClass: string | undefined;
};

export type InventoryItemRowViewData = {
  readonly resourceLabel: string;
  readonly quantity: number;
  readonly reserved: number;
  readonly available: number;
};

export type WarehouseStorageRowViewData = {
  readonly id: string;
  readonly buildingLabel: string;
  readonly capacityLabel: string;
  readonly usedLabel: string;
  readonly items: readonly InventoryItemRowViewData[];
};

export type PlaceBuildingHintViewData = {
  readonly buildingTypeId: string;
  readonly name: string;
  readonly canPlace: boolean;
  readonly reason: string | null;
};

export type ProductionHintViewData = {
  readonly buildingId: string;
  readonly recipeId: string;
  readonly buildingName: string;
  readonly recipeName: string;
  readonly canStart: boolean;
  readonly reason: string | null;
};

export type ResearchHintViewData = {
  readonly technologyId: string;
  readonly name: string;
  readonly canStart: boolean;
  readonly reason: string | null;
};

export type MarketHintViewData = {
  readonly resourceId: string;
  readonly name: string;
  readonly tradeAmount: number;
  readonly canSell: boolean;
  readonly sellReason: string | null;
  readonly canBuy: boolean;
  readonly buyReason: string | null;
};

export type HireEmployeeHintViewData = {
  readonly employeeTypeId: string;
  readonly name: string;
  readonly costLabel: string;
  readonly defaultDisplayName: string;
  readonly canHire: boolean;
  readonly reason: string | null;
};

export type AssignEmployeeHintViewData = {
  readonly employeeId: string;
  readonly employeeName: string;
  readonly buildingId: string;
  readonly buildingName: string;
  readonly canAssign: boolean;
  readonly reason: string | null;
};

export type SidebarHintsViewData = {
  readonly placeBuilding: readonly PlaceBuildingHintViewData[];
  readonly production: readonly ProductionHintViewData[];
  readonly research: readonly ResearchHintViewData[];
  readonly market: readonly MarketHintViewData[];
  readonly hireEmployee: readonly HireEmployeeHintViewData[];
  readonly assignEmployee: readonly AssignEmployeeHintViewData[];
};

export type TutorialStepViewData = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
};

export type TutorialViewData = {
  readonly steps: readonly TutorialStepViewData[];
  readonly activeStepId: string | null;
  readonly completed: boolean;
};

export type TickMetricsViewData = {
  readonly tickNumber: number;
  readonly simulationTime: number;
  readonly availableCash: number;
  readonly energyReserve: number;
  readonly energyGeneration: number;
  readonly energyConsumption: number;
  readonly activeTransportCount: number;
  readonly warehouseTotalUnits: number;
  readonly onSiteTotalUnits: number;
  readonly priceIndex: number;
  readonly marketPrices: readonly TickMarketPriceSnapshot[];
};

export type MarketPriceChartViewData = {
  readonly resourceId: string;
  readonly resourceLabel: string;
  readonly basePrice: number;
  readonly lastPrice: number;
  readonly totalSupply: number;
  readonly baselineDemand: number;
  readonly pressureIndex: number;
  readonly trend: 'UP' | 'DOWN' | 'STABLE';
};

export type DetailKeyValueViewData = readonly [
  label: string,
  value: string,
  valueClass?: string,
];

export type EntityDetailViewData = {
  readonly title: string;
  readonly subtitle: string;
  readonly entries: readonly DetailKeyValueViewData[];
  readonly relatedItems?: readonly { readonly primary: string; readonly secondary: string }[];
  readonly relatedTitle?: string;
};

export type CompanyDetailViewData = {
  readonly hasFinance: boolean;
  readonly hasLogistics: boolean;
  readonly hasEnergy: boolean;
  readonly currency: string;
  readonly companyEntries: readonly DetailKeyValueViewData[];
  readonly financeEntries: readonly DetailKeyValueViewData[];
  readonly logisticsEntries: readonly DetailKeyValueViewData[];
  readonly energyEntries: readonly DetailKeyValueViewData[];
  readonly buildings: ReadonlyMap<string, EntityDetailViewData>;
  readonly productionJobs: ReadonlyMap<string, EntityDetailViewData>;
  readonly transportOrders: ReadonlyMap<string, EntityDetailViewData>;
  readonly researchJobs: ReadonlyMap<string, EntityDetailViewData>;
  readonly employees: ReadonlyMap<string, EntityDetailViewData>;
  readonly transactions: ReadonlyMap<string, EntityDetailViewData>;
  readonly warehouseStorage: ReadonlyMap<string, EntityDetailViewData>;
  readonly recentTransactions: readonly FinanceTransactionRowViewData[];
  readonly warehouseSummaries: readonly { readonly buildingLabel: string; readonly summary: string }[];
};

export type CompanyDashboardViewData = {
  readonly hasGame: boolean;
  readonly companyName: string | null;
  readonly tickLabel: string;
  readonly simulationTimeLabel: string;
  readonly headerSubtitle: string;
  readonly energyHasDeficit: boolean;
  readonly logisticsStatusMessage: string | null;
  readonly buildingCount: number;
  readonly labels: ContentLabelsViewData;
  readonly entityCatalog: EntityCatalogViewData;
  readonly kpis: KpiStripViewData | null;
  readonly overview: OverviewStripViewData | null;
  readonly hints: SidebarHintsViewData;
  readonly tutorial: TutorialViewData | null;
  readonly buildings: readonly BuildingRowViewData[];
  readonly employees: readonly EmployeeRowViewData[];
  readonly economy: EconomySectionViewData | null;
  readonly productionJobs: readonly ProductionJobRowViewData[];
  readonly completedResearchLabels: readonly string[];
  readonly researchJobs: readonly ResearchJobRowViewData[];
  readonly transportOrders: readonly TransportOrderRowViewData[];
  readonly financeTransactions: readonly FinanceTransactionRowViewData[];
  readonly inventoryItems: readonly InventoryItemRowViewData[];
  readonly warehouseStorage: readonly WarehouseStorageRowViewData[];
  readonly chartPoints: readonly TickMetricsViewData[];
  readonly marketPrices: readonly MarketPriceChartViewData[];
  readonly detail: CompanyDetailViewData;
};

export const EMPTY_COMPANY_DASHBOARD_VIEW_DATA: CompanyDashboardViewData = Object.freeze({
  hasGame: false,
  companyName: null,
  tickLabel: '—',
  simulationTimeLabel: '—',
  headerSubtitle: 'Starten Sie eine neue Session, um das Spiel zu beginnen.',
  energyHasDeficit: false,
  logisticsStatusMessage: null,
  buildingCount: 0,
  labels: Object.freeze({
    resource: (id: string) => id,
    building: (id: string) => id,
    recipe: (id: string) => id,
    technology: (id: string) => id,
    employee: (id: string) => id,
  }),
  entityCatalog: Object.freeze({
    buildingIds: new Set<string>(),
    resourceIds: new Set<string>(),
    productionIds: new Set<string>(),
    transportIds: new Set<string>(),
    researchIds: new Set<string>(),
    employeeIds: new Set<string>(),
    transactionIds: new Set<string>(),
    warehouseIds: new Set<string>(),
  }),
  kpis: null,
  overview: null,
  hints: Object.freeze({
    placeBuilding: Object.freeze([]),
    production: Object.freeze([]),
    research: Object.freeze([]),
    market: Object.freeze([]),
    hireEmployee: Object.freeze([]),
    assignEmployee: Object.freeze([]),
  }),
  tutorial: null,
  buildings: Object.freeze([]),
  employees: Object.freeze([]),
  economy: null,
  productionJobs: Object.freeze([]),
  completedResearchLabels: Object.freeze([]),
  researchJobs: Object.freeze([]),
  transportOrders: Object.freeze([]),
  financeTransactions: Object.freeze([]),
  inventoryItems: Object.freeze([]),
  warehouseStorage: Object.freeze([]),
  chartPoints: Object.freeze([]),
  marketPrices: Object.freeze([]),
  detail: Object.freeze({
    hasFinance: false,
    hasLogistics: false,
    hasEnergy: false,
    currency: 'GC',
    companyEntries: Object.freeze([]),
    financeEntries: Object.freeze([]),
    logisticsEntries: Object.freeze([]),
    energyEntries: Object.freeze([]),
    buildings: new Map(),
    productionJobs: new Map(),
    transportOrders: new Map(),
    researchJobs: new Map(),
    employees: new Map(),
    transactions: new Map(),
    warehouseStorage: new Map(),
    recentTransactions: Object.freeze([]),
    warehouseSummaries: Object.freeze([]),
  }),
});
