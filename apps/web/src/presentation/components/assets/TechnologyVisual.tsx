'use client';

import { useState } from 'react';
import {
  resolveIcon004TechnologyVisualAssetIds,
  resolveTechnologyCategory,
  technologyCategoryToIcon004CompactAssetId,
} from '@/presentation/assets/technology-visual-asset-ids';
import { resolveVisualAssetUrl } from '@/presentation/assets/visual-asset-loader';

export type TechnologyVisualVariant = 'catalog' | 'compact';

type TechnologyVisualProps = {
  readonly technologyId: string;
  readonly variant?: TechnologyVisualVariant;
  readonly size?: number;
  readonly className?: string;
  readonly alt?: string;
  readonly loading?: 'lazy' | 'eager';
};

/**
 * ICON-004 two-tier resolver: detailed primary when production-approved, else category compact.
 */
export function TechnologyVisual({
  technologyId,
  variant = 'catalog',
  size = 80,
  className = 'pg-technology-visual',
  alt = '',
  loading = 'lazy',
}: TechnologyVisualProps) {
  const presentationAlt = alt.length > 0 ? alt : '';
  const [failedPrimary, setFailedPrimary] = useState(false);
  const [failedCompact, setFailedCompact] = useState(false);

  const { primaryAssetId, categoryAssetId, fallbackAssetId } =
    resolveIcon004TechnologyVisualAssetIds(technologyId);

  const compactSize = variant === 'catalog' && primaryAssetId !== null ? 40 : size;
  const primarySize = size;

  const primaryUrl =
    failedPrimary || primaryAssetId === null || variant === 'compact'
      ? null
      : resolveVisualAssetUrl(primaryAssetId, { preferWebp: false });

  const category =
    resolveTechnologyCategory(technologyId) ??
    (categoryAssetId?.replace('ICON-004-category-', '') ?? null);

  const compactAssetId =
    categoryAssetId ??
    (category !== null ? technologyCategoryToIcon004CompactAssetId(category) : null);

  const compactUrl =
    failedCompact || compactAssetId === null ? null : resolveVisualAssetUrl(compactAssetId);

  const fallbackUrl = resolveVisualAssetUrl(fallbackAssetId);

  if (primaryUrl !== null) {
    return (
      <img
        src={primaryUrl}
        alt={presentationAlt}
        width={primarySize}
        height={primarySize}
        className={className}
        loading={loading}
        decoding="async"
        role={presentationAlt.length === 0 ? 'presentation' : undefined}
        aria-hidden={presentationAlt.length === 0 ? true : undefined}
        onError={() => {
          setFailedPrimary(true);
        }}
      />
    );
  }

  const compactOrFallback = failedCompact ? fallbackUrl : (compactUrl ?? fallbackUrl);

  if (compactOrFallback !== null) {
    return (
      <img
        src={compactOrFallback}
        alt={presentationAlt}
        width={compactSize}
        height={compactSize}
        className={`${className} pg-technology-visual-compact`}
        loading={loading}
        decoding="async"
        role={presentationAlt.length === 0 ? 'presentation' : undefined}
        aria-hidden={presentationAlt.length === 0 ? true : undefined}
        onError={() => {
          if (compactUrl !== null) {
            setFailedCompact(true);
          }
        }}
      />
    );
  }

  return null;
}
