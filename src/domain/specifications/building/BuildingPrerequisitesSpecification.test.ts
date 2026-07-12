import { BuildingPrerequisitesSpecification } from './BuildingPrerequisitesSpecification.js';

describe('BuildingPrerequisitesSpecification', () => {
  const specification = new BuildingPrerequisitesSpecification();

  it('passes when research and milestones are satisfied', () => {
    const result = specification.isSatisfiedBy(
      {
        buildingTypeId: 'sawmill',
        requiredResearch: ['basic_woodworking'],
        requiredMilestones: ['first_profit'],
      },
      {
        completedResearch: new Set(['basic_woodworking']),
        completedMilestones: new Set(['first_profit']),
      },
    );

    expect(result.ok).toBe(true);
  });

  it('fails when a milestone prerequisite is missing', () => {
    const result = specification.isSatisfiedBy(
      {
        buildingTypeId: 'sawmill',
        requiredResearch: [],
        requiredMilestones: ['first_profit'],
      },
      {
        completedResearch: new Set(),
        completedMilestones: new Set(),
      },
    );

    expect(result.ok).toBe(false);
  });
});
