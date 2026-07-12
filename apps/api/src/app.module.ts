/**
 * @module @project-genesis/api/app.module
 */

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GameModule } from './game/game.module.js';
import { GameSessionService } from './game/game-session.service.js';

/** Root NestJS module for the Project Genesis API. */
@Module({
  imports: [
    GameModule,
    ServeStaticModule.forRootAsync({
      imports: [GameModule],
      inject: [GameSessionService],
      useFactory: (gameSessionService: GameSessionService) => [
        {
          rootPath: gameSessionService.webRoot,
          serveRoot: '/',
          exclude: ['/api*'],
          serveStaticOptions: {
            index: ['index.html'],
          },
        },
      ],
    }),
  ],
})
export class AppModule {}
