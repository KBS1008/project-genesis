import { TransportOrderStatus } from '../../transport/TransportOrderStatus.js';
import { TransportNetworkThroughputPolicy } from './TransportNetworkThroughputPolicy.js';

describe('TransportNetworkThroughputPolicy', () => {
  it('counts only in-progress orders on the same route id', () => {
    const activeCount = TransportNetworkThroughputPolicy.countActiveOnRoute(
      [
        { routeId: 'route_a', status: TransportOrderStatus.IN_PROGRESS, createdAt: 1 },
        { routeId: 'route_a', status: TransportOrderStatus.WAITING, createdAt: 2 },
        { routeId: 'route_b', status: TransportOrderStatus.IN_PROGRESS, createdAt: 3 },
      ],
      'route_a',
    );

    expect(activeCount).toBe(1);
  });

  it('sorts waiting orders by creation time for fifo dispatch', () => {
    const sorted = TransportNetworkThroughputPolicy.sortWaitingForDispatch([
      { routeId: 'route_a', status: TransportOrderStatus.WAITING, createdAt: 5 },
      { routeId: 'route_a', status: TransportOrderStatus.IN_PROGRESS, createdAt: 1 },
      { routeId: 'route_a', status: TransportOrderStatus.WAITING, createdAt: 2 },
    ]);

    expect(sorted.map((order) => order.createdAt)).toEqual([2, 5]);
  });

  it('allows dispatch while active count is below capacity', () => {
    expect(TransportNetworkThroughputPolicy.canDispatch(0, 2)).toBe(true);
    expect(TransportNetworkThroughputPolicy.canDispatch(1, 2)).toBe(true);
    expect(TransportNetworkThroughputPolicy.canDispatch(2, 2)).toBe(false);
  });
});
