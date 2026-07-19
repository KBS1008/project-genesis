/**
 * @module @application/queries/ListCitiesQueryHandler
 *
 * Reads bootstrapped city state without modifying aggregates.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { City } from '../../domain/city/City.js';
import { createRegionId } from '../../domain/region/RegionId.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { CityReadModel } from '../read-models/CityReadModel.js';
import type { ListCitiesQuery } from './ListCitiesQuery.js';

/** Dependencies required by {@link ListCitiesQueryHandler}. */
export type ListCitiesQueryHandlerDependencies = Pick<
  ApplicationContext,
  'cityRepository' | 'regionRepository'
>;

/**
 * Returns read models for all bootstrapped cities, optionally filtered by region.
 */
export class ListCitiesQueryHandler {
  readonly #cityRepository: ListCitiesQueryHandlerDependencies['cityRepository'];
  readonly #regionRepository: ListCitiesQueryHandlerDependencies['regionRepository'];

  constructor(dependencies: ListCitiesQueryHandlerDependencies) {
    this.#cityRepository = dependencies.cityRepository;
    this.#regionRepository = dependencies.regionRepository;
  }

  execute(query: ListCitiesQuery = {}): Result<readonly CityReadModel[], ValidationError> {
    if (query.regionId === undefined) {
      return Result.ok(Object.freeze(this.#cityRepository.findAll().map(mapCity)));
    }

    const regionIdResult = createRegionId(query.regionId);

    if (!regionIdResult.ok) {
      return Result.fail(regionIdResult.error);
    }

    if (this.#regionRepository.findById(regionIdResult.value) === undefined) {
      return Result.fail(
        new ValidationError(`Region id "${regionIdResult.value.value}" was not found.`),
      );
    }

    return Result.ok(
      Object.freeze(this.#cityRepository.findByRegionId(regionIdResult.value).map(mapCity)),
    );
  }
}

function mapCity(city: City): CityReadModel {
  return Object.freeze({
    id: city.getId().value,
    name: city.getName(),
    regionId: city.getRegionId().value,
    category: city.getCategory(),
  });
}
