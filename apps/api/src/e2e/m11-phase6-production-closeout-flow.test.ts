import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApiTestApp } from './support/create-api-test-app.js';

type InventoryItem = {
  readonly resourceId: string;
  readonly quantity: number;
};

type ProductionJobRow = {
  readonly id: string;
  readonly buildingId: string;
  readonly recipeId: string;
  readonly status: string;
  readonly operationalState: string;
  readonly progress: number;
};

type EventLogEntry = {
  readonly id: string;
  readonly message: string;
  readonly entityId: string | null;
  readonly entityType: string | null;
  readonly category: string;
};

function inventoryQuantity(items: readonly InventoryItem[], resourceId: string): number {
  return items.find((item) => item.resourceId === resourceId)?.quantity ?? 0;
}

async function readDashboardInventory(app: INestApplication): Promise<readonly InventoryItem[]> {
  const dashboard = await request(app.getHttpServer()).get('/api/dashboard');

  expect(dashboard.status).toBe(200);
  return dashboard.body.data.inventory?.items ?? [];
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
    const building = buildings.body.data.find(
      (entry: { id: string; status: string }) => entry.id === buildingId,
    );

    if (building?.status === 'ACTIVE') {
      return;
    }

    await advanceTicks(app, 10);
  }

  const buildings = await request(app.getHttpServer()).get('/api/buildings');
  const building = buildings.body.data.find(
    (entry: { id: string; status: string }) => entry.id === buildingId,
  );

  expect(building?.status).toBe('ACTIVE');
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
      .send({ resourceId, amount: Math.max(minimum - current, 10) });

    expect(buyResponse.status).toBe(200);
    expect(buyResponse.body.ok).toBe(true);
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
      displayName: `Closeout Worker ${index + 1}`,
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

async function readProductionJobs(app: INestApplication): Promise<readonly ProductionJobRow[]> {
  const response = await request(app.getHttpServer()).get('/api/production/jobs');

  expect(response.status).toBe(200);
  return response.body.data as ProductionJobRow[];
}

async function readProductionEvents(app: INestApplication): Promise<readonly EventLogEntry[]> {
  const response = await request(app.getHttpServer()).get('/api/events/log?category=PRODUCTION&limit=50');

  expect(response.status).toBe(200);
  return response.body.data as EventLogEntry[];
}

describe('M11 Phase 6.6 production closeout (API E2E)', () => {
  let app: INestApplication;
  const savePath = 'saves/e2e-m11-phase6-production-closeout.json';

  beforeAll(async () => {
    app = await createApiTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it(
    'runs production vertical slice with save/load of in-progress job and single completion event',
    async () => {
      const newGameResponse = await request(app.getHttpServer())
        .post('/api/session/new')
        .send({ name: 'M11 Phase 6.6 Closeout Corp' });

      expect(newGameResponse.status).toBe(200);
      expect(newGameResponse.body.ok).toBe(true);

      const placeResponse = await request(app.getHttpServer()).post('/api/buildings/place').send({
        buildingTypeId: 'sawmill',
        name: 'Closeout Sawmill',
        x: 22,
        y: 22,
      });

      expect(placeResponse.status).toBe(200);
      const buildingId = placeResponse.body.data as string;

      await waitForActiveBuilding(app, buildingId);
      await ensureInventoryMinimum(app, 'wood', 10);
      await hireAndAssignWorkers(app, buildingId, 2);

      const planksBefore = inventoryQuantity(await readDashboardInventory(app), 'planks');

      const startResponse = await request(app.getHttpServer()).post('/api/production/start').send({
        buildingId,
        recipeId: 'recipe_planks',
      });

      expect(startResponse.status).toBe(200);
      expect(startResponse.body.ok).toBe(true);

      const jobsAfterStart = await readProductionJobs(app);
      const startedJob = jobsAfterStart.find((job) => job.buildingId === buildingId);

      expect(startedJob).toMatchObject({
        id: expect.any(String),
        buildingId,
        recipeId: 'recipe_planks',
      });

      const jobId = startedJob?.id as string;

      await advanceTicks(app, 10);

      const inProgressJobs = await readProductionJobs(app);
      const inProgressJob = inProgressJobs.find((job) => job.id === jobId);

      expect(inProgressJob).toBeDefined();
      expect(inProgressJob?.status).toBe('RUNNING');
      expect(inProgressJob?.progress).toBeGreaterThan(0);

      const progressBeforeSave = inProgressJob?.progress ?? 0;

      const saveResponse = await request(app.getHttpServer())
        .post('/api/session/save')
        .send({ filePath: savePath });

      expect(saveResponse.status).toBe(200);
      expect(saveResponse.body.ok).toBe(true);

      await request(app.getHttpServer()).post('/api/session/new').send({ name: 'Temporary Session' });

      const loadResponse = await request(app.getHttpServer())
        .post('/api/session/load')
        .send({ filePath: savePath });

      expect(loadResponse.status).toBe(200);
      expect(loadResponse.body.ok).toBe(true);

      const jobsAfterLoad = await readProductionJobs(app);
      const restoredJob = jobsAfterLoad.find((job) => job.id === jobId);

      expect(restoredJob).toMatchObject({
        id: jobId,
        buildingId,
        recipeId: 'recipe_planks',
        status: 'RUNNING',
      });
      expect(restoredJob?.progress).toBeGreaterThanOrEqual(progressBeforeSave);

      await advanceTicks(app, 80);

      const finishedJobs = await readProductionJobs(app);
      const finishedJob = finishedJobs.find((job) => job.id === jobId);

      expect(finishedJob?.status).toBe('FINISHED');

      const planksAfter = inventoryQuantity(await readDashboardInventory(app), 'planks');
      expect(planksAfter).toBeGreaterThan(planksBefore);

      const productionEvents = await readProductionEvents(app);
      const completionEvents = productionEvents.filter((entry) =>
        entry.message.includes('abgeschlossen'),
      );

      expect(completionEvents.filter((entry) => entry.entityId === jobId)).toHaveLength(1);

      await advanceTicks(app, 5);

      const eventsAfterExtraTick = await readProductionEvents(app);
      expect(
        eventsAfterExtraTick.filter(
          (entry) => entry.entityId === jobId && entry.message.includes('abgeschlossen'),
        ),
      ).toHaveLength(1);
    },
    180_000,
  );
});
