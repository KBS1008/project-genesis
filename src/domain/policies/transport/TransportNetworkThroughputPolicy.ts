/**
 * @module @domain/policies/transport/TransportNetworkThroughputPolicy
 *
 * Abstract network throughput and queue rules for transport orders (DD-022).
 */

import { TransportOrderStatus } from '../../transport/TransportOrderStatus.js';

/** Minimal order shape for throughput counting. */
export type TransportThroughputOrderSnapshot = {
  readonly routeId: string | null;
  readonly status: string;
  readonly createdAt: number;
};

/**
 * Counts active in-progress transports sharing the same abstract route id.
 */
export class TransportNetworkThroughputPolicy {
  static countActiveOnRoute(
    orders: readonly TransportThroughputOrderSnapshot[],
    routeId: string | null,
  ): number {
    if (routeId === null) {
      return 0;
    }

    return orders.filter(
      (order) => order.routeId === routeId && order.status === TransportOrderStatus.IN_PROGRESS,
    ).length;
  }

  static canDispatch(activeCount: number, throughputCapacity: number): boolean {
    return activeCount < throughputCapacity;
  }

  static sortWaitingForDispatch<T extends TransportThroughputOrderSnapshot>(
    orders: readonly T[],
  ): readonly T[] {
    return Object.freeze(
      [...orders]
        .filter((order) => order.status === TransportOrderStatus.WAITING)
        .sort((left, right) => left.createdAt - right.createdAt),
    );
  }
}
