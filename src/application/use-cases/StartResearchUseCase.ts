/**
 * @module @application/use-cases/StartResearchUseCase
 *
 * Coordinates research job creation, cost debit, start and persistence.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { FinanceTransactionType } from '../../domain/finance/FinanceTransactionType.js';
import type { ResearchJobId } from '../../domain/research/ResearchJobId.js';
import { ResearchJob, createResearchJobId } from '../../domain/research/ResearchJob.js';
import { ResearchJobStatus } from '../../domain/research/ResearchJobStatus.js';
import { createTechnologyId } from '../../domain/research/TechnologyId.js';
import { RequiredResearchSpecification } from '../../domain/specifications/research/RequiredResearchSpecification.js';
import { RequiredMilestonesSpecification } from '../../domain/specifications/research/RequiredMilestonesSpecification.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { StartResearchCommand } from '../commands/StartResearchCommand.js';

/** Dependencies required by {@link StartResearchUseCase}. */
export type StartResearchUseCaseDependencies = Pick<
  ApplicationContext,
  | 'clock'
  | 'companyRepository'
  | 'financeRepository'
  | 'companyResearchRepository'
  | 'companyMilestonesRepository'
  | 'researchJobRepository'
  | 'simulationEngine'
  | 'gameContent'
>;

/**
 * Starts a timed technology research job for a company.
 */
export class StartResearchUseCase {
  readonly #clock: StartResearchUseCaseDependencies['clock'];
  readonly #companyRepository: StartResearchUseCaseDependencies['companyRepository'];
  readonly #financeRepository: StartResearchUseCaseDependencies['financeRepository'];
  readonly #companyResearchRepository: StartResearchUseCaseDependencies['companyResearchRepository'];
  readonly #companyMilestonesRepository: StartResearchUseCaseDependencies['companyMilestonesRepository'];
  readonly #researchJobRepository: StartResearchUseCaseDependencies['researchJobRepository'];
  readonly #simulationEngine: StartResearchUseCaseDependencies['simulationEngine'];
  readonly #gameContent: StartResearchUseCaseDependencies['gameContent'];
  readonly #requiredResearchSpecification = new RequiredResearchSpecification();
  readonly #requiredMilestonesSpecification = new RequiredMilestonesSpecification();

  /**
   * @param dependencies - Application services required to start research.
   */
  constructor(dependencies: StartResearchUseCaseDependencies) {
    this.#clock = dependencies.clock;
    this.#companyRepository = dependencies.companyRepository;
    this.#financeRepository = dependencies.financeRepository;
    this.#companyResearchRepository = dependencies.companyResearchRepository;
    this.#companyMilestonesRepository = dependencies.companyMilestonesRepository;
    this.#researchJobRepository = dependencies.researchJobRepository;
    this.#simulationEngine = dependencies.simulationEngine;
    this.#gameContent = dependencies.gameContent;
  }

  /**
   * Executes the start-research workflow.
   */
  execute(command: StartResearchCommand): Result<ResearchJobId, ValidationError> {
    const jobIdResult = createResearchJobId(command.jobId);

    if (!jobIdResult.ok) {
      return Result.fail(jobIdResult.error);
    }

    const companyIdResult = createCompanyId(command.companyId);

    if (!companyIdResult.ok) {
      return Result.fail(companyIdResult.error);
    }

    const technologyIdResult = createTechnologyId(command.technologyId);

    if (!technologyIdResult.ok) {
      return Result.fail(technologyIdResult.error);
    }

    const jobId = jobIdResult.value;
    const companyId = companyIdResult.value;
    const technologyId = technologyIdResult.value;

    if (this.#researchJobRepository.findById(jobId) !== undefined) {
      return Result.fail(new ValidationError(`Research job id "${jobId.value}" already exists.`));
    }

    if (this.#companyRepository.findById(companyId) === undefined) {
      return Result.fail(new ValidationError(`Company id "${companyId.value}" was not found.`));
    }

    const technology = this.#gameContent.technologies.get(technologyId.value);

    if (technology === undefined) {
      return Result.fail(
        new ValidationError(`Technology id "${technologyId.value}" was not found.`),
      );
    }

    if (!technology.enabled) {
      return Result.fail(new ValidationError(`Technology id "${technologyId.value}" is disabled.`));
    }

    if (technology.researchDuration <= 0) {
      return Result.fail(
        new ValidationError(
          `Technology id "${technologyId.value}" has no positive research duration.`,
        ),
      );
    }

    const companyResearch = this.#companyResearchRepository.findByCompanyId(companyId);

    if (companyResearch === undefined) {
      return Result.fail(
        new ValidationError(`Research module for company "${companyId.value}" was not found.`),
      );
    }

    if (companyResearch.hasCompletedTechnology(technologyId.value)) {
      return Result.fail(
        new ValidationError(
          `Technology id "${technologyId.value}" is already completed for company "${companyId.value}".`,
        ),
      );
    }

    const requiredResearchResult = this.#requiredResearchSpecification.isSatisfiedBy(
      {
        subjectId: technologyId.value,
        requiredResearch: technology.requiredResearch,
      },
      {
        completedResearch: new Set(companyResearch.getCompletedTechnologies()),
      },
    );

    if (!requiredResearchResult.ok) {
      return Result.fail(requiredResearchResult.error);
    }

    const companyMilestones = this.#companyMilestonesRepository.findByCompanyId(companyId);

    if (companyMilestones === undefined) {
      return Result.fail(
        new ValidationError(`Milestones module for company "${companyId.value}" was not found.`),
      );
    }

    const requiredMilestonesResult = this.#requiredMilestonesSpecification.isSatisfiedBy(
      {
        subjectId: technologyId.value,
        requiredMilestones: technology.requiredMilestones,
      },
      {
        completedMilestones: new Set(companyMilestones.getCompletedMilestones()),
      },
    );

    if (!requiredMilestonesResult.ok) {
      return Result.fail(requiredMilestonesResult.error);
    }

    for (const existingJob of this.#researchJobRepository.findByCompanyId(companyId)) {
      if (
        existingJob.getTechnologyId().value === technologyId.value &&
        (existingJob.getStatus() === ResearchJobStatus.WAITING ||
          existingJob.getStatus() === ResearchJobStatus.RUNNING)
      ) {
        return Result.fail(
          new ValidationError(
            `Technology id "${technologyId.value}" is already being researched by company "${companyId.value}".`,
          ),
        );
      }
    }

    const finance = this.#financeRepository.findByCompanyId(companyId);

    if (finance === undefined) {
      return Result.fail(
        new ValidationError(`Finance account for company "${companyId.value}" was not found.`),
      );
    }

    const jobResult = ResearchJob.create({
      id: jobId,
      companyId,
      technologyId,
      duration: technology.researchDuration,
      cost: technology.researchCost,
      clock: this.#clock,
    });

    if (!jobResult.ok) {
      return Result.fail(jobResult.error);
    }

    const job = jobResult.value;
    const startResult = job.start(this.#clock);

    if (!startResult.ok) {
      return Result.fail(startResult.error);
    }

    const debitResult = finance.debit(
      technology.researchCost,
      FinanceTransactionType.RESEARCH_COST,
      this.#clock,
    );

    if (!debitResult.ok) {
      return Result.fail(debitResult.error);
    }

    this.#researchJobRepository.save(job);
    this.#financeRepository.save(finance);
    this.#simulationEngine.enqueueEvents([
      ...job.pullDomainEvents(),
      ...finance.pullDomainEvents(),
    ]);

    return Result.ok(jobId);
  }
}
