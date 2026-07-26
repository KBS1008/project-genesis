/**
 * @module @project-genesis/api/app.module
 */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { DevModule } from './dev/dev.module.js';
import { GameModule } from './game/game.module.js';

/** Root NestJS module for the Project Genesis API. */
@Module({
  imports: [GameModule, DevModule],
  controllers: [AppController],
})
export class AppModule {}
