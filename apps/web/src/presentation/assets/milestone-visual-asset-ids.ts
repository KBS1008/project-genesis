/** Enabled milestone IDs (mirrors game-content/milestones/*.yaml). */
export const MSV_ENABLED_MILESTONE_IDS = Object.freeze([
  'first_production',
  'first_steel',
  'first_profit',
  'first_consumer_goods',
  'first_machine_parts',
  'first_industrial_machinery',
  'first_advanced_electronics',
  'profit_100',
] as const);

export type MsvEnabledMilestoneId = (typeof MSV_ENABLED_MILESTONE_IDS)[number];

export const MSV_001_PRODUCTION_MILESTONE_IDS = MSV_ENABLED_MILESTONE_IDS;

const ENABLED_SET = new Set<string>(MSV_ENABLED_MILESTONE_IDS);

/** Defensive fallback when milestone ID is unknown (compact tier). */
export const MSV_001_UNKNOWN_MILESTONE_MEDALLION_ASSET_ID = 'MSV-001-milestone_unknown-medallion';

export function isMsvEnabledMilestone(milestoneId: string): milestoneId is MsvEnabledMilestoneId {
  return ENABLED_SET.has(milestoneId);
}

export function milestoneIdToMsvPrimaryAssetId(milestoneId: string): string | null {
  if (!isMsvEnabledMilestone(milestoneId)) {
    return null;
  }
  return `MSV-001-${milestoneId}-primary`;
}

export function milestoneIdToMsvMedallionAssetId(milestoneId: string): string | null {
  if (!isMsvEnabledMilestone(milestoneId)) {
    return null;
  }
  return `MSV-001-${milestoneId}-medallion`;
}

export function resolveMilestoneVisualAssetIds(milestoneId: string): {
  readonly primaryAssetId: string | null;
  readonly medallionAssetId: string | null;
  readonly fallbackMedallionAssetId: string;
} {
  return Object.freeze({
    primaryAssetId: milestoneIdToMsvPrimaryAssetId(milestoneId),
    medallionAssetId: milestoneIdToMsvMedallionAssetId(milestoneId),
    fallbackMedallionAssetId: MSV_001_UNKNOWN_MILESTONE_MEDALLION_ASSET_ID,
  });
}
