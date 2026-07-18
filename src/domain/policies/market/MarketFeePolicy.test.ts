import { MarketFeePolicy } from './MarketFeePolicy.js';

describe('MarketFeePolicy', () => {
  const policy = new MarketFeePolicy();

  it('charges the minimum fee for small trades', () => {
    const result = policy.evaluate({ tradeValue: 10 });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.feeAmount).toBe(1);
    }
  });

  it('charges two percent of the trade value rounded to credits', () => {
    const result = policy.evaluate({ tradeValue: 100 });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.feeAmount).toBe(2);
    }
  });

  it('returns zero fee for zero trade value', () => {
    const result = policy.evaluate({ tradeValue: 0 });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.feeAmount).toBe(0);
    }
  });

  it('rejects negative trade values', () => {
    const result = policy.evaluate({ tradeValue: -1 });

    expect(result.ok).toBe(false);
  });
});
