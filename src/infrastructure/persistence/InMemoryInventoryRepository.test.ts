import { ManualClock } from '../../common/time/ManualClock.js';
import { createCompanyId } from '../../domain/company/Company.js';
import { Inventory, createInventoryId } from '../../domain/inventory/Inventory.js';
import { InMemoryInventoryRepository } from './InMemoryInventoryRepository.js';

function requireInventoryId(value: string) {
  const result = createInventoryId(value);

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

describe('InMemoryInventoryRepository', () => {
  it('saves and finds inventories by company id', () => {
    const repository = new InMemoryInventoryRepository();
    const clock = new ManualClock(100);
    const inventoryResult = Inventory.create({
      id: requireInventoryId('inventory_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(inventoryResult.ok).toBe(true);

    if (!inventoryResult.ok) {
      return;
    }

    repository.save(inventoryResult.value);

    expect(repository.findByCompanyId(requireCompanyId('company_001'))).toBe(inventoryResult.value);
  });
});
