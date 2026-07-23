/** Immutable view-data for the Phase 6 company overview screen. */

import type {
  BuildingListRowViewData,
  FinanceTransactionRowViewData,
  InventoryItemRowViewData,
  OverviewCardViewData,
} from '@/presentation/adapters/view-data/company-dashboard-view-data';

export type RegionalPresenceRowViewData = {
  readonly regionId: string;
  readonly regionName: string;
  readonly buildingCount: number;
  readonly buildingSummary: string;
};

export type CompanyOverviewViewData = {
  readonly companyName: string;
  readonly headerSubtitle: string;
  readonly overviewCards: readonly OverviewCardViewData[];
  readonly inventoryItems: readonly InventoryItemRowViewData[];
  readonly financeSummary: readonly { readonly label: string; readonly value: string }[];
  readonly recentTransactions: readonly FinanceTransactionRowViewData[];
  readonly buildings: readonly BuildingListRowViewData[];
  readonly regionalPresence: readonly RegionalPresenceRowViewData[];
  readonly activeProductionCount: number;
  readonly activeResearchCount: number;
  readonly recentEventHint: string | null;
};
