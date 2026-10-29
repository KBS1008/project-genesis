import { resolveScenicRegionLabelInverseScale } from '@/presentation/components/world/world-scenic-region-label-scale';

/** Target apparent screen boost for scenic building glyphs (presentation-only). */
export const SCENIC_BUILDING_MARKER_SCREEN_BOOST = 1.1;

/**
 * Counter-scales building markers under the viewport camera transform so ICON-003 glyphs stay
 * recognizable on the scenic world map without unbounded growth at high zoom.
 */
export function resolveScenicBuildingMarkerPresentationScale(viewportScale: number): number {
  const inverse = resolveScenicRegionLabelInverseScale(viewportScale);
  return inverse * SCENIC_BUILDING_MARKER_SCREEN_BOOST;
}
