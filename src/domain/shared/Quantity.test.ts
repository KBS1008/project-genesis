import { Quantity } from './Quantity.js';

describe('Quantity', () => {
  describe('create', () => {
    it('creates a non-negative quantity', () => {
      const result = Quantity.create(42);

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value.value).toBe(42);
        expect(Object.isFrozen(result.value)).toBe(true);
      }
    });

    it('allows zero', () => {
      const result = Quantity.create(0);

      expect(result.ok).toBe(true);
    });

    it('rejects negative values', () => {
      const result = Quantity.create(-1);

      expect(result.ok).toBe(false);
    });
  });

  describe('zero', () => {
    it('returns a zero quantity', () => {
      expect(Quantity.zero().value).toBe(0);
    });
  });

  describe('equals', () => {
    it('compares values structurally', () => {
      const left = Quantity.create(10);
      const right = Quantity.create(10);
      const different = Quantity.create(20);

      expect(left.ok && right.ok && left.value.equals(right.value)).toBe(true);
      expect(left.ok && different.ok && left.value.equals(different.value)).toBe(false);
    });
  });
});
