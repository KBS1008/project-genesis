'use client';

import { useState } from 'react';
import { resolveVisualAssetSources } from '@/presentation/assets/visual-asset-loader';
import { resolveResourceIconAssetId } from '@/presentation/assets/resource-icon-asset-ids';

type ResourceIconProps = {
  readonly resourceId: string;
  readonly className?: string;
};

/** Decorative resource artwork resolved from certified ICON-001 registry entries. */
export function ResourceIcon({ resourceId, className = 'pg-resource-icon' }: ResourceIconProps) {
  const assetId = resolveResourceIconAssetId(resourceId);
  const [hidden, setHidden] = useState(false);

  if (assetId === null || hidden) {
    return null;
  }

  const sources = resolveVisualAssetSources(assetId);

  if (sources === null) {
    return null;
  }

  const imageProps = {
    alt: '',
    className,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    'aria-hidden': true as const,
    onError: () => {
      setHidden(true);
    },
  };

  if (sources.webp === null) {
    return <img src={sources.primary} {...imageProps} />;
  }

  return (
    <picture>
      <source srcSet={sources.webp} type="image/webp" />
      <img src={sources.primary} {...imageProps} />
    </picture>
  );
}
