import { createRegionId } from '../../region/RegionId.js';
import { WorldMap } from '../../world/WorldMap.js';
import { RegionConnectivityPolicy } from './RegionConnectivityPolicy.js';

function createTestMap() {
  const mapResult = WorldMap.fromContent({
    id: 'map_world_default',
    name: 'Genesis World Map',
    regions: [
      { regionId: 'region_default', x: 0, y: 0 },
      { regionId: 'region_east', x: 2, y: 0 },
      { regionId: 'region_north', x: 0, y: 2 },
    ],
    connections: [
      { fromRegionId: 'region_default', toRegionId: 'region_east', distance: 2 },
      { fromRegionId: 'region_default', toRegionId: 'region_north', distance: 2 },
      { fromRegionId: 'region_east', toRegionId: 'region_north', distance: 3 },
    ],
  });

  if (!mapResult.ok) {
    throw new Error(mapResult.error.message);
  }

  return mapResult.value;
}

describe('RegionConnectivityPolicy', () => {
  const map = createTestMap();

  it('returns zero distance for the same region', () => {
    const regionIdResult = createRegionId('region_default');

    expect(regionIdResult.ok).toBe(true);

    if (regionIdResult.ok) {
      const distanceResult = RegionConnectivityPolicy.resolveDistance({
        map,
        fromRegionId: regionIdResult.value,
        toRegionId: regionIdResult.value,
      });

      expect(distanceResult.ok).toBe(true);

      if (distanceResult.ok) {
        expect(distanceResult.value).toBe(0);
      }
    }
  });

  it('returns direct connection distance in either direction', () => {
    const defaultRegionId = createRegionId('region_default');
    const eastRegionId = createRegionId('region_east');

    expect(defaultRegionId.ok).toBe(true);
    expect(eastRegionId.ok).toBe(true);

    if (defaultRegionId.ok && eastRegionId.ok) {
      const forward = RegionConnectivityPolicy.resolveDistance({
        map,
        fromRegionId: defaultRegionId.value,
        toRegionId: eastRegionId.value,
      });
      const reverse = RegionConnectivityPolicy.resolveDistance({
        map,
        fromRegionId: eastRegionId.value,
        toRegionId: defaultRegionId.value,
      });

      expect(forward.ok).toBe(true);
      expect(reverse.ok).toBe(true);

      if (forward.ok && reverse.ok) {
        expect(forward.value).toBe(2);
        expect(reverse.value).toBe(2);
      }
    }
  });

  it('fails explicitly for disconnected regions', () => {
    const eastRegionId = createRegionId('region_east');
    const northRegionId = createRegionId('region_north');

    expect(eastRegionId.ok).toBe(true);
    expect(northRegionId.ok).toBe(true);

    if (eastRegionId.ok && northRegionId.ok) {
      expect(
        RegionConnectivityPolicy.areConnected({
          map,
          fromRegionId: eastRegionId.value,
          toRegionId: northRegionId.value,
        }),
      ).toBe(true);

      const disconnectedDefault = createRegionId('region_default');
      const disconnectedEast = createRegionId('region_east');

      if (disconnectedDefault.ok && disconnectedEast.ok) {
        const brokenMapResult = WorldMap.fromContent({
          id: 'map_broken',
          name: 'Broken Map',
          regions: [
            { regionId: 'region_default', x: 0, y: 0 },
            { regionId: 'region_east', x: 2, y: 0 },
          ],
          connections: [],
        });

        expect(brokenMapResult.ok).toBe(true);

        if (brokenMapResult.ok) {
          const distanceResult = RegionConnectivityPolicy.resolveDistance({
            map: brokenMapResult.value,
            fromRegionId: disconnectedDefault.value,
            toRegionId: disconnectedEast.value,
          });

          expect(distanceResult.ok).toBe(false);
        }
      }
    }
  });
});
