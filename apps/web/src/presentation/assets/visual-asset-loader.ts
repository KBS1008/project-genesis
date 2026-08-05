import {
  getVisualAssetEntry,
  PRELOAD_VISUAL_ASSET_IDS,
} from '@/presentation/assets/visual-asset-registry';
import type {
  VisualAssetLoadState,
  VisualAssetResolveOptions,
  VisualAssetSources,
} from '@/presentation/assets/visual-asset-types';

const loadStateByPath = new Map<string, VisualAssetLoadState>();
const preloadPromises = new Map<string, Promise<void>>();

let webpSupported: boolean | null = null;

function supportsWebP(): boolean {
  if (webpSupported !== null) {
    return webpSupported;
  }

  if (typeof document === 'undefined') {
    webpSupported = false;
    return webpSupported;
  }

  try {
    const canvas = document.createElement('canvas');
    const dataUrl = canvas.toDataURL('image/webp');
    webpSupported = typeof dataUrl === 'string' && dataUrl.startsWith('data:image/webp');
  } catch {
    webpSupported = false;
  }

  return webpSupported;
}

/** Resets cached WebP capability (primarily for tests). */
export function resetVisualAssetLoaderCache(): void {
  loadStateByPath.clear();
  preloadPromises.clear();
  webpSupported = null;
}

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

function resolveThemePath(
  entry: NonNullable<ReturnType<typeof getVisualAssetEntry>>,
  theme: VisualAssetResolveOptions['theme'],
): string | null {
  if (theme === undefined || entry.themeVariants === null) {
    return null;
  }

  return entry.themeVariants[theme] ?? null;
}

/** Resolves primary + optional WebP sources for an asset ID. */
export function resolveVisualAssetSources(
  assetId: string,
  options: VisualAssetResolveOptions = {},
): VisualAssetSources | null {
  const entry = getVisualAssetEntry(assetId);
  if (entry === null) {
    return null;
  }

  const themePath = resolveThemePath(entry, options.theme);
  const primary = themePath ?? entry.path ?? resolveAssetChain(entry.fallbackId ?? assetId);

  if (primary === null) {
    return null;
  }

  const preferWebp = options.preferWebp ?? true;
  const webp =
    preferWebp && supportsWebP() && entry.webp !== null && entry.format === 'png'
      ? entry.webp
      : null;

  return Object.freeze({ primary, webp });
}

/** Resolves a registry asset ID to a public URL (with theme + format preference). */
export function resolveVisualAssetUrl(
  assetId: string,
  options: VisualAssetResolveOptions = {},
): string | null {
  const sources = resolveVisualAssetSources(assetId, options);
  if (sources === null) {
    return null;
  }

  return sources.webp ?? sources.primary;
}

/** CSS `background-image` value with WebP preference and PNG fallback. */
export function resolveVisualAssetBackgroundImage(
  assetId: string,
  options: VisualAssetResolveOptions = {},
): string | null {
  const sources = resolveVisualAssetSources(assetId, options);
  if (sources === null) {
    return null;
  }

  if (sources.webp === null) {
    return `url("${sources.primary}")`;
  }

  return `image-set(url("${sources.webp}") type("image/webp"), url("${sources.primary}") type("image/png"))`;
}

/** Returns whether the asset is a runtime asset with a resolvable public path. */
export function isRuntimeVisualAsset(assetId: string): boolean {
  const entry = getVisualAssetEntry(assetId);
  return entry !== null && entry.type === 'runtime' && resolveVisualAssetUrl(assetId) !== null;
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
  const paths = assetIds.flatMap((assetId) => {
    const sources = resolveVisualAssetSources(assetId);
    if (sources === null) {
      return [];
    }

    return sources.webp === null ? [sources.primary] : [sources.webp, sources.primary];
  });

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

/** @internal Test helper */
export function setWebpSupportForTests(supported: boolean | null): void {
  webpSupported = supported;
}
