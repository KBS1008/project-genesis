import 'reflect-metadata';
import { type INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../app.module.js';
import { ApiExceptionFilter } from '../common/api-exception.filter.js';

describe('SvgGeneratorController (NestJS)', () => {
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

  it('GET /api/dev/svg-generator/templates returns templates', async () => {
    const response = await request(app.getHttpServer()).get('/api/dev/svg-generator/templates');
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.data.some((item: { id: string }) => item.id === 'chart-library')).toBe(true);
  });

  it('POST /api/dev/svg-generator/preview generates SVG', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/dev/svg-generator/preview')
      .send({
        assetId: 'CH-010',
        backlogFilename: 'CH-010_Charts.svg',
        templateId: 'chart-library',
        title: 'CH-010 Charts Library',
        width: 1600,
        height: 900,
        content: {},
        status: 'in-review',
      });

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.data.svg).toContain('<svg');
  });
});
