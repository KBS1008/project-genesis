/**
 * @module @application/services/CompanyBrainBootstrapService
 *
 * Creates company brain aggregates for autonomous NPC companies.
 */

import type { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import { CompanyBrain } from '../../domain/brain/CompanyBrain.js';
import { createCompanyBrainId } from '../../domain/brain/CompanyBrainId.js';
import type { CompanyBrainRepository } from '../../domain/brain/CompanyBrainRepository.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';

/** Dependencies for {@link CompanyBrainBootstrapService}. */
export type CompanyBrainBootstrapServiceDependencies = {
  readonly companyBrainRepository: CompanyBrainRepository;
  readonly clock: Clock;
};

/**
 * Bootstraps planning state for autonomous companies.
 */
export class CompanyBrainBootstrapService {
  readonly #companyBrainRepository: CompanyBrainBootstrapServiceDependencies['companyBrainRepository'];
  readonly #clock: CompanyBrainBootstrapServiceDependencies['clock'];

  constructor(dependencies: CompanyBrainBootstrapServiceDependencies) {
    this.#companyBrainRepository = dependencies.companyBrainRepository;
    this.#clock = dependencies.clock;
  }

  /** Creates and persists a company brain when one does not already exist. */
  bootstrap(params: {
    readonly companyId: CompanyId;
    readonly strategyDefinitionId?: string;
  }): Result<void, ValidationError> {
    if (this.#companyBrainRepository.findByCompanyId(params.companyId) !== undefined) {
      return Result.ok(undefined);
    }

    const brainIdResult = createCompanyBrainId(`brain_${params.companyId.value}`);

    if (!brainIdResult.ok) {
      return Result.fail(brainIdResult.error);
    }

    const brainResult = CompanyBrain.create({
      id: brainIdResult.value,
      companyId: params.companyId,
      clock: this.#clock,
      ...(params.strategyDefinitionId !== undefined
        ? { initialStrategyDefinitionId: params.strategyDefinitionId }
        : {}),
    });

    if (!brainResult.ok) {
      return brainResult;
    }

    const brain = brainResult.value;
    brain.pullDomainEvents();
    this.#companyBrainRepository.save(brain);

    return Result.ok(undefined);
  }
}
