import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  createDefaultPaths,
  VisualAssetManagerService,
} from '../../../src/tools/visual-asset-manager/index.js';

const FIXTURE_ROOT = join(process.cwd(), 'tests/fixtures/visual-asset-manager');

/** Creates an isolated temp repository for visual asset manager tests. */
export function createVisualAssetManagerFixture(): {
  readonly root: string;
  readonly service: VisualAssetManagerService;
} {
  const root = mkdtempSync(join(tmpdir(), 'pg-vam-'));
  const designRoot = join(root, 'docs', 'design');
  mkdirSync(join(designRoot, 'mockups', 'main-menu'), { recursive: true });

  const backlog = readFileSync(join(FIXTURE_ROOT, 'VISUAL_PRODUCTION_BACKLOG.md'), 'utf8');
  const catalog = readFileSync(join(FIXTURE_ROOT, 'VISUAL_ASSET_CATALOG.md'), 'utf8');

  writeFileSync(join(designRoot, 'VISUAL_PRODUCTION_BACKLOG.md'), backlog, 'utf8');
  writeFileSync(join(designRoot, 'VISUAL_ASSET_CATALOG.md'), catalog, 'utf8');

  const service = new VisualAssetManagerService(createDefaultPaths(root));
  return { root, service };
}
