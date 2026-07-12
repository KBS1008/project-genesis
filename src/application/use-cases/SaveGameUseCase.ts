/**
 * @module @application/use-cases/SaveGameUseCase
 *
 * Persists the current in-memory game session as a deterministic snapshot.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { FileSavegameStore } from '../../infrastructure/persistence/savegame/FileSavegameStore.js';
import { GameStateSerializer } from '../../infrastructure/persistence/savegame/GameStateSerializer.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { SaveGameCommand } from '../commands/SaveGameCommand.js';

/** Dependencies required by {@link SaveGameUseCase}. */
export type SaveGameUseCaseDependencies = Pick<
  ApplicationContext,
  | 'clock'
  | 'simulationEngine'
  | 'companyRepository'
  | 'buildingRepository'
  | 'inventoryRepository'
  | 'financeRepository'
  | 'marketRepository'
  | 'productionJobRepository'
  | 'companyResearchRepository'
> & {
  readonly savegameStore?: FileSavegameStore;
};

/**
 * Serializes and writes the current session state to disk.
 */
export class SaveGameUseCase {
  readonly #clock: SaveGameUseCaseDependencies['clock'];
  readonly #simulationEngine: SaveGameUseCaseDependencies['simulationEngine'];
  readonly #companyRepository: SaveGameUseCaseDependencies['companyRepository'];
  readonly #buildingRepository: SaveGameUseCaseDependencies['buildingRepository'];
  readonly #inventoryRepository: SaveGameUseCaseDependencies['inventoryRepository'];
  readonly #financeRepository: SaveGameUseCaseDependencies['financeRepository'];
  readonly #marketRepository: SaveGameUseCaseDependencies['marketRepository'];
  readonly #productionJobRepository: SaveGameUseCaseDependencies['productionJobRepository'];
  readonly #companyResearchRepository: SaveGameUseCaseDependencies['companyResearchRepository'];
  readonly #savegameStore: FileSavegameStore;
  readonly #serializer = new GameStateSerializer();

  /**
   * @param dependencies - Application state and optional savegame store override.
   */
  constructor(dependencies: SaveGameUseCaseDependencies) {
    this.#clock = dependencies.clock;
    this.#simulationEngine = dependencies.simulationEngine;
    this.#companyRepository = dependencies.companyRepository;
    this.#buildingRepository = dependencies.buildingRepository;
    this.#inventoryRepository = dependencies.inventoryRepository;
    this.#financeRepository = dependencies.financeRepository;
    this.#marketRepository = dependencies.marketRepository;
    this.#productionJobRepository = dependencies.productionJobRepository;
    this.#companyResearchRepository = dependencies.companyResearchRepository;
    this.#savegameStore = dependencies.savegameStore ?? new FileSavegameStore();
  }

  /**
   * Executes the save-game workflow.
   */
  async execute(command: SaveGameCommand): Promise<Result<string, ValidationError>> {
    const snapshotResult = this.#serializer.serialize({
      clock: this.#clock,
      simulationEngine: this.#simulationEngine,
      companyRepository: this.#companyRepository,
      buildingRepository: this.#buildingRepository,
      inventoryRepository: this.#inventoryRepository,
      financeRepository: this.#financeRepository,
      marketRepository: this.#marketRepository,
      productionJobRepository: this.#productionJobRepository,
      companyResearchRepository: this.#companyResearchRepository,
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
