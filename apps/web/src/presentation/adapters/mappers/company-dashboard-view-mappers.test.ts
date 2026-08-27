import { describe, expect, it } from 'vitest';
import type { GameSessionDashboard } from '@/presentation/adapters/api/client';
import { buildCompanyDashboardViewData } from '@/presentation/adapters/mappers/company-dashboard-view-mappers';

function createDashboardFixture(): GameSessionDashboard {
  return {
    tickNumber: 5,
    simulationTime: 120,
    company: {
      id: 'company_001',
      name: 'Acme Industries',
      ownerId: 'player_001',
      status: 'ACTIVE',
    },
    finance: {
      id: 'finance_001',
      companyId: 'company_001',
      currency: 'GC',
      cashBalance: 1000,
      reservedCash: 0,
      availableCash: 1000,
    },
    inventory: { items: [] },
    contentNames: {
      resources: [],
      buildings: [],
      recipes: [],
      technologies: [],
      employees: [],
    },
    buildings: [],
    employees: [],
    productionJobs: [],
    researchJobs: [],
    transportOrders: [
      {
        id: 'transport_001',
        resourceId: 'wood',
        amount: 10,
        status: 'IN_TRANSIT',
        progress: 0.5,
        sourceBuildingId: 'building_a',
        sourceBuildingName: 'Sägewerk',
        destinationBuildingId: 'building_b',
        destinationBuildingName: 'Werk',
        productionJobId: 'job_001',
        recipeId: 'recipe_001',
        recipeName: 'Bretter',
        durationTicks: 4,
        routeId: null,
      },
    ],
    marketPrices: [],
    financeTransactions: [],
    warehouseStorage: [],
    milestones: [],
    completedMilestones: [],
    completedResearch: [],
    kpis: {
      availableCash: 1000,
      energyReserve: 100,
      energyHasDeficit: false,
      activeTransportCount: 1,
      warehouseTotalUnits: 0,
      warehouseStorageCapacity: 0,
      warehouseUsedCapacity: 0,
      onSiteResourceLines: 0,
      employeeCount: 0,
      assignedEmployeeCount: 0,
      payrollPerInterval: 0,
      corporateTaxRate: 0.15,
      taxIntervalTicks: 10,
      priceIndex: 1,
      pendingTaxAmount: 0,
      taxPaymentBlocked: false,
      activeContractCount: 0,
    },
    energy: null,
    logistics: null,
    economy: null,
    hints: {
      placeBuilding: [],
      production: [],
      research: [],
      market: [],
      hireEmployee: [],
      assignEmployee: [],
    },
    tutorial: null,
    recipeCatalog: [],
  };
}

describe('company-dashboard-view-mappers', () => {
  it('uses empty-state route labels instead of visible fallback copy', () => {
    const viewData = buildCompanyDashboardViewData(createDashboardFixture(), []);
    const transportDetail = viewData.detail.transportOrders.get('transport_001');

    expect(transportDetail).not.toBeNull();
    expect(transportDetail?.entries.some(([label, value]) => label === 'Route-ID' && value === '—')).toBe(
      true,
    );
    expect(transportDetail?.entries.some(([, value]) => value === 'Fallback')).toBe(false);
  });
});
