import type {
  BuildingReadModel,
  ProductionJobSessionReadModel,
  TransportOrderSessionReadModel,
} from '@/presentation/adapters/api/client';
import type { RegionDetailsDto } from '@/presentation/adapters/api/query-client';
import type { RegionDetailViewData } from '@/presentation/adapters/view-data/workspace-view-data';
import {
  WORLD_MAP_CELL_SIZE,
  type WorldBuildingMarkerViewData,
  type WorldInspectorViewData,
  type WorldMapRegionCellViewData,
  type WorldOverlayViewData,
  type WorldRegionMetricViewData,
  type WorldRegionOperationsViewData,
  type WorldTransportFlowViewData,
} from '@/presentation/adapters/view-data/world-view-data';

function connectionKey(fromRegionId: string, toRegionId: string): string {
  return `${fromRegionId}->${toRegionId}`;
}

function distributeMarkerPosition(
  region: WorldMapRegionCellViewData,
  index: number,
  cellSize: number,
): { readonly x: number; readonly y: number } {
  const column = index % 3;
  const row = Math.floor(index / 3);

  return Object.freeze({
    x: region.mapX * cellSize + 14 + column * 22,
    y: region.mapY * cellSize + 14 + row * 18,
  });
}

function sumRegionalResources(details: readonly RegionDetailsDto[]): Map<string, number> {
  const totals = new Map<string, number>();

  for (const detail of details) {
    const sum = detail.regionalResources.reduce((acc, resource) => acc + resource.available, 0);
    totals.set(detail.region.id, sum);
  }

  return totals;
}

/** Maps runtime session data into world overlay view-data (Phase 4B). */
export function mapWorldOverlayViewData(
  mapRegions: readonly WorldMapRegionCellViewData[],
  buildings: readonly BuildingReadModel[],
  transportOrders: readonly TransportOrderSessionReadModel[],
  regionDetails: readonly RegionDetailsDto[],
  labelBuilding: (buildingTypeId: string) => string,
  labelRecipe: (recipeId: string) => string,
): WorldOverlayViewData {
  const regionById = new Map(mapRegions.map((region) => [region.id, region]));
  const buildingRegionById = new Map(buildings.map((building) => [building.id, building.regionId]));
  const resourceTotals = sumRegionalResources(regionDetails);
  const maxResourceTotal = Math.max(1, ...resourceTotals.values(), 0);

  const buildingsByRegion = new Map<string, BuildingReadModel[]>();
  for (const building of buildings) {
    const current = buildingsByRegion.get(building.regionId) ?? [];
    current.push(building);
    buildingsByRegion.set(building.regionId, current);
  }

  const transportCountByRegion = new Map<string, number>();
  const flowCounts = new Map<string, number>();

  for (const order of transportOrders) {
    if (order.status !== 'ACTIVE' && order.status !== 'IN_PROGRESS') {
      continue;
    }

    const sourceRegionId = buildingRegionById.get(order.sourceBuildingId);
    const destinationRegionId = buildingRegionById.get(order.destinationBuildingId);

    if (sourceRegionId !== undefined) {
      transportCountByRegion.set(sourceRegionId, (transportCountByRegion.get(sourceRegionId) ?? 0) + 1);
    }

    if (destinationRegionId !== undefined) {
      transportCountByRegion.set(
        destinationRegionId,
        (transportCountByRegion.get(destinationRegionId) ?? 0) + 1,
      );
    }

    if (
      sourceRegionId !== undefined &&
      destinationRegionId !== undefined &&
      sourceRegionId !== destinationRegionId
    ) {
      const key = connectionKey(sourceRegionId, destinationRegionId);
      flowCounts.set(key, (flowCounts.get(key) ?? 0) + 1);
    }
  }

  const maxFlow = Math.max(1, ...flowCounts.values(), 0);

  const regionMetrics: WorldRegionMetricViewData[] = mapRegions.map((region) => {
    const buildingCount = buildingsByRegion.get(region.id)?.length ?? 0;
    const resourceTotal = resourceTotals.get(region.id) ?? 0;
    const activeTransportCount = transportCountByRegion.get(region.id) ?? 0;

    return Object.freeze({
      regionId: region.id,
      resourceIntensity: resourceTotal / maxResourceTotal,
      buildingCount,
      activeTransportCount,
      presenceLabel:
        buildingCount === 0
          ? 'Keine Präsenz'
          : `${buildingCount} Gebäude · ${activeTransportCount} Transporte`,
    });
  });

  const buildingMarkers: WorldBuildingMarkerViewData[] = [];

  for (const region of mapRegions) {
    const regionBuildings = buildingsByRegion.get(region.id) ?? [];

    regionBuildings.forEach((building, index) => {
      const position = distributeMarkerPosition(region, index, WORLD_MAP_CELL_SIZE);
      buildingMarkers.push(
        Object.freeze({
          id: building.id,
          regionId: region.id,
          label: building.name,
          statusLabel: building.status,
          x: position.x,
          y: position.y,
        }),
      );
    });
  }

  const transportFlows: WorldTransportFlowViewData[] = [...flowCounts.entries()].map(([key, count]) => {
    const [fromRegionId, toRegionId] = key.split('->');
    return Object.freeze({
      fromRegionId,
      toRegionId,
      intensity: count / maxFlow,
      label: `${count} aktiv`,
    });
  });

  return Object.freeze({
    regionMetrics: Object.freeze(regionMetrics),
    buildingMarkers: Object.freeze(buildingMarkers),
    transportFlows: Object.freeze(transportFlows),
  });
}

