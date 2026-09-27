import { describe, expect, it } from 'vitest';
import {
  buildWorkspaceViewData,
  mapMarketRowsViewData,
  mapSimulationStatusViewData,
  mapTransportJobRowsViewData,
} from '@/presentation/adapters/mappers/workspace-view-mappers';
import type { TransportOrderSessionReadModel } from '@/presentation/adapters/api/client';

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
          biomeName: 'Temperate Forest',
          biomeCategory: 'FOREST',
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

  it('mapTransportJobRowsViewData preserves internal status and localized statusLabel', () => {
    const orders: readonly TransportOrderSessionReadModel[] = Object.freeze([
      Object.freeze({
        id: 'transport_wait',
        resourceId: 'wood',
        amount: 10,
        status: 'WAITING',
        progress: 0,
        sourceBuildingId: 'building_a',
        sourceBuildingName: 'Lager',
        destinationBuildingId: 'building_b',
        destinationBuildingName: 'Werk',
        productionJobId: '',
        recipeId: null,
        recipeName: null,
        durationTicks: 5,
        routeId: 'route_1',
      }),
      Object.freeze({
        id: 'transport_active',
        resourceId: 'wood',
        amount: 10,
        status: 'IN_PROGRESS',
        progress: 40,
        sourceBuildingId: 'building_a',
        sourceBuildingName: 'Lager',
        destinationBuildingId: 'building_b',
        destinationBuildingName: 'Werk',
        productionJobId: 'job_1',
        recipeId: 'recipe_planks',
        recipeName: 'Bretter',
        durationTicks: 5,
        routeId: 'route_1',
      }),
      Object.freeze({
        id: 'transport_done',
        resourceId: 'wood',
        amount: 10,
        status: 'COMPLETED',
        progress: 100,
        sourceBuildingId: 'building_a',
        sourceBuildingName: 'Lager',
        destinationBuildingId: 'building_b',
        destinationBuildingName: 'Werk',
        productionJobId: '',
        recipeId: null,
        recipeName: null,
        durationTicks: 5,
        routeId: 'route_1',
      }),
      Object.freeze({
        id: 'transport_cancel',
        resourceId: 'wood',
        amount: 10,
        status: 'CANCELLED',
        progress: 0,
        sourceBuildingId: 'building_a',
        sourceBuildingName: 'Lager',
        destinationBuildingId: 'building_b',
        destinationBuildingName: 'Werk',
        productionJobId: '',
        recipeId: null,
        recipeName: null,
        durationTicks: 5,
        routeId: 'route_1',
      }),
    ]);

    const rows = mapTransportJobRowsViewData(orders);

    expect(rows).toHaveLength(4);
    expect(rows[0]?.status).toBe('WAITING');
    expect(rows[0]?.statusLabel).toBe('Warteschlange');
    expect(rows[0]?.title).toBe('Lager → Werk');
    expect(rows[1]?.status).toBe('IN_PROGRESS');
    expect(rows[1]?.statusLabel).toBe('Unterwegs');
    expect(rows[2]?.statusLabel).toBe('Abgeschlossen');
    expect(rows[3]?.statusLabel).toBe('Abgebrochen');

    const waiting = rows.filter((row) => row.status === 'WAITING').length;
    const active = rows.filter((row) => row.status === 'IN_PROGRESS').length;
    const completed = rows.filter((row) => row.status === 'COMPLETED').length;
    expect(waiting).toBe(1);
    expect(active).toBe(1);
    expect(completed).toBe(1);
  });
});
