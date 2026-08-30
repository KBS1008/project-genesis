/**
 * @module @project-genesis/api/app.module
 *
 * Production root module — gameplay and dashboard only (no developer tooling).
 */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { GameModule } from './game/game.module.js';

/** Root NestJS module for production API runtime. */
@Module({
  imports: [GameModule],
  controllers: [AppController],
})
export class AppModule {}
