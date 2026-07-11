import { ManualClock } from './ManualClock.js';

describe('ManualClock', () => {
  describe('now', () => {
    it('returns the initial time', () => {
      const clock = new ManualClock(42);

      expect(clock.now()).toBe(42);
    });

    it('defaults to zero when no initial time is provided', () => {
      const clock = new ManualClock();

      expect(clock.now()).toBe(0);
    });
  });

  describe('set', () => {
    it('updates the current time', () => {
      const clock = new ManualClock();
      const result = clock.set(100);

      expect(result.ok).toBe(true);
      expect(clock.now()).toBe(100);
    });

    it('rejects negative time values', () => {
      const clock = new ManualClock();
      const result = clock.set(-1);

      expect(result.ok).toBe(false);
      expect(clock.now()).toBe(0);
    });
  });

  describe('advance', () => {
    it('increases the current time', () => {
      const clock = new ManualClock(10);
      const result = clock.advance(5);

      expect(result.ok).toBe(true);
      expect(clock.now()).toBe(15);
    });

    it('rejects negative deltas', () => {
      const clock = new ManualClock(10);
      const result = clock.advance(-1);

      expect(result.ok).toBe(false);
      expect(clock.now()).toBe(10);
    });
  });
});
