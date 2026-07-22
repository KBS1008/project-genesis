/**
 * @module @application/services/CompanyDecisionExecutionService
 *
 * Executes queued company brain decisions through existing application use cases.
 *
 * Planning produces decisions; this service drains the queue without bypassing
 * domain validation or repository ownership rules.
 *
 * @see docs/architecture/decisions/DD-0XX_COMPANY_BRAIN_AND_DECISION_QUEUE.md
 */

import type { DomainEvent } from '../../common/events/DomainEvent.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { CompanyDecision } from '../../domain/brain/CompanyDecision.js';
import { CompanyDecisionStatus } from '../../domain/brain/CompanyDecisionStatus.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import { BuyResourceUseCase } from '../use-cases/BuyResourceUseCase.js';
import { PlaceBuildingUseCase } from '../use-cases/PlaceBuildingUseCase.js';
import { SellResourceUseCase } from '../use-cases/SellResourceUseCase.js';
import { StartProductionUseCase } from '../use-cases/StartProductionUseCase.js';
import { StartResearchUseCase } from '../use-cases/StartResearchUseCase.js';

/** Maximum queued decisions executed for one company per call. */
export const DECISION_EXECUTION_MAX_PER_RUN = 50;

/** Dependencies for {@link CompanyDecisionExecutionService}. */
export type CompanyDecisionExecutionServiceDependencies = Pick<
  ApplicationContext,
  | 'companyBrainRepository'
  | 'companyRepository'
  | 'marketTradeService'
  | 'clock'
  | 'buildingRepository'
  | 'financeRepository'
  | 'companyResearchRepository'
  | 'companyMilestonesRepository'
  | 'regionRepository'
  | 'simulationEngine'
  | 'gameContent'
  | 'productionJobRepository'
  | 'researchJobRepository'
  | 'productionInventoryService'
  | 'energyBalanceService'
  | 'inventoryRepository'
  | 'transportLogisticsService'
> & {
  readonly enqueueEvents?: (events: readonly DomainEvent[]) => void;
};

/** Summary of one decision execution pass. */
export type CompanyDecisionExecutionResult = {
  readonly processed: number;
  readonly completed: number;
  readonly failed: number;
};

/**
 * Executes pending company decisions through validated application use cases.
 */
export class CompanyDecisionExecutionService {
  readonly #companyBrainRepository: CompanyDecisionExecutionServiceDependencies['companyBrainRepository'];
  readonly #buyResourceUseCase: BuyResourceUseCase;
  readonly #sellResourceUseCase: SellResourceUseCase;
  readonly #placeBuildingUseCase: PlaceBuildingUseCase;
  readonly #startProductionUseCase: StartProductionUseCase;
  readonly #startResearchUseCase: StartResearchUseCase;
  readonly #enqueueEvents: (events: readonly DomainEvent[]) => void;

