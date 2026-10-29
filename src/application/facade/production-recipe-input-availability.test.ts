import { describe, expect, it } from 'vitest';
import { computeRecipeInputAvailability } from './production-recipe-input-availability.js';
import type { InventoryReadModel } from '../read-models/InventoryReadModel.js';
import type { WarehouseStorageReadModel } from '../read-models/WarehouseStorageReadModel.js';

function inventory(
  items: readonly { resourceId: string; available: number }[],
): InventoryReadModel {
  return {
    id: 'inv_1',
    companyId: 'company_1',
    status: 'ACTIVE',
    items: items.map((item) =>
      Object.freeze({
        resourceId: item.resourceId,
        quantity: item.available,
        reserved: 0,
        available: item.available,
      }),
    ),
  };
}

function warehouse(
  items: readonly { resourceId: string; available: number }[],
): WarehouseStorageReadModel {
  return {
    buildingId: 'wh_1',
    buildingName: 'Lager',
    storageCapacity: 100,
    usedCapacity: 0,
    availableCapacity: 100,
    items: items.map((item) =>
      Object.freeze({
        resourceId: item.resourceId,
        quantity: item.available,
        reserved: 0,
        available: item.available,
      }),
    ),
  };
}

describe('computeRecipeInputAvailability', () => {
  it('Test A — sufficient single input', () => {
    const rows = computeRecipeInputAvailability(
      [{ resource: 'wood', amount: 10 }],
      {
        inventory: inventory([{ resourceId: 'wood', available: 25 }]),
        warehouseStorage: [],
      },
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]?.requiredQuantity).toBe(10);
    expect(rows[0]?.availableQuantity).toBe(25);
    expect(rows[0]?.isSufficient).toBe(true);
  });

  it('Test B — insufficient single input', () => {
    const rows = computeRecipeInputAvailability(
      [{ resource: 'steel', amount: 3 }],
      {
        inventory: inventory([{ resourceId: 'steel', available: 1 }]),
        warehouseStorage: [],
      },
    );

    expect(rows[0]?.requiredQuantity).toBe(3);
    expect(rows[0]?.availableQuantity).toBe(1);
    expect(rows[0]?.isSufficient).toBe(false);
  });

  it('Test C — multi-input recipe with mixed sufficiency', () => {
    const rows = computeRecipeInputAvailability(
      [
        { resource: 'machine_parts', amount: 4 },
        { resource: 'steel', amount: 2 },
      ],
      {
        inventory: inventory([
          { resourceId: 'machine_parts', available: 5 },
          { resourceId: 'steel', available: 1 },
        ]),
        warehouseStorage: [],
      },
    );

    expect(rows).toHaveLength(2);
    expect(rows.find((row) => row.resourceId === 'machine_parts')?.isSufficient).toBe(true);
    expect(rows.find((row) => row.resourceId === 'steel')?.isSufficient).toBe(false);
  });

  it('Test D — warehouse contribution without double-counting on-site', () => {
    const rows = computeRecipeInputAvailability(
      [{ resource: 'wood', amount: 10 }],
      {
        inventory: inventory([{ resourceId: 'wood', available: 2 }]),
        warehouseStorage: [warehouse([{ resourceId: 'wood', available: 8 }])],
      },
    );

    expect(rows[0]?.availableQuantity).toBe(10);
    expect(rows[0]?.isSufficient).toBe(true);
  });

  it('Test E — uses available not gross quantity when reserved', () => {
    const inv: InventoryReadModel = {
      id: 'inv_1',
      companyId: 'company_1',
      status: 'ACTIVE',
      items: [
        {
          resourceId: 'steel',
          quantity: 10,
          reserved: 9,
          available: 1,
        },
      ],
    };

    const rows = computeRecipeInputAvailability([{ resource: 'steel', amount: 3 }], {
      inventory: inv,
      warehouseStorage: [],
    });

    expect(rows[0]?.availableQuantity).toBe(1);
    expect(rows[0]?.isSufficient).toBe(false);
  });
});
