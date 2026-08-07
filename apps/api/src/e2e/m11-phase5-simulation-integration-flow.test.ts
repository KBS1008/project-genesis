import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApiTestApp } from './support/create-api-test-app.js';

type InventoryItem = {
  readonly resourceId: string;
  readonly quantity: number;
};

function inventoryQuantity(items: readonly InventoryItem[], resourceId: string): number {
  return items.find((item) => item.resourceId === resourceId)?.quantity ?? 0;
}

async function ensureSimulationRunning(app: INestApplication): Promise<void> {
  const status = await request(app.getHttpServer()).get('/api/simulation/status');

  if (status.body.data.isPaused === true) {
    const resume = await request(app.getHttpServer()).post('/api/simulation/resume').send({});
    expect(resume.status).toBe(200);
    expect(resume.body.ok).toBe(true);
  }
}

async function advanceTicks(app: INestApplication, count: number): Promise<void> {
  await ensureSimulationRunning(app);

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

describe('M11 Phase 5 simulation integration (API E2E)', () => {
  let app: INestApplication;
  const savePath = 'saves/e2e-m11-phase5-flow.json';

  beforeAll(async () => {
    app = await createApiTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it(
    'new game → workspace contracts populated (session, dashboard, world, simulation)',
    async () => {
      const newGameResponse = await request(app.getHttpServer())
        .post('/api/session/new')
        .send({ name: 'M11 Phase 5 Corp' });

      expect(newGameResponse.status).toBe(200);
      expect(newGameResponse.body.ok).toBe(true);

      const sessionStatus = await request(app.getHttpServer()).get('/api/session/status');
      expect(sessionStatus.body.data.hasActiveSession).toBe(true);
      expect(sessionStatus.body.data.companyName).toBe('M11 Phase 5 Corp');
      expect(sessionStatus.body.data.playerId).toMatch(/^player_/);

      const dashboard = await request(app.getHttpServer()).get('/api/dashboard');
      expect(dashboard.body.data.company?.name).toBe('M11 Phase 5 Corp');
      expect(dashboard.body.data.tickNumber).toBeGreaterThanOrEqual(0);

      const world = await request(app.getHttpServer()).get('/api/world/overview');
      expect(world.body.data.regionCount).toBeGreaterThan(0);

      const regions = await request(app.getHttpServer()).get('/api/world/regions');
      expect(regions.body.data.length).toBeGreaterThan(0);

      const simulation = await request(app.getHttpServer()).get('/api/simulation/status');
      expect(simulation.body.data.hasActiveSession).toBe(true);
      expect(simulation.body.data.tickNumber).toBe(dashboard.body.data.tickNumber);
    },
    30_000,
  );

  it(
    'load game → restores session identity and simulation state without stale tick drift',
    async () => {
      const dashboard = await request(app.getHttpServer()).get('/api/dashboard');

      if (dashboard.body.data.company === null) {
        await request(app.getHttpServer()).post('/api/session/new').send({ name: 'M11 Load Corp' });
      }

      await advanceTicks(app, 3);
      await request(app.getHttpServer()).post('/api/simulation/pause').send({});

      const beforeSave = await request(app.getHttpServer()).get('/api/dashboard');
      const tickBeforeSave = beforeSave.body.data.tickNumber as number;
      const companyName = beforeSave.body.data.company?.name as string;

      await request(app.getHttpServer()).post('/api/session/save').send({ filePath: savePath });

      await request(app.getHttpServer()).post('/api/simulation/resume').send({});
      await advanceTicks(app, 4);

      const mutated = await request(app.getHttpServer()).get('/api/dashboard');
      expect(mutated.body.data.tickNumber).toBeGreaterThan(tickBeforeSave);

      const loadResponse = await request(app.getHttpServer())
        .post('/api/session/load')
        .send({ filePath: savePath });

      expect(loadResponse.status).toBe(200);
      expect(loadResponse.body.ok).toBe(true);

      const afterLoad = await request(app.getHttpServer()).get('/api/dashboard');
      expect(afterLoad.body.data.company?.name).toBe(companyName);
      expect(afterLoad.body.data.tickNumber).toBe(tickBeforeSave);

      const simulation = await request(app.getHttpServer()).get('/api/simulation/status');
      expect(simulation.body.data.isPaused).toBe(true);
    },
    45_000,
  );

  it(
    'command → authoritative dashboard refresh (production start)',
    async () => {
      const dashboard = await request(app.getHttpServer()).get('/api/dashboard');

      if (dashboard.body.data.company === null) {
        await request(app.getHttpServer()).post('/api/session/new').send({ name: 'M11 Command Corp' });
      }

      const placeResponse = await request(app.getHttpServer()).post('/api/buildings/place').send({
        buildingTypeId: 'sawmill',
        name: 'M11 Sawmill',
        x: 30,
        y: 30,
      });

      expect(placeResponse.status).toBe(200);
      const buildingId = placeResponse.body.data as string;
      await waitForActiveBuilding(app, buildingId);

      const buyWood = await request(app.getHttpServer())
        .post('/api/market/buy')
        .send({ resourceId: 'wood', amount: 20 });

      expect(buyWood.status).toBe(200);

      const jobsBefore = await request(app.getHttpServer()).get('/api/production/jobs');
      const countBefore = jobsBefore.body.data.length as number;

      const productionResponse = await request(app.getHttpServer()).post('/api/production/start').send({
        buildingId,
        recipeId: 'recipe_planks',
      });

      expect(productionResponse.status).toBe(200);
      expect(productionResponse.body.ok).toBe(true);

      const jobsAfter = await request(app.getHttpServer()).get('/api/production/jobs');
      expect(jobsAfter.body.data.length).toBeGreaterThan(countBefore);

      const dashboardAfter = await request(app.getHttpServer()).get('/api/dashboard');
      expect(dashboardAfter.body.data.productionJobs?.length ?? 0).toBeGreaterThan(0);
    },
    120_000,
  );

  it(
    'simulation event → event log entry available for notification mapping',
    async () => {
      const eventLogBefore = await request(app.getHttpServer()).get('/api/events/log?limit=50');
      const countBefore = eventLogBefore.body.data.length as number;

      await advanceTicks(app, 1);

      const eventLogAfter = await request(app.getHttpServer()).get('/api/events/log?limit=50');
      expect(eventLogAfter.body.data.length).toBeGreaterThanOrEqual(countBefore);

      const latest = eventLogAfter.body.data[0];
      expect(latest).toMatchObject({
        id: expect.any(String),
        tickNumber: expect.any(Number),
        occurredAt: expect.any(Number),
        category: expect.any(String),
        message: expect.any(String),
        severity: expect.stringMatching(/^(INFO|WARNING|ERROR)$/),
      });
    },
    30_000,
  );

  it(
    'save → success feedback contracts and reload preserves inventory',
    async () => {
      const dashboard = await request(app.getHttpServer()).get('/api/dashboard');

      if (dashboard.body.data.company === null) {
        await request(app.getHttpServer()).post('/api/session/new').send({ name: 'M11 Save Corp' });
      }

      const buyResponse = await request(app.getHttpServer())
        .post('/api/market/buy')
        .send({ resourceId: 'wood', amount: 5 });

      expect(buyResponse.status).toBe(200);

      const beforeSave = await request(app.getHttpServer()).get('/api/dashboard');
      const woodBefore = inventoryQuantity(beforeSave.body.data.inventory.items, 'wood');
      const tickBefore = beforeSave.body.data.tickNumber as number;

      const saveResponse = await request(app.getHttpServer())
        .post('/api/session/save')
        .send({ filePath: savePath });

      expect(saveResponse.status).toBe(200);
      expect(saveResponse.body.ok).toBe(true);
      expect(saveResponse.body.data).toBe(savePath);

      await advanceTicks(app, 2);

      const loadResponse = await request(app.getHttpServer())
        .post('/api/session/load')
        .send({ filePath: savePath });

      expect(loadResponse.status).toBe(200);

      const afterLoad = await request(app.getHttpServer()).get('/api/dashboard');
      expect(afterLoad.body.data.tickNumber).toBe(tickBefore);
      expect(inventoryQuantity(afterLoad.body.data.inventory.items, 'wood')).toBe(woodBefore);
    },
    60_000,
  );

  it(
    'simulation ticks advance dashboard tick and simulation status consistently',
    async () => {
      const dashboard = await request(app.getHttpServer()).get('/api/dashboard');

      if (dashboard.body.data.company === null) {
        await request(app.getHttpServer()).post('/api/session/new').send({ name: 'M11 Tick Corp' });
      }

      const tickBefore = dashboard.body.data.tickNumber as number;
      await advanceTicks(app, 5);

      const dashboardAfter = await request(app.getHttpServer()).get('/api/dashboard');
      const simulationAfter = await request(app.getHttpServer()).get('/api/simulation/status');

      expect(dashboardAfter.body.data.tickNumber).toBeGreaterThan(tickBefore);
      expect(simulationAfter.body.data.tickNumber).toBe(dashboardAfter.body.data.tickNumber);
    },
    30_000,
  );
});
