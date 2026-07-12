/**
 * @module @application/use-cases/LoadGameUseCase
 *
 * Restores a game session from a persisted snapshot file.
 */

import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../../content/errors/ContentLoadError.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import { restoreApplicationFromSnapshot } from '../bootstrap/restoreApplicationFromSnapshot.js';
import type { LoadGameCommand } from '../commands/LoadGameCommand.js';
import { FileSavegameStore } from '../../infrastructure/persistence/savegame/FileSavegameStore.js';

/** Dependencies required by {@link LoadGameUseCase}. */
export type LoadGameUseCaseDependencies = {
  readonly savegameStore?: FileSavegameStore;
};

/**
 * Reads a savegame file and restores the application session.
 */
export class LoadGameUseCase {
  readonly #savegameStore: FileSavegameStore;

  /**
   * @param dependencies - Optional savegame store override for tests.
   */
  constructor(dependencies: LoadGameUseCaseDependencies = {}) {
    this.#savegameStore = dependencies.savegameStore ?? new FileSavegameStore();
  }

  /**
   * Executes the load-game workflow.
   */
  async execute(
    command: LoadGameCommand,
  ): Promise<Result<ApplicationContext, ContentLoadError | ValidationError>> {
    const snapshotResult = await this.#savegameStore.load(command.filePath);

    if (!snapshotResult.ok) {
      return Result.fail(snapshotResult.error);
    }

    return restoreApplicationFromSnapshot({
      gameContentRoot: command.gameContentRoot,
      snapshot: snapshotResult.value,
    });
  }
}
