/**
 * @module @domain/world/WorldMap
 *
 * Runtime abstract world map graph initialized from static content definitions.
 */

import { Entity } from '../../common/core/Entity.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createRegionId, type RegionId } from '../region/RegionId.js';
import { createWorldMapId, type WorldMapId } from './WorldMapId.js';

/** Region placement on the abstract world map. */
export type WorldMapRegionPlacement = {
  readonly regionId: RegionId;
  readonly x: number;
  readonly y: number;
};

/** Connection between two regions on the abstract map. */
export type WorldMapRegionConnection = {
  readonly fromRegionId: RegionId;
  readonly toRegionId: RegionId;
  readonly distance: number;
};

/** Parameters for constructing a runtime world map. */
export type CreateWorldMapParams = {
  readonly id: WorldMapId;
  readonly name: string;
  readonly regions: readonly WorldMapRegionPlacement[];
  readonly connections: readonly WorldMapRegionConnection[];
};

/** Static map content used to initialize runtime state. */
export type WorldMapContentSeed = {
  readonly id: string;
  readonly name: string;
  readonly regions: readonly { readonly regionId: string; readonly x: number; readonly y: number }[];
  readonly connections: readonly {
    readonly fromRegionId: string;
    readonly toRegionId: string;
    readonly distance: number;
  }[];
};

/**
 * Deterministic abstract map graph for region placement and connectivity.
 */
export class WorldMap extends Entity<'WorldMap'> {
  readonly #name: string;
  readonly #regions: readonly WorldMapRegionPlacement[];
  readonly #connections: readonly WorldMapRegionConnection[];

  private constructor(params: CreateWorldMapParams) {
    super(params.id);
    this.#name = params.name;
    this.#regions = Object.freeze(
      params.regions.map((placement) => Object.freeze({ ...placement })),
    );
    this.#connections = Object.freeze(
      params.connections.map((connection) => Object.freeze({ ...connection })),
    );
    Object.freeze(this);
  }

  /** Creates a runtime world map from validated static content. */
  static fromContent(seed: WorldMapContentSeed): Result<WorldMap, ValidationError> {
    const mapIdResult = createWorldMapId(seed.id);

    if (!mapIdResult.ok) {
      return Result.fail(mapIdResult.error);
    }

    const regions: WorldMapRegionPlacement[] = [];
    const seenRegions = new Set<string>();

    for (const placement of [...seed.regions].sort((left, right) =>
      left.regionId.localeCompare(right.regionId),
    )) {
      const regionIdResult = createRegionId(placement.regionId);

      if (!regionIdResult.ok) {
        return Result.fail(regionIdResult.error);
      }

      if (seenRegions.has(regionIdResult.value.value)) {
        return Result.fail(
          new ValidationError(
            `World map "${seed.id}" contains duplicate region placement "${regionIdResult.value.value}".`,
          ),
        );
      }

      seenRegions.add(regionIdResult.value.value);
      regions.push({
        regionId: regionIdResult.value,
        x: placement.x,
        y: placement.y,
      });
    }

    const connections: WorldMapRegionConnection[] = [];

    for (const connection of seed.connections) {
      const fromRegionIdResult = createRegionId(connection.fromRegionId);

      if (!fromRegionIdResult.ok) {
        return Result.fail(fromRegionIdResult.error);
      }

      const toRegionIdResult = createRegionId(connection.toRegionId);

      if (!toRegionIdResult.ok) {
        return Result.fail(toRegionIdResult.error);
      }

      if (fromRegionIdResult.value.equals(toRegionIdResult.value)) {
        return Result.fail(
          new ValidationError(`World map "${seed.id}" connection endpoints must differ.`),
        );
      }

      if (connection.distance < 1) {
        return Result.fail(
          new ValidationError(`World map "${seed.id}" connection distance must be at least 1.`),
        );
      }

      connections.push({
        fromRegionId: fromRegionIdResult.value,
        toRegionId: toRegionIdResult.value,
        distance: connection.distance,
      });
    }

    connections.sort((left, right) => {
      const fromCompare = left.fromRegionId.value.localeCompare(right.fromRegionId.value);

      if (fromCompare !== 0) {
        return fromCompare;
      }

      return left.toRegionId.value.localeCompare(right.toRegionId.value);
    });

    return Result.ok(
      new WorldMap({
        id: mapIdResult.value,
        name: seed.name,
        regions,
        connections,
      }),
    );
  }

  getName(): string {
    return this.#name;
  }

  /** Returns all region placements in deterministic id order. */
  getRegionPlacements(): readonly WorldMapRegionPlacement[] {
    return this.#regions;
  }

  /** Returns all map connections in deterministic order. */
  getConnections(): readonly WorldMapRegionConnection[] {
    return this.#connections;
  }

  /** Returns placement for one region, if present on the map. */
  getRegionPlacement(regionId: RegionId): WorldMapRegionPlacement | undefined {
    return this.#regions.find((placement) => placement.regionId.equals(regionId));
  }

  /** Returns a direct connection between two regions in either direction. */
  findConnection(
    fromRegionId: RegionId,
    toRegionId: RegionId,
  ): WorldMapRegionConnection | undefined {
    return this.#connections.find(
      (connection) =>
        (connection.fromRegionId.equals(fromRegionId) &&
          connection.toRegionId.equals(toRegionId)) ||
        (connection.fromRegionId.equals(toRegionId) &&
          connection.toRegionId.equals(fromRegionId)),
    );
  }
}
