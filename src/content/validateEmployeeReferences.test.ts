import { BuildingTypeRegistry } from './building/BuildingTypeRegistry.js';
import { BuildingTypeDefinition } from './building/BuildingTypeDefinition.js';
import { EmployeeDefinition } from './employee/EmployeeDefinition.js';
import { EmployeeRegistry } from './employee/EmployeeRegistry.js';
import { TechnologyDefinition } from './research/TechnologyDefinition.js';
import { TechnologyRegistry } from './research/TechnologyRegistry.js';
import { validateEmployeeReferences } from './validateEmployeeReferences.js';

function registerEmployee(
  registry: EmployeeRegistry,
  definition: EmployeeDefinition,
): void {
  const result = registry.register(definition);

  if (!result.ok) {
    throw new Error(result.error.message);
  }
}

function registerBuilding(registry: BuildingTypeRegistry, id: string): void {
  const result = registry.register(
    new BuildingTypeDefinition({
      id,
      name: id,
      description: `${id} test building.`,
      category: 'ADMINISTRATION',
      size: { width: 1, height: 1 },
      energyUsage: 0,
      energyGeneration: 0,
      maintenanceCost: 0,
      constructionCost: 0,
      constructionTime: 0,
      allowedRecipes: [],
      maxProductionLines: 1,
      requiredResearch: [],
      requiredMilestones: [],
      enabled: true,
      version: 1,
    }),
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }
}

function registerTechnology(registry: TechnologyRegistry, id: string): void {
  const result = registry.register(
    new TechnologyDefinition({
      id,
      name: id,
      description: `${id} test technology.`,
      category: 'PRODUCTION',
      requiredResearch: [],
      requiredMilestones: [],
      researchCost: 100,
      researchDuration: 10,
      enabled: true,
      version: 1,
    }),
  );

  if (!result.ok) {
    throw new Error(result.error.message);
  }
}

describe('validateEmployeeReferences', () => {
  it('accepts valid employee requirement references', () => {
    const employees = new EmployeeRegistry();
    const technologies = new TechnologyRegistry();
    const buildingTypes = new BuildingTypeRegistry();

    registerTechnology(technologies, 'basic_woodworking');
    registerBuilding(buildingTypes, 'headquarters');
    registerEmployee(
      employees,
      new EmployeeDefinition({
        id: 'employee_administrator_basic',
        version: 1,
        displayName: 'Administrator',
        category: 'administration',
        profession: 'administrator',
        cost: 1000,
        salary: 160,
        productivity: 1,
        description: 'Administration employee.',
        statistics: undefined,
        traits: [],
        requirements: {
          research: ['basic_woodworking'],
          buildings: ['headquarters'],
        },
        tags: [],
        localizationKey: undefined,
        enabled: true,
      }),
    );

    const result = validateEmployeeReferences(employees, technologies, buildingTypes);

    expect(result.ok).toBe(true);
  });

  it('rejects unknown building references', () => {
    const employees = new EmployeeRegistry();
    const technologies = new TechnologyRegistry();
    const buildingTypes = new BuildingTypeRegistry();

    registerEmployee(
      employees,
      new EmployeeDefinition({
        id: 'employee_invalid_building',
        version: 1,
        displayName: 'Invalid',
        category: 'logistics',
        profession: 'logistics_operator',
        cost: 900,
        salary: 140,
        productivity: 1,
        description: 'Invalid building reference.',
        statistics: undefined,
        traits: [],
        requirements: {
          research: [],
          buildings: ['missing_building'],
        },
        tags: [],
        localizationKey: undefined,
        enabled: true,
      }),
    );

    const result = validateEmployeeReferences(employees, technologies, buildingTypes);

    expect(result.ok).toBe(false);
  });
});
