import { InstantTradePricingPolicy } from './InstantTradePricingPolicy.js';

describe('InstantTradePricingPolicy', () => {
  const policy = new InstantTradePricingPolicy();

  it('returns the last traded unit price', () => {
    const result = policy.evaluate({
      resourceId: 'wood',
      lastPrice: 25,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.unitPrice).toBe(25);
    }
  });

  it('rejects resources without a market price', () => {
    const result = policy.evaluate({
      resourceId: 'wood',
      lastPrice: undefined,
    });

    expect(result.ok).toBe(false);
  });
});
