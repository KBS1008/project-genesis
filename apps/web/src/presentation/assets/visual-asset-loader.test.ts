// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getVisualAssetLoadState,
  isRuntimeVisualAsset,
  preloadVisualAssets,
  resetVisualAssetLoaderCache,
  resolveVisualAssetUrl,
} from '@/presentation/assets/visual-asset-loader';

describe('visual-asset-loader', () => {
  afterEach(() => {
    resetVisualAssetLoaderCache();
    vi.restoreAllMocks();
  });

  it('resolves runtime asset URLs from the registry', () => {
    expect(resolveVisualAssetUrl('MM-006')).toBe('/assets/main-menu/MM-006.png');
    expect(resolveVisualAssetUrl('DB-001')).toBeNull();
    expect(resolveVisualAssetUrl('missing')).toBeNull();
  });

  it('identifies runtime assets', () => {
    expect(isRuntimeVisualAsset('MM-001')).toBe(true);
    expect(isRuntimeVisualAsset('DB-002')).toBe(false);
  });

  it('preloads runtime assets without throwing on success', async () => {
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
