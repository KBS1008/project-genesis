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

/** Snapshot of session state rendered by the UI shell. */
export type GameSessionDashboard = {
  readonly tickNumber: number;
  readonly simulationTime: number;
  readonly company: CompanyReadModel | null;
  readonly finance: FinanceReadModel | null;
  readonly inventory: InventoryReadModel | null;
  readonly buildings: readonly BuildingReadModel[];
  readonly marketPrices: readonly MarketPriceReadModel[];
  readonly completedMilestones: readonly string[];
};
