import type { RegionDto } from '@/presentation/adapters/api/query-client';
import type { CompanyDashboardViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { PRIMARY_SCREENS } from '@/presentation/navigation/primary-screens';
import type { GlobalSearchItem } from './global-search-types';

function normalizeQuery(value: string): string {
  return value.trim().toLocaleLowerCase('de-DE');
}

function matchesQuery(item: GlobalSearchItem, query: string): boolean {
  if (query.length === 0) {
    return true;
  }

  const haystack = [item.label, item.description, ...item.keywords].join(' ').toLocaleLowerCase('de-DE');
  return haystack.includes(query);
}

/** Builds searchable navigation and entity entries for the global command palette. */
export function buildGlobalSearchIndex(
  companyViewData: CompanyDashboardViewData,
  regions: readonly RegionDto[],
): readonly GlobalSearchItem[] {
  const screenItems: GlobalSearchItem[] = PRIMARY_SCREENS.map((screen) => ({
    id: `screen:${screen.id}`,
    kind: 'screen',
    label: screen.label,
    description: screen.description,
    keywords: [screen.id, 'navigation', 'bildschirm'],
    screen: screen.id,
  }));

  const entityItems: GlobalSearchItem[] = [
    ...regions.map((region) => ({
      id: `region:${region.id}`,
      kind: 'entity' as const,
      label: region.name,
      description: 'Region',
      keywords: [region.id, region.description, 'region', 'welt'],
      screen: 'world' as const,
      entityKind: 'region' as const,
      entityId: region.id,
    })),
    ...companyViewData.buildings.map((building) => ({
      id: `building:${building.id}`,
      kind: 'entity' as const,
      label: building.name,
      description: `${building.buildingTypeLabel} · ${building.regionLabel}`,
      keywords: [building.id, building.buildingTypeLabel, building.regionLabel, 'gebäude'],
      screen: 'buildings' as const,
      entityKind: 'building' as const,
      entityId: building.id,
    })),
    ...companyViewData.employees.map((employee) => ({
      id: `employee:${employee.id}`,
      kind: 'entity' as const,
      label: employee.displayName,
      description: employee.employeeTypeLabel,
      keywords: [employee.id, employee.employeeTypeLabel, 'mitarbeiter'],
      screen: 'company' as const,
      entityKind: 'employee' as const,
      entityId: employee.id,
    })),
    ...companyViewData.productionJobs.map((job) => ({
      id: `production:${job.id}`,
      kind: 'entity' as const,
      label: job.recipeLabel,
      description: job.statusLabel,
      keywords: [job.id, job.recipeLabel, job.statusLabel, 'produktion'],
      screen: 'production' as const,
      entityKind: 'production' as const,
      entityId: job.id,
    })),
    ...companyViewData.transportOrders.map((order) => ({
      id: `transport:${order.id}`,
      kind: 'entity' as const,
      label: order.routeLabel,
      description: order.statusLabel,
      keywords: [order.id, order.routeLabel, order.statusLabel, 'transport'],
      screen: 'transport' as const,
      entityKind: 'transport' as const,
      entityId: order.id,
    })),
    ...companyViewData.researchJobs.map((job) => ({
      id: `research:${job.id}`,
      kind: 'entity' as const,
      label: job.technologyLabel,
      description: job.statusLabel,
      keywords: [job.id, job.technologyLabel, job.statusLabel, 'forschung'],
      screen: 'research' as const,
      entityKind: 'research' as const,
      entityId: job.id,
    })),
  ];

  return Object.freeze([...screenItems, ...entityItems]);
}

/** Filters the global search index by query text. */
export function filterGlobalSearchItems(
  items: readonly GlobalSearchItem[],
  rawQuery: string,
): readonly GlobalSearchItem[] {
  const query = normalizeQuery(rawQuery);
  return Object.freeze(items.filter((item) => matchesQuery(item, query)));
}
