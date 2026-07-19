/**
 * @module @domain/research/CompanyResearch
 *
 * Aggregate tracking completed technologies for one company.
 */

import { AggregateRoot } from '../../common/core/AggregateRoot.js';
import type { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import type { CompanyId } from '../company/CompanyId.js';
import type { CompanyResearchId } from './CompanyResearchId.js';
import { createTechnologyId, type TechnologyId } from './TechnologyId.js';
import { TechnologyCompleted } from './events/TechnologyCompleted.js';

/** Parameters required to create company research state. */
export type CreateCompanyResearchParams = {
  readonly id: CompanyResearchId;
  readonly companyId: CompanyId;
  readonly clock: Clock;
};

/**
 * Company research aggregate root.
 */
export class CompanyResearch extends AggregateRoot<'CompanyResearch'> {
  readonly #companyId: CompanyId;
  readonly #createdAt: number;
  readonly #completedTechnologies = new Set<string>();

  private constructor(
    params: {
      id: CompanyResearchId;
      companyId: CompanyId;
      createdAt: number;
      completedTechnologies: readonly string[];
    },
    restoring = false,
  ) {
    super(params.id);
    this.#companyId = params.companyId;
    this.#createdAt = params.createdAt;

    for (const technologyId of params.completedTechnologies) {
      this.#completedTechnologies.add(technologyId);
    }

    void restoring;
  }

  /**
   * Creates empty company research state.
   */
  static create(params: CreateCompanyResearchParams): Result<CompanyResearch, ValidationError> {
    return Result.ok(
      new CompanyResearch({
        id: params.id,
        companyId: params.companyId,
        createdAt: params.clock.now(),
        completedTechnologies: [],
      }),
    );
  }

  /**
   * Rehydrates company research from a persisted snapshot without raising events.
   */
  static restore(params: {
    readonly id: CompanyResearchId;
    readonly companyId: CompanyId;
    readonly createdAt: number;
    readonly completedTechnologies: readonly string[];
  }): Result<CompanyResearch, ValidationError> {
    for (const technologyId of params.completedTechnologies) {
      const technologyIdResult = createTechnologyId(technologyId);

      if (!technologyIdResult.ok) {
        return Result.fail(technologyIdResult.error);
      }
    }

    return Result.ok(
      new CompanyResearch(
        {
          id: params.id,
          companyId: params.companyId,
          createdAt: params.createdAt,
          completedTechnologies: [...params.completedTechnologies],
        },
        true,
      ),
    );
  }

  /** The owning company identifier. */
  getCompanyId(): CompanyId {
    return this.#companyId;
  }

  /** Simulation time when the research module was created. */
  getCreatedAt(): number {
    return this.#createdAt;
  }

  /** Returns completed technology ids in deterministic order. */
  getCompletedTechnologies(): readonly string[] {
    return Object.freeze(
      [...this.#completedTechnologies].sort((left, right) => left.localeCompare(right)),
    );
  }

  /** Returns whether the company has completed a technology. */
  hasCompletedTechnology(technologyId: string): boolean {
    return this.#completedTechnologies.has(technologyId);
  }

  /**
   * Marks a technology as permanently completed for the company.
   */
  completeTechnology(technologyId: TechnologyId, clock: Clock): Result<void, ValidationError> {
    if (this.#completedTechnologies.has(technologyId.value)) {
      return Result.ok(undefined);
    }

    this.#completedTechnologies.add(technologyId.value);
    this.addDomainEvent(
      new TechnologyCompleted(
        clock.now(),
        this.getId().value,
        this.#companyId.value,
        technologyId.value,
      ),
    );

    return Result.ok(undefined);
  }
}
