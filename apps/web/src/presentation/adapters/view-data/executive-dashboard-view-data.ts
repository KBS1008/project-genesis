/** Immutable view-data for the executive dashboard (DB-001). */

import type { PGNotificationItem } from '@/presentation/components/dashboard/PGNotificationCenter';
import type { PGKpiCardVariant } from '@/presentation/components/dashboard/PGKpiCard';
import type { PGStatusPanelItem } from '@/presentation/components/dashboard/PGStatusPanel';
import type {
  BuildingListRowViewData,
  FinanceTransactionRowViewData,
  ProductionJobRowViewData,
  ResearchJobRowViewData,
  TransportOrderRowViewData,
} from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type { RegionalPresenceRowViewData } from '@/presentation/adapters/view-data/company-overview-view-data';

export type ExecutiveKpiCardViewData = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
  readonly trend?: string;
  readonly variant: PGKpiCardVariant;
  readonly placeholder?: string;
};

export type ExecutiveFinanceRowViewData = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
};

export type ExecutiveReportActionViewData = {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly targetScreen: string;
};

export type ExecutiveInspectorViewData = {
  readonly title: string;
  readonly subtitle: string;
  readonly entries: readonly { readonly label: string; readonly value: string; readonly valueClass?: string }[];
  readonly relatedTitle?: string;
  readonly relatedItems?: readonly { readonly primary: string; readonly secondary: string }[];
};

export type ExecutiveDashboardViewData = {
  readonly companyName: string;
  readonly headerSubtitle: string;
  readonly tickLabel: string;
  readonly simulationTimeLabel: string;
  readonly playerSummary: string;
  readonly companySummary: string;
  readonly kpiCards: readonly ExecutiveKpiCardViewData[];
  readonly statusItems: readonly PGStatusPanelItem[];
  readonly notifications: readonly PGNotificationItem[];
  readonly financeRows: readonly ExecutiveFinanceRowViewData[];
  readonly recentTransactions: readonly FinanceTransactionRowViewData[];
  readonly productionJobs: readonly ProductionJobRowViewData[];
  readonly productionHint: string | null;
  readonly researchJobs: readonly ResearchJobRowViewData[];
  readonly researchHint: string | null;
  readonly completedResearchLabels: readonly string[];
  readonly transportOrders: readonly TransportOrderRowViewData[];
  readonly transportHint: string | null;
  readonly companySummaryRows: readonly ExecutiveFinanceRowViewData[];
  readonly buildings: readonly BuildingListRowViewData[];
  readonly regionalPresence: readonly RegionalPresenceRowViewData[];
  readonly reportActions: readonly ExecutiveReportActionViewData[];
  readonly reportHints: readonly string[];
  readonly inspector: ExecutiveInspectorViewData | null;
};
