import { getVisualAssetEntry } from '@/presentation/assets/visual-asset-registry';

/** Certified ICON-001 resource IDs with approved runtime artwork. */
export const ICON_001_RESOURCE_IDS = Object.freeze([
  'wood',
  'planks',
  'stone',
  'iron_ore',
  'steel',
  'machine_parts',
  'advanced_electronics',
  'industrial_machinery',
  'consumer_goods',
] as const);

export type Icon001ResourceId = (typeof ICON_001_RESOURCE_IDS)[number];

/** Maps canonical resource ID to ICON-001 visual asset registry ID. */
export function resourceIdToIconAssetId(resourceId: string): string {
  return `ICON-001-${resourceId}`;
}

/** Returns registry asset ID when a certified ICON-001 runtime entry exists. */
export function resolveResourceIconAssetId(resourceId: string): string | null {
  const assetId = resourceIdToIconAssetId(resourceId);
  const entry = getVisualAssetEntry(assetId);

  if (entry === null || entry.type !== 'runtime' || entry.path === null) {
    return null;
  }

  return assetId;
}
