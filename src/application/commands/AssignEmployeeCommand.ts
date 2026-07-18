/**
 * @module @application/commands/AssignEmployeeCommand
 *
 * Input for assigning an employee to a building.
 */

/** Command payload for {@link AssignEmployeeUseCase}. */
export type AssignEmployeeCommand = {
  readonly employeeId: string;
  readonly buildingId: string;
};
