import { RequiredResearchSpecification } from './RequiredResearchSpecification.js';

describe('RequiredResearchSpecification', () => {
  const specification = new RequiredResearchSpecification();

  it('passes when all required technologies are completed', () => {
    const result = specification.isSatisfiedBy(
      { subjectId: 'recipe_planks', requiredResearch: ['basic_woodworking'] },
      { completedResearch: new Set(['basic_woodworking']) },
    );

    expect(result.ok).toBe(true);
  });

  it('fails when a required technology is missing', () => {
    const result = specification.isSatisfiedBy(
      { subjectId: 'recipe_planks', requiredResearch: ['basic_woodworking'] },
      { completedResearch: new Set() },
    );

    expect(result.ok).toBe(false);
  });
});
