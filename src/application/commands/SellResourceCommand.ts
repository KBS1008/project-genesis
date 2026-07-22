/**
 * @module @application/commands/SellResourceCommand
 *
 * Input for selling resources at the current market price.
 */

/** Command to sell resources from company inventory. */
export type SellResourceCommand = {
  readonly companyId: string;
  readonly resourceId: string;
  readonly amount: number;
  readonly regionId?: string;
};
