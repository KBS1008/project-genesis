import { describe, expect, it } from 'vitest';
import {
  buildEntityCatalogFromDashboard,
  buildNavigationQueryString,
  buildSessionSnapshots,
  parseNavigationState,
  recoverInvalidEntitySelection,
  sanitizeNavigationState,
  serializeNavigationState,
  isEntitySelectionCompatibleWithScreen,
} from '@/presentation/state/navigation-state';

describe('navigation-state', () => {
  it('parses and serializes primary screen navigation', () => {
    const params = new URLSearchParams('screen=markets&entity=resource:iron-ore');
    const state = parseNavigationState(params);

    expect(state).toEqual({
      screen: 'markets',
      entitySelection: { kind: 'resource', id: 'iron-ore' },
    });

    expect(serializeNavigationState(state).toString()).toBe(
      'screen=markets&entity=resource%3Airon-ore',
    );
    expect(buildNavigationQueryString({ screen: 'company', entitySelection: { kind: 'none' } })).toBe(
      '',
    );
  });

  it('falls back to defaults for invalid URL values', () => {
    const state = parseNavigationState(new URLSearchParams('screen=invalid&entity=broken'));

    expect(state).toEqual({
      screen: 'company',
      entitySelection: { kind: 'none' },
    });
  });

  it('recovers invalid entity selections using authoritative catalog data', () => {
    const catalog = buildEntityCatalogFromDashboard({
      buildings: [{ id: 'building-1' }],
      productionJobs: [],
      transportOrders: [],
      researchJobs: [],
      employees: [],
      marketPrices: [{ resourceId: 'iron-ore' }],
    });

    const invalidState = recoverInvalidEntitySelection(
      {
        screen: 'buildings',
        entitySelection: { kind: 'building', id: 'missing-building' },
      },
      catalog,
    );

    expect(invalidState.entitySelection).toEqual({ kind: 'none' });
  });

  it('clears incompatible entity selections when switching screens', () => {
    expect(
      sanitizeNavigationState({
        screen: 'finance',
        entitySelection: { kind: 'building', id: 'building-1' },
      }).entitySelection,
    ).toEqual({ kind: 'none' });

    expect(
      sanitizeNavigationState({
        screen: 'buildings',
        entitySelection: { kind: 'building', id: 'building-1' },
      }).entitySelection,
    ).toEqual({ kind: 'building', id: 'building-1' });

    expect(
      sanitizeNavigationState({
        screen: 'company',
        entitySelection: { kind: 'warehouse', id: 'building-warehouse-1' },
      }).entitySelection,
    ).toEqual({ kind: 'warehouse', id: 'building-warehouse-1' });

    expect(
      isEntitySelectionCompatibleWithScreen('markets', { kind: 'resource', id: 'iron-ore' }),
    ).toBe(true);
    expect(
      isEntitySelectionCompatibleWithScreen('markets', { kind: 'region', id: 'region-1' }),
    ).toBe(false);
    expect(
      isEntitySelectionCompatibleWithScreen('company', { kind: 'warehouse', id: 'building-1' }),
    ).toBe(true);
  });

  it('parses and validates warehouse entity selections from URL params', () => {
    const state = parseNavigationState(
      new URLSearchParams('screen=company&entity=warehouse:building-wh-1'),
    );

    expect(state).toEqual({
      screen: 'company',
      entitySelection: { kind: 'warehouse', id: 'building-wh-1' },
    });

    const catalog = buildEntityCatalogFromDashboard({
      buildings: [],
      productionJobs: [],
      transportOrders: [],
      researchJobs: [],
      employees: [],
      marketPrices: [],
      warehouseStorage: [{ buildingId: 'building-wh-1' }],
    });

    expect(
      recoverInvalidEntitySelection(
        {
          screen: 'company',
          entitySelection: { kind: 'warehouse', id: 'building-wh-1' },
        },
        catalog,
      ).entitySelection,
    ).toEqual({ kind: 'warehouse', id: 'building-wh-1' });

    expect(
      recoverInvalidEntitySelection(
        {
          screen: 'company',
          entitySelection: { kind: 'warehouse', id: 'missing-warehouse' },
        },
        catalog,
      ).entitySelection,
    ).toEqual({ kind: 'none' });
  });

  it('builds readonly session snapshots without storing domain aggregates', () => {
    const snapshots = buildSessionSnapshots({
      company: { id: 'company-1', name: 'Genesis Industries' },
      tickNumber: 42,
      simulationTime: 1000,
      finance: { availableCash: 125000 },
    });

    expect(snapshots.session).toEqual({
      hasGame: true,
      companyId: 'company-1',
      companyName: 'Genesis Industries',
      tickNumber: 42,
      simulationTime: 1000,
      availableCash: 125000,
    });
    expect(snapshots.simulation.hasActiveSession).toBe(true);
    expect(snapshots.simulation.isPaused).toBe(false);
  });
});
