import type {
  BuildingReadModel,
  GameSessionDashboard,
  TickMetricsSnapshot,
} from '@/presentation/adapters/api/client';
import { buildNameMap } from '@/presentation/adapters/api/client';
import type {
  BuildingListRowViewData,
  BuildingRowViewData,
  CompanyDashboardViewData,
  CompanyDetailViewData,
  ContentLabelsViewData,
  ContractRowViewData,
  EconomySectionViewData,
  EmployeeRowViewData,
  EntityCatalogViewData,
  EntityDetailViewData,
  FinanceTransactionRowViewData,
  InventoryItemRowViewData,
  KpiStripViewData,
  MarketPriceChartViewData,
  OverviewStripViewData,
  ProductionJobRowViewData,
  ResearchJobRowViewData,
  SidebarHintsViewData,
  TickMetricsViewData,
  TransportOrderRowViewData,
  TutorialViewData,
  WarehouseStorageRowViewData,
} from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { EMPTY_COMPANY_DASHBOARD_VIEW_DATA } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import {
  formatContractStatus,
  formatCurrency,
  formatEnergy,
  formatNumber,
  formatProductionStatus,
  formatProgress,
  formatSignedCurrency,
  formatSimulationTime,
  formatTick,
  formatTransactionAmount,
  formatTransactionType,
  formatTransportStatus,
  transactionDirectionClass,
  trendFromHistory,
  trendLabel,
} from '@/presentation/formatting/presentation-formatters';
import type { DetailKeyValueViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';

function kv(label: string, value: string, valueClass?: string): DetailKeyValueViewData {
  return valueClass === undefined
    ? (Object.freeze([label, value]) as DetailKeyValueViewData)
    : (Object.freeze([label, value, valueClass]) as DetailKeyValueViewData);
}

function buildContentLabels(dashboard: GameSessionDashboard | null): ContentLabelsViewData {
  if (dashboard === null) {
    return EMPTY_COMPANY_DASHBOARD_VIEW_DATA.labels;
  }

  const resources = buildNameMap(dashboard.contentNames.resources);
  const buildings = buildNameMap(dashboard.contentNames.buildings);
  const recipes = buildNameMap(dashboard.contentNames.recipes);
  const technologies = buildNameMap(dashboard.contentNames.technologies);
  const employees = buildNameMap(dashboard.contentNames.employees);

  return Object.freeze({
    resource: (resourceId: string) => resources.get(resourceId) ?? resourceId,
    building: (buildingTypeId: string) => buildings.get(buildingTypeId) ?? buildingTypeId,
    recipe: (recipeId: string) => recipes.get(recipeId) ?? recipeId,
    technology: (technologyId: string) => technologies.get(technologyId) ?? technologyId,
    employee: (employeeTypeId: string) => employees.get(employeeTypeId) ?? employeeTypeId,
  });
}

function mapEntityCatalog(dashboard: GameSessionDashboard): EntityCatalogViewData {
  return Object.freeze({
    buildingIds: new Set(dashboard.buildings.map((entry) => entry.id)),
    resourceIds: new Set(dashboard.marketPrices.map((entry) => entry.resourceId)),
    productionIds: new Set(dashboard.productionJobs.map((entry) => entry.id)),
    transportIds: new Set((dashboard.transportOrders ?? []).map((entry) => entry.id)),
    researchIds: new Set(dashboard.researchJobs.map((entry) => entry.id)),
    employeeIds: new Set(dashboard.employees.map((entry) => entry.id)),
    transactionIds: new Set(dashboard.financeTransactions.map((entry) => entry.id)),
    warehouseIds: new Set((dashboard.warehouseStorage ?? []).map((entry) => entry.buildingId)),
  });
}

function mapBuildingRow(
  building: BuildingReadModel,
  labels: ContentLabelsViewData,
  regionNames: ReadonlyMap<string, string> = new Map(),
): BuildingRowViewData {
  return Object.freeze({
    id: building.id,
    name: building.name,
    buildingTypeLabel: labels.building(building.buildingTypeId),
    statusLabel: building.status,
    positionLabel: `${building.x}, ${building.y}`,
    regionId: building.regionId,
    regionLabel: regionNames.get(building.regionId) ?? building.regionId,
    isUnderConstruction: building.status === 'UNDER_CONSTRUCTION',
    constructionProgressPercent: building.constructionProgress,
  });
}

export function mapBuildingListRow(
  building: BuildingReadModel,
  labels: ContentLabelsViewData,
  regionNames: ReadonlyMap<string, string> = new Map(),
): BuildingListRowViewData {
  return Object.freeze({
    id: building.id,
    name: building.name,
    buildingTypeLabel: labels.building(building.buildingTypeId),
    statusLabel: building.status,
    positionLabel: `${building.x}, ${building.y}`,
    regionId: building.regionId,
    regionLabel: regionNames.get(building.regionId) ?? building.regionId,
  });
}

function mapKpiStrip(
  dashboard: GameSessionDashboard,
  chartPoints: readonly TickMetricsSnapshot[],
): KpiStripViewData | null {
  const kpis = dashboard.kpis;

  if (kpis === null) {
    return null;
  }

  const runningProduction = dashboard.productionJobs.filter((job) => job.status === 'RUNNING').length;
  const waitingProduction = dashboard.productionJobs.filter((job) => job.status === 'WAITING').length;
  const activeResearch = dashboard.researchJobs.filter((job) => job.status === 'IN_PROGRESS').length;

  return Object.freeze({
    availableCashLabel: `${formatNumber(kpis.availableCash)} GC`,
    availableCashTrend: trendFromHistory(chartPoints, 'availableCash', 'Liquidität'),
    energyReserveLabel: formatEnergy(kpis.energyReserve),
    energyTrend: kpis.energyHasDeficit
      ? trendLabel('down', 'Defizit')
      : trendFromHistory(chartPoints, 'energyReserve', 'Stabil'),
    energyHasDeficit: kpis.energyHasDeficit,
    activeTransportCount: kpis.activeTransportCount,
    activeTransportTrend: trendFromHistory(chartPoints, 'activeTransportCount', 'Aktiv unterwegs'),
    warehouseTotalUnits: kpis.warehouseTotalUnits,
    warehouseCapacityHint:
      kpis.warehouseStorageCapacity > 0
        ? `${kpis.warehouseUsedCapacity}/${kpis.warehouseStorageCapacity} Kapazität`
        : trendLabel('stable', 'Einheiten gesamt'),
    onSiteResourceLines: kpis.onSiteResourceLines,
    onSiteHint: trendLabel('stable', 'Ressourcenlinien'),
    assignedEmployeeCount: kpis.assignedEmployeeCount,
    employeeCount: kpis.employeeCount,
    employeeCapacityHint:
      kpis.employeeCount > 0
        ? `${kpis.assignedEmployeeCount}/${kpis.employeeCount} zugewiesen`
        : trendLabel('stable', 'Personal'),
    payrollLabel: `${formatNumber(kpis.payrollPerInterval)} GC Payroll / 10 Ticks`,
    priceIndexLabel: kpis.priceIndex.toFixed(2),
    priceIndexHint: trendLabel('stable', 'Neutral bei 1,00'),
    corporateTaxRateLabel: `${(kpis.corporateTaxRate * 100).toFixed(0)} %`,
    taxTrendLabel: kpis.taxPaymentBlocked
      ? trendLabel(
          'down',
          `${formatNumber(kpis.pendingTaxAmount)} GC offen · Kasse zu niedrig`,
        )
      : `${kpis.activeContractCount} aktiv · alle ${kpis.taxIntervalTicks} Ticks`,
    taxPaymentBlocked: kpis.taxPaymentBlocked,
    runningProductionCount: runningProduction,
    productionHint: waitingProduction > 0 ? `${waitingProduction} wartend` : 'Keine Warteschlange',
    activeResearchCount: activeResearch,
    researchHint: `${dashboard.completedResearch.length} abgeschlossen`,
    completedMilestoneCount: dashboard.completedMilestones.length,
    milestoneHint: `von ${dashboard.milestones.length} erreicht`,
    activeContractCount: kpis.activeContractCount,
    economyHint:
      kpis.activeContractCount > 0
        ? `${kpis.activeContractCount} aktiv · alle ${kpis.taxIntervalTicks} Ticks`
        : `Steuer alle ${kpis.taxIntervalTicks} Ticks`,
    taxIntervalTicks: kpis.taxIntervalTicks,
  });
}

function mapOverviewStrip(dashboard: GameSessionDashboard): OverviewStripViewData {
  const runningProduction = dashboard.productionJobs.filter((job) => job.status === 'RUNNING').length;
  const waitingProduction = dashboard.productionJobs.filter((job) => job.status === 'WAITING').length;
  const activeResearch = dashboard.researchJobs.filter((job) => job.status === 'IN_PROGRESS').length;
  const activeTransport = dashboard.logistics?.activeTransportCount ?? 0;
  const queuedTransport = dashboard.logistics?.queuedTransportCount ?? 0;
  const assignedEmployees =
    dashboard.kpis?.assignedEmployeeCount ??
    dashboard.employees.filter((employee) => employee.assignedBuildingId !== null).length;

  return Object.freeze({
    cards: Object.freeze([
      Object.freeze({ label: 'Gebäude', value: String(dashboard.buildings.length), hint: 'Standorte & Anlagen' }),
      Object.freeze({
        label: 'Mitarbeiter',
        value: String(dashboard.employees.length),
        hint: assignedEmployees > 0 ? `${assignedEmployees} zugewiesen` : 'Noch keine Zuweisungen',
      }),
      Object.freeze({
        label: 'Produktion',
        value: String(runningProduction),
        hint: waitingProduction > 0 ? `${waitingProduction} wartend` : 'Keine Warteschlange',
      }),
      Object.freeze({
        label: 'Forschung',
        value: String(activeResearch),
        hint: `${dashboard.completedResearch.length} abgeschlossen`,
      }),
      Object.freeze({
        label: 'Transport',
        value: String(activeTransport),
        hint:
          queuedTransport > 0
            ? `${queuedTransport} in Warteschlange`
            : dashboard.logistics?.waitingProductionCount
              ? `${dashboard.logistics.waitingProductionCount} Jobs warten`
              : 'Logistik stabil',
      }),
      Object.freeze({
        label: 'Meilensteine',
        value: String(dashboard.completedMilestones.length),
        hint: `von ${dashboard.milestones.length} erreicht`,
      }),
      Object.freeze({
        label: 'Markt',
        value: String(dashboard.marketPrices.length),
        hint: 'Ressourcen mit Preisen',
      }),
    ]),
  });
}

function mapSidebarHints(dashboard: GameSessionDashboard): SidebarHintsViewData {
  return Object.freeze({
    placeBuilding: Object.freeze(
      dashboard.hints.placeBuilding.map((hint) =>
        Object.freeze({
          buildingTypeId: hint.buildingTypeId,
          name: hint.name,
          canPlace: hint.canPlace,
          reason: hint.reason,
        }),
      ),
    ),
    production: Object.freeze(
      dashboard.hints.production.map((hint) =>
        Object.freeze({
          buildingId: hint.buildingId,
          recipeId: hint.recipeId,
          buildingName: hint.buildingName,
          recipeName: hint.recipeName,
          canStart: hint.canStart,
          reason: hint.reason,
        }),
      ),
    ),
    research: Object.freeze(
      dashboard.hints.research.map((hint) =>
        Object.freeze({
          technologyId: hint.technologyId,
          name: hint.name,
          canStart: hint.canStart,
          reason: hint.reason,
        }),
      ),
    ),
    market: Object.freeze(
      dashboard.hints.market.map((hint) =>
        Object.freeze({
          resourceId: hint.resourceId,
          name: hint.name,
          tradeAmount: hint.tradeAmount,
          canSell: hint.canSell,
          sellReason: hint.sellReason,
          canBuy: hint.canBuy,
          buyReason: hint.buyReason,
        }),
      ),
    ),
    hireEmployee: Object.freeze(
      dashboard.hints.hireEmployee.map((hint) =>
        Object.freeze({
          employeeTypeId: hint.employeeTypeId,
          name: hint.name,
          costLabel: `${formatNumber(hint.cost)} GC`,
          defaultDisplayName: hint.defaultDisplayName,
          canHire: hint.canHire,
          reason: hint.reason,
        }),
      ),
    ),
    assignEmployee: Object.freeze(
      dashboard.hints.assignEmployee.map((hint) =>
        Object.freeze({
          employeeId: hint.employeeId,
          employeeName: hint.employeeName,
          buildingId: hint.buildingId,
          buildingName: hint.buildingName,
          canAssign: hint.canAssign,
          reason: hint.reason,
        }),
      ),
    ),
  });
}

function mapTutorial(dashboard: GameSessionDashboard): TutorialViewData | null {
  if (dashboard.tutorial === null) {
    return null;
  }

  return Object.freeze({
    steps: Object.freeze(
      dashboard.tutorial.steps.map((step) =>
        Object.freeze({
          id: step.id,
          title: step.title,
          description: step.description,
          completed: step.completed,
        }),
      ),
    ),
    activeStepId: dashboard.tutorial.activeStepId,
    completed: dashboard.tutorial.completed,
  });
}

function mapEconomySection(
  dashboard: GameSessionDashboard,
  labels: ContentLabelsViewData,
): EconomySectionViewData | null {
  if (dashboard.economy === null) {
    return null;
  }

  const contracts: readonly ContractRowViewData[] = Object.freeze(
    dashboard.economy.contracts.map((contract) =>
      Object.freeze({
        id: contract.id,
        resourceLabel: labels.resource(contract.resourceId),
        amount: contract.amount,
        paymentLabel: `${formatNumber(contract.paymentAmount)} GC`,
        intervalLabel: `${contract.intervalTicks} Ticks`,
        statusLabel: formatContractStatus(contract.active),
      }),
    ),
  );

  return Object.freeze({
    corporateTaxRateLabel: `${dashboard.economy.corporateTaxRate * 100} %`,
    taxIntervalTicks: dashboard.economy.taxIntervalTicks,
    priceIndexLabel: dashboard.economy.priceIndex.toFixed(2),
    taxPaymentBlocked: dashboard.economy.taxPaymentBlocked,
    pendingTaxLabel: dashboard.economy.taxPaymentBlocked
      ? `${formatNumber(dashboard.economy.pendingTaxAmount)} GC`
      : null,
    contracts,
  });
}

function mapChartPoints(points: readonly TickMetricsSnapshot[]): readonly TickMetricsViewData[] {
  return Object.freeze(points.map((point) => Object.freeze({ ...point })));
}

function mapMarketPrices(
  dashboard: GameSessionDashboard,
  labels: ContentLabelsViewData,
): readonly MarketPriceChartViewData[] {
  return Object.freeze(
    dashboard.marketPrices.map((price) =>
      Object.freeze({
        resourceId: price.resourceId,
        resourceLabel: labels.resource(price.resourceId),
        basePrice: price.basePrice,
        lastPrice: price.lastPrice,
        totalSupply: price.totalSupply,
        baselineDemand: price.baselineDemand,
        pressureIndex: price.pressureIndex,
        trend: price.trend,
      }),
    ),
  );
}

function mapCompanyDetail(
  dashboard: GameSessionDashboard,
  labels: ContentLabelsViewData,
): CompanyDetailViewData {
  const currency = dashboard.finance?.currency ?? 'GC';
  const buildingDetails = new Map<string, EntityDetailViewData>();
  const productionDetails = new Map<string, EntityDetailViewData>();
  const transportDetails = new Map<string, EntityDetailViewData>();
  const researchDetails = new Map<string, EntityDetailViewData>();
  const employeeDetails = new Map<string, EntityDetailViewData>();
  const transactionDetails = new Map<string, EntityDetailViewData>();
  const warehouseDetails = new Map<string, EntityDetailViewData>();

  for (const building of dashboard.buildings) {
    const relatedJobs = dashboard.productionJobs.filter((job) => job.buildingId === building.id);
    const warehouse = dashboard.warehouseStorage.find((storage) => storage.buildingId === building.id);

    buildingDetails.set(
      building.id,
      Object.freeze({
        title: building.name,
        subtitle: `Gebäude · ${labels.building(building.buildingTypeId)}`,
        entries: Object.freeze([
          kv('ID', building.id),
          kv('Typ', labels.building(building.buildingTypeId)),
          kv('Status', building.status),
          kv('Position', `${building.x}, ${building.y}`),
          ...(building.status === 'UNDER_CONSTRUCTION'
            ? [
                kv('Baufortschritt', formatProgress(building.constructionProgress)),
                kv('Baudauer', `${building.constructionDuration} Ticks`),
              ]
            : []),
          kv('Produktionsjobs', String(relatedJobs.length)),
          ...(warehouse ? [kv('Lagerzeilen', String(warehouse.items.length))] : []),
        ]),
        relatedItems: Object.freeze(
          relatedJobs.map((job) =>
            Object.freeze({
              primary: labels.recipe(job.recipeId),
              secondary: formatProductionStatus(job.status, job.awaitingTransport),
            }),
          ),
        ),
      }),
    );
  }

  for (const job of dashboard.productionJobs) {
    const building = dashboard.buildings.find((entry) => entry.id === job.buildingId);
    const relatedTransports = (dashboard.transportOrders ?? []).filter(
      (order) => order.productionJobId === job.id,
    );

    productionDetails.set(
      job.id,
      Object.freeze({
        title: labels.recipe(job.recipeId),
        subtitle: `Produktion · ${building?.name ?? job.buildingId}`,
        entries: Object.freeze([
          kv('Job-ID', job.id),
          kv('Gebäude', building?.name ?? job.buildingId),
          kv('Gebäudetyp', building ? labels.building(building.buildingTypeId) : '—'),
          kv('Status', formatProductionStatus(job.status, job.awaitingTransport)),
          kv('Fortschritt', formatProgress(job.progress)),
          kv('Transporte aktiv', String(job.activeTransportCount)),
          ...(job.awaitingTransport ? [kv('Hinweis', 'Wartet auf Materialtransport')] : []),
        ]),
        relatedItems: Object.freeze(
          relatedTransports.map((order) =>
            Object.freeze({
              primary: `${order.amount}× ${labels.resource(order.resourceId)}`,
              secondary: `${order.sourceBuildingName} → ${order.destinationBuildingName}`,
            }),
          ),
        ),
      }),
    );
  }

  for (const order of dashboard.transportOrders ?? []) {
    transportDetails.set(
      order.id,
      Object.freeze({
        title: `${order.amount}× ${labels.resource(order.resourceId)}`,
        subtitle: 'Transport & Logistik',
        entries: Object.freeze([
          kv('Transport-ID', order.id),
          kv('Ressource', labels.resource(order.resourceId)),
          kv('Menge', String(order.amount)),
          kv('Route', `${order.sourceBuildingName} → ${order.destinationBuildingName}`),
          kv('Quelle', order.sourceBuildingName),
          kv('Ziel', order.destinationBuildingName),
          kv('Status', formatTransportStatus(order.status)),
          kv('Route-ID', order.routeId ?? 'Fallback'),
          kv('Dauer', `${order.durationTicks} Ticks`),
          kv('Fortschritt', formatProgress(order.progress)),
          kv('Produktionsjob', order.productionJobId),
          kv('Rezept', order.recipeName ?? '—'),
        ]),
      }),
    );
  }

  for (const job of dashboard.researchJobs) {
    researchDetails.set(
      job.id,
      Object.freeze({
        title: labels.technology(job.technologyId),
        subtitle: 'Forschung',
        entries: Object.freeze([
          kv('Job-ID', job.id),
          kv('Technologie', labels.technology(job.technologyId)),
          kv('Status', job.status),
          kv('Fortschritt', formatProgress(job.progress)),
        ]),
      }),
    );
  }

  for (const employee of dashboard.employees) {
    employeeDetails.set(
      employee.id,
      Object.freeze({
        title: employee.displayName,
        subtitle: `Mitarbeiter · ${labels.employee(employee.employeeTypeId)}`,
        entries: Object.freeze([
          kv('ID', employee.id),
          kv('Typ', labels.employee(employee.employeeTypeId)),
          kv('Gehalt', `${formatNumber(employee.salary)} GC`),
          kv('Produktivität', employee.productivity.toFixed(2)),
          kv('Status', employee.status),
          kv('Eingestellt', String(employee.hiredAt)),
          kv('Zuweisung', employee.assignedBuildingName ?? '—'),
        ]),
      }),
    );
  }

  for (const transaction of dashboard.financeTransactions) {
    transactionDetails.set(
      transaction.id,
      Object.freeze({
        title: formatTransactionType(transaction.transactionType),
        subtitle: 'Finanzbuchung',
        entries: Object.freeze([
          kv('Buchungs-ID', transaction.id),
          kv('Typ', formatTransactionType(transaction.transactionType)),
          kv('Richtung', transaction.direction),
          kv(
            'Betrag',
            `${formatTransactionAmount(transaction.direction, transaction.amount)} ${currency}`,
            transactionDirectionClass(transaction.direction),
          ),
          kv('Saldo vorher', formatCurrency(transaction.balanceBefore, currency)),
          kv('Saldo nachher', formatCurrency(transaction.balanceAfter, currency)),
          kv('Reserviert Δ', String(transaction.reservedCashDelta)),
          kv('Simulationszeit', String(transaction.timestamp)),
        ]),
      }),
    );
  }

  for (const storage of dashboard.warehouseStorage ?? []) {
    const totalUnits = storage.items.reduce((total, item) => total + item.quantity, 0);
    warehouseDetails.set(
      storage.buildingId,
      Object.freeze({
        title: storage.buildingName,
        subtitle: 'Lagerhaus',
        entries: Object.freeze([
          kv('Gebäude-ID', storage.buildingId),
          kv('Ressourcenzeilen', String(storage.items.length)),
          kv('Einheiten gesamt', String(totalUnits)),
          ...(storage.storageCapacity > 0
            ? [
                kv('Kapazität', `${storage.usedCapacity}/${storage.storageCapacity}`),
                kv('Frei', String(storage.availableCapacity)),
              ]
            : []),
        ]),
        relatedItems: Object.freeze(
          storage.items.map((item) =>
            Object.freeze({
              primary: labels.resource(item.resourceId),
              secondary: `${item.quantity} (frei: ${item.available})`,
            }),
          ),
        ),
      }),
    );
  }

  const recentTransactions: readonly FinanceTransactionRowViewData[] = Object.freeze(
    dashboard.financeTransactions.slice(0, 5).map((transaction) =>
      Object.freeze({
        id: transaction.id,
        typeLabel: formatTransactionType(transaction.transactionType),
        amountLabel: `${formatTransactionAmount(transaction.direction, transaction.amount)} ${currency}`,
        balanceLabel: formatNumber(transaction.balanceAfter),
        timestampLabel: String(transaction.timestamp),
        directionClass: transactionDirectionClass(transaction.direction),
      }),
    ),
  );

  const warehouseSummaries = Object.freeze(
    (dashboard.warehouseStorage ?? []).map((storage) => {
      const units = storage.items.reduce((total, item) => total + item.quantity, 0);
      return Object.freeze({
        buildingLabel: storage.buildingName,
        summary: `${storage.items.length} Zeilen · ${units} Einheiten`,
      });
    }),
  );

  return Object.freeze({
    hasFinance: dashboard.finance !== null,
    hasLogistics: dashboard.logistics !== null,
    hasEnergy: dashboard.energy !== null,
    currency,
    companyEntries:
      dashboard.company === null
        ? Object.freeze([])
        : Object.freeze([
            kv('Name', dashboard.company.name),
            kv('ID', dashboard.company.id),
            kv('Owner', dashboard.company.ownerId),
            kv('Status', dashboard.company.status),
          ]),
    financeEntries:
      dashboard.finance === null
        ? Object.freeze([])
        : Object.freeze([
            kv('Konto-ID', dashboard.finance.id),
            kv('Währung', dashboard.finance.currency),
            kv('Cash', formatCurrency(dashboard.finance.cashBalance, dashboard.finance.currency)),
            kv('Reserviert', formatCurrency(dashboard.finance.reservedCash, dashboard.finance.currency)),
            kv('Verfügbar', formatCurrency(dashboard.finance.availableCash, dashboard.finance.currency)),
            kv('Buchungen gesamt', String(dashboard.financeTransactions.length)),
          ]),
    logisticsEntries:
      dashboard.logistics === null
        ? Object.freeze([])
        : Object.freeze([
            kv('Lagerhaus aktiv', dashboard.logistics.hasActiveWarehouse ? 'Ja' : 'Nein'),
            kv('Transporte unterwegs', String(dashboard.logistics.activeTransportCount)),
            kv('Produktion wartet', String(dashboard.logistics.waitingProductionCount)),
            kv('Lagerzeilen', String(dashboard.logistics.warehouseResourceLines)),
            kv('Einheiten im Lager', String(dashboard.logistics.warehouseTotalUnits)),
            ...(dashboard.logistics.warehouseStorageCapacity > 0
              ? [
                  kv(
                    'Lagerkapazität',
                    `${dashboard.logistics.warehouseUsedCapacity}/${dashboard.logistics.warehouseStorageCapacity}`,
                  ),
                  kv('Freie Kapazität', String(dashboard.logistics.warehouseAvailableCapacity)),
                ]
              : []),
            ...(dashboard.logistics.statusMessage
              ? [kv('Status', dashboard.logistics.statusMessage)]
              : []),
          ]),
    energyEntries:
      dashboard.energy === null
        ? Object.freeze([])
        : Object.freeze([
            kv('Erzeugung', formatEnergy(dashboard.energy.generation)),
            kv('Verbrauch', formatEnergy(dashboard.energy.consumption)),
            kv(
              'Reserve',
              formatEnergy(dashboard.energy.reserve),
              dashboard.energy.reserve < 0 ? 'kv-value-error' : 'kv-value-success',
            ),
            kv(
              'Netz',
              dashboard.energy.usesBaselineGrid ? 'Öffentliches Netz (30 MW)' : 'Eigenversorgung',
            ),
            kv(
              'Status',
              dashboard.energy.hasDeficit ? 'Defizit' : 'Stabil',
              dashboard.energy.hasDeficit ? 'kv-value-warning' : 'kv-value-success',
            ),
          ]),
    buildings: buildingDetails,
    productionJobs: productionDetails,
    transportOrders: transportDetails,
    researchJobs: researchDetails,
    employees: employeeDetails,
    transactions: transactionDetails,
    warehouseStorage: warehouseDetails,
    recentTransactions,
    warehouseSummaries,
  });
}

/** Maps dashboard DTO and tick history into immutable company view-data. */
export function buildCompanyDashboardViewData(
  dashboard: GameSessionDashboard | null,
  chartPoints: readonly TickMetricsSnapshot[],
): CompanyDashboardViewData {
  if (dashboard === null || dashboard.company === null) {
    return EMPTY_COMPANY_DASHBOARD_VIEW_DATA;
  }

  const labels = buildContentLabels(dashboard);
  const hasGame = dashboard.company !== null;

  const employees: readonly EmployeeRowViewData[] = Object.freeze(
    dashboard.employees.map((employee) =>
      Object.freeze({
        id: employee.id,
        displayName: employee.displayName,
        employeeTypeLabel: labels.employee(employee.employeeTypeId),
        salaryLabel: formatNumber(employee.salary),
        productivityLabel: employee.productivity.toFixed(2),
        assignmentLabel: employee.assignedBuildingName ?? '—',
      }),
    ),
  );

  const productionJobs: readonly ProductionJobRowViewData[] = Object.freeze(
    dashboard.productionJobs.map((job) => {
      const building = dashboard.buildings.find((entry) => entry.id === job.buildingId);
      return Object.freeze({
        id: job.id,
        buildingLabel: building?.name ?? job.buildingId,
        recipeLabel: labels.recipe(job.recipeId),
        statusLabel: formatProductionStatus(job.status, job.awaitingTransport),
        progressLabel: formatProgress(job.progress),
      });
    }),
  );

  const researchJobs: readonly ResearchJobRowViewData[] = Object.freeze(
    dashboard.researchJobs.map((job) =>
      Object.freeze({
        id: job.id,
        technologyLabel: labels.technology(job.technologyId),
        statusLabel: job.status,
        progressLabel: formatProgress(job.progress),
      }),
    ),
  );

  const transportOrders: readonly TransportOrderRowViewData[] = Object.freeze(
    (dashboard.transportOrders ?? []).map((order) =>
      Object.freeze({
        id: order.id,
        routeLabel: `${order.sourceBuildingName} → ${order.destinationBuildingName}`,
        resourceLabel: labels.resource(order.resourceId),
        amountLabel: String(order.amount),
        recipeLabel: order.recipeName ?? '—',
        statusLabel: formatTransportStatus(order.status),
        durationLabel: String(order.durationTicks),
        progressLabel: formatProgress(order.progress),
      }),
    ),
  );

  const financeTransactions: readonly FinanceTransactionRowViewData[] = Object.freeze(
    dashboard.financeTransactions.map((transaction) =>
      Object.freeze({
        id: transaction.id,
        typeLabel: formatTransactionType(transaction.transactionType),
        amountLabel: formatTransactionAmount(transaction.direction, transaction.amount),
        balanceLabel: formatNumber(transaction.balanceAfter),
        timestampLabel: String(transaction.timestamp),
        directionClass: transactionDirectionClass(transaction.direction),
      }),
    ),
  );

  const inventoryItems: readonly InventoryItemRowViewData[] = Object.freeze(
    (dashboard.inventory?.items ?? []).map((item) =>
      Object.freeze({
        resourceLabel: labels.resource(item.resourceId),
        quantity: item.quantity,
        reserved: item.reserved,
        available: item.available,
      }),
    ),
  );

  const warehouseStorage: readonly WarehouseStorageRowViewData[] = Object.freeze(
    (dashboard.warehouseStorage ?? []).map((storage) =>
      Object.freeze({
        id: storage.buildingId,
        buildingLabel: storage.buildingName,
        capacityLabel:
          storage.storageCapacity > 0
            ? `${storage.usedCapacity}/${storage.storageCapacity}`
            : '—',
        usedLabel: String(storage.usedCapacity),
        items: Object.freeze(
          storage.items.map((item) =>
            Object.freeze({
              resourceLabel: labels.resource(item.resourceId),
              quantity: item.quantity,
              reserved: item.reserved,
              available: item.available,
            }),
          ),
        ),
      }),
    ),
  );

  return Object.freeze({
    hasGame,
    companyName: dashboard.company.name,
    tickLabel: formatTick(dashboard.tickNumber),
    simulationTimeLabel: formatSimulationTime(dashboard.simulationTime),
    headerSubtitle: `Unternehmens-Dashboard · Tick ${formatTick(dashboard.tickNumber)} · Zeit ${formatSimulationTime(dashboard.simulationTime)}`,
    energyHasDeficit: dashboard.energy?.hasDeficit ?? false,
    logisticsStatusMessage: dashboard.logistics?.statusMessage ?? null,
    buildingCount: dashboard.buildings.length,
    labels,
    entityCatalog: mapEntityCatalog(dashboard),
    kpis: mapKpiStrip(dashboard, chartPoints),
    overview: mapOverviewStrip(dashboard),
    hints: mapSidebarHints(dashboard),
    tutorial: mapTutorial(dashboard),
    buildings: Object.freeze(dashboard.buildings.map((building) => mapBuildingRow(building, labels))),
    employees,
    economy: mapEconomySection(dashboard, labels),
    productionJobs,
    completedResearchLabels: Object.freeze(
      dashboard.completedResearch.map((technologyId) => labels.technology(technologyId)),
    ),
    researchJobs,
    transportOrders,
    financeTransactions,
    inventoryItems,
    warehouseStorage,
    chartPoints: mapChartPoints(chartPoints),
    marketPrices: mapMarketPrices(dashboard, labels),
    detail: mapCompanyDetail(dashboard, labels),
  });
}
