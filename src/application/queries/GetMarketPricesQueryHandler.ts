/**
 * @module @application/queries/GetMarketPricesQueryHandler
 *
 * Reads market prices without modifying aggregates.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createMarketId } from '../../domain/market/Market.js';
import { GLOBAL_MARKET_ID } from '../../domain/market/MarketConstants.js';
import type { ResourceMarketPrice } from '../../domain/market/ResourceMarketPrice.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { MarketPriceReadModel } from '../read-models/MarketPriceReadModel.js';
import type { GetMarketPricesQuery } from './GetMarketPricesQuery.js';

/** Dependencies required by {@link GetMarketPricesQueryHandler}. */
export type GetMarketPricesQueryHandlerDependencies = Pick<ApplicationContext, 'marketRepository'>;

/**
 * Returns read models for all listed market resource prices.
 */
export class GetMarketPricesQueryHandler {
  readonly #marketRepository: GetMarketPricesQueryHandlerDependencies['marketRepository'];

  /**
   * @param dependencies - Repository access for market lookup.
   */
  constructor(dependencies: GetMarketPricesQueryHandlerDependencies) {
    this.#marketRepository = dependencies.marketRepository;
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

    return Result.ok(Object.freeze(market.getPrices().map(mapMarketPrice)));
  }
}

function mapMarketPrice(price: ResourceMarketPrice): MarketPriceReadModel {
  return Object.freeze({
    resourceId: price.resourceId.value,
    basePrice: price.basePrice,
    lastPrice: price.lastPrice,
    tradeVolume: price.tradeVolume,
    updatedAt: price.updatedAt,
  });
}
