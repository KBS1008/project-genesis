import type { RegionDto } from '@/presentation/adapters/api/query-client';
import type { WorldMapDto } from '@/presentation/adapters/api/world-client';
import type { RegionDetailViewData } from '@/presentation/adapters/view-data/workspace-view-data';
import {
  WORLD_MAP_CELL_SIZE,
  type WorldInspectorViewData,
  type WorldMapConnectionViewData,
  type WorldMapRegionCellViewData,
  type WorldMapViewData,
} from '@/presentation/adapters/view-data/world-view-data';

function buildGridDimensions(
  regions: readonly { readonly mapX: number; readonly mapY: number }[],
): { readonly columns: number; readonly rows: number } {
  if (regions.length === 0) {
    return { columns: 1, rows: 1 };
  }

  const maxX = Math.max(...regions.map((region) => region.mapX));
  const maxY = Math.max(...regions.map((region) => region.mapY));

  return {
    columns: maxX + 1,
    rows: maxY + 1,
  };
}

/** Maps world map API data and region catalog into canvas view-data. */
export function mapWorldMapViewData(
  map: WorldMapDto,
  regions: readonly RegionDto[],
): WorldMapViewData {
  const regionById = new Map(regions.map((region) => [region.id, region]));
  const placementById = new Map(map.regions.map((entry) => [entry.regionId, entry]));

  const mappedRegions: WorldMapRegionCellViewData[] = [];

  for (const placement of map.regions) {
    const region = regionById.get(placement.regionId);
    if (region === undefined) {
      continue;
    }

    mappedRegions.push(
      Object.freeze({
        id: region.id,
        name: region.name,
        biomeId: region.biomeId,
        mapX: placement.x,
        mapY: placement.y,
        cityCount: region.cityIds.length,
      }),
    );
  }

  for (const region of regions) {
    if (placementById.has(region.id)) {
      continue;
    }

    mappedRegions.push(
      Object.freeze({
        id: region.id,
        name: region.name,
        biomeId: region.biomeId,
        mapX: region.mapX,
        mapY: region.mapY,
        cityCount: region.cityIds.length,
      }),
    );
  }

  const { columns, rows } = buildGridDimensions(mappedRegions);

  const connections: WorldMapConnectionViewData[] = map.connections.map((connection) =>
    Object.freeze({
      fromRegionId: connection.fromRegionId,
      toRegionId: connection.toRegionId,
      distanceLabel: connection.distance.toLocaleString('de-DE'),
    }),
  );

  return Object.freeze({
    mapId: map.id,
    mapName: map.name,
    columns,
    rows,
    cellSize: WORLD_MAP_CELL_SIZE,
    regions: Object.freeze(mappedRegions),
    connections: Object.freeze(connections),
  });
}

/** Maps region detail view-data into world inspector sections (overview only, Phase 4A). */
export function mapWorldInspectorViewData(detail: RegionDetailViewData): WorldInspectorViewData {
  return Object.freeze({
    title: detail.title,
    subtitle: detail.biomeId,
    entries: Object.freeze([
      Object.freeze({ label: 'Biom', value: detail.biomeId }),
      Object.freeze({
        label: 'Städte',
        value: String(detail.cities.length),
      }),
    ]),
    sections: Object.freeze([
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
    ]),
    relatedTitle: detail.cities.length > 0 ? 'Städte' : undefined,
    relatedItems:
      detail.cities.length === 0
        ? undefined
        : Object.freeze(
            detail.cities.map((city) =>
              Object.freeze({ primary: city.name, secondary: city.category }),
            ),
          ),
  });
}
