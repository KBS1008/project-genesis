/**
 * @module @application/use-cases/AssignEmployeeUseCase
 *
 * Coordinates employee building assignment, persistence and domain events.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createBuildingId } from '../../domain/building/Building.js';
import { BuildingStatus } from '../../domain/building/BuildingStatus.js';
import { createEmployeeId } from '../../domain/employee/Employee.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { AssignEmployeeCommand } from '../commands/AssignEmployeeCommand.js';

/** Dependencies required by {@link AssignEmployeeUseCase}. */
export type AssignEmployeeUseCaseDependencies = Pick<
  ApplicationContext,
  'clock' | 'employeeRepository' | 'buildingRepository' | 'simulationEngine'
>;

/**
 * Assigns an employee to an active building owned by the same company.
 */
export class AssignEmployeeUseCase {
  readonly #clock: AssignEmployeeUseCaseDependencies['clock'];
  readonly #employeeRepository: AssignEmployeeUseCaseDependencies['employeeRepository'];
  readonly #buildingRepository: AssignEmployeeUseCaseDependencies['buildingRepository'];
  readonly #simulationEngine: AssignEmployeeUseCaseDependencies['simulationEngine'];

  /**
   * @param dependencies - Application services required to assign an employee.
   */
  constructor(dependencies: AssignEmployeeUseCaseDependencies) {
    this.#clock = dependencies.clock;
    this.#employeeRepository = dependencies.employeeRepository;
    this.#buildingRepository = dependencies.buildingRepository;
    this.#simulationEngine = dependencies.simulationEngine;
  }

  /**
   * Executes the assign-employee workflow.
   */
  execute(command: AssignEmployeeCommand): Result<void, ValidationError> {
    const employeeIdResult = createEmployeeId(command.employeeId);

    if (!employeeIdResult.ok) {
      return Result.fail(employeeIdResult.error);
    }

    const buildingIdResult = createBuildingId(command.buildingId);

    if (!buildingIdResult.ok) {
      return Result.fail(buildingIdResult.error);
    }

    const employeeId = employeeIdResult.value;
    const buildingId = buildingIdResult.value;

    const employee = this.#employeeRepository.findById(employeeId);

    if (employee === undefined) {
      return Result.fail(new ValidationError(`Employee id "${employeeId.value}" was not found.`));
    }

    const building = this.#buildingRepository.findById(buildingId);

    if (building === undefined) {
      return Result.fail(new ValidationError(`Building id "${buildingId.value}" was not found.`));
    }

    if (employee.getCompanyId().value !== building.getCompanyId().value) {
      return Result.fail(
        new ValidationError(
          `Employee "${employeeId.value}" cannot be assigned to building "${buildingId.value}" owned by another company.`,
        ),
      );
    }

    if (building.getStatus() !== BuildingStatus.ACTIVE) {
      return Result.fail(
        new ValidationError(
          `Building id "${buildingId.value}" must be active before assigning employees.`,
        ),
      );
    }

    const assignResult = employee.assignToBuilding(buildingId, this.#clock);

    if (!assignResult.ok) {
      return Result.fail(assignResult.error);
    }

    this.#employeeRepository.save(employee);
    this.#simulationEngine.enqueueEvents(employee.pullDomainEvents());

    return Result.ok(undefined);
  }
}
