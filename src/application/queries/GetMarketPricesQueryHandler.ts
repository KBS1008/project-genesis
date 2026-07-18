/**
 * @module @application/queries/GetMarketPricesQueryHandler
 *
 * Reads market prices without modifying aggregates.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createMarketId } from '../../domain/market/Market.js';
import { GLOBAL_MARKET_ID } from '../../domain/market/MarketConstants.js';
import { aggregateResourceSupply } from '../../domain/market/MarketSupplyAggregator.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import { projectMarketPrice } from '../read-models/projectMarketPrice.js';
import type { MarketPriceReadModel } from '../read-models/MarketPriceReadModel.js';
import type { GetMarketPricesQuery } from './GetMarketPricesQuery.js';

/** Dependencies required by {@link GetMarketPricesQueryHandler}. */
export type GetMarketPricesQueryHandlerDependencies = Pick<
  ApplicationContext,
  'marketRepository' | 'inventoryRepository'
>;

/**
 * Returns read models for all listed market resource prices.
 */
export class GetMarketPricesQueryHandler {
  readonly #marketRepository: GetMarketPricesQueryHandlerDependencies['marketRepository'];
  readonly #inventoryRepository: GetMarketPricesQueryHandlerDependencies['inventoryRepository'];

  /**
   * @param dependencies - Repository access for market and inventory lookup.
   */
  constructor(dependencies: GetMarketPricesQueryHandlerDependencies) {
    this.#marketRepository = dependencies.marketRepository;
    this.#inventoryRepository = dependencies.inventoryRepository;
  }

  /**
   * Executes the get-market-prices query.
   */
  execute(_query: GetMarketPricesQuery = {}): Result<readonly MarketPriceReadModel[], ValidationError> {
    const marketIdResult = createMarketId(GLOBAL_MARKET_ID);

    if (!marketIdResult.ok) {
      return Result.fail(marketIdResult.error);
    }

    const market = this.#marketRepository.findById(marketIdResult.value);

    if (market === undefined) {
      return Result.fail(new ValidationError('Global market prices were not initialized.'));
    }

    const inventories = this.#inventoryRepository.findAll();

    return Result.ok(
      Object.freeze(
        market.getPrices().map((price) =>
          projectMarketPrice(
            price,
            aggregateResourceSupply(inventories, price.resourceId.value),
          ),
        ),
      ),
    );
  }
}
