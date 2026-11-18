/**
 * @module @project-genesis/api/config/project-paths
 *
 * Resolves repository root paths for content and savegames.
 */

import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROJECT_GENESIS_SAVE_PATH_ENV, resolveConfiguredSavePath } from './save-path-config.js';

/** Repository paths required by the NestJS API layer. */
export type ProjectPaths = {
  readonly projectRoot: string;
  readonly gameContentRoot: string;
  readonly savePath: string;
  /** True when {@link PROJECT_GENESIS_SAVE_PATH_ENV} supplied a valid acceptance save file. */
  readonly acceptanceSaveIsolation: boolean;
};

export type ResolveProjectPathsOptions = {
  /** When set, overrides `process.env.PROJECT_GENESIS_SAVE_PATH` (for tests). */
  readonly projectGenesisSavePath?: string | undefined;
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
export function resolveProjectPaths(
  currentModuleUrl: string,
  options?: ResolveProjectPathsOptions,
): ProjectPaths {
  const currentDirectory = path.dirname(fileURLToPath(currentModuleUrl));
  const projectRoot = findProjectRoot(currentDirectory);

  const configuredSavePath =
    options !== undefined && 'projectGenesisSavePath' in options
      ? options.projectGenesisSavePath
      : process.env[PROJECT_GENESIS_SAVE_PATH_ENV];

  const saveResolution = resolveConfiguredSavePath(projectRoot, configuredSavePath);

  return {
    projectRoot,
    gameContentRoot: path.join(projectRoot, 'game-content'),
    savePath: saveResolution.savePath,
    acceptanceSaveIsolation: saveResolution.mode === 'acceptance',
  };
}
