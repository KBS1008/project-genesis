import 'reflect-metadata';
import { type INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../app.module.js';
import { ApiExceptionFilter } from '../common/api-exception.filter.js';

describe('GameController (NestJS)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    app.useGlobalFilters(new ApiExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/dashboard returns an empty session snapshot', async () => {
    const response = await request(app.getHttpServer()).get('/api/dashboard');

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.data.company).toBeNull();
    expect(response.body.data.milestones.length).toBeGreaterThan(0);
  });

  it('POST /api/session/new starts a game and exposes dashboard state', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/session/new')
      .send({ name: 'NestJS Test Corp' });

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);

    const dashboardResponse = await request(app.getHttpServer()).get('/api/dashboard');

    expect(dashboardResponse.status).toBe(200);
    expect(dashboardResponse.body.data.company?.name).toBe('NestJS Test Corp');
    expect(dashboardResponse.body.data.finance?.cashBalance).toBe(250_000);
    expect(Array.isArray(dashboardResponse.body.data.financeTransactions)).toBe(true);
  });

  it('POST /api/buildings/place validates required fields', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/buildings/place')
      .send({ buildingTypeId: 'sawmill' });

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
    expect(response.body.error).toContain('Missing building placement fields');
  });

  it('GET /api/dashboard/history returns tick metrics after simulation ticks', async () => {
    await request(app.getHttpServer())
      .post('/api/session/new')
      .send({ name: 'History Test Corp' });

    await request(app.getHttpServer()).post('/api/simulation/tick').send({ count: 3 });

    const response = await request(app.getHttpServer()).get('/api/dashboard/history');

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.data.companyId).toBeTruthy();
    expect(response.body.data.points.length).toBeGreaterThanOrEqual(4);
    expect(response.body.data.points.at(-1)).toMatchObject({
      availableCash: expect.any(Number),
      energyReserve: expect.any(Number),
      activeTransportCount: expect.any(Number),
    });
  });
});
