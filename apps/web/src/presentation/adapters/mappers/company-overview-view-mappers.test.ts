import { describe, expect, it } from 'vitest';
import { EMPTY_COMPANY_DASHBOARD_VIEW_DATA } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { buildCompanyOverviewViewData } from './company-overview-view-mappers';

describe('company-overview-view-mappers', () => {
  it('groups buildings into regional presence rows', () => {
    const overview = buildCompanyOverviewViewData(
      {
        ...EMPTY_COMPANY_DASHBOARD_VIEW_DATA,
        hasGame: true,
        companyName: 'Test Corp',
        headerSubtitle: 'Tick 3',
        overview: Object.freeze({
          cards: Object.freeze([
            Object.freeze({ label: 'Cash', value: '1.000 GC', hint: 'Verfügbar' }),
          ]),
        }),
        inventoryItems: Object.freeze([]),
        financeTransactions: Object.freeze([]),
        productionJobs: Object.freeze([]),
        researchJobs: Object.freeze([]),
        logisticsStatusMessage: null,
        detail: {
          ...EMPTY_COMPANY_DASHBOARD_VIEW_DATA.detail,
          hasFinance: true,
          financeEntries: Object.freeze([Object.freeze(['Cash', '1.000 GC'] as const)]),
        },
      },
      Object.freeze([
        Object.freeze({
          id: 'region_001',
          name: 'Heartland',
          description: '',
          worldId: 'world_001',
          biomeId: 'temperate',
          mapX: 0,
          mapY: 0,
          neighborRegionIds: Object.freeze([]),
          cityIds: Object.freeze([]),
        }),
      ]),
      Object.freeze([
        Object.freeze({
          id: 'building_001',
          name: 'Sägewerk',
          buildingTypeLabel: 'Sägewerk',
          statusLabel: 'ACTIVE',
          positionLabel: '0, 0',
          regionId: 'region_001',
          regionLabel: 'Heartland',
        }),
      ]),
    );

    expect(overview.regionalPresence).toHaveLength(1);
    expect(overview.regionalPresence[0]?.regionName).toBe('Heartland');
    expect(overview.regionalPresence[0]?.buildingCount).toBe(1);
  });
});
