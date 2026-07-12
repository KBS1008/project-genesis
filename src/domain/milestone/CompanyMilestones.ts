/**
 * @module @domain/milestone/CompanyMilestones
 *
 * Aggregate tracking completed milestones for one company.
 */

import { AggregateRoot } from '../../common/core/AggregateRoot.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import type { CompanyId } from '../company/CompanyId.js';
import type { CompanyMilestonesId } from './CompanyMilestonesId.js';
import { createMilestoneId, type MilestoneId } from './MilestoneId.js';
import { CompanyMilestoneReached } from './events/CompanyMilestoneReached.js';

/** Parameters required to create company milestones state. */
export type CreateCompanyMilestonesParams = {
  readonly id: CompanyMilestonesId;
  readonly companyId: CompanyId;
  readonly clock: Clock;
};

/**
 * Company milestones aggregate root.
 */
export class CompanyMilestones extends AggregateRoot<'CompanyMilestones'> {
  readonly #companyId: CompanyId;
  readonly #createdAt: number;
  readonly #completedMilestones = new Set<string>();

  private constructor(
    params: {
      id: CompanyMilestonesId;
      companyId: CompanyId;
      createdAt: number;
      completedMilestones: readonly string[];
    },
    restoring = false,
  ) {
    super(params.id);
    this.#companyId = params.companyId;
    this.#createdAt = params.createdAt;

    for (const milestoneId of params.completedMilestones) {
      this.#completedMilestones.add(milestoneId);
    }

    void restoring;
  }

  /**
   * Creates empty company milestones state.
   */
  static create(params: CreateCompanyMilestonesParams): Result<CompanyMilestones, ValidationError> {
    return Result.ok(
      new CompanyMilestones({
        id: params.id,
        companyId: params.companyId,
        createdAt: params.clock.now(),
        completedMilestones: [],
      }),
    );
  }

  /**
   * Rehydrates company milestones from a persisted snapshot without raising events.
   */
  static restore(params: {
    readonly id: CompanyMilestonesId;
    readonly companyId: CompanyId;
    readonly createdAt: number;
    readonly completedMilestones: readonly string[];
  }): Result<CompanyMilestones, ValidationError> {
    for (const milestoneId of params.completedMilestones) {
      const milestoneIdResult = createMilestoneId(milestoneId);

      if (!milestoneIdResult.ok) {
        return Result.fail(milestoneIdResult.error);
      }
    }

    return Result.ok(
      new CompanyMilestones(
        {
          id: params.id,
          companyId: params.companyId,
          createdAt: params.createdAt,
          completedMilestones: [...params.completedMilestones],
        },
        true,
      ),
    );
  }

  /** The owning company identifier. */
  getCompanyId(): CompanyId {
    return this.#companyId;
  }

  /** Simulation time when the milestones module was created. */
  getCreatedAt(): number {
    return this.#createdAt;
  }

  /** Returns completed milestone ids in deterministic order. */
  getCompletedMilestones(): readonly string[] {
    return Object.freeze(
      [...this.#completedMilestones].sort((left, right) => left.localeCompare(right)),
    );
  }

  /** Returns whether the company has completed a milestone. */
  hasCompletedMilestone(milestoneId: string): boolean {
    return this.#completedMilestones.has(milestoneId);
  }

  /**
   * Marks a milestone as permanently completed for the company.
   */
  completeMilestone(milestoneId: MilestoneId, clock: Clock): Result<void, ValidationError> {
    if (this.#completedMilestones.has(milestoneId.value)) {
      return Result.ok(undefined);
    }

    this.#completedMilestones.add(milestoneId.value);
    this.addDomainEvent(
      new CompanyMilestoneReached(
        clock.now(),
        this.getId().value,
        this.#companyId.value,
        milestoneId.value,
      ),
    );

    return Result.ok(undefined);
  }
}
