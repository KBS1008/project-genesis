import { ManualClock } from '../../common/time/ManualClock.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { CompanyBrain } from '../../domain/brain/CompanyBrain.js';
import { createCompanyBrainId } from '../../domain/brain/CompanyBrainId.js';
import { InMemoryCompanyBrainRepository } from './InMemoryCompanyBrainRepository.js';

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireCompanyBrainId(value: string) {
  const result = createCompanyBrainId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('InMemoryCompanyBrainRepository', () => {
  it('persists and retrieves brains by company id', () => {
    const repository = new InMemoryCompanyBrainRepository();
    const clock = new ManualClock(100);
    const brainResult = CompanyBrain.create({
      id: requireCompanyBrainId('brain_company_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(brainResult.ok).toBe(true);

    if (!brainResult.ok) {
      return;
    }

    repository.save(brainResult.value);

    expect(repository.findById(requireCompanyBrainId('brain_company_001'))).toBe(brainResult.value);
    expect(repository.findByCompanyId(requireCompanyId('company_001'))).toBe(brainResult.value);
    expect(repository.findAll()).toHaveLength(1);
  });

  it('returns brains in deterministic id order', () => {
    const repository = new InMemoryCompanyBrainRepository();
    const clock = new ManualClock(100);

    const brainBResult = CompanyBrain.create({
      id: requireCompanyBrainId('brain_company_b'),
      companyId: requireCompanyId('company_b'),
      clock,
    });

    const brainAResult = CompanyBrain.create({
      id: requireCompanyBrainId('brain_company_a'),
      companyId: requireCompanyId('company_a'),
      clock,
    });

    expect(brainBResult.ok).toBe(true);
    expect(brainAResult.ok).toBe(true);

    if (!brainBResult.ok || !brainAResult.ok) {
      return;
    }

    repository.save(brainBResult.value);
    repository.save(brainAResult.value);

    expect(repository.findAll().map((brain) => brain.getId().value)).toEqual([
      'brain_company_a',
      'brain_company_b',
    ]);
  });
});
