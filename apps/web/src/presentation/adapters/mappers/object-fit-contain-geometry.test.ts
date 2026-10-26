import { describe, expect, it } from 'vitest';
import { computeObjectFitContainContentRect } from '@/presentation/adapters/mappers/object-fit-contain-geometry';

describe('object-fit-contain-geometry', () => {
  it('letterboxes a wide image inside a tall element', () => {
    const rect = computeObjectFitContainContentRect({
      elementWidth: 390,
      elementHeight: 844,
      naturalWidth: 1536,
      naturalHeight: 1024,
    });

    expect(rect.width).toBe(390);
    expect(rect.x).toBe(0);
    expect(rect.height).toBeCloseTo(260, 0);
    expect(rect.y).toBeCloseTo((844 - rect.height) / 2, 0);
  });

  it('letterboxes a wide image inside a wide element', () => {
    const rect = computeObjectFitContainContentRect({
      elementWidth: 1440,
      elementHeight: 900,
      naturalWidth: 1536,
      naturalHeight: 1024,
    });

    expect(rect.height).toBe(900);
    expect(rect.y).toBe(0);
    expect(rect.width).toBeCloseTo(1350, 0);
    expect(rect.x).toBeCloseTo((1440 - rect.width) / 2, 0);
  });
});
