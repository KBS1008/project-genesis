import { describe, expect, it } from 'vitest';
import {
  filterBuildingMarkersForRegionFocus,
  isRegionFocusViewMode,
  shouldShowIndividualBuildingMarkers,
} from '@/presentation/hooks/world-map-view-mode';

describe('world-map-view-mode', () => {
  it('detects region focus mode', () => {
    expect(isRegionFocusViewMode('overview', 'region_east')).toBe(false);
    expect(isRegionFocusViewMode('region_focus', null)).toBe(false);
    expect(isRegionFocusViewMode('region_focus', 'region_east')).toBe(true);
  });

  it('filters building markers in region focus', () => {
    const markers = [
      { id: 'a', regionId: 'region_default' },
      { id: 'b', regionId: 'region_east' },
    ];
    expect(filterBuildingMarkersForRegionFocus(markers, 'overview', 'region_east')).toEqual(markers);
    expect(filterBuildingMarkersForRegionFocus(markers, 'region_focus', 'region_east')).toEqual([
      { id: 'b', regionId: 'region_east' },
    ]);
  });

  it('keeps overview canvas free of building markers (region map uses PGRegionMapView)', () => {
    expect(shouldShowIndividualBuildingMarkers('overview', null, true)).toBe(false);
    expect(shouldShowIndividualBuildingMarkers('overview', 'region_default', true)).toBe(false);
    expect(shouldShowIndividualBuildingMarkers('region_focus', 'region_east', true)).toBe(false);
    expect(shouldShowIndividualBuildingMarkers('region_focus', 'region_east', false)).toBe(false);
  });
});
