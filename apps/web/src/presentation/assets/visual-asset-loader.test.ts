// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getVisualAssetLoadState,
  isRuntimeVisualAsset,
  preloadVisualAssets,
  resetVisualAssetLoaderCache,
  resolveVisualAssetBackgroundImage,
  resolveVisualAssetSources,
  resolveVisualAssetUrl,
  setWebpSupportForTests,
} from '@/presentation/assets/visual-asset-loader';

describe('visual-asset-loader', () => {
  afterEach(() => {
    resetVisualAssetLoaderCache();
    vi.restoreAllMocks();
  });

  it('resolves runtime asset URLs from the registry', () => {
    setWebpSupportForTests(false);
    expect(resolveVisualAssetUrl('MM-006')).toBe('/assets/main-menu/MM-006.png');
    expect(resolveVisualAssetUrl('DB-001')).toBeNull();
    expect(resolveVisualAssetUrl('missing')).toBeNull();
  });

  it('prefers WebP when supported and registered', () => {
    setWebpSupportForTests(true);
    expect(resolveVisualAssetUrl('MM-006')).toBe('/assets/main-menu/MM-006.webp');
    expect(resolveVisualAssetSources('MM-006')).toEqual({
      primary: '/assets/main-menu/MM-006.png',
      webp: '/assets/main-menu/MM-006.webp',
    });
  });

  it('builds CSS background-image with WebP and PNG fallback', () => {
    setWebpSupportForTests(true);
    expect(resolveVisualAssetBackgroundImage('MM-006')).toBe(
      'image-set(url("/assets/main-menu/MM-006.webp") type("image/webp"), url("/assets/main-menu/MM-006.png") type("image/png"))',
    );
  });

  it('identifies runtime assets', () => {
    setWebpSupportForTests(false);
    expect(isRuntimeVisualAsset('MM-001')).toBe(true);
    expect(isRuntimeVisualAsset('DB-002')).toBe(false);
  });

  it('preloads runtime assets without throwing on success', async () => {
    setWebpSupportForTests(false);
    const originalImage = globalThis.Image;
    globalThis.Image = class {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      decoding = 'async';
      src = '';

      constructor() {
        queueMicrotask(() => {
          this.onload?.();
        });
      }
    } as unknown as typeof Image;

    await expect(preloadVisualAssets(['MM-006', 'MM-007'])).resolves.toBeUndefined();
    expect(getVisualAssetLoadState('MM-006')).toBe('loaded');

    globalThis.Image = originalImage;
  });

  it('records error state when preload fails', async () => {
    setWebpSupportForTests(false);
    const originalImage = globalThis.Image;
    globalThis.Image = class {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      decoding = 'async';
      src = '';

      constructor() {
        queueMicrotask(() => {
          this.onerror?.();
        });
      }
    } as unknown as typeof Image;

    await expect(preloadVisualAssets(['MM-001'])).resolves.toBeUndefined();
    expect(getVisualAssetLoadState('MM-001')).toBe('error');

    globalThis.Image = originalImage;
  });
});
