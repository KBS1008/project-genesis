/**
 * @module @project-genesis/api/game/dto/hire-employee.dto
 */

/** Request body for hiring an employee. */
export type HireEmployeeDto = {
  readonly employeeTypeId: string;
  readonly displayName: string;
};
