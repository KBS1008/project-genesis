/**
 * @module @application/queries/GetEventLogQueryHandler
 *
 * Returns player-visible event log entries from the bounded session buffer.
 */

import { Result } from '../../common/result/Result.js';
import type { ValidationError } from '../../common/errors/ValidationError.js';
import type { EventLogEntryReadModel } from '../read-models/EventLogEntryReadModel.js';
import type { PlayerEventLogService } from '../services/PlayerEventLogService.js';
import type { GetEventLogQuery } from './GetEventLogQuery.js';

/** Returns player-visible event log entries. */
export class GetEventLogQueryHandler {
  readonly #playerEventLogService: PlayerEventLogService;

  constructor(playerEventLogService: PlayerEventLogService) {
    this.#playerEventLogService = playerEventLogService;
  }

  execute(query: GetEventLogQuery = {}): Result<readonly EventLogEntryReadModel[], ValidationError> {
    return Result.ok(this.#playerEventLogService.getEntries(query));
  }
}
