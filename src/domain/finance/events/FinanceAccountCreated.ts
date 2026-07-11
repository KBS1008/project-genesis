/**
 * @module @domain/finance/events/FinanceAccountCreated
 *
 * Domain event raised when a finance account is created.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/**
 * Indicates that a finance account was created for a company.
 */
export class FinanceAccountCreated extends DomainEvent {
  readonly eventName = 'FinanceAccountCreated';
  readonly financeId: string;
  readonly companyId: string;
  readonly startingBalance: number;
  readonly currency: string;

  /**
   * @param occurredAt - Simulation time when the account was created.
   * @param financeId - Finance account identifier value.
   * @param companyId - Owning company identifier value.
   * @param startingBalance - Initial cash balance.
   * @param currency - Account currency code.
   */
  constructor(
    occurredAt: number,
    financeId: string,
    companyId: string,
    startingBalance: number,
    currency: string,
  ) {
    super(occurredAt);
    this.financeId = financeId;
    this.companyId = companyId;
    this.startingBalance = startingBalance;
    this.currency = currency;
    this.freeze();
  }
}
