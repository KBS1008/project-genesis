import { DomainEvent } from '../../common/events/DomainEvent.js';
import { InMemoryEventBus } from '../../common/events/InMemoryEventBus.js';
import { ManualClock } from '../../common/time/ManualClock.js';
import { SimulationState } from '../state/SimulationState.js';
import { SimulationEngine } from './SimulationEngine.js';
import type { SimulationSystem } from './SimulationSystem.js';

class TickRecordedEvent extends DomainEvent {
  readonly eventName = 'TickRecorded';
  readonly tickNumber: number;

  constructor(occurredAt: number, tickNumber: number) {
    super(occurredAt);
    this.tickNumber = tickNumber;
    this.freeze();
  }
}

describe('SimulationEngine', () => {
  it('advances time, runs systems and publishes queued events', () => {
    const clock = new ManualClock(0);
    const eventBus = new InMemoryEventBus();
    const executedTicks: number[] = [];
    const receivedEvents: number[] = [];

    const system: SimulationSystem = {
      name: 'RecordTick',
      execute(context) {
        executedTicks.push(context.tickNumber);
      },
    };

    eventBus.subscribe('TickRecorded', (event) => {
      receivedEvents.push((event as TickRecordedEvent).tickNumber);
    });

    const engine = new SimulationEngine({
      clock,
      eventBus,
      systems: [system],
    });

    engine.enqueueEvents([new TickRecordedEvent(clock.now(), 1)]);

    const result = engine.tick();

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.tickNumber).toBe(1);
      expect(result.value.occurredAt).toBe(1);
      expect(result.value.publishedEventCount).toBe(1);
    }

    expect(executedTicks).toEqual([1]);
    expect(receivedEvents).toEqual([1]);
    expect(engine.state.tickNumber).toBe(1);
  });

  it('produces deterministic results for repeated runs', () => {
    function runSimulation(): number {
      const clock = new ManualClock(0);
      const eventBus = new InMemoryEventBus();
      const engine = new SimulationEngine({ clock, eventBus });

      engine.tick();
      engine.tick();

      return clock.now();
    }

    expect(runSimulation()).toBe(runSimulation());
  });

  it('does not execute ticks while paused', () => {
    const clock = new ManualClock(0);
    const eventBus = new InMemoryEventBus();
    const engine = new SimulationEngine({
      clock,
      eventBus,
      initialState: new SimulationState(0, true),
    });

    const result = engine.tick();

    expect(result.ok).toBe(false);
    expect(clock.now()).toBe(0);
    expect(engine.state.tickNumber).toBe(0);
  });

  it('supports pause, resume, and tick duration changes', () => {
    const clock = new ManualClock(0);
    const eventBus = new InMemoryEventBus();
    const engine = new SimulationEngine({ clock, eventBus, tickDuration: 1 });

    engine.pause();
    expect(engine.state.paused).toBe(true);
    expect(engine.tick().ok).toBe(false);

    engine.resume();
    expect(engine.state.paused).toBe(false);

    const speedResult = engine.setTickDuration(4);
    expect(speedResult.ok).toBe(true);
    expect(engine.tickDuration).toBe(4);

    const tickResult = engine.tick();
    expect(tickResult.ok).toBe(true);
    expect(clock.now()).toBe(4);
  });
});
