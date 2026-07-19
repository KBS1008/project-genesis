/**
 * @module @domain/region/RegionId
 *
 * Strongly typed identifier for region runtime entities.
 */

import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';

/** Identifier brand for region runtime entities. */
export type RegionId = Identifier<'Region'>;

/** Creates a validated region identifier from a raw string. */
export function createRegionId(rawValue: string): Result<RegionId, ValidationError> {
  const result = Identifier.create<RegionId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
