import { ResourceListedOnMarketSpecification } from './ResourceListedOnMarketSpecification.js';

describe('ResourceListedOnMarketSpecification', () => {
  const specification = new ResourceListedOnMarketSpecification();

  it('passes when the resource is listed', () => {
    const result = specification.isSatisfiedBy({ resourceId: 'wood' }, { isListed: true });

    expect(result.ok).toBe(true);
  });

  it('fails when the resource is not listed', () => {
    const result = specification.isSatisfiedBy({ resourceId: 'wood' }, { isListed: false });

    expect(result.ok).toBe(false);
  });
});
