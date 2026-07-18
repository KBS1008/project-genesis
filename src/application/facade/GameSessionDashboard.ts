/**
 * @module @application/facade/GameSessionDashboard
 *
 * Aggregated read model for the browser dashboard shell.
 */

import type { BuildingReadModel } from '../read-models/BuildingReadModel.js';
import type { CompanyReadModel } from '../read-models/CompanyReadModel.js';
import type { FinanceReadModel } from '../read-models/FinanceReadModel.js';
import type { FinanceTransactionReadModel } from '../read-models/FinanceTransactionReadModel.js';
import type { InventoryReadModel } from '../read-models/InventoryReadModel.js';
import type { MarketPriceReadModel } from '../read-models/MarketPriceReadModel.js';
import type { WarehouseStorageReadModel } from '../read-models/WarehouseStorageReadModel.js';
import type { EconomyReadModel } from '../read-models/EconomyReadModel.js';

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
  readonly awaitingTransport: boolean;
  readonly activeTransportCount: number;
};

/** Research job summary for the browser dashboard. */
export type ResearchJobSessionReadModel = {
  readonly id: string;
  readonly technologyId: string;
  readonly status: string;
  readonly progress: number;
};

/** Employee summary for the browser dashboard. */
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

/** Transport order summary for the browser dashboard. */
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

/** Content id/name pair for UI labels. */
export type ContentNameEntry = {
  readonly id: string;
  readonly name: string;
};

/** High-level logistics summary for dashboard KPIs and status banners. */
export type LogisticsSummaryReadModel = {
  readonly hasActiveWarehouse: boolean;
  readonly activeTransportCount: number;
  readonly waitingProductionCount: number;
  readonly warehouseResourceLines: number;
  readonly warehouseTotalUnits: number;
  readonly statusMessage: string | null;
};

/** KPI strip shown above the dashboard grid. */
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
  readonly corporateTaxRate: number;
  readonly taxIntervalTicks: number;
  readonly priceIndex: number;
  readonly activeContractCount: number;
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

/** Hint for hiring an employee type. */
export type HireEmployeeHint = {
  readonly employeeTypeId: string;
  readonly name: string;
  readonly category: string;
  readonly cost: number;
  readonly defaultDisplayName: string;
  readonly canHire: boolean;
  readonly reason: string | null;
};

/** Hint for assigning an employee to a building. */
export type AssignEmployeeHint = {
  readonly employeeId: string;
  readonly employeeName: string;
  readonly buildingId: string;
  readonly buildingName: string;
  readonly canAssign: boolean;
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
  readonly hireEmployee: readonly HireEmployeeHint[];
  readonly assignEmployee: readonly AssignEmployeeHint[];
};

/** Single step in the first-play tutorial checklist. */
export type TutorialStepReadModel = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
};

/** Guided first-play progress derived from live session state. */
export type TutorialProgressReadModel = {
  readonly steps: readonly TutorialStepReadModel[];
  readonly activeStepId: string | null;
  readonly completed: boolean;
};

/** Content display names grouped by type. */
export type GameSessionContentNames = {
  readonly resources: readonly ContentNameEntry[];
  readonly buildings: readonly ContentNameEntry[];
  readonly recipes: readonly ContentNameEntry[];
  readonly technologies: readonly ContentNameEntry[];
  readonly employees: readonly ContentNameEntry[];
};

/** Snapshot of session state rendered by the UI shell. */
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
  readonly economy: EconomyReadModel | null;
  readonly hints: GameSessionDashboardHints;
  readonly tutorial: TutorialProgressReadModel | null;
};

