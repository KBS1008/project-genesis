/**
 * @module @domain/brain/DecisionQueue
 *
 * Deterministic priority queue for pending company decisions.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { Guard } from '../../common/validation/Guard.js';
import type { CompanyDecision } from './CompanyDecision.js';
import { CompanyDecisionStatus } from './CompanyDecisionStatus.js';

/** Sorts decisions by priority descending, then creation tick, then id. */
export function compareDecisionsForExecution(
  left: CompanyDecision,
  right: CompanyDecision,
): number {
  if (left.priority !== right.priority) {
    return right.priority - left.priority;
  }

  if (left.createdAtTick !== right.createdAtTick) {
    return left.createdAtTick - right.createdAtTick;
  }

  return left.id.value.localeCompare(right.id.value);
}

/**
 * Deterministic decision queue owned by a company brain aggregate.
 */
export class DecisionQueue {
  readonly #decisions = new Map<string, CompanyDecision>();

  private constructor(decisions: readonly CompanyDecision[]) {
    for (const decision of decisions) {
      this.#decisions.set(decision.id.value, decision);
    }
  }

  /** Creates an empty decision queue. */
  static empty(): DecisionQueue {
    return new DecisionQueue([]);
  }

  /** Creates a decision queue from persisted decisions. */
  static fromDecisions(
    decisions: readonly CompanyDecision[],
  ): Result<DecisionQueue, ValidationError> {
    const seenIds = new Set<string>();

    for (const decision of decisions) {
      if (seenIds.has(decision.id.value)) {
        return Result.fail(
          new ValidationError(`Duplicate decision id "${decision.id.value}" in queue.`),
        );
      }

      seenIds.add(decision.id.value);

      const priorityResult = Guard.againstNegative(
        decision.priority,
        'Decision priority must not be negative.',
      );

      if (!priorityResult.ok) {
        return Result.fail(priorityResult.error);
      }
    }

    return Result.ok(new DecisionQueue(decisions));
  }

  /** Returns all decisions in deterministic execution order. */
  getOrderedDecisions(): readonly CompanyDecision[] {
    return Object.freeze(
      [...this.#decisions.values()].sort((left, right) => compareDecisionsForExecution(left, right)),
    );
  }

  /** Returns pending decisions in deterministic execution order. */
  getPendingDecisions(): readonly CompanyDecision[] {
    return Object.freeze(
      this.getOrderedDecisions().filter(
        (decision) => decision.status === CompanyDecisionStatus.PENDING,
      ),
    );
  }

  /** Returns the next pending decision without removing it. */
  peekNextPending(): CompanyDecision | undefined {
    return this.getPendingDecisions()[0];
  }

  /** Returns a decision by id, if present. */
  findById(decisionId: string): CompanyDecision | undefined {
    return this.#decisions.get(decisionId);
  }

  /** Adds or replaces a decision in the queue. */
  upsert(decision: CompanyDecision): Result<void, ValidationError> {
    const priorityResult = Guard.againstNegative(
      decision.priority,
      'Decision priority must not be negative.',
    );

    if (!priorityResult.ok) {
      return Result.fail(priorityResult.error);
    }

    this.#decisions.set(decision.id.value, decision);
    return Result.ok(undefined);
  }

  /** Updates an existing decision in the queue. */
  update(decision: CompanyDecision): Result<void, ValidationError> {
    if (!this.#decisions.has(decision.id.value)) {
      return Result.fail(
        new ValidationError(`Decision "${decision.id.value}" was not found in the queue.`),
      );
    }

    return this.upsert(decision);
  }

  /** Returns all decisions as a frozen snapshot for persistence. */
  snapshot(): readonly CompanyDecision[] {
    return this.getOrderedDecisions();
  }
}
