import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApiTestApp } from './support/create-api-test-app.js';

type BuildingRow = {
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly buildingTypeId: string;
  readonly regionId: string;
};

type InventoryItem = {
  readonly resourceId: string;
  readonly quantity: number;
};

type DashboardData = {
  readonly tickNumber: number;
  readonly completedMilestones: readonly string[];
  readonly completedResearch: readonly string[];
  readonly inventory: { readonly items: readonly InventoryItem[] } | null;
  readonly warehouseStorage: readonly {
    readonly buildingId: string;
    readonly items: readonly { readonly resourceId: string; readonly quantity: number }[];
  }[];
  readonly transportOrders: readonly {
    readonly id: string;
    readonly resourceId: string;
    readonly status: string;
    readonly routeId: string | null;
    readonly destinationBuildingName: string;
  }[];
  readonly finance: { readonly cashBalance: number } | null;
  readonly financeTransactions: readonly { readonly transactionType: string }[];
};

function inventoryQuantity(items: readonly InventoryItem[], resourceId: string): number {
  return items.find((item) => item.resourceId === resourceId)?.quantity ?? 0;
}

function warehouseQuantity(
  warehouseStorage: DashboardData['warehouseStorage'],
  resourceId: string,
): number {
  return warehouseStorage
    .flatMap((warehouse) => warehouse.items)
    .filter((item) => item.resourceId === resourceId)
    .reduce((total, item) => total + item.quantity, 0);
}

async function readDashboard(app: INestApplication): Promise<DashboardData> {
  const dashboard = await request(app.getHttpServer()).get('/api/dashboard');

  expect(dashboard.status).toBe(200);
  return dashboard.body.data as DashboardData;
}

async function readDashboardInventory(
  app: INestApplication,
): Promise<readonly InventoryItem[]> {
  const dashboard = await readDashboard(app);
  return dashboard.inventory?.items ?? [];
}

async function ensureInventoryMinimum(
  app: INestApplication,
  resourceId: string,
  minimum: number,
): Promise<void> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const items = await readDashboardInventory(app);
    const current = inventoryQuantity(items, resourceId);

    if (current >= minimum) {
      return;
    }

    const buyResponse = await request(app.getHttpServer())
      .post('/api/market/buy')
      .send({ resourceId, amount: Math.max(minimum - current, 5) });

    expect(buyResponse.status).toBe(200);
    expect(buyResponse.body.ok).toBe(true);
  }

  const finalItems = await readDashboardInventory(app);
  expect(inventoryQuantity(finalItems, resourceId)).toBeGreaterThanOrEqual(minimum);
}

async function advanceTicks(app: INestApplication, count: number): Promise<void> {
  const response = await request(app.getHttpServer()).post('/api/simulation/tick').send({ count });

  expect(response.status).toBe(200);
  expect(response.body.ok).toBe(true);
}

async function waitForActiveBuilding(
  app: INestApplication,
  buildingId: string,
  maxTicks = 250,
): Promise<void> {
  for (let elapsed = 0; elapsed < maxTicks; elapsed += 10) {
    const buildings = await request(app.getHttpServer()).get('/api/buildings');
    const building = buildings.body.data.find((entry: BuildingRow) => entry.id === buildingId);

    if (building?.status === 'ACTIVE') {
      return;
    }

    await advanceTicks(app, 10);
  }

  const buildings = await request(app.getHttpServer()).get('/api/buildings');
  const building = buildings.body.data.find((entry: BuildingRow) => entry.id === buildingId);

  expect(building?.status).toBe('ACTIVE');
}

async function waitForMilestone(
  app: INestApplication,
  milestoneId: string,
  maxTicks = 200,
): Promise<void> {
  for (let elapsed = 0; elapsed < maxTicks; elapsed += 5) {
    const dashboard = await readDashboard(app);

    if (dashboard.completedMilestones.includes(milestoneId)) {
      return;
    }

    await advanceTicks(app, 5);
  }

  const dashboard = await readDashboard(app);
  expect(dashboard.completedMilestones).toContain(milestoneId);
}

async function waitForResearch(
  app: INestApplication,
  technologyId: string,
  maxTicks = 200,
): Promise<void> {
  for (let elapsed = 0; elapsed < maxTicks; elapsed += 5) {
    const dashboard = await readDashboard(app);

    if (dashboard.completedResearch.includes(technologyId)) {
      return;
    }

    await advanceTicks(app, 5);
  }

  const dashboard = await readDashboard(app);
  expect(dashboard.completedResearch).toContain(technologyId);
}

