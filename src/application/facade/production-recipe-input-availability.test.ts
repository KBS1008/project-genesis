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
    expect(rows[0]?.onSiteAvailable).toBe(25);
    expect(rows[0]?.warehouseAvailable).toBe(0);
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
    expect(rows[0]?.onSiteAvailable).toBe(2);
    expect(rows[0]?.warehouseAvailable).toBe(8);
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
    expect(rows[0]?.onSiteAvailable).toBe(1);
    expect(rows[0]?.isSufficient).toBe(false);
  });

  it('Test F — site-only stock with zero warehouse', () => {
    const rows = computeRecipeInputAvailability(
      [{ resource: 'wood', amount: 5 }],
      {
        inventory: inventory([{ resourceId: 'wood', available: 7 }]),
        warehouseStorage: [],
      },
    );

    expect(rows[0]?.onSiteAvailable).toBe(7);
    expect(rows[0]?.warehouseAvailable).toBe(0);
    expect(rows[0]?.availableQuantity).toBe(7);
  });

  it('Test G — warehouse-only stock', () => {
    const rows = computeRecipeInputAvailability(
      [{ resource: 'steel', amount: 3 }],
      {
        inventory: inventory([]),
        warehouseStorage: [warehouse([{ resourceId: 'steel', available: 9 }])],
      },
    );

    expect(rows[0]?.onSiteAvailable).toBe(0);
    expect(rows[0]?.warehouseAvailable).toBe(9);
    expect(rows[0]?.availableQuantity).toBe(9);
  });

  it('Test H — reserved warehouse stock excluded from warehouse availability', () => {
    const wh: WarehouseStorageReadModel = {
      buildingId: 'wh_1',
      buildingName: 'Lager',
      storageCapacity: 100,
      usedCapacity: 12,
      availableCapacity: 88,
      items: [
        {
          resourceId: 'wood',
          quantity: 12,
          reserved: 5,
          available: 7,
        },
      ],
    };

    const rows = computeRecipeInputAvailability([{ resource: 'wood', amount: 10 }], {
      inventory: inventory([]),
      warehouseStorage: [wh],
    });

    expect(rows[0]?.warehouseAvailable).toBe(7);
    expect(rows[0]?.onSiteAvailable).toBe(0);
    expect(rows[0]?.availableQuantity).toBe(7);
    expect(rows[0]?.isSufficient).toBe(false);
  });

  it('Test I — multiple warehouses aggregate warehouse availability', () => {
    const rows = computeRecipeInputAvailability(
      [{ resource: 'wood', amount: 10 }],
      {
        inventory: inventory([{ resourceId: 'wood', available: 1 }]),
        warehouseStorage: [
          warehouse([{ resourceId: 'wood', available: 4 }]),
          {
            buildingId: 'wh_2',
            buildingName: 'Lager 2',
            storageCapacity: 50,
            usedCapacity: 0,
            availableCapacity: 50,
            items: [
              {
                resourceId: 'wood',
                quantity: 6,
                reserved: 0,
                available: 6,
              },
            ],
          },
        ],
      },
    );

    expect(rows[0]?.onSiteAvailable).toBe(1);
    expect(rows[0]?.warehouseAvailable).toBe(10);
    expect(rows[0]?.availableQuantity).toBe(11);
    expect(rows[0]?.availableQuantity).toBe(
      (rows[0]?.onSiteAvailable ?? 0) + (rows[0]?.warehouseAvailable ?? 0),
    );
  });

  it('Test J — missing resource entries use zero availability', () => {
    const rows = computeRecipeInputAvailability(
      [{ resource: 'missing_resource', amount: 1 }],
      {
        inventory: inventory([{ resourceId: 'wood', available: 5 }]),
        warehouseStorage: [warehouse([{ resourceId: 'steel', available: 3 }])],
      },
    );

    expect(rows[0]?.onSiteAvailable).toBe(0);
    expect(rows[0]?.warehouseAvailable).toBe(0);
    expect(rows[0]?.availableQuantity).toBe(0);
  });

  it('Test K — preserves recipe input order', () => {
    const rows = computeRecipeInputAvailability(
      [
        { resource: 'steel', amount: 1 },
        { resource: 'wood', amount: 2 },
      ],
      {
        inventory: inventory([
          { resourceId: 'steel', available: 1 },
          { resourceId: 'wood', available: 2 },
        ]),
        warehouseStorage: [],
      },
    );

    expect(rows.map((row) => row.resourceId)).toEqual(['steel', 'wood']);
  });
});
