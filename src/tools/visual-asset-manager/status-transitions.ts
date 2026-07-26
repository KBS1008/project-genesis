import type { VisualAssetStatus } from './types.js';

/** Allowed manual status transitions (from → to). */
export const ALLOWED_STATUS_TRANSITIONS: Readonly<
  Record<VisualAssetStatus, readonly VisualAssetStatus[]>
> = Object.freeze({
  planned: ['in-production'],
  'in-production': ['in-review'],
  'in-review': ['approved', 'in-production'],
  approved: ['integrated', 'in-review'],
  integrated: [],
});

/** Returns whether a status change is permitted. */
export function canTransitionStatus(
  from: VisualAssetStatus,
  to: VisualAssetStatus,
): boolean {
  if (from === to) {
    return true;
  }
  return ALLOWED_STATUS_TRANSITIONS[from].includes(to);
}

/** Validates asset ID format and rejects path traversal patterns. */
export function validateAssetId(assetId: string): void {
  if (!/^[A-Z]{2,5}-\d{3}$/.test(assetId)) {
    throw new Error(`Invalid asset ID: ${assetId}`);
  }
  if (assetId.includes('..') || assetId.includes('/') || assetId.includes('\\')) {
    throw new Error(`Invalid asset ID: ${assetId}`);
  }
}
