import { describe, expect, it } from 'vitest';
import { mapWorldRegionInspectorViewData, mapWorldRegionOperationsViewData } from '@/presentation/adapters/mappers/world-overlay-mappers';
import { mapRegionDetailViewData } from '@/presentation/adapters/mappers/workspace-view-mappers';
import { EMPTY_COMPANY_DASHBOARD_VIEW_DATA } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { WORLD_MAP_CELL_SIZE } from '@/presentation/adapters/view-data/world-view-data';
import {
  buildGlobalSearchIndex,
  filterGlobalSearchItems,
} from '@/presentation/components/shell/build-global-search-index';
import type { GlobalSearchItem } from '@/presentation/components/shell/global-search-types';
import {
  buildRegionNavigationTarget,
  type EntityNavigationTarget,
} from '@/presentation/navigation/entity-navigation';
import { fitRegionCamera } from '@/presentation/hooks/world-camera-math';

const REGIONS = Object.freeze([
  Object.freeze({
    id: 'region_north',
    name: 'Nordheim',
    description: 'Northern trade corridor',
  }),
]);

const MAP_REGIONS = Object.freeze([
  Object.freeze({
    id: 'region_north',
    name: 'Nordheim',
    biomeId: 'forest',
    mapX: 4,
    mapY: 2,
    cityCount: 2,
  }),
]);

function resolveGlobalSearchSelection(item: GlobalSearchItem): EntityNavigationTarget {
  if (item.kind === 'screen' || item.entityKind === undefined || item.entityId === undefined) {
    return Object.freeze({
      screen: item.screen,
      entitySelection: { kind: 'none' },
    });
  }

  return Object.freeze({
    screen: item.screen,
    entitySelection: { kind: item.entityKind, id: item.entityId },
  });
}

describe('world search selection integration', () => {
  it('routes search → shared selection → camera centering → inspector data', () => {
    const companyViewData = Object.freeze({
      ...EMPTY_COMPANY_DASHBOARD_VIEW_DATA,
      hasGame: true,
      companyName: 'Search Corp',
    });

    const searchItems = buildGlobalSearchIndex(companyViewData, REGIONS);
    const matches = filterGlobalSearchItems(searchItems, 'nordheim');

    expect(matches.some((item) => item.id === 'region:region_north')).toBe(true);

    const regionItem = matches.find((item) => item.id === 'region:region_north');
    expect(regionItem).toMatchObject({
      screen: 'world',
      entityKind: 'region',
      entityId: 'region_north',
    });

    const navigationTarget = resolveGlobalSearchSelection(regionItem!);
    expect(navigationTarget).toEqual(buildRegionNavigationTarget('region_north'));

    const selectedRegionId =
      navigationTarget.entitySelection.kind === 'region'
        ? navigationTarget.entitySelection.id
        : null;
    expect(selectedRegionId).toBe('region_north');

    const mapRegion = MAP_REGIONS.find((region) => region.id === selectedRegionId);
    expect(mapRegion).toBeDefined();

    const camera = fitRegionCamera(mapRegion!, 960, 720, WORLD_MAP_CELL_SIZE);
    expect(camera.scale).toBeGreaterThan(0);

    const expectedCenterX = mapRegion!.mapX * WORLD_MAP_CELL_SIZE + WORLD_MAP_CELL_SIZE / 2;
    const expectedCenterY = mapRegion!.mapY * WORLD_MAP_CELL_SIZE + WORLD_MAP_CELL_SIZE / 2;
    expect(camera.translateX).toBe(480 - expectedCenterX * camera.scale);
    expect(camera.translateY).toBe(360 - expectedCenterY * camera.scale);

    const regionDetailDto = Object.freeze({
      region: Object.freeze({
        id: 'region_north',
        name: 'Nordheim',
        description: 'Northern trade corridor',
        worldId: 'world_001',
        biomeId: 'forest',
        mapX: 4,
        mapY: 2,
        neighborRegionIds: Object.freeze([]),
        cityIds: Object.freeze(['city_001']),
      }),
      regionalResources: Object.freeze([
        Object.freeze({
          resourceTypeId: 'wood',
          available: 120,
          extractionModifier: 1.1,
        }),
      ]),
      cities: Object.freeze([
        Object.freeze({
          id: 'city_001',
          name: 'Nordport',
          regionId: 'region_north',
          category: 'PORT',
        }),
      ]),
    });

    const detail = mapRegionDetailViewData(regionDetailDto);
    const operations = mapWorldRegionOperationsViewData(
      'region_north',
      Object.freeze([]),
      Object.freeze([]),
      Object.freeze([]),
      (id: string) => id,
      (id: string) => id,
    );
    const inspector = mapWorldRegionInspectorViewData(detail, operations);

    expect(inspector.title).toContain('Nordheim');
    expect(inspector.sections.some((section) => section.id === 'overview')).toBe(true);

    const inspectorQueryKey = `world-inspector:${selectedRegionId}`;
    expect(inspectorQueryKey).toBe('world-inspector:region_north');
  });
});
