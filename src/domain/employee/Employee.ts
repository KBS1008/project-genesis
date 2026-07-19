/**
 * @module @domain/employee/Employee
 *
 * Employee aggregate root for Project Genesis.
 *
 * Represents one hired staff member owned by a company. Salary and productivity
 * are supplied by the application layer from static content definitions.
 *
 * @see docs/schemas/Employee.schema.md
 * @see docs/gameplay/employees.md
 * @see docs/architecture/domain-model.md
 */

import { AggregateRoot } from '../../common/core/AggregateRoot.js';
import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import { Guard } from '../../common/validation/Guard.js';
import type { BuildingId } from '../building/BuildingId.js';
import type { CompanyId } from '../company/CompanyId.js';
import type { EmployeeId, EmployeeTypeId } from './EmployeeId.js';
import { EmployeeStatus } from './EmployeeStatus.js';
import { EmployeeAssignedToBuilding } from './events/EmployeeAssignedToBuilding.js';
import { EmployeeHired } from './events/EmployeeHired.js';
import { EmployeeUnassignedFromBuilding } from './events/EmployeeUnassignedFromBuilding.js';

/** Parameters required to hire a new employee. */
export type HireEmployeeParams = {
  readonly id: EmployeeId;
  readonly companyId: CompanyId;
  readonly employeeTypeId: EmployeeTypeId;
  readonly displayName: string;
  readonly salary: number;
  readonly productivity: number;
  readonly clock: Clock;
};

/**
 * Aggregate root for one company employee.
 */
export class Employee extends AggregateRoot<'Employee'> {
  readonly #companyId: CompanyId;
  readonly #employeeTypeId: EmployeeTypeId;
  readonly #displayName: string;
  readonly #salary: number;
  readonly #productivity: number;
  readonly #hiredAt: number;
  readonly #status: EmployeeStatus;
  #assignedBuildingId: BuildingId | undefined;

  private constructor(
    params: {
      id: EmployeeId;
      companyId: CompanyId;
      employeeTypeId: EmployeeTypeId;
      displayName: string;
      salary: number;
      productivity: number;
      hiredAt: number;
      status: EmployeeStatus;
      assignedBuildingId: BuildingId | undefined;
    },
    restoring = false,
  ) {
    super(params.id);
    this.#companyId = params.companyId;
    this.#employeeTypeId = params.employeeTypeId;
    this.#displayName = params.displayName;
    this.#salary = params.salary;
    this.#productivity = params.productivity;
    this.#hiredAt = params.hiredAt;
    this.#status = params.status;
    this.#assignedBuildingId = params.assignedBuildingId;

    if (!restoring) {
      this.addDomainEvent(
        new EmployeeHired(
          params.hiredAt,
          params.id.value,
          params.companyId.value,
          params.employeeTypeId.value,
          params.salary,
          params.productivity,
        ),
      );
    }
  }

  /**
   * Hires a new employee for a company.
   */
  static hire(params: HireEmployeeParams): Result<Employee, ValidationError> {
    const nameResult = Guard.againstEmptyString(
      params.displayName,
      'Employee display name must not be empty.',
    );

    if (!nameResult.ok) {
      return Result.fail(nameResult.error);
    }

    const trimmedName = nameResult.value.trim();
    const trimmedNameResult = Guard.againstEmptyString(
      trimmedName,
      'Employee display name must not be a whitespace-only string.',
    );

    if (!trimmedNameResult.ok) {
      return Result.fail(trimmedNameResult.error);
    }

    const salaryResult = Guard.againstZeroOrNegative(
      params.salary,
      'Employee salary must be greater than zero.',
    );

    if (!salaryResult.ok) {
      return Result.fail(salaryResult.error);
    }

    const productivityResult = Guard.againstZeroOrNegative(
      params.productivity,
      'Employee productivity must be greater than zero.',
    );

    if (!productivityResult.ok) {
      return Result.fail(productivityResult.error);
    }

    return Result.ok(
      new Employee({
        id: params.id,
        companyId: params.companyId,
        employeeTypeId: params.employeeTypeId,
        displayName: trimmedName,
        salary: salaryResult.value,
        productivity: productivityResult.value,
        hiredAt: params.clock.now(),
        status: EmployeeStatus.ACTIVE,
        assignedBuildingId: undefined,
      }),
    );
  }

