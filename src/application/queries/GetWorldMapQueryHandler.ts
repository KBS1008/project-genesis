/**
 * @module @application/queries/GetWorldMapQueryHandler
 *
 * Reads abstract world map connectivity without modifying aggregates.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { WorldMap } from '../../domain/world/WorldMap.js';
import { createWorldMapId } from '../../domain/world/WorldMapId.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { WorldMapReadModel } from '../read-models/WorldMapReadModel.js';
import type { GetWorldMapQuery } from './GetWorldMapQuery.js';

/** Dependencies required by {@link GetWorldMapQueryHandler}. */
export type GetWorldMapQueryHandlerDependencies = Pick<ApplicationContext, 'worldMapRepository'>;

/**
 * Returns a read model for one bootstrapped world map.
 */
export class GetWorldMapQueryHandler {
  readonly #worldMapRepository: GetWorldMapQueryHandlerDependencies['worldMapRepository'];

  constructor(dependencies: GetWorldMapQueryHandlerDependencies) {
    this.#worldMapRepository = dependencies.worldMapRepository;
  }

  execute(query: GetWorldMapQuery): Result<WorldMapReadModel, ValidationError> {
    const mapIdResult = createWorldMapId(query.mapId);

    if (!mapIdResult.ok) {
      return Result.fail(mapIdResult.error);
    }

    const worldMap = this.#worldMapRepository.findById(mapIdResult.value);

    if (worldMap === undefined) {
      return Result.fail(
        new ValidationError(`World map id "${mapIdResult.value.value}" was not found.`),
      );
    }

    return Result.ok(mapWorldMap(worldMap));
  }
}

function mapWorldMap(worldMap: WorldMap): WorldMapReadModel {
  return Object.freeze({
    id: worldMap.getId().value,
    name: worldMap.getName(),
    regions: Object.freeze(
      worldMap.getRegionPlacements().map((placement) =>
        Object.freeze({
          regionId: placement.regionId.value,
          x: placement.x,
          y: placement.y,
        }),
      ),
    ),
    connections: Object.freeze(
      worldMap.getConnections().map((connection) =>
        Object.freeze({
          fromRegionId: connection.fromRegionId.value,
          toRegionId: connection.toRegionId.value,
          distance: connection.distance,
        }),
      ),
    ),
  });
}
