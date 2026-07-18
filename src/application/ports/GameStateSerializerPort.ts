/**
 * @module @application/ports/GameStateSerializerPort
 *
 * Application port for serializing and restoring game state snapshots.
 */

import type { ValidationError } from '../../common/errors/ValidationError.js';
import type { Result } from '../../common/result/Result.js';
import type { ManualClock } from '../../common/time/ManualClock.js';
import type { BuildingRepository } from '../../domain/building/BuildingRepository.js';
import type { BuildingStorageRepository } from '../../domain/building/BuildingStorageRepository.js';
import type { CompanyRepository } from '../../domain/company/CompanyRepository.js';
import type { FinanceRepository } from '../../domain/finance/FinanceRepository.js';
import type { InventoryRepository } from '../../domain/inventory/InventoryRepository.js';
import type { MarketRepository } from '../../domain/market/MarketRepository.js';
import type { ProductionJobRepository } from '../../domain/production/ProductionJobRepository.js';
import type { ResearchJobRepository } from '../../domain/research/ResearchJobRepository.js';
import type { CompanyResearchRepository } from '../../domain/research/CompanyResearchRepository.js';
import type { CompanyMilestonesRepository } from '../../domain/milestone/CompanyMilestonesRepository.js';
import type { EmployeeRepository } from '../../domain/employee/EmployeeRepository.js';
import type { TransportOrderRepository } from '../../domain/transport/TransportOrderRepository.js';
import type { SimulationEngine } from '../../simulation/engine/SimulationEngine.js';
import type { SimulationState } from '../../simulation/state/SimulationState.js';
import type { GameSaveSnapshotV1 } from '../persistence/GameSaveSnapshotV1.js';
import type { TickHistorySnapshotProvider } from './TickHistorySnapshotProvider.js';

/** Repositories and runtime state used to build a save snapshot. */
export type GameStateSource = {
  readonly clock: ManualClock;
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
  readonly employeeRepository: EmployeeRepository;
  readonly tickHistoryService: TickHistorySnapshotProvider;
};

/** Repositories populated during snapshot restore. */
export type GameStateTarget = {
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
  readonly employeeRepository: EmployeeRepository;
  readonly tickHistoryService: TickHistorySnapshotProvider;
};

/** Restored simulation metadata after loading a snapshot. */
export type RestoredSimulationMetadata = {
  readonly clockTime: number;
  readonly simulationState: SimulationState;
  readonly tickDuration: number;
};

/** Serializes and restores deterministic game snapshots. */
export interface GameStateSerializerPort {
  serialize(source: GameStateSource): Result<GameSaveSnapshotV1, ValidationError>;
  parse(raw: unknown): Result<GameSaveSnapshotV1, ValidationError>;
  hydrate(
    snapshot: GameSaveSnapshotV1,
    target: GameStateTarget,
  ): Result<RestoredSimulationMetadata, ValidationError>;
}
