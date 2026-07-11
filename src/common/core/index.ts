/**
 * @module @common/core
 *
 * Core foundation components of the Common module.
 */

export { AggregateRoot } from './AggregateRoot.js';
export { Entity } from './Entity.js';
export { ValueObject } from './ValueObject.js';

export {
  Identifier,
  IdentifierValidationError,
  IdentifierValidationFailureReason,
} from './Identifier.js';

export type {
  IdentifierPrimitive,
  IdentifierValidationFailureReason as IdentifierValidationFailureReasonType,
} from './Identifier.js';
