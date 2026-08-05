import type { RegionDto } from '@/presentation/adapters/api/query-client';
import type {
  BuildingListRowViewData,
  CompanyDashboardViewData,
} from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type {
  ExecutiveDashboardViewData,
  ExecutiveKpiCardViewData,
} from '@/presentation/adapters/view-data/executive-dashboard-view-data';
import type { RegionalPresenceRowViewData } from '@/presentation/adapters/view-data/company-overview-view-data';

function buildRegionalPresence(
  buildings: readonly BuildingListRowViewData[],
): readonly RegionalPresenceRowViewData[] {
  const grouped = new Map<string, BuildingListRowViewData[]>();

  for (const building of buildings) {
    const current = grouped.get(building.regionId) ?? [];
    current.push(building);
    grouped.set(building.regionId, current);
  }

  return Object.freeze(
    [...grouped.entries()]
      .map(([regionId, regionBuildings]) =>
        Object.freeze({
          regionId,
          regionName: regionBuildings[0]?.regionLabel ?? regionId,
          buildingCount: regionBuildings.length,
          buildingSummary: regionBuildings.map((building) => building.name).join(', '),
        }),
      )
      .sort((left, right) => left.regionName.localeCompare(right.regionName, 'de')),
  );
}

function buildKpiCards(companyViewData: CompanyDashboardViewData): readonly ExecutiveKpiCardViewData[] {
  const kpis = companyViewData.kpis;
  if (kpis === null) {
    return Object.freeze([]);
  }

  return Object.freeze([
    {
      id: 'cash',
      label: 'Verfügbare Mittel',
      value: kpis.availableCashLabel,
      trend: kpis.availableCashTrend,
      variant: 'info',
      placeholder: '{{availableCash}}',
    },
    {
      id: 'energy',
      label: 'Energie',
      value: kpis.energyReserveLabel,
      hint: kpis.energyTrend,
      variant: kpis.energyHasDeficit ? 'danger' : 'success',
      placeholder: '{{energyReserve}}',
    },
    {
      id: 'transport',
      label: 'Transporte',
      value: String(kpis.activeTransportCount),
      trend: kpis.activeTransportTrend,
      variant: 'default',
    },
    {
      id: 'warehouse',
      label: 'Lager',
      value: String(kpis.warehouseTotalUnits),
      hint: kpis.warehouseCapacityHint,
      variant: 'default',
    },
    {
      id: 'employees',
      label: 'Mitarbeiter',
      value: `${kpis.assignedEmployeeCount}/${kpis.employeeCount}`,
      hint: kpis.employeeCapacityHint,
      variant: 'default',
    },
    {
      id: 'production',
      label: 'Produktion',
      value: String(kpis.runningProductionCount),
      hint: kpis.productionHint,
      variant: 'warning',
    },
    {
      id: 'research',
      label: 'Forschung',
      value: String(kpis.activeResearchCount),
      hint: kpis.researchHint,
      variant: 'info',
    },
    {
      id: 'tax',
      label: 'Steuer',
      value: kpis.corporateTaxRateLabel,
      trend: kpis.taxTrendLabel,
      variant: kpis.taxPaymentBlocked ? 'danger' : 'default',
    },
  ]);
}

function buildNotifications(companyViewData: CompanyDashboardViewData) {
  const notifications = [];
  const kpis = companyViewData.kpis;
  const timestampLabel = companyViewData.simulationTimeLabel;

  if (companyViewData.energyHasDeficit) {
    notifications.push({
      id: 'energy-deficit',
      title: 'Energiedefizit',
      message: kpis?.energyTrend ?? 'Energieunterdeckung',
      tone: 'warning' as const,
      timestampLabel,
    });
  }

  if (kpis?.taxPaymentBlocked === true) {
    notifications.push({
      id: 'tax-blocked',
      title: 'Steuerzahlung blockiert',
      message: kpis.taxTrendLabel,
      tone: 'error' as const,
      timestampLabel,
    });
  }

  if (companyViewData.logisticsStatusMessage !== null) {
    notifications.push({
      id: 'logistics-status',
      title: 'Logistik',
      message: companyViewData.logisticsStatusMessage,
      tone: 'info' as const,
      timestampLabel,
    });
  }

  return Object.freeze(notifications);
}

export type PlayerIdentityInput = {
  readonly playerId: string | null;
  readonly playerName?: string | null;
};

