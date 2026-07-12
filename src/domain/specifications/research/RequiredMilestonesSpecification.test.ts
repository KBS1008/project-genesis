/**
 * @module @domain/specifications/research/RequiredMilestonesSpecification.test
 *
 * Unit tests for {@link RequiredMilestonesSpecification}.
 */

import { RequiredMilestonesSpecification } from './RequiredMilestonesSpecification.js';

describe('RequiredMilestonesSpecification', () => {
  const specification = new RequiredMilestonesSpecification();

  it('passes when all required milestones are completed', () => {
    const result = specification.isSatisfiedBy(
      {
        subjectId: 'recipe_planks',
        requiredMilestones: ['first_profit'],
      },
      {
        completedMilestones: new Set(['first_profit']),
      },
    );

    expect(result.ok).toBe(true);
  });

  it('fails when a required milestone is missing', () => {
    const result = specification.isSatisfiedBy(
      {
        subjectId: 'recipe_planks',
        requiredMilestones: ['first_profit'],
      },
      {
        completedMilestones: new Set(),
      },
    );

    expect(result.ok).toBe(false);
  });
});
