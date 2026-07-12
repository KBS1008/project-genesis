/**
 * @module @application/use-cases/CompleteTechnologyUseCase
 *
 * Marks a technology as permanently completed for a company.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { createTechnologyId } from '../../domain/research/TechnologyId.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { CompleteTechnologyCommand } from '../commands/CompleteTechnologyCommand.js';

/** Dependencies required by {@link CompleteTechnologyUseCase}. */
export type CompleteTechnologyUseCaseDependencies = Pick<
  ApplicationContext,
  'clock' | 'companyRepository' | 'companyResearchRepository' | 'simulationEngine' | 'gameContent'
>;

/**
 * Completes a technology for a company research module.
 */
export class CompleteTechnologyUseCase {
  readonly #clock: CompleteTechnologyUseCaseDependencies['clock'];
  readonly #companyRepository: CompleteTechnologyUseCaseDependencies['companyRepository'];
  readonly #companyResearchRepository: CompleteTechnologyUseCaseDependencies['companyResearchRepository'];
  readonly #simulationEngine: CompleteTechnologyUseCaseDependencies['simulationEngine'];
  readonly #gameContent: CompleteTechnologyUseCaseDependencies['gameContent'];

  /**
   * @param dependencies - Application services required to complete technology research.
   */
  constructor(dependencies: CompleteTechnologyUseCaseDependencies) {
    this.#clock = dependencies.clock;
    this.#companyRepository = dependencies.companyRepository;
    this.#companyResearchRepository = dependencies.companyResearchRepository;
    this.#simulationEngine = dependencies.simulationEngine;
    this.#gameContent = dependencies.gameContent;
  }

  /**
   * Executes the complete-technology workflow.
   */
  execute(command: CompleteTechnologyCommand): Result<void, ValidationError> {
    const companyIdResult = createCompanyId(command.companyId);

    if (!companyIdResult.ok) {
      return Result.fail(companyIdResult.error);
    }

    const technologyIdResult = createTechnologyId(command.technologyId);

    if (!technologyIdResult.ok) {
      return Result.fail(technologyIdResult.error);
    }

    const companyId = companyIdResult.value;
    const technologyId = technologyIdResult.value;

    if (this.#companyRepository.findById(companyId) === undefined) {
      return Result.fail(
        new ValidationError(`Company id "${companyId.value}" was not found.`),
      );
    }

    const technology = this.#gameContent.technologies.get(technologyId.value);

    if (technology === undefined) {
      return Result.fail(
        new ValidationError(`Technology id "${technologyId.value}" was not found.`),
      );
    }

    if (!technology.enabled) {
      return Result.fail(
        new ValidationError(`Technology id "${technologyId.value}" is disabled.`),
      );
    }

    const companyResearch = this.#companyResearchRepository.findByCompanyId(companyId);

    if (companyResearch === undefined) {
      return Result.fail(
        new ValidationError(`Research module for company "${companyId.value}" was not found.`),
      );
    }

    const completeResult = companyResearch.completeTechnology(technologyId, this.#clock);

    if (!completeResult.ok) {
      return Result.fail(completeResult.error);
    }

    this.#companyResearchRepository.save(companyResearch);
    this.#simulationEngine.enqueueEvents(companyResearch.pullDomainEvents());

    return Result.ok(undefined);
  }
}
