import { ManualClock } from '../../common/time/ManualClock.js';
import { createCompanyId } from '../company/Company.js';
import { Inventory, createInventoryId } from './Inventory.js';
import type { InventoryChanged } from './events/InventoryChanged.js';
import { InventoryStatus } from './InventoryStatus.js';

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

describe('Inventory', () => {
  it('creates an empty active inventory for a company', () => {
    const clock = new ManualClock(100);
    const result = Inventory.create({
      id: requireInventoryId('inventory_001'),
      companyId: requireCompanyId('company_001'),
      clock,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.getStatus()).toBe(InventoryStatus.ACTIVE);
      expect(result.value.getCreatedAt()).toBe(100);
      expect(result.value.getItems()).toEqual([]);
    }
  });

  it('adds resource quantities and raises InventoryChanged', () => {
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

    const inventory = inventoryResult.value;
    const addResult = inventory.addQuantity('wood', 10, clock);

    expect(addResult.ok).toBe(true);
    expect(inventory.getAvailableQuantity(inventory.getItems()[0]!.resourceId)).toBe(10);

    const events = inventory.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect((events[0] as InventoryChanged).resourceId).toBe('wood');
  });

  it('reserves available quantity', () => {
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

    const inventory = inventoryResult.value;
    inventory.addQuantity('wood', 10, clock);
    inventory.pullDomainEvents();

    const reserveResult = inventory.reserveQuantity('wood', 4, clock);

    expect(reserveResult.ok).toBe(true);
    expect(inventory.getAvailableQuantity(inventory.getItems()[0]!.resourceId)).toBe(6);
  });

  it('rejects reservations above available quantity', () => {
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

    const inventory = inventoryResult.value;
    inventory.addQuantity('wood', 5, clock);

    const reserveResult = inventory.reserveQuantity('wood', 6, clock);

    expect(reserveResult.ok).toBe(false);
  });

  it('releases reserved quantity', () => {
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

    const inventory = inventoryResult.value;
    inventory.addQuantity('wood', 10, clock);
    inventory.reserveQuantity('wood', 4, clock);
    inventory.pullDomainEvents();

    const releaseResult = inventory.releaseReserved('wood', 4, clock);

    expect(releaseResult.ok).toBe(true);
    expect(inventory.getAvailableQuantity(inventory.getItems()[0]!.resourceId)).toBe(10);
  });

  it('consumes reserved quantity from stock', () => {
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

    const inventory = inventoryResult.value;
    inventory.addQuantity('wood', 10, clock);
    inventory.reserveQuantity('wood', 4, clock);
    inventory.pullDomainEvents();

    const consumeResult = inventory.consumeReserved('wood', 4, clock);

    expect(consumeResult.ok).toBe(true);
    expect(inventory.getItems()[0]?.quantity).toBe(6);
    expect(inventory.getItems()[0]?.reserved).toBe(0);
  });

  it('removes available quantity without affecting reservations', () => {
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

    const inventory = inventoryResult.value;
    inventory.addQuantity('wood', 10, clock);
    inventory.reserveQuantity('wood', 4, clock);
    inventory.pullDomainEvents();

    const removeResult = inventory.removeQuantity('wood', 3, clock);

    expect(removeResult.ok).toBe(true);
    expect(inventory.getItems()[0]?.quantity).toBe(7);
    expect(inventory.getItems()[0]?.reserved).toBe(4);
    expect(inventory.getAvailableQuantity(inventory.getItems()[0]!.resourceId)).toBe(3);
  });
});
