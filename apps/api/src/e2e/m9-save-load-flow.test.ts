import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApiTestApp } from './support/create-api-test-app.js';

describe('M9 save/load flow (API E2E)', () => {
  let app: INestApplication;
  const savePath = 'saves/e2e-m9-save-load-flow.json';

  beforeAll(async () => {
    app = await createApiTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('persists simulation, finance, and pause state across load', async () => {
    const initialDashboard = await request(app.getHttpServer()).get('/api/dashboard');

    if (initialDashboard.body.data.company === null) {
      await request(app.getHttpServer()).post('/api/session/new').send({ name: 'Save Load E2E Corp' });
    }

    await request(app.getHttpServer()).post('/api/simulation/tick').send({ count: 2 });
    await request(app.getHttpServer()).post('/api/simulation/pause').send({});

    const beforeSave = await request(app.getHttpServer()).get('/api/dashboard');
    const tickBeforeSave = beforeSave.body.data.tickNumber as number;
    const cashBeforeSave = beforeSave.body.data.finance.cashBalance as number;
    const companyName = beforeSave.body.data.company?.name as string;

    const saveResponse = await request(app.getHttpServer())
      .post('/api/session/save')
      .send({ filePath: savePath });

    expect(saveResponse.status).toBe(200);
    expect(saveResponse.body.ok).toBe(true);
    expect(saveResponse.body.data).toBe(savePath);

    await request(app.getHttpServer()).post('/api/simulation/resume').send({});
    await request(app.getHttpServer()).post('/api/simulation/tick').send({ count: 4 });

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
    expect(afterLoad.body.data.finance.cashBalance).toBe(cashBeforeSave);

    const simulationStatus = await request(app.getHttpServer()).get('/api/simulation/status');
    expect(simulationStatus.body.data.isPaused).toBe(true);

    const eventsAfterLoad = await request(app.getHttpServer()).get('/api/events/log?limit=20');
    expect(eventsAfterLoad.body.ok).toBe(true);
    expect(eventsAfterLoad.body.data.length).toBeGreaterThan(0);
  });
});
