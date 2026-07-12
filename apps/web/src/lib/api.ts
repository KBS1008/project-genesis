/** API read models consumed by the Next.js dashboard shell. */

export type CompanyReadModel = {
  readonly id: string;
  readonly name: string;
  readonly ownerId: string;
  readonly status: string;
};

export type FinanceReadModel = {
  readonly cashBalance: number;
  readonly reservedCash: number;
  readonly availableCash: number;
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
  readonly lastPrice: number;
  readonly tradeVolume: number;
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
};

export type ResearchJobSessionReadModel = {
  readonly id: string;
  readonly technologyId: string;
  readonly status: string;
  readonly progress: number;
};

export type GameSessionAvailableActions = {
  readonly canPlaceWarehouse: boolean;
  readonly canStartPlanksProduction: boolean;
  readonly canStartAdvancedPlanksProduction: boolean;
  readonly canStartWoodworkingResearch: boolean;
};

export type GameSessionDashboard = {
  readonly tickNumber: number;
  readonly simulationTime: number;
  readonly company: CompanyReadModel | null;
  readonly finance: FinanceReadModel | null;
  readonly inventory: InventoryReadModel | null;
  readonly buildings: readonly BuildingReadModel[];
  readonly marketPrices: readonly MarketPriceReadModel[];
  readonly milestones: readonly MilestoneCatalogEntry[];
  readonly completedMilestones: readonly string[];
  readonly completedResearch: readonly string[];
  readonly productionJobs: readonly ProductionJobSessionReadModel[];
  readonly researchJobs: readonly ResearchJobSessionReadModel[];
  readonly availableActions: GameSessionAvailableActions;
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
