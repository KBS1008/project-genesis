// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SidebarHintsViewData } from '@/presentation/adapters/view-data/company-dashboard-view-data';
import { PGOperationsSidebar } from '@/presentation/screens/company/PGOperationsSidebar';

const hireEmployee = vi.fn();
const assignEmployee = vi.fn();
const runAction = vi.fn(async (action: () => Promise<void>) => {
  await action();
});

vi.mock('@/presentation/adapters/api/employees-client', () => ({
  hireEmployee: (...args: unknown[]) => hireEmployee(...args),
  assignEmployee: (...args: unknown[]) => assignEmployee(...args),
}));

const HINTS: SidebarHintsViewData = Object.freeze({
  placeBuilding: [],
  production: [],
  research: [],
  market: [],
  hireEmployee: Object.freeze([
    Object.freeze({
      employeeTypeId: 'worker',
      name: 'Arbeiter',
      costLabel: '500 GC',
      defaultDisplayName: 'Arbeiter 1',
      canHire: true,
      reason: null,
    }),
  ]),
  assignEmployee: Object.freeze([
    Object.freeze({
      employeeId: 'employee_001',
      employeeName: 'Alex',
      buildingId: 'building_001',
      buildingName: 'Sägewerk',
      canAssign: true,
      reason: null,
    }),
  ]),
});

describe('PGOperationsSidebar', () => {
  beforeEach(() => {
    hireEmployee.mockReset();
    assignEmployee.mockReset();
    runAction.mockClear();
    hireEmployee.mockResolvedValue(undefined);
    assignEmployee.mockResolvedValue(undefined);
  });

  it('submits hire actions through runAction and employees-client', async () => {
    const user = userEvent.setup();

    render(<PGOperationsSidebar hasGame hints={HINTS} runAction={runAction} />);

    await user.click(screen.getByRole('button', { name: 'Arbeiter (500 GC)' }));

    expect(runAction).toHaveBeenCalledTimes(1);
    expect(hireEmployee).toHaveBeenCalledWith({
      employeeTypeId: 'worker',
      displayName: 'Arbeiter 1',
    });
  });

  it('submits assign actions through runAction and employees-client', async () => {
    const user = userEvent.setup();

    render(<PGOperationsSidebar hasGame hints={HINTS} runAction={runAction} />);

    await user.click(screen.getByRole('button', { name: 'Alex → Sägewerk' }));

    expect(runAction).toHaveBeenCalledTimes(1);
    expect(assignEmployee).toHaveBeenCalledWith({
      employeeId: 'employee_001',
      buildingId: 'building_001',
    });
  });
});
