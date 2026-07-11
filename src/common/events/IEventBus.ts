/**
 * @module @common/events/IEventBus
 *
 * Event bus contract for deterministic domain event dispatch.
 *
 * @see docs/decisions/DD-027-Event-Driven-Simulation-Architecture.md
 */

import type { DomainEvent } from './DomainEvent.js';

/** Handler invoked when a domain event is published. */
export type DomainEventHandler = (event: DomainEvent) => void;

/**
 * Publishes domain events to registered subscribers.
 */
export interface IEventBus {
  /**
   * Registers a handler for a specific event name.
   *
   * Handlers for the same event name are invoked in subscription order.
   */
  subscribe(eventName: string, handler: DomainEventHandler): void;

  /** Publishes a single domain event to matching subscribers. */
  publish(event: DomainEvent): void;

  /** Publishes multiple domain events in deterministic order. */
  publishAll(events: readonly DomainEvent[]): void;
}
