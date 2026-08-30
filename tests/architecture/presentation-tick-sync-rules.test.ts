import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const screensRoot = path.join(projectRoot, 'apps/web/src/presentation/screens');

async function collectScreenFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectScreenFiles(fullPath)));
      continue;
    }

    if (
      entry.isFile() &&
      (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) &&
      !fullPath.endsWith('.test.ts') &&
      !fullPath.endsWith('.test.tsx')
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractUseScreenQueryKeys(contents: string): string[] {
  const keys: string[] = [];
  const pattern = /useScreenQuery\s*\(\s*(`(?:\\`|[^`])*`|'(?:\\'|[^'])*'|"(?:\\"|[^"])*")/g;

  for (const match of contents.matchAll(pattern)) {
    keys.push(match[1]!);
  }

  return keys;
}

function embedsTickInQueryKey(queryKeyLiteral: string): boolean {
  return queryKeyLiteral.includes('tickKey') || queryKeyLiteral.includes('${tickKey}');
}

describe('presentation tick sync rules', () => {
  it('keeps useScreenQuery identity stable and defers tick sync to invalidation', async () => {
    const files = await collectScreenFiles(screensRoot);
    const violations: string[] = [];

    for (const filePath of files) {
      const contents = await readFile(filePath, 'utf8');

      if (!contents.includes('useScreenQuery')) {
        continue;
      }

      const queryKeys = extractUseScreenQueryKeys(contents);

      for (const queryKey of queryKeys) {
        if (embedsTickInQueryKey(queryKey)) {
          violations.push(`${path.relative(projectRoot, filePath)} → ${queryKey}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