async function placeBuilding(
  app: INestApplication,
  input: {
    readonly buildingTypeId: string;
    readonly name: string;
    readonly x: number;
    readonly y: number;
    readonly regionId?: string;
  },
): Promise<string> {
  const placeResponse = await request(app.getHttpServer()).post('/api/buildings/place').send(input);

  expect(placeResponse.status, JSON.stringify(placeResponse.body)).toBe(200);
  expect(placeResponse.body.ok).toBe(true);

  return placeResponse.body.data as string;
}

async function startProduction(
  app: INestApplication,
  buildingId: string,
  recipeId: string,
): Promise<void> {
  const productionResponse = await request(app.getHttpServer()).post('/api/production/start').send({
    buildingId,
    recipeId,
  });

  expect(productionResponse.status, JSON.stringify(productionResponse.body)).toBe(200);
  expect(productionResponse.body.ok).toBe(true);
}

async function waitForInventoryMinimum(
  app: INestApplication,
  resourceId: string,
  minimum: number,
  maxTicks = 200,
): Promise<void> {
  for (let elapsed = 0; elapsed < maxTicks; elapsed += 10) {
    const items = await readDashboardInventory(app);

    if (inventoryQuantity(items, resourceId) >= minimum) {
      return;
    }

    await advanceTicks(app, 10);
  }

  const items = await readDashboardInventory(app);
  expect(inventoryQuantity(items, resourceId)).toBeGreaterThanOrEqual(minimum);
}

async function hireAndAssignWorkers(
  app: INestApplication,
  buildingId: string,
  count: number,
): Promise<void> {
  for (let index = 0; index < count; index += 1) {
    const hireResponse = await request(app.getHttpServer()).post('/api/employees/hire').send({
      employeeTypeId: 'employee_production_worker',
      displayName: `Worker ${buildingId}-${index + 1}`,
    });

    expect(hireResponse.status).toBe(200);
    expect(hireResponse.body.ok).toBe(true);

    const assignResponse = await request(app.getHttpServer()).post('/api/employees/assign').send({
      employeeId: hireResponse.body.data,
      buildingId,
    });

    expect(assignResponse.status).toBe(200);
    expect(assignResponse.body.ok).toBe(true);
  }
}

async function sellUntilMilestone(
  app: INestApplication,
  resourceId: string,
  milestoneId: string,
): Promise<void> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const dashboard = await readDashboard(app);

    if (dashboard.completedMilestones.includes(milestoneId)) {
      return;
    }

    const available = inventoryQuantity(dashboard.inventory?.items ?? [], resourceId);

    if (available <= 0) {
      break;
    }

    const sellResponse = await request(app.getHttpServer())
      .post('/api/market/sell')
      .send({ resourceId, amount: Math.min(available, 10) });

    expect(sellResponse.status).toBe(200);
    expect(sellResponse.body.ok).toBe(true);

    await advanceTicks(app, 1);
  }

  await waitForMilestone(app, milestoneId);
}

async function ensureCashMinimum(
  app: INestApplication,
  minimum: number,
  options: { readonly sawmillId?: string } = {},
): Promise<void> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const financeResponse = await request(app.getHttpServer()).get('/api/finance');

    expect(financeResponse.status).toBe(200);

    if ((financeResponse.body.data.availableCash as number) >= minimum) {
      return;
    }

    const items = await readDashboardInventory(app);
    let soldResource = false;

    for (const resourceId of ['planks', 'steel'] as const) {
      const available = inventoryQuantity(items, resourceId);

      if (available <= 0 || (resourceId === 'steel' && available <= 3)) {
        continue;
      }

      const sellResponse = await request(app.getHttpServer())
        .post('/api/market/sell')
        .send({
          resourceId,
          amount:
            resourceId === 'steel'
              ? Math.min(Math.max(available - 3, 0), 5)
              : Math.min(available, 5),
        });

      expect(sellResponse.status).toBe(200);
      expect(sellResponse.body.ok).toBe(true);
      await advanceTicks(app, 1);
      soldResource = true;
      break;
    }

    if (soldResource || options.sawmillId === undefined) {
      continue;
    }

    const wood = inventoryQuantity(items, 'wood');

    if (wood < 10) {
      await ensureInventoryMinimum(app, 'wood', 10);
    }

    await startProduction(app, options.sawmillId, 'recipe_planks');
    await advanceTicks(app, 80);
  }

  const financeResponse = await request(app.getHttpServer()).get('/api/finance');
  expect(financeResponse.body.data.availableCash).toBeGreaterThanOrEqual(minimum);
}

