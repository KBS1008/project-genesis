/**
 * @module @domain/finance/events/FinanceTransactionRecorded
 *
 * Domain event raised when a finance transaction is recorded.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';
import type { FinanceTransactionDirection } from '../FinanceTransactionDirection.js';
import type { FinanceTransactionType } from '../FinanceTransactionType.js';

/**
 * Indicates that a finance transaction was recorded on an account.
 */
export class FinanceTransactionRecorded extends DomainEvent {
  readonly eventName = 'FinanceTransactionRecorded';
  readonly transactionId: string;
  readonly financeId: string;
  readonly companyId: string;
  readonly transactionType: FinanceTransactionType;
  readonly direction: FinanceTransactionDirection;
  readonly amount: number;
  readonly balanceAfter: number;
  readonly reservedCashDelta: number;

  /**
   * @param occurredAt - Simulation time when the transaction was recorded.
   * @param transactionId - Transaction identifier value.
   * @param financeId - Finance account identifier value.
   * @param companyId - Owning company identifier value.
   * @param transactionType - Transaction category.
   * @param direction - Cash flow direction.
   * @param amount - Transaction amount.
   * @param balanceAfter - Cash balance after the transaction.
   * @param reservedCashDelta - Change to reserved cash.
   */
  constructor(
    occurredAt: number,
    transactionId: string,
    financeId: string,
    companyId: string,
    transactionType: FinanceTransactionType,
    direction: FinanceTransactionDirection,
    amount: number,
    balanceAfter: number,
    reservedCashDelta: number,
  ) {
    super(occurredAt);
    this.transactionId = transactionId;
    this.financeId = financeId;
    this.companyId = companyId;
    this.transactionType = transactionType;
    this.direction = direction;
    this.amount = amount;
    this.balanceAfter = balanceAfter;
    this.reservedCashDelta = reservedCashDelta;
    this.freeze();
  }
}
