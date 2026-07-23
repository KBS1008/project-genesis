import { describe, expect, it } from 'vitest';
import {
  buildWorkspaceViewData,
  mapMarketRowsViewData,
  mapSimulationStatusViewData,
} from '@/presentation/adapters/mappers/workspace-view-mappers';

describe('workspace-view-mappers', () => {
  it('maps simulation status using authoritative server values', () => {
    const viewData = mapSimulationStatusViewData({
      tickNumber: 15,
      simulationTime: 300,
      isPaused: true,
      tickDuration: 2,
      hasActiveSession: true,
    });

    expect(viewData).toEqual({
      tickNumber: 15,
      simulationTime: 300,
      isPaused: true,
      speedMultiplier: 2,
      hasActiveSession: true,
      speedLabel: 'Pausiert',
    });
  });

  it('builds workspace view-data from query DTOs', () => {
    const viewData = buildWorkspaceViewData({
      session: {
        hasActiveSession: true,
        companyId: 'company_001',
        companyName: 'Genesis Industries',
        playerId: 'player_001',
        savePath: 'saves/browser-session.json',
      },
      simulation: {
        tickNumber: 3,
        simulationTime: 30,
        isPaused: false,
        tickDuration: 1,
        hasActiveSession: true,
      },
      worldOverview: {
        activeWorldId: 'world_001',
        worldName: 'Genesis World',
        regionIds: ['region_001'],
        regionCount: 1,
        cityCount: 2,
        defaultMapId: 'map_001',
      },
      regions: [
        {
          id: 'region_001',
          name: 'Heartland',
          description: 'Starter region',
          worldId: 'world_001',
          biomeId: 'temperate',
          mapX: 1,
          mapY: 2,
          neighborRegionIds: [],
          cityIds: ['city_001'],
        },
      ],
      saves: [],
    });

    expect(viewData.world?.worldName).toBe('Genesis World');
    expect(viewData.world?.regions[0]?.name).toBe('Heartland');
  });

  it('maps market rows with resolved labels', () => {
    const rows = mapMarketRowsViewData(
      [
        {
          resourceId: 'iron-ore',
          basePrice: 10,
          lastPrice: 12,
          tradeVolume: 1,
          updatedAt: 1,
          totalSupply: 100,
          baselineDemand: 80,
          pressureIndex: 1.2,
          changeFromBase: 2,
          changePercent: 20,
          trend: 'UP',
        },
      ],
      (resourceId) => (resourceId === 'iron-ore' ? 'Eisenerz' : resourceId),
    );

    expect(rows[0]?.resourceLabel).toBe('Eisenerz');
    expect(rows[0]?.trendLabel).toBe('Steigend');
  });
});
