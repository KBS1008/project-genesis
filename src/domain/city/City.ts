/**
 * @module @domain/city/City
 *
 * Runtime city entity initialized from static content definitions.
 */

import { Entity } from '../../common/core/Entity.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { isCityCategory, type CityCategory } from './CityCategory.js';
import { createCityId, type CityId } from '../region/CityId.js';
import { createRegionId, type RegionId } from '../region/RegionId.js';

/** Parameters for constructing a runtime city. */
export type CreateCityParams = {
  readonly id: CityId;
  readonly name: string;
  readonly regionId: RegionId;
  readonly category: CityCategory;
};

/** Static city content used to initialize runtime state. */
export type CityContentSeed = {
  readonly id: string;
  readonly name: string;
  readonly regionId: string;
  readonly category: CityCategory;
};

/**
 * Regional infrastructure node bound to exactly one region.
 */
export class City extends Entity<'City'> {
  readonly #name: string;
  readonly #regionId: RegionId;
  readonly #category: CityCategory;

  private constructor(params: CreateCityParams) {
    super(params.id);
    this.#name = params.name;
    this.#regionId = params.regionId;
    this.#category = params.category;
    Object.freeze(this);
  }

  /** Creates a runtime city from validated static content. */
  static fromContent(seed: CityContentSeed): Result<City, ValidationError> {
    const cityIdResult = createCityId(seed.id);

    if (!cityIdResult.ok) {
      return Result.fail(cityIdResult.error);
    }

    const regionIdResult = createRegionId(seed.regionId);

    if (!regionIdResult.ok) {
      return Result.fail(regionIdResult.error);
    }

    if (!isCityCategory(seed.category)) {
      return Result.fail(new ValidationError(`City category "${seed.category}" is not supported.`));
    }

    return Result.ok(
      new City({
        id: cityIdResult.value,
        name: seed.name,
        regionId: regionIdResult.value,
        category: seed.category,
      }),
    );
  }

  getName(): string {
    return this.#name;
  }

  getRegionId(): RegionId {
    return this.#regionId;
  }

  getCategory(): CityCategory {
    return this.#category;
  }
}
