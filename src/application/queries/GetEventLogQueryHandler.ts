/**
 * @module @application/queries/GetEventLogQueryHandler
 *
 * Placeholder event log query until persistent event storage is introduced.
 */

import { Result } from '../../common/result/Result.js';
import type { ValidationError } from '../../common/errors/ValidationError.js';
import type { EventLogEntryReadModel } from '../read-models/EventLogEntryReadModel.js';
import type { GetEventLogQuery } from './GetEventLogQuery.js';

/** Returns player-visible event log entries. */
export class GetEventLogQueryHandler {
  execute(_query: GetEventLogQuery = {}): Result<readonly EventLogEntryReadModel[], ValidationError> {
    return Result.ok(Object.freeze([]));
  }
}
