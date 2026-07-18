/**
 * @module @application/use-cases/LoadGameUseCase
 *
 * Restores a game session from a persisted snapshot file.
 */

import { Result } from '../../common/result/Result.js';
import { ContentLoadError } from '../../content/errors/ContentLoadError.js';
import type { PersistenceError } from '../../common/errors/PersistenceError.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import { restoreApplicationFromSnapshot } from '../bootstrap/restoreApplicationFromSnapshot.js';
import type { LoadGameCommand } from '../commands/LoadGameCommand.js';
import type { SavegameStore } from '../ports/SavegameStore.js';

/** Dependencies required by {@link LoadGameUseCase}. */
export type LoadGameUseCaseDependencies = {
  readonly savegameStore: SavegameStore;
};

/**
 * Reads a savegame file and restores the application session.
 */
export class LoadGameUseCase {
  readonly #savegameStore: SavegameStore;

  /**
   * @param dependencies - Savegame store provided by the composition root.
   */
  constructor(dependencies: LoadGameUseCaseDependencies) {
    this.#savegameStore = dependencies.savegameStore;
  }

  /**
   * Executes the load-game workflow.
   */
  async execute(
    command: LoadGameCommand,
  ): Promise<Result<ApplicationContext, ContentLoadError | PersistenceError>> {
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