  constructor(dependencies: CompanyDecisionExecutionServiceDependencies) {
    this.#companyBrainRepository = dependencies.companyBrainRepository;
    this.#buyResourceUseCase = new BuyResourceUseCase({
      companyRepository: dependencies.companyRepository,
      marketTradeService: dependencies.marketTradeService,
    });
    this.#sellResourceUseCase = new SellResourceUseCase({
      companyRepository: dependencies.companyRepository,
      marketTradeService: dependencies.marketTradeService,
    });
    this.#placeBuildingUseCase = new PlaceBuildingUseCase(dependencies);
    this.#startProductionUseCase = new StartProductionUseCase(dependencies);
    this.#startResearchUseCase = new StartResearchUseCase(dependencies);
    this.#enqueueEvents = dependencies.enqueueEvents ?? (() => undefined);
  }

  /**
   * Executes pending decisions for one company in deterministic queue order.
   *
   * Only the company brain repository is mutated by this service. Trade use cases
   * update inventory and finance through the same path as player actions.
   */
  executePendingDecisions(
    companyId: CompanyId,
    options?: {
      readonly maxDecisions?: number;
    },
  ): Result<CompanyDecisionExecutionResult, ValidationError> {
    const brain = this.#companyBrainRepository.findByCompanyId(companyId);

    if (brain === undefined) {
      return Result.fail(
        new ValidationError(`Company brain for company "${companyId.value}" was not found.`),
      );
    }

    const maxDecisions = options?.maxDecisions ?? DECISION_EXECUTION_MAX_PER_RUN;
    const pendingDecisions = brain.getPendingDecisions().slice(0, maxDecisions);

    let processed = 0;
    let completed = 0;
    let failed = 0;

    for (const decision of pendingDecisions) {
      const executionResult = this.#executeDecision(companyId, decision);

      processed += 1;

      const status = executionResult.ok
        ? CompanyDecisionStatus.COMPLETED
        : CompanyDecisionStatus.FAILED;
      const updateResult = brain.updateDecisionStatus(decision.id.value, status);

      if (!updateResult.ok) {
        return updateResult;
      }

      if (executionResult.ok) {
        completed += 1;
      } else {
        failed += 1;
      }
    }

    if (processed > 0) {
      this.#companyBrainRepository.save(brain);
      this.#enqueueEvents(brain.pullDomainEvents());
    }

    return Result.ok(
      Object.freeze({
        processed,
        completed,
        failed,
      }),
    );
  }

  /**
   * Executes pending decisions for every company brain in deterministic company order.
   */
  executeAllPendingDecisions(options?: {
    readonly maxDecisionsPerCompany?: number;
  }): Result<readonly CompanyDecisionExecutionResult[], ValidationError> {
    const results: CompanyDecisionExecutionResult[] = [];

    for (const brain of this.#companyBrainRepository.findAll()) {
      const executionResult =
        options?.maxDecisionsPerCompany === undefined
          ? this.executePendingDecisions(brain.getCompanyId())
          : this.executePendingDecisions(brain.getCompanyId(), {
              maxDecisions: options.maxDecisionsPerCompany,
            });

      if (!executionResult.ok) {
        return executionResult;
      }

      results.push(executionResult.value);
    }

    return Result.ok(Object.freeze(results));
  }

  #executeDecision(
    companyId: CompanyId,
    decision: CompanyDecision,
  ): Result<unknown, ValidationError> {
    switch (decision.payload.type) {
      case 'PURCHASE_RESOURCE':
        return this.#buyResourceUseCase.execute({
          companyId: companyId.value,
          resourceId: decision.payload.data.resourceId,
          amount: decision.payload.data.quantity,
          regionId: decision.payload.data.regionId,
        });
      case 'SELL_RESOURCE':
        return this.#sellResourceUseCase.execute({
          companyId: companyId.value,
          resourceId: decision.payload.data.resourceId,
          amount: decision.payload.data.quantity,
          regionId: decision.payload.data.regionId,
        });
      case 'PLACE_BUILDING':
        return this.#placeBuildingUseCase.execute({
          buildingId: decision.payload.data.buildingId,
          buildingTypeId: decision.payload.data.buildingTypeId,
          companyId: companyId.value,
          name: decision.payload.data.name,
          x: decision.payload.data.mapX,
          y: decision.payload.data.mapY,
          regionId: decision.payload.data.regionId,
        });
      case 'START_PRODUCTION':
        return this.#startProductionUseCase.execute({
          jobId: decision.payload.data.jobId,
          buildingId: decision.payload.data.buildingId,
          recipeId: decision.payload.data.recipeId,
        });
      case 'START_RESEARCH':
        return this.#startResearchUseCase.execute({
          jobId: decision.payload.data.jobId,
          companyId: companyId.value,
          technologyId: decision.payload.data.technologyId,
        });
      default:
        return Result.fail(
          new ValidationError(
            `Decision type "${decision.payload.type}" is not executable in M8 phase 7.`,
          ),
        );
    }
  }
}
