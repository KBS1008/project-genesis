import { Money, DEFAULT_CURRENCY } from './Money.js';

describe('Money', () => {
  describe('create', () => {
    it('creates money with a non-negative amount and currency', () => {
      const result = Money.create(100, 'GC');

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value.amount).toBe(100);
        expect(result.value.currency).toBe('GC');
        expect(Object.isFrozen(result.value)).toBe(true);
      }
    });

    it('defaults to Genesis Credits', () => {
      const result = Money.create(50);

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value.currency).toBe(DEFAULT_CURRENCY);
      }
    });

    it('rejects negative amounts', () => {
      const result = Money.create(-1, 'GC');

      expect(result.ok).toBe(false);
    });

    it('rejects empty currency codes', () => {
      const result = Money.create(10, '');

      expect(result.ok).toBe(false);
    });
  });

  describe('zero', () => {
    it('creates zero money', () => {
      const result = Money.zero();

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value.amount).toBe(0);
      }
    });
  });

  describe('equals', () => {
    it('compares amount and currency structurally', () => {
      const left = Money.create(100, 'GC');
      const right = Money.create(100, 'GC');
      const differentCurrency = Money.create(100, 'EUR');

      expect(left.ok && right.ok && left.value.equals(right.value)).toBe(true);
      expect(left.ok && differentCurrency.ok && left.value.equals(differentCurrency.value)).toBe(
        false,
      );
    });
  });

  describe('add and subtract', () => {
    it('adds two money values with the same currency', () => {
      const left = Money.create(100, 'GC');
      const right = Money.create(25, 'GC');

      expect(left.ok && right.ok).toBe(true);

      if (!left.ok || !right.ok) {
        return;
      }

      const sumResult = left.value.add(right.value);

      expect(sumResult.ok).toBe(true);

      if (sumResult.ok) {
        expect(sumResult.value.amount).toBe(125);
      }
    });

    it('rejects addition when currencies differ', () => {
      const left = Money.create(100, 'GC');
      const right = Money.create(25, 'EUR');

      expect(left.ok && right.ok).toBe(true);

      if (!left.ok || !right.ok) {
        return;
      }

      const sumResult = left.value.add(right.value);

      expect(sumResult.ok).toBe(false);
    });

    it('subtracts two money values with the same currency', () => {
      const left = Money.create(100, 'GC');
      const right = Money.create(30, 'GC');

      expect(left.ok && right.ok).toBe(true);

      if (!left.ok || !right.ok) {
        return;
      }

      const differenceResult = left.value.subtract(right.value);

      expect(differenceResult.ok).toBe(true);

      if (differenceResult.ok) {
        expect(differenceResult.value.amount).toBe(70);
      }
    });

    it('rejects subtraction that would become negative', () => {
      const left = Money.create(20, 'GC');
      const right = Money.create(30, 'GC');

      expect(left.ok && right.ok).toBe(true);

      if (!left.ok || !right.ok) {
        return;
      }

      const differenceResult = left.value.subtract(right.value);

      expect(differenceResult.ok).toBe(false);
    });
  });

  describe('compare', () => {
    it('compares amounts with the same currency', () => {
      const larger = Money.create(100, 'GC');
      const smaller = Money.create(40, 'GC');

      expect(larger.ok && smaller.ok).toBe(true);

      if (!larger.ok || !smaller.ok) {
        return;
      }

      expect(larger.value.isGreaterThanOrEqual(smaller.value)).toBe(true);
      expect(smaller.value.isLessThan(larger.value)).toBe(true);
    });
  });
});
