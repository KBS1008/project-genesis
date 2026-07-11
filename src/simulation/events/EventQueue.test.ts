import { DomainEvent } from '../../common/events/DomainEvent.js';
import { EventQueue } from './EventQueue.js';

class QueuedEvent extends DomainEvent {
  readonly eventName = 'QueuedEvent';
  readonly label: string;

  constructor(occurredAt: number, label: string) {
    super(occurredAt);
    this.label = label;
    this.freeze();
  }
}

describe('EventQueue', () => {
  it('enqueues and drains events in order', () => {
    const queue = new EventQueue();

    queue.enqueue([
      new QueuedEvent(1, 'first'),
      new QueuedEvent(2, 'second'),
    ]);

    const drained = queue.drain();

    expect(drained).toHaveLength(2);
    expect((drained[0] as QueuedEvent).label).toBe('first');
    expect((drained[1] as QueuedEvent).label).toBe('second');
    expect(queue.size).toBe(0);
  });

  it('returns a frozen snapshot from peek without draining', () => {
    const queue = new EventQueue();

    queue.enqueue([new QueuedEvent(1, 'only')]);

    const peeked = queue.peek();

    expect(peeked).toHaveLength(1);
    expect(queue.size).toBe(1);
    expect(Object.isFrozen(peeked)).toBe(true);
  });
});
