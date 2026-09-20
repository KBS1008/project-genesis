'use client';

import { useState } from 'react';
import { resolveWorkforceRoleVisualAssetIds } from '@/presentation/assets/workforce-visual-asset-ids';
import { resolveVisualAssetUrl } from '@/presentation/assets/visual-asset-loader';

type WorkforceRoleVisualProps = {
  readonly employeeTypeId: string;
  readonly size?: number;
  readonly className?: string;
  readonly alt?: string;
  readonly loading?: 'lazy' | 'eager';
};

/** WFV-001 Batch-1 hybrid primary with category ICON-002 fallback for remaining roles. */
export function WorkforceRoleVisual({
  employeeTypeId,
  size = 80,
  className = 'pg-workforce-role-visual',
  alt = '',
  loading = 'lazy',
}: WorkforceRoleVisualProps) {
  const presentationAlt = alt.length > 0 ? alt : '';
  const [failedPrimary, setFailedPrimary] = useState(false);

  const { primaryAssetId, fallbackAssetId } = resolveWorkforceRoleVisualAssetIds(employeeTypeId);

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
      data-workforce-primary={primaryUrl !== null ? 'true' : 'false'}
      onError={() => {
        if (primaryUrl !== null) {
          setFailedPrimary(true);
        }
      }}
    />
  );
}
