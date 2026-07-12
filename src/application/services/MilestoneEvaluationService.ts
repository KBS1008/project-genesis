/**
 * @module @application/services/MilestoneEvaluationService
 *
 * Event-driven milestone detection and completion for companies.
 */

import type { IEventBus } from '../../common/events/IEventBus.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { FinanceTransactionDirection } from '../../domain/finance/FinanceTransactionDirection.js';
import { FinanceTransactionType } from '../../domain/finance/FinanceTransactionType.js';
import type { FinanceRepository } from '../../domain/finance/FinanceRepository.js';
import { FinanceTransactionRecorded } from '../../domain/finance/events/FinanceTransactionRecorded.js';
import type { CompanyMilestones } from '../../domain/milestone/CompanyMilestones.js';
import type { CompanyMilestonesRepository } from '../../domain/milestone/CompanyMilestonesRepository.js';
import { createMilestoneId } from '../../domain/milestone/MilestoneId.js';
import type { ProductionJobRepository } from '../../domain/production/ProductionJobRepository.js';
import { ProductionJobStatus } from '../../domain/production/ProductionJobStatus.js';
import { ProductionCompleted } from '../../domain/production/events/ProductionCompleted.js';
import type { MilestoneRegistry } from '../../content/milestone/MilestoneRegistry.js';
import {
  MilestoneTriggerType,
  type MilestoneDefinition,
} from '../../content/milestone/MilestoneDefinition.js';
import type { ManualClock } from '../../common/time/ManualClock.js';
import type { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';

/** Dependencies required by {@link MilestoneEvaluationService}. */
export type MilestoneEvaluationServiceDependencies = {
  readonly eventBus: IEventBus;
  readonly clock: ManualClock;
  readonly companyMilestonesRepository: CompanyMilestonesRepository;
  readonly productionJobRepository: ProductionJobRepository;
  readonly financeRepository: FinanceRepository;
  readonly simulationEngine: SimulationEngine;
  readonly milestones: MilestoneRegistry;
};

/**
 * Subscribes to domain events and completes milestones when trigger conditions match.
 */
export class MilestoneEvaluationService {
  readonly #clock: MilestoneEvaluationServiceDependencies['clock'];
  readonly #companyMilestonesRepository: MilestoneEvaluationServiceDependencies['companyMilestonesRepository'];
  readonly #productionJobRepository: MilestoneEvaluationServiceDependencies['productionJobRepository'];
  readonly #financeRepository: MilestoneEvaluationServiceDependencies['financeRepository'];
  readonly #simulationEngine: MilestoneEvaluationServiceDependencies['simulationEngine'];
  readonly #milestones: MilestoneEvaluationServiceDependencies['milestones'];

  /**
   * @param dependencies - Event bus, repositories and milestone content.
   */
  constructor(dependencies: MilestoneEvaluationServiceDependencies) {
    this.#clock = dependencies.clock;
    this.#companyMilestonesRepository = dependencies.companyMilestonesRepository;
    this.#productionJobRepository = dependencies.productionJobRepository;
    this.#financeRepository = dependencies.financeRepository;
    this.#simulationEngine = dependencies.simulationEngine;
    this.#milestones = dependencies.milestones;

    dependencies.eventBus.subscribe('FinanceTransactionRecorded', (event) => {
      this.#handleFinanceTransaction(event as FinanceTransactionRecorded);
    });

    dependencies.eventBus.subscribe('ProductionCompleted', (event) => {
      this.#handleProductionCompleted(event as ProductionCompleted);
    });
  }

  #handleFinanceTransaction(event: FinanceTransactionRecorded): void {
    if (
      event.transactionType !== FinanceTransactionType.SALE ||
      event.direction !== FinanceTransactionDirection.IN
    ) {
      return;
    }

    const companyIdResult = createCompanyId(event.companyId);

    if (!companyIdResult.ok) {
      return;
    }

    this.#evaluateFinanceMilestones(companyIdResult.value);
  }

  #handleProductionCompleted(event: ProductionCompleted): void {
    const companyIdResult = createCompanyId(event.companyId);

    if (!companyIdResult.ok) {
      return;
    }

    this.#evaluateProductionMilestones(companyIdResult.value);
  }

  #evaluateFinanceMilestones(companyId: CompanyId): void {
    const companyMilestones = this.#companyMilestonesRepository.findByCompanyId(companyId);

    if (companyMilestones === undefined) {
      return;
    }

    const saleRevenue = this.#sumSaleRevenue(companyId);

    for (const milestone of this.#milestones.getAll()) {
      if (!milestone.enabled) {
        continue;
      }

      if (milestone.trigger.type === MilestoneTriggerType.FIRST_SALE) {
        this.#tryCompleteMilestone(companyMilestones, milestone);
        continue;
      }

      if (
        milestone.trigger.type === MilestoneTriggerType.PROFIT_THRESHOLD &&
        saleRevenue >= milestone.trigger.amount
      ) {
        this.#tryCompleteMilestone(companyMilestones, milestone);
      }
    }

    this.#persistMilestoneEvents(companyMilestones);
  }

  #evaluateProductionMilestones(companyId: CompanyId): void {
    const companyMilestones = this.#companyMilestonesRepository.findByCompanyId(companyId);

    if (companyMilestones === undefined) {
      return;
    }

    for (const milestone of this.#milestones.getAll()) {
      if (!milestone.enabled || milestone.trigger.type !== MilestoneTriggerType.PRODUCTION_VOLUME) {
        continue;
      }

      const completedCount = this.#countFinishedProduction(
        companyId,
        milestone.trigger.recipeId,
      );

      if (completedCount >= milestone.trigger.count) {
        this.#tryCompleteMilestone(companyMilestones, milestone);
      }
    }

    this.#persistMilestoneEvents(companyMilestones);
  }

  #persistMilestoneEvents(companyMilestones: CompanyMilestones): void {
    const events = companyMilestones.pullDomainEvents();

    if (events.length === 0) {
      return;
    }

    this.#companyMilestonesRepository.save(companyMilestones);
    this.#simulationEngine.enqueueEvents(events);
  }

  #tryCompleteMilestone(
    companyMilestones: CompanyMilestones,
    milestone: MilestoneDefinition,
  ): void {
    if (companyMilestones.hasCompletedMilestone(milestone.id)) {
      return;
    }

    const milestoneIdResult = createMilestoneId(milestone.id);

    if (!milestoneIdResult.ok) {
      return;
    }

    companyMilestones.completeMilestone(milestoneIdResult.value, this.#clock);
  }

  #countFinishedProduction(companyId: CompanyId, recipeId?: string): number {
    return this.#productionJobRepository.findAll().filter((job) => {
      if (job.getCompanyId().value !== companyId.value) {
        return false;
      }

      if (job.getStatus() !== ProductionJobStatus.FINISHED) {
        return false;
      }

      if (recipeId !== undefined && job.getRecipeId().value !== recipeId) {
        return false;
      }

      return true;
    }).length;
  }

  #sumSaleRevenue(companyId: CompanyId): number {
    const finance = this.#financeRepository.findByCompanyId(companyId);

    if (finance === undefined) {
      return 0;
    }

    return finance
      .getTransactions()
      .filter(
        (transaction) =>
          transaction.transactionType === FinanceTransactionType.SALE &&
          transaction.direction === FinanceTransactionDirection.IN,
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
  }
}
