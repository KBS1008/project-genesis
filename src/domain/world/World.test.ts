import { createRegionId } from '../region/RegionId.js';
import { World } from './World.js';

describe('World', () => {
  it('creates a world with deterministic sorted region ids', () => {
    const result = World.fromContent({
      id: 'world_default',
      name: 'Genesis World',
      regionIds: ['region_east', 'region_default', 'region_north'],
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.getName()).toBe('Genesis World');
      expect(result.value.getRegionIds().map((regionId) => regionId.value)).toEqual([
        'region_default',
        'region_east',
        'region_north',
      ]);
    }
  });

  it('reports region membership', () => {
    const worldResult = World.fromContent({
      id: 'world_default',
      name: 'Genesis World',
      regionIds: ['region_default'],
    });
    const regionIdResult = createRegionId('region_default');

    expect(worldResult.ok).toBe(true);
    expect(regionIdResult.ok).toBe(true);

    if (worldResult.ok && regionIdResult.ok) {
      expect(worldResult.value.containsRegion(regionIdResult.value)).toBe(true);
    }
  });

  it('rejects invalid world ids', () => {
    const result = World.fromContent({
      id: '',
      name: 'Invalid',
      regionIds: [],
    });

    expect(result.ok).toBe(false);
  });
});
