import { ManualClock } from '../../common/time/ManualClock.js';
import { createCompanyId } from '../company/Company.js';
import { STARTING_MONEY } from './FinanceConstants.js';
import { FinanceAccount, createFinanceAccountId } from './FinanceAccount.js';
import { FinanceTransactionDirection } from './FinanceTransactionDirection.js';
import { FinanceTransactionType } from './FinanceTransactionType.js';
import { FinanceAccountCreated } from './events/FinanceAccountCreated.js';
import { FinanceTransactionRecorded } from './events/FinanceTransactionRecorded.js';

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

describe('FinanceAccount', () => {
  it('creates an account with starting capital and initial transaction', () => {
    const clock = new ManualClock(100);
    const result = FinanceAccount.create({
      id: requireFinanceAccountId('finance_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.getCashBalance()).toBe(STARTING_MONEY);
      expect(result.value.getReservedCash()).toBe(0);
      expect(result.value.getAvailableCash()).toBe(STARTING_MONEY);
      expect(result.value.getTransactions()).toHaveLength(1);
    }

    const events = result.ok ? result.value.pullDomainEvents() : [];
    expect(events.some((event) => event instanceof FinanceAccountCreated)).toBe(true);
    expect(events.some((event) => event instanceof FinanceTransactionRecorded)).toBe(true);
  });

  it('credits and debits available cash through transactions', () => {
    const clock = new ManualClock(100);
    const accountResult = FinanceAccount.create({
      id: requireFinanceAccountId('finance_001'),
      companyId: requireCompanyId('company_001'),
      startingBalance: 100,
      clock,
    });

    expect(accountResult.ok).toBe(true);

    if (!accountResult.ok) {
      return;
    }

    const account = accountResult.value;
    account.pullDomainEvents();

    account.credit(50, FinanceTransactionType.SALE, clock);
    account.debit(30, FinanceTransactionType.PURCHASE, clock);

    expect(account.getCashBalance()).toBe(120);
    expect(account.getAvailableCash()).toBe(120);
    expect(account.getTransactions()).toHaveLength(3);
  });

  it('reserves, releases, and consumes cash', () => {
    const clock = new ManualClock(100);
    const accountResult = FinanceAccount.create({
      id: requireFinanceAccountId('finance_001'),
      companyId: requireCompanyId('company_001'),
      startingBalance: 100,
      clock,
    });

    expect(accountResult.ok).toBe(true);

    if (!accountResult.ok) {
      return;
    }

    const account = accountResult.value;
    account.pullDomainEvents();

    account.reserveCash(40, clock);
    expect(account.getAvailableCash()).toBe(60);

    account.releaseReserved(10, clock);
    expect(account.getAvailableCash()).toBe(70);

    account.consumeReserved(20, FinanceTransactionType.BUILDING_COST, clock);

    expect(account.getCashBalance()).toBe(80);
    expect(account.getReservedCash()).toBe(10);
    expect(account.getAvailableCash()).toBe(70);
  });

  it('rejects debits above available cash', () => {
    const clock = new ManualClock(100);
    const accountResult = FinanceAccount.create({
      id: requireFinanceAccountId('finance_001'),
      companyId: requireCompanyId('company_001'),
      startingBalance: 100,
      clock,
    });

    expect(accountResult.ok).toBe(true);

    if (!accountResult.ok) {
      return;
    }

    const account = accountResult.value;
    account.reserveCash(60, clock);

    const debitResult = account.debit(50, FinanceTransactionType.PURCHASE, clock);

    expect(debitResult.ok).toBe(false);
    expect(account.getCashBalance()).toBe(100);
  });

  it('records reservation transactions with direction NONE', () => {
    const clock = new ManualClock(100);
    const accountResult = FinanceAccount.create({
      id: requireFinanceAccountId('finance_001'),
      companyId: requireCompanyId('company_001'),
      startingBalance: 100,
      clock,
    });

    expect(accountResult.ok).toBe(true);

    if (!accountResult.ok) {
      return;
    }

    const account = accountResult.value;
    account.pullDomainEvents();
    account.reserveCash(25, clock);

    const reservation = account.getTransactions().at(-1);

    expect(reservation?.direction).toBe(FinanceTransactionDirection.NONE);
    expect(reservation?.reservedCashDelta).toBe(25);
  });
});
