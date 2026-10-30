import { describe, expect, it } from 'vitest';
import { TransportOrderStatus } from '../../domain/transport/TransportOrderStatus.js';
import { computeRecipeInputAvailability } from './production-recipe-input-availability.js';
import {
  attachRecipeInputInTransitQuantities,
  computeRecipeInputInTransitQuantity,
  type RecipeInputInTransitTransportOrder,
} from './production-recipe-input-in-transit.js';

function order(
  partial: RecipeInputInTransitTransportOrder,
): RecipeInputInTransitTransportOrder {
  return partial;
}

describe('computeRecipeInputInTransitQuantity', () => {
  it('Test A — one matching IN_PROGRESS order', () => {
    expect(
      computeRecipeInputInTransitQuantity('recipe_a', 'wood', [
        order({
          recipeId: 'recipe_a',
          resourceId: 'wood',
          status: TransportOrderStatus.IN_PROGRESS,
          amount: 10,
        }),
      ]),
    ).toBe(10);
  });

  it('Test B — multiple matching IN_PROGRESS orders', () => {
    expect(
      computeRecipeInputInTransitQuantity('recipe_a', 'wood', [
        order({
          recipeId: 'recipe_a',
          resourceId: 'wood',
          status: TransportOrderStatus.IN_PROGRESS,
          amount: 5,
        }),
        order({
          recipeId: 'recipe_a',
          resourceId: 'wood',
          status: TransportOrderStatus.IN_PROGRESS,
          amount: 7,
        }),
      ]),
    ).toBe(12);
  });

  it('Test C — different recipe excluded', () => {
    expect(
      computeRecipeInputInTransitQuantity('recipe_a', 'wood', [
        order({
          recipeId: 'recipe_b',
          resourceId: 'wood',
          status: TransportOrderStatus.IN_PROGRESS,
          amount: 7,
        }),
      ]),
    ).toBe(0);
  });

  it('Test D — different resource excluded', () => {
    expect(
      computeRecipeInputInTransitQuantity('recipe_a', 'wood', [
        order({
          recipeId: 'recipe_a',
          resourceId: 'steel',
          status: TransportOrderStatus.IN_PROGRESS,
          amount: 7,
        }),
      ]),
    ).toBe(0);
  });

  it('Test E — WAITING excluded', () => {
    expect(
      computeRecipeInputInTransitQuantity('recipe_a', 'wood', [
        order({
          recipeId: 'recipe_a',
          resourceId: 'wood',
          status: TransportOrderStatus.WAITING,
          amount: 10,
        }),
      ]),
    ).toBe(0);
  });

  it('Test F — COMPLETED excluded', () => {
    expect(
      computeRecipeInputInTransitQuantity('recipe_a', 'wood', [
        order({
          recipeId: 'recipe_a',
          resourceId: 'wood',
          status: TransportOrderStatus.COMPLETED,
          amount: 10,
        }),
      ]),
    ).toBe(0);
  });

  it('Test G — CANCELLED excluded', () => {
    expect(
      computeRecipeInputInTransitQuantity('recipe_a', 'wood', [
        order({
          recipeId: 'recipe_a',
          resourceId: 'wood',
          status: TransportOrderStatus.CANCELLED,
          amount: 10,
        }),
      ]),
    ).toBe(0);
  });

  it('Test H — empty transport list', () => {
    expect(computeRecipeInputInTransitQuantity('recipe_a', 'wood', [])).toBe(0);
  });

  it('Test I — missing recipe attribution excluded', () => {
    expect(
      computeRecipeInputInTransitQuantity('recipe_a', 'wood', [
        order({
          recipeId: null,
          resourceId: 'wood',
          status: TransportOrderStatus.IN_PROGRESS,
          amount: 10,
        }),
      ]),
    ).toBe(0);
  });

  it('Test J — multiple jobs same recipe aggregated', () => {
    expect(
      computeRecipeInputInTransitQuantity('recipe_a', 'wood', [
        order({
          recipeId: 'recipe_a',
          resourceId: 'wood',
          status: TransportOrderStatus.IN_PROGRESS,
          amount: 3,
        }),
        order({
          recipeId: 'recipe_a',
          resourceId: 'wood',
          status: TransportOrderStatus.IN_PROGRESS,
          amount: 4,
        }),
      ]),
    ).toBe(7);
  });

  it('Test K — different destination buildings still aggregated', () => {
    expect(
      computeRecipeInputInTransitQuantity('recipe_a', 'wood', [
        order({
          recipeId: 'recipe_a',
          resourceId: 'wood',
          status: TransportOrderStatus.IN_PROGRESS,
          amount: 2,
        }),
        order({
          recipeId: 'recipe_a',
          resourceId: 'wood',
          status: TransportOrderStatus.IN_PROGRESS,
          amount: 3,
        }),
      ]),
    ).toBe(5);
  });

  it('Test L — mixed statuses only IN_PROGRESS counts', () => {
    expect(
      computeRecipeInputInTransitQuantity('recipe_a', 'wood', [
        order({
          recipeId: 'recipe_a',
          resourceId: 'wood',
          status: TransportOrderStatus.IN_PROGRESS,
          amount: 4,
        }),
        order({
          recipeId: 'recipe_a',
          resourceId: 'wood',
          status: TransportOrderStatus.WAITING,
          amount: 100,
        }),
      ]),
    ).toBe(4);
  });
});

