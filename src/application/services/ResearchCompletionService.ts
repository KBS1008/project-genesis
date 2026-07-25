/**
 * @module @application/services/ResearchCompletionService
 *
 * Unlocks completed technologies when a research job finishes.
 */

import type { ValidationError } from '../../common/errors/ValidationError.js';
import type { Result } from '../../common/result/Result.js';
import type { ResearchJob } from '../../domain/research/ResearchJob.js';
import {
  CompleteTechnologyUseCase,
  type CompleteTechnologyUseCaseDependencies,
} from '../use-cases/CompleteTechnologyUseCase.js';
import type { SupplyContractUnlockService } from './SupplyContractUnlockService.js';

/** Dependencies required by {@link ResearchCompletionService}. */
export type ResearchCompletionServiceDependencies = CompleteTechnologyUseCaseDependencies & {
  readonly supplyContractUnlockService: SupplyContractUnlockService;
};

/**
 * Marks a technology as completed after its research job finishes.
 */
export class ResearchCompletionService {
  readonly #completeTechnologyUseCase: CompleteTechnologyUseCase;
  readonly #supplyContractUnlockService: SupplyContractUnlockService;

  /**
   * @param dependencies - Application services required to complete technology research.
   */
  constructor(dependencies: ResearchCompletionServiceDependencies) {
    this.#completeTechnologyUseCase = new CompleteTechnologyUseCase(dependencies);
    this.#supplyContractUnlockService = dependencies.supplyContractUnlockService;
  }

  /**
   * Completes the technology associated with a finished research job.
   */
  completeJob(job: ResearchJob): Result<void, ValidationError> {
    const result = this.#completeTechnologyUseCase.execute({
      companyId: job.getCompanyId().value,
      technologyId: job.getTechnologyId().value,
    });

    if (result.ok) {
      this.#supplyContractUnlockService.evaluateForCompany(job.getCompanyId());
    }

    return result;
  }
}
