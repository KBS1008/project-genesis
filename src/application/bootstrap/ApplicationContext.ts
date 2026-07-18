/**
 * @module @application/bootstrap/ApplicationContext
 *
 * Wired application dependencies available to use cases after bootstrap.
 */

import type { IEventBus } from '../../common/events/IEventBus.js';
import type { Logger } from '../../common/logging/Logger.js';
import type { BuildingRepository } from '../../domain/building/BuildingRepository.js';
import type { BuildingStorageRepository } from '../../domain/building/BuildingStorageRepository.js';
import type { CompanyRepository } from '../../domain/company/CompanyRepository.js';
import type { InventoryRepository } from '../../domain/inventory/InventoryRepository.js';
import type { FinanceRepository } from '../../domain/finance/FinanceRepository.js';
import type { MarketRepository } from '../../domain/market/MarketRepository.js';
import type { ProductionJobRepository } from '../../domain/production/ProductionJobRepository.js';
import type { ResearchJobRepository } from '../../domain/research/ResearchJobRepository.js';
import type { CompanyResearchRepository } from '../../domain/research/CompanyResearchRepository.js';
import type { CompanyMilestonesRepository } from '../../domain/milestone/CompanyMilestonesRepository.js';
import type { ProductionInventoryService } from '../services/ProductionInventoryService.js';
import type { MarketTradeService } from '../services/MarketTradeService.js';
import type { EnergyBalanceService } from '../services/EnergyBalanceService.js';
import type { TransportLogisticsService } from '../services/TransportLogisticsService.js';
import type { TickHistoryService } from '../services/TickHistoryService.js';
import type { TransportOrderRepository } from '../../domain/transport/TransportOrderRepository.js';
import type { GameContentLoadResult } from '../../content/validateGameContent.js';
import type { ManualClock } from '../../common/time/ManualClock.js';
import type { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import type { GameStateSerializerPort } from '../ports/GameStateSerializerPort.js';
import type { SavegameStore } from '../ports/SavegameStore.js';

/** Application runtime dependencies composed during bootstrap. */
export type ApplicationContext = {
  readonly clock: ManualClock;
  readonly eventBus: IEventBus;
  readonly simulationEngine: SimulationEngine;
  readonly companyRepository: CompanyRepository;
  readonly buildingRepository: BuildingRepository;
  readonly buildingStorageRepository: BuildingStorageRepository;
  readonly transportOrderRepository: TransportOrderRepository;
  readonly inventoryRepository: InventoryRepository;
  readonly financeRepository: FinanceRepository;
  readonly marketRepository: MarketRepository;
  readonly productionJobRepository: ProductionJobRepository;
  readonly researchJobRepository: ResearchJobRepository;
  readonly companyResearchRepository: CompanyResearchRepository;
  readonly companyMilestonesRepository: CompanyMilestonesRepository;
  readonly productionInventoryService: ProductionInventoryService;
  readonly marketTradeService: MarketTradeService;
  readonly energyBalanceService: EnergyBalanceService;
  readonly transportLogisticsService: TransportLogisticsService;
  readonly tickHistoryService: TickHistoryService;
  readonly savegameStore: SavegameStore;
  readonly gameStateSerializer: GameStateSerializerPort;
  readonly logger: Logger;
  readonly gameContent: GameContentLoadResult;
};
