/** TechnologyCategory values used by enabled game content (BUILDING enum unused). */
export const ICON_004_USED_TECHNOLOGY_CATEGORIES = Object.freeze([
  'PRODUCTION',
  'ENERGY',
  'LOGISTICS',
  'ELECTRONICS',
  'MANAGEMENT',
  'AUTOMATION',
  'FINANCE',
  'AGRICULTURE',
  'CHEMISTRY',
  'AI',
] as const);

export type Icon004UsedTechnologyCategory = (typeof ICON_004_USED_TECHNOLOGY_CATEGORIES)[number];

/** Enabled technology IDs → category (mirrors game-content/research/*.yaml). */
export const ICON_004_TECHNOLOGY_CATEGORY_BY_ID: Readonly<Record<string, Icon004UsedTechnologyCategory>> =
  Object.freeze({
    basic_woodworking: 'PRODUCTION',
    advanced_metallurgy: 'PRODUCTION',
    precision_machining: 'PRODUCTION',
    industrial_assembly: 'PRODUCTION',
    coal_efficiency: 'ENERGY',
    renewable_energy: 'ENERGY',
    smart_grid: 'ENERGY',
    distribution_networks: 'LOGISTICS',
    intermodal_logistics: 'LOGISTICS',
    warehouse_systems: 'LOGISTICS',
    circuit_design: 'ELECTRONICS',
    semiconductor_process: 'ELECTRONICS',
    corporate_management: 'MANAGEMENT',
    executive_leadership: 'MANAGEMENT',
    factory_automation: 'AUTOMATION',
    process_automation: 'AUTOMATION',
    financial_planning: 'FINANCE',
    organic_chemistry: 'CHEMISTRY',
    polymer_science: 'CHEMISTRY',
    sustainable_agriculture: 'AGRICULTURE',
    crop_optimization: 'AGRICULTURE',
    predictive_analytics: 'AI',
  });

export const ICON_004_BATCH_1_DETAILED_TECHNOLOGY_IDS = Object.freeze([
  'precision_machining',
  'renewable_energy',
  'semiconductor_process',
  'advanced_metallurgy',
  'coal_efficiency',
  'intermodal_logistics',
  'circuit_design',
  'factory_automation',
] as const);

export const ICON_004_BATCH_2_DETAILED_TECHNOLOGY_IDS = Object.freeze([
  'basic_woodworking',
  'industrial_assembly',
  'smart_grid',
  'warehouse_systems',
  'process_automation',
  'organic_chemistry',
] as const);

export const ICON_004_BATCH_3_DETAILED_TECHNOLOGY_IDS = Object.freeze([
  'distribution_networks',
  'polymer_science',
  'sustainable_agriculture',
  'crop_optimization',
] as const);

export const ICON_004_DETAILED_TECHNOLOGY_IDS = Object.freeze([
  ...ICON_004_BATCH_1_DETAILED_TECHNOLOGY_IDS,
  ...ICON_004_BATCH_2_DETAILED_TECHNOLOGY_IDS,
  ...ICON_004_BATCH_3_DETAILED_TECHNOLOGY_IDS,
] as const);

export type Icon004Batch1DetailedTechnologyId = (typeof ICON_004_BATCH_1_DETAILED_TECHNOLOGY_IDS)[number];
export type Icon004Batch2DetailedTechnologyId = (typeof ICON_004_BATCH_2_DETAILED_TECHNOLOGY_IDS)[number];
export type Icon004Batch3DetailedTechnologyId = (typeof ICON_004_BATCH_3_DETAILED_TECHNOLOGY_IDS)[number];
export type Icon004DetailedTechnologyId = (typeof ICON_004_DETAILED_TECHNOLOGY_IDS)[number];

/** Remaining technologies without Tier-1 art (abstract pilot deferred). */
export const ICON_004_ABSTRACT_DEFERRED_TECHNOLOGY_IDS = Object.freeze([
  'corporate_management',
  'executive_leadership',
  'financial_planning',
  'predictive_analytics',
] as const);

const DETAILED_SET = new Set<string>(ICON_004_DETAILED_TECHNOLOGY_IDS);
const BATCH_1_SET = new Set<string>(ICON_004_BATCH_1_DETAILED_TECHNOLOGY_IDS);
const CATEGORY_SET = new Set<string>(ICON_004_USED_TECHNOLOGY_CATEGORIES);

export const ICON_004_GENERIC_RESEARCH_FALLBACK_ASSET_ID = 'ICON-002-research';

export function resolveTechnologyCategory(technologyId: string): Icon004UsedTechnologyCategory | null {
  return ICON_004_TECHNOLOGY_CATEGORY_BY_ID[technologyId] ?? null;
}

export function isIcon004Batch1DetailedTechnology(
  technologyId: string,
): technologyId is Icon004Batch1DetailedTechnologyId {
  return BATCH_1_SET.has(technologyId);
}

export function isIcon004DetailedTechnology(
  technologyId: string,
): technologyId is Icon004DetailedTechnologyId {
  return DETAILED_SET.has(technologyId);
}

export function technologyToIcon004PrimaryAssetId(technologyId: string): string | null {
  if (!isIcon004DetailedTechnology(technologyId)) {
    return null;
  }

  return `ICON-004-${technologyId}-primary`;
}

export function technologyCategoryToIcon004CompactAssetId(category: string): string | null {
  if (!CATEGORY_SET.has(category)) {
    return null;
  }

  return `ICON-004-category-${category}`;
}

export function resolveIcon004TechnologyVisualAssetIds(technologyId: string): {
  readonly primaryAssetId: string | null;
  readonly categoryAssetId: string | null;
  readonly fallbackAssetId: string;
} {
  const category = resolveTechnologyCategory(technologyId);
  return Object.freeze({
    primaryAssetId: technologyToIcon004PrimaryAssetId(technologyId),
    categoryAssetId:
      category === null ? null : technologyCategoryToIcon004CompactAssetId(category),
    fallbackAssetId: ICON_004_GENERIC_RESEARCH_FALLBACK_ASSET_ID,
  });
}
