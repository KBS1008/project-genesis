/**
 * @module @application/services/MarketPriceSeeder
 *
 * Seeds the global market price book from loaded game content.
 */

import type { ResourceTypeRegistry } from '../../content/resource/ResourceTypeRegistry.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import { Market, createMarketId } from '../../domain/market/Market.js';
import { GLOBAL_MARKET_ID } from '../../domain/market/MarketConstants.js';
import type { MarketRepository } from '../../domain/market/MarketRepository.js';

/** Dependencies for {@link MarketPriceSeeder}. */
export type MarketPriceSeederDependencies = {
  readonly marketRepository: MarketRepository;
  readonly clock: Clock;
};

/**
 * Initializes market prices from static resource definitions.
 */
export class MarketPriceSeeder {
  readonly #marketRepository: MarketPriceSeederDependencies['marketRepository'];
  readonly #clock: MarketPriceSeederDependencies['clock'];

  /**
   * @param dependencies - Repository and clock required for market seeding.
   */
  constructor(dependencies: MarketPriceSeederDependencies) {
    this.#marketRepository = dependencies.marketRepository;
    this.#clock = dependencies.clock;
  }

  /**
   * Seeds the global market when it has not been initialized yet.
   */
  seed(resources: ResourceTypeRegistry): Result<void, ValidationError> {
    const marketIdResult = createMarketId(GLOBAL_MARKET_ID);

    if (!marketIdResult.ok) {
      return Result.fail(marketIdResult.error);
    }

    if (this.#marketRepository.findById(marketIdResult.value) !== undefined) {
      return Result.ok(undefined);
    }

    const marketResult = Market.seedFromResources({
      id: marketIdResult.value,
      resources: resources.getAll().map((resource) => ({
        id: resource.id,
        basePrice: resource.basePrice,
        enabled: resource.enabled,
        marketEnabled: resource.marketEnabled,
      })),
      clock: this.#clock,
    });

    if (!marketResult.ok) {
      return Result.fail(marketResult.error);
    }

    this.#marketRepository.save(marketResult.value);

    return Result.ok(undefined);
  }
}
