/**
 * @module @infrastructure/persistence/InMemoryEmployeeRepository
 *
 * In-memory implementation of {@link EmployeeRepository} for tests and local sessions.
 */

import type { BuildingId } from '../../domain/building/BuildingId.js';
import type { CompanyId } from '../../domain/company/CompanyId.js';
import type { Employee } from '../../domain/employee/Employee.js';
import type { EmployeeId } from '../../domain/employee/EmployeeId.js';
import type { EmployeeRepository } from '../../domain/employee/EmployeeRepository.js';

/**
 * Stores employee aggregates in memory.
 */
export class InMemoryEmployeeRepository implements EmployeeRepository {
  readonly #employees = new Map<string, Employee>();

  save(employee: Employee): void {
    this.#employees.set(employee.getId().value, employee);
  }

  findById(id: EmployeeId): Employee | undefined {
    return this.#employees.get(id.value);
  }

  findByCompanyId(companyId: CompanyId): readonly Employee[] {
    return Object.freeze(
      [...this.#employees.values()]
        .filter((employee) => employee.getCompanyId().value === companyId.value)
        .sort((left, right) => left.getId().value.localeCompare(right.getId().value)),
    );
  }

  findByBuildingId(buildingId: BuildingId): readonly Employee[] {
    return Object.freeze(
      [...this.#employees.values()]
        .filter((employee) => employee.getAssignedBuildingId()?.value === buildingId.value)
        .sort((left, right) => left.getId().value.localeCompare(right.getId().value)),
    );
  }

  findAll(): readonly Employee[] {
    return Object.freeze(
      [...this.#employees.values()].sort((left, right) =>
        left.getId().value.localeCompare(right.getId().value),
      ),
    );
  }
}
