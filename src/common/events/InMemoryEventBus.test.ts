import { DomainEvent } from './DomainEvent.js';
import { InMemoryEventBus } from './InMemoryEventBus.js';

class SampleEvent extends DomainEvent {
  readonly eventName = 'SampleEvent';
  readonly payload: string;

  constructor(occurredAt: number, payload: string) {
    super(occurredAt);
    this.payload = payload;
    this.freeze();
  }
}

describe('InMemoryEventBus', () => {
  it('delivers events to subscribed handlers', () => {
    const bus = new InMemoryEventBus();
    const received: string[] = [];

    bus.subscribe('SampleEvent', (event) => {
      received.push((event as SampleEvent).payload);
    });

    bus.publish(new SampleEvent(100, 'first'));

    expect(received).toEqual(['first']);
  });

  it('invokes handlers in subscription order', () => {
    const bus = new InMemoryEventBus();
    const order: number[] = [];

    bus.subscribe('SampleEvent', () => {
      order.push(1);
    });
    bus.subscribe('SampleEvent', () => {
      order.push(2);
    });

    bus.publish(new SampleEvent(100, 'payload'));

    expect(order).toEqual([1, 2]);
  });

  it('publishes multiple events in order', () => {
    const bus = new InMemoryEventBus();
    const payloads: string[] = [];

    bus.subscribe('SampleEvent', (event) => {
      payloads.push((event as SampleEvent).payload);
    });

    bus.publishAll([
      new SampleEvent(100, 'first'),
      new SampleEvent(101, 'second'),
    ]);

    expect(payloads).toEqual(['first', 'second']);
  });

  it('ignores events without subscribers', () => {
    const bus = new InMemoryEventBus();

    expect(() => {
      bus.publish(new SampleEvent(100, 'ignored'));
    }).not.toThrow();
  });
});
