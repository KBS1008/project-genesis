/**
 * Regional landscape building artwork (Slice 2C).
 * Presentation-only mapping from building type IDs to map sprites.
 */

export type WorldRegionBuildingVisualSpec = {
  readonly assetUrl: string;
  /** Display width in CSS pixels on the regional map. */
  readonly displayWidthPx: number;
  /** Display height in CSS pixels on the regional map. */
  readonly displayHeightPx: number;
  /**
   * Ground anchor within the image (0–1), used for `transform-origin` so the
   * structure sits on the projected domain coordinate.
   */
  readonly anchorX: number;
  readonly anchorY: number;
  /** Minimum hit target (accessibility / touch). */
  readonly hitWidthPx: number;
  readonly hitHeightPx: number;
};

const REGION_BUILDING_ASSET_BASE = '/images/world/buildings';

const DEFAULT_SPEC: WorldRegionBuildingVisualSpec = Object.freeze({
  assetUrl: `${REGION_BUILDING_ASSET_BASE}/headquarters.png`,
  displayWidthPx: 78,
  displayHeightPx: 66,
  anchorX: 0.5,
  anchorY: 1,
  hitWidthPx: 56,
  hitHeightPx: 44,
});

const TYPE_SPECS: Readonly<Record<string, WorldRegionBuildingVisualSpec>> = Object.freeze({
  headquarters: Object.freeze({
    assetUrl: `${REGION_BUILDING_ASSET_BASE}/headquarters.png`,
    displayWidthPx: 78,
    displayHeightPx: 66,
    anchorX: 0.5,
    anchorY: 1,
    hitWidthPx: 56,
    hitHeightPx: 44,
  }),
  corporate_headquarters: Object.freeze({
    assetUrl: `${REGION_BUILDING_ASSET_BASE}/headquarters.png`,
    displayWidthPx: 78,
    displayHeightPx: 66,
    anchorX: 0.5,
    anchorY: 1,
    hitWidthPx: 56,
    hitHeightPx: 44,
  }),
  regional_headquarters: Object.freeze({
    assetUrl: `${REGION_BUILDING_ASSET_BASE}/headquarters.png`,
    displayWidthPx: 78,
    displayHeightPx: 66,
    anchorX: 0.5,
    anchorY: 1,
    hitWidthPx: 56,
    hitHeightPx: 44,
  }),
  warehouse: Object.freeze({
    assetUrl: `${REGION_BUILDING_ASSET_BASE}/warehouse.png`,
    displayWidthPx: 96,
    displayHeightPx: 62,
    anchorX: 0.5,
    anchorY: 1,
    hitWidthPx: 64,
    hitHeightPx: 40,
  }),
  distribution_center: Object.freeze({
    assetUrl: `${REGION_BUILDING_ASSET_BASE}/warehouse.png`,
    displayWidthPx: 96,
    displayHeightPx: 62,
    anchorX: 0.5,
    anchorY: 1,
    hitWidthPx: 64,
    hitHeightPx: 40,
  }),
  power_substation: Object.freeze({
    assetUrl: `${REGION_BUILDING_ASSET_BASE}/substation.png`,
    displayWidthPx: 72,
    displayHeightPx: 60,
    anchorX: 0.5,
    anchorY: 1,
    hitWidthPx: 52,
    hitHeightPx: 40,
  }),
  access_road: Object.freeze({
    assetUrl: `${REGION_BUILDING_ASSET_BASE}/access-road.png`,
    displayWidthPx: 84,
    displayHeightPx: 34,
    anchorX: 0.5,
    anchorY: 1,
    hitWidthPx: 68,
    hitHeightPx: 32,
  }),
  sawmill: Object.freeze({
    assetUrl: `${REGION_BUILDING_ASSET_BASE}/sawmill.png`,
    displayWidthPx: 104,
    displayHeightPx: 80,
    anchorX: 0.5,
    anchorY: 1,
    hitWidthPx: 56,
    hitHeightPx: 44,
  }),
});

/** Resolves regional map building artwork for a building type id. */
export function resolveWorldRegionBuildingVisualSpec(
  buildingTypeId: string,
): WorldRegionBuildingVisualSpec {
  return TYPE_SPECS[buildingTypeId] ?? DEFAULT_SPEC;
}

/** Public asset URL for regional building sprites (null when unknown). */
export function resolveWorldRegionBuildingAssetUrl(buildingTypeId: string): string | null {
  const spec = TYPE_SPECS[buildingTypeId];
  return spec?.assetUrl ?? null;
}