/** Resolves the executive player summary from runtime identity fields. */
export function resolvePlayerSummary(identity: PlayerIdentityInput): string {
  const trimmedName = identity.playerName?.trim();
  if (trimmedName !== undefined && trimmedName.length > 0) {
    return trimmedName;
  }

  if (identity.playerId !== null && identity.playerId.length > 0) {
    return identity.playerId;
  }

  return '—';
}

/** Builds executive dashboard view-data from company dashboard state. */
export function buildExecutiveDashboardViewData(
  companyViewData: CompanyDashboardViewData,
  regions: readonly RegionDto[],
  buildings: readonly BuildingListRowViewData[],
  playerIdentity: PlayerIdentityInput,
): ExecutiveDashboardViewData {
  const regionNames = new Map(regions.map((region) => [region.id, region.name]));
  const normalizedBuildings = Object.freeze(
    buildings.map((building) =>
      Object.freeze({
        ...building,
        regionLabel: regionNames.get(building.regionId) ?? building.regionLabel,
      }),
    ),
  );

  const kpis = companyViewData.kpis;
  const financeRows = companyViewData.detail.hasFinance
    ? Object.freeze(
        companyViewData.detail.financeEntries.map(([label, value], index) =>
          Object.freeze({
            id: `finance-${index}`,
            label,
            value,
          }),
        ),
      )
    : Object.freeze([]);

  const companySummaryRows = Object.freeze([
    {
      id: 'buildings',
      label: 'Gebäude',
      value: String(companyViewData.buildingCount),
    },
    {
      id: 'production',
      label: 'Aktive Produktion',
      value: String(companyViewData.productionJobs.length),
    },
    {
      id: 'research',
      label: 'Aktive Forschung',
      value: String(companyViewData.researchJobs.length),
    },
    {
      id: 'transport',
      label: 'Aktive Transporte',
      value: String(companyViewData.transportOrders.length),
    },
  ]);

  return Object.freeze({
    companyName: companyViewData.companyName ?? 'Unbenannt',
    headerSubtitle: companyViewData.headerSubtitle,
    tickLabel: companyViewData.tickLabel,
    simulationTimeLabel: companyViewData.simulationTimeLabel,
    playerSummary: resolvePlayerSummary(playerIdentity),
    companySummary: `${companyViewData.buildingCount} Gebäude · Tick ${companyViewData.tickLabel}`,
    kpiCards: buildKpiCards(companyViewData),
    statusItems: Object.freeze([
      {
        id: 'session',
        label: 'Session',
        value: companyViewData.hasGame ? 'Aktiv' : 'Inaktiv',
        tone: companyViewData.hasGame ? 'success' : 'warning',
      },
      {
        id: 'price-index',
        label: 'Preisindex',
        value: kpis?.priceIndexLabel ?? '—',
        tone: 'info',
      },
      {
        id: 'contracts',
        label: 'Verträge',
        value: String(kpis?.activeContractCount ?? 0),
        tone: 'default',
      },
      {
        id: 'milestones',
        label: 'Meilensteine',
        value: String(kpis?.completedMilestoneCount ?? 0),
        tone: 'default',
      },
    ]),
    notifications: buildNotifications(companyViewData),
    financeRows,
    recentTransactions: Object.freeze(companyViewData.financeTransactions.slice(0, 5)),
    productionJobs: companyViewData.productionJobs,
    productionHint: kpis?.productionHint ?? null,
    researchJobs: companyViewData.researchJobs,
    researchHint: kpis?.researchHint ?? null,
    completedResearchLabels: companyViewData.completedResearchLabels,
    transportOrders: companyViewData.transportOrders,
    transportHint: kpis?.activeTransportTrend ?? null,
    companySummaryRows,
    buildings: normalizedBuildings,
    regionalPresence: buildRegionalPresence(normalizedBuildings),
    reportActions: Object.freeze([
      {
        id: 'open-production',
        label: 'Produktion',
        description: 'Aktive Jobs und Rezepte verwalten',
        targetScreen: 'production',
      },
      {
        id: 'open-research',
        label: 'Forschung',
        description: 'Technologie-Fortschritt prüfen',
        targetScreen: 'research',
      },
      {
        id: 'open-transport',
        label: 'Transport',
        description: 'Lieferketten und Routen überwachen',
        targetScreen: 'transport',
      },
      {
        id: 'open-reports',
        label: 'Berichte',
        description: 'Unternehmensberichte öffnen',
        targetScreen: 'reports',
      },
    ]),
    reportHints: Object.freeze([
      'Platzhalter {{revenue}} und {{profit}} werden zur Laufzeit gebunden (DD-042).',
      'Widgets verwenden ausschließlich Server-View-Data.',
    ]),
    inspector: null,
  });
}
