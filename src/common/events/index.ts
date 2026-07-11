/**
 * @module @common/events
 *
 * Domain event primitives for the Common module.
 */

export { DomainEvent } from './DomainEvent.js';
export type { DomainEventHandler, IEventBus } from './IEventBus.js';
export { InMemoryEventBus } from './InMemoryEventBus.js';
