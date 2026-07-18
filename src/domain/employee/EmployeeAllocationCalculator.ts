/**
 * @module @domain/employee/EmployeeAllocationCalculator
 *
 * Pure employee allocation calculations for production efficiency.
 *
 * @see docs/gameplay/employees.md
 */

/**
 * Computes effective production worker efficiency from assigned and required headcount.
 */
export class EmployeeAllocationCalculator {
  /**
   * Returns a multiplier between 0 and 1.
   *
   * Overstaffing beyond the required headcount does not exceed 1.
   */
  static computeWorkerEfficiency(assignedWorkers: number, requiredWorkers: number): number {
    if (requiredWorkers <= 0) {
      return 1;
    }

    if (assignedWorkers <= 0) {
      return 0;
    }

    return Math.min(assignedWorkers / requiredWorkers, 1);
  }
}
