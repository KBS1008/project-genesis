/** Immutable presentation view-data for session and simulation state. */

export type SessionStatusViewData = {
  readonly hasGame: boolean;
  readonly companyId: string | null;
  readonly companyName: string | null;
  readonly playerId: string | null;
  readonly savePath: string;
};

export type SimulationStatusViewData = {
  readonly tickNumber: number | null;
  readonly simulationTime: number | null;
  readonly isPaused: boolean;
  readonly speedMultiplier: number;
  readonly hasActiveSession: boolean;
  readonly speedLabel: string;
};

export type SaveSlotViewData = {
  readonly fileName: string;
  readonly filePath: string;
  readonly schemaVersionLabel: string;
  readonly tickLabel: string;
  readonly companyName: string;
  readonly modifiedAtLabel: string;
};

export type WorldRegionViewData = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly biomeId: string;
  readonly mapPositionLabel: string;
  readonly neighborCount: number;
  readonly cityCount: number;
};

export type WorldOverviewViewData = {
  readonly worldName: string;
  readonly regionCountLabel: string;
  readonly cityCountLabel: string;
  readonly regions: readonly WorldRegionViewData[];
};

export type RegionDetailViewData = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly biomeId: string;
  readonly resources: readonly { readonly label: string; readonly amountLabel: string }[];
  readonly cities: readonly { readonly id: string; readonly name: string; readonly category: string }[];
};

export type MarketRowViewData = {
  readonly resourceId: string;
  readonly resourceLabel: string;
  readonly lastPriceLabel: string;
  readonly trendLabel: string;
  readonly pressureLabel: string;
};

export type JobRowViewData = {
  readonly id: string;
  readonly title: string;
  readonly statusLabel: string;
  readonly progressLabel: string;
};

export type FinanceRowViewData = {
  readonly id: string;
  readonly typeLabel: string;
  readonly amountLabel: string;
  readonly balanceLabel: string;
};

export type EventLogRowViewData = {
  readonly id: string;
  readonly tickLabel: string;
  readonly category: string;
  readonly message: string;
  readonly severity: 'INFO' | 'WARNING' | 'ERROR';
};

export type WorkspaceViewData = {
  readonly session: SessionStatusViewData;
  readonly simulation: SimulationStatusViewData;
  readonly world: WorldOverviewViewData | null;
  readonly saves: readonly SaveSlotViewData[];
};
