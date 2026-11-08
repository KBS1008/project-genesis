import { afterEach, describe, expect, it, vi } from 'vitest';
import type * as NodeFs from 'node:fs';
import path from 'node:path';

const fsDelegates = vi.hoisted(() => ({
  existsSync: null as null | ((target: NodeFs.PathLike) => boolean),
  lstatSync: null as null | ((target: NodeFs.PathLike) => NodeFs.Stats),
  statSync: null as null | ((target: NodeFs.PathLike) => NodeFs.Stats),
  realpathNative: null as null | ((target: NodeFs.PathLike) => string),
}));

const actualNodeFs = vi.hoisted(() => ({
  existsSync: null as null | typeof import('node:fs').existsSync,
  lstatSync: null as null | typeof import('node:fs').lstatSync,
  statSync: null as null | typeof import('node:fs').statSync,
  realpathNative: null as null | typeof import('node:fs').realpathSync.native,
}));

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();

  actualNodeFs.existsSync = actual.existsSync;
  actualNodeFs.lstatSync = actual.lstatSync;
  actualNodeFs.statSync = actual.statSync;
  actualNodeFs.realpathNative = actual.realpathSync.native.bind(actual.realpathSync);

  return {
    ...actual,
    existsSync: (target: NodeFs.PathLike) =>
      fsDelegates.existsSync
        ? fsDelegates.existsSync(target)
        : actualNodeFs.existsSync!(target),
    lstatSync: (target: NodeFs.PathLike) =>
      fsDelegates.lstatSync ? fsDelegates.lstatSync(target) : actualNodeFs.lstatSync!(target),
    statSync: (target: NodeFs.PathLike) =>
      fsDelegates.statSync ? fsDelegates.statSync(target) : actualNodeFs.statSync!(target),
    realpathSync: {
      ...actual.realpathSync,
      native: (target: NodeFs.PathLike) =>
        fsDelegates.realpathNative
          ? fsDelegates.realpathNative(target)
          : actualNodeFs.realpathNative!(target),
    },
  };
});

import {
  ACCEPTANCE_API_HOST,
  ACCEPTANCE_API_PORT,
  AcceptanceApiLaunchError,
  assertNoPackageManagerInSpawn,
  buildAcceptanceApiLaunchEnvironment,
  buildAcceptanceApiLaunchPlan,
  PROJECT_GENESIS_ACCEPTANCE_FIXTURE_SAVE_PATH_ENV,
  resolveCanonicalAcceptanceSavePath,
  resolveDisposableFixtureSaveRoot,
  resolveLocalTsxCliPath,
  resolveProjectRootFromApi,
} from './acceptance-s1-api-launch.js';

const apiRoot = path.resolve(import.meta.dirname, '..');
const projectRoot = resolveProjectRootFromApi(apiRoot);
const acceptanceSave = resolveCanonicalAcceptanceSavePath(projectRoot);
const nodeExe = process.execPath;

function fakeDirectoryStats(): NodeFs.Stats {
  return { isSymbolicLink: () => false, isDirectory: () => true } as NodeFs.Stats;
}

