/**
 * @module @domain/employee/EmployeeRepository
 *
 * Persistence contract for {@link Employee} aggregate roots.
 *
 * Concrete implementations belong to the Infrastructure layer.
 */

import type { BuildingId } from '../building/BuildingId.js';
import type { CompanyId } from '../company/CompanyId.js';
import type { Employee } from './Employee.js';
import type { EmployeeId } from './EmployeeId.js';

/**
 * Provides access to persisted employee aggregates.
 */
export interface EmployeeRepository {
  /** Persists an employee aggregate. */
  save(employee: Employee): void;

  /** Returns an employee by id, or undefined when not found. */
  findById(id: EmployeeId): Employee | undefined;

  /** Returns all employees owned by a company in deterministic id order. */
  findByCompanyId(companyId: CompanyId): readonly Employee[];

  /** Returns all employees assigned to a building in deterministic id order. */
  findByBuildingId(buildingId: BuildingId): readonly Employee[];

  /** Returns all persisted employees in deterministic id order. */
  findAll(): readonly Employee[];
}
