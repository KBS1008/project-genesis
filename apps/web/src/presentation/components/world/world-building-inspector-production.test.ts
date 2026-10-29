import { describe, expect, it } from 'vitest';
import type { ProductionJobSessionReadModel } from '@/presentation/adapters/api/client';
import {
  buildWorldBuildingInspectorProductionViewData,
  isWorldBuildingProductionCapable,
  selectPrimaryProductionJobForBuilding,
} from '@/presentation/components/world/world-building-inspector-production';

const labels = Object.freeze({
  recipe: (id: string) => `Recipe:${id}`,
  building: (id: string) => `Building:${id}`,
});

function job(
  partial: Partial<ProductionJobSessionReadModel> & Pick<ProductionJobSessionReadModel, 'id' | 'buildingId'>,
): ProductionJobSessionReadModel {
  return Object.freeze({
    recipeId: 'recipe_planks',
    status: 'RUNNING',
    progress: 42,
    awaitingTransport: false,
    operationalState: 'RUNNING',
    ...partial,
  });
}

describe('world-building-inspector-production (GCL-S1)', () => {
  it('GCL-S1-T01 — active production shows progress for the selected building', () => {
    const jobs = [
      job({ id: 'job_a', buildingId: 'building_a', progress: 42, operationalState: 'RUNNING' }),
      job({ id: 'job_b', buildingId: 'building_b', progress: 5 }),
    ];

    const view = buildWorldBuildingInspectorProductionViewData(
      'building_a',
      jobs,
      [{ buildingId: 'building_a', recipeId: 'recipe_planks', buildingName: 'A', recipeName: 'Bretter', canStart: true, reason: null }],
      labels,
    );

    expect(view?.headline).toBe('Produktion läuft');
    expect(view?.productLabel).toBe('Recipe:recipe_planks');
    expect(view?.progressPercent).toBe(42);
    expect(view?.progressLabel).toBe('42%');
  });

  it('GCL-S1-T02 — workforce stall shows guidance and workforce action', () => {
    const jobs = [
      job({
        id: 'job_a',
        buildingId: 'building_a',
        progress: 0,
        operationalState: 'STALLED_WORKFORCE',
      }),
    ];

    const view = buildWorldBuildingInspectorProductionViewData(
      'building_a',
      jobs,
      [{ buildingId: 'building_a', recipeId: 'recipe_planks', buildingName: 'A', recipeName: 'Bretter', canStart: true, reason: null }],
      labels,
    );

    expect(view?.headline).toBe('Produktion angehalten – Arbeitskräfte fehlen');
    expect(view?.stallDetail).toContain('Mitarbeiter');
  });

  it('GCL-S1-T03 — idle production-capable building shows no fake progress', () => {
    const view = buildWorldBuildingInspectorProductionViewData(
      'building_a',
      [],
      [{ buildingId: 'building_a', recipeId: 'recipe_planks', buildingName: 'A', recipeName: 'Bretter', canStart: true, reason: null }],
      labels,
    );

    expect(view?.headline).toBe('Keine Produktion aktiv');
    expect(view?.progressPercent).toBeNull();
  });

  it('GCL-S1-T04 — non-production building omits production section', () => {
    const view = buildWorldBuildingInspectorProductionViewData('warehouse_1', [], [], labels);
    expect(view).toBeNull();
    expect(isWorldBuildingProductionCapable('warehouse_1', [], [])).toBe(false);
  });

  it('GCL-S1-T05 — building selection uses distinct jobs', () => {
    const jobs = [
      job({ id: 'job_a', buildingId: 'building_a', progress: 10 }),
      job({ id: 'job_b', buildingId: 'building_b', progress: 80 }),
    ];

    expect(selectPrimaryProductionJobForBuilding(jobs, 'building_a')?.progress).toBe(10);
    expect(selectPrimaryProductionJobForBuilding(jobs, 'building_b')?.progress).toBe(80);
    expect(selectPrimaryProductionJobForBuilding(jobs, 'building_c')).toBeNull();
  });

  it('GCL-S1-T08 — invalid progress values are clamped via mapper', () => {
    const jobs = [job({ id: 'job_a', buildingId: 'building_a', progress: 150 })];
    const view = buildWorldBuildingInspectorProductionViewData(
      'building_a',
      jobs,
      [{ buildingId: 'building_a', recipeId: 'recipe_planks', buildingName: 'A', recipeName: 'Bretter', canStart: true, reason: null }],
      labels,
    );

    expect(view?.progressPercent).toBe(100);
  });
});
