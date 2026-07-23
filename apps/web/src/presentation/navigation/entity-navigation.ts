import type { PrimaryScreenId } from '@/presentation/navigation/primary-screens';
import type { EntitySelection } from '@/presentation/state/navigation-state';

export type EntityNavigationTarget = {
  readonly screen: PrimaryScreenId;
  readonly entitySelection: EntitySelection;
};

/** Builds navigation state for inspecting a region on the world screen. */
export function buildRegionNavigationTarget(regionId: string): EntityNavigationTarget {
  return {
    screen: 'world',
    entitySelection: { kind: 'region', id: regionId },
  };
}

/** Builds navigation state for inspecting a building on the company screen. */
export function buildBuildingNavigationTarget(buildingId: string): EntityNavigationTarget {
  return {
    screen: 'company',
    entitySelection: { kind: 'building', id: buildingId },
  };
}

/** Builds navigation state for inspecting a production job. */
export function buildProductionNavigationTarget(jobId: string): EntityNavigationTarget {
  return {
    screen: 'production',
    entitySelection: { kind: 'production', id: jobId },
  };
}
