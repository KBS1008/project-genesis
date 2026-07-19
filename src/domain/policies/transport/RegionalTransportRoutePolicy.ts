/**
 * @module @domain/policies/transport/RegionalTransportRoutePolicy
 *
 * Applies region, map distance and biome modifiers to abstract transport routes.
 */

import { ValidationError } from '../../../common/errors/ValidationError.js';
import { Result } from '../../../common/result/Result.js';
import type { ResolvedTransportRoute } from './TransportRouteDurationPolicy.js';

/** Input for resolving one region-aware transport route. */
export type ResolveRegionalTransportRouteParams = {
  readonly baseRoute: ResolvedTransportRoute;
  readonly sourceRegionId: string;
  readonly destinationRegionId: string;
  readonly mapDistance: number;
  readonly sourceTransportDurationModifier: number;
  readonly destinationTransportDurationModifier: number;
};

/**
 * Extends abstract M6 routes with deterministic inter-region queue isolation.
 */
export class RegionalTransportRoutePolicy {
  /** Returns route id, duration and throughput for one building pair across regions. */
  static resolve(
    params: ResolveRegionalTransportRouteParams,
  ): Result<ResolvedTransportRoute, ValidationError> {
    if (params.mapDistance < 0) {
      return Result.fail(new ValidationError('Map distance must not be negative.'));
    }

    const isCrossRegion = params.sourceRegionId !== params.destinationRegionId;

    if (isCrossRegion && params.mapDistance < 1) {
      return Result.fail(
        new ValidationError(
          `Regions "${params.sourceRegionId}" and "${params.destinationRegionId}" are not connected on the world map.`,
        ),
      );
    }

    const durationTicks = this.#resolveDurationTicks(params, isCrossRegion);
    const routeId = this.#resolveRouteId(params, isCrossRegion);

    return Result.ok(
      Object.freeze({
        routeId,
        durationTicks,
        throughputCapacity: params.baseRoute.throughputCapacity,
      }),
    );
  }

  static #resolveDurationTicks(
    params: ResolveRegionalTransportRouteParams,
    isCrossRegion: boolean,
  ): number {
    const adjustedBase = Math.ceil(
      params.baseRoute.durationTicks *
        params.sourceTransportDurationModifier *
        params.destinationTransportDurationModifier,
    );

    return isCrossRegion ? adjustedBase + params.mapDistance : adjustedBase;
  }

  static #resolveRouteId(
    params: ResolveRegionalTransportRouteParams,
    isCrossRegion: boolean,
  ): string | null {
    if (!isCrossRegion) {
      return params.baseRoute.routeId;
    }

    const baseRouteId = params.baseRoute.routeId ?? 'fallback';

    return `${baseRouteId}::${params.sourceRegionId}->${params.destinationRegionId}`;
  }
}
