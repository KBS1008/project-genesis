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

/** Action availability hints for toolbar button states. */
export type GameSessionAvailableActions = {
  readonly canPlaceWarehouse: boolean;
  readonly canStartPlanksProduction: boolean;
  readonly canStartAdvancedPlanksProduction: boolean;
  readonly canStartWoodworkingResearch: boolean;
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
  readonly researchJobs: readonly ResearchJobSessionReadModel[];
  readonly availableActions: GameSessionAvailableActions;
};
