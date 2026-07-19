import { ManualClock } from '../../../common/time/ManualClock.js';
import { createBuildingId } from '../../../domain/building/Building.js';
import { createCompanyId } from '../../../domain/company/Company.js';
import { TransportOrderStatus } from '../../../domain/transport/TransportOrderStatus.js';
import { TransportOrder } from '../../../domain/transport/TransportOrder.js';
import { createTransportOrderId } from '../../../domain/transport/TransportOrderId.js';
import { InMemoryTransportOrderRepository } from '../../../infrastructure/persistence/InMemoryTransportOrderRepository.js';
import type { TransportLogisticsPort } from '../../../domain/transport/TransportLogisticsPort.js';
import { TransportSimulationSystem } from './TransportSimulationSystem.js';

class StubTransportLogisticsService implements TransportLogisticsPort {
  dispatchPendingTransports(): void {}

  completeTransportOrder(): ReturnType<TransportLogisticsPort['completeTransportOrder']> {
    return { ok: true, value: undefined } as never;
  }
}

describe('TransportSimulationSystem', () => {
  it('ticks in-progress transport orders in deterministic region order', () => {
    const clock = new ManualClock(100);
    const transportOrderRepository = new InMemoryTransportOrderRepository();
    const companyIdResult = createCompanyId('company_001');
    const sourceBuildingIdResult = createBuildingId('building_source');
    const destinationBuildingIdResult = createBuildingId('building_destination');

    expect(companyIdResult.ok).toBe(true);
    expect(sourceBuildingIdResult.ok).toBe(true);
    expect(destinationBuildingIdResult.ok).toBe(true);

    if (!companyIdResult.ok || !sourceBuildingIdResult.ok || !destinationBuildingIdResult.ok) {
      return;
    }

    const createOrder = (id: string, sourceRegionId: string, destinationRegionId: string) => {
      const orderIdResult = createTransportOrderId(id);

      if (!orderIdResult.ok) {
        throw new Error(orderIdResult.error.message);
      }

      const orderResult = TransportOrder.create({
        id: orderIdResult.value,
        companyId: companyIdResult.value,
        sourceBuildingId: sourceBuildingIdResult.value,
        destinationBuildingId: destinationBuildingIdResult.value,
        resourceId: 'iron_ore',
        amount: 5,
        duration: 1,
        routeId: `route::${sourceRegionId}->${destinationRegionId}`,
        productionJobId: `job_${id}`,
        sourceRegionId,
        destinationRegionId,
        clock,
      });

      if (!orderResult.ok) {
        throw new Error(orderResult.error.message);
      }

      orderResult.value.dispatch(clock);
      transportOrderRepository.save(orderResult.value);
    };

    createOrder('transport_z', 'region_north', 'region_east');
    createOrder('transport_a', 'region_default', 'region_east');
    createOrder('transport_m', 'region_east', 'region_north');

    clock.advance(1);

    const processed: string[] = [];
    const system = new TransportSimulationSystem({
      transportOrderRepository,
      transportLogisticsService: new StubTransportLogisticsService(),
      enqueueEvents: (events) => {
        for (const event of events) {
          if (event.eventName === 'TransportCompleted') {
            processed.push((event as unknown as { transportOrderId: string }).transportOrderId);
          }
        }
      },
    });

    system.execute({ clock, tickNumber: 1 });

    expect(processed).toEqual(['transport_a', 'transport_m', 'transport_z']);
    expect(transportOrderRepository.findInProgress()).toHaveLength(0);
    expect(
      transportOrderRepository
        .findByCompanyId(companyIdResult.value)
        .every((order) => order.getStatus() === TransportOrderStatus.COMPLETED),
    ).toBe(true);
  });
});
