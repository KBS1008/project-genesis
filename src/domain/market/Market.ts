/**
 * @module @domain/market/Market
 *
 * Regional market aggregate holding resource price snapshots, liquidity and history.
 *
 * @see docs/gameplay/market.md
 * @see docs/architecture/decisions/DD-018 – Economy & Market Architecture.md
 */

import { AggregateRoot } from '../../common/core/AggregateRoot.js';
import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import type { Clock } from '../../common/time/Clock.js';
import { Guard } from '../../common/validation/Guard.js';
import { createResourceTypeId } from '../shared/ResourceTypeId.js';
import type { MarketId } from './MarketId.js';
import {
  createMarketPriceHistoryEntry,
  MARKET_PRICE_HISTORY_LIMIT,
  type MarketPriceHistoryEntry,
} from './MarketPriceHistoryEntry.js';
import { computeMarketRegionalStatistics } from './MarketRegionalStatistics.js';
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
  readonly regionId: string;
  readonly resources: readonly MarketResourceSeed[];
  readonly clock: Clock;
  readonly initialLiquidity?: number;
};

/**
 * Regional market aggregate root tracking resource prices and economic indicators.
 */
export class Market extends AggregateRoot<'Market'> {
  readonly #regionId: string;
  readonly #createdAt: number;
  readonly #prices = new Map<string, ResourceMarketPrice>();
  readonly #priceHistory: MarketPriceHistoryEntry[] = [];

  private constructor(
    params: {
      id: MarketId;
      regionId: string;
      createdAt: number;
      prices: readonly ResourceMarketPrice[];
      priceHistory: readonly MarketPriceHistoryEntry[];
    },
    restoring = false,
  ) {
    super(params.id);
    this.#regionId = params.regionId;
    this.#createdAt = params.createdAt;

    for (const price of params.prices) {
      this.#prices.set(price.resourceId.value, price);
    }

    for (const entry of params.priceHistory) {
      this.#priceHistory.push(entry);
    }

    void restoring;
  }

