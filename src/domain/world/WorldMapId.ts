/**
 * @module @domain/world/WorldMapId
 *
 * Strongly typed identifier for world map runtime entities.
 */

import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';

/** Identifier brand for world map runtime entities. */
export type WorldMapId = Identifier<'WorldMap'>;

/** Creates a validated world map identifier from a raw string. */
export function createWorldMapId(rawValue: string): Result<WorldMapId, ValidationError> {
  const result = Identifier.create<WorldMapId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
