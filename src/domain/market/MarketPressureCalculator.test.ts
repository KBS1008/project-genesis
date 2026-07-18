import { MarketPressureCalculator } from './MarketPressureCalculator.js';

describe('MarketPressureCalculator', () => {
  it('computes pressure index from supply and demand', () => {
    expect(MarketPressureCalculator.computePressureIndex(100, 50)).toBe(0.5);
    expect(MarketPressureCalculator.computePressureIndex(25, 50)).toBe(2);
  });

  it('derives change metrics and trend direction', () => {
    expect(MarketPressureCalculator.computeChangeFromBase(108, 100)).toBe(8);
    expect(MarketPressureCalculator.computeChangePercent(108, 100)).toBe(8);
    expect(MarketPressureCalculator.computeTrend(8)).toBe('UP');
    expect(MarketPressureCalculator.computeTrend(-8)).toBe('DOWN');
    expect(MarketPressureCalculator.computeTrend(0)).toBe('STABLE');
  });
});
