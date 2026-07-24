import 'reflect-metadata';
import { type INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module.js';
import { ApiExceptionFilter } from '../../common/api-exception.filter.js';

/** Boots a NestJS application for HTTP integration and E2E tests. */
export async function createApiTestApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication<NestExpressApplication>();
  app.useGlobalFilters(new ApiExceptionFilter());
  await app.init();
  return app;
}
