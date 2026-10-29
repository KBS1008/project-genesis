/**
 * Computes inverse scale for scenic region labels so apparent screen size stays bounded when the
 * world canvas transform scales with camera zoom (Slice — composition upgrade).
 */
export function resolveScenicRegionLabelInverseScale(viewportScale: number): number {
  if (!Number.isFinite(viewportScale) || viewportScale <= 0) {
    return 1;
  }

  const clampedViewport = Math.min(Math.max(viewportScale, 0.55), 4);
  return 1 / clampedViewport;
}

/** Hide non-selected scenic labels when zoomed out below this viewport scale. */
export const SCENIC_REGION_LABEL_MIN_VIEWPORT_SCALE = 0.92;

export function shouldRenderScenicRegionLabel(
  isSelected: boolean,
  viewportScale: number,
  labelsEnabled: boolean,
): boolean {
  if (!labelsEnabled) {
    return false;
  }

  if (isSelected) {
    return true;
  }

  return viewportScale >= SCENIC_REGION_LABEL_MIN_VIEWPORT_SCALE;
}
