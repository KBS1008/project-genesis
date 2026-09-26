import { describe, expect, it } from 'vitest';
import {
  MSV_001_PRODUCTION_MILESTONE_IDS,
  MSV_001_UNKNOWN_MILESTONE_MEDALLION_ASSET_ID,
  milestoneIdToMsvMedallionAssetId,
  milestoneIdToMsvPrimaryAssetId,
  resolveMilestoneVisualAssetIds,
} from '@/presentation/assets/milestone-visual-asset-ids';

describe('milestone-visual-asset-ids', () => {
  it('resolves all eight production milestone IDs to primary and medallion assets', () => {
    for (const milestoneId of MSV_001_PRODUCTION_MILESTONE_IDS) {
      expect(milestoneIdToMsvPrimaryAssetId(milestoneId)).toBe(`MSV-001-${milestoneId}-primary`);
      expect(milestoneIdToMsvMedallionAssetId(milestoneId)).toBe(`MSV-001-${milestoneId}-medallion`);
    }
  });

  it('returns null primary/medallion for unknown milestone IDs', () => {
    expect(milestoneIdToMsvPrimaryAssetId('not_a_milestone')).toBeNull();
    expect(milestoneIdToMsvMedallionAssetId('not_a_milestone')).toBeNull();
  });

  it('exposes unknown fallback medallion for unmapped IDs', () => {
    const resolved = resolveMilestoneVisualAssetIds('not_a_milestone');
    expect(resolved.primaryAssetId).toBeNull();
    expect(resolved.medallionAssetId).toBeNull();
    expect(resolved.fallbackMedallionAssetId).toBe(MSV_001_UNKNOWN_MILESTONE_MEDALLION_ASSET_ID);
  });
});
