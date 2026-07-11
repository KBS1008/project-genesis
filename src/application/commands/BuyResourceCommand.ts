/**
 * @module @application/commands/BuyResourceCommand
 *
 * Input for buying resources at the current market price.
 */

/** Command to buy resources into company inventory. */
export type BuyResourceCommand = {
  readonly companyId: string;
  readonly resourceId: string;
  readonly amount: number;
};
