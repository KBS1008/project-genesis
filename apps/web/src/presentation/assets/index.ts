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

export { DASHBOARD_MOCKUP_COMPONENT_MAP } from '@/presentation/assets/dashboard-asset-mapping';
