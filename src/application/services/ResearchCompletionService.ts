/**
 * @module @application/services/ResearchCompletionService
 *
 * Unlocks completed technologies when a research job finishes.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { ResearchJob } from '../../domain/research/ResearchJob.js';
import { CompleteTechnologyUseCase } from '../use-cases/CompleteTechnologyUseCase.js';
import type { CompleteTechnologyUseCaseDependencies } from '../use-cases/CompleteTechnologyUseCase.js';

/** Dependencies required by {@link ResearchCompletionService}. */
export type ResearchCompletionServiceDependencies = CompleteTechnologyUseCaseDependencies;

/**
 * Marks a technology as completed after its research job finishes.
 */
export class ResearchCompletionService {
  readonly #completeTechnologyUseCase: CompleteTechnologyUseCase;

  /**
   * @param dependencies - Application services required to complete technology research.
   */
  constructor(dependencies: ResearchCompletionServiceDependencies) {
    this.#completeTechnologyUseCase = new CompleteTechnologyUseCase(dependencies);
  }

  /**
   * Completes the technology associated with a finished research job.
   */
  completeJob(job: ResearchJob): Result<void, ValidationError> {
    return this.#completeTechnologyUseCase.execute({
      companyId: job.getCompanyId().value,
      technologyId: job.getTechnologyId().value,
    });
  }
}
