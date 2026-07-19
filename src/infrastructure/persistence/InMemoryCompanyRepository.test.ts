import { ManualClock } from '../../common/time/ManualClock.js';
import { Company, createCompanyId, createPlayerId } from '../../domain/company/Company.js';
import { InMemoryCompanyRepository } from './InMemoryCompanyRepository.js';

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requirePlayerId(value: string) {
  const result = createPlayerId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('InMemoryCompanyRepository', () => {
  it('saves and retrieves companies by id', () => {
    const repository = new InMemoryCompanyRepository();
    const clock = new ManualClock(100);
    const companyResult = Company.create({
      id: requireCompanyId('company_001'),
      name: 'Genesis Corp',
      ownerId: requirePlayerId('player_001'),
      clock,
    });

    expect(companyResult.ok).toBe(true);

    if (!companyResult.ok) {
      return;
    }

    repository.save(companyResult.value);

    expect(repository.findById(requireCompanyId('company_001'))).toBe(companyResult.value);
    expect(repository.findById(requireCompanyId('company_missing'))).toBeUndefined();
  });

  it('returns companies in deterministic id order', () => {
    const repository = new InMemoryCompanyRepository();
    const clock = new ManualClock(100);

    const second = Company.create({
      id: requireCompanyId('company_002'),
      name: 'Second Corp',
      ownerId: requirePlayerId('player_001'),
      clock,
    });
    const first = Company.create({
      id: requireCompanyId('company_001'),
      name: 'First Corp',
      ownerId: requirePlayerId('player_001'),
      clock,
    });

    if (!second.ok || !first.ok) {
      throw new Error('Expected valid companies.');
    }

    repository.save(second.value);
    repository.save(first.value);

    expect(repository.findAll().map((company) => company.getId().value)).toEqual([
      'company_001',
      'company_002',
    ]);
  });

  it('overwrites an existing company when saving the same id again', () => {
    const repository = new InMemoryCompanyRepository();
    const clock = new ManualClock(100);
    const firstResult = Company.create({
      id: requireCompanyId('company_001'),
      name: 'First Corp',
      ownerId: requirePlayerId('player_001'),
      clock,
    });
    const secondResult = Company.create({
      id: requireCompanyId('company_001'),
      name: 'Second Corp',
      ownerId: requirePlayerId('player_001'),
      clock,
    });

    expect(firstResult.ok && secondResult.ok).toBe(true);

    if (!firstResult.ok || !secondResult.ok) {
      return;
    }

    repository.save(firstResult.value);
    repository.save(secondResult.value);

    expect(repository.findById(requireCompanyId('company_001'))?.getName()).toBe('Second Corp');
  });
});
