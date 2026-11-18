/**
 * @module @project-genesis/api/config/savegame-path-resolver
 *
 * Resolves API savegame paths relative to the monorepo root so reads and writes
 * target the same directory regardless of the API process working directory.
 */

import path from 'node:path';

/**
 * Resolves a save path from the API contract (`saves/foo.json`) to an absolute path.
 */
export function resolveSavegameFilePath(projectRoot: string, filePath: string): string {
  if (path.isAbsolute(filePath)) {
    return path.normalize(filePath);
  }

  const normalized = filePath.replace(/\\/g, '/');

  if (normalized.startsWith('saves/')) {
    return path.join(projectRoot, normalized);
  }

  return path.resolve(projectRoot, filePath);
}
