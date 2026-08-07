'use client';

import { useEffect } from 'react';
import {
  resolveVisualAssetBackgroundImage,
  resolveVisualAssetSources,
} from '@/presentation/assets/visual-asset-loader';
import type { VisualAssetResolveOptions } from '@/presentation/assets/visual-asset-types';
import { preloadVisualAssets } from '@/presentation/assets/visual-asset-loader';

type PGVisualAssetBackgroundProps = {
  readonly assetId: string;
  readonly className?: string;
  readonly overlayClassName?: string;
  readonly resolveOptions?: VisualAssetResolveOptions;
};

/** Decorative full-bleed background from the visual asset registry (no embedded PNG text). */
export function PGVisualAssetBackground({
  assetId,
  className = 'pg-visual-asset-background',
  overlayClassName = 'pg-visual-asset-background-overlay',
  resolveOptions,
}: PGVisualAssetBackgroundProps) {
  const backgroundImage = resolveVisualAssetBackgroundImage(assetId, resolveOptions);

  if (backgroundImage === null) {
    return null;
  }

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{ backgroundImage }}
    >
      <div className={overlayClassName} />
    </div>
  );
}

type PGVisualAssetImageProps = {
  readonly assetId: string;
  readonly alt: string;
  readonly className?: string;
  readonly loading?: 'eager' | 'lazy';
  readonly resolveOptions?: VisualAssetResolveOptions;
};

/** Accessible runtime image resolved through the visual asset registry. */
export function PGVisualAssetImage({
  assetId,
  alt,
  className,
  loading = 'lazy',
  resolveOptions,
}: PGVisualAssetImageProps) {
  const sources = resolveVisualAssetSources(assetId, resolveOptions);

  if (sources === null) {
    return null;
  }

  if (sources.webp === null) {
    return (
      <img src={sources.primary} alt={alt} className={className} loading={loading} decoding="async" />
    );
  }

  return (
    <picture>
      <source srcSet={sources.webp} type="image/webp" />
      <img src={sources.primary} alt={alt} className={className} loading={loading} decoding="async" />
    </picture>
  );
}

/** Preloads critical menu assets during boot. */
export function useVisualAssetPreload(assetIds: readonly string[]): void {
  useEffect(() => {
    void preloadVisualAssets(assetIds);
  }, [assetIds]);
}
