/**
 * @module @common/events/DomainEvent
 *
 * Base type for domain events in Project Genesis.
 *
 * Domain events describe something that has already happened.
 * They are immutable and contain no business logic.
 *
 * @see docs/decisions/DD-027-Event-Driven-Simulation-Architecture.md
 */

/**
 * Base class for immutable domain events.
 *
 * The timestamp must be supplied by the caller (typically via {@link Clock})
 * to preserve deterministic behaviour.
 */
export abstract class DomainEvent {
  /** Machine-readable event name. */
  abstract readonly eventName: string;

  /** Simulation time at which the event occurred. */
  readonly occurredAt: number;

  /**
   * @param occurredAt - Deterministic simulation timestamp for the event.
   */
  protected constructor(occurredAt: number) {
    this.occurredAt = occurredAt;
  }

  /**
   * Freezes the event instance after all subclass properties are assigned.
   *
   * Concrete events must call this at the end of their constructor.
   */
  protected freeze(): this {
    return Object.freeze(this);
  }
}
