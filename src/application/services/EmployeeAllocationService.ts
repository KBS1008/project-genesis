/**
 * @module @application/services/EmployeeAllocationService
 *
 * Resolves building worker counts and recipe efficiency from runtime employee state.
 */

import type { GameContentLoadResult } from '../../content/validateGameContent.js';
import { EmployeeAllocationCalculator } from '../../domain/employee/EmployeeAllocationCalculator.js';
import type { EmployeeAllocationPort } from '../../domain/employee/EmployeeAllocationPort.js';
import type { EmployeeRepository } from '../../domain/employee/EmployeeRepository.js';
import type { BuildingId } from '../../domain/building/BuildingId.js';

/** Dependencies for {@link EmployeeAllocationService}. */
export type EmployeeAllocationServiceDependencies = {
  readonly employeeRepository: EmployeeRepository;
  readonly gameContent: GameContentLoadResult;
};

/**
 * Derives worker allocation metrics from employee assignments and recipe content.
 */
export class EmployeeAllocationService implements EmployeeAllocationPort {
  readonly #employeeRepository: EmployeeRepository;
  readonly #gameContent: GameContentLoadResult;

  constructor(dependencies: EmployeeAllocationServiceDependencies) {
    this.#employeeRepository = dependencies.employeeRepository;
    this.#gameContent = dependencies.gameContent;
  }

  getAssignedWorkerCount(buildingId: BuildingId): number {
    return this.#employeeRepository.findByBuildingId(buildingId).length;
  }

  getWorkerEfficiency(buildingId: BuildingId, recipeId: string): number {
    const recipe = this.#gameContent.recipes.get(recipeId);
    const requiredWorkers = recipe?.workers ?? 0;
    const assignedWorkers = this.getAssignedWorkerCount(buildingId);

    return EmployeeAllocationCalculator.computeWorkerEfficiency(
      assignedWorkers,
      requiredWorkers,
    );
  }
}
