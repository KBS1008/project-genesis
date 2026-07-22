/**
 * @module @application/queries/GetMarketPricesQuery
 *
 * Input for retrieving regional market prices.
 */

/** Query to read listed resource market prices for a region. */
export type GetMarketPricesQuery = {
  readonly regionId?: string;
};
