import { ConstructionCostPolicy } from './ConstructionCostPolicy.js';

describe('ConstructionCostPolicy', () => {
  const policy = new ConstructionCostPolicy();

  it('returns the construction cost for an enabled building type', () => {
    const result = policy.evaluate({
      buildingTypeId: 'sawmill',
      constructionCost: 5000,
      enabled: true,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.cost).toBe(5000);
    }
  });

  it('rejects disabled building types', () => {
    const result = policy.evaluate({
      buildingTypeId: 'sawmill',
      constructionCost: 5000,
      enabled: false,
    });

    expect(result.ok).toBe(false);
  });
});
