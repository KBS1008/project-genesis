import { Capacity } from './Capacity.js';

describe('Capacity', () => {
  describe('create', () => {
    it('creates a non-negative capacity', () => {
      const result = Capacity.create(500);

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value.value).toBe(500);
        expect(Object.isFrozen(result.value)).toBe(true);
      }
    });

    it('allows zero for unused capacity dimensions', () => {
      const result = Capacity.create(0);

      expect(result.ok).toBe(true);
    });

    it('rejects negative values', () => {
      const result = Capacity.create(-1);

      expect(result.ok).toBe(false);
    });
  });

  describe('zero', () => {
    it('returns zero capacity', () => {
      expect(Capacity.zero().value).toBe(0);
    });
  });

  describe('equals', () => {
    it('compares values structurally', () => {
      const left = Capacity.create(100);
      const right = Capacity.create(100);
      const different = Capacity.create(200);

      expect(left.ok && right.ok && left.value.equals(right.value)).toBe(true);
      expect(left.ok && different.ok && left.value.equals(different.value)).toBe(false);
    });
  });
});
