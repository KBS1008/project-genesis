/**
 * @module @domain/employee/EmployeeAllocationPort
 *
 * Domain port for employee allocation queries used by simulation systems.
 */

import type { BuildingId } from '../building/BuildingId.js';

/** Read-only employee allocation access for simulation and application layers. */
export interface EmployeeAllocationPort {
  /** Returns the number of employees assigned to a building. */
  getAssignedWorkerCount(buildingId: BuildingId): number;

  /** Returns production worker efficiency from 0 to 1 for a recipe on a building. */
  getWorkerEfficiency(buildingId: BuildingId, recipeId: string): number;
}
