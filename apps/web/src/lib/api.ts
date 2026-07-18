/** API read models consumed by the Next.js dashboard shell. */

export type CompanyReadModel = {
  readonly id: string;
  readonly name: string;
  readonly ownerId: string;
  readonly status: string;
};

export type FinanceReadModel = {
  readonly id: string;
  readonly companyId: string;
  readonly currency: string;
  readonly cashBalance: number;
  readonly reservedCash: number;
  readonly availableCash: number;
};

export type FinanceTransactionReadModel = {
  readonly id: string;
  readonly financeId: string;
  readonly companyId: string;
  readonly transactionType: string;
  readonly direction: string;
  readonly amount: number;
  readonly balanceBefore: number;
  readonly balanceAfter: number;
  readonly reservedCashDelta: number;
  readonly timestamp: number;
};

export type InventoryItemReadModel = {
  readonly resourceId: string;
  readonly quantity: number;
  readonly reserved: number;
  readonly available: number;
};

export type InventoryReadModel = {
  readonly items: readonly InventoryItemReadModel[];
};

export type BuildingReadModel = {
  readonly id: string;
  readonly buildingTypeId: string;
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly status: string;
  readonly constructionProgress: number;
  readonly constructionDuration: number;
};

export type MarketPriceReadModel = {
  readonly resourceId: string;
  readonly basePrice: number;
  readonly lastPrice: number;
  readonly tradeVolume: number;
  readonly updatedAt: number;
  readonly totalSupply: number;
  readonly baselineDemand: number;
  readonly pressureIndex: number;
  readonly changeFromBase: number;
  readonly changePercent: number;
  readonly trend: 'UP' | 'DOWN' | 'STABLE';
};

export type MilestoneCatalogEntry = {
  readonly id: string;
  readonly name: string;
  readonly completed: boolean;
};

export type ProductionJobSessionReadModel = {
  readonly id: string;
  readonly buildingId: string;
  readonly recipeId: string;
  readonly status: string;
  readonly progress: number;
  readonly awaitingTransport: boolean;
  readonly activeTransportCount: number;
};

export type ResearchJobSessionReadModel = {
  readonly id: string;
  readonly technologyId: string;
  readonly status: string;
  readonly progress: number;
};

export type EmployeeSessionReadModel = {
  readonly id: string;
  readonly employeeTypeId: string;
  readonly displayName: string;
  readonly salary: number;
  readonly productivity: number;
  readonly hiredAt: number;
  readonly status: string;
  readonly assignedBuildingId: string | null;
  readonly assignedBuildingName: string | null;
};

export type TransportOrderSessionReadModel = {
  readonly id: string;
  readonly resourceId: string;
  readonly amount: number;
  readonly status: string;
  readonly progress: number;
  readonly sourceBuildingId: string;
  readonly sourceBuildingName: string;
  readonly destinationBuildingId: string;
  readonly destinationBuildingName: string;
  readonly productionJobId: string;
  readonly recipeId: string | null;
  readonly recipeName: string | null;
};

export type WarehouseStorageItemReadModel = {
  readonly resourceId: string;
  readonly quantity: number;
  readonly reserved: number;
  readonly available: number;
};

export type WarehouseStorageReadModel = {
  readonly buildingId: string;
  readonly buildingName: string;
  readonly items: readonly WarehouseStorageItemReadModel[];
};

export type LogisticsSummaryReadModel = {
  readonly hasActiveWarehouse: boolean;
  readonly activeTransportCount: number;
  readonly waitingProductionCount: number;
  readonly warehouseResourceLines: number;
  readonly warehouseTotalUnits: number;
  readonly statusMessage: string | null;
};

export type DashboardKpiReadModel = {
  readonly availableCash: number;
  readonly energyReserve: number;
  readonly energyHasDeficit: boolean;
  readonly activeTransportCount: number;
  readonly warehouseTotalUnits: number;
  readonly onSiteResourceLines: number;
  readonly employeeCount: number;
  readonly assignedEmployeeCount: number;
  readonly payrollPerInterval: number;
};

export type TickMarketPriceSnapshot = {
  readonly resourceId: string;
  readonly lastPrice: number;
  readonly totalSupply: number;
  readonly baselineDemand: number;
  readonly pressureIndex: number;
};

export type TickMetricsSnapshot = {
  readonly tickNumber: number;
  readonly simulationTime: number;
  readonly availableCash: number;
  readonly energyReserve: number;
  readonly energyGeneration: number;
  readonly energyConsumption: number;
  readonly activeTransportCount: number;
  readonly warehouseTotalUnits: number;
  readonly onSiteTotalUnits: number;
  readonly marketPrices: readonly TickMarketPriceSnapshot[];
};

export type DashboardTickHistory = {
  readonly companyId: string | null;
  readonly points: readonly TickMetricsSnapshot[];
};

export type ContentNameEntry = {
  readonly id: string;
  readonly name: string;
};

export type EnergyReadModel = {
  readonly generation: number;
  readonly consumption: number;
  readonly reserve: number;
  readonly hasDeficit: boolean;
  readonly usesBaselineGrid: boolean;
};

