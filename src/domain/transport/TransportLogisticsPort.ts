/**
 * @module @domain/transport/TransportLogisticsPort
 *
 * Domain port for transport completion used by simulation systems.
 */

import type { Result } from '../../common/result/Result.js';
import type { ValidationError } from '../../common/errors/ValidationError.js';
import type { TransportOrder } from './TransportOrder.js';

/** Transport logistics operations required by simulation systems. */
export interface TransportLogisticsPort {
  completeTransportOrder(order: TransportOrder): Result<void, ValidationError>;
}
