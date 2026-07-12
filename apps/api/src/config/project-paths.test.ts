import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { findProjectRoot, resolveProjectPaths } from './project-paths.js';

describe('project-paths', () => {
  it('finds the monorepo root from the api package', () => {
    const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
    const projectRoot = findProjectRoot(currentDirectory);

    expect(existsSync(path.join(projectRoot, 'game-content'))).toBe(true);
    expect(existsSync(path.join(projectRoot, 'src', 'ui', 'web', 'index.html'))).toBe(true);
  });

  it('resolves browser shell asset paths', () => {
    const paths = resolveProjectPaths(import.meta.url);

    expect(existsSync(paths.webRoot)).toBe(true);
    expect(existsSync(path.join(paths.webRoot, 'index.html'))).toBe(true);
    expect(existsSync(paths.gameContentRoot)).toBe(true);
  });
});
