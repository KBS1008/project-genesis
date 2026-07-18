import { ManualClock } from '../../common/time/ManualClock.js';
import { createCompanyId } from '../company/Company.js';
import { FinanceAccount, createFinanceAccountId } from './FinanceAccount.js';
import { FinanceTransactionType } from './FinanceTransactionType.js';
import { TaxCalculator } from './TaxCalculator.js';

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireFinanceAccountId(value: string) {
  const result = createFinanceAccountId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('TaxCalculator', () => {
  it('computes tax on operating profit since the last collection timestamp', () => {
    const clock = new ManualClock(100);
    const accountResult = FinanceAccount.create({
      id: requireFinanceAccountId('finance_001'),
      companyId: requireCompanyId('company_001'),
      startingBalance: 0,
      clock,
    });

    expect(accountResult.ok).toBe(true);

    if (!accountResult.ok) {
      return;
    }

    const account = accountResult.value;
    account.pullDomainEvents();
    clock.advance(1);
    account.credit(1_000, FinanceTransactionType.SALE, clock);
    account.debit(400, FinanceTransactionType.PURCHASE, clock);
    account.debit(100, FinanceTransactionType.MARKET_FEE, clock);

    const taxableProfit = TaxCalculator.computeTaxableProfit(
      account.getTransactions(),
      account.getLastTaxCollectedAt(),
    );
    const taxAmount = TaxCalculator.computeTaxAmount(taxableProfit);

    expect(taxableProfit).toBe(500);
    expect(taxAmount).toBe(25);
  });

  it('marks tax payment as blocked when an overdue assessment exceeds available cash', () => {
    const clock = new ManualClock(0);
    const accountResult = FinanceAccount.create({
      id: requireFinanceAccountId('finance_001'),
      companyId: requireCompanyId('company_001'),
      startingBalance: 0,
      clock,
    });

    expect(accountResult.ok).toBe(true);

    if (!accountResult.ok) {
      return;
    }

    const account = accountResult.value;
    account.pullDomainEvents();
    clock.advance(30);
    account.credit(500, FinanceTransactionType.SALE, clock);
    account.debit(495, FinanceTransactionType.ADMIN, clock);

    const assessment = TaxCalculator.assessPendingTaxCollection({
      transactions: account.getTransactions(),
      lastTaxCollectedAt: account.getLastTaxCollectedAt(),
      availableCash: account.getAvailableCash(),
      currentSimulationTime: clock.now(),
    });

    expect(assessment.pendingTaxAmount).toBeGreaterThan(0);
    expect(account.getAvailableCash()).toBeLessThan(assessment.pendingTaxAmount);
    expect(assessment.taxPaymentBlocked).toBe(true);
  });

  it('does not mark tax payment as blocked before the first assessment interval elapses', () => {
    const clock = new ManualClock(0);
    const accountResult = FinanceAccount.create({
      id: requireFinanceAccountId('finance_001'),
      companyId: requireCompanyId('company_001'),
      startingBalance: 0,
      clock,
    });

    expect(accountResult.ok).toBe(true);

    if (!accountResult.ok) {
      return;
    }

    const account = accountResult.value;
    account.pullDomainEvents();
    clock.advance(15);
    account.credit(500, FinanceTransactionType.SALE, clock);

    const assessment = TaxCalculator.assessPendingTaxCollection({
      transactions: account.getTransactions(),
      lastTaxCollectedAt: account.getLastTaxCollectedAt(),
      availableCash: account.getAvailableCash(),
      currentSimulationTime: clock.now(),
    });

    expect(assessment.pendingTaxAmount).toBeGreaterThan(0);
    expect(assessment.taxPaymentBlocked).toBe(false);
  });

  it('clears blocked tax state after a successful assessment closes the period', () => {
    const clock = new ManualClock(0);
    const accountResult = FinanceAccount.create({
      id: requireFinanceAccountId('finance_001'),
      companyId: requireCompanyId('company_001'),
      startingBalance: 10_000,
      clock,
    });

    expect(accountResult.ok).toBe(true);

    if (!accountResult.ok) {
      return;
    }

    const account = accountResult.value;
    account.pullDomainEvents();
    clock.advance(30);
    account.credit(1_000, FinanceTransactionType.SALE, clock);
    account.debit(400, FinanceTransactionType.PURCHASE, clock);
    account.debit(
      TaxCalculator.computeTaxAmount(
        TaxCalculator.computeTaxableProfit(
          account.getTransactions(),
          account.getLastTaxCollectedAt(),
        ),
      ),
      FinanceTransactionType.TAX,
      clock,
    );
    account.closeTaxPeriod(clock);
    clock.advance(10);
    account.credit(200, FinanceTransactionType.SALE, clock);

    const assessment = TaxCalculator.assessPendingTaxCollection({
      transactions: account.getTransactions(),
      lastTaxCollectedAt: account.getLastTaxCollectedAt(),
      availableCash: account.getAvailableCash(),
      currentSimulationTime: clock.now(),
    });

    expect(assessment.pendingTaxAmount).toBeGreaterThan(0);
    expect(assessment.taxPaymentBlocked).toBe(false);
  });
});
