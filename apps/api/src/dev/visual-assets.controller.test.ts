import 'reflect-metadata';
import { type INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createTestPng } from '../../../../tests/fixtures/visual-asset-manager/create-test-png.js';
import { AppModule } from '../app.module.js';
import { ApiExceptionFilter } from '../common/api-exception.filter.js';

describe('VisualAssetsController (NestJS)', () => {
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

  it('GET /api/dev/visual-assets returns backlog items', async () => {
    const response = await request(app.getHttpServer()).get('/api/dev/visual-assets');

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0]).toMatchObject({
      assetId: expect.stringMatching(/^[A-Z]{2,5}-\d{3}$/),
      backlogFilename: expect.stringMatching(/\.(png|svg)$/i),
    });
  });

  it('GET /api/dev/visual-assets/activity returns recent activity', async () => {
    const response = await request(app.getHttpServer()).get('/api/dev/visual-assets/activity');

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('POST /api/dev/visual-assets/validate accepts multipart uploads', async () => {
    const png = createTestPng(1920, 1080);
    const response = await request(app.getHttpServer())
      .post('/api/dev/visual-assets/validate')
      .field('backlogFilename', 'WM-001_World_Map.png')
      .field('status', 'in-production')
      .attach('file', png, 'WM-001_World_Map.png');

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.data).toMatchObject({
      assetId: 'WM-001',
      width: 1920,
      height: 1080,
    });
    expect(response.body.data.canonicalFilename).toMatch(/^WM-001_World_Map\.png$/);
  });
});
