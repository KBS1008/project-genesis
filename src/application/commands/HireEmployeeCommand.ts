/**
 * @module @application/commands/HireEmployeeCommand
 *
 * Input for hiring a company employee.
 */

/** Command payload for {@link HireEmployeeUseCase}. */
export type HireEmployeeCommand = {
  readonly employeeId: string;
  readonly companyId: string;
  readonly employeeTypeId: string;
  readonly displayName: string;
};
