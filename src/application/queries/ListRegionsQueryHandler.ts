/**
 * @module @application/queries/ListRegionsQueryHandler
 *
 * Reads bootstrapped region state without modifying aggregates.
 */

import { Result } from '../../common/result/Result.js';
import type { ValidationError } from '../../common/errors/ValidationError.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import { mapRegionReadModel } from '../read-models/mapRegionReadModel.js';
import type { RegionReadModel } from '../read-models/RegionReadModel.js';
import type { ListRegionsQuery } from './ListRegionsQuery.js';

/** Dependencies required by {@link ListRegionsQueryHandler}. */
export type ListRegionsQueryHandlerDependencies = Pick<
  ApplicationContext,
  'regionRepository' | 'gameContent'
>;

/**
 * Returns read models for all bootstrapped regions.
 */
export class ListRegionsQueryHandler {
  readonly #regionRepository: ListRegionsQueryHandlerDependencies['regionRepository'];
  readonly #biomes: ListRegionsQueryHandlerDependencies['gameContent']['biomes'];

  constructor(dependencies: ListRegionsQueryHandlerDependencies) {
    this.#regionRepository = dependencies.regionRepository;
    this.#biomes = dependencies.gameContent.biomes;
  }

  execute(_query: ListRegionsQuery = {}): Result<readonly RegionReadModel[], ValidationError> {
    const regions = this.#regionRepository.findAll();

    return Result.ok(
      Object.freeze(regions.map((region) => mapRegionReadModel(region, this.#biomes))),
    );
  }
}
