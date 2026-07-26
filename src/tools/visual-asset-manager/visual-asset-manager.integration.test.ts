import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createTestPng } from '../../../tests/fixtures/visual-asset-manager/create-test-png.js';
import { createVisualAssetManagerFixture } from '../../../tests/fixtures/visual-asset-manager/fixture-helper.js';

describe('visual asset manager integration', () => {
  it('imports a PNG and updates backlog, catalog, and changelog', () => {
    const { root, service } = createVisualAssetManagerFixture();
    const buffer = createTestPng(500, 400);

    const result = service.importAsset({
      buffer,
      backlogFilename: 'MM-001_Main_Menu.png',
      status: 'approved',
    });

    expect(result.plan.canonicalFilename).toBe('MM-001_Main_Menu.png');
    expect(existsSync(join(root, result.plan.targetRelativePath))).toBe(true);

    const backlog = readFileSync(join(root, 'docs/design/VISUAL_PRODUCTION_BACKLOG.md'), 'utf8');
    expect(backlog).toContain('☑ MM-001_Main_Menu.png');

    const catalog = readFileSync(join(root, 'docs/design/VISUAL_ASSET_CATALOG.md'), 'utf8');
    expect(catalog).toContain('Approved');

    const changelog = readFileSync(join(root, 'docs/design/VISUAL_ASSET_CHANGELOG.md'), 'utf8');
    expect(changelog).toContain('MM-001');
  });

  it('rejects duplicate file hashes', () => {
    const { service } = createVisualAssetManagerFixture();
    const buffer = createTestPng(500, 400);

    service.importAsset({
      buffer,
      backlogFilename: 'MM-001_Main_Menu.png',
      status: 'approved',
    });

    expect(() =>
      service.importAsset({
        buffer,
        backlogFilename: 'MM-002_New_Game_Dialog.png',
        status: 'approved',
      }),
    ).toThrow(/Duplicate file detected/);
  });

  it('creates revisions when the base file already exists', () => {
    const { root, service } = createVisualAssetManagerFixture();
    const first = createTestPng(500, 400);
    const second = createTestPng(520, 420);

    service.importAsset({
      buffer: first,
      backlogFilename: 'MM-001_Main_Menu.png',
      status: 'approved',
    });

    const revised = service.importAsset({
      buffer: second,
      backlogFilename: 'MM-001_Main_Menu.png',
      status: 'approved',
    });

    expect(revised.plan.canonicalFilename).toBe('MM-001_Main_Menu_Rev1.png');
    expect(existsSync(join(root, revised.plan.targetRelativePath))).toBe(true);
  });
});
