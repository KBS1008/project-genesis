import { EmployeeAllocationCalculator } from './EmployeeAllocationCalculator.js';

describe('EmployeeAllocationCalculator', () => {
  it('returns full efficiency when no workers are required', () => {
    expect(EmployeeAllocationCalculator.computeWorkerEfficiency(0, 0)).toBe(1);
  });

  it('returns zero efficiency when workers are required but none are assigned', () => {
    expect(EmployeeAllocationCalculator.computeWorkerEfficiency(0, 2)).toBe(0);
  });

  it('scales efficiency proportionally for partial staffing', () => {
    expect(EmployeeAllocationCalculator.computeWorkerEfficiency(1, 2)).toBe(0.5);
  });

  it('caps efficiency at one when overstaffed', () => {
    expect(EmployeeAllocationCalculator.computeWorkerEfficiency(5, 2)).toBe(1);
  });
});
