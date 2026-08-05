export type {
  VisualAssetCategory,
  VisualAssetEntry,
  VisualAssetLoadState,
  VisualAssetPriority,
  VisualAssetTheme,
} from '@/presentation/assets/visual-asset-types';

export {
  getVisualAssetEntry,
  listVisualAssetsByCategory,
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
  resolveVisualAssetUrl,
} from '@/presentation/assets/visual-asset-loader';

export { DASHBOARD_MOCKUP_COMPONENT_MAP } from '@/presentation/assets/dashboard-asset-mapping';
