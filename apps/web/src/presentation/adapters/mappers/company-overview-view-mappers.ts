import type { RegionDto } from '@/presentation/adapters/api/query-client';
import type { BuildingListRowViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type { CompanyDashboardViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type {
  CompanyOverviewViewData,
  RegionalPresenceRowViewData,
} from '@/presentation/adapters/view-data/company-overview-view-data';

function buildRegionNameMap(regions: readonly RegionDto[]): ReadonlyMap<string, string> {
  return new Map(regions.map((region) => [region.id, region.name]));
}

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

/** Builds the Phase 6 company overview from dashboard view-data and building queries. */
export function buildCompanyOverviewViewData(
  companyViewData: CompanyDashboardViewData,
  regions: readonly RegionDto[],
  buildings: readonly BuildingListRowViewData[],
): CompanyOverviewViewData {
  const regionNames = buildRegionNameMap(regions);
  const normalizedBuildings = Object.freeze(
    buildings.map((building) =>
      Object.freeze({
        ...building,
        regionLabel: regionNames.get(building.regionId) ?? building.regionLabel,
      }),
    ),
  );

  const financeSummary = companyViewData.detail.hasFinance
    ? Object.freeze(
        companyViewData.detail.financeEntries.map(([label, value]) =>
          Object.freeze({ label, value }),
        ),
      )
    : Object.freeze([]);

  return Object.freeze({
    companyName: companyViewData.companyName ?? 'Unbenannt',
    headerSubtitle: companyViewData.headerSubtitle,
    overviewCards: companyViewData.overview?.cards ?? Object.freeze([]),
    inventoryItems: companyViewData.inventoryItems,
    financeSummary,
    recentTransactions: Object.freeze(companyViewData.financeTransactions.slice(0, 5)),
    buildings: normalizedBuildings,
    regionalPresence: buildRegionalPresence(normalizedBuildings),
    activeProductionCount: companyViewData.productionJobs.length,
    activeResearchCount: companyViewData.researchJobs.length,
    recentEventHint: companyViewData.logisticsStatusMessage,
  });
}
