/**
 * @module @application/use-cases/SaveGameUseCase
 *
 * Persists the current in-memory game session as a deterministic snapshot.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import type { PersistenceError } from '../../common/errors/PersistenceError.js';
import { Result } from '../../common/result/Result.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { SaveGameCommand } from '../commands/SaveGameCommand.js';
import type { GameStateSerializerPort } from '../ports/GameStateSerializerPort.js';
import type { SavegameStore } from '../ports/SavegameStore.js';

/** Dependencies required by {@link SaveGameUseCase}. */
export type SaveGameUseCaseDependencies = Pick<
  ApplicationContext,
  | 'clock'
  | 'simulationEngine'
  | 'companyRepository'
  | 'buildingRepository'
  | 'buildingStorageRepository'
  | 'transportOrderRepository'
  | 'inventoryRepository'
  | 'financeRepository'
  | 'marketRepository'
  | 'productionJobRepository'
  | 'researchJobRepository'
  | 'companyResearchRepository'
  | 'companyMilestonesRepository'
  | 'employeeRepository'
  | 'supplyContractRepository'
  | 'tickHistoryService'
> & {
  readonly savegameStore: SavegameStore;
  readonly gameStateSerializer: GameStateSerializerPort;
};

/**
 * Serializes and writes the current session state to disk.
 */
export class SaveGameUseCase {
  readonly #clock: SaveGameUseCaseDependencies['clock'];
  readonly #simulationEngine: SaveGameUseCaseDependencies['simulationEngine'];
  readonly #companyRepository: SaveGameUseCaseDependencies['companyRepository'];
  readonly #buildingRepository: SaveGameUseCaseDependencies['buildingRepository'];
  readonly #buildingStorageRepository: SaveGameUseCaseDependencies['buildingStorageRepository'];
  readonly #transportOrderRepository: SaveGameUseCaseDependencies['transportOrderRepository'];
  readonly #inventoryRepository: SaveGameUseCaseDependencies['inventoryRepository'];
  readonly #financeRepository: SaveGameUseCaseDependencies['financeRepository'];
  readonly #marketRepository: SaveGameUseCaseDependencies['marketRepository'];
  readonly #productionJobRepository: SaveGameUseCaseDependencies['productionJobRepository'];
  readonly #researchJobRepository: SaveGameUseCaseDependencies['researchJobRepository'];
  readonly #companyResearchRepository: SaveGameUseCaseDependencies['companyResearchRepository'];
  readonly #companyMilestonesRepository: SaveGameUseCaseDependencies['companyMilestonesRepository'];
  readonly #employeeRepository: SaveGameUseCaseDependencies['employeeRepository'];
  readonly #supplyContractRepository: SaveGameUseCaseDependencies['supplyContractRepository'];
  readonly #tickHistoryService: SaveGameUseCaseDependencies['tickHistoryService'];
  readonly #savegameStore: SavegameStore;
  readonly #serializer: GameStateSerializerPort;

  /**
   * @param dependencies - Application state and persistence ports from the composition root.
   */
  constructor(dependencies: SaveGameUseCaseDependencies) {
    this.#clock = dependencies.clock;
    this.#simulationEngine = dependencies.simulationEngine;
    this.#companyRepository = dependencies.companyRepository;
    this.#buildingRepository = dependencies.buildingRepository;
    this.#buildingStorageRepository = dependencies.buildingStorageRepository;
    this.#transportOrderRepository = dependencies.transportOrderRepository;
    this.#inventoryRepository = dependencies.inventoryRepository;
    this.#financeRepository = dependencies.financeRepository;
    this.#marketRepository = dependencies.marketRepository;
    this.#productionJobRepository = dependencies.productionJobRepository;
    this.#researchJobRepository = dependencies.researchJobRepository;
    this.#companyResearchRepository = dependencies.companyResearchRepository;
    this.#companyMilestonesRepository = dependencies.companyMilestonesRepository;
    this.#employeeRepository = dependencies.employeeRepository;
    this.#supplyContractRepository = dependencies.supplyContractRepository;
    this.#tickHistoryService = dependencies.tickHistoryService;
    this.#savegameStore = dependencies.savegameStore;
    this.#serializer = dependencies.gameStateSerializer;
  }

  /**
   * Executes the save-game workflow.
   */
  async execute(
    command: SaveGameCommand,
  ): Promise<Result<string, ValidationError | PersistenceError>> {
    const snapshotResult = this.#serializer.serialize({
      clock: this.#clock,
      simulationEngine: this.#simulationEngine,
      companyRepository: this.#companyRepository,
      buildingRepository: this.#buildingRepository,
      buildingStorageRepository: this.#buildingStorageRepository,
      transportOrderRepository: this.#transportOrderRepository,
      inventoryRepository: this.#inventoryRepository,
      financeRepository: this.#financeRepository,
      marketRepository: this.#marketRepository,
      productionJobRepository: this.#productionJobRepository,
      researchJobRepository: this.#researchJobRepository,
      companyResearchRepository: this.#companyResearchRepository,
      companyMilestonesRepository: this.#companyMilestonesRepository,
      employeeRepository: this.#employeeRepository,
      supplyContractRepository: this.#supplyContractRepository,
      tickHistoryService: this.#tickHistoryService,
    });

    if (!snapshotResult.ok) {
      return Result.fail(snapshotResult.error);
    }

    const saveResult = await this.#savegameStore.save(command.filePath, snapshotResult.value);

    if (!saveResult.ok) {
      return Result.fail(saveResult.error);
    }

    return Result.ok(command.filePath);
  }
}
