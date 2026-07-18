/**
 * @module @domain/employee/EmployeeStatus
 *
 * Lifecycle status of a company employee.
 */

/** Employee lifecycle states for employed staff. */
export const EmployeeStatus = {
  ACTIVE: 'ACTIVE',
} as const;

export type EmployeeStatus = (typeof EmployeeStatus)[keyof typeof EmployeeStatus];
