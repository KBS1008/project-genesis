import { ResourceAmount } from './ResourceAmount.js';

describe('ResourceAmount', () => {
  describe('create', () => {
    it('creates a resource amount with a validated resource id', () => {
      const result = ResourceAmount.create('wood', 10);

      expect(result.ok).toBe(true);

      if (result.ok) {
        expect(result.value.resourceId.value).toBe('wood');
        expect(result.value.amount).toBe(10);
        expect(Object.isFrozen(result.value)).toBe(true);
      }
    });

    it('allows zero amounts', () => {
      const result = ResourceAmount.create('wood', 0);

      expect(result.ok).toBe(true);
    });

    it('rejects negative amounts', () => {
      const result = ResourceAmount.create('wood', -1);

      expect(result.ok).toBe(false);
    });

    it('rejects empty resource ids', () => {
      const result = ResourceAmount.create('', 10);

      expect(result.ok).toBe(false);
    });
  });

  describe('equals', () => {
    it('compares resource id and amount structurally', () => {
      const left = ResourceAmount.create('wood', 10);
      const right = ResourceAmount.create('wood', 10);
      const differentAmount = ResourceAmount.create('wood', 20);
      const differentResource = ResourceAmount.create('iron_ore', 10);

      expect(left.ok && right.ok && left.value.equals(right.value)).toBe(true);
      expect(left.ok && differentAmount.ok && left.value.equals(differentAmount.value)).toBe(false);
      expect(left.ok && differentResource.ok && left.value.equals(differentResource.value)).toBe(
        false,
      );
    });
  });
});
