/**
 * @module @project-genesis/api/game/game-session.service
 *
 * Bootstraps and exposes the application-layer browser session facade.
 */

import { Injectable, type OnModuleInit } from '@nestjs/common';
import { GameSession } from '../../../../src/application/facade/GameSession.js';
import { resolveProjectPaths } from '../config/project-paths.js';

/** Provides a singleton {@link GameSession} for HTTP controllers. */
@Injectable()
export class GameSessionService implements OnModuleInit {
  readonly #paths = resolveProjectPaths(import.meta.url);
  #session: GameSession | undefined;

  /** Content root used by the active session. */
  get gameContentRoot(): string {
    return this.#paths.gameContentRoot;
  }

  /** Save file path used by the active session. */
  get savePath(): string {
    return this.#paths.savePath;
  }

  /** Bootstraps the in-memory browser session on module init. */
  async onModuleInit(): Promise<void> {
    const sessionResult = await GameSession.create({
      gameContentRoot: this.#paths.gameContentRoot,
      savePath: this.#paths.savePath,
    });

    if (!sessionResult.ok) {
      throw new Error(`Failed to bootstrap game session: ${sessionResult.error.message}`);
    }

    this.#session = sessionResult.value;
  }

  /** Returns the active browser session facade. */
  getSession(): GameSession {
    if (this.#session === undefined) {
      throw new Error('Game session is not initialized.');
    }

    return this.#session;
  }
}
