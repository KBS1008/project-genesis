import { ManualClock } from '../../common/time/ManualClock.js';
import { createBuildingId } from '../building/Building.js';
import { createCompanyId } from '../company/Company.js';
import { TransportCompleted } from './events/TransportCompleted.js';
import { TransportOrder } from './TransportOrder.js';
import { createTransportOrderId } from './TransportOrderId.js';
import { TransportOrderStatus } from './TransportOrderStatus.js';

function requireTransportOrderId(value: string) {
  const result = createTransportOrderId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireBuildingId(value: string) {
  const result = createBuildingId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function createValidOrder(clock = new ManualClock(100)) {
  const result = TransportOrder.create({
    id: requireTransportOrderId('transport_001'),
    companyId: requireCompanyId('company_001'),
    sourceBuildingId: requireBuildingId('warehouse_001'),
    destinationBuildingId: requireBuildingId('sawmill_001'),
    resourceId: 'wood',
    amount: 10,
    duration: 5,
    routeId: 'route_storage_to_production',
    productionJobId: 'production_job_001',
    clock,
  });

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('TransportOrder', () => {
  describe('create', () => {
    it('creates a waiting transport order with zero progress', () => {
      const clock = new ManualClock(250);
      const order = createValidOrder(clock);

      expect(order.getId().value).toBe('transport_001');
      expect(order.getCompanyId().value).toBe('company_001');
      expect(order.getSourceBuildingId().value).toBe('warehouse_001');
      expect(order.getDestinationBuildingId().value).toBe('sawmill_001');
      expect(order.getResourceId()).toBe('wood');
      expect(order.getAmount()).toBe(10);
      expect(order.getDuration()).toBe(5);
      expect(order.getRouteId()).toBe('route_storage_to_production');
      expect(order.getProductionJobId()).toBe('production_job_001');
      expect(order.getCreatedAt()).toBe(250);
      expect(order.getStatus()).toBe(TransportOrderStatus.WAITING);
      expect(order.getProgress()).toBe(0);
      expect(order.getStartTime()).toBeUndefined();
      expect(order.getEndTime()).toBeUndefined();
    });

    it('rejects zero duration', () => {
      const result = TransportOrder.create({
        id: requireTransportOrderId('transport_001'),
        companyId: requireCompanyId('company_001'),
        sourceBuildingId: requireBuildingId('warehouse_001'),
        destinationBuildingId: requireBuildingId('sawmill_001'),
        resourceId: 'wood',
        amount: 10,
        duration: 0,
        routeId: null,
        productionJobId: 'production_job_001',
        clock: new ManualClock(),
      });

      expect(result.ok).toBe(false);
    });

    it('rejects zero amount', () => {
      const result = TransportOrder.create({
        id: requireTransportOrderId('transport_001'),
        companyId: requireCompanyId('company_001'),
        sourceBuildingId: requireBuildingId('warehouse_001'),
        destinationBuildingId: requireBuildingId('sawmill_001'),
        resourceId: 'wood',
        amount: 0,
        duration: 5,
        routeId: null,
        productionJobId: 'production_job_001',
        clock: new ManualClock(),
      });

      expect(result.ok).toBe(false);
    });
  });

  describe('dispatch', () => {
    it('moves a waiting order to in progress', () => {
      const clock = new ManualClock(100);
      const order = createValidOrder(clock);

      const dispatchResult = order.dispatch(clock);

      expect(dispatchResult.ok).toBe(true);
      expect(order.getStatus()).toBe(TransportOrderStatus.IN_PROGRESS);
      expect(order.getStartTime()).toBe(100);
      expect(order.getProgress()).toBe(0);
    });

    it('rejects dispatch when the order is not waiting', () => {
      const clock = new ManualClock(100);
      const order = createValidOrder(clock);

      order.dispatch(clock);
      const secondDispatch = order.dispatch(clock);

      expect(secondDispatch.ok).toBe(false);
      expect(order.getStatus()).toBe(TransportOrderStatus.IN_PROGRESS);
    });
  });

  describe('tick', () => {
    it('reports running progress before completion', () => {
      const clock = new ManualClock(100);
      const order = createValidOrder(clock);

      order.dispatch(clock);
      clock.advance(2);

      const tickResult = order.tick(clock);

      expect(tickResult.ok).toBe(true);

      if (tickResult.ok) {
        expect(tickResult.value.status).toBe('running');
        expect(tickResult.value.progress).toBe(40);
      }

      expect(order.getStatus()).toBe(TransportOrderStatus.IN_PROGRESS);
      expect(order.getEndTime()).toBeUndefined();
    });

    it('completes the order and emits TransportCompleted', () => {
      const clock = new ManualClock(100);
      const order = createValidOrder(clock);

      order.dispatch(clock);
      clock.advance(5);

      const tickResult = order.tick(clock);

      expect(tickResult.ok).toBe(true);

      if (tickResult.ok) {
        expect(tickResult.value.status).toBe('completed');
        expect(tickResult.value.progress).toBe(100);
      }

      expect(order.getStatus()).toBe(TransportOrderStatus.COMPLETED);
      expect(order.getEndTime()).toBe(105);
      expect(order.getProgress()).toBe(100);

      const events = order.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TransportCompleted);

      if (events[0] instanceof TransportCompleted) {
        expect(events[0].transportOrderId).toBe('transport_001');
        expect(events[0].companyId).toBe('company_001');
        expect(events[0].resourceId).toBe('wood');
        expect(events[0].amount).toBe(10);
      }
    });

    it('rejects ticking a waiting order', () => {
      const order = createValidOrder(new ManualClock(100));
      const tickResult = order.tick(new ManualClock(100));

      expect(tickResult.ok).toBe(false);
    });
  });

  describe('restore', () => {
    it('restores persisted transport state without emitting events', () => {
      const order = TransportOrder.restore({
        id: requireTransportOrderId('transport_002'),
        companyId: requireCompanyId('company_001'),
        sourceBuildingId: requireBuildingId('warehouse_001'),
        destinationBuildingId: requireBuildingId('sawmill_001'),
        resourceId: 'steel',
        amount: 3,
        duration: 8,
        routeId: 'route_storage_to_production',
        productionJobId: 'production_job_002',
        createdAt: 50,
        status: TransportOrderStatus.IN_PROGRESS,
        startTime: 60,
        endTime: undefined,
        progress: 25,
      });

      expect(order.getStatus()).toBe(TransportOrderStatus.IN_PROGRESS);
      expect(order.getProgress()).toBe(25);
      expect(order.getStartTime()).toBe(60);
      expect(order.pullDomainEvents()).toHaveLength(0);
    });
  });
});
