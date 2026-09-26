'use client';

import { resolveMilestoneVisualAssetIds } from '@/presentation/assets/milestone-visual-asset-ids';
import { resolveVisualAssetUrl } from '@/presentation/assets/visual-asset-loader';

type MilestoneVisualVariant = 'primary' | 'medallion';

type MilestoneVisualProps = {
  readonly milestoneId: string;
  readonly variant?: MilestoneVisualVariant;
  readonly completed?: boolean;
  readonly size?: number;
  readonly className?: string;
  readonly loading?: 'lazy' | 'eager';
};

/** MSV-001 production art with unknown-ID medallion fallback only when unmapped. */
export function MilestoneVisual({
  milestoneId,
  variant = 'medallion',
  completed = true,
  size = 64,
  className = 'pg-milestone-visual',
  loading = 'lazy',
}: MilestoneVisualProps) {
  const { primaryAssetId, medallionAssetId, fallbackMedallionAssetId } =
    resolveMilestoneVisualAssetIds(milestoneId);

  const mappedAssetId =
    variant === 'primary'
      ? primaryAssetId
      : medallionAssetId ?? (primaryAssetId === null ? fallbackMedallionAssetId : medallionAssetId);

  const assetId =
    mappedAssetId ??
    (variant === 'medallion' ? fallbackMedallionAssetId : null);

  const src =
    assetId === null ? null : resolveVisualAssetUrl(assetId, { preferWebp: false });

  if (src === null || assetId === null) {
    return null;
  }

  const usesProduction =
    assetId !== fallbackMedallionAssetId && assetId.startsWith('MSV-001-');

  const stateClass = completed ? 'is-completed' : 'is-locked';

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={`${className} ${stateClass}`.trim()}
      loading={loading}
      decoding="async"
      role="presentation"
      aria-hidden
      data-milestone-visual={variant}
      data-milestone-primary={usesProduction ? 'true' : 'false'}
      data-msv-asset-id={assetId}
    />
  );
}
