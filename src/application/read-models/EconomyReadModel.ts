/**
 * @module @application/read-models/EconomyReadModel
 *
 * Economy KPIs and active supply contracts for the dashboard shell.
 */

/** One active supply contract shown in the dashboard. */
export type SupplyContractReadModel = {
  readonly id: string;
  readonly kind: string;
  readonly resourceId: string;
  readonly amount: number;
  readonly paymentAmount: number;
  readonly intervalTicks: number;
  readonly active: boolean;
  readonly lastFulfilledTick: number;
};

/** Economy-wide indicators and company contracts. */
export type EconomyReadModel = {
  readonly corporateTaxRate: number;
  readonly taxIntervalTicks: number;
  readonly priceIndex: number;
  readonly activeContractCount: number;
  readonly contracts: readonly SupplyContractReadModel[];
};
