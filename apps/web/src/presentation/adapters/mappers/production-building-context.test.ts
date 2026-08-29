import { describe, expect, it } from 'vitest';
import {
  filterProductionHintsByBuildingId,
  filterProductionJobsByBuildingId,
  isProductionBuildingFilterActive,
  resolveProductionContextBuildingId,
} from '@/presentation/adapters/mappers/production-building-context';
import type { ProductionJobSessionReadModel } from '@/presentation/adapters/api/client';
import type { ProductionHintViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';

const jobs: readonly ProductionJobSessionReadModel[] = Object.freeze([
  Object.freeze({
    id: 'production_001',
    buildingId: 'building_005',
    recipeId: 'recipe_planks',
    status: 'RUNNING',
    operationalState: 'RUNNING',
    progress: 42,
    awaitingTransport: false,
    activeTransportCount: 0,
  }),
  Object.freeze({
    id: 'production_002',
    buildingId: 'building_006',
    recipeId: 'recipe_planks',
    status: 'WAITING',
    operationalState: 'WAITING',
    progress: 0,
    awaitingTransport: true,
    activeTransportCount: 1,
  }),
]);

const hints: readonly ProductionHintViewData[] = Object.freeze([
  Object.freeze({
    buildingId: 'building_005',
    recipeId: 'recipe_planks',
    buildingName: 'Sägewerk Nord',
    recipeName: 'Bretter',
    canStart: true,
    reason: null,
  }),
  Object.freeze({
    buildingId: 'building_006',
    recipeId: 'recipe_planks',
    buildingName: 'Sägewerk Süd',
    recipeName: 'Bretter',
    canStart: false,
    reason: 'Material fehlt',
  }),
]);

describe('production building context', () => {
  it('detects building filter from shared selection', () => {
    expect(isProductionBuildingFilterActive({ kind: 'building', id: 'building_005' })).toBe(true);
    expect(isProductionBuildingFilterActive({ kind: 'production', id: 'production_001' })).toBe(
      false,
    );
  });

  it('resolves building context from building and production selection', () => {
    expect(
      resolveProductionContextBuildingId({ kind: 'building', id: 'building_005' }, jobs),
    ).toBe('building_005');
    expect(
      resolveProductionContextBuildingId({ kind: 'production', id: 'production_002' }, jobs),
    ).toBe('building_006');
  });

  it('filters jobs and hints by stable buildingId', () => {
    expect(filterProductionJobsByBuildingId(jobs, 'building_005')).toHaveLength(1);
    expect(filterProductionJobsByBuildingId(jobs, 'building_005')[0]?.id).toBe('production_001');
    expect(filterProductionHintsByBuildingId(hints, 'building_005')).toHaveLength(1);
    expect(filterProductionHintsByBuildingId(hints, 'building_005')[0]?.buildingId).toBe(
      'building_005',
    );
  });

  it('tolerates multiple jobs on one building without collapsing selection', () => {
    const multiBuildingJobs: readonly ProductionJobSessionReadModel[] = Object.freeze([
      ...jobs,
      Object.freeze({
        id: 'production_003',
        buildingId: 'building_005',
        recipeId: 'recipe_planks',
        status: 'FINISHED',
        operationalState: 'FINISHED',
        progress: 100,
        awaitingTransport: false,
        activeTransportCount: 0,
      }),
    ]);

    expect(filterProductionJobsByBuildingId(multiBuildingJobs, 'building_005')).toHaveLength(2);
  });
});
