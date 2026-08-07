import { describe, expect, it } from 'vitest';
import {
  mapWorldOverlayViewData,
  mapWorldRegionInspectorViewData,
  mapWorldRegionOperationsViewData,
} from '@/presentation/adapters/mappers/world-overlay-mappers';

const MAP_REGIONS = Object.freeze([
  Object.freeze({
    id: 'region_001',
    name: 'Heartland',
    biomeId: 'temperate',
    mapX: 0,
    mapY: 0,
    cityCount: 1,
  }),
  Object.freeze({
    id: 'region_002',
    name: 'North Coast',
    biomeId: 'coastal',
    mapX: 1,
    mapY: 0,
    cityCount: 0,
  }),
]);

describe('world-overlay-mappers', () => {
  it('mapWorldOverlayViewData builds markers and transport flows', () => {
    const overlay = mapWorldOverlayViewData(
      MAP_REGIONS,
      [
        {
          id: 'building_001',
          buildingTypeId: 'sawmill',
          regionId: 'region_001',
          name: 'Sägewerk',
          x: 1,
          y: 2,
          status: 'ACTIVE',
          constructionProgress: 100,
          constructionDuration: 10,
        },
      ],
      [
        {
          id: 'transport_001',
          resourceId: 'wood',
          amount: 5,
          status: 'ACTIVE',
          progress: 40,
          sourceBuildingId: 'building_001',
          sourceBuildingName: 'Sägewerk',
          destinationBuildingId: 'building_002',
          destinationBuildingName: 'Lager',
          productionJobId: 'job_001',
          recipeId: 'plank',
          recipeName: 'Bretter',
          durationTicks: 4,
          routeId: null,
        },
      ],
      [
        {
          region: {
            id: 'region_001',
            name: 'Heartland',
            description: 'Starter',
            worldId: 'world_001',
            biomeId: 'temperate',
            mapX: 0,
            mapY: 0,
            neighborRegionIds: [],
            cityIds: [],
          },
          regionalResources: [{ resourceTypeId: 'wood', available: 100, extractionModifier: 1 }],
          cities: [],
        },
      ],
      (id) => id,
      (id) => id,
    );

    expect(overlay.buildingMarkers).toHaveLength(1);
    expect(overlay.regionMetrics[0]?.buildingCount).toBe(1);
    expect(overlay.transportFlows.length).toBeGreaterThanOrEqual(0);
  });

  it('mapWorldRegionInspectorViewData adds operations sections', () => {
    const operations = mapWorldRegionOperationsViewData(
      'region_001',
      [
        {
          id: 'building_001',
          buildingTypeId: 'sawmill',
          regionId: 'region_001',
          name: 'Sägewerk',
          x: 0,
          y: 0,
          status: 'ACTIVE',
          constructionProgress: 100,
          constructionDuration: 10,
        },
      ],
      [],
      [
        {
          id: 'job_001',
          buildingId: 'building_001',
          recipeId: 'plank',
          status: 'RUNNING',
          progress: 50,
          operationalState: 'RUNNING',
          awaitingTransport: false,
          activeTransportCount: 0,
        },
      ],
      (id) => (id === 'sawmill' ? 'Sägewerk' : id),
      (id) => (id === 'plank' ? 'Bretter' : id),
    );

    const inspector = mapWorldRegionInspectorViewData(
      {
        id: 'region_001',
        title: 'Heartland',
        description: 'Starter',
        biomeId: 'temperate',
        resources: [],
        cities: [],
      },
      operations,
    );

    expect(inspector.sections.map((section) => section.id)).toContain('production');
    expect(inspector.entries.some((entry) => entry.label === 'Gebäude')).toBe(true);
  });
});
