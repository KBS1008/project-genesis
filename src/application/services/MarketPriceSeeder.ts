/**
 * @module @application/services/MarketPriceSeeder
 *
 * Seeds regional market price books from loaded game content.
 */

import type { RegionRegistry } from '../../content/region/RegionRegistry.js';
import type { ResourceTypeRegistry } from '../../content/resource/ResourceTypeRegistry.js';
import type { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import { Market, createMarketId } from '../../domain/market/Market.js';
import { createRegionalMarketId } from '../../domain/market/MarketConstants.js';
import type { MarketRepository } from '../../domain/market/MarketRepository.js';

/** Dependencies for {@link MarketPriceSeeder}. */
export type MarketPriceSeederDependencies = {
  readonly marketRepository: MarketRepository;
  readonly clock: Clock;
};

/**
 * Initializes regional market prices from static resource and region definitions.
 */
export class MarketPriceSeeder {
  readonly #marketRepository: MarketRepository;
  readonly #clock: Clock;

  /**
   * @param dependencies - Repository and clock required for market seeding.
   */
  constructor(dependencies: { readonly marketRepository: MarketRepository; readonly clock: Clock }) {
    this.#marketRepository = dependencies.marketRepository;
    this.#clock = dependencies.clock;
  }

  /**
   * Seeds one regional market per enabled region when not yet initialized.
   */
  seed(
    resources: ResourceTypeRegistry,
    regions: RegionRegistry,
  ): Result<void, ValidationError> {
    const resourceSeeds = resources.getAll().map((resource) => ({
      id: resource.id,
      basePrice: resource.basePrice,
      enabled: resource.enabled,
      marketEnabled: resource.marketEnabled,
    }));

    for (const region of regions.getAll()) {
      if (!region.enabled) {
        continue;
      }

      const marketIdResult = createMarketId(createRegionalMarketId(region.id));

      if (!marketIdResult.ok) {
        return Result.fail(marketIdResult.error);
      }

      if (this.#marketRepository.findById(marketIdResult.value) !== undefined) {
        continue;
      }

      const marketResult = Market.seedFromResources({
        id: marketIdResult.value,
        regionId: region.id,
        resources: resourceSeeds,
        clock: this.#clock,
      });

      if (!marketResult.ok) {
        return Result.fail(marketResult.error);
      }

      this.#marketRepository.save(marketResult.value);
    }

    return Result.ok(undefined);
  }
}
