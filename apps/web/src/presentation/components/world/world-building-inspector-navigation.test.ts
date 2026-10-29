import { describe, expect, it } from 'vitest';
import { buildWorldBuildingInspectorNavigationViewData } from '@/presentation/components/world/world-building-inspector-navigation';

describe('world-building-inspector-navigation (GCL-S1-NAV)', () => {
  const productionHint = Object.freeze({
    buildingId: 'building_a',
    recipeId: 'recipe_planks',
    buildingName: 'Sägewerk',
    recipeName: 'Bretter',
    canStart: true,
    reason: null,
  });

  it('NAV-T01 — Gebäude öffnen available when inspector detail exists', () => {
    const nav = buildWorldBuildingInspectorNavigationViewData('building_002', [], [], true);
    expect(nav.showOpenBuilding).toBe(true);
  });

  it('NAV-T02 — production action for production-capable building', () => {
    const nav = buildWorldBuildingInspectorNavigationViewData(
      'building_a',
      [productionHint],
      [],
      true,
    );
    expect(nav.showOpenProduction).toBe(true);
  });

  it('NAV-T03 — workforce action for production-capable building even without stall', () => {
    const nav = buildWorldBuildingInspectorNavigationViewData(
      'building_a',
      [productionHint],
      [],
      true,
    );
    expect(nav.showManageWorkforce).toBe(true);
  });

  it('NAV-T04 — three independent flags for capable building', () => {
    const nav = buildWorldBuildingInspectorNavigationViewData(
      'building_a',
      [productionHint],
      [],
      true,
    );
    expect(nav).toEqual({
      showOpenBuilding: true,
      showOpenProduction: true,
      showManageWorkforce: true,
    });
  });

  it('NAV-T05 — warehouse without production hides production and workforce actions', () => {
    const nav = buildWorldBuildingInspectorNavigationViewData('building_002', [], [], true);
    expect(nav.showOpenBuilding).toBe(true);
    expect(nav.showOpenProduction).toBe(false);
    expect(nav.showManageWorkforce).toBe(false);
  });
});
