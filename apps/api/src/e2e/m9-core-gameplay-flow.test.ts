import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApiTestApp } from './support/create-api-test-app.js';

type BuildingRow = {
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly buildingTypeId: string;
};

type InventoryItem = {
  readonly resourceId: string;
  readonly quantity: number;
};

function inventoryQuantity(items: readonly InventoryItem[], resourceId: string): number {
  return items.find((item) => item.resourceId === resourceId)?.quantity ?? 0;
}

async function readDashboardInventory(
  app: INestApplication,
): Promise<readonly InventoryItem[]> {
  const dashboard = await request(app.getHttpServer()).get('/api/dashboard');

  expect(dashboard.status).toBe(200);
  return dashboard.body.data.inventory.items as InventoryItem[];
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
  maxTicks = 200,
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

describe('M9 core gameplay flow (API E2E)', () => {
  let app: INestApplication;
  const savePath = 'saves/e2e-m9-core-flow.json';

  beforeAll(async () => {
    app = await createApiTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it(
    'runs start → inspect → trade → build → produce → research → save/load → verify',
    async () => {
      const newGameResponse = await request(app.getHttpServer())
        .post('/api/session/new')
        .send({ name: 'M9 E2E Corp' });

      expect(newGameResponse.status).toBe(200);
      expect(newGameResponse.body.ok).toBe(true);

      const regionsResponse = await request(app.getHttpServer()).get('/api/world/regions');
      expect(regionsResponse.status).toBe(200);
      expect(regionsResponse.body.data.length).toBeGreaterThan(0);

      const companyResponse = await request(app.getHttpServer()).get('/api/company');
      expect(companyResponse.status).toBe(200);
      expect(companyResponse.body.data.name).toBe('M9 E2E Corp');

      await ensureInventoryMinimum(app, 'wood', 10);

      const placeResponse = await request(app.getHttpServer()).post('/api/buildings/place').send({
        buildingTypeId: 'sawmill',
        name: 'E2E Sawmill',
        x: 24,
        y: 24,
      });

      expect(placeResponse.status).toBe(200);
      expect(placeResponse.body.ok).toBe(true);

      const sawmillId = placeResponse.body.data as string;
      await waitForActiveBuilding(app, sawmillId);
      await ensureInventoryMinimum(app, 'wood', 10);

      for (let index = 0; index < 2; index += 1) {
        const hireResponse = await request(app.getHttpServer()).post('/api/employees/hire').send({
          employeeTypeId: 'employee_production_worker',
          displayName: `Worker ${index + 1}`,
        });

        expect(hireResponse.status).toBe(200);
        expect(hireResponse.body.ok).toBe(true);

        const assignResponse = await request(app.getHttpServer()).post('/api/employees/assign').send({
          employeeId: hireResponse.body.data,
          buildingId: sawmillId,
        });

        expect(assignResponse.status).toBe(200);
        expect(assignResponse.body.ok).toBe(true);
      }

      const inventoryBeforeProduction = await readDashboardInventory(app);
      const woodBeforeProduction = inventoryQuantity(inventoryBeforeProduction, 'wood');

      expect(woodBeforeProduction).toBeGreaterThanOrEqual(10);

      const productionResponse = await request(app.getHttpServer()).post('/api/production/start').send({
        buildingId: sawmillId,
        recipeId: 'recipe_planks',
      });

      expect(productionResponse.status).toBe(200);
      expect(productionResponse.body.ok).toBe(true);

      await advanceTicks(app, 80);

      const jobsResponse = await request(app.getHttpServer()).get('/api/production/jobs');
      expect(jobsResponse.status).toBe(200);
      expect(jobsResponse.body.data.length).toBeGreaterThan(0);

      const inventoryAfterProduction = await readDashboardInventory(app);
      expect(
        inventoryQuantity(inventoryAfterProduction, 'planks'),
      ).toBeGreaterThan(0);

      const sellResponse = await request(app.getHttpServer())
        .post('/api/market/sell')
        .send({ resourceId: 'planks', amount: 5 });

      expect(sellResponse.status).toBe(200);
      expect(sellResponse.body.ok).toBe(true);

      await advanceTicks(app, 1);

      const researchResponse = await request(app.getHttpServer())
        .post('/api/research/start')
        .send({ technologyId: 'basic_woodworking' });

      expect(researchResponse.status).toBe(200);
      expect(researchResponse.body.ok).toBe(true);

      const researchJobs = await request(app.getHttpServer()).get('/api/research/jobs');
      expect(researchJobs.body.data.some((job: { technologyId: string }) => job.technologyId === 'basic_woodworking')).toBe(
        true,
      );

      const transportOrders = await request(app.getHttpServer()).get('/api/transport/orders');
      expect(transportOrders.status).toBe(200);
      expect(Array.isArray(transportOrders.body.data)).toBe(true);

      const eventLog = await request(app.getHttpServer()).get('/api/events/log?limit=20');
      expect(eventLog.status).toBe(200);
      expect(eventLog.body.data.length).toBeGreaterThan(0);

      await advanceTicks(app, 1);

      const beforeSave = await request(app.getHttpServer()).get('/api/dashboard');
      const tickBeforeSave = beforeSave.body.data.tickNumber as number;
      const planksBeforeSave = inventoryQuantity(
        beforeSave.body.data.inventory.items,
        'planks',
      );

      const saveResponse = await request(app.getHttpServer())
        .post('/api/session/save')
        .send({ filePath: savePath });

      expect(saveResponse.status).toBe(200);
      expect(saveResponse.body.ok).toBe(true);

      await advanceTicks(app, 5);

      const afterAdvance = await request(app.getHttpServer()).get('/api/dashboard');
      expect(afterAdvance.body.data.tickNumber).toBeGreaterThan(tickBeforeSave);

      const loadResponse = await request(app.getHttpServer())
        .post('/api/session/load')
        .send({ filePath: savePath });

      expect(loadResponse.status).toBe(200);
      expect(loadResponse.body.ok).toBe(true);

      const afterLoad = await request(app.getHttpServer()).get('/api/dashboard');

      expect(afterLoad.body.data.company?.name).toBe('M9 E2E Corp');
      expect(afterLoad.body.data.tickNumber).toBe(tickBeforeSave);
      expect(
        inventoryQuantity(afterLoad.body.data.inventory.items, 'planks'),
      ).toBe(planksBeforeSave);

      const savesResponse = await request(app.getHttpServer()).get('/api/saves');
      expect(
        savesResponse.body.data.some(
          (save: { filePath: string }) => save.filePath.replace(/\\/g, '/') === savePath,
        ),
      ).toBe(true);
    },
    60_000,
  );
});
