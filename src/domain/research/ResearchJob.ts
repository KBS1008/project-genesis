/**
 * @module @domain/research/ResearchJob
 *
 * Research job aggregate representing one timed technology research effort.
 *
 * @see docs/gameplay/research.md
 */

import { AggregateRoot } from '../../common/core/AggregateRoot.js';
import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import { Guard } from '../../common/validation/Guard.js';
import type { CompanyId } from '../company/CompanyId.js';
import type { TechnologyId } from './TechnologyId.js';
import type { ResearchJobId } from './ResearchJobId.js';
import { ResearchJobStatus } from './ResearchJobStatus.js';
import { ResearchCompleted } from './events/ResearchCompleted.js';
import { ResearchStarted } from './events/ResearchStarted.js';

/** Result of ticking a running research job. */
export type ResearchJobTickResult = {
  readonly status: 'running' | 'completed';
  readonly progress: number;
};

/** Parameters required to create a research job. */
export type CreateResearchJobParams = {
  readonly id: ResearchJobId;
  readonly companyId: CompanyId;
  readonly technologyId: TechnologyId;
  readonly duration: number;
  readonly cost: number;
  readonly clock: Clock;
};

/**
 * Aggregate root for one technology research effort on a company.
 */
export class ResearchJob extends AggregateRoot<'ResearchJob'> {
  readonly #companyId: CompanyId;
  readonly #technologyId: TechnologyId;
  readonly #duration: number;
  readonly #cost: number;
  readonly #createdAt: number;
  #status: ResearchJobStatus;
  #startTime: number | undefined;
  #endTime: number | undefined;
  #progress: number;

  private constructor(
    params: {
      id: ResearchJobId;
      companyId: CompanyId;
      technologyId: TechnologyId;
      duration: number;
      cost: number;
      createdAt: number;
      status: ResearchJobStatus;
      progress: number;
      startTime: number | undefined;
      endTime: number | undefined;
    },
    restoring = false,
  ) {
    super(params.id);
    this.#companyId = params.companyId;
    this.#technologyId = params.technologyId;
    this.#duration = params.duration;
    this.#cost = params.cost;
    this.#createdAt = params.createdAt;
    this.#status = params.status;
    this.#progress = params.progress;
    this.#startTime = params.startTime;
    this.#endTime = params.endTime;

    void restoring;
  }

  /**
   * Creates a research job waiting to start.
   */
  static create(params: CreateResearchJobParams): Result<ResearchJob, ValidationError> {
    const durationResult = Guard.againstNegative(
      params.duration,
      'Research duration must not be negative.',
    );

    if (!durationResult.ok) {
      return Result.fail(durationResult.error);
    }

    if (durationResult.value === 0) {
      return Result.fail(new ValidationError('Research duration must be greater than zero.'));
    }

    const costResult = Guard.againstNegative(params.cost, 'Research cost must not be negative.');

    if (!costResult.ok) {
      return Result.fail(costResult.error);
    }

    return Result.ok(
      new ResearchJob(
        {
          id: params.id,
          companyId: params.companyId,
          technologyId: params.technologyId,
          duration: durationResult.value,
          cost: costResult.value,
          createdAt: params.clock.now(),
          status: ResearchJobStatus.WAITING,
          progress: 0,
          startTime: undefined,
          endTime: undefined,
        },
      ),
    );
  }

  /**
   * Rehydrates a research job from a persisted snapshot without raising events.
   */
  static restore(params: {
    readonly id: ResearchJobId;
    readonly companyId: CompanyId;
    readonly technologyId: TechnologyId;
    readonly duration: number;
    readonly cost: number;
    readonly createdAt: number;
    readonly status: ResearchJobStatus;
    readonly progress: number;
    readonly startTime: number | undefined;
    readonly endTime: number | undefined;
  }): Result<ResearchJob, ValidationError> {
    const durationResult = Guard.againstNegative(
      params.duration,
      'Research duration must not be negative.',
    );

    if (!durationResult.ok) {
      return Result.fail(durationResult.error);
    }

    const costResult = Guard.againstNegative(params.cost, 'Research cost must not be negative.');

    if (!costResult.ok) {
      return Result.fail(costResult.error);
    }

    if (params.progress < 0 || params.progress > 100) {
      return Result.fail(new ValidationError('Research progress must be between 0 and 100.'));
    }

    return Result.ok(
      new ResearchJob(
        {
          id: params.id,
          companyId: params.companyId,
          technologyId: params.technologyId,
          duration: durationResult.value,
          cost: costResult.value,
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

  /** The owning company identifier. */
  getCompanyId(): CompanyId {
    return this.#companyId;
  }

  /** The technology being researched. */
  getTechnologyId(): TechnologyId {
    return this.#technologyId;
  }

  /** Total research duration in simulation time units. */
  getDuration(): number {
    return this.#duration;
  }

  /** Upfront research cost paid when the job started. */
  getCost(): number {
    return this.#cost;
  }

  /** Current job status. */
  getStatus(): ResearchJobStatus {
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
   * Starts a waiting research job.
   */
  start(clock: Clock): Result<void, ValidationError> {
    if (this.#status !== ResearchJobStatus.WAITING) {
      return Result.fail(new ValidationError('Only waiting research jobs can be started.'));
    }

    const startTime = clock.now();
    this.#status = ResearchJobStatus.RUNNING;
    this.#startTime = startTime;

    this.addDomainEvent(
      new ResearchStarted(
        startTime,
        this.getId().value,
        this.#companyId.value,
        this.#technologyId.value,
      ),
    );

    return Result.ok(undefined);
  }

  /**
   * Advances progress for a running job based on elapsed simulation time.
   */
  tick(clock: Clock): Result<ResearchJobTickResult, ValidationError> {
    if (this.#status !== ResearchJobStatus.RUNNING) {
      return Result.fail(new ValidationError('Only running research jobs can be ticked.'));
    }

    if (this.#startTime === undefined) {
      return Result.fail(new ValidationError('Running research job is missing a start time.'));
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
    this.#status = ResearchJobStatus.FINISHED;
    this.#endTime = clock.now();
    this.#progress = 100;

    this.addDomainEvent(
      new ResearchCompleted(
        clock.now(),
        this.getId().value,
        this.#companyId.value,
        this.#technologyId.value,
      ),
    );

    return Result.ok(undefined);
  }
}

/** Creates a validated research job identifier from a raw string. */
export function createResearchJobId(rawValue: string): Result<ResearchJobId, ValidationError> {
  const result = Identifier.create<ResearchJobId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
