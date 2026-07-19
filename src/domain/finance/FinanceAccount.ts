/**
 * @module @domain/finance/FinanceAccount
 *
 * Finance aggregate managing company cash balances and ledger entries.
 *
 * @see docs/schemas/Finance.Schema.md
 * @see docs/schemas/FinanceTransaction.Schema.md
 */

import { AggregateRoot } from '../../common/core/AggregateRoot.js';
import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import { Guard } from '../../common/validation/Guard.js';
import type { CompanyId } from '../company/CompanyId.js';
import { DEFAULT_CURRENCY, Money } from '../shared/Money.js';
import type { FinanceAccountId } from './FinanceAccountId.js';
import { STARTING_MONEY } from './FinanceConstants.js';
import type { FinanceTransaction } from './FinanceTransaction.js';
import { FinanceTransactionDirection } from './FinanceTransactionDirection.js';
import type { FinanceTransactionId } from './FinanceTransactionId.js';
import { FinanceTransactionType } from './FinanceTransactionType.js';
import { FinanceAccountCreated } from './events/FinanceAccountCreated.js';
import { FinanceTransactionRecorded } from './events/FinanceTransactionRecorded.js';

/** Parameters required to create a new finance account. */
export type CreateFinanceAccountParams = {
  readonly id: FinanceAccountId;
  readonly companyId: CompanyId;
  readonly startingBalance?: number;
  readonly currency?: string;
  readonly clock: Clock;
};

/**
 * Company finance aggregate root.
 */
export class FinanceAccount extends AggregateRoot<'FinanceAccount'> {
  readonly #companyId: CompanyId;
  readonly #currency: string;
  readonly #createdAt: number;
  #cashBalance: Money;
  #reservedCash: Money;
  #lastTaxCollectedAt: number;
  readonly #transactions: FinanceTransaction[] = [];
  #transactionSequence = 0;

  private constructor(
    params: {
      id: FinanceAccountId;
      companyId: CompanyId;
      currency: string;
      createdAt: number;
      cashBalance: Money;
      reservedCash: Money;
      lastTaxCollectedAt: number;
      transactions: readonly FinanceTransaction[];
      transactionSequence: number;
    },
    restoring = false,
  ) {
    super(params.id);
    this.#companyId = params.companyId;
    this.#currency = params.currency;
    this.#createdAt = params.createdAt;
    this.#cashBalance = params.cashBalance;
    this.#reservedCash = params.reservedCash;
    this.#lastTaxCollectedAt = params.lastTaxCollectedAt;
    this.#transactions.push(...params.transactions);
    this.#transactionSequence = params.transactionSequence;

    void restoring;
  }

  /**
   * Creates a finance account with optional starting capital.
   */
  static create(params: CreateFinanceAccountParams): Result<FinanceAccount, ValidationError> {
    const startingBalance = params.startingBalance ?? STARTING_MONEY;
    const balanceResult = Guard.againstNegative(
      startingBalance,
      'Starting finance balance must not be negative.',
    );

    if (!balanceResult.ok) {
      return Result.fail(balanceResult.error);
    }

    const currency = params.currency ?? DEFAULT_CURRENCY;
    const currencyResult = Guard.againstEmptyString(
      currency,
      'Finance currency must not be empty.',
    );

    if (!currencyResult.ok) {
      return Result.fail(currencyResult.error);
    }

    const cashBalanceResult = Money.create(balanceResult.value, currencyResult.value);

    if (!cashBalanceResult.ok) {
      return Result.fail(cashBalanceResult.error);
    }

    const reservedCashResult = Money.zero(currencyResult.value);

    if (!reservedCashResult.ok) {
      return Result.fail(reservedCashResult.error);
    }

    const createdAt = params.clock.now();
    const account = new FinanceAccount({
      id: params.id,
      companyId: params.companyId,
      currency: currencyResult.value,
      createdAt,
      cashBalance: cashBalanceResult.value,
      reservedCash: reservedCashResult.value,
      lastTaxCollectedAt: createdAt,
      transactions: [],
      transactionSequence: 0,
    });

    account.addDomainEvent(
      new FinanceAccountCreated(
        createdAt,
        params.id.value,
        params.companyId.value,
        balanceResult.value,
        currencyResult.value,
      ),
    );

    if (balanceResult.value > 0) {
      const transactionResult = account.#recordTransaction({
        transactionType: FinanceTransactionType.SYSTEM,
        direction: FinanceTransactionDirection.IN,
        amount: balanceResult.value,
        balanceBefore: 0,
        balanceAfter: balanceResult.value,
        reservedCashDelta: 0,
        clock: params.clock,
      });

