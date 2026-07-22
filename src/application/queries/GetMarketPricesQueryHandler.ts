/**
 * @module @application/queries/GetMarketPricesQueryHandler
 *
 * Reads regional market prices without modifying aggregates.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { createMarketId } from '../../domain/market/Market.js';
import { createRegionalMarketId, GLOBAL_MARKET_ID } from '../../domain/market/MarketConstants.js';
import { aggregateRegionalResourceSupply } from '../../domain/market/MarketRegionalSupplyAggregator.js';
import type { MarketRepository } from '../../domain/market/MarketRepository.js';
import { DEFAULT_REGION_ID } from '../../domain/world/WorldConstants.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import { projectMarketPrice } from '../read-models/projectMarketPrice.js';
import type { MarketPriceReadModel } from '../read-models/MarketPriceReadModel.js';
import type { GetMarketPricesQuery } from './GetMarketPricesQuery.js';

/** Dependencies required by {@link GetMarketPricesQueryHandler}. */
export type GetMarketPricesQueryHandlerDependencies = Pick<
  ApplicationContext,
  'marketRepository' | 'buildingRepository' | 'buildingStorageRepository'
>;

/**
 * Returns read models for all listed regional market resource prices.
 */
export class GetMarketPricesQueryHandler {
  readonly #marketRepository: GetMarketPricesQueryHandlerDependencies['marketRepository'];
  readonly #buildingRepository: GetMarketPricesQueryHandlerDependencies['buildingRepository'];
  readonly #buildingStorageRepository: GetMarketPricesQueryHandlerDependencies['buildingStorageRepository'];

  /**
   * @param dependencies - Repository access for market and regional supply lookup.
   */
  constructor(dependencies: GetMarketPricesQueryHandlerDependencies) {
    this.#marketRepository = dependencies.marketRepository;
    this.#buildingRepository = dependencies.buildingRepository;
    this.#buildingStorageRepository = dependencies.buildingStorageRepository;
  }

  /**
   * Executes the get-market-prices query.
   */
  execute(
    query: GetMarketPricesQuery = {},
  ): Result<readonly MarketPriceReadModel[], ValidationError> {
    const regionId = query.regionId ?? DEFAULT_REGION_ID;
    const regionalMarketIdResult = createMarketId(createRegionalMarketId(regionId));

    if (!regionalMarketIdResult.ok) {
      return Result.fail(regionalMarketIdResult.error);
    }

    let market = this.#marketRepository.findById(regionalMarketIdResult.value);

    if (market === undefined && regionId === DEFAULT_REGION_ID) {
      const legacyMarketIdResult = createMarketId(GLOBAL_MARKET_ID);

      if (!legacyMarketIdResult.ok) {
        return Result.fail(legacyMarketIdResult.error);
      }

      market = this.#marketRepository.findById(legacyMarketIdResult.value);
    }

    if (market === undefined) {
      return Result.fail(
        new ValidationError(`Regional market prices for "${regionId}" were not initialized.`),
      );
    }

    const buildings = this.#buildingRepository.findAll();
    const buildingStorages = buildings.flatMap((building) => {
      const storage = this.#buildingStorageRepository.findByBuildingId(building.getId());

      return storage === undefined ? [] : [storage];
    });

    return Result.ok(
      Object.freeze(
        market
          .getPrices()
          .map((price) =>
            projectMarketPrice(
              price,
              aggregateRegionalResourceSupply(
                buildings,
                buildingStorages,
                regionId,
                price.resourceId.value,
              ),
            ),
          ),
      ),
    );
  }
}
