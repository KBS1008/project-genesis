/**
 * @module @project-genesis/api/main
 *
 * NestJS entry point for the Project Genesis REST API and browser shell.
 */

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { ApiExceptionFilter } from './common/api-exception.filter.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new ApiExceptionFilter());

  const host = process.env['HOST'] ?? '127.0.0.1';
  const port = Number.parseInt(process.env['PORT'] ?? '3001', 10);

  await app.listen(port, host);

  // eslint-disable-next-line no-console -- intentional startup message
  console.log('===========================================');
  // eslint-disable-next-line no-console -- intentional startup message
  console.log(' Project Genesis — NestJS API');
  // eslint-disable-next-line no-console -- intentional startup message
  console.log('===========================================');
  // eslint-disable-next-line no-console -- intentional startup message
  console.log('');
  // eslint-disable-next-line no-console -- intentional startup message
  console.log(`Open http://${host}:${port}`);
  // eslint-disable-next-line no-console -- intentional startup message
  console.log('Press Ctrl+C to stop.');
}

void bootstrap();
