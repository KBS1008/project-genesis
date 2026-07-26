import { describe, expect, it } from 'vitest';
import {
  parseBacklog,
  updateBacklogLineStatus,
  updateCatalogStatus,
  formatChangelogEntry,
  parseChangelog,
} from './backlog-parser.js';
import { canTransitionStatus } from './status-transitions.js';
import {
  buildCanonicalFilename,
  computeSha256,
  resolveDestinationDirectory,
  resolveNextRevision,
  validateBacklogFilename,
  validateImageBuffer,
} from './filename-resolver.js';
import { createTestPng } from '../../../tests/fixtures/visual-asset-manager/create-test-png.js';

const SAMPLE_BACKLOG = `# Sprint 1 — Main Menu

## Main Menu

☐ MM-001_Main_Menu.png
`;

describe('visual asset manager backlog parser', () => {
  it('parses backlog rows with sprint and category', () => {
    const entries = parseBacklog(SAMPLE_BACKLOG);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      assetId: 'MM-001',
      backlogFilename: 'MM-001_Main_Menu.png',
      status: 'planned',
      sprint: 'Sprint 1 — Main Menu',
      category: 'Main Menu',
    });
  });

  it('updates only the selected backlog line', () => {
    const updated = updateBacklogLineStatus(
      SAMPLE_BACKLOG,
      'MM-001_Main_Menu.png',
      'approved',
    );
    expect(updated).toContain('☑ MM-001_Main_Menu.png');
  });

  it('updates catalog status for an existing asset', () => {
    const catalog = 'ID\n\nUI-MM-001\n\nStatus\n\nPlanned\n';
    const updated = updateCatalogStatus(catalog, 'MM-001', 'approved');
    expect(updated).toContain('Approved');
  });
});

describe('visual asset manager resolvers', () => {
  it('resolves destination directories by prefix', () => {
    expect(resolveDestinationDirectory('MM-001')).toBe('mockups/main-menu');
    expect(resolveDestinationDirectory('ICON-010')).toBe('icons');
  });

  it('builds revision filenames', () => {
    expect(buildCanonicalFilename('MM-001_Main_Menu.png', 2)).toBe(
      'MM-001_Main_Menu_Rev2.png',
    );
  });

  it('rejects invalid backlog filenames', () => {
    expect(validateBacklogFilename('MM-001_latest.png').length).toBeGreaterThan(0);
    expect(validateBacklogFilename('MM-002_New_Game_Dialog.png')).toEqual([]);
  });
});

describe('visual asset manager validation', () => {
  it('validates PNG dimensions for mockups', () => {
    const buffer = createTestPng(500, 400);
    const result = validateImageBuffer(buffer, {
      maxBytes: 5_000_000,
      kind: 'mockup',
      expectedExtension: '.png',
    });
    expect(result.ok).toBe(true);
    expect(result.width).toBe(500);
    expect(result.height).toBe(400);
    expect(computeSha256(buffer)).toHaveLength(64);
  });

  it('blocks undersized mockups unless warnings are accepted', () => {
    const buffer = createTestPng(200, 200);
    const result = validateImageBuffer(buffer, {
      maxBytes: 5_000_000,
      kind: 'mockup',
      expectedExtension: '.png',
    });
    expect(result.ok).toBe(false);
  });
});

describe('visual asset manager status transitions', () => {
  it('allows planned to in-production', () => {
    expect(canTransitionStatus('planned', 'in-production')).toBe(true);
    expect(canTransitionStatus('integrated', 'approved')).toBe(false);
  });
});

describe('visual asset manager changelog', () => {
  it('formats and parses changelog entries', () => {
    const block = formatChangelogEntry({
      date: '2026-07-26T10:00:00.000Z',
      assetId: 'MM-001',
      operation: 'Added',
      assetFilename: 'MM-001_Main_Menu.png',
      status: 'Approved',
      destination: 'docs/design/mockups/main-menu/MM-001_Main_Menu.png',
      revision: 0,
      sha256: 'abc123',
    });

    const entries = parseChangelog(`# Changelog\n\n${block}`);
    expect(entries[0]).toMatchObject({
      assetId: 'MM-001',
      assetFilename: 'MM-001_Main_Menu.png',
      revision: 0,
      sha256: 'abc123',
    });
  });
});

describe('revision resolver', () => {
  it('starts at revision 0 for empty directories', () => {
    const result = resolveNextRevision('/tmp/nonexistent', 'MM-001_Main_Menu.png');
    expect(result).toEqual({
      revision: 0,
      canonicalFilename: 'MM-001_Main_Menu.png',
    });
  });
});
