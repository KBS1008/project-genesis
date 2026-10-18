/** Presentation-only scenic map profile (not authoritative world geometry). */

export type ScenicNormalizedAnchor = Readonly<{
  readonly u: number;
  readonly v: number;
}>;

export type WorldScenicPresentationProfile = Readonly<{
  readonly mapId: string;
  readonly plateAssetUrl: string;
  readonly plateWidth: number;
  readonly plateHeight: number;
  readonly regionAnchors: Readonly<Record<string, ScenicNormalizedAnchor>>;
  readonly calibrationStatus: 'provisional' | 'slice2';
}>;

export const WORLD_SCENIC_PLATE_SHA256 =
  '44a1291d7216cfbdaebdd2ccc109d2fd6f239f1e5abe465e1206cdc48d14776b';

export const WORLD_SCENIC_PLATE_ASSET_PATH =
  '/assets/world/world-plate-2d-scenic-static-industry-removed.jpg';

export const WORLD_SCENIC_DEFAULT_MAP_ID = 'map_world_default';

export const WORLD_SCENIC_PLATE_WIDTH = 1280;
export const WORLD_SCENIC_PLATE_HEIGHT = 720;

/**
 * Provisional region anchors (normalized 0–1 on the scenic plate).
 * Pilot-derived starting points; not confirmed production calibration.
 */
export const WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT: WorldScenicPresentationProfile =
  Object.freeze({
    mapId: WORLD_SCENIC_DEFAULT_MAP_ID,
    plateAssetUrl: WORLD_SCENIC_PLATE_ASSET_PATH,
    plateWidth: WORLD_SCENIC_PLATE_WIDTH,
    plateHeight: WORLD_SCENIC_PLATE_HEIGHT,
    calibrationStatus: 'slice2',
    regionAnchors: Object.freeze({
      region_north: Object.freeze({ u: 0.5, v: 0.15 }),
      region_default: Object.freeze({ u: 0.36, v: 0.43 }),
      region_east: Object.freeze({ u: 0.73, v: 0.37 }),
      region_south: Object.freeze({ u: 0.26, v: 0.73 }),
    }),
  });

const PROFILES_BY_MAP_ID: Readonly<Record<string, WorldScenicPresentationProfile>> = Object.freeze({
  [WORLD_SCENIC_DEFAULT_MAP_ID]: WORLD_SCENIC_PRESENTATION_PROFILE_MAP_WORLD_DEFAULT,
});

export function resolveWorldScenicPresentationProfile(
  mapId: string,
): WorldScenicPresentationProfile | null {
  return PROFILES_BY_MAP_ID[mapId] ?? null;
}

export function isValidScenicNormalizedAnchor(anchor: ScenicNormalizedAnchor): boolean {
  return (
    Number.isFinite(anchor.u) &&
    Number.isFinite(anchor.v) &&
    anchor.u >= 0 &&
    anchor.u <= 1 &&
    anchor.v >= 0 &&
    anchor.v <= 1
  );
}
