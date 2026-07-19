import { createRegionId } from '../region/RegionId.js';
import { WorldMap } from './WorldMap.js';

describe('WorldMap', () => {
  it('creates a map with deterministic region and connection ordering', () => {
    const result = WorldMap.fromContent({
      id: 'map_world_default',
      name: 'Genesis World Map',
      regions: [
        { regionId: 'region_north', x: 0, y: 2 },
        { regionId: 'region_default', x: 0, y: 0 },
        { regionId: 'region_east', x: 2, y: 0 },
      ],
      connections: [
        { fromRegionId: 'region_east', toRegionId: 'region_north', distance: 3 },
        { fromRegionId: 'region_default', toRegionId: 'region_north', distance: 2 },
        { fromRegionId: 'region_default', toRegionId: 'region_east', distance: 2 },
      ],
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(
        result.value.getRegionPlacements().map((placement) => placement.regionId.value),
      ).toEqual(['region_default', 'region_east', 'region_north']);
      expect(result.value.getConnections().map((connection) => connection.distance)).toEqual([
        2, 2, 3,
      ]);

      const defaultRegionId = createRegionId('region_default');

      expect(defaultRegionId.ok).toBe(true);

      if (defaultRegionId.ok) {
        expect(result.value.getRegionPlacement(defaultRegionId.value)?.x).toBe(0);
      }
    }
  });

  it('rejects duplicate region placements', () => {
    const result = WorldMap.fromContent({
      id: 'map_invalid',
      name: 'Invalid Map',
      regions: [
        { regionId: 'region_default', x: 0, y: 0 },
        { regionId: 'region_default', x: 1, y: 1 },
      ],
      connections: [],
    });

    expect(result.ok).toBe(false);
  });

  it('rejects self connections and invalid distances', () => {
    const selfConnection = WorldMap.fromContent({
      id: 'map_self',
      name: 'Self Connection',
      regions: [{ regionId: 'region_default', x: 0, y: 0 }],
      connections: [{ fromRegionId: 'region_default', toRegionId: 'region_default', distance: 1 }],
    });

    const invalidDistance = WorldMap.fromContent({
      id: 'map_distance',
      name: 'Invalid Distance',
      regions: [
        { regionId: 'region_default', x: 0, y: 0 },
        { regionId: 'region_east', x: 1, y: 0 },
      ],
      connections: [{ fromRegionId: 'region_default', toRegionId: 'region_east', distance: 0 }],
    });

    expect(selfConnection.ok).toBe(false);
    expect(invalidDistance.ok).toBe(false);
  });
});
