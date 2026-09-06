/** Certified ICON-002 SVG masters — byte-identical to docs/design/icons/ICON-002_*.svg sources. */

export const ICON_002_BUILDING_CATEGORY_ASSET_IDS = Object.freeze([
  'ICON-002-production',
  'ICON-002-energy',
  'ICON-002-storage',
  'ICON-002-infrastructure',
  'ICON-002-administration',
  'ICON-002-research',
] as const);

export type Icon002BuildingCategoryAssetId = (typeof ICON_002_BUILDING_CATEGORY_ASSET_IDS)[number];

/** Maps domain BuildingCategory enum strings to ICON-002 registry asset IDs. */
export const BUILDING_CATEGORY_TO_ICON_002_ASSET_ID = Object.freeze({
  PRODUCTION: 'ICON-002-production',
  ENERGY: 'ICON-002-energy',
  STORAGE: 'ICON-002-storage',
  INFRASTRUCTURE: 'ICON-002-infrastructure',
  ADMINISTRATION: 'ICON-002-administration',
  RESEARCH: 'ICON-002-research',
} as const);

export type BuildingCategoryIconCategory = keyof typeof BUILDING_CATEGORY_TO_ICON_002_ASSET_ID;

export const BUILDING_CATEGORY_ICON_CATEGORIES = Object.freeze(
  Object.keys(BUILDING_CATEGORY_TO_ICON_002_ASSET_ID) as BuildingCategoryIconCategory[],
);

/** Maps registry asset IDs to approved design-source filenames. */
export const ICON_002_DESIGN_SOURCE_BY_ASSET_ID: Readonly<Record<Icon002BuildingCategoryAssetId, string>> =
  Object.freeze({
    'ICON-002-production': 'ICON-002_Production.svg',
    'ICON-002-energy': 'ICON-002_Energy.svg',
    'ICON-002-storage': 'ICON-002_Storage.svg',
    'ICON-002-infrastructure': 'ICON-002_Infrastructure.svg',
    'ICON-002-administration': 'ICON-002_Administration.svg',
    'ICON-002-research': 'ICON-002_Research.svg',
  });

/** Inline SVG markup for currentColor-capable runtime rendering. */
export const ICON_002_CERTIFIED_SVG_BY_ASSET_ID: Readonly<Record<Icon002BuildingCategoryAssetId, string>> =
  Object.freeze({
    'ICON-002-production':
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 8.25 12 6.5l3 1.75v3.5L12 13.5l-3-1.75z"/><circle cx="12" cy="10" r="1.25"/><path d="M3 10h4M5.25 8.25 7 10l-1.75 1.75M17 14h4M19.25 12.25 21 14l-1.75 1.75"/><path d="M9 15.5h6M10.5 18h3"/></svg>',
    'ICON-002-energy':
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 2.75 7.25 13h4.5l-1.25 8.25L16.75 11h-4.5z"/><path d="M5 5.5c-1.25 1.75-2 3.9-2 6.25M19 5.5c1.25 1.75 2 3.9 2 6.25"/></svg>',
    'ICON-002-storage':
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8.5 12 4l8 4.5v10.25H4z"/><path d="M7 11h10v7.75H7z"/><path d="M7 14h10"/><path d="M10 11v7.75M14 11v7.75"/></svg>',
    'ICON-002-infrastructure':
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="2.25"/><circle cx="5" cy="6" r="1.75"/><circle cx="19" cy="6" r="1.75"/><circle cx="5" cy="18" r="1.75"/><circle cx="19" cy="18" r="1.75"/><path d="m6.4 7.1 3.85 3.35M17.6 7.1l-3.85 3.35M6.4 16.9l3.85-3.35M17.6 16.9l-3.85-3.35"/></svg>',
    'ICON-002-administration':
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="6" cy="10" r="1.75"/><circle cx="18" cy="10" r="1.75"/><path d="M12 7v3M7.75 9.25 10.5 6.5M16.25 9.25 13.5 6.5"/><path d="M4 19v-2.25A2.75 2.75 0 0 1 6.75 14h10.5A2.75 2.75 0 0 1 20 16.75V19"/><path d="M9 19v-2h6v2"/></svg>',
    'ICON-002-research':
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6M10 3v5.25l-4.75 8.1A2.5 2.5 0 0 0 7.4 20h9.2a2.5 2.5 0 0 0 2.15-3.65L14 8.25V3"/><path d="M7.5 15h9"/><circle cx="10" cy="12" r=".75"/><circle cx="14.5" cy="17" r=".75"/></svg>',
  });
