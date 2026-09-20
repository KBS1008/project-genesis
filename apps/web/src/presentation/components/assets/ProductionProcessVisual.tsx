'use client';

import { useState } from 'react';
import { resolveIcon005ProcessVisualAssetIds } from '@/presentation/assets/process-visual-asset-ids';
import { resolveVisualAssetUrl } from '@/presentation/assets/visual-asset-loader';

type ProductionProcessVisualProps = {
  readonly recipeId: string;
  readonly size?: number;
  readonly className?: string;
  readonly alt?: string;
  readonly loading?: 'lazy' | 'eager';
};

/** ICON-005 process primary with category-style fallback when unmapped or load fails. */
export function ProductionProcessVisual({
  recipeId,
  size = 80,
  className = 'pg-production-process-visual',
  alt = '',
  loading = 'lazy',
}: ProductionProcessVisualProps) {
  const presentationAlt = alt.length > 0 ? alt : '';
  const [failedPrimary, setFailedPrimary] = useState(false);

  const { primaryAssetId, fallbackAssetId } = resolveIcon005ProcessVisualAssetIds(recipeId);

  const primaryUrl =
    failedPrimary || primaryAssetId === null
      ? null
      : resolveVisualAssetUrl(primaryAssetId, { preferWebp: false });

  const fallbackUrl = resolveVisualAssetUrl(fallbackAssetId);

  const src = primaryUrl ?? fallbackUrl;

  if (src === null) {
    return null;
  }

  return (
    <img
      src={src}
      alt={presentationAlt}
      width={size}
      height={size}
      className={className}
      loading={loading}
      decoding="async"
      role={presentationAlt.length === 0 ? 'presentation' : undefined}
      aria-hidden={presentationAlt.length === 0 ? true : undefined}
      onError={() => {
        if (primaryUrl !== null) {
          setFailedPrimary(true);
        }
      }}
    />
  );
}
