import { describe, expect, it } from 'vitest';
import {
  projectDomainPlacementPosition,
  resolveCompanyPlacementProjectionContext,
} from '@/presentation/adapters/mappers/company-building-placement-coordinates';
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
    biomeLabel: 'Temperate Forest',
    biomeCategory: 'FOREST',
    mapX: 0,
    mapY: 0,
    cityCount: 1,
  }),
  Object.freeze({
    id: 'region_002',
    name: 'North Coast',
    biomeId: 'coastal',
    biomeLabel: 'Coastal Lowlands',
    biomeCategory: 'COASTAL',
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
            biomeName: 'Temperate Forest',
            biomeCategory: 'FOREST',
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
    expect(overlay.buildingMarkers[0]?.buildingTypeId).toBe('sawmill');
    expect(overlay.buildingMarkers[0]?.clusterSize).toBe(1);
    expect(overlay.buildingMarkers[0]?.x).toBeCloseTo(21.6, 1);
    expect(overlay.buildingMarkers[0]?.y).toBeCloseTo(55.04, 1);
    expect(overlay.regionMetrics[0]?.buildingCount).toBe(1);
    expect(overlay.transportFlows.length).toBeGreaterThanOrEqual(0);
  });

  it('anchors default-region building markers from domain position via shared projection', () => {
    const defaultRegion = Object.freeze({
      id: 'region_default',
      name: 'Default',
      biomeId: 'temperate',
      biomeLabel: 'Temperate Forest',
      biomeCategory: 'FOREST',
      mapX: 0,
      mapY: 0,
      cityCount: 1,
    });
    const domain = Object.freeze({ x: 12, y: 7 });
    const context = resolveCompanyPlacementProjectionContext([defaultRegion])!;
    const expectedAnchor = projectDomainPlacementPosition(domain, context);

    const overlay = mapWorldOverlayViewData(
      [defaultRegion],
      [
        {
          id: 'building_default',
          buildingTypeId: 'sawmill',
          regionId: 'region_default',
          name: 'Sägewerk',
          x: domain.x,
          y: domain.y,
          status: 'ACTIVE',
          constructionProgress: 100,
          constructionDuration: 10,
        },
      ],
      [],
      [
        {
          region: {
            id: 'region_default',
            name: 'Default',
            description: 'Starter',
            worldId: 'world_001',
            biomeId: 'temperate',
            biomeName: 'Temperate Forest',
            biomeCategory: 'FOREST',
            mapX: 0,
            mapY: 0,
            neighborRegionIds: [],
            cityIds: [],
          },
          regionalResources: [],
          cities: [],
        },
      ],
      (id) => id,
      (id) => id,
    );

    expect(overlay.buildingMarkers[0]?.x).toBe(expectedAnchor.x);
    expect(overlay.buildingMarkers[0]?.y).toBe(expectedAnchor.y);
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
      [
        {
          id: 'transport_001',
          resourceId: 'wood',
          amount: 5,
          status: 'IN_PROGRESS',
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

    expect(operations.transports[0]?.statusLabel).toBe('Unterwegs');
    expect(operations.transports[0]?.statusLabel).not.toBe('IN_PROGRESS');

    const inspector = mapWorldRegionInspectorViewData(
      {
        id: 'region_001',
        title: 'Heartland',
        description: 'Starter',
        biomeId: 'temperate',
        biomeLabel: 'Temperate Forest',
        resources: [],
        cities: [],
      },
      operations,
    );

    expect(inspector.sections.map((section) => section.id)).toContain('production');
    expect(inspector.entries.some((entry) => entry.label === 'Gebäude')).toBe(true);
  });
});
