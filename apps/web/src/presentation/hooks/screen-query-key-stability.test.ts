import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const SCREEN_ROOT = resolve(process.cwd(), 'apps/web/src/presentation/screens');

function collectScreenSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectScreenSourceFiles(fullPath));
      continue;
    }

    if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      files.push(fullPath);
    }
  }

  return files;
}

describe('screen query key stability', () => {
  it('does not embed simulation tick numbers in useScreenQuery keys', () => {
    const offenders = collectScreenSourceFiles(SCREEN_ROOT)
      .map((filePath) => readFileSync(filePath, 'utf8'))
      .flatMap((source) => {
        const matches = source.match(/useScreenQuery\(\s*`[^`]*\$\{[^}]*tick[^}]*\}[^`]*`/g) ?? [];
        return matches;
      });

    expect(offenders).toEqual([]);
  });
});
