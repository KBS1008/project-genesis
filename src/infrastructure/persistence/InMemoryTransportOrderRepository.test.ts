import { ManualClock } from '../../common/time/ManualClock.js';
import { createBuildingId } from '../../domain/building/Building.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { TransportOrder } from '../../domain/transport/TransportOrder.js';
import { createTransportOrderId } from '../../domain/transport/TransportOrderId.js';
import { TransportOrderStatus } from '../../domain/transport/TransportOrderStatus.js';
import { InMemoryTransportOrderRepository } from './InMemoryTransportOrderRepository.js';

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

function createOrder(
  id: string,
  clock: ManualClock,
  productionJobId: string,
): TransportOrder {
  const result = TransportOrder.create({
    id: requireTransportOrderId(id),
    companyId: requireCompanyId('company_001'),
    sourceBuildingId: requireBuildingId('warehouse_001'),
    destinationBuildingId: requireBuildingId('sawmill_001'),
    resourceId: 'wood',
    amount: 10,
    duration: 5,
    routeId: 'route_storage_to_production',
    productionJobId,
    clock,
  });

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('InMemoryTransportOrderRepository', () => {
  it('saves and retrieves transport orders by id', () => {
    const repository = new InMemoryTransportOrderRepository();
    const order = createOrder('transport_001', new ManualClock(100), 'production_job_001');

    repository.save(order);

    expect(repository.findById(requireTransportOrderId('transport_001'))).toBe(order);
  });

  it('returns in-progress orders in deterministic id order', () => {
    const repository = new InMemoryTransportOrderRepository();
    const clock = new ManualClock(100);
    const second = createOrder('transport_002', clock, 'production_job_002');
    const first = createOrder('transport_001', clock, 'production_job_001');

    second.dispatch(clock);
    first.dispatch(clock);

    repository.save(second);
    repository.save(first);

    expect(repository.findInProgress().map((order) => order.getId().value)).toEqual([
      'transport_001',
      'transport_002',
    ]);
  });

  it('returns waiting orders in created-at order', () => {
    const repository = new InMemoryTransportOrderRepository();
    const later = createOrder('transport_002', new ManualClock(200), 'production_job_002');
    const earlier = createOrder('transport_001', new ManualClock(100), 'production_job_001');

    repository.save(later);
    repository.save(earlier);

    expect(repository.findWaiting().map((order) => order.getId().value)).toEqual([
      'transport_001',
      'transport_002',
    ]);
    expect(repository.findWaiting()[0]?.getStatus()).toBe(TransportOrderStatus.WAITING);
  });

  it('returns orders for a company in deterministic id order', () => {
    const repository = new InMemoryTransportOrderRepository();
    const clock = new ManualClock(100);
    const companyId = requireCompanyId('company_001');
    const second = createOrder('transport_002', clock, 'production_job_002');
    const first = createOrder('transport_001', clock, 'production_job_001');

    repository.save(second);
    repository.save(first);

    expect(repository.findByCompanyId(companyId).map((order) => order.getId().value)).toEqual([
      'transport_001',
      'transport_002',
    ]);
  });

  it('returns orders for a production job in deterministic id order', () => {
    const repository = new InMemoryTransportOrderRepository();
    const clock = new ManualClock(100);
    const first = createOrder('transport_001', clock, 'production_job_shared');
    const second = createOrder('transport_002', clock, 'production_job_shared');
    const otherJob = createOrder('transport_003', clock, 'production_job_other');

    repository.save(second);
    repository.save(first);
    repository.save(otherJob);

    expect(
      repository
        .findByProductionJobId('production_job_shared')
        .map((order) => order.getId().value),
    ).toEqual(['transport_001', 'transport_002']);
  });
});
