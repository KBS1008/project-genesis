import { describe, expect, it, vi, beforeEach } from 'vitest';
import { refreshWorkspaceScopes } from '@/presentation/adapters/queries/refresh-workspace-scopes';

const fetchDashboard = vi.fn();
const fetchDashboardHistory = vi.fn();
const fetchSimulationStatus = vi.fn();
const fetchSessionStatus = vi.fn();
const fetchSaveList = vi.fn();

vi.mock('@/presentation/adapters/api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/presentation/adapters/api/client')>();

  return {
    ...actual,
    fetchDashboard: (...args: unknown[]) => fetchDashboard(...args),
    fetchDashboardHistory: (...args: unknown[]) => fetchDashboardHistory(...args),
  };
});

vi.mock('@/presentation/adapters/api/query-client', () => ({
  fetchSimulationStatus: (...args: unknown[]) => fetchSimulationStatus(...args),
  fetchSessionStatus: (...args: unknown[]) => fetchSessionStatus(...args),
  fetchSaveList: (...args: unknown[]) => fetchSaveList(...args),
  fetchWorldOverview: vi.fn(),
  fetchRegionList: vi.fn(),
}));

describe('refreshWorkspaceScopes', () => {
  beforeEach(() => {
    fetchDashboard.mockReset();
    fetchDashboardHistory.mockReset();
    fetchSimulationStatus.mockReset();
    fetchSessionStatus.mockReset();
    fetchSaveList.mockReset();
  });

  it('loads only dashboard slices for dashboard scope', async () => {
    fetchDashboard.mockResolvedValue({
      tickNumber: 5,
      simulationTime: 120,
      company: { id: 'c1', name: 'Test Corp', ownerId: 'p1', status: 'ACTIVE' },
      finance: null,
      inventory: { items: [] },
      buildings: [],
      productionJobs: [],
      transportOrders: [],
      researchJobs: [],
      employees: [],
      contentNames: {
        resources: [],
        buildings: [],
        recipes: [],
        technologies: [],
        employees: [],
      },
      marketPrices: [],
      financeTransactions: [],
      warehouseStorage: [],
      milestones: [],
      completedMilestones: [],
      completedResearch: [],
      kpis: {
        availableCash: 0,
        energyReserve: 0,
        energyHasDeficit: false,
        activeTransportCount: 0,
        warehouseTotalUnits: 0,
        warehouseStorageCapacity: 0,
        warehouseUsedCapacity: 0,
        onSiteResourceLines: 0,
        employeeCount: 0,
        assignedEmployeeCount: 0,
        payrollPerInterval: 0,
        corporateTaxRate: 0,
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
        production: [],
        research: [],
        market: [],
        placeBuilding: [],
        hireEmployee: [],
        assignEmployee: [],
      },
      tutorial: null,
      notifications: [],
    });
    fetchDashboardHistory.mockResolvedValue({ points: [] });

    const result = await refreshWorkspaceScopes({
      scopes: ['workspace.dashboard'],
      currentSession: {
        hasGame: true,
        companyId: 'c1',
        companyName: 'Test Corp',
        playerId: 'p1',
        savePath: 'saves/browser-session.json',
      },
      currentSimulation: {
        tickNumber: 1,
        simulationTime: 10,
        isPaused: false,
        speedMultiplier: 1,
        hasActiveSession: true,
        speedLabel: '×1',
      },
      currentWorld: null,
      currentSaves: [],
      currentRegions: [],
    });

    expect(result.dashboard).toBeDefined();
    expect(result.companyViewData).toBeDefined();
    expect(fetchSimulationStatus).not.toHaveBeenCalled();
    expect(fetchSaveList).not.toHaveBeenCalled();
  });

  it('loads session status for session scope only', async () => {
    fetchSimulationStatus.mockResolvedValue({
      tickNumber: 3,
      simulationTime: 30,
      isPaused: false,
      tickDuration: 2,
      hasActiveSession: true,
    });
    fetchSessionStatus.mockResolvedValue({
      hasActiveSession: true,
      companyId: 'c1',
      companyName: 'Test Corp',
      playerId: 'p1',
      savePath: 'saves/browser-session.json',
    });

    const result = await refreshWorkspaceScopes({
      scopes: ['workspace.session'],
      currentSession: {
        hasGame: true,
        companyId: 'c1',
        companyName: 'Test Corp',
        playerId: 'p1',
        savePath: 'saves/browser-session.json',
      },
      currentSimulation: {
        tickNumber: 1,
        simulationTime: 10,
        isPaused: false,
        speedMultiplier: 1,
        hasActiveSession: true,
        speedLabel: '×1',
      },
      currentWorld: null,
      currentSaves: [],
      currentRegions: [],
    });

    expect(result.simulation?.tickNumber).toBe(3);
    expect(result.session?.companyName).toBe('Test Corp');
    expect(fetchDashboard).not.toHaveBeenCalled();
  });
});
