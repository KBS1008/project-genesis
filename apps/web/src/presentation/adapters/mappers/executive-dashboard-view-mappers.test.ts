import { describe, expect, it } from 'vitest';
import { buildExecutiveDashboardViewData, resolvePlayerSummary } from '@/presentation/adapters/mappers/executive-dashboard-view-mappers';
import type { CompanyDashboardViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';

function createDashboardFixture(): CompanyDashboardViewData {
  return {
    hasGame: true,
    companyName: 'Acme Industries',
    tickLabel: '42',
    simulationTimeLabel: 'Tag 3',
    headerSubtitle: 'Session aktiv',
    energyHasDeficit: true,
    logisticsStatusMessage: 'Transport verzögert',
    buildingCount: 2,
    labels: {
      resource: (id) => id,
      building: (id) => id,
      recipe: (id) => id,
      technology: (id) => id,
      employee: (id) => id,
    },
    entityCatalog: {
      buildingIds: new Set(),
      resourceIds: new Set(),
      productionIds: new Set(),
      transportIds: new Set(),
      researchIds: new Set(),
      employeeIds: new Set(),
      transactionIds: new Set(),
      warehouseIds: new Set(),
    },
    kpis: {
      availableCashLabel: '10.000 GC',
      availableCashTrend: '+5 %',
      energyReserveLabel: '120 kWh',
      energyTrend: 'Defizit',
      energyHasDeficit: true,
      activeTransportCount: 1,
      activeTransportTrend: '1 aktiv',
      warehouseTotalUnits: 50,
      warehouseCapacityHint: '50/100',
      onSiteResourceLines: 3,
      onSiteHint: '3 Linien',
      assignedEmployeeCount: 2,
      employeeCount: 4,
      employeeCapacityHint: '2/4',
      payrollLabel: '500 GC',
      priceIndexLabel: '1.05',
      priceIndexHint: 'stabil',
      corporateTaxRateLabel: '20 %',
      taxTrendLabel: 'offen',
      taxPaymentBlocked: true,
      runningProductionCount: 1,
      productionHint: '1 Job',
      activeResearchCount: 1,
      researchHint: '1 Job',
      completedMilestoneCount: 2,
      milestoneHint: '2 erreicht',
      activeContractCount: 1,
      economyHint: '1 Vertrag',
      taxIntervalTicks: 10,
    },
    overview: { cards: [] },
    hints: {
      placeBuilding: [],
      production: [],
      research: [],
      market: [],
      hireEmployee: [],
      assignEmployee: [],
    },
    tutorial: null,
    buildings: [],
    employees: [],
    economy: null,
    productionJobs: [],
    completedResearchLabels: ['Solar'],
    researchJobs: [],
    transportOrders: [],
    financeTransactions: [],
    inventoryItems: [],
    warehouseStorage: [],
    chartPoints: [],
    marketPrices: [],
    detail: {
      hasFinance: true,
      hasLogistics: true,
      hasEnergy: true,
      currency: 'GC',
      companyEntries: [],
      financeEntries: [['Cash', '10.000 GC']],
      logisticsEntries: [],
      energyEntries: [],
      buildings: new Map(),
      productionJobs: new Map(),
      transportOrders: new Map(),
      researchJobs: new Map(),
      employees: new Map(),
      transactions: new Map(),
      warehouseStorage: new Map(),
      recentTransactions: [],
      warehouseSummaries: [],
    },
  };
}

describe('buildExecutiveDashboardViewData', () => {
  it('maps KPI cards and accepts unified notification items', () => {
    const notifications = Object.freeze([
      {
        id: 'runtime:energy-deficit',
        title: 'Energiedefizit',
        message: 'Defizit',
        tone: 'warning' as const,
        timestampLabel: 'Tag 3',
      },
      {
        id: 'runtime:tax-blocked',
        title: 'Steuerzahlung blockiert',
        message: 'offen',
        tone: 'error' as const,
        timestampLabel: 'Tag 3',
      },
    ]);

    const dashboard = buildExecutiveDashboardViewData(
      createDashboardFixture(),
      [],
      [],
      { playerId: 'player_001' },
      notifications,
    );

    expect(dashboard.companyName).toBe('Acme Industries');
    expect(dashboard.playerSummary).toBe('player_001');
    expect(dashboard.kpiCards.length).toBeGreaterThan(0);
    expect(dashboard.kpiCards[0]?.placeholder).toBe('{{availableCash}}');
    expect(dashboard.notifications).toEqual(notifications);
    expect(dashboard.reportActions).toHaveLength(4);
  });
});

describe('resolvePlayerSummary', () => {
  it('prefers runtime playerName when available', () => {
    expect(
      resolvePlayerSummary({
        playerId: 'player_001',
        playerName: 'Alex Operator',
      }),
    ).toBe('Alex Operator');
  });

  it('falls back to playerId until a display name contract exists', () => {
    expect(resolvePlayerSummary({ playerId: 'player_001', playerName: null })).toBe('player_001');
    expect(resolvePlayerSummary({ playerId: null, playerName: null })).toBe('—');
  });
});
