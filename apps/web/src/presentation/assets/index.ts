export type {
  VisualAssetCategory,
  VisualAssetEntry,
  VisualAssetFormat,
  VisualAssetLoadState,
  VisualAssetPriority,
  VisualAssetResolveOptions,
  VisualAssetSources,
  VisualAssetTheme,
  VisualAssetThemePaths,
  VisualAssetThemeVariant,
  VisualAssetType,
} from '@/presentation/assets/visual-asset-types';

export {
  getVisualAssetEntry,
  listVisualAssetsByCategory,
  listVisualAssetsByType,
  PRELOAD_VISUAL_ASSET_IDS,
  RUNTIME_VISUAL_ASSET_IDS,
  VISUAL_ASSET_REGISTRY,
} from '@/presentation/assets/visual-asset-registry';

export {
  getVisualAssetLoadState,
  isRuntimeVisualAsset,
  preloadCriticalVisualAssets,
  preloadVisualAssets,
  resetVisualAssetLoaderCache,
  resolveVisualAssetBackgroundImage,
  resolveVisualAssetSources,
  resolveVisualAssetUrl,
  setWebpSupportForTests,
} from '@/presentation/assets/visual-asset-loader';

export {
  ICON_001_RESOURCE_IDS,
  resourceIdToIconAssetId,
  resolveResourceIconAssetId,
} from '@/presentation/assets/resource-icon-asset-ids';

export {
  BUILDING_CATEGORY_ICON_CATEGORIES,
  BUILDING_CATEGORY_TO_ICON_002_ASSET_ID,
  ICON_002_BUILDING_CATEGORY_ASSET_IDS,
  ICON_002_CERTIFIED_SVG_BY_ASSET_ID,
  ICON_002_DESIGN_SOURCE_BY_ASSET_ID,
} from '@/presentation/assets/icon-002-certified-svg-sources';

export {
  buildingCategoryToIconAssetId,
  resolveBuildingCategoryIconAssetId,
  resolveBuildingCategoryIconSvgMarkup,
} from '@/presentation/assets/building-category-icon-asset-ids';

export { certifyIcon002Svg } from '@/presentation/assets/icon-002-svg-certification';

export { DASHBOARD_MOCKUP_COMPONENT_MAP } from '@/presentation/assets/dashboard-asset-mapping';
