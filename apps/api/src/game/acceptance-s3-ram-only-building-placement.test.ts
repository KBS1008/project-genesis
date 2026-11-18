import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type { SessionStatusReadModel } from '../../../../src/application/read-models/SessionStatusReadModel.js';
import {
  resolveCanonicalAcceptanceSavePath,
  resolveDefaultPersonalSavePath,
  resolveS2DisposableResearchBrowserIsolationSavePath,
} from '../config/save-path-config.js';
import {
  isAcceptanceS3RamOnlyBuildingPlacementFlagArmed,
  isDisposableRamAcceptanceCompanyName,
  shouldSkipPersistenceAfterBuildingPlacement,
  type AcceptanceS3RamOnlyBuildingPlacementContext,
} from './acceptance-s3-ram-only-building-placement.js';

describe('acceptance-s3-ram-only-building-placement', () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    for (const directory of tempRoots.splice(0)) {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  function createTempProjectRoot(): string {
    const directory = mkdtempSync(path.join(os.tmpdir(), 'pg-s3-ram-place-'));
    tempRoots.push(directory);
    mkdirSync(path.join(directory, 'saves', 'acceptance', 'disposable-warning-fixtures'), {
      recursive: true,
    });
    return directory;
  }

  function authorizedContext(
    projectRoot: string,
    overrides: Partial<AcceptanceS3RamOnlyBuildingPlacementContext> = {},
  ): AcceptanceS3RamOnlyBuildingPlacementContext {
    const s2Path = resolveS2DisposableResearchBrowserIsolationSavePath(projectRoot);
    const sessionStatus: SessionStatusReadModel = {
      hasActiveSession: true,
      companyId: 'company_001',
      companyName: 'S3-D-Disposable-RAM-2026-11-15',
      playerId: 'player_001',
      savePath: s2Path,
    };

    return {
      ramOnlyBuildingPlacementEnv: '1',
      acceptanceSaveIsolation: true,
      projectRoot,
      configuredSavePath: s2Path,
      sessionStatus,
      configuredSaveFileExists: false,
      ...overrides,
    };
  }

  it('arms the flag only for literal 1', () => {
    expect(isAcceptanceS3RamOnlyBuildingPlacementFlagArmed('1')).toBe(true);
    expect(isAcceptanceS3RamOnlyBuildingPlacementFlagArmed(' 1 ')).toBe(true);
    expect(isAcceptanceS3RamOnlyBuildingPlacementFlagArmed('true')).toBe(false);
    expect(isAcceptanceS3RamOnlyBuildingPlacementFlagArmed(undefined)).toBe(false);
  });

  it('recognizes disposable RAM company names from server session state', () => {
    expect(isDisposableRamAcceptanceCompanyName('S3-D-Disposable-RAM-2026-11-15')).toBe(true);
    expect(isDisposableRamAcceptanceCompanyName('Spoofed-Disposable-RAM-2026-11-15')).toBe(true);
    expect(isDisposableRamAcceptanceCompanyName('Building Placement Corp')).toBe(false);
    expect(isDisposableRamAcceptanceCompanyName(null)).toBe(false);
  });

  it('skips persistence only for fully authorized S3 RAM-only context', () => {
    const root = createTempProjectRoot();
    expect(shouldSkipPersistenceAfterBuildingPlacement(authorizedContext(root))).toBe(true);
  });

  it('still saves when the opt-in flag is absent or invalid', () => {
    const root = createTempProjectRoot();

    expect(
      shouldSkipPersistenceAfterBuildingPlacement(
        authorizedContext(root, { ramOnlyBuildingPlacementEnv: undefined }),
      ),
    ).toBe(false);

    expect(
      shouldSkipPersistenceAfterBuildingPlacement(
        authorizedContext(root, { ramOnlyBuildingPlacementEnv: 'yes' }),
      ),
    ).toBe(false);
  });

  it('never skips for personal / non-isolated API configuration', () => {
    const root = createTempProjectRoot();

    expect(
      shouldSkipPersistenceAfterBuildingPlacement(
        authorizedContext(root, {
          acceptanceSaveIsolation: false,
          configuredSavePath: resolveDefaultPersonalSavePath(root),
          sessionStatus: {
            hasActiveSession: true,
            companyId: 'company_001',
            companyName: 'S3-D-Disposable-RAM-2026-11-15',
            playerId: 'player_001',
            savePath: resolveDefaultPersonalSavePath(root),
          },
        }),
      ),
    ).toBe(false);
  });

  it('does not skip for canonical S1 acceptance save even with the flag armed', () => {
    const root = createTempProjectRoot();
    const s1Path = resolveCanonicalAcceptanceSavePath(root);

    expect(
      shouldSkipPersistenceAfterBuildingPlacement(
        authorizedContext(root, {
          configuredSavePath: s1Path,
          sessionStatus: {
            hasActiveSession: true,
            companyId: 'company_001',
            companyName: 'S3-D-Disposable-RAM-2026-11-15',
            playerId: 'player_001',
            savePath: s1Path,
          },
        }),
      ),
    ).toBe(false);
  });

  it('fails closed when the configured save file already exists', () => {
    const root = createTempProjectRoot();

    expect(
      shouldSkipPersistenceAfterBuildingPlacement(
        authorizedContext(root, { configuredSaveFileExists: true }),
      ),
    ).toBe(false);
  });

  it('fails closed on session/path binding mismatch', () => {
    const root = createTempProjectRoot();

    expect(
      shouldSkipPersistenceAfterBuildingPlacement(
        authorizedContext(root, {
          sessionStatus: {
            hasActiveSession: true,
            companyId: 'company_001',
            companyName: 'S3-D-Disposable-RAM-2026-11-15',
            playerId: 'player_001',
            savePath: resolveCanonicalAcceptanceSavePath(root),
          },
        }),
      ),
    ).toBe(false);
  });

  it('fails closed when company name does not match disposable pattern (spoofed label)', () => {
    const root = createTempProjectRoot();

    expect(
      shouldSkipPersistenceAfterBuildingPlacement(
        authorizedContext(root, {
          sessionStatus: {
            ...authorizedContext(root).sessionStatus,
            companyName: 'Looks-Disposable-RAM-but-wrong',
          },
        }),
      ),
    ).toBe(false);
  });

  it('fails closed without an active session', () => {
    const root = createTempProjectRoot();

    expect(
      shouldSkipPersistenceAfterBuildingPlacement(
        authorizedContext(root, {
          sessionStatus: {
            hasActiveSession: false,
            companyId: null,
            companyName: null,
            playerId: null,
            savePath: resolveS2DisposableResearchBrowserIsolationSavePath(root),
          },
        }),
      ),
    ).toBe(false);
  });
});