describe('acceptance-s1-api-launch', () => {
  afterEach(() => {
    fsDelegates.existsSync = null;
    fsDelegates.lstatSync = null;
    fsDelegates.statSync = null;
    fsDelegates.realpathNative = null;
    vi.restoreAllMocks();
  });

  it('L1 — resolves local TSX CLI under apps/api', () => {
    const tsxPath = resolveLocalTsxCliPath(apiRoot);
    expect(tsxPath).toContain(path.join('node_modules', 'tsx', 'dist', 'cli.mjs'));
  });

  it('L2 — missing local TSX fails closed without pnpm', () => {
    expect(() => resolveLocalTsxCliPath(path.join(apiRoot, 'missing-package'))).toThrow(
      AcceptanceApiLaunchError,
    );
  });

  it('L3 — rejects personal save target', () => {
    const personalSave = path.join(projectRoot, 'saves', 'browser-session.json');

    expect(() =>
      buildAcceptanceApiLaunchEnvironment(projectRoot, process.env, {
        acceptanceSavePath: personalSave,
      }),
    ).toThrow(AcceptanceApiLaunchError);
  });

  it('L4 — rejects relative acceptance save path', () => {
    expect(() =>
      buildAcceptanceApiLaunchEnvironment(projectRoot, process.env, {
        acceptanceSavePath: 'saves/acceptance/s1-notification-relevance.json',
      }),
    ).toThrow(AcceptanceApiLaunchError);
  });

  it('L5 — rejects wrong API port inheritance', () => {
    expect(() =>
      buildAcceptanceApiLaunchEnvironment(projectRoot, { ...process.env, PORT: '3001' }),
    ).toThrow(AcceptanceApiLaunchError);
  });

  it('L6 — strips inherited personal save override', () => {
    const env = buildAcceptanceApiLaunchEnvironment(projectRoot, {
      ...process.env,
      PROJECT_GENESIS_SAVE_PATH: path.join(projectRoot, 'saves', 'browser-session.json'),
    });

    expect(env.PROJECT_GENESIS_SAVE_PATH).toBe(acceptanceSave);
    expect(env.PORT).toBe(String(ACCEPTANCE_API_PORT));
    expect(env.HOST).toBe(ACCEPTANCE_API_HOST);
  });

  it('L7 — valid plan uses node executable and separate argv elements', () => {
    const plan = buildAcceptanceApiLaunchPlan(apiRoot, nodeExe, process.env);

    expect(plan.executable).toBe(nodeExe);
    expect(plan.args[1]).toBe('watch');
    expect(plan.args[2]).toBe(path.join('src', 'main.dev.ts'));
    assertNoPackageManagerInSpawn(plan);
  });

  it('L8 — Windows paths with spaces remain single argv elements', () => {
    const tsxWithSpaces = path.join('D:\\Cursor', 'Project Genesis', 'tsx', 'cli.mjs');
    const args = [tsxWithSpaces, 'watch', 'src/main.dev.ts'];

    expect(args[0]).toBe(tsxWithSpaces);
    expect(args).toHaveLength(3);
  });

  it('L9 — rejects occupied acceptance port', () => {
    expect(() =>
      buildAcceptanceApiLaunchEnvironment(projectRoot, process.env, {
        portInUse: (port) => port === ACCEPTANCE_API_PORT,
      }),
    ).toThrow(AcceptanceApiLaunchError);
  });

  it('L10 — spawn plan contains no package-manager commands', () => {
    const plan = buildAcceptanceApiLaunchPlan(apiRoot, nodeExe, process.env);
    const joined = [plan.executable, ...plan.args].join(' ').toLowerCase();

    expect(joined).not.toContain('pnpm');
    expect(joined).not.toContain('npx');
    expect(joined).not.toContain('corepack');
  });

  it('L11 — unset fixture env preserves canonical acceptance save path', () => {
    const env = { ...process.env };
    delete env[PROJECT_GENESIS_ACCEPTANCE_FIXTURE_SAVE_PATH_ENV];

    const built = buildAcceptanceApiLaunchEnvironment(projectRoot, env);
    expect(built.PROJECT_GENESIS_SAVE_PATH).toBe(acceptanceSave);
    expect(built[PROJECT_GENESIS_ACCEPTANCE_FIXTURE_SAVE_PATH_ENV]).toBeUndefined();
  });

  it('L12 — rejects whitespace-only fixture env value', () => {
    expect(() =>
      buildAcceptanceApiLaunchEnvironment(projectRoot, {
        ...process.env,
        [PROJECT_GENESIS_ACCEPTANCE_FIXTURE_SAVE_PATH_ENV]: '   ',
      }),
    ).toThrow(AcceptanceApiLaunchError);
  });

  it('L17 — rejects zero-length fixture env string', () => {
    expect(() =>
      buildAcceptanceApiLaunchEnvironment(projectRoot, {
        ...process.env,
        [PROJECT_GENESIS_ACCEPTANCE_FIXTURE_SAVE_PATH_ENV]: '',
      }),
    ).toThrow(AcceptanceApiLaunchError);
  });

  it('L13 — rejects canonical acceptance path via fixture env', () => {
    expect(() =>
      buildAcceptanceApiLaunchEnvironment(projectRoot, {
        ...process.env,
        [PROJECT_GENESIS_ACCEPTANCE_FIXTURE_SAVE_PATH_ENV]: acceptanceSave,
      }),
    ).toThrow(AcceptanceApiLaunchError);
  });

  it('L14 — rejects fixture path outside disposable-warning-fixtures root', () => {
    const outside = path.join(projectRoot, 'saves', 'acceptance', 'orphan-fixture.json');

    expect(() =>
      buildAcceptanceApiLaunchEnvironment(projectRoot, {
        ...process.env,
        [PROJECT_GENESIS_ACCEPTANCE_FIXTURE_SAVE_PATH_ENV]: outside,
      }),
    ).toThrow(AcceptanceApiLaunchError);
  });

  it('L15 — rejects fixture path when disposable fixture root is missing', () => {
    const fixtureRoot = resolveDisposableFixtureSaveRoot(projectRoot);
    const candidate = path.join(fixtureRoot, 'fixture-missing-parent.json');

    expect(() =>
      buildAcceptanceApiLaunchEnvironment(projectRoot, {
        ...process.env,
        [PROJECT_GENESIS_ACCEPTANCE_FIXTURE_SAVE_PATH_ENV]: candidate,
      }),
    ).toThrow(AcceptanceApiLaunchError);
  });

  it('L16 — accepts fixture path under disposable root when root and parent exist (mocked fs)', () => {
    const fixtureRoot = resolveDisposableFixtureSaveRoot(projectRoot);
    const candidate = path.join(fixtureRoot, 'offline-fixture.json');
    const parentDirectory = path.dirname(candidate);

    fsDelegates.existsSync = (target) => {
      const resolved = path.resolve(String(target));

      if (
        resolved === path.resolve(fixtureRoot) ||
        resolved === path.resolve(parentDirectory)
      ) {
        return true;
      }

      return actualNodeFs.existsSync!(target);
    };

    fsDelegates.lstatSync = (target) => {
      const resolved = path.resolve(String(target));

      if (
        resolved === path.resolve(fixtureRoot) ||
        resolved === path.resolve(parentDirectory)
      ) {
        return fakeDirectoryStats();
      }

      return actualNodeFs.lstatSync!(target);
    };

    fsDelegates.statSync = (target) => {
      const resolved = path.resolve(String(target));

      if (
        resolved === path.resolve(fixtureRoot) ||
        resolved === path.resolve(parentDirectory)
      ) {
        return fakeDirectoryStats();
      }

      return actualNodeFs.statSync!(target);
    };

    fsDelegates.realpathNative = (target) => {
      const resolved = path.resolve(String(target));

      if (
        resolved === path.resolve(fixtureRoot) ||
        resolved === path.resolve(parentDirectory)
      ) {
        return resolved;
      }

      throw new Error(`unexpected realpath target: ${resolved}`);
    };

    const built = buildAcceptanceApiLaunchEnvironment(projectRoot, {
      ...process.env,
      [PROJECT_GENESIS_ACCEPTANCE_FIXTURE_SAVE_PATH_ENV]: candidate,
    });

    expect(built.PROJECT_GENESIS_SAVE_PATH).toBe(candidate);
  });

  it('L18 — rejects personal save path supplied via fixture env', () => {
    const personalSave = path.join(projectRoot, 'saves', 'browser-session.json');

    expect(() =>
      buildAcceptanceApiLaunchEnvironment(projectRoot, {
        ...process.env,
        [PROJECT_GENESIS_ACCEPTANCE_FIXTURE_SAVE_PATH_ENV]: personalSave,
      }),
    ).toThrow(AcceptanceApiLaunchError);
  });

  it('L19 — rejects when realpath parent resolves outside fixture root (mocked)', () => {
    const fixtureRoot = resolveDisposableFixtureSaveRoot(projectRoot);
    const parentDirectory = path.join(fixtureRoot, 'nested-slot');
    const candidate = path.join(parentDirectory, 'escaped-fixture.json');
    const outsideParent = path.join(projectRoot, 'saves', 'acceptance', 'outside-via-realpath');

    fsDelegates.existsSync = (target) => {
      const resolved = path.resolve(String(target));

      if (resolved === path.resolve(fixtureRoot) || resolved === path.resolve(parentDirectory)) {
        return true;
      }

      return actualNodeFs.existsSync!(target);
    };

    fsDelegates.lstatSync = (target) => {
      const resolved = path.resolve(String(target));

      if (resolved === path.resolve(fixtureRoot) || resolved === path.resolve(parentDirectory)) {
        return fakeDirectoryStats();
      }

      return actualNodeFs.lstatSync!(target);
    };

    fsDelegates.statSync = (target) => {
      const resolved = path.resolve(String(target));

      if (resolved === path.resolve(fixtureRoot) || resolved === path.resolve(parentDirectory)) {
        return fakeDirectoryStats();
      }

      return actualNodeFs.statSync!(target);
    };

    fsDelegates.realpathNative = (target) => {
      const resolved = path.resolve(String(target));

      if (resolved === path.resolve(fixtureRoot)) {
        return resolved;
      }

      if (resolved === path.resolve(parentDirectory)) {
        return path.resolve(outsideParent);
      }

      throw new Error(`unexpected realpath target: ${resolved}`);
    };

    expect(() =>
      buildAcceptanceApiLaunchEnvironment(projectRoot, {
        ...process.env,
        [PROJECT_GENESIS_ACCEPTANCE_FIXTURE_SAVE_PATH_ENV]: candidate,
      }),
    ).toThrow(AcceptanceApiLaunchError);
  });
});