/** Filters operations context for a single region. */
export function mapWorldRegionOperationsViewData(
  regionId: string,
  buildings: readonly BuildingReadModel[],
  transportOrders: readonly TransportOrderSessionReadModel[],
  productionJobs: readonly ProductionJobSessionReadModel[],
  labelBuilding: (buildingTypeId: string) => string,
  labelRecipe: (recipeId: string) => string,
): WorldRegionOperationsViewData {
  const regionBuildingIds = new Set(
    buildings.filter((building) => building.regionId === regionId).map((building) => building.id),
  );

  return Object.freeze({
    buildings: Object.freeze(
      buildings
        .filter((building) => building.regionId === regionId)
        .map((building) =>
          Object.freeze({
            id: building.id,
            name: building.name,
            typeLabel: labelBuilding(building.buildingTypeId),
            statusLabel: building.status,
          }),
        ),
    ),
    transports: Object.freeze(
      transportOrders
        .filter(
          (order) =>
            regionBuildingIds.has(order.sourceBuildingId) ||
            regionBuildingIds.has(order.destinationBuildingId),
        )
        .map((order) =>
          Object.freeze({
            id: order.id,
            label: `${order.sourceBuildingName} → ${order.destinationBuildingName}`,
            statusLabel: order.status,
          }),
        ),
    ),
    productionJobs: Object.freeze(
      productionJobs
        .filter((job) => regionBuildingIds.has(job.buildingId))
        .map((job) =>
          Object.freeze({
            id: job.id,
            recipeLabel: labelRecipe(job.recipeId),
            statusLabel: job.status,
          }),
        ),
    ),
  });
}

/** Extends region inspector with company operations sections (Phase 4B). */
export function mapWorldRegionInspectorViewData(
  detail: RegionDetailViewData,
  operations: WorldRegionOperationsViewData,
): WorldInspectorViewData {
  const baseSections = [
    Object.freeze({
      id: 'overview',
      title: 'Überblick',
      entries: Object.freeze([
        Object.freeze({ label: 'Beschreibung', value: detail.description }),
      ]),
    }),
    Object.freeze({
      id: 'cities',
      title: 'Städte',
      entries:
        detail.cities.length === 0
          ? Object.freeze([])
          : Object.freeze(
              detail.cities.map((city) =>
                Object.freeze({ label: city.name, value: city.category }),
              ),
            ),
    }),
    Object.freeze({
      id: 'resources',
      title: 'Regionale Ressourcen',
      entries:
        detail.resources.length === 0
          ? Object.freeze([])
          : Object.freeze(
              detail.resources.map((resource) =>
                Object.freeze({ label: resource.label, value: resource.amountLabel }),
              ),
            ),
    }),
  ];

  const operationsSections = [
    Object.freeze({
      id: 'buildings',
      title: 'Unternehmensgebäude',
      entries:
        operations.buildings.length === 0
          ? Object.freeze([])
          : Object.freeze(
              operations.buildings.map((building) =>
                Object.freeze({
                  label: building.name,
                  value: `${building.typeLabel} · ${building.statusLabel}`,
                }),
              ),
            ),
    }),
    Object.freeze({
      id: 'production',
      title: 'Produktion',
      entries:
        operations.productionJobs.length === 0
          ? Object.freeze([])
          : Object.freeze(
              operations.productionJobs.map((job) =>
                Object.freeze({ label: job.recipeLabel, value: job.statusLabel }),
              ),
            ),
    }),
    Object.freeze({
      id: 'transport',
      title: 'Transport',
      entries:
        operations.transports.length === 0
          ? Object.freeze([])
          : Object.freeze(
              operations.transports.map((transport) =>
                Object.freeze({ label: transport.label, value: transport.statusLabel }),
              ),
            ),
    }),
  ];

  return Object.freeze({
    title: detail.title,
    subtitle: detail.biomeId,
    entries: Object.freeze([
      Object.freeze({ label: 'Biom', value: detail.biomeId }),
      Object.freeze({ label: 'Städte', value: String(detail.cities.length) }),
      Object.freeze({ label: 'Gebäude', value: String(operations.buildings.length) }),
      Object.freeze({ label: 'Transporte', value: String(operations.transports.length) }),
    ]),
    sections: Object.freeze([...baseSections, ...operationsSections]),
    relatedTitle: operations.buildings.length > 0 ? 'Gebäude' : undefined,
    relatedItems:
      operations.buildings.length === 0
        ? undefined
        : Object.freeze(
            operations.buildings.map((building) =>
              Object.freeze({
                primary: building.name,
                secondary: building.statusLabel,
              }),
            ),
          ),
  });
}