      if (!transactionResult.ok) {
        return Result.fail(transactionResult.error);
      }
    }

    return Result.ok(account);
  }

  /**
   * Rehydrates a finance account from a persisted snapshot without raising events.
   */
  static restore(params: {
    readonly id: FinanceAccountId;
    readonly companyId: CompanyId;
    readonly currency: string;
    readonly createdAt: number;
    readonly cashBalance: number;
    readonly reservedCash: number;
    readonly lastTaxCollectedAt?: number;
    readonly transactionSequence: number;
    readonly transactions: readonly FinanceTransaction[];
  }): Result<FinanceAccount, ValidationError> {
    const balanceResult = Guard.againstNegative(
      params.cashBalance,
      'Finance cash balance must not be negative.',
    );

    if (!balanceResult.ok) {
      return Result.fail(balanceResult.error);
    }

    const reservedResult = Guard.againstNegative(
      params.reservedCash,
      'Reserved cash must not be negative.',
    );

    if (!reservedResult.ok) {
      return Result.fail(reservedResult.error);
    }

    if (params.reservedCash > params.cashBalance) {
      return Result.fail(new ValidationError('Reserved cash cannot exceed cash balance.'));
    }

    const sequenceResult = Guard.againstNegative(
      params.transactionSequence,
      'Finance transaction sequence must not be negative.',
    );

    if (!sequenceResult.ok) {
      return Result.fail(sequenceResult.error);
    }

    const currencyResult = Guard.againstEmptyString(
      params.currency,
      'Finance currency must not be empty.',
    );

    if (!currencyResult.ok) {
      return Result.fail(currencyResult.error);
    }

    const cashBalanceResult = Money.create(balanceResult.value, currencyResult.value);

    if (!cashBalanceResult.ok) {
      return Result.fail(cashBalanceResult.error);
    }

    const reservedCashResult = Money.create(reservedResult.value, currencyResult.value);

    if (!reservedCashResult.ok) {
      return Result.fail(reservedCashResult.error);
    }

    return Result.ok(
      new FinanceAccount(
        {
          id: params.id,
          companyId: params.companyId,
          currency: currencyResult.value,
          createdAt: params.createdAt,
          cashBalance: cashBalanceResult.value,
          reservedCash: reservedCashResult.value,
          lastTaxCollectedAt: params.lastTaxCollectedAt ?? params.createdAt,
          transactions: params.transactions,
          transactionSequence: sequenceResult.value,
        },
        true,
      ),
    );
  }

  /** The owning company identifier. */
  getCompanyId(): CompanyId {
    return this.#companyId;
  }

  /** Account currency code. */
  getCurrency(): string {
    return this.#currency;
  }

  /** Simulation time when the account was created. */
  getCreatedAt(): number {
    return this.#createdAt;
  }

  /** Simulation time when corporate tax was last collected. */
  getLastTaxCollectedAt(): number {
    return this.#lastTaxCollectedAt;
  }

  /** Marks the current simulation time as the end of the latest tax period. */
  closeTaxPeriod(clock: Clock): void {
    this.#lastTaxCollectedAt = clock.now();
  }

  /** Current cash balance. */
  getCashBalance(): number {
    return this.#cashBalance.amount;
  }

  /** Currently reserved cash. */
  getReservedCash(): number {
    return this.#reservedCash.amount;
  }

  /** Cash available for spending after reservations. */
  getAvailableCash(): number {
    const availableResult = this.#getAvailableMoney();

    return availableResult.ok ? availableResult.value.amount : 0;
  }

  /** Returns recorded transactions in creation order. */
  getTransactions(): readonly FinanceTransaction[] {
    return Object.freeze([...this.#transactions]);
  }

  /** Returns the last assigned finance transaction sequence number. */
  getTransactionSequence(): number {
    return this.#transactionSequence;
  }

  /**
   * Credits cash to the account.
   */
  credit(
    amount: number,
    transactionType: FinanceTransactionType,
    clock: Clock,
  ): Result<void, ValidationError> {
    const amountResult = Guard.againstNegative(amount, 'Credited amount must not be negative.');

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    if (amountResult.value === 0) {
      return Result.ok(undefined);
    }

    const amountMoneyResult = this.#money(amountResult.value);

    if (!amountMoneyResult.ok) {
      return Result.fail(amountMoneyResult.error);
    }

    const balanceBefore = this.#cashBalance.amount;
    const newBalanceResult = this.#cashBalance.add(amountMoneyResult.value);

    if (!newBalanceResult.ok) {
      return Result.fail(newBalanceResult.error);
    }

    this.#cashBalance = newBalanceResult.value;

    return this.#recordTransaction({
      transactionType,
      direction: FinanceTransactionDirection.IN,
      amount: amountResult.value,
      balanceBefore,
      balanceAfter: this.#cashBalance.amount,
      reservedCashDelta: 0,
      clock,
    });
  }

  /**
   * Debits available cash from the account.
   */
  debit(
    amount: number,
    transactionType: FinanceTransactionType,
    clock: Clock,
  ): Result<void, ValidationError> {
    const amountResult = Guard.againstNegative(amount, 'Debited amount must not be negative.');

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    if (amountResult.value === 0) {
      return Result.ok(undefined);
    }

    const amountMoneyResult = this.#money(amountResult.value);

    if (!amountMoneyResult.ok) {
      return Result.fail(amountMoneyResult.error);
    }

    const availableResult = this.#getAvailableMoney();

    if (!availableResult.ok) {
      return Result.fail(availableResult.error);
    }

    if (availableResult.value.isLessThan(amountMoneyResult.value)) {
      return Result.fail(new ValidationError('Insufficient available cash for debit.'));
    }

    const balanceBefore = this.#cashBalance.amount;
    const newBalanceResult = this.#cashBalance.subtract(amountMoneyResult.value);

    if (!newBalanceResult.ok) {
      return Result.fail(newBalanceResult.error);
    }

    this.#cashBalance = newBalanceResult.value;

    return this.#recordTransaction({
      transactionType,
      direction: FinanceTransactionDirection.OUT,
      amount: amountResult.value,
      balanceBefore,
      balanceAfter: this.#cashBalance.amount,
      reservedCashDelta: 0,
      clock,
    });
  }

  /**
   * Reserves available cash for downstream spending flows.
   */
  reserveCash(amount: number, clock: Clock): Result<void, ValidationError> {
    const amountResult = Guard.againstNegative(
      amount,
      'Reserved cash amount must not be negative.',
    );

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    if (amountResult.value === 0) {
      return Result.ok(undefined);
    }

    const amountMoneyResult = this.#money(amountResult.value);

    if (!amountMoneyResult.ok) {
      return Result.fail(amountMoneyResult.error);
    }

    const availableResult = this.#getAvailableMoney();

    if (!availableResult.ok) {
      return Result.fail(availableResult.error);
    }

    if (availableResult.value.isLessThan(amountMoneyResult.value)) {
      return Result.fail(new ValidationError('Insufficient available cash for reservation.'));
    }

    const balanceBefore = this.#cashBalance.amount;
    const newReservedResult = this.#reservedCash.add(amountMoneyResult.value);

    if (!newReservedResult.ok) {
      return Result.fail(newReservedResult.error);
    }

    this.#reservedCash = newReservedResult.value;

    return this.#recordTransaction({
      transactionType: FinanceTransactionType.SYSTEM,
      direction: FinanceTransactionDirection.NONE,
      amount: amountResult.value,
      balanceBefore,
      balanceAfter: this.#cashBalance.amount,
      reservedCashDelta: amountResult.value,
      clock,
    });
  }

  /**
   * Releases previously reserved cash without changing total balance.
   */
  releaseReserved(amount: number, clock: Clock): Result<void, ValidationError> {
    const amountResult = Guard.againstNegative(
      amount,
      'Released cash amount must not be negative.',
    );

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    if (amountResult.value === 0) {
      return Result.ok(undefined);
    }

    const amountMoneyResult = this.#money(amountResult.value);

    if (!amountMoneyResult.ok) {
      return Result.fail(amountMoneyResult.error);
    }

    if (this.#reservedCash.isLessThan(amountMoneyResult.value)) {
      return Result.fail(new ValidationError('Cannot release more cash than reserved.'));
    }

    const balanceBefore = this.#cashBalance.amount;
    const newReservedResult = this.#reservedCash.subtract(amountMoneyResult.value);

    if (!newReservedResult.ok) {
      return Result.fail(newReservedResult.error);
    }

    this.#reservedCash = newReservedResult.value;

    return this.#recordTransaction({
      transactionType: FinanceTransactionType.SYSTEM,
      direction: FinanceTransactionDirection.NONE,
      amount: amountResult.value,
      balanceBefore,
      balanceAfter: this.#cashBalance.amount,
      reservedCashDelta: -amountResult.value,
      clock,
    });
  }

  /**
   * Consumes previously reserved cash from the account balance.
   */
  consumeReserved(
    amount: number,
    transactionType: FinanceTransactionType,
    clock: Clock,
  ): Result<void, ValidationError> {
    const amountResult = Guard.againstNegative(
      amount,
      'Consumed cash amount must not be negative.',
    );

    if (!amountResult.ok) {
      return Result.fail(amountResult.error);
    }

    if (amountResult.value === 0) {
      return Result.ok(undefined);
    }

    const amountMoneyResult = this.#money(amountResult.value);

    if (!amountMoneyResult.ok) {
      return Result.fail(amountMoneyResult.error);
    }

    if (
      this.#reservedCash.isLessThan(amountMoneyResult.value) ||
      this.#cashBalance.isLessThan(amountMoneyResult.value)
    ) {
      return Result.fail(new ValidationError('Cannot consume more cash than reserved.'));
    }

    const balanceBefore = this.#cashBalance.amount;
    const newBalanceResult = this.#cashBalance.subtract(amountMoneyResult.value);

    if (!newBalanceResult.ok) {
      return Result.fail(newBalanceResult.error);
    }

    const newReservedResult = this.#reservedCash.subtract(amountMoneyResult.value);

    if (!newReservedResult.ok) {
      return Result.fail(newReservedResult.error);
    }

    this.#cashBalance = newBalanceResult.value;
    this.#reservedCash = newReservedResult.value;

    return this.#recordTransaction({
      transactionType,
      direction: FinanceTransactionDirection.OUT,
      amount: amountResult.value,
      balanceBefore,
      balanceAfter: this.#cashBalance.amount,
      reservedCashDelta: -amountResult.value,
      clock,
    });
  }

  #money(amount: number): Result<Money, ValidationError> {
    return Money.create(amount, this.#currency);
  }

  #getAvailableMoney(): Result<Money, ValidationError> {
    return this.#cashBalance.subtract(this.#reservedCash);
  }

  #recordTransaction(params: {
    transactionType: FinanceTransactionType;
    direction: FinanceTransactionDirection;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    reservedCashDelta: number;
    clock: Clock;
  }): Result<void, ValidationError> {
    this.#transactionSequence += 1;
    const transactionIdResult = createFinanceTransactionId(
      `${this.getId().value}_tx_${this.#transactionSequence}`,
    );

    if (!transactionIdResult.ok) {
      return Result.fail(transactionIdResult.error);
    }

    const transaction: FinanceTransaction = Object.freeze({
      id: transactionIdResult.value,
      financeId: this.getId().value,
      companyId: this.#companyId.value,
      transactionType: params.transactionType,
      direction: params.direction,
      amount: params.amount,
      balanceBefore: params.balanceBefore,
      balanceAfter: params.balanceAfter,
      reservedCashDelta: params.reservedCashDelta,
      timestamp: params.clock.now(),
    });

    this.#transactions.push(transaction);
    this.addDomainEvent(
      new FinanceTransactionRecorded(
        transaction.timestamp,
        transaction.id.value,
        transaction.financeId,
        transaction.companyId,
        transaction.transactionType,
        transaction.direction,
        transaction.amount,
        transaction.balanceAfter,
        transaction.reservedCashDelta,
      ),
    );

    return Result.ok(undefined);
  }
}

/** Creates a validated finance account identifier from a raw string. */
export function createFinanceAccountId(
  rawValue: string,
): Result<FinanceAccountId, ValidationError> {
  const result = Identifier.create<FinanceAccountId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}

/** Creates a validated finance transaction identifier from a raw string. */
export function createFinanceTransactionId(
  rawValue: string,
): Result<FinanceTransactionId, ValidationError> {
  const result = Identifier.create<FinanceTransactionId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
