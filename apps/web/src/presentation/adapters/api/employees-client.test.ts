import { beforeEach, describe, expect, it, vi } from 'vitest';
import { assignEmployee, hireEmployee } from './employees-client';

const callApi = vi.fn();

vi.mock('./client', () => ({
  callApi: (...args: unknown[]) => callApi(...args),
}));

describe('employees-client', () => {
  beforeEach(() => {
    callApi.mockReset();
    callApi.mockResolvedValue(undefined);
  });

  it('posts hire requests to the employees hire endpoint', async () => {
    await hireEmployee({
      employeeTypeId: 'worker',
      displayName: 'Alex Worker',
    });

    expect(callApi).toHaveBeenCalledWith('/api/employees/hire', {
      method: 'POST',
      body: JSON.stringify({
        employeeTypeId: 'worker',
        displayName: 'Alex Worker',
      }),
    });
  });

  it('posts assign requests to the employees assign endpoint', async () => {
    await assignEmployee({
      employeeId: 'employee_001',
      buildingId: 'building_001',
    });

    expect(callApi).toHaveBeenCalledWith('/api/employees/assign', {
      method: 'POST',
      body: JSON.stringify({
        employeeId: 'employee_001',
        buildingId: 'building_001',
      }),
    });
  });
});
