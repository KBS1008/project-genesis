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

/** Builds navigation state for inspecting a building on the buildings screen. */
export function buildBuildingNavigationTarget(buildingId: string): EntityNavigationTarget {
  return {
    screen: 'buildings',
    entitySelection: { kind: 'building', id: buildingId },
  };
}

/** Builds navigation state for inspecting a building in company operations. */
export function buildCompanyBuildingNavigationTarget(buildingId: string): EntityNavigationTarget {
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

/** Builds navigation state for production scoped to a building facility. */
export function buildProductionBuildingNavigationTarget(buildingId: string): EntityNavigationTarget {
  return {
    screen: 'production',
    entitySelection: { kind: 'building', id: buildingId },
  };
}

/** Builds navigation state for inspecting warehouse storage at a building. */
export function buildWarehouseNavigationTarget(buildingId: string): EntityNavigationTarget {
  return {
    screen: 'company',
    entitySelection: { kind: 'warehouse', id: buildingId },
  };
}

/** Builds navigation state for inspecting a transport order. */
export function buildTransportNavigationTarget(orderId: string): EntityNavigationTarget {
  return {
    screen: 'transport',
    entitySelection: { kind: 'transport', id: orderId },
  };
}

/** Builds navigation state for inspecting a research job. */
export function buildResearchNavigationTarget(jobId: string): EntityNavigationTarget {
  return {
    screen: 'research',
    entitySelection: { kind: 'research', id: jobId },
  };
}

/** Builds navigation state for inspecting an employee in company operations. */
export function buildEmployeeNavigationTarget(employeeId: string): EntityNavigationTarget {
  return {
    screen: 'company',
    entitySelection: { kind: 'employee', id: employeeId },
  };
}

/** Builds navigation state for a market resource on the markets screen. */
export function buildResourceNavigationTarget(resourceId: string): EntityNavigationTarget {
  return {
    screen: 'markets',
    entitySelection: { kind: 'resource', id: resourceId },
  };
}

/** Builds navigation state for inspecting an event log entry. */
export function buildEventNavigationTarget(eventId: string): EntityNavigationTarget {
  return {
    screen: 'reports',
    entitySelection: { kind: 'event', id: eventId },
  };
}
