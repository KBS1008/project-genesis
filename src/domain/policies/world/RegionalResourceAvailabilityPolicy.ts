/**
 * @module @domain/policies/world/RegionalResourceAvailabilityPolicy
 *
 * Deterministic regional resource availability checks (Option A — no depletion).
 */

import { ValidationError } from '../../../common/errors/ValidationError.js';
import { Result } from '../../../common/result/Result.js';
import type { Region } from '../../region/Region.js';
import type { RegionalResourceAvailability } from '../../region/RegionalResourceAvailability.js';

/** Recipe input entry used for regional availability validation. */
export type RegionalResourceRecipeInput = {
  readonly resource: string;
};

/**
 * Resolves static regional resource availability without simulating deposits.
 */
export class RegionalResourceAvailabilityPolicy {
  /**
   * Returns availability for one resource type in a region.
   *
   * Fails when the resource is not listed or marked unavailable.
   */
  static resolveAvailability(
    region: Region,
    resourceTypeId: string,
  ): Result<RegionalResourceAvailability, ValidationError> {
    const availability = region.getRegionalResource(resourceTypeId);

    if (availability === undefined) {
      return Result.fail(
        new ValidationError(
          `Resource "${resourceTypeId}" is not available in region "${region.getId().value}".`,
        ),
      );
    }

    if (!availability.available) {
      return Result.fail(
        new ValidationError(
          `Resource "${resourceTypeId}" is unavailable in region "${region.getId().value}".`,
        ),
      );
    }

    return Result.ok(availability);
  }

  /** Validates that all recipe inputs are regionally available. */
  static validateRecipeInputs(
    region: Region,
    inputs: readonly RegionalResourceRecipeInput[],
  ): Result<void, ValidationError> {
    for (const input of [...inputs].sort((left, right) =>
      left.resource.localeCompare(right.resource),
    )) {
      const availabilityResult = this.resolveAvailability(region, input.resource);

      if (!availabilityResult.ok) {
        return availabilityResult;
      }
    }

    return Result.ok(undefined);
  }
}
