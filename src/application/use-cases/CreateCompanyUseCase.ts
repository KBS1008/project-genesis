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
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { CreateCompanyCommand } from '../commands/CreateCompanyCommand.js';

/** Dependencies required by {@link CreateCompanyUseCase}. */
export type CreateCompanyUseCaseDependencies = Pick<
  ApplicationContext,
  'clock' | 'companyRepository' | 'inventoryRepository' | 'simulationEngine'
>;

/**
 * Creates a company aggregate and persists it.
 */
export class CreateCompanyUseCase {
  readonly #clock: CreateCompanyUseCaseDependencies['clock'];
  readonly #companyRepository: CreateCompanyUseCaseDependencies['companyRepository'];
  readonly #inventoryRepository: CreateCompanyUseCaseDependencies['inventoryRepository'];
  readonly #simulationEngine: CreateCompanyUseCaseDependencies['simulationEngine'];

  /**
   * @param dependencies - Application services required for company creation.
   */
  constructor(dependencies: CreateCompanyUseCaseDependencies) {
    this.#clock = dependencies.clock;
    this.#companyRepository = dependencies.companyRepository;
    this.#inventoryRepository = dependencies.inventoryRepository;
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

    return Result.ok(companyId);
  }
}
