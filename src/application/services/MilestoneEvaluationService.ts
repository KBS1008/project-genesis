/**
 * @module @application/services/MilestoneEvaluationService
 *
 * Event-driven milestone detection and completion for companies.
 */

import type { IEventBus } from '../../common/events/IEventBus.js';
import { FinanceTransactionDirection } from '../../domain/finance/FinanceTransactionDirection.js';
import { FinanceTransactionType } from '../../domain/finance/FinanceTransactionType.js';
import { FinanceTransactionRecorded } from '../../domain/finance/events/FinanceTransactionRecorded.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { createMilestoneId } from '../../domain/milestone/MilestoneId.js';
import type { CompanyMilestonesRepository } from '../../domain/milestone/CompanyMilestonesRepository.js';
import type { MilestoneRegistry } from '../../content/milestone/MilestoneRegistry.js';
import { MilestoneTriggerType } from '../../content/milestone/MilestoneDefinition.js';
import type { ManualClock } from '../../common/time/ManualClock.js';
import type { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';

/** Dependencies required by {@link MilestoneEvaluationService}. */
export type MilestoneEvaluationServiceDependencies = {
  readonly eventBus: IEventBus;
  readonly clock: ManualClock;
  readonly companyMilestonesRepository: CompanyMilestonesRepository;
  readonly simulationEngine: SimulationEngine;
  readonly milestones: MilestoneRegistry;
};

/**
 * Subscribes to domain events and completes milestones when trigger conditions match.
 */
export class MilestoneEvaluationService {
  readonly #clock: MilestoneEvaluationServiceDependencies['clock'];
  readonly #companyMilestonesRepository: MilestoneEvaluationServiceDependencies['companyMilestonesRepository'];
  readonly #simulationEngine: MilestoneEvaluationServiceDependencies['simulationEngine'];
  readonly #milestones: MilestoneEvaluationServiceDependencies['milestones'];

  /**
   * @param dependencies - Event bus, repositories and milestone content.
   */
  constructor(dependencies: MilestoneEvaluationServiceDependencies) {
    this.#clock = dependencies.clock;
    this.#companyMilestonesRepository = dependencies.companyMilestonesRepository;
    this.#simulationEngine = dependencies.simulationEngine;
    this.#milestones = dependencies.milestones;

    dependencies.eventBus.subscribe('FinanceTransactionRecorded', (event) => {
      this.#handleFinanceTransaction(event as FinanceTransactionRecorded);
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

    const companyMilestones = this.#companyMilestonesRepository.findByCompanyId(companyIdResult.value);

    if (companyMilestones === undefined) {
      return;
    }

    for (const milestone of this.#milestones.getAll()) {
      if (!milestone.enabled || milestone.trigger.type !== MilestoneTriggerType.FIRST_SALE) {
        continue;
      }

      if (companyMilestones.hasCompletedMilestone(milestone.id)) {
        continue;
      }

      const milestoneIdResult = createMilestoneId(milestone.id);

      if (!milestoneIdResult.ok) {
        continue;
      }

      const completeResult = companyMilestones.completeMilestone(
        milestoneIdResult.value,
        this.#clock,
      );

      if (!completeResult.ok) {
        continue;
      }

      this.#companyMilestonesRepository.save(companyMilestones);
      this.#simulationEngine.enqueueEvents(companyMilestones.pullDomainEvents());
    }
  }
}
