/**
 * @module @project-genesis/api/app.module
 */

import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module.js';

/** Root NestJS module for the Project Genesis API. */
@Module({
  imports: [GameModule],
})
export class AppModule {}
