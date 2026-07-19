/**
 * @module @domain/policies/world/RegionConnectivityPolicy
 *
 * Deterministic region connectivity and distance resolution from abstract map graphs.
 */

import { ValidationError } from '../../../common/errors/ValidationError.js';
import { Result } from '../../../common/result/Result.js';
import type { RegionId } from '../../region/RegionId.js';
import type { WorldMap } from '../../world/WorldMap.js';

/** Input for resolving distance between two regions on a world map. */
export type ResolveRegionDistanceParams = {
  readonly map: WorldMap;
  readonly fromRegionId: RegionId;
  readonly toRegionId: RegionId;
};

/**
 * Resolves direct map connectivity without pathfinding.
 */
export class RegionConnectivityPolicy {
  /**
   * Returns abstract distance between two regions.
   *
   * Same region returns 0. Directly connected regions return map connection distance.
   * Disconnected regions fail explicitly.
   */
  static resolveDistance(params: ResolveRegionDistanceParams): Result<number, ValidationError> {
    if (params.fromRegionId.equals(params.toRegionId)) {
      return Result.ok(0);
    }

    const connection = params.map.findConnection(params.fromRegionId, params.toRegionId);

    if (connection === undefined) {
      return Result.fail(
        new ValidationError(
          `Regions "${params.fromRegionId.value}" and "${params.toRegionId.value}" are not connected on the world map.`,
        ),
      );
    }

    return Result.ok(connection.distance);
  }

  /** Returns whether two regions are directly connected or identical. */
  static areConnected(params: ResolveRegionDistanceParams): boolean {
    return this.resolveDistance(params).ok;
  }
}