describe('attachRecipeInputInTransitQuantities', () => {
  it('Test M — no double counting via attach', () => {
    const rows = attachRecipeInputInTransitQuantities(
      'recipe_a',
      computeRecipeInputAvailability([{ resource: 'wood', amount: 10 }], {
        inventory: {
          id: 'inv',
          companyId: 'co',
          status: 'ACTIVE',
          items: [{ resourceId: 'wood', quantity: 2, reserved: 0, available: 2 }],
        },
        warehouseStorage: [],
      }),
      [
        order({
          recipeId: 'recipe_a',
          resourceId: 'wood',
          status: TransportOrderStatus.IN_PROGRESS,
          amount: 8,
        }),
      ],
    );

    expect(rows[0]?.inTransitQuantity).toBe(8);
    expect(rows[0]?.availableQuantity).toBe(2);
    expect(rows[0]?.isSufficient).toBe(false);
  });

  it('Test N — preserves input ordering', () => {
    const rows = attachRecipeInputInTransitQuantities(
      'recipe_a',
      computeRecipeInputAvailability(
        [
          { resource: 'steel', amount: 1 },
          { resource: 'wood', amount: 2 },
        ],
        {
          inventory: {
            id: 'inv',
            companyId: 'co',
            status: 'ACTIVE',
            items: [],
          },
          warehouseStorage: [],
        },
      ),
      [],
    );

    expect(rows.map((row) => row.resourceId)).toEqual(['steel', 'wood']);
  });

  it('Test O — availability independence', () => {
    const base = computeRecipeInputAvailability([{ resource: 'wood', amount: 10 }], {
      inventory: {
        id: 'inv',
        companyId: 'co',
        status: 'ACTIVE',
        items: [{ resourceId: 'wood', quantity: 2, reserved: 0, available: 2 }],
      },
      warehouseStorage: [
        {
          buildingId: 'wh',
          buildingName: 'Lager',
          storageCapacity: 100,
          usedCapacity: 3,
          availableCapacity: 97,
          items: [{ resourceId: 'wood', quantity: 3, reserved: 0, available: 3 }],
        },
      ],
    });

    const rows = attachRecipeInputInTransitQuantities('recipe_a', base, [
      order({
        recipeId: 'recipe_a',
        resourceId: 'wood',
        status: TransportOrderStatus.IN_PROGRESS,
        amount: 8,
      }),
    ]);

    expect(rows[0]?.onSiteAvailable).toBe(2);
    expect(rows[0]?.warehouseAvailable).toBe(3);
    expect(rows[0]?.availableQuantity).toBe(5);
    expect(rows[0]?.inTransitQuantity).toBe(8);
    expect(rows[0]?.isSufficient).toBe(false);
  });
});
