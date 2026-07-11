import { ValueObject } from './ValueObject.js';

class Money extends ValueObject {
  constructor(
    readonly amount: number,
    readonly currency: string,
  ) {
    super();
    Object.freeze(this);
  }

  protected getEqualityComponents(): readonly unknown[] {
    return [this.amount, this.currency];
  }
}

class Percentage extends ValueObject {
  constructor(readonly value: number) {
    super();
    Object.freeze(this);
  }

  protected getEqualityComponents(): readonly unknown[] {
    return [this.value];
  }
}

describe('ValueObject', () => {
  describe('equals', () => {
    it('returns true for value objects with equal components', () => {
      const left = new Money(100, 'EUR');
      const right = new Money(100, 'EUR');

      expect(left.equals(right)).toBe(true);
    });

    it('returns false for value objects with different components', () => {
      const left = new Money(100, 'EUR');
      const right = new Money(200, 'EUR');

      expect(left.equals(right)).toBe(false);
    });

    it('returns false for value objects of different concrete types', () => {
      const money = new Money(100, 'EUR');
      const percentage = new Percentage(100);

      expect(money.equals(percentage)).toBe(false);
    });

    it('returns false when compared with null', () => {
      const money = new Money(100, 'EUR');

      expect(money.equals(null)).toBe(false);
    });

    it('returns false when compared with undefined', () => {
      const money = new Money(100, 'EUR');

      expect(money.equals(undefined)).toBe(false);
    });

    it('returns false when compared with a plain object', () => {
      const money = new Money(100, 'EUR');

      expect(money.equals({ amount: 100, currency: 'EUR' })).toBe(false);
    });
  });

  describe('immutability', () => {
    it('allows concrete value objects to freeze their instance', () => {
      const money = new Money(100, 'EUR');

      expect(Object.isFrozen(money)).toBe(true);
    });

    it('does not allow replacing frozen properties', () => {
      const money = new Money(100, 'EUR');

      expect(() => {
        (money as { amount: number }).amount = 200;
      }).toThrow();
    });
  });
});
