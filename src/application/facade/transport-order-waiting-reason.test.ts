import { describe, expect, it } from 'vitest';
import { TransportOrderStatus } from '../../domain/transport/TransportOrderStatus.js';
import { FALLBACK_TRANSPORT_THROUGHPUT_CAPACITY } from '../../domain/policies/transport/TransportRouteDurationPolicy.js';
import {
  TransportOrderWaitingReasonCode,
  buildTransportThroughputSnapshots,
  deriveTransportOrderWaitingReason,
  isFiniteTransportRouteThroughputCapacity,
  resolveTransportRouteThroughputCapacity,
  toTransportOrderWaitingReasonReadModel,
} from './transport-order-waiting-reason.js';

const routeA = 'route_storage_to_production';
const routeB = 'route_other';

function snapshot(
  routeId: string | null,
  status: string,
  createdAt = 1,
): { readonly routeId: string | null; readonly status: string; readonly createdAt: number } {
  return Object.freeze({ routeId, status, createdAt });
}

describe('transport-order-waiting-reason', () => {
  describe('resolveTransportRouteThroughputCapacity', () => {
    it('uses base route id before regional variant suffix', () => {
      const routes = {
        get(id: string) {
          if (id === 'route_storage_to_production') {
            return { throughputCapacity: 2 };
          }

          return undefined;
        },
      };

      expect(
        resolveTransportRouteThroughputCapacity('route_storage_to_production::north_south', routes),
      ).toBe(2);
    });

    it('falls back when route is missing', () => {
      expect(resolveTransportRouteThroughputCapacity('missing', { get: () => undefined })).toBe(
        FALLBACK_TRANSPORT_THROUGHPUT_CAPACITY,
      );
    });
  });

  describe('deriveTransportOrderWaitingReason', () => {
    it('returns capacity exhausted when active count reaches finite capacity (Test A)', () => {
      const snapshots = buildTransportThroughputSnapshots([
        snapshot(routeA, TransportOrderStatus.IN_PROGRESS, 1),
        snapshot(routeA, TransportOrderStatus.IN_PROGRESS, 2),
        snapshot(routeA, TransportOrderStatus.WAITING, 3),
      ]);

      const reason = deriveTransportOrderWaitingReason(
        { status: TransportOrderStatus.WAITING, routeId: routeA },
        snapshots,
        2,
      );

      expect(reason).toEqual({
        code: TransportOrderWaitingReasonCode.CAPACITY_EXHAUSTED,
        routeActiveTransportCount: 2,
        routeThroughputCapacity: 2,
      });
    });

    it('returns awaiting dispatch when capacity is available (Test B)', () => {
      const snapshots = buildTransportThroughputSnapshots([
        snapshot(routeA, TransportOrderStatus.IN_PROGRESS, 1),
        snapshot(routeA, TransportOrderStatus.WAITING, 2),
      ]);

      const reason = deriveTransportOrderWaitingReason(
        { status: TransportOrderStatus.WAITING, routeId: routeA },
        snapshots,
        2,
      );

      expect(reason).toEqual({ code: TransportOrderWaitingReasonCode.AWAITING_DISPATCH });
    });

    it('returns awaiting dispatch with zero active orders (Test C)', () => {
      const snapshots = buildTransportThroughputSnapshots([
        snapshot(routeA, TransportOrderStatus.WAITING, 1),
      ]);

      expect(
        deriveTransportOrderWaitingReason(
          { status: TransportOrderStatus.WAITING, routeId: routeA },
          snapshots,
          2,
        ),
      ).toEqual({ code: TransportOrderWaitingReasonCode.AWAITING_DISPATCH });
    });

    it('never reports saturation for unlimited fallback capacity (Test D)', () => {
      const snapshots = buildTransportThroughputSnapshots([
        snapshot(routeA, TransportOrderStatus.IN_PROGRESS, 1),
        snapshot(routeA, TransportOrderStatus.WAITING, 2),
      ]);

      expect(
        deriveTransportOrderWaitingReason(
          { status: TransportOrderStatus.WAITING, routeId: routeA },
          snapshots,
          FALLBACK_TRANSPORT_THROUGHPUT_CAPACITY,
        ),
      ).toEqual({ code: TransportOrderWaitingReasonCode.AWAITING_DISPATCH });
    });

    it('ignores active orders on other routes (Test E)', () => {
      const snapshots = buildTransportThroughputSnapshots([
        snapshot(routeA, TransportOrderStatus.IN_PROGRESS, 1),
        snapshot(routeB, TransportOrderStatus.IN_PROGRESS, 1),
        snapshot(routeB, TransportOrderStatus.IN_PROGRESS, 2),
        snapshot(routeA, TransportOrderStatus.WAITING, 3),
      ]);

      expect(
        deriveTransportOrderWaitingReason(
          { status: TransportOrderStatus.WAITING, routeId: routeA },
          snapshots,
          2,
        ),
      ).toEqual({ code: TransportOrderWaitingReasonCode.AWAITING_DISPATCH });
    });

    it('counts only IN_PROGRESS as active (Test F)', () => {
      const snapshots = buildTransportThroughputSnapshots([
        snapshot(routeA, TransportOrderStatus.IN_PROGRESS, 1),
        snapshot(routeA, TransportOrderStatus.WAITING, 2),
        snapshot(routeA, TransportOrderStatus.COMPLETED, 3),
        snapshot(routeA, TransportOrderStatus.CANCELLED, 4),
      ]);

      expect(
        deriveTransportOrderWaitingReason(
          { status: TransportOrderStatus.WAITING, routeId: routeA },
          snapshots,
          2,
        ),
      ).toEqual({ code: TransportOrderWaitingReasonCode.AWAITING_DISPATCH });
    });

    it('returns null for non-WAITING statuses (Test G)', () => {
      const snapshots = buildTransportThroughputSnapshots([
        snapshot(routeA, TransportOrderStatus.IN_PROGRESS, 1),
      ]);

      expect(
        deriveTransportOrderWaitingReason(
          { status: TransportOrderStatus.IN_PROGRESS, routeId: routeA },
          snapshots,
          2,
        ),
      ).toBeNull();
      expect(
        deriveTransportOrderWaitingReason(
          { status: TransportOrderStatus.COMPLETED, routeId: routeA },
          snapshots,
          2,
        ),
      ).toBeNull();
      expect(
        deriveTransportOrderWaitingReason(
          { status: TransportOrderStatus.CANCELLED, routeId: routeA },
          snapshots,
          2,
        ),
      ).toBeNull();
    });

    it('uses routeId grouping consistent with throughput policy (Test H)', () => {
      const snapshots = buildTransportThroughputSnapshots([
        snapshot(`${routeA}::variant`, TransportOrderStatus.IN_PROGRESS, 1),
        snapshot(`${routeA}::variant`, TransportOrderStatus.IN_PROGRESS, 2),
        snapshot(`${routeA}::variant`, TransportOrderStatus.WAITING, 3),
      ]);

      expect(
        deriveTransportOrderWaitingReason(
          { status: TransportOrderStatus.WAITING, routeId: `${routeA}::variant` },
          snapshots,
          2,
        ),
      ).toEqual({
        code: TransportOrderWaitingReasonCode.CAPACITY_EXHAUSTED,
        routeActiveTransportCount: 2,
        routeThroughputCapacity: 2,
      });
    });

    it('treats missing route configuration as unlimited (Test I)', () => {
      const capacity = resolveTransportRouteThroughputCapacity('unknown_route', { get: () => undefined });
      const snapshots = buildTransportThroughputSnapshots([
        snapshot('unknown_route', TransportOrderStatus.IN_PROGRESS, 1),
        snapshot('unknown_route', TransportOrderStatus.WAITING, 2),
      ]);

      expect(isFiniteTransportRouteThroughputCapacity(capacity)).toBe(false);
      expect(
        deriveTransportOrderWaitingReason(
          { status: TransportOrderStatus.WAITING, routeId: 'unknown_route' },
          snapshots,
          capacity,
        ),
      ).toEqual({ code: TransportOrderWaitingReasonCode.AWAITING_DISPATCH });
    });

    it('does not mutate snapshot inputs (Test J)', () => {
      const input = snapshot(routeA, TransportOrderStatus.WAITING, 1);
      const snapshots = buildTransportThroughputSnapshots([input]);

      deriveTransportOrderWaitingReason(
        { status: TransportOrderStatus.WAITING, routeId: routeA },
        snapshots,
        2,
      );

      expect(input.status).toBe(TransportOrderStatus.WAITING);
    });

    it('handles capacity boundaries deterministically (Test K)', () => {
      const base = buildTransportThroughputSnapshots([
        snapshot(routeA, TransportOrderStatus.IN_PROGRESS, 1),
        snapshot(routeA, TransportOrderStatus.IN_PROGRESS, 2),
        snapshot(routeA, TransportOrderStatus.IN_PROGRESS, 3),
      ]);

      expect(
        deriveTransportOrderWaitingReason(
          { status: TransportOrderStatus.WAITING, routeId: routeA },
          buildTransportThroughputSnapshots([
            snapshot(routeA, TransportOrderStatus.IN_PROGRESS, 1),
          ]),
          2,
        )?.code,
      ).toBe(TransportOrderWaitingReasonCode.AWAITING_DISPATCH);

      expect(
        deriveTransportOrderWaitingReason(
          { status: TransportOrderStatus.WAITING, routeId: routeA },
          buildTransportThroughputSnapshots([
            snapshot(routeA, TransportOrderStatus.IN_PROGRESS, 1),
            snapshot(routeA, TransportOrderStatus.IN_PROGRESS, 2),
          ]),
          2,
        )?.code,
      ).toBe(TransportOrderWaitingReasonCode.CAPACITY_EXHAUSTED);

      expect(
        deriveTransportOrderWaitingReason(
          { status: TransportOrderStatus.WAITING, routeId: routeA },
          base,
          2,
        )?.code,
      ).toBe(TransportOrderWaitingReasonCode.CAPACITY_EXHAUSTED);
    });

    it('does not count WAITING orders as active (Test L)', () => {
      const snapshots = buildTransportThroughputSnapshots([
        snapshot(routeA, TransportOrderStatus.WAITING, 1),
        snapshot(routeA, TransportOrderStatus.WAITING, 2),
        snapshot(routeA, TransportOrderStatus.WAITING, 3),
      ]);

      expect(
        deriveTransportOrderWaitingReason(
          { status: TransportOrderStatus.WAITING, routeId: routeA },
          snapshots,
          2,
        ),
      ).toEqual({ code: TransportOrderWaitingReasonCode.AWAITING_DISPATCH });
    });
  });

  it('passes through read-model conversion', () => {
    const reason = Object.freeze({
      code: TransportOrderWaitingReasonCode.CAPACITY_EXHAUSTED,
      routeActiveTransportCount: 2,
      routeThroughputCapacity: 2,
    });

    expect(toTransportOrderWaitingReasonReadModel(reason)).toBe(reason);
    expect(toTransportOrderWaitingReasonReadModel(null)).toBeNull();
  });
});
