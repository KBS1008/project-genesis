/**
 * @module @project-genesis/api/api-bootstrap
 *
 * Shared NestJS bootstrap for production and development entry points.
 */

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { Type } from '@nestjs/common';
import { ApiExceptionFilter } from './common/api-exception.filter.js';

/** Starts the NestJS API with the given root module. */
export async function startApi(RootModule: Type<unknown>): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(RootModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalFilters(new ApiExceptionFilter());

  const host = process.env['HOST'] ?? '127.0.0.1';
  const port = Number.parseInt(process.env['PORT'] ?? '3001', 10);
  const webOrigin = process.env['WEB_ORIGIN'] ?? 'http://127.0.0.1:3000';

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
  console.log(`UI:   ${webOrigin}`);
  // eslint-disable-next-line no-console -- intentional startup message
  console.log(`API:  http://${host}:${port}/api/dashboard`);
  // eslint-disable-next-line no-console -- intentional startup message
  console.log(`WS:   http://${host}:${port}/ws/v1/dashboard`);
  // eslint-disable-next-line no-console -- intentional startup message
  console.log('Press Ctrl+C to stop.');
}
