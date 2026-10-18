import { describe, expect, it } from 'vitest';
import {
  isValidScenicNormalizedAnchor,
  resolveWorldScenicPresentationProfile,
  WORLD_SCENIC_DEFAULT_MAP_ID,
  WORLD_SCENIC_PLATE_ASSET_PATH,
  WORLD_SCENIC_PLATE_HEIGHT,
  WORLD_SCENIC_PLATE_WIDTH,
  WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT,
} from '@/presentation/adapters/mappers/world-scenic-presentation-profile';

describe('world-scenic-presentation-profile', () => {
  it('resolves the default map profile with asset metadata', () => {
    const profile = resolveWorldScenicPresentationProfile(WORLD_SCENIC_DEFAULT_MAP_ID);
    expect(profile).toEqual(WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT);
    expect(profile?.plateAssetUrl).toBe(WORLD_SCENIC_PLATE_ASSET_PATH);
    expect(profile?.plateWidth).toBe(WORLD_SCENIC_PLATE_WIDTH);
    expect(profile?.plateHeight).toBe(WORLD_SCENIC_PLATE_HEIGHT);
  });

  it('includes all four region anchors in normalized coordinates', () => {
    const profile = WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT;
    expect(profile.calibrationStatus).toBe('slice2');
    const anchors = profile.regionAnchors;
    expect(Object.keys(anchors).sort()).toEqual([
      'region_default',
      'region_east',
      'region_north',
      'region_south',
    ]);

    for (const anchor of Object.values(anchors)) {
      expect(isValidScenicNormalizedAnchor(anchor)).toBe(true);
    }

    expect(anchors.region_south).toEqual({ u: 0.26, v: 0.73 });
    expect(anchors.region_north).toEqual({ u: 0.5, v: 0.15 });
  });

  it('returns null for unknown maps', () => {
    expect(resolveWorldScenicPresentationProfile('map_unknown')).toBeNull();
  });
});
