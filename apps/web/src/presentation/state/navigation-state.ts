import {
  isPrimaryScreenId,
  type PrimaryScreenId,
} from '@/presentation/navigation/primary-screens';

export type EntitySelectionKind =
  | 'none'
  | 'region'
  | 'building'
  | 'resource'
  | 'production'
  | 'transport'
  | 'research'
  | 'employee';

export type EntitySelection =
  | { readonly kind: 'none' }
  | { readonly kind: 'region'; readonly id: string }
  | { readonly kind: 'building'; readonly id: string }
  | { readonly kind: 'resource'; readonly id: string }
  | { readonly kind: 'production'; readonly id: string }
  | { readonly kind: 'transport'; readonly id: string }
  | { readonly kind: 'research'; readonly id: string }
  | { readonly kind: 'employee'; readonly id: string };

export type NavigationState = {
  readonly screen: PrimaryScreenId;
  readonly entitySelection: EntitySelection;
};

export type EntityCatalog = {
  readonly regionIds: ReadonlySet<string>;
  readonly buildingIds: ReadonlySet<string>;
  readonly resourceIds: ReadonlySet<string>;
  readonly productionIds: ReadonlySet<string>;
  readonly transportIds: ReadonlySet<string>;
  readonly researchIds: ReadonlySet<string>;
  readonly employeeIds: ReadonlySet<string>;
};

export type ApplicationSessionSnapshot = {
  readonly hasGame: boolean;
  readonly companyId: string | null;
  readonly companyName: string | null;
  readonly tickNumber: number | null;
  readonly simulationTime: number | null;
  readonly availableCash: number | null;
};

export type SimulationStatusSnapshot = {
  readonly tickNumber: number | null;
  readonly simulationTime: number | null;
  readonly isPaused: boolean;
  readonly speedMultiplier: number;
  readonly hasActiveSession: boolean;
};

export const DEFAULT_NAVIGATION_STATE: NavigationState = {
  screen: 'company',
  entitySelection: { kind: 'none' },
};

const ENTITY_KINDS = new Set<EntitySelectionKind>([
  'none',
  'region',
  'building',
  'resource',
  'production',
  'transport',
  'research',
  'employee',
]);

function parseEntitySelection(rawValue: string | null): EntitySelection {
  if (rawValue === null || rawValue.length === 0 || rawValue === 'none') {
    return { kind: 'none' };
  }

  const separatorIndex = rawValue.indexOf(':');
  if (separatorIndex <= 0) {
    return { kind: 'none' };
  }

  const kind = rawValue.slice(0, separatorIndex);
  const id = rawValue.slice(separatorIndex + 1).trim();

  if (!ENTITY_KINDS.has(kind as EntitySelectionKind) || kind === 'none' || id.length === 0) {
    return { kind: 'none' };
  }

  return { kind: kind as Exclude<EntitySelectionKind, 'none'>, id };
}

function serializeEntitySelection(selection: EntitySelection): string | null {
  if (selection.kind === 'none') {
    return null;
  }

  return `${selection.kind}:${selection.id}`;
}

/** Parses URL search params into navigation state. */
export function parseNavigationState(searchParams: URLSearchParams): NavigationState {
  const rawScreen = searchParams.get('screen') ?? DEFAULT_NAVIGATION_STATE.screen;
  const screen = isPrimaryScreenId(rawScreen) ? rawScreen : DEFAULT_NAVIGATION_STATE.screen;

  return {
    screen,
    entitySelection: parseEntitySelection(searchParams.get('entity')),
  };
}

/** Serializes navigation state into URL search params. */
export function serializeNavigationState(state: NavigationState): URLSearchParams {
  const params = new URLSearchParams();

  if (state.screen !== DEFAULT_NAVIGATION_STATE.screen) {
    params.set('screen', state.screen);
  }

  const entity = serializeEntitySelection(state.entitySelection);
  if (entity !== null) {
    params.set('entity', entity);
  }

  return params;
}

/** Builds a query string for router updates (empty string when default). */
export function buildNavigationQueryString(state: NavigationState): string {
  const params = serializeNavigationState(state);
  const query = params.toString();
  return query.length > 0 ? `?${query}` : '';
}

function isEntityKnown(selection: EntitySelection, catalog: EntityCatalog): boolean {
  if (selection.kind === 'none') {
    return true;
  }

  switch (selection.kind) {
    case 'region':
      return catalog.regionIds.has(selection.id);
    case 'building':
      return catalog.buildingIds.has(selection.id);
    case 'resource':
      return catalog.resourceIds.has(selection.id);
    case 'production':
      return catalog.productionIds.has(selection.id);
    case 'transport':
      return catalog.transportIds.has(selection.id);
    case 'research':
      return catalog.researchIds.has(selection.id);
    case 'employee':
      return catalog.employeeIds.has(selection.id);
    default:
      return false;
  }
}

/** Clears invalid entity selections after authoritative data loads. */
export function recoverInvalidEntitySelection(
  state: NavigationState,
  catalog: EntityCatalog,
): NavigationState {
  if (isEntityKnown(state.entitySelection, catalog)) {
    return state;
  }

  return {
    ...state,
    entitySelection: { kind: 'none' },
  };
}

/** Maps dashboard read models to entity IDs used for selection validation. */
export function buildEntityCatalogFromDashboard(dashboard: {
  readonly buildings: readonly { readonly id: string }[];
  readonly productionJobs: readonly { readonly id: string }[];
  readonly transportOrders: readonly { readonly id: string }[];
  readonly researchJobs: readonly { readonly id: string }[];
  readonly employees: readonly { readonly id: string }[];
  readonly marketPrices: readonly { readonly resourceId: string }[];
}): EntityCatalog {
  return {
    regionIds: new Set<string>(),
    buildingIds: new Set(dashboard.buildings.map((entry) => entry.id)),
    resourceIds: new Set(dashboard.marketPrices.map((entry) => entry.resourceId)),
    productionIds: new Set(dashboard.productionJobs.map((entry) => entry.id)),
    transportIds: new Set(dashboard.transportOrders.map((entry) => entry.id)),
    researchIds: new Set(dashboard.researchJobs.map((entry) => entry.id)),
    employeeIds: new Set(dashboard.employees.map((entry) => entry.id)),
  };
}

/** Derives readonly session and simulation snapshots from dashboard data. */
export function buildSessionSnapshots(dashboard: {
  readonly company: { readonly id: string; readonly name: string } | null;
  readonly tickNumber: number;
  readonly simulationTime: number;
  readonly finance: { readonly availableCash: number } | null;
}): {
  readonly session: ApplicationSessionSnapshot;
  readonly simulation: SimulationStatusSnapshot;
} {
  const hasGame = dashboard.company !== null;

  return {
    session: {
      hasGame,
      companyId: dashboard.company?.id ?? null,
      companyName: dashboard.company?.name ?? null,
      tickNumber: hasGame ? dashboard.tickNumber : null,
      simulationTime: hasGame ? dashboard.simulationTime : null,
      availableCash: dashboard.finance?.availableCash ?? null,
    },
    simulation: {
      tickNumber: hasGame ? dashboard.tickNumber : null,
      simulationTime: hasGame ? dashboard.simulationTime : null,
      isPaused: false,
      speedMultiplier: 1,
      hasActiveSession: hasGame,
    },
  };
}
