/**
 * @module @common/core/AggregateRoot
 *
 * Base class for aggregate roots in Project Genesis.
 *
 * Aggregate roots collect domain events raised during state changes
 * for persistence and downstream dispatch.
 *
 * @see docs/decisions/DD-027-Event-Driven-Simulation-Architecture.md
 */

import { DomainEvent } from '../events/DomainEvent.js';
import { Entity } from './Entity.js';
import type { Identifier } from './Identifier.js';

/**
 * Base class for aggregate roots with domain event collection.
 *
 * @typeParam TBrand - Phantom brand type shared with {@link Identifier}.
 */
export abstract class AggregateRoot<TBrand> extends Entity<TBrand> {
  readonly #domainEvents: DomainEvent[] = [];

  /**
   * Records a domain event raised by this aggregate.
   *
   * @param event - An immutable domain event.
   */
  protected addDomainEvent(event: DomainEvent): void {
    this.#domainEvents.push(event);
  }

  /**
   * Returns uncommitted domain events and clears the internal collection.
   *
   * Used after persistence or dispatch to avoid reprocessing the same events.
   *
   * @returns A frozen copy of the collected domain events.
   */
  pullDomainEvents(): readonly DomainEvent[] {
    const events = Object.freeze([...this.#domainEvents]) as readonly DomainEvent[];
    this.#domainEvents.length = 0;
    return events;
  }

  /**
   * Returns a snapshot of uncommitted domain events without clearing them.
   *
   * @returns A frozen copy of the current domain events.
   */
  peekDomainEvents(): readonly DomainEvent[] {
    return Object.freeze([...this.#domainEvents]) as readonly DomainEvent[];
  }
}
