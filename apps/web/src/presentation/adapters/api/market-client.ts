/** HTTP commands for regional market buy and sell workflows. */

import { callApi } from './client';

export type MarketTradeRequest = {
  readonly resourceId: string;
  readonly amount: number;
};

/** Buys resources on the active regional market for the active company. */
export function buyResource(request: MarketTradeRequest): Promise<void> {
  return callApi<void>('/api/market/buy', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/** Sells resources on the active regional market for the active company. */
export function sellResource(request: MarketTradeRequest): Promise<void> {
  return callApi<void>('/api/market/sell', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
