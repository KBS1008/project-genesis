import {
  FALLBACK_TRANSPORT_DURATION_TICKS,
  FALLBACK_TRANSPORT_THROUGHPUT_CAPACITY,
} from './TransportRouteDurationPolicy.js';
import { RegionalTransportRoutePolicy } from './RegionalTransportRoutePolicy.js';

describe('RegionalTransportRoutePolicy', () => {
  const baseRoute = Object.freeze({
    routeId: 'route_storage_to_production',
    durationTicks: 8,
    throughputCapacity: 2,
  });

  it('applies biome modifiers within the same region', () => {
    const result = RegionalTransportRoutePolicy.resolve({
      baseRoute,
      sourceRegionId: 'region_default',
      destinationRegionId: 'region_default',
      mapDistance: 0,
      sourceTransportDurationModifier: 1.05,
      destinationTransportDurationModifier: 1.05,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.routeId).toBe('route_storage_to_production');
      expect(result.value.durationTicks).toBe(9);
      expect(result.value.throughputCapacity).toBe(2);
    }
  });

  it('adds map distance and isolates cross-region route queues', () => {
    const result = RegionalTransportRoutePolicy.resolve({
      baseRoute,
      sourceRegionId: 'region_default',
      destinationRegionId: 'region_east',
      mapDistance: 2,
      sourceTransportDurationModifier: 1.05,
      destinationTransportDurationModifier: 0.95,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.routeId).toBe('route_storage_to_production::region_default->region_east');
      expect(result.value.durationTicks).toBe(10);
    }
  });

  it('rejects cross-region transport without map distance', () => {
    const result = RegionalTransportRoutePolicy.resolve({
      baseRoute,
      sourceRegionId: 'region_default',
      destinationRegionId: 'region_east',
      mapDistance: 0,
      sourceTransportDurationModifier: 1,
      destinationTransportDurationModifier: 1,
    });

    expect(result.ok).toBe(false);
  });

  it('uses fallback route ids for unmatched base routes', () => {
    const result = RegionalTransportRoutePolicy.resolve({
      baseRoute: Object.freeze({
        routeId: null,
        durationTicks: FALLBACK_TRANSPORT_DURATION_TICKS,
        throughputCapacity: FALLBACK_TRANSPORT_THROUGHPUT_CAPACITY,
      }),
      sourceRegionId: 'region_default',
      destinationRegionId: 'region_north',
      mapDistance: 2,
      sourceTransportDurationModifier: 1,
      destinationTransportDurationModifier: 1,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.routeId).toBe('fallback::region_default->region_north');
      expect(result.value.durationTicks).toBe(7);
    }
  });
});
