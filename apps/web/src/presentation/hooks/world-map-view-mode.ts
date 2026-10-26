/** Presentation-only world map modes (not domain state). */
export type WorldMapViewMode = 'overview' | 'region_focus';

export function isRegionFocusViewMode(
  mode: WorldMapViewMode,
  selectedRegionId: string | null,
): boolean {
  return mode === 'region_focus' && selectedRegionId !== null;
}

export function filterBuildingMarkersForRegionFocus<
  T extends { readonly regionId: string },
>(markers: readonly T[], mode: WorldMapViewMode, focusRegionId: string | null): readonly T[] {
  if (!isRegionFocusViewMode(mode, focusRegionId) || focusRegionId === null) {
    return markers;
  }

  return markers.filter((marker) => marker.regionId === focusRegionId);
}

/** REGION_MAP uses `region_focus` view mode (dedicated landscape, not overview camera zoom). */
export function isRegionMapPresentationMode(
  mode: WorldMapViewMode,
  selectedRegionId: string | null,
): boolean {
  return isRegionFocusViewMode(mode, selectedRegionId);
}

/** World overview canvas: no building markers (Slice 2A uses `PGRegionMapView` markers). */
export function shouldShowIndividualBuildingMarkers(
  mode: WorldMapViewMode,
  selectedRegionId: string | null,
  buildingsLayerEnabled: boolean,
): boolean {
  if (!buildingsLayerEnabled) {
    return false;
  }

  if (isRegionMapPresentationMode(mode, selectedRegionId)) {
    return false;
  }

  return false;
}
