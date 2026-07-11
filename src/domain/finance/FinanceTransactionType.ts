/**
 * @module @domain/finance/FinanceTransactionType
 *
 * Categories of finance ledger entries.
 *
 * @see docs/schemas/FinanceTransaction.Schema.md
 */

/** Supported finance transaction categories for version 1. */
export enum FinanceTransactionType {
  SALE = 'SALE',
  PURCHASE = 'PURCHASE',
  PRODUCTION_COST = 'PRODUCTION_COST',
  BUILDING_COST = 'BUILDING_COST',
  BUILDING_REFUND = 'BUILDING_REFUND',
  RESEARCH_COST = 'RESEARCH_COST',
  RESEARCH_REWARD = 'RESEARCH_REWARD',
  MAINTENANCE = 'MAINTENANCE',
  SALARY = 'SALARY',
  LOAN_RECEIVED = 'LOAN_RECEIVED',
  LOAN_PAYMENT = 'LOAN_PAYMENT',
  INTEREST = 'INTEREST',
  MARKET_FEE = 'MARKET_FEE',
  TRANSPORT_COST = 'TRANSPORT_COST',
  CONTRACT_PAYMENT = 'CONTRACT_PAYMENT',
  NPC_REWARD = 'NPC_REWARD',
  TAX = 'TAX',
  ADMIN = 'ADMIN',
  SYSTEM = 'SYSTEM',
}
