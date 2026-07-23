import { describe, expect, it } from 'vitest';
import {
  buildEntityCatalogFromDashboard,
  buildNavigationQueryString,
  buildSessionSnapshots,
  parseNavigationState,
  recoverInvalidEntitySelection,
  serializeNavigationState,
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
