/**
 * @module @application/persistence/GameSaveSnapshotV1
 *
 * Version 1 savegame snapshot schema for deterministic session restore.
 *
 * @see docs/decisions/DD-033-Savegame-and-Persistence-Strategy.md
 */

/** Supported savegame schema version. */
export const GAME_SAVE_SCHEMA_VERSION = 1 as const;

/** Simulation metadata captured at save time. */
export type GameSaveSimulationSnapshotV1 = {
  readonly clockTime: number;
  readonly tickNumber: number;
  readonly paused: boolean;
  readonly tickDuration: number;
};

/** Persisted company aggregate state. */
export type GameSaveCompanySnapshotV1 = {
  readonly id: string;
  readonly name: string;
  readonly ownerId: string;
  readonly foundedAt: number;
  readonly status: string;
};

/** Persisted building aggregate state. */
export type GameSaveBuildingSnapshotV1 = {
  readonly id: string;
  readonly buildingTypeId: string;
  readonly companyId: string;
  readonly name: string;
  readonly position: { readonly x: number; readonly y: number };
  readonly level: number;
  readonly createdAt: number;
  readonly status: string;
  readonly constructionDuration: number;
  readonly constructionProgress: number;
  readonly constructionStartTime: number | undefined;
  readonly constructionEndTime: number | undefined;
};

/** Persisted inventory line state. */
export type GameSaveInventoryItemSnapshotV1 = {
  readonly resourceId: string;
  readonly quantity: number;
  readonly reserved: number;
};

/** Persisted inventory aggregate state. */
export type GameSaveInventorySnapshotV1 = {
  readonly id: string;
  readonly companyId: string;
  readonly createdAt: number;
  readonly status: string;
  readonly items: readonly GameSaveInventoryItemSnapshotV1[];
};

/** Persisted finance transaction state. */
export type GameSaveFinanceTransactionSnapshotV1 = {
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

/** Persisted finance account aggregate state. */
export type GameSaveFinanceAccountSnapshotV1 = {
  readonly id: string;
  readonly companyId: string;
  readonly currency: string;
  readonly createdAt: number;
  readonly cashBalance: number;
  readonly reservedCash: number;
  readonly transactionSequence: number;
  readonly transactions: readonly GameSaveFinanceTransactionSnapshotV1[];
};

/** Persisted market price line state. */
export type GameSaveMarketPriceSnapshotV1 = {
  readonly resourceId: string;
  readonly basePrice: number;
  readonly lastPrice: number;
  readonly tradeVolume: number;
  readonly updatedAt: number;
};

/** Persisted market aggregate state. */
export type GameSaveMarketSnapshotV1 = {
  readonly id: string;
  readonly createdAt: number;
  readonly prices: readonly GameSaveMarketPriceSnapshotV1[];
};

/** Persisted production job aggregate state. */
export type GameSaveProductionJobSnapshotV1 = {
  readonly id: string;
  readonly buildingId: string;
  readonly companyId: string;
  readonly recipeId: string;
  readonly duration: number;
  readonly status: string;
  readonly progress: number;
  readonly createdAt: number;
  readonly startTime: number | undefined;
  readonly endTime: number | undefined;
};

/** Persisted research job aggregate state. */
export type GameSaveResearchJobSnapshotV1 = {
  readonly id: string;
  readonly companyId: string;
  readonly technologyId: string;
  readonly duration: number;
  readonly cost: number;
  readonly status: string;
  readonly progress: number;
  readonly createdAt: number;
  readonly startTime: number | undefined;
  readonly endTime: number | undefined;
};

/** Persisted company research aggregate state. */
export type GameSaveCompanyResearchSnapshotV1 = {
  readonly id: string;
  readonly companyId: string;
  readonly createdAt: number;
  readonly completedTechnologies: readonly string[];
};

/** Persisted company milestones aggregate state. */
export type GameSaveCompanyMilestonesSnapshotV1 = {
  readonly id: string;
  readonly companyId: string;
  readonly createdAt: number;
  readonly completedMilestones: readonly string[];
};

/** Persisted warehouse storage state. */
export type GameSaveBuildingStorageSnapshotV1 = {
  readonly buildingId: string;
  readonly companyId: string;
  readonly items: readonly GameSaveInventoryItemSnapshotV1[];
};

/** Persisted transport order state. */
export type GameSaveTransportOrderSnapshotV1 = {
  readonly id: string;
  readonly companyId: string;
  readonly sourceBuildingId: string;
  readonly destinationBuildingId: string;
  readonly resourceId: string;
  readonly amount: number;
  readonly duration: number;
  readonly productionJobId: string;
  readonly createdAt: number;
  readonly status: string;
  readonly startTime: number;
  readonly endTime: number | undefined;
  readonly progress: number;
};

/** Persisted employee aggregate state. */
export type GameSaveEmployeeSnapshotV1 = {
  readonly id: string;
  readonly companyId: string;
  readonly employeeTypeId: string;
  readonly displayName: string;
  readonly salary: number;
  readonly productivity: number;
  readonly hiredAt: number;
  readonly status: string;
  readonly assignedBuildingId: string | undefined;
};

/** Persisted dashboard tick metrics for chart history. */
export type GameSaveTickMetricsSnapshotV1 = {
  readonly tickNumber: number;
  readonly simulationTime: number;
  readonly availableCash: number;
  readonly energyReserve: number;
  readonly activeTransportCount: number;
  readonly warehouseTotalUnits?: number;
  readonly onSiteTotalUnits?: number;
  readonly energyGeneration?: number;
  readonly energyConsumption?: number;
  readonly marketPrices?: readonly {
    readonly resourceId: string;
    readonly lastPrice: number;
    readonly totalSupply?: number;
    readonly baselineDemand?: number;
    readonly pressureIndex?: number;
  }[];
};

/** Persisted tick metrics history for one company. */
export type GameSaveTickMetricsHistorySnapshotV1 = {
  readonly companyId: string;
  readonly points: readonly GameSaveTickMetricsSnapshotV1[];
};

/** Full deterministic game session snapshot. */
export type GameSaveSnapshotV1 = {
  readonly schemaVersion: typeof GAME_SAVE_SCHEMA_VERSION;
  readonly savedAtUtc: string;
  readonly simulation: GameSaveSimulationSnapshotV1;
  readonly companies: readonly GameSaveCompanySnapshotV1[];
  readonly buildings: readonly GameSaveBuildingSnapshotV1[];
  readonly inventories: readonly GameSaveInventorySnapshotV1[];
  readonly financeAccounts: readonly GameSaveFinanceAccountSnapshotV1[];
  readonly markets: readonly GameSaveMarketSnapshotV1[];
  readonly productionJobs: readonly GameSaveProductionJobSnapshotV1[];
  readonly researchJobs: readonly GameSaveResearchJobSnapshotV1[];
  readonly companyResearch: readonly GameSaveCompanyResearchSnapshotV1[];
  readonly companyMilestones: readonly GameSaveCompanyMilestonesSnapshotV1[];
  readonly buildingStorages: readonly GameSaveBuildingStorageSnapshotV1[];
  readonly transportOrders: readonly GameSaveTransportOrderSnapshotV1[];
  readonly employees: readonly GameSaveEmployeeSnapshotV1[];
  readonly tickMetricsHistory?: GameSaveTickMetricsHistorySnapshotV1;
};
