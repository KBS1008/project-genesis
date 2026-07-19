/**
 * @module @application/queries/GetWorldOverviewQueryHandler
 *
 * Reads bootstrapped world overview without modifying aggregates.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { CityRepository } from '../../domain/city/CityRepository.js';
import { createWorldId } from '../../domain/world/WorldId.js';
import type { WorldRepository } from '../../domain/world/WorldRepository.js';
import { DEFAULT_MAP_ID, DEFAULT_WORLD_ID } from '../../domain/world/WorldConstants.js';
import type { WorldMapRepository } from '../../domain/world/WorldMapRepository.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { WorldOverviewReadModel } from '../read-models/WorldOverviewReadModel.js';
import type { GetWorldOverviewQuery } from './GetWorldOverviewQuery.js';

/** Dependencies required by {@link GetWorldOverviewQueryHandler}. */
export type GetWorldOverviewQueryHandlerDependencies = Pick<
  ApplicationContext,
  'worldRepository' | 'cityRepository' | 'worldMapRepository'
>;

/**
 * Returns read models summarizing one bootstrapped world.
 */
export class GetWorldOverviewQueryHandler {
  readonly #worldRepository: GetWorldOverviewQueryHandlerDependencies['worldRepository'];
  readonly #cityRepository: GetWorldOverviewQueryHandlerDependencies['cityRepository'];
  readonly #worldMapRepository: GetWorldOverviewQueryHandlerDependencies['worldMapRepository'];

  constructor(dependencies: GetWorldOverviewQueryHandlerDependencies) {
    this.#worldRepository = dependencies.worldRepository;
    this.#cityRepository = dependencies.cityRepository;
    this.#worldMapRepository = dependencies.worldMapRepository;
  }

  execute(query: GetWorldOverviewQuery = {}): Result<WorldOverviewReadModel, ValidationError> {
    const requestedWorldId = query.worldId ?? DEFAULT_WORLD_ID;
    const worldIdResult = createWorldId(requestedWorldId);

    if (!worldIdResult.ok) {
      return Result.fail(worldIdResult.error);
    }

    const world = this.#worldRepository.findById(worldIdResult.value);

    if (world === undefined) {
      return Result.fail(new ValidationError(`World id "${requestedWorldId}" was not found.`));
    }

    const regionIds = world.getRegionIds().map((regionId) => regionId.value);
    const cityCount = this.#cityRepository
      .findAll()
      .filter((city) => regionIds.includes(city.getRegionId().value)).length;
    const maps = this.#worldMapRepository.findAll();
    const preferredMap = maps.find((map) => map.getId().value === DEFAULT_MAP_ID);
    const defaultMapId = preferredMap?.getId().value ?? maps[0]?.getId().value ?? DEFAULT_MAP_ID;

    return Result.ok(
      Object.freeze({
        activeWorldId: world.getId().value,
        worldName: world.getName(),
        regionIds: Object.freeze([...regionIds]),
        regionCount: regionIds.length,
        cityCount,
        defaultMapId,
      }),
    );
  }
}
