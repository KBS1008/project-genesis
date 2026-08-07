import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const scanRoots = [
  path.join(projectRoot, 'apps/web/src/presentation/screens'),
  path.join(projectRoot, 'apps/web/src/presentation/shell'),
];

const APPROVED_EXCEPTION_FILES = new Set([
  'apps/web/src/presentation/screens/company/CompanyDashboardScreen.tsx',
]);

async function collectSourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(fullPath)));
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

function extractBalancedCall(contents: string, openParenIndex: number): string {
  let depth = 0;

  for (let index = openParenIndex; index < contents.length; index += 1) {
    const char = contents[index];

    if (char === '(') {
      depth += 1;
    } else if (char === ')') {
      depth -= 1;

      if (depth === 0) {
        return contents.slice(openParenIndex, index + 1);
      }
    }
  }

  return contents.slice(openParenIndex);
}

describe('presentation commandId rules', () => {
  it('requires commandId on direct runCommand calls in screens and shell', async () => {
    const violations: string[] = [];

    for (const root of scanRoots) {
      const files = await collectSourceFiles(root);

      for (const filePath of files) {
        const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, '/');

        if (APPROVED_EXCEPTION_FILES.has(relativePath)) {
          continue;
        }

        const contents = await readFile(filePath, 'utf8');

        if (!contents.includes('runCommand')) {
          continue;
        }

        const pattern = /runCommand\s*\(/g;

        for (const match of contents.matchAll(pattern)) {
          const openParenIndex = match.index! + match[0].length - 1;
          const callSite = extractBalancedCall(contents, openParenIndex);

          if (!callSite.includes('commandId')) {
            violations.push(`${relativePath} → ${callSite.trim()}`);
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
