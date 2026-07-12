/**
 * @module @domain/production/ProductionJob
 *
 * Production job aggregate representing one running recipe execution.
 *
 * @see docs/schemas/Production.Schema.md
 * @see docs/decisions/DD-011-recipe-based-production.md
 */

import { AggregateRoot } from '../../common/core/AggregateRoot.js';
import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import { Guard } from '../../common/validation/Guard.js';
import type { BuildingId } from '../building/BuildingId.js';
import type { CompanyId } from '../company/CompanyId.js';
import type { RecipeId } from './RecipeId.js';
import type { ProductionJobId } from './ProductionJobId.js';
import { ProductionJobStatus } from './ProductionJobStatus.js';
import { ProductionCompleted } from './events/ProductionCompleted.js';
import { ProductionStarted } from './events/ProductionStarted.js';

/** Result of ticking a running production job. */
export type ProductionJobTickResult = {
  readonly status: 'running' | 'completed';
  readonly progress: number;
};

/** Parameters required to create a production job. */
export type CreateProductionJobParams = {
  readonly id: ProductionJobId;
  readonly buildingId: BuildingId;
  readonly companyId: CompanyId;
  readonly recipeId: RecipeId;
  readonly duration: number;
  readonly clock: Clock;
};

/**
 * Aggregate root for one recipe execution on a building.
 */
export class ProductionJob extends AggregateRoot<'ProductionJob'> {
  readonly #buildingId: BuildingId;
  readonly #companyId: CompanyId;
  readonly #recipeId: RecipeId;
  readonly #duration: number;
  readonly #createdAt: number;
  #status: ProductionJobStatus;
  #startTime: number | undefined;
  #endTime: number | undefined;
  #progress: number;

  private constructor(
    params: {
      id: ProductionJobId;
      buildingId: BuildingId;
      companyId: CompanyId;
      recipeId: RecipeId;
      duration: number;
      createdAt: number;
      status: ProductionJobStatus;
      progress: number;
      startTime: number | undefined;
      endTime: number | undefined;
    },
    restoring = false,
  ) {
    super(params.id);
    this.#buildingId = params.buildingId;
    this.#companyId = params.companyId;
    this.#recipeId = params.recipeId;
    this.#duration = params.duration;
    this.#createdAt = params.createdAt;
    this.#status = params.status;
    this.#progress = params.progress;
    this.#startTime = params.startTime;
    this.#endTime = params.endTime;

    void restoring;
  }

  /**
   * Creates a production job waiting to start.
   */
  static create(params: CreateProductionJobParams): Result<ProductionJob, ValidationError> {
    const durationResult = Guard.againstNegative(
      params.duration,
      'Production duration must not be negative.',
    );

    if (!durationResult.ok) {
      return Result.fail(durationResult.error);
    }

    if (durationResult.value === 0) {
      return Result.fail(new ValidationError('Production duration must be greater than zero.'));
    }

    return Result.ok(
      new ProductionJob(
        {
          id: params.id,
          buildingId: params.buildingId,
          companyId: params.companyId,
          recipeId: params.recipeId,
          duration: durationResult.value,
          createdAt: params.clock.now(),
          status: ProductionJobStatus.WAITING,
          progress: 0,
          startTime: undefined,
          endTime: undefined,
        },
      ),
    );
  }

  /**
   * Rehydrates a production job from a persisted snapshot without raising events.
   */
  static restore(params: {
    readonly id: ProductionJobId;
    readonly buildingId: BuildingId;
    readonly companyId: CompanyId;
    readonly recipeId: RecipeId;
    readonly duration: number;
    readonly createdAt: number;
    readonly status: ProductionJobStatus;
    readonly progress: number;
    readonly startTime: number | undefined;
    readonly endTime: number | undefined;
  }): Result<ProductionJob, ValidationError> {
    const durationResult = Guard.againstNegative(
      params.duration,
      'Production duration must not be negative.',
    );

    if (!durationResult.ok) {
      return Result.fail(durationResult.error);
    }

    if (params.progress < 0 || params.progress > 100) {
      return Result.fail(new ValidationError('Production progress must be between 0 and 100.'));
    }

    return Result.ok(
      new ProductionJob(
        {
          id: params.id,
          buildingId: params.buildingId,
          companyId: params.companyId,
          recipeId: params.recipeId,
          duration: durationResult.value,
          createdAt: params.createdAt,
          status: params.status,
          progress: params.progress,
          startTime: params.startTime,
          endTime: params.endTime,
        },
        true,
      ),
    );
  }

  /** The building executing the job. */
  getBuildingId(): BuildingId {
    return this.#buildingId;
  }

  /** The owning company identifier. */
  getCompanyId(): CompanyId {
    return this.#companyId;
  }

  /** The recipe being executed. */
  getRecipeId(): RecipeId {
    return this.#recipeId;
  }

  /** Total recipe duration in simulation time units. */
  getDuration(): number {
    return this.#duration;
  }

  /** Current job status. */
  getStatus(): ProductionJobStatus {
    return this.#status;
  }

  /** Display progress from 0 to 100. */
  getProgress(): number {
    return this.#progress;
  }

  /** Simulation time when the job was created. */
  getCreatedAt(): number {
    return this.#createdAt;
  }

  /** Simulation time when the job started, if running or finished. */
  getStartTime(): number | undefined {
    return this.#startTime;
  }

  /** Simulation time when the job finished, if completed. */
  getEndTime(): number | undefined {
    return this.#endTime;
  }

  /**
   * Starts a waiting production job.
   */
  start(clock: Clock): Result<void, ValidationError> {
    if (this.#status !== ProductionJobStatus.WAITING) {
      return Result.fail(new ValidationError('Only waiting production jobs can be started.'));
    }

    const startTime = clock.now();
    this.#status = ProductionJobStatus.RUNNING;
    this.#startTime = startTime;

    this.addDomainEvent(
      new ProductionStarted(
        startTime,
        this.getId().value,
        this.#buildingId.value,
        this.#companyId.value,
        this.#recipeId.value,
      ),
    );

    return Result.ok(undefined);
  }

  /**
   * Advances progress for a running job based on elapsed simulation time.
   */
  tick(clock: Clock): Result<ProductionJobTickResult, ValidationError> {
    if (this.#status !== ProductionJobStatus.RUNNING) {
      return Result.fail(new ValidationError('Only running production jobs can be ticked.'));
    }

    if (this.#startTime === undefined) {
      return Result.fail(new ValidationError('Running production job is missing a start time.'));
    }

    const elapsed = clock.now() - this.#startTime;
    this.#progress = Math.min(100, (elapsed / this.#duration) * 100);

    if (this.#progress >= 100) {
      const completeResult = this.#complete(clock);

      if (!completeResult.ok) {
        return Result.fail(completeResult.error);
      }

      return Result.ok({ status: 'completed', progress: 100 });
    }

    return Result.ok({ status: 'running', progress: this.#progress });
  }

  #complete(clock: Clock): Result<void, ValidationError> {
    this.#status = ProductionJobStatus.FINISHED;
    this.#endTime = clock.now();
    this.#progress = 100;

    this.addDomainEvent(
      new ProductionCompleted(
        clock.now(),
        this.getId().value,
        this.#buildingId.value,
        this.#companyId.value,
        this.#recipeId.value,
      ),
    );

    return Result.ok(undefined);
  }
}

/** Creates a validated production job identifier from a raw string. */
export function createProductionJobId(
  rawValue: string,
): Result<ProductionJobId, ValidationError> {
  const result = Identifier.create<ProductionJobId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
