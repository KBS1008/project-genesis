import 'reflect-metadata';
import { type INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../app.module.js';
import { ApiExceptionFilter } from '../common/api-exception.filter.js';
import { STARTING_MONEY } from '../../../../src/domain/finance/FinanceConstants.js';
import { NEW_GAME_STARTER_BUILDINGS } from '../../../../src/application/new-game/NewGameSetupConstants.js';

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
    expect(dashboardResponse.body.data.finance?.cashBalance).toBe(STARTING_MONEY);
    expect(dashboardResponse.body.data.buildings).toHaveLength(NEW_GAME_STARTER_BUILDINGS.length);
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
    await request(app.getHttpServer()).post('/api/session/new').send({ name: 'History Test Corp' });

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

  it('POST /api/employees/hire validates required fields', async () => {
    await request(app.getHttpServer()).post('/api/session/new').send({ name: 'Employee API Corp' });

    const response = await request(app.getHttpServer())
      .post('/api/employees/hire')
      .send({ employeeTypeId: 'employee_production_worker' });

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
    expect(response.body.error).toContain('Missing employee hire fields');
  });

  it('POST /api/employees/hire and assign expose employees on dashboard', async () => {
    await request(app.getHttpServer()).post('/api/session/new').send({ name: 'Employee API Corp' });

    const hireResponse = await request(app.getHttpServer()).post('/api/employees/hire').send({
      employeeTypeId: 'employee_production_worker',
      displayName: 'Production Worker',
    });

    expect(hireResponse.status).toBe(200);
    expect(hireResponse.body.ok).toBe(true);

    const dashboardAfterHire = await request(app.getHttpServer()).get('/api/dashboard');

    expect(dashboardAfterHire.status).toBe(200);
    expect(dashboardAfterHire.body.data.employees).toHaveLength(1);
    expect(dashboardAfterHire.body.data.kpis.employeeCount).toBe(1);
    expect(dashboardAfterHire.body.data.hints.hireEmployee.length).toBeGreaterThan(0);

    const employeeId = hireResponse.body.data as string;
    const activeBuilding = dashboardAfterHire.body.data.buildings.find(
      (building: { status: string; id: string }) => building.status === 'ACTIVE',
    );

    expect(activeBuilding).toBeDefined();

    const assignResponse = await request(app.getHttpServer()).post('/api/employees/assign').send({
      employeeId,
      buildingId: activeBuilding.id,
    });

    expect(assignResponse.status).toBe(200);
    expect(assignResponse.body.ok).toBe(true);

    const dashboardAfterAssign = await request(app.getHttpServer()).get('/api/dashboard');

    expect(dashboardAfterAssign.body.data.employees[0].assignedBuildingId).toBe(activeBuilding.id);
    expect(dashboardAfterAssign.body.data.kpis.assignedEmployeeCount).toBe(1);
  });
});
