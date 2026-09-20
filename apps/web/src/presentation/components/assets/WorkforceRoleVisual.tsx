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

/**
 * WFV-001 production primary when mapped; ICON-002 category fallback only when unmapped.
 * Enabled production roles must never silently downgrade to category fallback on img error.
 */
export function WorkforceRoleVisual({
  employeeTypeId,
  size = 80,
  className = 'pg-workforce-role-visual',
  alt = '',
  loading = 'lazy',
}: WorkforceRoleVisualProps) {
  const presentationAlt = alt.length > 0 ? alt : '';
  const [primaryLoadFailed, setPrimaryLoadFailed] = useState(false);

  const { primaryAssetId, fallbackAssetId } = resolveWorkforceRoleVisualAssetIds(employeeTypeId);

  const primaryUrl =
    primaryAssetId === null
      ? null
      : resolveVisualAssetUrl(primaryAssetId, { preferWebp: false });

  const fallbackUrl =
    primaryAssetId === null ? resolveVisualAssetUrl(fallbackAssetId) : null;

  const src = primaryUrl ?? fallbackUrl;

  if (src === null) {
    return null;
  }

  const usesProductionPrimary = primaryUrl !== null;

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
      data-workforce-primary={usesProductionPrimary ? 'true' : 'false'}
      data-wfv-asset-id={primaryAssetId ?? undefined}
      data-wfv-primary-load-failed={usesProductionPrimary && primaryLoadFailed ? 'true' : 'false'}
      onError={() => {
        if (usesProductionPrimary) {
          setPrimaryLoadFailed(true);
        }
      }}
    />
  );
}
