/**
 * @module @common/events/InMemoryEventBus
 *
 * In-process event bus with deterministic dispatch order.
 */

import type { DomainEvent } from './DomainEvent.js';
import type { DomainEventHandler, IEventBus } from './IEventBus.js';

/**
 * Deterministic in-memory implementation of {@link IEventBus}.
 *
 * Handlers are invoked synchronously in subscription order.
 * The bus itself contains no business logic.
 */
export class InMemoryEventBus implements IEventBus {
  readonly #handlers = new Map<string, DomainEventHandler[]>();

  subscribe(eventName: string, handler: DomainEventHandler): void {
    const handlers = this.#handlers.get(eventName);

    if (handlers === undefined) {
      this.#handlers.set(eventName, [handler]);
      return;
    }

    handlers.push(handler);
  }

  publish(event: DomainEvent): void {
    const handlers = this.#handlers.get(event.eventName);

    if (handlers === undefined) {
      return;
    }

    for (const handler of handlers) {
      handler(event);
    }
  }

  publishAll(events: readonly DomainEvent[]): void {
    for (const event of events) {
      this.publish(event);
    }
  }
}
