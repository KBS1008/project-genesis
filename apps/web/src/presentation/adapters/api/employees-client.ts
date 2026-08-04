/** HTTP commands for employee hire and assignment workflows. */

import { callApi } from './client';

export type HireEmployeeRequest = {
  readonly employeeTypeId: string;
  readonly displayName: string;
};

export type AssignEmployeeRequest = {
  readonly employeeId: string;
  readonly buildingId: string;
};

/** Hires an employee for the active company. */
export function hireEmployee(request: HireEmployeeRequest): Promise<void> {
  return callApi<void>('/api/employees/hire', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/** Assigns an employee to a building owned by the active company. */
export function assignEmployee(request: AssignEmployeeRequest): Promise<void> {
  return callApi<void>('/api/employees/assign', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