  /**
   * Rehydrates an employee aggregate from a persisted snapshot without raising events.
   */
  static restore(params: {
    readonly id: EmployeeId;
    readonly companyId: CompanyId;
    readonly employeeTypeId: EmployeeTypeId;
    readonly displayName: string;
    readonly salary: number;
    readonly productivity: number;
    readonly hiredAt: number;
    readonly status: EmployeeStatus;
    readonly assignedBuildingId: BuildingId | undefined;
  }): Result<Employee, ValidationError> {
    const nameResult = Guard.againstEmptyString(
      params.displayName,
      'Employee display name must not be empty.',
    );

    if (!nameResult.ok) {
      return Result.fail(nameResult.error);
    }

    const salaryResult = Guard.againstZeroOrNegative(
      params.salary,
      'Employee salary must be greater than zero.',
    );

    if (!salaryResult.ok) {
      return Result.fail(salaryResult.error);
    }

    const productivityResult = Guard.againstZeroOrNegative(
      params.productivity,
      'Employee productivity must be greater than zero.',
    );

    if (!productivityResult.ok) {
      return Result.fail(productivityResult.error);
    }

    return Result.ok(
      new Employee(
        {
          id: params.id,
          companyId: params.companyId,
          employeeTypeId: params.employeeTypeId,
          displayName: nameResult.value.trim(),
          salary: salaryResult.value,
          productivity: productivityResult.value,
          hiredAt: params.hiredAt,
          status: params.status,
          assignedBuildingId: params.assignedBuildingId,
        },
        true,
      ),
    );
  }

  /** Returns the owning company identifier. */
  getCompanyId(): CompanyId {
    return this.#companyId;
  }

  /** Returns the static employee type identifier. */
  getEmployeeTypeId(): EmployeeTypeId {
    return this.#employeeTypeId;
  }

  /** Returns the employee display name. */
  getDisplayName(): string {
    return this.#displayName;
  }

  /** Returns the recurring salary cost per payroll cycle. */
  getSalary(): number {
    return this.#salary;
  }

  /** Returns the productivity factor used by simulation rules. */
  getProductivity(): number {
    return this.#productivity;
  }

  /** Returns the simulation time when the employee was hired. */
  getHiredAt(): number {
    return this.#hiredAt;
  }

  /** Returns the current employment status. */
  getStatus(): EmployeeStatus {
    return this.#status;
  }

  /** Returns the assigned building identifier, if any. */
  getAssignedBuildingId(): BuildingId | undefined {
    return this.#assignedBuildingId;
  }

  /** Returns whether the employee is currently assigned to a building. */
  isAssigned(): boolean {
    return this.#assignedBuildingId !== undefined;
  }

  /**
   * Assigns the employee to a building.
   *
   * An employee can be assigned to at most one building at a time.
   */
  assignToBuilding(buildingId: BuildingId, clock: Clock): Result<void, ValidationError> {
    if (this.#assignedBuildingId !== undefined) {
      return Result.fail(new ValidationError('Employee is already assigned to a building.'));
    }

    this.#assignedBuildingId = buildingId;

    this.addDomainEvent(
      new EmployeeAssignedToBuilding(
        clock.now(),
        this.getId().value,
        this.#companyId.value,
        buildingId.value,
      ),
    );

    return Result.ok(undefined);
  }

  /**
   * Removes the employee from their current building assignment.
   */
  unassignFromBuilding(clock: Clock): Result<void, ValidationError> {
    const assignedBuildingId = this.#assignedBuildingId;

    if (assignedBuildingId === undefined) {
      return Result.fail(new ValidationError('Employee is not assigned to a building.'));
    }

    this.#assignedBuildingId = undefined;

    this.addDomainEvent(
      new EmployeeUnassignedFromBuilding(
        clock.now(),
        this.getId().value,
        this.#companyId.value,
        assignedBuildingId.value,
      ),
    );

    return Result.ok(undefined);
  }
}

/** Creates a validated employee identifier from a raw string. */
export function createEmployeeId(rawValue: string): Result<EmployeeId, ValidationError> {
  const result = Identifier.create<EmployeeId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}

/** Creates a validated employee type identifier from a raw string. */
export function createEmployeeTypeId(rawValue: string): Result<EmployeeTypeId, ValidationError> {
  const result = Identifier.create<EmployeeTypeId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
