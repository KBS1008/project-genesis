/**
 * @module @application/services/BuildingRegionPlacement
 *
 * Resolves and validates region ownership for spatial building placement.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createRegionId, type RegionId } from '../../domain/region/RegionId.js';
import type { RegionRepository } from '../../domain/region/RegionRepository.js';
import { DEFAULT_REGION_ID } from '../../domain/world/WorldConstants.js';

/**
 * Resolves the target region for a building placement command.
 *
 * Uses {@link DEFAULT_REGION_ID} when no explicit region is provided.
 */
export function resolveBuildingRegionId(
  regionRepository: RegionRepository,
  requestedRegionId?: string,
): Result<RegionId, ValidationError> {
  const rawRegionId = requestedRegionId ?? DEFAULT_REGION_ID;
  const regionIdResult = createRegionId(rawRegionId);

  if (!regionIdResult.ok) {
    return Result.fail(regionIdResult.error);
  }

  if (regionRepository.findById(regionIdResult.value) === undefined) {
    return Result.fail(new ValidationError(`Region id "${rawRegionId}" was not found.`));
  }

  return Result.ok(regionIdResult.value);
}
