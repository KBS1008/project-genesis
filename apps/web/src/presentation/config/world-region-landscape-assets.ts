/** Authoritative region → static landscape asset mapping (Slice 1). */

export type WorldRegionLandscapeAsset = Readonly<{
  readonly regionId: string;
  readonly displayName: string;
  readonly publicPath: string;
  readonly naturalWidth: number;
  readonly naturalHeight: number;
}>;

const REGION_LANDSCAPE_ASSETS: Readonly<Record<string, WorldRegionLandscapeAsset>> = Object.freeze({
  region_default: Object.freeze({
    regionId: 'region_default',
    displayName: 'Central Basin',
    publicPath: '/images/world/regions/central-basin.webp.png',
    naturalWidth: 1536,
    naturalHeight: 1024,
  }),
  region_east: Object.freeze({
    regionId: 'region_east',
    displayName: 'Eastern Industrial Belt',
    publicPath: '/images/world/regions/eastern-industrial-belt.webp.png',
    naturalWidth: 1536,
    naturalHeight: 1024,
  }),
  region_north: Object.freeze({
    regionId: 'region_north',
    displayName: 'Northern Highlands',
    publicPath: '/images/world/regions/northern-highlands.webp.png',
    naturalWidth: 1536,
    naturalHeight: 1024,
  }),
  region_south: Object.freeze({
    regionId: 'region_south',
    displayName: 'Southern Coastal Belt',
    publicPath: '/images/world/regions/southern-coastal-belt.webp.png',
    naturalWidth: 1536,
    naturalHeight: 1024,
  }),
});

export function resolveWorldRegionLandscapeAsset(
  regionId: string,
): WorldRegionLandscapeAsset | null {
  return REGION_LANDSCAPE_ASSETS[regionId] ?? null;
}

export function listWorldRegionLandscapeAssetRegionIds(): readonly string[] {
  return Object.freeze(Object.keys(REGION_LANDSCAPE_ASSETS));
}
