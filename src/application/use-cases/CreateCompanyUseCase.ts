/**
 * @module @application/use-cases/CreateCompanyUseCase
 *
 * Coordinates company creation, persistence and domain event enqueueing.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import {
  Company,
  createCompanyId,
  createPlayerId,
} from '../../domain/company/Company.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';
import { Inventory, createInventoryId } from '../../domain/inventory/Inventory.js';
import {
  FinanceAccount,
  createFinanceAccountId,
} from '../../domain/finance/FinanceAccount.js';
import { CompanyResearch } from '../../domain/research/CompanyResearch.js';
import { createCompanyResearchId } from '../../domain/research/CompanyResearchId.js';
import { CompanyMilestones } from '../../domain/milestone/CompanyMilestones.js';
import { createCompanyMilestonesId } from '../../domain/milestone/CompanyMilestonesId.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { CreateCompanyCommand } from '../commands/CreateCompanyCommand.js';

/** Dependencies required by {@link CreateCompanyUseCase}. */
export type CreateCompanyUseCaseDependencies = Pick<
  ApplicationContext,
  | 'clock'
  | 'companyRepository'
  | 'inventoryRepository'
  | 'financeRepository'
  | 'companyResearchRepository'
  | 'companyMilestonesRepository'
  | 'simulationEngine'
>;

/**
 * Creates a company aggregate and persists it.
 */
export class CreateCompanyUseCase {
  readonly #clock: CreateCompanyUseCaseDependencies['clock'];
  readonly #companyRepository: CreateCompanyUseCaseDependencies['companyRepository'];
  readonly #inventoryRepository: CreateCompanyUseCaseDependencies['inventoryRepository'];
  readonly #financeRepository: CreateCompanyUseCaseDependencies['financeRepository'];
  readonly #companyResearchRepository: CreateCompanyUseCaseDependencies['companyResearchRepository'];
  readonly #companyMilestonesRepository: CreateCompanyUseCaseDependencies['companyMilestonesRepository'];
  readonly #simulationEngine: CreateCompanyUseCaseDependencies['simulationEngine'];

  /**
   * @param dependencies - Application services required for company creation.
   */
  constructor(dependencies: CreateCompanyUseCaseDependencies) {
    this.#clock = dependencies.clock;
    this.#companyRepository = dependencies.companyRepository;
    this.#inventoryRepository = dependencies.inventoryRepository;
    this.#financeRepository = dependencies.financeRepository;
    this.#companyResearchRepository = dependencies.companyResearchRepository;
    this.#companyMilestonesRepository = dependencies.companyMilestonesRepository;
    this.#simulationEngine = dependencies.simulationEngine;
  }

  /**
   * Executes the create-company workflow.
   *
   * @param command - Company creation input.
   */
  execute(command: CreateCompanyCommand): Result<CompanyId, ValidationError> {
    const companyIdResult = createCompanyId(command.companyId);

    if (!companyIdResult.ok) {
      return Result.fail(companyIdResult.error);
    }

    const ownerIdResult = createPlayerId(command.ownerId);

    if (!ownerIdResult.ok) {
      return Result.fail(ownerIdResult.error);
    }

    const companyId = companyIdResult.value;

    if (this.#companyRepository.findById(companyId) !== undefined) {
      return Result.fail(
        new ValidationError(`Company id "${companyId.value}" already exists.`),
      );
    }

    const companyResult = Company.create({
      id: companyId,
      name: command.name,
      ownerId: ownerIdResult.value,
      clock: this.#clock,
    });

    if (!companyResult.ok) {
      return Result.fail(companyResult.error);
    }

    const company = companyResult.value;
    this.#companyRepository.save(company);
    this.#simulationEngine.enqueueEvents(company.pullDomainEvents());

    const inventoryIdResult = createInventoryId(`inventory_${companyId.value}`);

    if (!inventoryIdResult.ok) {
      return Result.fail(inventoryIdResult.error);
    }

    if (this.#inventoryRepository.findByCompanyId(companyId) !== undefined) {
      return Result.fail(
        new ValidationError(`Inventory for company "${companyId.value}" already exists.`),
      );
    }

    const inventoryResult = Inventory.create({
      id: inventoryIdResult.value,
      companyId,
      clock: this.#clock,
    });

    if (!inventoryResult.ok) {
      return Result.fail(inventoryResult.error);
    }

    this.#inventoryRepository.save(inventoryResult.value);

    const financeIdResult = createFinanceAccountId(`finance_${companyId.value}`);

    if (!financeIdResult.ok) {
      return Result.fail(financeIdResult.error);
    }

    if (this.#financeRepository.findByCompanyId(companyId) !== undefined) {
      return Result.fail(
        new ValidationError(`Finance account for company "${companyId.value}" already exists.`),
      );
    }

    const financeResult = FinanceAccount.create({
      id: financeIdResult.value,
      companyId,
      clock: this.#clock,
    });

    if (!financeResult.ok) {
      return Result.fail(financeResult.error);
    }

    this.#financeRepository.save(financeResult.value);
    this.#simulationEngine.enqueueEvents(financeResult.value.pullDomainEvents());

    const companyResearchIdResult = createCompanyResearchId(`research_${companyId.value}`);

    if (!companyResearchIdResult.ok) {
      return Result.fail(companyResearchIdResult.error);
    }

    if (this.#companyResearchRepository.findByCompanyId(companyId) !== undefined) {
      return Result.fail(
        new ValidationError(`Research module for company "${companyId.value}" already exists.`),
      );
    }

    const companyResearchResult = CompanyResearch.create({
      id: companyResearchIdResult.value,
      companyId,
      clock: this.#clock,
    });

    if (!companyResearchResult.ok) {
      return Result.fail(companyResearchResult.error);
    }

    this.#companyResearchRepository.save(companyResearchResult.value);

    const companyMilestonesIdResult = createCompanyMilestonesId(`milestones_${companyId.value}`);

    if (!companyMilestonesIdResult.ok) {
      return Result.fail(companyMilestonesIdResult.error);
    }

    if (this.#companyMilestonesRepository.findByCompanyId(companyId) !== undefined) {
      return Result.fail(
        new ValidationError(`Milestones module for company "${companyId.value}" already exists.`),
      );
    }

    const companyMilestonesResult = CompanyMilestones.create({
      id: companyMilestonesIdResult.value,
      companyId,
      clock: this.#clock,
    });

    if (!companyMilestonesResult.ok) {
      return Result.fail(companyMilestonesResult.error);
    }

    this.#companyMilestonesRepository.save(companyMilestonesResult.value);

    return Result.ok(companyId);
  }
}
