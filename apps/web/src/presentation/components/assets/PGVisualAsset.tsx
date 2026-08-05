'use client';

import { useEffect } from 'react';
import { resolveVisualAssetUrl } from '@/presentation/assets/visual-asset-loader';

type PGVisualAssetBackgroundProps = {
  readonly assetId: string;
  readonly className?: string;
  readonly overlayClassName?: string;
};

/** Decorative full-bleed background from the visual asset registry (no embedded PNG text). */
export function PGVisualAssetBackground({
  assetId,
  className = 'pg-visual-asset-background',
  overlayClassName = 'pg-visual-asset-background-overlay',
}: PGVisualAssetBackgroundProps) {
  const url = resolveVisualAssetUrl(assetId);

  if (url === null) {
    return null;
  }

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{ backgroundImage: `url("${url}")` }}
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
};

/** Accessible runtime image resolved through the visual asset registry. */
export function PGVisualAssetImage({
  assetId,
  alt,
  className,
  loading = 'lazy',
}: PGVisualAssetImageProps) {
  const url = resolveVisualAssetUrl(assetId);

  if (url === null) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- registry serves static public assets outside next/image config
    <img src={url} alt={alt} className={className} loading={loading} decoding="async" />
  );
}

/** Preloads critical menu assets during boot. */
export function useVisualAssetPreload(assetIds: readonly string[]): void {
  useEffect(() => {
    void import('@/presentation/assets/visual-asset-loader').then(({ preloadVisualAssets }) =>
      preloadVisualAssets(assetIds),
    );
  }, [assetIds]);
}
