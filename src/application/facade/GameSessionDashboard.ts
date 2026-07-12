/**
 * @module @application/facade/GameSessionDashboard
 *
 * Aggregated read model for the browser dashboard shell.
 */

import type { BuildingReadModel } from '../read-models/BuildingReadModel.js';
import type { CompanyReadModel } from '../read-models/CompanyReadModel.js';
import type { FinanceReadModel } from '../read-models/FinanceReadModel.js';
import type { InventoryReadModel } from '../read-models/InventoryReadModel.js';
import type { MarketPriceReadModel } from '../read-models/MarketPriceReadModel.js';

/** Milestone catalog entry with completion state for the UI shell. */
export type MilestoneCatalogEntry = {
  readonly id: string;
  readonly name: string;
  readonly completed: boolean;
};

/** Production job summary for the browser dashboard. */
export type ProductionJobSessionReadModel = {
  readonly id: string;
  readonly buildingId: string;
  readonly recipeId: string;
  readonly status: string;
  readonly progress: number;
};

/** Research job summary for the browser dashboard. */
export type ResearchJobSessionReadModel = {
  readonly id: string;
  readonly technologyId: string;
  readonly status: string;
  readonly progress: number;
};

/** Transport order summary for the browser dashboard. */
export type TransportOrderSessionReadModel = {
  readonly id: string;
  readonly resourceId: string;
  readonly amount: number;
  readonly status: string;
  readonly progress: number;
  readonly sourceBuildingId: string;
  readonly destinationBuildingId: string;
  readonly productionJobId: string;
};

/** Content id/name pair for UI labels. */
export type ContentNameEntry = {
  readonly id: string;
  readonly name: string;
};

/** Energy balance summary for the dashboard. */
export type EnergyReadModel = {
  readonly generation: number;
  readonly consumption: number;
  readonly reserve: number;
  readonly hasDeficit: boolean;
  readonly usesBaselineGrid: boolean;
};

/** Hint for placing a building type. */
export type PlaceBuildingHint = {
  readonly buildingTypeId: string;
  readonly name: string;
  readonly category: string;
  readonly canPlace: boolean;
  readonly reason: string | null;
};

/** Hint for starting production on a building. */
export type ProductionHint = {
  readonly recipeId: string;
  readonly recipeName: string;
  readonly buildingId: string;
  readonly buildingName: string;
  readonly canStart: boolean;
  readonly reason: string | null;
};

/** Hint for starting research. */
export type ResearchHint = {
  readonly technologyId: string;
  readonly name: string;
  readonly canStart: boolean;
  readonly reason: string | null;
};

/** Hint for market buy/sell actions. */
export type MarketTradeHint = {
  readonly resourceId: string;
  readonly name: string;
  readonly tradeAmount: number;
  readonly canBuy: boolean;
  readonly canSell: boolean;
  readonly buyReason: string | null;
  readonly sellReason: string | null;
};

/** Content-driven action hints for the dashboard toolbar. */
export type GameSessionDashboardHints = {
  readonly placeBuilding: readonly PlaceBuildingHint[];
  readonly production: readonly ProductionHint[];
  readonly research: readonly ResearchHint[];
  readonly market: readonly MarketTradeHint[];
};

/** Content display names grouped by type. */
export type GameSessionContentNames = {
  readonly resources: readonly ContentNameEntry[];
  readonly buildings: readonly ContentNameEntry[];
  readonly recipes: readonly ContentNameEntry[];
  readonly technologies: readonly ContentNameEntry[];
};

/** Snapshot of session state rendered by the UI shell. */
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
  readonly transportOrders: readonly TransportOrderSessionReadModel[];
  readonly researchJobs: readonly ResearchJobSessionReadModel[];
  readonly contentNames: GameSessionContentNames;
  readonly energy: EnergyReadModel | null;
  readonly hints: GameSessionDashboardHints;
};

