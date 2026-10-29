import type { ProductionJobSessionReadModel } from '@/presentation/adapters/api/client';
import type { ProductionHintViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { isWorldBuildingProductionCapable } from '@/presentation/components/world/world-building-inspector-production';

/** Independent navigation action availability for the world building inspector (GCL-S1-NAV). */
export type WorldBuildingInspectorNavigationViewData = Readonly<{
  readonly showOpenBuilding: boolean;
  readonly showOpenProduction: boolean;
  readonly showManageWorkforce: boolean;
}>;

/** Gebäude öffnen is available for every selected map building with inspector detail. */
export function buildWorldBuildingInspectorNavigationViewData(
  buildingId: string,
  productionHints: readonly ProductionHintViewData[],
  jobs: readonly ProductionJobSessionReadModel[],
  hasInspectorDetail: boolean,
): WorldBuildingInspectorNavigationViewData {
  const productionCapable = isWorldBuildingProductionCapable(buildingId, productionHints, jobs);

  return Object.freeze({
    showOpenBuilding: hasInspectorDetail,
    showOpenProduction: productionCapable,
    showManageWorkforce: productionCapable,
  });
}
