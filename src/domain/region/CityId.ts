/**
 * @module @domain/region/CityId
 *
 * Strongly typed identifier for city content references on regions.
 */

import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';

/** Identifier brand for city references. */
export type CityId = Identifier<'City'>;

/** Creates a validated city identifier from a raw string. */
export function createCityId(rawValue: string): Result<CityId, ValidationError> {
  const result = Identifier.create<CityId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
