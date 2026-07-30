import { describe, expect, it } from 'vitest';
import { EMPTY_COMPANY_DASHBOARD_VIEW_DATA } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import {
  buildGlobalSearchIndex,
  filterGlobalSearchItems,
} from '@/presentation/components/shell/build-global-search-index';

describe('buildGlobalSearchIndex', () => {
  it('includes all primary screens', () => {
    const items = buildGlobalSearchIndex(EMPTY_COMPANY_DASHBOARD_VIEW_DATA, []);

    expect(items.some((item) => item.id === 'screen:company')).toBe(true);
    expect(items.some((item) => item.id === 'screen:world')).toBe(true);
    expect(items.filter((item) => item.kind === 'screen')).toHaveLength(9);
  });

  it('indexes runtime entities from company view-data', () => {
    const items = buildGlobalSearchIndex(
      {
        ...EMPTY_COMPANY_DASHBOARD_VIEW_DATA,
        buildings: Object.freeze([
          {
            id: 'building-1',
            name: 'Werk Nord',
            buildingTypeLabel: 'Fabrik',
            statusLabel: 'Aktiv',
            positionLabel: '12, 8',
            regionId: 'region-1',
            regionLabel: 'Nordregion',
            isUnderConstruction: false,
            constructionProgressPercent: 0,
          },
        ]),
      },
      Object.freeze([
        {
          id: 'region-1',
          name: 'Nordregion',
          description: 'Industriegebiet',
          worldId: 'world-1',
          biomeId: 'biome-1',
          mapX: 0,
          mapY: 0,
          neighborRegionIds: Object.freeze([]),
          cityIds: Object.freeze([]),
        },
      ]),
    );

    expect(items.some((item) => item.id === 'building:building-1')).toBe(true);
    expect(items.some((item) => item.id === 'region:region-1')).toBe(true);
  });
});

describe('filterGlobalSearchItems', () => {
  const items = buildGlobalSearchIndex(EMPTY_COMPANY_DASHBOARD_VIEW_DATA, []);

  it('returns all items for an empty query', () => {
    expect(filterGlobalSearchItems(items, '')).toHaveLength(items.length);
  });

  it('filters by label and keywords', () => {
    const filtered = filterGlobalSearchItems(items, 'finanz');

    expect(filtered.some((item) => item.id === 'screen:finance')).toBe(true);
    expect(filtered.every((item) => item.kind === 'screen')).toBe(true);
  });
});