export type PlaceBuildingHint = {
  readonly buildingTypeId: string;
  readonly name: string;
  readonly category: string;
  readonly canPlace: boolean;
  readonly reason: string | null;
};

export type ProductionHint = {
  readonly recipeId: string;
  readonly recipeName: string;
  readonly buildingId: string;
  readonly buildingName: string;
  readonly canStart: boolean;
  readonly reason: string | null;
};

export type ResearchHint = {
  readonly technologyId: string;
  readonly name: string;
  readonly canStart: boolean;
  readonly reason: string | null;
};

export type HireEmployeeHint = {
  readonly employeeTypeId: string;
  readonly name: string;
  readonly category: string;
  readonly cost: number;
  readonly defaultDisplayName: string;
  readonly canHire: boolean;
  readonly reason: string | null;
};

export type AssignEmployeeHint = {
  readonly employeeId: string;
  readonly employeeName: string;
  readonly buildingId: string;
  readonly buildingName: string;
  readonly canAssign: boolean;
  readonly reason: string | null;
};

export type MarketTradeHint = {
  readonly resourceId: string;
  readonly name: string;
  readonly tradeAmount: number;
  readonly canBuy: boolean;
  readonly canSell: boolean;
  readonly buyReason: string | null;
  readonly sellReason: string | null;
};

export type GameSessionDashboardHints = {
  readonly placeBuilding: readonly PlaceBuildingHint[];
  readonly production: readonly ProductionHint[];
  readonly research: readonly ResearchHint[];
  readonly market: readonly MarketTradeHint[];
  readonly hireEmployee: readonly HireEmployeeHint[];
  readonly assignEmployee: readonly AssignEmployeeHint[];
};

export type TutorialStepReadModel = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
};

export type TutorialProgressReadModel = {
  readonly steps: readonly TutorialStepReadModel[];
  readonly activeStepId: string | null;
  readonly completed: boolean;
};

export type GameSessionContentNames = {
  readonly resources: readonly ContentNameEntry[];
  readonly buildings: readonly ContentNameEntry[];
  readonly recipes: readonly ContentNameEntry[];
  readonly technologies: readonly ContentNameEntry[];
  readonly employees: readonly ContentNameEntry[];
};

export type GameSessionDashboard = {
  readonly tickNumber: number;
  readonly simulationTime: number;
  readonly company: CompanyReadModel | null;
  readonly finance: FinanceReadModel | null;
  readonly financeTransactions: readonly FinanceTransactionReadModel[];
  readonly inventory: InventoryReadModel | null;
  readonly warehouseStorage: readonly WarehouseStorageReadModel[];
  readonly buildings: readonly BuildingReadModel[];
  readonly marketPrices: readonly MarketPriceReadModel[];
  readonly milestones: readonly MilestoneCatalogEntry[];
  readonly completedMilestones: readonly string[];
  readonly completedResearch: readonly string[];
  readonly productionJobs: readonly ProductionJobSessionReadModel[];
  readonly transportOrders: readonly TransportOrderSessionReadModel[];
  readonly researchJobs: readonly ResearchJobSessionReadModel[];
  readonly employees: readonly EmployeeSessionReadModel[];
  readonly contentNames: GameSessionContentNames;
  readonly energy: EnergyReadModel | null;
  readonly logistics: LogisticsSummaryReadModel | null;
  readonly kpis: DashboardKpiReadModel | null;
  readonly hints: GameSessionDashboardHints;
  readonly tutorial: TutorialProgressReadModel | null;
};

type ApiSuccessResponse<T> = {
  readonly ok: true;
  readonly data: T;
};

type ApiErrorResponse = {
  readonly ok: false;
  readonly error: string;
};

/** Calls a JSON API route and unwraps the browser shell envelope. */
export async function callApi<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const payload = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;

  if (!response.ok || payload.ok === false) {
    throw new Error(payload.ok === false ? payload.error : 'Request failed.');
  }

  return payload.data;
}

/** Loads the aggregated dashboard snapshot. */
export function fetchDashboard(): Promise<GameSessionDashboard> {
  return callApi<GameSessionDashboard>('/api/dashboard');
}

export type FetchDashboardHistoryOptions = {
  readonly fromTick?: number;
  readonly toTick?: number;
  readonly limit?: number;
};

/** Loads tick metrics history for dashboard charts. */
export function fetchDashboardHistory(
  options: FetchDashboardHistoryOptions = {},
): Promise<DashboardTickHistory> {
  const params = new URLSearchParams();

  if (options.fromTick !== undefined) {
    params.set('fromTick', String(options.fromTick));
  }

  if (options.toTick !== undefined) {
    params.set('toTick', String(options.toTick));
  }

  if (options.limit !== undefined) {
    params.set('limit', String(options.limit));
  }

  const query = params.toString();
  const path = query.length > 0 ? `/api/dashboard/history?${query}` : '/api/dashboard/history';

  return callApi<DashboardTickHistory>(path);
}

/** Builds a lookup map from content name entries. */
export function buildNameMap(entries: readonly ContentNameEntry[]): ReadonlyMap<string, string> {
  return new Map(entries.map((entry) => [entry.id, entry.name]));
}

