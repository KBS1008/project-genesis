import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { resolveProjectPaths } from './project-paths.js';
import {
  assertAcceptancePersistenceTargetAllowed,
  listProtectedPersonalSavePaths,
  pathsReferToSameSaveFile,
  PROJECT_GENESIS_SAVE_PATH_ENV,
  resolveConfiguredSavePath,
  resolveDefaultPersonalSavePath,
  resolveS2DisposableResearchBrowserIsolationSavePath,
  SavePathConfigurationError,
  SavePathRejectedError,
} from './save-path-config.js';

describe('save-path-config', () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    for (const directory of tempRoots.splice(0)) {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  function createTempProjectRoot(): string {
    const directory = mkdtempSync(path.join(os.tmpdir(), 'pg-acceptance-save-'));
    tempRoots.push(directory);
    mkdirSync(path.join(directory, 'saves'), { recursive: true });
    return directory;
  }

  it('uses the personal default when env value is absent', () => {
    const root = createTempProjectRoot();
    const resolution = resolveConfiguredSavePath(root, undefined);

    expect(resolution.mode).toBe('default');
    expect(resolution.savePath).toBe(resolveDefaultPersonalSavePath(root));
  });

  it('selects a valid absolute acceptance-only json path', () => {
    const root = createTempProjectRoot();
    const acceptanceDirectory = path.join(root, 'saves', 'acceptance');
    mkdirSync(acceptanceDirectory, { recursive: true });
    const acceptanceSave = path.join(acceptanceDirectory, 's1-notification-relevance.json');

    const resolution = resolveConfiguredSavePath(root, acceptanceSave);

    expect(resolution.mode).toBe('acceptance');
    expect(resolution.savePath).toBe(path.resolve(acceptanceSave));
  });

  it('rejects relative override paths', () => {
    const root = createTempProjectRoot();

    expect(() => resolveConfiguredSavePath(root, 'saves/acceptance/foo.json')).toThrow(
      SavePathConfigurationError,
    );
  });

  it('rejects empty and whitespace-only overrides', () => {
    const root = createTempProjectRoot();

    expect(() => resolveConfiguredSavePath(root, '')).toThrow(SavePathConfigurationError);
    expect(() => resolveConfiguredSavePath(root, '   ')).toThrow(SavePathConfigurationError);
  });

  it('rejects non-json paths', () => {
    const root = createTempProjectRoot();
    const parent = path.join(root, 'saves', 'acceptance');
    mkdirSync(parent, { recursive: true });
    const target = path.join(parent, 'state.txt');

    expect(() => resolveConfiguredSavePath(root, target)).toThrow(SavePathConfigurationError);
  });

  it('rejects protected personal default save path', () => {
    const root = createTempProjectRoot();
    const protectedPath = path.join(root, 'saves', 'browser-session.json');
    writeFileSync(protectedPath, '{}', 'utf8');

    expect(() => resolveConfiguredSavePath(root, protectedPath)).toThrow(
      SavePathConfigurationError,
    );
  });

  it('rejects protected api-package save path', () => {
    const root = createTempProjectRoot();
    const apiSaveDirectory = path.join(root, 'apps', 'api', 'saves');
    mkdirSync(apiSaveDirectory, { recursive: true });
    const protectedPath = path.join(apiSaveDirectory, 'browser-session.json');
    writeFileSync(protectedPath, '{}', 'utf8');

    expect(() => resolveConfiguredSavePath(root, protectedPath)).toThrow(
      SavePathConfigurationError,
    );
  });

  it('rejects equivalent paths to protected saves', () => {
    const root = createTempProjectRoot();
    const protectedPath = path.join(root, 'saves', 'browser-session.json');
    writeFileSync(protectedPath, '{}', 'utf8');
    const equivalent = `${protectedPath}${path.sep}.`;

    expect(() => resolveConfiguredSavePath(root, equivalent)).toThrow(SavePathConfigurationError);
  });

  it('rejects missing parent directory', () => {
    const root = createTempProjectRoot();
    const missingParent = path.join(root, 'saves', 'missing-dir', 'acceptance.json');

    expect(() => resolveConfiguredSavePath(root, missingParent)).toThrow(
      SavePathConfigurationError,
    );
  });

  it('never silently falls back to the personal default on invalid override', () => {
    const root = createTempProjectRoot();

    expect(() => resolveConfiguredSavePath(root, 'relative/bad.json')).toThrow(
      SavePathConfigurationError,
    );

    const defaultResolution = resolveConfiguredSavePath(root, undefined);
    expect(defaultResolution.savePath).toBe(resolveDefaultPersonalSavePath(root));
  });

  it('guards explicit save/load redirection to protected saves in acceptance mode', () => {
    const root = createTempProjectRoot();
    const protectedPath = path.join(root, 'saves', 'browser-session.json');
    writeFileSync(protectedPath, '{}', 'utf8');

    expect(() => assertAcceptancePersistenceTargetAllowed(root, protectedPath)).toThrow(
      SavePathRejectedError,
    );
  });

  it('documents the configured environment variable name', () => {
    expect(PROJECT_GENESIS_SAVE_PATH_ENV).toBe('PROJECT_GENESIS_SAVE_PATH');
  });

  it('lists three protected personal save locations', () => {
    const root = createTempProjectRoot();
    expect(listProtectedPersonalSavePaths(root)).toHaveLength(3);
  });

  it('detects case-insensitive equivalent paths on Windows', () => {
    const root = createTempProjectRoot();
    const lower = path.join(root, 'saves', 'browser-session.json');
    const upper = path.join(root, 'SAVES', 'BROWSER-SESSION.JSON');

    if (process.platform === 'win32') {
      expect(pathsReferToSameSaveFile(lower, upper)).toBe(true);
    } else {
      expect(pathsReferToSameSaveFile(lower, upper)).toBe(false);
    }
  });

  it('resolves the approved S2 disposable fixture save path', () => {
    const root = createTempProjectRoot();
    const resolved = resolveS2DisposableResearchBrowserIsolationSavePath(root);

    expect(resolved).toBe(
      path.join(
        root,
        'saves',
        'acceptance',
        'disposable-warning-fixtures',
        'S2-B1-research-browser-isolation-2026-11-11-d1a162600.json',
      ),
    );
  });
});

describe('resolveProjectPaths save wiring', () => {
  it('keeps the original default save target when override is absent', () => {
    const paths = resolveProjectPaths(import.meta.url, { projectGenesisSavePath: undefined });

    expect(paths.acceptanceSaveIsolation).toBe(false);
    expect(paths.savePath).toBe(path.join(paths.projectRoot, 'saves', 'browser-session.json'));
  });
});
