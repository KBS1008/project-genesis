/**
 * @module @project-genesis/api/game/game-session.service
 *
 * Bootstraps and exposes the application-layer browser session facade.
 */

import { existsSync } from 'node:fs';
import { Injectable, type OnModuleInit } from '@nestjs/common';
import { GameSession } from '../../../../src/application/facade/GameSession.js';
import { resolveProjectPaths } from '../config/project-paths.js';
import { resolveSavegameFilePath } from '../config/savegame-path-resolver.js';

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

  /** Monorepo root used for canonical save path resolution. */
  get projectRoot(): string {
    return this.#paths.projectRoot;
  }

  /** Resolves API-relative save paths to an absolute path under the project root. */
  resolveSavegamePath(filePath: string): string {
    return resolveSavegameFilePath(this.#paths.projectRoot, filePath);
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

    const status = this.#session.getSessionStatus();

    if (status.ok && !status.value.hasActiveSession && existsSync(this.#paths.savePath)) {
      await this.#session.loadGame(this.#paths.savePath);
    }
  }

  /** Returns the active browser session facade. */
  getSession(): GameSession {
    if (this.#session === undefined) {
      throw new Error('Game session is not initialized.');
    }

    return this.#session;
  }
}
