/**
 * @module @project-genesis/api/game/dto/assign-employee.dto
 */

/** Request body for assigning an employee to a building. */
export type AssignEmployeeDto = {
  readonly employeeId: string;
  readonly buildingId: string;
};
