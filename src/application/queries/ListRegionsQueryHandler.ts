/**
 * @module @application/queries/ListRegionsQueryHandler
 *
 * Reads bootstrapped region state without modifying aggregates.
 */

import { Result } from '../../common/result/Result.js';
import type { ValidationError } from '../../common/errors/ValidationError.js';
import type { Region } from '../../domain/region/Region.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { RegionReadModel } from '../read-models/RegionReadModel.js';
import type { ListRegionsQuery } from './ListRegionsQuery.js';

/** Dependencies required by {@link ListRegionsQueryHandler}. */
export type ListRegionsQueryHandlerDependencies = Pick<ApplicationContext, 'regionRepository'>;

/**
 * Returns read models for all bootstrapped regions.
 */
export class ListRegionsQueryHandler {
  readonly #regionRepository: ListRegionsQueryHandlerDependencies['regionRepository'];

  constructor(dependencies: ListRegionsQueryHandlerDependencies) {
    this.#regionRepository = dependencies.regionRepository;
  }

  execute(_query: ListRegionsQuery = {}): Result<readonly RegionReadModel[], ValidationError> {
    const regions = this.#regionRepository.findAll();

    return Result.ok(Object.freeze(regions.map(mapRegion)));
  }
}

function mapRegion(region: Region): RegionReadModel {
  const mapPosition = region.getMapPosition();

  return Object.freeze({
    id: region.getId().value,
    name: region.getName(),
    description: region.getDescription(),
    worldId: region.getWorldId().value,
    biomeId: region.getBiomeId(),
    mapX: mapPosition.x,
    mapY: mapPosition.y,
    neighborRegionIds: Object.freeze(
      region.getNeighborRegionIds().map((neighborId) => neighborId.value),
    ),
    cityIds: Object.freeze(region.getCityIds().map((cityId) => cityId.value)),
  });
}
