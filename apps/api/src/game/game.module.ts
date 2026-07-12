/**
 * @module @project-genesis/api/game/game.module
 */

import { Module } from '@nestjs/common';
import { DashboardModule } from '../dashboard/dashboard.module.js';
import { GameController } from './game.controller.js';
import { GameSessionService } from './game-session.service.js';

/** Registers browser session HTTP endpoints. */
@Module({
  imports: [DashboardModule],
  controllers: [GameController],
  providers: [GameSessionService],
  exports: [GameSessionService],
})
export class GameModule {}
