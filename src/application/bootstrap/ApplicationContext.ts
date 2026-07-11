/**
 * @module @application/bootstrap/ApplicationContext
 *
 * Wired application dependencies available to use cases after bootstrap.
 */

import type { IEventBus } from '../../common/events/IEventBus.js';
import type { BuildingRepository } from '../../domain/building/BuildingRepository.js';
import type { CompanyRepository } from '../../domain/company/CompanyRepository.js';
import type { InventoryRepository } from '../../domain/inventory/InventoryRepository.js';
import type { ProductionJobRepository } from '../../domain/production/ProductionJobRepository.js';
import type { GameContentLoadResult } from '../../content/validateGameContent.js';
import type { ManualClock } from '../../common/time/ManualClock.js';
import type { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';

/** Application runtime dependencies composed during bootstrap. */
export type ApplicationContext = {
  readonly clock: ManualClock;
  readonly eventBus: IEventBus;
  readonly simulationEngine: SimulationEngine;
  readonly companyRepository: CompanyRepository;
  readonly buildingRepository: BuildingRepository;
  readonly inventoryRepository: InventoryRepository;
  readonly productionJobRepository: ProductionJobRepository;
  readonly gameContent: GameContentLoadResult;
};
