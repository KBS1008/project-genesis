'use client';

import { useState } from 'react';
import { BuildingCategoryIcon } from '@/presentation/components/assets/BuildingCategoryIcon';
import {
  buildingTypeToIcon003CompactAssetId,
  buildingTypeToIcon003PrimaryAssetId,
} from '@/presentation/assets/building-type-visual-asset-ids';
import { resolveVisualAssetUrl } from '@/presentation/assets/visual-asset-loader';

export type BuildingTypeIconVariant = 'primary' | 'compact';

type BuildingTypeIconProps = {
  readonly buildingTypeId: string;
  readonly category: string;
  readonly variant?: BuildingTypeIconVariant;
  readonly size?: number;
  readonly className?: string;
  readonly alt?: string;
  readonly loading?: 'lazy' | 'eager';
};

/**
 * Resolves building-type visual identity (ICON-003) with ICON-002 category fallback.
 */
export function BuildingTypeIcon({
  buildingTypeId,
  category,
  variant = 'primary',
  size = 64,
  className = 'pg-building-type-icon',
  alt = '',
  loading = 'lazy',
}: BuildingTypeIconProps) {
  const presentationAlt = alt.length > 0 ? alt : '';
  const [failed, setFailed] = useState(false);

  const assetId =
    variant === 'compact'
      ? buildingTypeToIcon003CompactAssetId(buildingTypeId)
      : buildingTypeToIcon003PrimaryAssetId(buildingTypeId);

  const url = failed || assetId === null ? null : resolveVisualAssetUrl(assetId);

  if (url !== null) {
    return (
      <img
        src={url}
        alt={presentationAlt}
        width={size}
        height={size}
        className={className}
        loading={loading}
        decoding="async"
        role={presentationAlt.length === 0 ? 'presentation' : undefined}
        aria-hidden={presentationAlt.length === 0 ? true : undefined}
        onError={() => {
          setFailed(true);
        }}
      />
    );
  }

  return <BuildingCategoryIcon category={category} className={`${className} pg-building-type-icon-fallback`} />;
}
