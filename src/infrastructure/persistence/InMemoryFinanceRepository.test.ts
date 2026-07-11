import { ManualClock } from '../../common/time/ManualClock.js';
import { createCompanyId } from '../../domain/company/Company.js';
import {
  FinanceAccount,
  createFinanceAccountId,
} from '../../domain/finance/FinanceAccount.js';
import { InMemoryFinanceRepository } from './InMemoryFinanceRepository.js';

function requireFinanceAccountId(value: string) {
  const result = createFinanceAccountId(value);

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

describe('InMemoryFinanceRepository', () => {
  it('saves and finds finance accounts by id and company', () => {
    const repository = new InMemoryFinanceRepository();
    const clock = new ManualClock(100);
    const accountResult = FinanceAccount.create({
      id: requireFinanceAccountId('finance_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(accountResult.ok).toBe(true);

    if (!accountResult.ok) {
      return;
    }

    repository.save(accountResult.value);

    expect(repository.findById(requireFinanceAccountId('finance_001'))).toBeDefined();
    expect(repository.findByCompanyId(requireCompanyId('company_001'))).toBeDefined();
    expect(repository.findAll()).toHaveLength(1);
  });
});
