/**
 * @module @application/use-cases/HireEmployeeUseCase
 *
 * Coordinates employee hiring, recruitment cost debit, persistence and domain events.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { Guard } from '../../common/validation/Guard.js';
import { BuildingStatus } from '../../domain/building/BuildingStatus.js';
import { createCompanyId } from '../../domain/company/Company.js';
import {
  Employee,
  createEmployeeId,
  createEmployeeTypeId,
} from '../../domain/employee/Employee.js';
import type { EmployeeId } from '../../domain/employee/EmployeeId.js';
import { FinanceTransactionType } from '../../domain/finance/FinanceTransactionType.js';
import { EmployeePrerequisitesSpecification } from '../../domain/specifications/employee/EmployeePrerequisitesSpecification.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { HireEmployeeCommand } from '../commands/HireEmployeeCommand.js';

/** Dependencies required by {@link HireEmployeeUseCase}. */
export type HireEmployeeUseCaseDependencies = Pick<
  ApplicationContext,
  | 'clock'
  | 'companyRepository'
  | 'employeeRepository'
  | 'buildingRepository'
  | 'financeRepository'
  | 'companyResearchRepository'
  | 'simulationEngine'
  | 'gameContent'
>;

/**
 * Hires an employee for a company and debits the one-time recruitment cost.
 */
export class HireEmployeeUseCase {
  readonly #clock: HireEmployeeUseCaseDependencies['clock'];
  readonly #companyRepository: HireEmployeeUseCaseDependencies['companyRepository'];
  readonly #employeeRepository: HireEmployeeUseCaseDependencies['employeeRepository'];
  readonly #buildingRepository: HireEmployeeUseCaseDependencies['buildingRepository'];
  readonly #financeRepository: HireEmployeeUseCaseDependencies['financeRepository'];
  readonly #companyResearchRepository: HireEmployeeUseCaseDependencies['companyResearchRepository'];
  readonly #simulationEngine: HireEmployeeUseCaseDependencies['simulationEngine'];
  readonly #gameContent: HireEmployeeUseCaseDependencies['gameContent'];
  readonly #employeePrerequisitesSpecification = new EmployeePrerequisitesSpecification();

  /**
   * @param dependencies - Application services required to hire an employee.
   */
  constructor(dependencies: HireEmployeeUseCaseDependencies) {
    this.#clock = dependencies.clock;
    this.#companyRepository = dependencies.companyRepository;
    this.#employeeRepository = dependencies.employeeRepository;
    this.#buildingRepository = dependencies.buildingRepository;
    this.#financeRepository = dependencies.financeRepository;
    this.#companyResearchRepository = dependencies.companyResearchRepository;
    this.#simulationEngine = dependencies.simulationEngine;
    this.#gameContent = dependencies.gameContent;
  }

  /**
   * Executes the hire-employee workflow.
   */
  execute(command: HireEmployeeCommand): Result<EmployeeId, ValidationError> {
    const employeeIdResult = createEmployeeId(command.employeeId);

    if (!employeeIdResult.ok) {
      return Result.fail(employeeIdResult.error);
    }

    const companyIdResult = createCompanyId(command.companyId);

    if (!companyIdResult.ok) {
      return Result.fail(companyIdResult.error);
    }

    const employeeTypeIdResult = createEmployeeTypeId(command.employeeTypeId);

    if (!employeeTypeIdResult.ok) {
      return Result.fail(employeeTypeIdResult.error);
    }

    const employeeId = employeeIdResult.value;
    const companyId = companyIdResult.value;
    const employeeTypeId = employeeTypeIdResult.value;

    if (this.#companyRepository.findById(companyId) === undefined) {
      return Result.fail(new ValidationError(`Company id "${companyId.value}" was not found.`));
    }

    if (this.#employeeRepository.findById(employeeId) !== undefined) {
      return Result.fail(new ValidationError(`Employee id "${employeeId.value}" already exists.`));
    }

    const employeeType = this.#gameContent.employees.get(employeeTypeId.value);

    if (employeeType === undefined) {
      return Result.fail(
        new ValidationError(`Employee type "${employeeTypeId.value}" was not found.`),
      );
    }

    if (!employeeType.enabled) {
      return Result.fail(
        new ValidationError(`Employee type "${employeeTypeId.value}" is disabled.`),
      );
    }

    const costResult = Guard.againstNegative(
      employeeType.cost,
      'Recruitment cost must not be negative.',
    );

    if (!costResult.ok) {
      return Result.fail(costResult.error);
    }

    const companyResearch = this.#companyResearchRepository.findByCompanyId(companyId);

    if (companyResearch === undefined) {
      return Result.fail(
        new ValidationError(`Research module for company "${companyId.value}" was not found.`),
      );
    }

    const ownedActiveBuildingTypes = new Set(
      this.#buildingRepository
        .findByCompanyId(companyId)
        .filter((building) => building.getStatus() === BuildingStatus.ACTIVE)
        .map((building) => building.getBuildingTypeId().value),
    );

    const prerequisitesResult = this.#employeePrerequisitesSpecification.isSatisfiedBy(
      {
        employeeTypeId: employeeTypeId.value,
        requiredResearch: employeeType.requirements.research,
        requiredBuildingTypes: employeeType.requirements.buildings,
      },
      {
        completedResearch: new Set(companyResearch.getCompletedTechnologies()),
        ownedActiveBuildingTypes,
      },
    );

    if (!prerequisitesResult.ok) {
      return Result.fail(prerequisitesResult.error);
    }

    const finance = this.#financeRepository.findByCompanyId(companyId);

    if (finance === undefined) {
      return Result.fail(
        new ValidationError(`Finance account for company "${companyId.value}" was not found.`),
      );
    }

    const employeeResult = Employee.hire({
      id: employeeId,
      companyId,
      employeeTypeId,
      displayName: command.displayName,
      salary: employeeType.salary,
      productivity: employeeType.productivity,
      clock: this.#clock,
    });

    if (!employeeResult.ok) {
      return Result.fail(employeeResult.error);
    }

    const employee = employeeResult.value;
    const debitResult = finance.debit(
      costResult.value,
      FinanceTransactionType.RECRUITMENT_COST,
      this.#clock,
    );

    if (!debitResult.ok) {
      return Result.fail(debitResult.error);
    }

    this.#employeeRepository.save(employee);
    this.#financeRepository.save(finance);
    this.#simulationEngine.enqueueEvents([
      ...employee.pullDomainEvents(),
      ...finance.pullDomainEvents(),
    ]);

    return Result.ok(employeeId);
  }
}
