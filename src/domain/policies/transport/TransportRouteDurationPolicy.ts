/**
 * @module @domain/policies/transport/TransportRouteDurationPolicy
 *
 * Resolves transport route rules from abstract route content (DD-022).
 */

/** Fallback duration when no route rule matches (transport.md v1 default). */
export const FALLBACK_TRANSPORT_DURATION_TICKS = 5;

/** Unlimited concurrent transports when no route rule matches. */
export const FALLBACK_TRANSPORT_THROUGHPUT_CAPACITY = Number.MAX_SAFE_INTEGER;

/** Minimal route rule shape for route resolution. */
export type TransportRouteRule = {
  readonly id: string;
  readonly sourceCategory: string | null;
  readonly destinationCategory: string | null;
  readonly sourceBuildingTypeId: string | null;
  readonly destinationBuildingTypeId: string | null;
  readonly durationTicks: number;
  readonly throughputCapacity: number;
  readonly enabled: boolean;
};

/** Input for resolving one building-pair transport route. */
export type ResolveTransportRouteParams = {
  readonly routes: readonly TransportRouteRule[];
  readonly sourceBuildingTypeId: string;
  readonly destinationBuildingTypeId: string;
  readonly sourceCategory: string;
  readonly destinationCategory: string;
};

/** Resolved abstract route for one building pair. */
export type ResolvedTransportRoute = {
  readonly routeId: string | null;
  readonly durationTicks: number;
  readonly throughputCapacity: number;
};

/**
 * Picks the most specific enabled route and returns duration, throughput and route id.
 */
export class TransportRouteDurationPolicy {
  static resolve(params: ResolveTransportRouteParams): ResolvedTransportRoute {
    const matchedRoute = this.resolveMatchedRoute(params);

    if (matchedRoute === null) {
      return Object.freeze({
        routeId: null,
        durationTicks: FALLBACK_TRANSPORT_DURATION_TICKS,
        throughputCapacity: FALLBACK_TRANSPORT_THROUGHPUT_CAPACITY,
      });
    }

    return Object.freeze({
      routeId: matchedRoute.id,
      durationTicks: matchedRoute.durationTicks,
      throughputCapacity: matchedRoute.throughputCapacity,
    });
  }

  static resolveDuration(params: ResolveTransportRouteParams): number {
    return this.resolve(params).durationTicks;
  }

  static resolveMatchedRoute(params: ResolveTransportRouteParams): TransportRouteRule | null {
    const enabledRoutes = params.routes.filter((route) => route.enabled);
    const buildingTypeMatch = enabledRoutes.find(
      (route) =>
        route.sourceBuildingTypeId === params.sourceBuildingTypeId &&
        route.destinationBuildingTypeId === params.destinationBuildingTypeId,
    );

    if (buildingTypeMatch !== undefined) {
      return buildingTypeMatch;
    }

    const categoryMatches = enabledRoutes
      .filter(
        (route) =>
          route.sourceBuildingTypeId === null &&
          route.destinationBuildingTypeId === null &&
          route.sourceCategory === params.sourceCategory &&
          route.destinationCategory === params.destinationCategory,
      )
      .sort((left, right) => left.id.localeCompare(right.id));

    return categoryMatches[0] ?? null;
  }
}