describe('M10 industrial chain flow (API E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApiTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it(
    'runs research → unlock → building → production → warehouse → transport → market → finance',
    async () => {
      const newGameResponse = await request(app.getHttpServer())
        .post('/api/session/new')
        .send({ name: 'M10 E2E Corp' });

      expect(newGameResponse.status).toBe(200);
      expect(newGameResponse.body.ok).toBe(true);

      await ensureInventoryMinimum(app, 'wood', 10);

      const sawmillId = await placeBuilding(app, {
        buildingTypeId: 'sawmill',
        name: 'E2E Sawmill',
        x: 24,
        y: 24,
      });

      await waitForActiveBuilding(app, sawmillId);
      await ensureInventoryMinimum(app, 'wood', 10);
      await hireAndAssignWorkers(app, sawmillId, 2);

      const productionResponse = await request(app.getHttpServer()).post('/api/production/start').send({
        buildingId: sawmillId,
        recipeId: 'recipe_planks',
      });

      expect(productionResponse.status).toBe(200);
      expect(productionResponse.body.ok).toBe(true);

      await advanceTicks(app, 80);
      await waitForMilestone(app, 'first_production');

      const inventoryAfterPlanks = await readDashboardInventory(app);
      expect(inventoryQuantity(inventoryAfterPlanks, 'planks')).toBeGreaterThan(0);

      await sellUntilMilestone(app, 'planks', 'profit_100');

      for (let cycle = 0; cycle < 8; cycle += 1) {
        const financeResponse = await request(app.getHttpServer()).get('/api/finance');

        if ((financeResponse.body.data.availableCash as number) >= 70_000) {
          break;
        }

        const items = await readDashboardInventory(app);
        const planks = inventoryQuantity(items, 'planks');

        if (planks > 0) {
          const sellResponse = await request(app.getHttpServer())
            .post('/api/market/sell')
            .send({ resourceId: 'planks', amount: Math.min(planks, 10) });

          expect(sellResponse.status).toBe(200);
          expect(sellResponse.body.ok).toBe(true);
          await advanceTicks(app, 1);
          continue;
        }

        await ensureInventoryMinimum(app, 'wood', 10);
        await startProduction(app, sawmillId, 'recipe_planks');
        await advanceTicks(app, 80);
      }

      await ensureCashMinimum(app, 70_000, { sawmillId });

      const researchWoodResponse = await request(app.getHttpServer())
        .post('/api/research/start')
        .send({ technologyId: 'basic_woodworking' });

      expect(researchWoodResponse.status).toBe(200);
      expect(researchWoodResponse.body.ok).toBe(true);

      await waitForResearch(app, 'basic_woodworking', 120);

      const dashboardAfterWoodResearch = await readDashboard(app);
      expect(dashboardAfterWoodResearch.completedResearch).toContain('basic_woodworking');
      expect(dashboardAfterWoodResearch.warehouseStorage.length).toBeGreaterThan(0);

      const dashboardBeforeOre = await readDashboard(app);
      const starterIronOre = inventoryQuantity(dashboardBeforeOre.inventory?.items ?? [], 'iron_ore');

      if (starterIronOre > 0) {
        const sellStarterOreResponse = await request(app.getHttpServer())
          .post('/api/market/sell')
          .send({ resourceId: 'iron_ore', amount: starterIronOre });

        expect(sellStarterOreResponse.status).toBe(200);
        expect(sellStarterOreResponse.body.ok).toBe(true);
        await advanceTicks(app, 1);
      }

      const powerPlantId = await placeBuilding(app, {
        buildingTypeId: 'coal_power_plant',
        name: 'E2E Coal Plant',
        x: 30,
        y: 24,
      });

      await waitForActiveBuilding(app, powerPlantId, 300);

      const smelterId = await placeBuilding(app, {
        buildingTypeId: 'smelter',
        name: 'E2E Smelter',
        x: 32,
        y: 24,
        regionId: 'region_east',
      });

      await waitForActiveBuilding(app, smelterId, 300);
      await hireAndAssignWorkers(app, smelterId, 2);

      const buyOreResponse = await request(app.getHttpServer())
        .post('/api/market/buy')
        .send({ resourceId: 'iron_ore', amount: 10 });

      expect(buyOreResponse.status).toBe(200);
      expect(buyOreResponse.body.ok).toBe(true);

      const dashboardAfterBuy = await readDashboard(app);
      expect(warehouseQuantity(dashboardAfterBuy.warehouseStorage, 'iron_ore')).toBeGreaterThanOrEqual(10);
      expect(inventoryQuantity(dashboardAfterBuy.inventory?.items ?? [], 'iron_ore')).toBe(0);

      const steelProductionResponse = await request(app.getHttpServer())
        .post('/api/production/start')
        .send({
          buildingId: smelterId,
          recipeId: 'recipe_steel',
        });

      expect(steelProductionResponse.status, JSON.stringify(steelProductionResponse.body)).toBe(200);
      expect(steelProductionResponse.body.ok).toBe(true);

      const transportOrdersResponse = await request(app.getHttpServer()).get('/api/transport/orders');
      expect(transportOrdersResponse.status).toBe(200);

      const transportOrders = transportOrdersResponse.body.data as DashboardData['transportOrders'];
      expect(transportOrders.length).toBeGreaterThan(0);
      expect(transportOrders.some((order) => order.resourceId === 'iron_ore')).toBe(true);
      expect(
        transportOrders.some((order) => order.routeId?.includes('region_default->region_east') ?? false),
      ).toBe(true);

      await advanceTicks(app, 150);
      await waitForMilestone(app, 'first_steel', 200);

      const dashboardAfterSteel = await readDashboard(app);
      expect(dashboardAfterSteel.completedMilestones).toContain('first_steel');

      let steelQuantity = inventoryQuantity(dashboardAfterSteel.inventory?.items ?? [], 'steel');

      if (steelQuantity < 3) {
        await startProduction(app, smelterId, 'recipe_steel');
        await advanceTicks(app, 150);
        await waitForInventoryMinimum(app, 'steel', 3, 200);
        steelQuantity = inventoryQuantity(await readDashboardInventory(app), 'steel');
      }

      expect(steelQuantity).toBeGreaterThanOrEqual(3);

      const researchMetalResponse = await request(app.getHttpServer())
        .post('/api/research/start')
        .send({ technologyId: 'advanced_metallurgy' });

      expect(researchMetalResponse.status).toBe(200);
      expect(researchMetalResponse.body.ok).toBe(true);

      await waitForResearch(app, 'advanced_metallurgy', 150);

      await ensureCashMinimum(app, 14_000, { sawmillId });

      const machineShopSteel = inventoryQuantity(await readDashboardInventory(app), 'steel');
      expect(machineShopSteel).toBeGreaterThanOrEqual(3);

      const machineShopId = await placeBuilding(app, {
        buildingTypeId: 'machine_shop',
        name: 'E2E Machine Shop',
        x: 36,
        y: 24,
        regionId: 'region_east',
      });

      await waitForActiveBuilding(app, machineShopId, 300);
      await hireAndAssignWorkers(app, machineShopId, 2);

      await startProduction(app, machineShopId, 'recipe_machine_parts');

      await advanceTicks(app, 100);

      const dashboardAfterMachineParts = await readDashboard(app);
      expect(
        inventoryQuantity(dashboardAfterMachineParts.inventory?.items ?? [], 'machine_parts'),
      ).toBeGreaterThan(0);

      const sellMachinePartsResponse = await request(app.getHttpServer())
        .post('/api/market/sell')
        .send({ resourceId: 'machine_parts', amount: 1 });

      expect(sellMachinePartsResponse.status).toBe(200);
      expect(sellMachinePartsResponse.body.ok).toBe(true);

      await advanceTicks(app, 1);

      const financeResponse = await request(app.getHttpServer()).get('/api/finance');
      expect(financeResponse.status).toBe(200);
      expect(financeResponse.body.data.cashBalance).toBeGreaterThan(0);

      const transactionsResponse = await request(app.getHttpServer()).get('/api/finance/transactions');
      expect(transactionsResponse.status).toBe(200);

      const transactionTypes = new Set(
        transactionsResponse.body.data.map(
          (transaction: { transactionType: string }) => transaction.transactionType,
        ),
      );

      expect(transactionTypes.has('SALE')).toBe(true);
      expect(transactionTypes.has('RESEARCH_COST')).toBe(true);
      expect(transactionTypes.has('BUILDING_COST')).toBe(true);
      expect(transactionTypes.has('PURCHASE')).toBe(true);

      const finalDashboard = await readDashboard(app);
      expect(finalDashboard.completedResearch).toEqual(
        expect.arrayContaining(['basic_woodworking', 'advanced_metallurgy']),
      );
      expect(finalDashboard.completedMilestones).toEqual(
        expect.arrayContaining(['first_production', 'profit_100', 'first_steel']),
      );
      expect(finalDashboard.transportOrders.some((order) => order.status === 'COMPLETED')).toBe(true);
    },
    300_000,
  );
});
