/**
 * @module @application/planning/CompanyDecisionValidator
 *
 * Validates planning decisions before they enter the decision queue.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { Guard } from '../../common/validation/Guard.js';
import type { CompanyDecision } from '../../domain/brain/CompanyDecision.js';
import { CompanyDecisionStatus } from '../../domain/brain/CompanyDecisionStatus.js';

/**
 * Validates generated planning decisions.
 */
export class CompanyDecisionValidator {
  /** Validates and returns decisions that pass structural checks. */
  validate(decisions: readonly CompanyDecision[]): Result<readonly CompanyDecision[], ValidationError> {
    const validated: CompanyDecision[] = [];
    const seenKeys = new Set<string>();

    for (const decision of decisions) {
      if (decision.status !== CompanyDecisionStatus.PENDING) {
        return Result.fail(
          new ValidationError(
            `Planning produced non-pending decision "${decision.id.value}" with status "${decision.status}".`,
          ),
        );
      }

      const key = this.#decisionKey(decision);

      if (seenKeys.has(key)) {
        continue;
      }

      seenKeys.add(key);

      const validationResult = this.#validateDecision(decision);

      if (!validationResult.ok) {
        return validationResult;
      }

      validated.push(decision);
    }

    return Result.ok(Object.freeze(validated));
  }

  #validateDecision(decision: CompanyDecision): Result<void, ValidationError> {
    const priorityResult = Guard.againstNegative(
      decision.priority,
      'Decision priority must not be negative.',
    );

    if (!priorityResult.ok) {
      return priorityResult;
    }

    switch (decision.payload.type) {
      case 'PURCHASE_RESOURCE':
      case 'SELL_RESOURCE': {
        const quantityResult = Guard.againstZeroOrNegative(
          decision.payload.data.quantity,
          'Trade quantity must be greater than zero.',
        );

        if (!quantityResult.ok) {
          return quantityResult;
        }

        const regionResult = Guard.againstEmptyString(
          decision.payload.data.regionId,
          'Trade region id must not be empty.',
        );

        if (!regionResult.ok) {
          return regionResult;
        }

        const resourceResult = Guard.againstEmptyString(
          decision.payload.data.resourceId,
          'Trade resource id must not be empty.',
        );

        if (!resourceResult.ok) {
          return resourceResult;
        }

        return Result.ok(undefined);
      }
      case 'START_PRODUCTION': {
        const jobIdResult = Guard.againstEmptyString(
          decision.payload.data.jobId,
          'Production job id must not be empty.',
        );

        if (!jobIdResult.ok) {
          return jobIdResult;
        }

        const buildingIdResult = Guard.againstEmptyString(
          decision.payload.data.buildingId,
          'Production building id must not be empty.',
        );

        if (!buildingIdResult.ok) {
          return buildingIdResult;
        }

        const recipeIdResult = Guard.againstEmptyString(
          decision.payload.data.recipeId,
          'Production recipe id must not be empty.',
        );

        if (!recipeIdResult.ok) {
          return recipeIdResult;
        }

        const batchesResult = Guard.againstZeroOrNegative(
          decision.payload.data.batches,
          'Production batch count must be greater than zero.',
        );

        if (!batchesResult.ok) {
          return batchesResult;
        }

        return Result.ok(undefined);
      }
      case 'PLACE_BUILDING': {
        const buildingIdResult = Guard.againstEmptyString(
          decision.payload.data.buildingId,
          'Building id must not be empty.',
        );

        if (!buildingIdResult.ok) {
          return buildingIdResult;
        }

        const buildingTypeIdResult = Guard.againstEmptyString(
          decision.payload.data.buildingTypeId,
          'Building type id must not be empty.',
        );

        if (!buildingTypeIdResult.ok) {
          return buildingTypeIdResult;
        }

        const nameResult = Guard.againstEmptyString(
          decision.payload.data.name,
          'Building name must not be empty.',
        );

        if (!nameResult.ok) {
          return nameResult;
        }

        const regionResult = Guard.againstEmptyString(
          decision.payload.data.regionId,
          'Building region id must not be empty.',
        );

        if (!regionResult.ok) {
          return regionResult;
        }

        return Result.ok(undefined);
      }
      case 'START_RESEARCH': {
        const jobIdResult = Guard.againstEmptyString(
          decision.payload.data.jobId,
          'Research job id must not be empty.',
        );

        if (!jobIdResult.ok) {
          return jobIdResult;
        }

        const technologyIdResult = Guard.againstEmptyString(
          decision.payload.data.technologyId,
          'Research technology id must not be empty.',
        );

        if (!technologyIdResult.ok) {
          return technologyIdResult;
        }

        return Result.ok(undefined);
      }
      case 'EXPAND_REGION': {
        const targetRegionResult = Guard.againstEmptyString(
          decision.payload.data.targetRegionId,
          'Expansion target region id must not be empty.',
        );

        if (!targetRegionResult.ok) {
          return targetRegionResult;
        }

        const buildingIdResult = Guard.againstEmptyString(
          decision.payload.data.buildingId,
          'Expansion building id must not be empty.',
        );

        if (!buildingIdResult.ok) {
          return buildingIdResult;
        }

        const buildingTypeIdResult = Guard.againstEmptyString(
          decision.payload.data.buildingTypeId,
          'Expansion building type id must not be empty.',
        );

        if (!buildingTypeIdResult.ok) {
          return buildingTypeIdResult;
        }

        const nameResult = Guard.againstEmptyString(
          decision.payload.data.name,
          'Expansion building name must not be empty.',
        );

        if (!nameResult.ok) {
          return nameResult;
        }

        return Result.ok(undefined);
      }
      default:
        return Result.ok(undefined);
    }
  }

  #decisionKey(decision: CompanyDecision): string {
    if (decision.payload.type === 'PURCHASE_RESOURCE' || decision.payload.type === 'SELL_RESOURCE') {
      return `${decision.type}:${decision.payload.data.resourceId}:${decision.payload.data.regionId}`;
    }

    if (decision.payload.type === 'START_PRODUCTION') {
      return `${decision.type}:${decision.payload.data.buildingId}:${decision.payload.data.recipeId}`;
    }

    if (decision.payload.type === 'PLACE_BUILDING') {
      return `${decision.type}:${decision.payload.data.buildingId}`;
    }

    if (decision.payload.type === 'START_RESEARCH') {
      return `${decision.type}:${decision.payload.data.technologyId}`;
    }

    if (decision.payload.type === 'EXPAND_REGION') {
      return `${decision.type}:${decision.payload.data.buildingId}`;
    }

    return decision.id.value;
  }
}
