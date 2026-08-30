/**
 * @module @project-genesis/api/app.dev.module
 *
 * Development root module including developer-only HTTP endpoints.
 */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { DevModule } from './dev/dev.module.js';
import { GameModule } from './game/game.module.js';

/** Root NestJS module for non-production API runtime (includes DevModule). */
@Module({
  imports: [GameModule, DevModule],
  controllers: [AppController],
})
export class AppDevModule {}
