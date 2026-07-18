import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EmployeeLoader } from './EmployeeLoader.js';
import { EmployeeRegistry } from './EmployeeRegistry.js';
import { validateEmployeeDefinition } from './EmployeeValidator.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const gameContentDirectory = path.resolve(testDirectory, '../../../game-content/employees');

describe('EmployeeLoader', () => {
  const loader = new EmployeeLoader();

  it('loads official game content employee types', async () => {
    const result = await loader.loadFromDirectory(gameContentDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.size).toBe(5);
      expect(result.value.has('employee_production_worker')).toBe(true);
      expect(result.value.has('employee_engineer_basic')).toBe(true);
      expect(result.value.has('employee_researcher_basic')).toBe(true);
      expect(result.value.has('employee_administrator_basic')).toBe(true);
      expect(result.value.has('employee_logistics_operator')).toBe(true);

      const productionWorker = result.value.get('employee_production_worker');
      expect(productionWorker?.displayName).toBe('Produktionsmitarbeiter');
      expect(productionWorker?.category).toBe('production');
      expect(productionWorker?.salary).toBe(120);
    }
  });

  it('returns employee types in deterministic order', async () => {
    const result = await loader.loadFromDirectory(gameContentDirectory);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.getAll().map((employee) => employee.id)).toEqual([
        'employee_administrator_basic',
        'employee_engineer_basic',
        'employee_logistics_operator',
        'employee_production_worker',
        'employee_researcher_basic',
      ]);
    }
  });

  it('rejects duplicate employee ids across files', async () => {
    const registry = new EmployeeRegistry();
    const employeeResult = await loader.loadFile(
      path.join(gameContentDirectory, 'employee_production_worker.yaml'),
    );

    expect(employeeResult.ok).toBe(true);

    if (employeeResult.ok) {
      const firstRegister = registry.register(employeeResult.value);
      const secondRegister = registry.register(employeeResult.value);

      expect(firstRegister.ok).toBe(true);
      expect(secondRegister.ok).toBe(false);
    }
  });

  it('rejects invalid global ids', () => {
    const result = validateEmployeeDefinition({
      id: 'INVALID-ID',
      version: 1,
      displayName: 'Invalid',
      category: 'production',
      profession: 'worker',
      cost: 100,
      salary: 10,
      productivity: 1,
      description: 'Invalid id test.',
      enabled: true,
      tags: [],
    });

    expect(result.ok).toBe(false);
  });

  it('rejects non-positive salary and cost values', () => {
    const result = validateEmployeeDefinition({
      id: 'employee_invalid_cost',
      version: 1,
      displayName: 'Invalid Cost',
      category: 'production',
      profession: 'worker',
      cost: 0,
      salary: 10,
      productivity: 1,
      description: 'Invalid cost test.',
      enabled: true,
      tags: [],
    });

    expect(result.ok).toBe(false);
  });
});
