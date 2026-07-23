/**
 * @module @application/queries/ListSavegamesQueryHandler
 */

import type { PersistenceError } from '../../common/errors/PersistenceError.js';
import { Result } from '../../common/result/Result.js';
import type { ApplicationContext } from '../bootstrap/ApplicationContext.js';
import type { SaveMetadataReadModel } from '../read-models/SaveMetadataReadModel.js';
import type { ListSavegamesQuery } from './ListSavegamesQuery.js';

/** Dependencies required by {@link ListSavegamesQueryHandler}. */
export type ListSavegamesQueryHandlerDependencies = Pick<ApplicationContext, 'savegameStore'>;

/** Lists savegame metadata from a directory. */
export class ListSavegamesQueryHandler {
  readonly #savegameStore: ListSavegamesQueryHandlerDependencies['savegameStore'];

  constructor(dependencies: ListSavegamesQueryHandlerDependencies) {
    this.#savegameStore = dependencies.savegameStore;
  }

  execute(
    query: ListSavegamesQuery,
  ): Promise<Result<readonly SaveMetadataReadModel[], PersistenceError>> {
    return this.#savegameStore.listMetadata(query.directory);
  }
}
