/**
 * @module @domain/policies/building/ConstructionCostPolicy
 *
 * Resolves construction cost for a building type.
 */

import { ValidationError } from '../../../common/errors/ValidationError.js';
import { Result } from '../../../common/result/Result.js';
import { Guard } from '../../../common/validation/Guard.js';
import type { Policy } from '../Policy.js';

/** Building type data required to resolve construction cost. */
export type ConstructionCostContext = {
  readonly buildingTypeId: string;
  readonly constructionCost: number;
  readonly enabled: boolean;
};

/** Resolved construction cost decision. */
export type ConstructionCostDecision = {
  readonly cost: number;
};

/**
 * Determines the construction cost for a building type placement.
 */
export class ConstructionCostPolicy implements Policy<ConstructionCostContext, ConstructionCostDecision> {
  evaluate(context: ConstructionCostContext): Result<ConstructionCostDecision, ValidationError> {
    if (!context.enabled) {
      return Result.fail(
        new ValidationError(`Building type "${context.buildingTypeId}" is disabled.`),
      );
    }

    const costResult = Guard.againstNegative(
      context.constructionCost,
      'Construction cost must not be negative.',
    );

    if (!costResult.ok) {
      return Result.fail(costResult.error);
    }

    return Result.ok(
      Object.freeze({
        cost: costResult.value,
      }),
    );
  }
}
