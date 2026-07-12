/**
 * @module @domain/milestone/CompanyMilestones.test
 *
 * Unit tests for {@link CompanyMilestones}.
 */

import { ManualClock } from '../../common/time/ManualClock.js';
import { createCompanyId } from '../company/Company.js';
import { CompanyMilestones } from './CompanyMilestones.js';
import { createCompanyMilestonesId } from './CompanyMilestonesId.js';
import { createMilestoneId } from './MilestoneId.js';
import { CompanyMilestoneReached } from './events/CompanyMilestoneReached.js';

function requireCompanyMilestonesId(value: string) {
  const result = createCompanyMilestonesId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireMilestoneId(value: string) {
  const result = createMilestoneId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('CompanyMilestones', () => {
  it('creates empty company milestones state', () => {
    const clock = new ManualClock(100);
    const result = CompanyMilestones.create({
      id: requireCompanyMilestonesId('milestones_company_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.getCompletedMilestones()).toEqual([]);
    }
  });

  it('completes a milestone and raises CompanyMilestoneReached', () => {
    const clock = new ManualClock(100);
    const createResult = CompanyMilestones.create({
      id: requireCompanyMilestonesId('milestones_company_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(createResult.ok).toBe(true);

    if (!createResult.ok) {
      return;
    }

    const completeResult = createResult.value.completeMilestone(
      requireMilestoneId('first_profit'),
      clock,
    );

    expect(completeResult.ok).toBe(true);
    expect(createResult.value.hasCompletedMilestone('first_profit')).toBe(true);

    const events = createResult.value.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(CompanyMilestoneReached);
  });
});
