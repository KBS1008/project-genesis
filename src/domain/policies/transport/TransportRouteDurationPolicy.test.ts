import {
  FALLBACK_TRANSPORT_DURATION_TICKS,
  TransportRouteDurationPolicy,
  type TransportRouteRule,
} from './TransportRouteDurationPolicy.js';

describe('TransportRouteDurationPolicy', () => {
  const categoryRoute: TransportRouteRule = {
    id: 'route_storage_to_production',
    sourceCategory: 'STORAGE',
    destinationCategory: 'PRODUCTION',
    sourceBuildingTypeId: null,
    destinationBuildingTypeId: null,
    durationTicks: 8,
    throughputCapacity: 2,
    enabled: true,
  };

  const specificRoute: TransportRouteRule = {
    id: 'route_warehouse_to_smelter',
    sourceCategory: null,
    destinationCategory: null,
    sourceBuildingTypeId: 'warehouse',
    destinationBuildingTypeId: 'smelter',
    durationTicks: 6,
    throughputCapacity: 1,
    enabled: true,
  };

  it('returns the category route duration for matching building categories', () => {
    const duration = TransportRouteDurationPolicy.resolveDuration({
      routes: [categoryRoute],
      sourceBuildingTypeId: 'warehouse',
      destinationBuildingTypeId: 'sawmill',
      sourceCategory: 'STORAGE',
      destinationCategory: 'PRODUCTION',
    });

    expect(duration).toBe(8);
  });

  it('prefers a building-type-specific route over a category route', () => {
    const duration = TransportRouteDurationPolicy.resolveDuration({
      routes: [categoryRoute, specificRoute],
      sourceBuildingTypeId: 'warehouse',
      destinationBuildingTypeId: 'smelter',
      sourceCategory: 'STORAGE',
      destinationCategory: 'PRODUCTION',
    });

    expect(duration).toBe(6);
  });

  it('falls back when no enabled route matches', () => {
    const resolved = TransportRouteDurationPolicy.resolve({
      routes: [{ ...categoryRoute, enabled: false }],
      sourceBuildingTypeId: 'warehouse',
      destinationBuildingTypeId: 'sawmill',
      sourceCategory: 'STORAGE',
      destinationCategory: 'PRODUCTION',
    });

    expect(resolved.durationTicks).toBe(FALLBACK_TRANSPORT_DURATION_TICKS);
    expect(resolved.routeId).toBeNull();
  });

  it('returns throughput capacity from the matched route', () => {
    const resolved = TransportRouteDurationPolicy.resolve({
      routes: [categoryRoute],
      sourceBuildingTypeId: 'warehouse',
      destinationBuildingTypeId: 'sawmill',
      sourceCategory: 'STORAGE',
      destinationCategory: 'PRODUCTION',
    });

    expect(resolved.routeId).toBe('route_storage_to_production');
    expect(resolved.throughputCapacity).toBe(2);
  });
});
