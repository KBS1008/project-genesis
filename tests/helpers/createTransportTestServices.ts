/**
 * Shared transport wiring for manual unit-test application contexts.
 */

import type { DomainEvent } from '../../src/common/events/DomainEvent.js';
import type { ManualClock } from '../../src/common/time/ManualClock.js';
import type { GameContentLoadResult } from '../../src/content/validateGameContent.js';
import type { BuildingRepository } from '../../src/domain/building/BuildingRepository.js';
import type { InventoryRepository } from '../../src/domain/inventory/InventoryRepository.js';
import type { ProductionJobRepository } from '../../src/domain/production/ProductionJobRepository.js';
import { TransportLogisticsService } from '../../src/application/services/TransportLogisticsService.js';
import type { ProductionInventoryService } from '../../src/application/services/ProductionInventoryService.js';
import { InMemoryBuildingStorageRepository } from '../../src/infrastructure/persistence/InMemoryBuildingStorageRepository.js';
import { InMemoryTransportOrderRepository } from '../../src/infrastructure/persistence/InMemoryTransportOrderRepository.js';

export type TransportTestServices = {
  readonly buildingStorageRepository: InMemoryBuildingStorageRepository;
  readonly transportOrderRepository: InMemoryTransportOrderRepository;
  readonly transportLogisticsService: TransportLogisticsService;
};

export function createTransportTestServices(options: {
  readonly clock: ManualClock;
  readonly buildingRepository: BuildingRepository;
  readonly productionJobRepository: ProductionJobRepository;
  readonly inventoryRepository: InventoryRepository;
  readonly productionInventoryService: ProductionInventoryService;
  readonly gameContent: GameContentLoadResult;
  readonly enqueueEvents: (events: readonly DomainEvent[]) => void;
}): TransportTestServices {
  const buildingStorageRepository = new InMemoryBuildingStorageRepository();
  const transportOrderRepository = new InMemoryTransportOrderRepository();
  const transportLogisticsService = new TransportLogisticsService({
    clock: options.clock,
    buildingRepository: options.buildingRepository,
    buildingStorageRepository,
    transportOrderRepository,
    productionJobRepository: options.productionJobRepository,
    inventoryRepository: options.inventoryRepository,
    productionInventoryService: options.productionInventoryService,
    gameContent: options.gameContent,
    enqueueEvents: options.enqueueEvents,
  });

  return {
    buildingStorageRepository,
    transportOrderRepository,
    transportLogisticsService,
  };
}
