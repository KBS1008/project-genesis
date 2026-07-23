import { describe, expect, it } from 'vitest';
import { buildBuildingNavigationTarget, buildRegionNavigationTarget } from './entity-navigation';

describe('entity-navigation', () => {
  it('builds world and company navigation targets', () => {
    expect(buildRegionNavigationTarget('region_001')).toEqual({
      screen: 'world',
      entitySelection: { kind: 'region', id: 'region_001' },
    });

    expect(buildBuildingNavigationTarget('building_001')).toEqual({
      screen: 'company',
      entitySelection: { kind: 'building', id: 'building_001' },
    });
  });
});
