import { describe, expect, it } from 'vitest';
import {
  mapProductionFactoryGroups,
  mapProductionJobRowsViewData,
  mapProductionOverviewSummary,
} from '@/presentation/adapters/mappers/workspace-view-mappers';
import type { ProductionJobSessionReadModel } from '@/presentation/adapters/api/client';

const jobs: readonly ProductionJobSessionReadModel[] = Object.freeze([
  Object.freeze({
    id: 'production_001',
    buildingId: 'building_005',
    recipeId: 'recipe_planks',
    status: 'RUNNING',
    operationalState: 'STALLED_ENERGY',
    progress: 42,
    awaitingTransport: false,
    activeTransportCount: 0,
  }),
  Object.freeze({
    id: 'production_002',
    buildingId: 'building_005',
    recipeId: 'recipe_planks',
    status: 'RUNNING',
    operationalState: 'STALLED_WORKFORCE',
    progress: 0,
    awaitingTransport: false,
    activeTransportCount: 0,
  }),
  Object.freeze({
    id: 'production_003',
    buildingId: 'building_006',
    recipeId: 'recipe_planks',
    status: 'FINISHED',
    operationalState: 'FINISHED',
    progress: 100,
    awaitingTransport: false,
    activeTransportCount: 0,
  }),
]);

describe('production screen view mappers', () => {
  it('maps overview summary from operational states', () => {
    const summary = mapProductionOverviewSummary(jobs);

    expect(summary.activeCount).toBe(2);
    expect(summary.stalledEnergyCount).toBe(1);
    expect(summary.stalledWorkforceCount).toBe(1);
    expect(summary.finishedCount).toBe(1);
  });

  it('maps production job rows with authoritative status labels', () => {
    const rows = mapProductionJobRowsViewData(jobs, {
      recipe: (id) => id,
      building: (id) => id,
    });

    expect(rows[0]?.statusLabel).toBe('Energie fehlt');
    expect(rows[0]?.progressPercent).toBe(42);
    expect(rows[1]?.statusLabel).toBe('Keine Mitarbeiter');
  });

  it('groups jobs by factory building', () => {
    const groups = mapProductionFactoryGroups(
      jobs,
      {
        recipe: () => 'Bretter',
        building: (id) => id,
      },
      [
        {
          id: 'building_005',
          name: 'Sägewerk Nord',
          buildingTypeLabel: 'Sägewerk',
        },
        {
          id: 'building_006',
          name: 'Sägewerk Süd',
          buildingTypeLabel: 'Sägewerk',
        },
      ],
    );

    expect(groups).toHaveLength(2);
    expect(groups.find((group) => group.buildingId === 'building_005')?.jobs).toHaveLength(2);
  });
});
