/**
 * @module @domain/transport/TransportOrderId
 *
 * Branded identifier for transport orders.
 */

import { Identifier } from '../../common/core/Identifier.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { Result } from '../../common/result/Result.js';

export type TransportOrderId = Identifier<'TransportOrder'>;

/** Creates a validated transport order identifier. */
export function createTransportOrderId(
  rawValue: string,
): Result<TransportOrderId, ValidationError> {
  const result = Identifier.create<TransportOrderId>(rawValue);

  if (!result.ok) {
    return Result.fail(new ValidationError(result.error.message));
  }

  return Result.ok(result.value);
}
