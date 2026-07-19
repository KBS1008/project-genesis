/**
 * @module @application/queries/GetRegionDetailsQueryHandler
 *
 * Reads one region with resources and cities without modifying aggregates.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { City } from '../../domain/city/City.js';
import type { CityRepository } from '../../domain/city/CityRepository.js';
import type { Region } from '../../domain/region/Region.js';
import { createRegionId } from '../../domain/region/RegionId.js';
import type { RegionRepository } from '../../domain/region/RegionRepository.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { CityReadModel } from '../read-models/CityReadModel.js';
import type { RegionDetailsReadModel } from '../read-models/RegionDetailsReadModel.js';
import type { RegionReadModel } from '../read-models/RegionReadModel.js';
import type { GetRegionDetailsQuery } from './GetRegionDetailsQuery.js';

/** Dependencies required by {@link GetRegionDetailsQueryHandler}. */
export type GetRegionDetailsQueryHandlerDependencies = Pick<
  ApplicationContext,
  'regionRepository' | 'cityRepository'
>;

/**
 * Returns a combined read model for one bootstrapped region.
 */
export class GetRegionDetailsQueryHandler {
  readonly #regionRepository: GetRegionDetailsQueryHandlerDependencies['regionRepository'];
  readonly #cityRepository: GetRegionDetailsQueryHandlerDependencies['cityRepository'];

  constructor(dependencies: GetRegionDetailsQueryHandlerDependencies) {
    this.#regionRepository = dependencies.regionRepository;
    this.#cityRepository = dependencies.cityRepository;
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
        region: mapRegion(region),
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

function mapCity(city: City): CityReadModel {
  return Object.freeze({
    id: city.getId().value,
    name: city.getName(),
    regionId: city.getRegionId().value,
    category: city.getCategory(),
  });
}
