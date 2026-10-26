import { describe, expect, it } from 'vitest';
import {
  listWorldRegionLandscapeAssetRegionIds,
  resolveWorldRegionLandscapeAsset,
} from '@/presentation/config/world-region-landscape-assets';

describe('world-region-landscape-assets', () => {
  it('maps all four authoritative region IDs', () => {
    expect([...listWorldRegionLandscapeAssetRegionIds()].sort()).toEqual([
      'region_default',
      'region_east',
      'region_north',
      'region_south',
    ]);
  });

  it('returns deterministic public paths', () => {
    expect(resolveWorldRegionLandscapeAsset('region_default')?.publicPath).toBe(
      '/images/world/regions/central-basin.webp.png',
    );
    expect(resolveWorldRegionLandscapeAsset('region_east')?.publicPath).toContain(
      'eastern-industrial-belt',
    );
  });

  it('does not fall back for unknown regions', () => {
    expect(resolveWorldRegionLandscapeAsset('region_unknown')).toBeNull();
  });
});
