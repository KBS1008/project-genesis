// @vitest-environment jsdom

import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ExecutiveDashboardScreen } from '@/presentation/screens/dashboard/ExecutiveDashboardScreen';
import { renderPresentation } from '@/presentation/testing/presentation-test-harness';

vi.mock('@/presentation/state/GameWorkspaceProvider', () => ({
  useGameWorkspace: () => ({
    viewData: {
      session: { hasGame: true, playerId: 'player_001' },
    },
    companyViewData: {
      companyName: 'Test Corp',
      headerSubtitle: 'Tick 1',
      tickLabel: '1',
      simulationTimeLabel: 'Tag 1',
      buildingCount: 0,
      energyHasDeficit: false,
      logisticsStatusMessage: null,
      labels: {
        resource: (id: string) => id,
        building: (id: string) => id,
        recipe: (id: string) => id,
        technology: (id: string) => id,
        employee: (id: string) => id,
      },
      kpis: {
        availableCashLabel: '1.000 GC',
        availableCashTrend: 'stabil',
        energyReserveLabel: '100',
        energyTrend: 'ok',
        energyHasDeficit: false,
        activeTransportCount: 0,
        activeTransportTrend: '0',
        warehouseTotalUnits: 0,
        warehouseCapacityHint: '0/0',
        onSiteResourceLines: 0,
        onSiteHint: '0',
        assignedEmployeeCount: 0,
        employeeCount: 0,
        employeeCapacityHint: '0/0',
        payrollLabel: '0',
        priceIndexLabel: '1.00',
        priceIndexHint: 'stabil',
        corporateTaxRateLabel: '20 %',
        taxTrendLabel: 'ok',
        taxPaymentBlocked: false,
        runningProductionCount: 0,
        productionHint: '0',
        activeResearchCount: 0,
        researchHint: '0',
        completedMilestoneCount: 0,
        milestoneHint: '0',
        activeContractCount: 0,
        economyHint: '0',
        taxIntervalTicks: 10,
      },
      overview: { cards: [] },
      inventoryItems: [],
      financeTransactions: [],
      productionJobs: [],
      researchJobs: [],
      transportOrders: [],
      completedResearchLabels: [],
      detail: {
        hasFinance: false,
        hasLogistics: false,
        hasEnergy: false,
        currency: 'GC',
        companyEntries: [],
        financeEntries: [],
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
    },
    regions: [],
    navigation: { screen: 'company', entitySelection: { kind: 'none' } },
    navigateToTarget: vi.fn(),
    navigateToScreen: vi.fn(),
    clearEntitySelection: vi.fn(),
  }),
}));

vi.mock('@/presentation/hooks/useScreenQuery', () => ({
  TICK_QUERY_DEBOUNCE_MS: 250,
  useScreenQuery: () => ({
    data: [],
    isLoading: false,
    errorMessage: null,
  }),
}));

describe('ExecutiveDashboardScreen', () => {
  it('renders executive dashboard widgets from runtime view-data', () => {
    renderPresentation(<ExecutiveDashboardScreen onOpenOperations={() => {}} />);

    expect(screen.getByText('Test Corp')).toBeInTheDocument();
    expect(screen.getByText('Executive Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Finanzen')).toBeInTheDocument();
    expect(screen.getByText('Unternehmen')).toBeInTheDocument();
    expect(screen.getByLabelText('Kernkennzahlen')).toBeInTheDocument();
  });
});
