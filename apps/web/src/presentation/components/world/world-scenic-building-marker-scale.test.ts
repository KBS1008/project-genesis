import { describe, expect, it } from 'vitest';
import {
  resolveScenicBuildingMarkerPresentationScale,
  SCENIC_BUILDING_MARKER_SCREEN_BOOST,
} from '@/presentation/components/world/world-scenic-building-marker-scale';

describe('world-scenic-building-marker-scale', () => {
  it('applies bounded inverse scale with scenic boost', () => {
    expect(resolveScenicBuildingMarkerPresentationScale(2)).toBeCloseTo((1 / 2) * SCENIC_BUILDING_MARKER_SCREEN_BOOST, 5);
    expect(resolveScenicBuildingMarkerPresentationScale(1)).toBeCloseTo(SCENIC_BUILDING_MARKER_SCREEN_BOOST, 5);
  });
});
