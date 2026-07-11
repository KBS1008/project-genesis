/**
 * @module @domain/market/Market
 *
 * Market aggregate holding global resource price snapshots.
 *
 * @see docs/gameplay/market.md
 */

import { AggregateRoot } from '../../common/core/AggregateRoot.js';
import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import { Guard } from '../../common/validation/Guard.js';
import { createResourceTypeId } from '../shared/ResourceTypeId.js';
import type { MarketId } from './MarketId.js';
import type { ResourceMarketPrice } from './ResourceMarketPrice.js';
import { MarketPriceChanged } from './events/MarketPriceChanged.js';

/** Static resource data used to seed market prices. */
export type MarketResourceSeed = {
  readonly id: string;
  readonly basePrice: number;
  readonly enabled: boolean;
  readonly marketEnabled: boolean;
};

/** Parameters required to seed a market from static resource content. */
export type SeedMarketParams = {
  readonly id: MarketId;
  readonly resources: readonly MarketResourceSeed[];
  readonly clock: Clock;
};

/**
 * Global market aggregate root tracking resource prices.
 */
export class Market extends AggregateRoot<'Market'> {
  readonly #createdAt: number;
  readonly #prices = new Map<string, ResourceMarketPrice>();

  private constructor(params: { id: MarketId; createdAt: number }) {
    super(params.id);
    this.#createdAt = params.createdAt;
  }

  /**
   * Seeds market prices from enabled, market-enabled resource definitions.
   */
  static seedFromResources(params: SeedMarketParams): Result<Market, ValidationError> {
    const createdAt = params.clock.now();
    const market = new Market({ id: params.id, createdAt });

    for (const resource of params.resources) {
      if (!resource.enabled || !resource.marketEnabled) {
        continue;
      }

      const resourceIdResult = createResourceTypeId(resource.id);

      if (!resourceIdResult.ok) {
        return Result.fail(resourceIdResult.error);
      }

      const priceEntry: ResourceMarketPrice = Object.freeze({
        resourceId: resourceIdResult.value,
        basePrice: resource.basePrice,
        lastPrice: resource.basePrice,
        tradeVolume: 0,
        updatedAt: createdAt,
      });

      market.#prices.set(resource.id, priceEntry);
    }

    return Result.ok(market);
  }

  /** Simulation time when the market was created. */
  getCreatedAt(): number {
    return this.#createdAt;
  }

  /** Returns all resource prices in deterministic resource id order. */
  getPrices(): readonly ResourceMarketPrice[] {
    return Object.freeze(
      [...this.#prices.values()].sort((left, right) =>
        left.resourceId.value.localeCompare(right.resourceId.value),
      ),
    );
  }

  /** Returns one resource price or undefined when the resource is not listed. */
  getPrice(resourceId: string): ResourceMarketPrice | undefined {
    return this.#prices.get(resourceId);
  }

  /**
   * Updates the last traded price for a resource.
   */
  updateLastPrice(
    resourceId: string,
    lastPrice: number,
    tradeVolumeDelta: number,
    clock: Clock,
  ): Result<void, ValidationError> {
    const priceResult = Guard.againstNegative(lastPrice, 'Market price must not be negative.');

    if (!priceResult.ok) {
      return Result.fail(priceResult.error);
    }

    const volumeResult = Guard.againstNegative(
      tradeVolumeDelta,
      'Trade volume delta must not be negative.',
    );

    if (!volumeResult.ok) {
      return Result.fail(volumeResult.error);
    }

    const existing = this.#prices.get(resourceId);

    if (existing === undefined) {
      return Result.fail(new ValidationError(`Resource "${resourceId}" is not listed on the market.`));
    }

    const previousPrice = existing.lastPrice;
    const nextEntry: ResourceMarketPrice = Object.freeze({
      resourceId: existing.resourceId,
      basePrice: existing.basePrice,
      lastPrice: priceResult.value,
      tradeVolume: existing.tradeVolume + volumeResult.value,
      updatedAt: clock.now(),
    });

    this.#prices.set(resourceId, nextEntry);

    if (previousPrice !== nextEntry.lastPrice || volumeResult.value > 0) {
      this.addDomainEvent(
        new MarketPriceChanged(
          nextEntry.updatedAt,
          this.getId().value,
          resourceId,
          previousPrice,
          nextEntry.lastPrice,
          nextEntry.tradeVolume,
        ),
      );
    }

    return Result.ok(undefined);
  }
}

/** Creates a validated market identifier from a raw string. */
export function createMarketId(rawValue: string): Result<MarketId, ValidationError> {
  const result = Identifier.create<MarketId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
