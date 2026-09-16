/**
 * @module @application/queries/GetRegionDetailsQueryHandler
 *
 * Reads one region with resources and cities without modifying aggregates.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { City } from '../../domain/city/City.js';
import type { CityRepository } from '../../domain/city/CityRepository.js';
import { createRegionId } from '../../domain/region/RegionId.js';
import { mapRegionReadModel } from '../read-models/mapRegionReadModel.js';
import type { RegionRepository } from '../../domain/region/RegionRepository.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { CityReadModel } from '../read-models/CityReadModel.js';
import type { RegionDetailsReadModel } from '../read-models/RegionDetailsReadModel.js';
import type { RegionReadModel } from '../read-models/RegionReadModel.js';
import type { GetRegionDetailsQuery } from './GetRegionDetailsQuery.js';

/** Dependencies required by {@link GetRegionDetailsQueryHandler}. */
export type GetRegionDetailsQueryHandlerDependencies = Pick<
  ApplicationContext,
  'regionRepository' | 'cityRepository' | 'gameContent'
>;

/**
 * Returns a combined read model for one bootstrapped region.
 */
export class GetRegionDetailsQueryHandler {
  readonly #regionRepository: GetRegionDetailsQueryHandlerDependencies['regionRepository'];
  readonly #cityRepository: GetRegionDetailsQueryHandlerDependencies['cityRepository'];
  readonly #biomes: GetRegionDetailsQueryHandlerDependencies['gameContent']['biomes'];

  constructor(dependencies: GetRegionDetailsQueryHandlerDependencies) {
    this.#regionRepository = dependencies.regionRepository;
    this.#cityRepository = dependencies.cityRepository;
    this.#biomes = dependencies.gameContent.biomes;
  }

  execute(query: GetRegionDetailsQuery): Result<RegionDetailsReadModel, ValidationError> {
    const regionIdResult = createRegionId(query.regionId);

    if (!regionIdResult.ok) {
      return Result.fail(regionIdResult.error);
    }

    const region = this.#regionRepository.findById(regionIdResult.value);

    if (region === undefined) {
      return Result.fail(
        new ValidationError(`Region id "${regionIdResult.value.value}" was not found.`),
      );
    }

    const cities = this.#cityRepository.findByRegionId(regionIdResult.value);

    return Result.ok(
      Object.freeze({
        region: mapRegionReadModel(region, this.#biomes),
        regionalResources: Object.freeze(
          region.getRegionalResources().map((entry) =>
            Object.freeze({
              resourceTypeId: entry.resourceTypeId,
              available: entry.available,
              extractionModifier: entry.extractionModifier,
            }),
          ),
        ),
        cities: Object.freeze(cities.map(mapCity)),
      }),
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
