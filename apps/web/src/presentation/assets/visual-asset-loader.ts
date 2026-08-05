import {
  getVisualAssetEntry,
  PRELOAD_VISUAL_ASSET_IDS,
} from '@/presentation/assets/visual-asset-registry';
import type { VisualAssetLoadState } from '@/presentation/assets/visual-asset-types';

const loadStateByPath = new Map<string, VisualAssetLoadState>();
const preloadPromises = new Map<string, Promise<void>>();

function resolveAssetChain(assetId: string, visited = new Set<string>()): string | null {
  if (visited.has(assetId)) {
    return null;
  }

  visited.add(assetId);
  const entry = getVisualAssetEntry(assetId);

  if (entry === null) {
    return null;
  }

  if (entry.path !== null) {
    return entry.path;
  }

  if (entry.fallbackId !== null) {
    return resolveAssetChain(entry.fallbackId, visited);
  }

  return null;
}

/** Resolves a registry asset ID to a public URL (with optional fallback chain). */
export function resolveVisualAssetUrl(assetId: string): string | null {
  return resolveAssetChain(assetId);
}

/** Returns whether the asset is a runtime asset with a resolvable public path. */
export function isRuntimeVisualAsset(assetId: string): boolean {
  const entry = getVisualAssetEntry(assetId);
  return entry !== null && entry.category === 'runtime' && resolveVisualAssetUrl(assetId) !== null;
}

function preloadImage(path: string): Promise<void> {
  const existing = preloadPromises.get(path);
  if (existing !== undefined) {
    return existing;
  }

  loadStateByPath.set(path, 'loading');

  const promise = new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';

    image.onload = () => {
      loadStateByPath.set(path, 'loaded');
      resolve();
    };

    image.onerror = () => {
      loadStateByPath.set(path, 'error');
      reject(new Error(`Failed to preload visual asset: ${path}`));
    };

    image.src = path;
  }).finally(() => {
    preloadPromises.delete(path);
  });

  preloadPromises.set(path, promise);
  return promise;
}

/** Preloads one or more registry assets into the browser image cache. */
export function preloadVisualAssets(assetIds: readonly string[]): Promise<void> {
  const paths = assetIds
    .map((assetId) => resolveVisualAssetUrl(assetId))
    .filter((path): path is string => path !== null);

  if (paths.length === 0) {
    return Promise.resolve();
  }

  return Promise.allSettled(paths.map((path) => preloadImage(path))).then(() => undefined);
}

/** Preloads all registry assets marked with `preload: true`. */
export function preloadCriticalVisualAssets(): Promise<void> {
  return preloadVisualAssets(PRELOAD_VISUAL_ASSET_IDS);
}

/** Returns cached load state for a resolved asset path. */
export function getVisualAssetLoadState(assetId: string): VisualAssetLoadState {
  const path = resolveVisualAssetUrl(assetId);
  if (path === null) {
    return 'idle';
  }

  return loadStateByPath.get(path) ?? 'idle';
}

/** Clears in-memory preload cache (primarily for tests). */
export function resetVisualAssetLoaderCache(): void {
  loadStateByPath.clear();
  preloadPromises.clear();
}
