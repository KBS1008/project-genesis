import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { findProjectRoot, resolveProjectPaths } from './project-paths.js';

describe('project-paths', () => {
  it('finds the monorepo root from the api package', () => {
    const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
    const projectRoot = findProjectRoot(currentDirectory);

    expect(existsSync(path.join(projectRoot, 'game-content'))).toBe(true);
    expect(existsSync(path.join(projectRoot, 'apps', 'web'))).toBe(true);
  });

  it('resolves game content and save paths', () => {
    const paths = resolveProjectPaths(import.meta.url);

    expect(existsSync(paths.gameContentRoot)).toBe(true);
    expect(paths.savePath).toMatch(/saves[\\/]browser-session\.json$/);
  });
});
