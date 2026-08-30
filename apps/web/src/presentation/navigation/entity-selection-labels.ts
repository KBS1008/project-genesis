import type { RegionDto } from '@/presentation/adapters/api/query-client';
import type { CompanyDashboardViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import type { EntitySelection } from '@/presentation/state/navigation-state';

const ENTITY_KIND_LABELS: Record<Exclude<EntitySelection['kind'], 'none'>, string> = {
  region: 'Region',
  building: 'Gebäude',
  resource: 'Ressource',
  production: 'Produktion',
  transport: 'Transport',
  research: 'Forschung',
  employee: 'Mitarbeiter',
  event: 'Ereignis',
  warehouse: 'Lagerhaus',
};

/** Resolves a human-readable label for the global selection banner. */
export function formatEntitySelectionLabel(
  selection: EntitySelection,
  companyViewData: CompanyDashboardViewData,
  regions: readonly RegionDto[],
): string | null {
  if (selection.kind === 'none') {
    return null;
  }

  const kindLabel = ENTITY_KIND_LABELS[selection.kind];

  switch (selection.kind) {
    case 'region':
      return `${kindLabel}: ${regions.find((region) => region.id === selection.id)?.name ?? selection.id}`;
    case 'building': {
      const buildingRow = companyViewData.buildings.find((entry) => entry.id === selection.id);
      const buildingDetail = companyViewData.detail.buildings.get(selection.id);
      return `${kindLabel}: ${buildingRow?.name ?? buildingDetail?.title ?? selection.id}`;
    }
    case 'resource':
      return `${kindLabel}: ${companyViewData.labels.resource(selection.id)}`;
    case 'production': {
      const production = companyViewData.detail.productionJobs.get(selection.id);
      return `${kindLabel}: ${production?.title ?? selection.id}`;
    }
    case 'transport': {
      const transport = companyViewData.detail.transportOrders.get(selection.id);
      return `${kindLabel}: ${transport?.title ?? selection.id}`;
    }
    case 'research': {
      const research = companyViewData.detail.researchJobs.get(selection.id);
      return `${kindLabel}: ${research?.title ?? selection.id}`;
    }
    case 'employee': {
      const employee = companyViewData.detail.employees.get(selection.id);
      return `${kindLabel}: ${employee?.title ?? selection.id}`;
    }
    case 'event':
      return `${kindLabel}: ${selection.id}`;
    case 'warehouse': {
      const warehouse = companyViewData.detail.warehouseStorage.get(selection.id);
      return `${kindLabel}: ${warehouse?.title ?? selection.id}`;
    }
  }
}
