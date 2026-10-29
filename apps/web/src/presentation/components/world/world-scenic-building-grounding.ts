/**
 * Presentation-only scenic grounding offsets (Option 2 — scale/perspective review).
 * Does not change world coordinates, hit targets, or sprite dimensions.
 */

/** Plate lighting reads as upper-left; contact shadow bias (local marker units). */
export const SCENIC_BUILDING_GROUNDING_SHADOW_OFFSET_X = 1.75;
export const SCENIC_BUILDING_GROUNDING_SHADOW_OFFSET_Y = 0.35;

/** Shift decorative stack so sprite baseline sits on anchor (local units). */
export const SCENIC_BUILDING_GROUNDING_VISUAL_STACK_OFFSET_Y = 2.25;

export type ScenicBuildingContactShadowLayout = Readonly<{
  readonly cx: number;
  readonly cy: number;
  readonly rx: number;
  readonly ry: number;
}>;

/** Elliptical contact shadow aligned to footprint; scales with silhouette, not sprite scale. */
export function resolveScenicBuildingContactShadowLayout(
  halfHit: number,
  silhouetteRadius: number,
): ScenicBuildingContactShadowLayout {
  return Object.freeze({
    cx: halfHit + SCENIC_BUILDING_GROUNDING_SHADOW_OFFSET_X,
    cy: halfHit + silhouetteRadius * 0.52 + SCENIC_BUILDING_GROUNDING_SHADOW_OFFSET_Y,
    rx: silhouetteRadius * 0.98,
    ry: silhouetteRadius * 0.22,
  });
}
