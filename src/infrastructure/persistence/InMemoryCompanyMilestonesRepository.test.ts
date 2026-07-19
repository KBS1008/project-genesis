import { ManualClock } from '../../common/time/ManualClock.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { CompanyMilestones } from '../../domain/milestone/CompanyMilestones.js';
import { createCompanyMilestonesId } from '../../domain/milestone/CompanyMilestonesId.js';
import { createMilestoneId } from '../../domain/milestone/MilestoneId.js';
import { InMemoryCompanyMilestonesRepository } from './InMemoryCompanyMilestonesRepository.js';

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

function createMilestonesModule(id: string, companyId: string, clock = new ManualClock(100)) {
  const result = CompanyMilestones.create({
    id: requireCompanyMilestonesId(id),
    companyId: requireCompanyId(companyId),
    clock,
  });

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('InMemoryCompanyMilestonesRepository', () => {
  it('saves and retrieves milestone modules by id', () => {
    const repository = new InMemoryCompanyMilestonesRepository();
    const milestones = createMilestonesModule('milestones_company_001', 'company_001');

    repository.save(milestones);

    expect(repository.findById(requireCompanyMilestonesId('milestones_company_001'))).toBe(
      milestones,
    );
  });

  it('returns undefined when a milestone module id was not found', () => {
    const repository = new InMemoryCompanyMilestonesRepository();

    expect(
      repository.findById(requireCompanyMilestonesId('milestones_missing')),
    ).toBeUndefined();
  });

  it('finds the milestone module owned by a company', () => {
    const repository = new InMemoryCompanyMilestonesRepository();
    const milestones = createMilestonesModule('milestones_company_001', 'company_001');

    repository.save(milestones);

    expect(repository.findByCompanyId(requireCompanyId('company_001'))).toBe(milestones);
    expect(repository.findByCompanyId(requireCompanyId('company_002'))).toBeUndefined();
  });

  it('returns milestone modules in deterministic id order', () => {
    const repository = new InMemoryCompanyMilestonesRepository();
    const second = createMilestonesModule('milestones_company_002', 'company_002');
    const first = createMilestonesModule('milestones_company_001', 'company_001');

    repository.save(second);
    repository.save(first);

    expect(repository.findAll().map((milestones) => milestones.getId().value)).toEqual([
      'milestones_company_001',
      'milestones_company_002',
    ]);
  });

  it('overwrites an existing milestone module when saving the same id again', () => {
    const repository = new InMemoryCompanyMilestonesRepository();
    const clock = new ManualClock(100);
    const milestones = createMilestonesModule('milestones_company_001', 'company_001', clock);
    const milestoneIdResult = createMilestoneId('first_profit');

    expect(milestoneIdResult.ok).toBe(true);

    if (!milestoneIdResult.ok) {
      return;
    }

    milestones.completeMilestone(milestoneIdResult.value, clock);
    repository.save(milestones);

    const restored = createMilestonesModule('milestones_company_001', 'company_001', clock);
    repository.save(restored);

    expect(
      repository
        .findById(requireCompanyMilestonesId('milestones_company_001'))
        ?.hasCompletedMilestone('first_profit'),
    ).toBe(false);
  });
});
