import { InflationCalculator } from './InflationCalculator.js';

describe('InflationCalculator', () => {
  it('computes the average price index across resources', () => {
    const index = InflationCalculator.computePriceIndex([
      { basePrice: 100, lastPrice: 110 },
      { basePrice: 50, lastPrice: 50 },
    ]);

    expect(index).toBe(1.05);
  });

  it('dampens adjustments when the index is above the target band', () => {
    expect(InflationCalculator.computeAdjustmentMultiplier(1.2)).toBe(0.5);
  });

  it('stimulates adjustments when the index is below the target band', () => {
    expect(InflationCalculator.computeAdjustmentMultiplier(0.8)).toBe(1.25);
  });
});
