/**
 * @module @simulation/events/EventQueue
 *
 * Deterministic FIFO queue for domain events awaiting dispatch.
 *
 * @see docs/decisions/DD-027-Event-Driven-Simulation-Architecture.md
 */

import type { DomainEvent } from '../../common/events/DomainEvent.js';

/**
 * Collects domain events during a tick for deferred publication.
 */
export class EventQueue {
  readonly #events: DomainEvent[] = [];

  /**
   * Appends domain events to the queue in order.
   *
   * @param events - Domain events to enqueue.
   */
  enqueue(events: readonly DomainEvent[]): void {
    this.#events.push(...events);
  }

  /**
   * Returns a frozen snapshot of queued events without removing them.
   */
  peek(): readonly DomainEvent[] {
    return Object.freeze([...this.#events]) as readonly DomainEvent[];
  }

  /**
   * Returns all queued events in order and clears the queue.
   */
  drain(): readonly DomainEvent[] {
    const events = Object.freeze([...this.#events]) as readonly DomainEvent[];
    this.#events.length = 0;
    return events;
  }

  /** Returns the number of queued events. */
  get size(): number {
    return this.#events.length;
  }
}
