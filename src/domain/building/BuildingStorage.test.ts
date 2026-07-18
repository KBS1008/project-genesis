import { createBuildingId } from './Building.js';
import { BuildingStorage } from './BuildingStorage.js';
import { createCompanyId } from '../company/Company.js';

function requireBuildingId(value: string) {
  const result = createBuildingId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

function requireCompanyId(value: string) {
  const result = createCompanyId(value);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.value;
}

describe('BuildingStorage', () => {
  it('tracks used and available warehouse capacity', () => {
    const storage = new BuildingStorage(
      requireBuildingId('building_warehouse_001'),
      requireCompanyId('company_001'),
      100,
    );

    expect(storage.getStorageCapacity()).toBe(100);
    expect(storage.getUsedCapacity()).toBe(0);
    expect(storage.getAvailableCapacity()).toBe(100);

    const addResult = storage.addQuantity('wood', 40);

    expect(addResult.ok).toBe(true);
    expect(storage.getUsedCapacity()).toBe(40);
    expect(storage.getAvailableCapacity()).toBe(60);
  });

  it('rejects deposits that exceed warehouse capacity', () => {
    const storage = new BuildingStorage(
      requireBuildingId('building_warehouse_001'),
      requireCompanyId('company_001'),
      50,
    );

    expect(storage.addQuantity('wood', 40).ok).toBe(true);

    const overflowResult = storage.addQuantity('iron', 20);

    expect(overflowResult.ok).toBe(false);
    expect(storage.getUsedCapacity()).toBe(40);
  });

  it('treats zero capacity as unlimited storage', () => {
    const storage = new BuildingStorage(
      requireBuildingId('building_warehouse_001'),
      requireCompanyId('company_001'),
      0,
    );

    expect(storage.addQuantity('wood', 10_000).ok).toBe(true);
    expect(storage.getUsedCapacity()).toBe(10_000);
  });
});
