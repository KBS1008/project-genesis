import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { EmployeeCategory } from './employee/EmployeeDefinition.js';
import { validateGameContent } from './validateGameContent.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const gameContentRoot = path.join(projectRoot, 'game-content');

const PHASE_5_EMPLOYEES = Object.freeze([
  {
    id: 'employee_operations_supervisor',
    category: EmployeeCategory.PRODUCTION,
    departmentTag: 'department_operations',
    buildingId: 'training_center',
    researchId: 'process_automation',
  },
  {
    id: 'employee_senior_production_worker',
    category: EmployeeCategory.PRODUCTION,
    departmentTag: 'department_operations',
    buildingId: 'machine_shop',
    researchId: 'advanced_metallurgy',
  },
  {
    id: 'employee_maintenance_technician',
    category: EmployeeCategory.ENGINEERING,
    departmentTag: 'department_operations',
    buildingId: 'maintenance_facility',
    researchId: 'process_automation',
  },
  {
    id: 'employee_senior_engineer',
    category: EmployeeCategory.ENGINEERING,
    departmentTag: 'department_operations',
    buildingId: 'assembly_plant',
    researchId: 'precision_machining',
  },
  {
    id: 'employee_senior_researcher',
    category: EmployeeCategory.RESEARCH,
    departmentTag: 'department_research',
    buildingId: 'research_campus',
    researchId: 'corporate_management',
  },
  {
    id: 'employee_lab_director',
    category: EmployeeCategory.RESEARCH,
    departmentTag: 'department_research',
    buildingId: 'university',
    researchId: 'executive_leadership',
  },
  {
    id: 'employee_hr_manager',
    category: EmployeeCategory.ADMINISTRATION,
    departmentTag: 'department_hr',
    buildingId: 'training_center',
    researchId: 'corporate_management',
  },
  {
    id: 'employee_financial_analyst',
    category: EmployeeCategory.ADMINISTRATION,
    departmentTag: 'department_finance',
    buildingId: 'regional_headquarters',
    researchId: 'financial_planning',
  },
  {
    id: 'employee_regional_manager',
    category: EmployeeCategory.ADMINISTRATION,
    departmentTag: 'department_management',
    buildingId: 'regional_headquarters',
    researchId: 'corporate_management',
  },
  {
    id: 'employee_executive_director',
    category: EmployeeCategory.ADMINISTRATION,
    departmentTag: 'department_executive',
    buildingId: 'corporate_headquarters',
    researchId: 'executive_leadership',
  },
  {
    id: 'employee_logistics_coordinator',
    category: EmployeeCategory.LOGISTICS,
    departmentTag: 'department_logistics',
    buildingId: 'logistics_hub',
    researchId: 'distribution_networks',
  },
  {
    id: 'employee_distribution_clerk',
    category: EmployeeCategory.LOGISTICS,
    departmentTag: 'department_logistics',
    buildingId: 'distribution_center',
    researchId: 'warehouse_systems',
  },
  {
    id: 'employee_port_operator',
    category: EmployeeCategory.LOGISTICS,
    departmentTag: 'department_logistics',
    buildingId: 'port',
    researchId: 'intermodal_logistics',
  },
  {
    id: 'employee_rail_dispatcher',
    category: EmployeeCategory.LOGISTICS,
    departmentTag: 'department_logistics',
    buildingId: 'rail_terminal',
    researchId: 'intermodal_logistics',
  },
]);

const DEPARTMENT_TAGS = Object.freeze([
  'department_operations',
  'department_research',
  'department_hr',
  'department_finance',
  'department_management',
  'department_executive',
  'department_logistics',
]);

describe('M10 company management expansion content', () => {
  it('loads specialized employees across management departments with M10 prerequisites', async () => {
    const result = await validateGameContent(gameContentRoot, { strict: true });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const { employees, buildingTypes, technologies } = result.value;

    expect(employees.size).toBeGreaterThanOrEqual(19);

    for (const employee of PHASE_5_EMPLOYEES) {
      const definition = employees.get(employee.id);
      expect(definition).toBeDefined();
      expect(definition?.category).toBe(employee.category);
      expect(definition?.tags).toContain(employee.departmentTag);
      expect(definition?.requirements.buildings).toContain(employee.buildingId);
      expect(definition?.requirements.research).toContain(employee.researchId);
      expect(buildingTypes.has(employee.buildingId)).toBe(true);
      expect(technologies.has(employee.researchId)).toBe(true);
    }

    for (const departmentTag of DEPARTMENT_TAGS) {
      const departmentEmployees = employees.getAll().filter((employee) =>
        employee.tags.includes(departmentTag),
      );
      expect(departmentEmployees.length).toBeGreaterThanOrEqual(1);
    }

    const executiveDirector = employees.get('employee_executive_director');
    expect(executiveDirector?.traits).toContain('leadership');
    expect(executiveDirector?.productivity).toBeGreaterThan(1);
  });
});