  /**
   * Seeds market prices from enabled, market-enabled resource definitions.
   */
  static seedFromResources(params: SeedMarketParams): Result<Market, ValidationError> {
    const regionIdResult = Guard.againstEmptyString(
      params.regionId,
      'Market region id must not be empty.',
    );

    if (!regionIdResult.ok) {
      return Result.fail(regionIdResult.error);
    }

    const createdAt = params.clock.now();
    const initialLiquidity = params.initialLiquidity ?? 1;
    const market = new Market({
      id: params.id,
      regionId: regionIdResult.value,
      createdAt,
      prices: [],
      priceHistory: [],
    });

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
        supply: 0,
        demand: 0,
        liquidity: initialLiquidity,
      });

      market.#prices.set(resource.id, priceEntry);
    }

    return Result.ok(market);
  }

  /**
   * Rehydrates a market aggregate from a persisted snapshot without raising events.
   */
  static restore(params: {
    readonly id: MarketId;
    readonly regionId: string;
    readonly createdAt: number;
    readonly prices: readonly ResourceMarketPrice[];
    readonly priceHistory?: readonly MarketPriceHistoryEntry[];
  }): Result<Market, ValidationError> {
    const regionIdResult = Guard.againstEmptyString(
      params.regionId,
      'Market region id must not be empty.',
    );

    if (!regionIdResult.ok) {
      return Result.fail(regionIdResult.error);
    }

    for (const price of params.prices) {
      const validationResults = [
        Guard.againstNegative(price.basePrice, 'Market base price must not be negative.'),
        Guard.againstNegative(price.lastPrice, 'Market price must not be negative.'),
        Guard.againstNegative(price.tradeVolume, 'Trade volume must not be negative.'),
        Guard.againstNegative(price.supply, 'Market supply must not be negative.'),
        Guard.againstNegative(price.demand, 'Market demand must not be negative.'),
        Guard.againstNegative(price.liquidity, 'Market liquidity must not be negative.'),
      ];

      for (const validationResult of validationResults) {
        if (!validationResult.ok) {
          return Result.fail(validationResult.error);
        }
      }
    }

    return Result.ok(
      new Market(
        {
          id: params.id,
          regionId: regionIdResult.value,
          createdAt: params.createdAt,
          prices: params.prices,
          priceHistory: params.priceHistory ?? [],
        },
        true,
      ),
    );
  }

  /** The world region owning this market. */
  getRegionId(): string {
    return this.#regionId;
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

  /** Returns price history in deterministic tick then resource id order. */
  getPriceHistory(): readonly MarketPriceHistoryEntry[] {
    return Object.freeze(
      [...this.#priceHistory].sort((left, right) => {
        if (left.tick !== right.tick) {
          return left.tick - right.tick;
        }

        return left.resourceId.localeCompare(right.resourceId);
      }),
    );
  }

  /** Returns aggregated regional market statistics. */
  getRegionalStatistics() {
    return computeMarketRegionalStatistics(this.#regionId, this.getPrices());
  }

  /** Returns one resource price or undefined when the resource is not listed. */
  getPrice(resourceId: string): ResourceMarketPrice | undefined {
    return this.#prices.get(resourceId);
  }

  /**
   * Updates regional supply and demand indicators for one resource.
   */
  updateSupplyDemand(
    resourceId: string,
    supply: number,
    demand: number,
    clock: Clock,
  ): Result<void, ValidationError> {
    const supplyResult = Guard.againstNegative(supply, 'Market supply must not be negative.');
    const demandResult = Guard.againstNegative(demand, 'Market demand must not be negative.');

    if (!supplyResult.ok) {
      return Result.fail(supplyResult.error);
    }

    if (!demandResult.ok) {
      return Result.fail(demandResult.error);
    }

    const existing = this.#prices.get(resourceId);

    if (existing === undefined) {
      return Result.fail(
        new ValidationError(`Resource "${resourceId}" is not listed on the market.`),
      );
    }

    const nextEntry: ResourceMarketPrice = Object.freeze({
      ...existing,
      supply: supplyResult.value,
      demand: demandResult.value,
      updatedAt: clock.now(),
    });

    this.#prices.set(resourceId, nextEntry);
    return Result.ok(undefined);
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
      return Result.fail(
        new ValidationError(`Resource "${resourceId}" is not listed on the market.`),
      );
    }

    const previousPrice = existing.lastPrice;
    const nextTradeVolume = existing.tradeVolume + volumeResult.value;
    const nextLiquidity = this.#computeLiquidity(existing.liquidity, volumeResult.value);
    const nextEntry: ResourceMarketPrice = Object.freeze({
      resourceId: existing.resourceId,
      basePrice: existing.basePrice,
      lastPrice: priceResult.value,
      tradeVolume: nextTradeVolume,
      updatedAt: clock.now(),
      supply: existing.supply,
      demand: existing.demand,
      liquidity: nextLiquidity,
    });

    this.#prices.set(resourceId, nextEntry);
    this.#appendHistory(clock.now(), nextEntry);

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

  #computeLiquidity(currentLiquidity: number, tradeVolumeDelta: number): number {
    if (tradeVolumeDelta === 0) {
      return currentLiquidity;
    }

    return Math.min(100, currentLiquidity + tradeVolumeDelta * 0.1);
  }

  #appendHistory(tick: number, priceEntry: ResourceMarketPrice): void {
    this.#priceHistory.push(
      createMarketPriceHistoryEntry({
        tick,
        resourceId: priceEntry.resourceId.value,
        price: priceEntry.lastPrice,
        tradeVolume: priceEntry.tradeVolume,
        supply: priceEntry.supply,
        demand: priceEntry.demand,
        liquidity: priceEntry.liquidity,
      }),
    );

    if (this.#priceHistory.length > MARKET_PRICE_HISTORY_LIMIT) {
      this.#priceHistory.splice(0, this.#priceHistory.length - MARKET_PRICE_HISTORY_LIMIT);
    }
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
