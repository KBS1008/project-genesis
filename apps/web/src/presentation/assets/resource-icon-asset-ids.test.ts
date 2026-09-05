import { describe, expect, it } from 'vitest';
import {
  ICON_001_RESOURCE_IDS,
  resourceIdToIconAssetId,
  resolveResourceIconAssetId,
} from '@/presentation/assets/resource-icon-asset-ids';

describe('resource-icon-asset-ids', () => {
  it('maps canonical resource IDs to ICON-001 registry IDs', () => {
    expect(resourceIdToIconAssetId('wood')).toBe('ICON-001-wood');
    expect(resourceIdToIconAssetId('iron_ore')).toBe('ICON-001-iron_ore');
    expect(resourceIdToIconAssetId('consumer_goods')).toBe('ICON-001-consumer_goods');
  });

  it('resolves certified resources to runtime registry entries', () => {
    expect(resolveResourceIconAssetId('wood')).toBe('ICON-001-wood');
    expect(resolveResourceIconAssetId('iron_ore')).toBe('ICON-001-iron_ore');
  });

  it('returns null for unknown resources without throwing', () => {
    expect(resolveResourceIconAssetId('unknown_resource')).toBeNull();
  });

  it('lists exactly nine certified ICON-001 resources', () => {
    expect(ICON_001_RESOURCE_IDS).toHaveLength(9);
  });
});
