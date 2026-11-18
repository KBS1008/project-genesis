import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolveSavegameFilePath } from './savegame-path-resolver.js';

describe('resolveSavegameFilePath', () => {
  const projectRoot = path.join('D:', 'Project Genesis');

  it('joins relative saves paths to the project root', () => {
    expect(resolveSavegameFilePath(projectRoot, 'saves/browser-session.json')).toBe(
      path.join(projectRoot, 'saves', 'browser-session.json'),
    );
  });

  it('normalizes absolute paths', () => {
    const absolute = path.join(projectRoot, 'saves', 'custom.json');
    expect(resolveSavegameFilePath(projectRoot, absolute)).toBe(path.normalize(absolute));
  });
});
