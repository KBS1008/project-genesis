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
});
