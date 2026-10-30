/**
 * @module @application/facade/transport-order-waiting-reason
 *
 * Read-only waiting reason for transport orders (P3-LS-S3).
 */

import {
  FALLBACK_TRANSPORT_THROUGHPUT_CAPACITY,
} from '../../domain/policies/transport/TransportRouteDurationPolicy.js';
import {
  TransportNetworkThroughputPolicy,
  type TransportThroughputOrderSnapshot,
} from '../../domain/policies/transport/TransportNetworkThroughputPolicy.js';
import { TransportOrderStatus } from '../../domain/transport/TransportOrderStatus.js';

export const TransportOrderWaitingReasonCode = {
  CAPACITY_EXHAUSTED: 'CAPACITY_EXHAUSTED',
  AWAITING_DISPATCH: 'AWAITING_DISPATCH',
} as const;

export type TransportOrderWaitingReasonCode =
  (typeof TransportOrderWaitingReasonCode)[keyof typeof TransportOrderWaitingReasonCode];

export type TransportOrderWaitingReason =
  | Readonly<{
      readonly code: typeof TransportOrderWaitingReasonCode.CAPACITY_EXHAUSTED;
      readonly routeActiveTransportCount: number;
      readonly routeThroughputCapacity: number;
    }>
  | Readonly<{ readonly code: typeof TransportOrderWaitingReasonCode.AWAITING_DISPATCH }>;

/** Dashboard-safe waiting reason (null when not WAITING). */
export type TransportOrderWaitingReasonReadModel =
  | Readonly<{
      readonly code: typeof TransportOrderWaitingReasonCode.CAPACITY_EXHAUSTED;
      readonly routeActiveTransportCount: number;
      readonly routeThroughputCapacity: number;
    }>
  | Readonly<{ readonly code: typeof TransportOrderWaitingReasonCode.AWAITING_DISPATCH }>;

export type TransportOrderWaitingReasonInput = {
  readonly status: string;
  readonly routeId: string | null;
};

export type TransportThroughputSnapshotInput = {
  readonly routeId: string | null;
  readonly status: string;
  readonly createdAt: number;
};

type TransportRouteCapacityLookup = {
  get(routeId: string): { readonly throughputCapacity?: number } | undefined;
};

/**
 * Mirrors {@link TransportLogisticsService} private capacity resolution without mutating logistics.
 */
export function resolveTransportRouteThroughputCapacity(
  routeId: string | null,
  transportRoutes: TransportRouteCapacityLookup,
): number {
  if (routeId === null) {
    return FALLBACK_TRANSPORT_THROUGHPUT_CAPACITY;
  }

  const baseRouteId = routeId.includes('::') ? (routeId.split('::')[0] ?? routeId) : routeId;
  const route = transportRoutes.get(baseRouteId);

  return route?.throughputCapacity ?? FALLBACK_TRANSPORT_THROUGHPUT_CAPACITY;
}

export function isFiniteTransportRouteThroughputCapacity(capacity: number): boolean {
  return Number.isFinite(capacity) && capacity < FALLBACK_TRANSPORT_THROUGHPUT_CAPACITY;
}

export function buildTransportThroughputSnapshots(
  orders: readonly TransportThroughputSnapshotInput[],
): readonly TransportThroughputOrderSnapshot[] {
  return Object.freeze(
    orders.map((order) =>
      Object.freeze({
        routeId: order.routeId,
        status: order.status,
        createdAt: order.createdAt,
      }),
    ),
  );
}

/**
 * Derives a read-only waiting explanation from a coherent transport snapshot.
 */
export function deriveTransportOrderWaitingReason(
  order: TransportOrderWaitingReasonInput,
  snapshots: readonly TransportThroughputOrderSnapshot[],
  routeThroughputCapacity: number,
): TransportOrderWaitingReason | null {
  if (order.status !== TransportOrderStatus.WAITING) {
    return null;
  }

  if (!isFiniteTransportRouteThroughputCapacity(routeThroughputCapacity)) {
    return Object.freeze({ code: TransportOrderWaitingReasonCode.AWAITING_DISPATCH });
  }

  const routeActiveTransportCount = TransportNetworkThroughputPolicy.countActiveOnRoute(
    snapshots,
    order.routeId,
  );

  if (routeActiveTransportCount >= routeThroughputCapacity) {
    return Object.freeze({
      code: TransportOrderWaitingReasonCode.CAPACITY_EXHAUSTED,
      routeActiveTransportCount,
      routeThroughputCapacity,
    });
  }

  return Object.freeze({ code: TransportOrderWaitingReasonCode.AWAITING_DISPATCH });
}

export function toTransportOrderWaitingReasonReadModel(
  reason: TransportOrderWaitingReason | null,
): TransportOrderWaitingReasonReadModel | null {
  if (reason === null) {
    return null;
  }

  return reason;
}
