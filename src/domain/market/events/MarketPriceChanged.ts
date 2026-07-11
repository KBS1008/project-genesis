/**
 * @module @domain/market/events/MarketPriceChanged
 *
 * Domain event raised when a resource market price changes.
 */

import { DomainEvent } from '../../../common/events/DomainEvent.js';

/**
 * Indicates that a resource market price was updated.
 */
export class MarketPriceChanged extends DomainEvent {
  readonly eventName = 'MarketPriceChanged';
  readonly marketId: string;
  readonly resourceId: string;
  readonly previousPrice: number;
  readonly lastPrice: number;
  readonly tradeVolume: number;

  /**
   * @param occurredAt - Simulation time when the price changed.
   * @param marketId - Market identifier value.
   * @param resourceId - Resource type identifier value.
   * @param previousPrice - Price before the update.
   * @param lastPrice - Price after the update.
   * @param tradeVolume - Cumulative trade volume for the resource.
   */
  constructor(
    occurredAt: number,
    marketId: string,
    resourceId: string,
    previousPrice: number,
    lastPrice: number,
    tradeVolume: number,
  ) {
    super(occurredAt);
    this.marketId = marketId;
    this.resourceId = resourceId;
    this.previousPrice = previousPrice;
    this.lastPrice = lastPrice;
    this.tradeVolume = tradeVolume;
    this.freeze();
  }
}
