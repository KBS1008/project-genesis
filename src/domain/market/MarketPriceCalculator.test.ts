import { MARKET_BASELINE_DEMAND } from './MarketPriceConstants.js';
import { MarketPriceCalculator } from './MarketPriceCalculator.js';

describe('MarketPriceCalculator', () => {
  it('keeps price stable when supply matches baseline demand', () => {
    const nextPrice = MarketPriceCalculator.computeNextPrice({
      lastPrice: 100,
      basePrice: 100,
      totalSupply: MARKET_BASELINE_DEMAND,
      baselineDemand: MARKET_BASELINE_DEMAND,
    });

    expect(nextPrice).toBe(100);
  });

  it('reduces price when supply exceeds demand', () => {
    const nextPrice = MarketPriceCalculator.computeNextPrice({
      lastPrice: 100,
      basePrice: 100,
      totalSupply: 100,
      baselineDemand: 50,
    });

    expect(nextPrice).toBe(96);
  });

  it('increases price when supply is scarce', () => {
    const nextPrice = MarketPriceCalculator.computeNextPrice({
      lastPrice: 100,
      basePrice: 100,
      totalSupply: 25,
      baselineDemand: 50,
    });

    expect(nextPrice).toBe(108);
  });

  it('moves price toward the configured minimum ratio under extreme oversupply', () => {
    const nextPrice = MarketPriceCalculator.computeNextPrice({
      lastPrice: 100,
      basePrice: 100,
      totalSupply: 1_000,
      baselineDemand: 1,
    });

    expect(nextPrice).toBe(92);

    let price = nextPrice;

    for (let step = 0; step < 50; step += 1) {
      price = MarketPriceCalculator.computeNextPrice({
        lastPrice: price,
        basePrice: 100,
        totalSupply: 1_000,
        baselineDemand: 1,
      });
    }

    expect(price).toBe(25);
  });

  it('clamps prices to the configured maximum ratio', () => {
    const nextPrice = MarketPriceCalculator.computeNextPrice({
      lastPrice: 100,
      basePrice: 100,
      totalSupply: 1,
      baselineDemand: 1_000,
    });

    expect(nextPrice).toBe(400);
  });
});
