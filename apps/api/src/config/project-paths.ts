/**
 * @module @project-genesis/api/config/project-paths
 *
 * Resolves repository root paths for content and savegames.
 */

import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Repository paths required by the NestJS API layer. */
export type ProjectPaths = {
  readonly projectRoot: string;
  readonly gameContentRoot: string;
  readonly savePath: string;
};

/**
 * Walks up from a starting directory until the game-content folder is found.
 */
export function findProjectRoot(startDirectory: string): string {
  let currentDirectory = startDirectory;

  while (true) {
    if (existsSync(path.join(currentDirectory, 'game-content'))) {
      return currentDirectory;
    }

    const parentDirectory = path.dirname(currentDirectory);

    if (parentDirectory === currentDirectory) {
      throw new Error('Could not locate project root containing game-content.');
    }

    currentDirectory = parentDirectory;
  }
}

/**
 * Resolves deterministic paths relative to the monorepo root.
 */
export function resolveProjectPaths(currentModuleUrl: string): ProjectPaths {
  const currentDirectory = path.dirname(fileURLToPath(currentModuleUrl));
  const projectRoot = findProjectRoot(currentDirectory);

  return {
    projectRoot,
    gameContentRoot: path.join(projectRoot, 'game-content'),
    savePath: path.join(projectRoot, 'saves', 'browser-session.json'),
  };
}
