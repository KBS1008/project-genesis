import { EmployeePrerequisitesSpecification } from './EmployeePrerequisitesSpecification.js';
import { RequiredBuildingTypesSpecification } from './RequiredBuildingTypesSpecification.js';

describe('EmployeePrerequisitesSpecification', () => {
  it('accepts when required research and buildings are satisfied', () => {
    const specification = new EmployeePrerequisitesSpecification();

    const result = specification.isSatisfiedBy(
      {
        employeeTypeId: 'employee_administrator_basic',
        requiredResearch: [],
        requiredBuildingTypes: ['headquarters'],
      },
      {
        completedResearch: new Set(),
        ownedActiveBuildingTypes: new Set(['headquarters']),
      },
    );

    expect(result.ok).toBe(true);
  });

  it('rejects when a required building type is missing', () => {
    const specification = new EmployeePrerequisitesSpecification();

    const result = specification.isSatisfiedBy(
      {
        employeeTypeId: 'employee_logistics_operator',
        requiredResearch: [],
        requiredBuildingTypes: ['warehouse'],
      },
      {
        completedResearch: new Set(),
        ownedActiveBuildingTypes: new Set(['headquarters']),
      },
    );

    expect(result.ok).toBe(false);
  });
});

describe('RequiredBuildingTypesSpecification', () => {
  it('accepts when all required building types are owned', () => {
    const specification = new RequiredBuildingTypesSpecification();

    const result = specification.isSatisfiedBy(
      {
        subjectId: 'employee_logistics_operator',
        requiredBuildingTypes: ['warehouse'],
      },
      {
        ownedActiveBuildingTypes: new Set(['warehouse', 'headquarters']),
      },
    );

    expect(result.ok).toBe(true);
  });
});
