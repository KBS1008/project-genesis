import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const apiSourceRoot = path.join(projectRoot, 'apps/api/src');
const webSourceRoot = path.join(projectRoot, 'apps/web/src');

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
      (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) &&
      !fullPath.endsWith('.test.ts') &&
      !fullPath.endsWith('.test.tsx')
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

describe('adapter dependency rules', () => {
  it('prevents apps/api from importing the presentation layer', async () => {
    const files = await collectSourceFiles(apiSourceRoot);
    const violations: string[] = [];

    for (const filePath of files) {
      const contents = await readFile(filePath, 'utf8');
      const importMatches = contents.matchAll(/from ['"]([^'"]+)['"]/g);

      for (const match of importMatches) {
        const importPath = match[1]!;

        if (importPath.includes('apps/web') || importPath.startsWith('@/presentation')) {
          violations.push(`${path.relative(projectRoot, filePath)} -> ${importPath}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('documents legacy chart imports still pending migration', async () => {
    const presentationRoot = path.join(webSourceRoot, 'presentation');
    const screenFiles = await collectSourceFiles(path.join(presentationRoot, 'screens'));
    const legacyImports: string[] = [];

    for (const filePath of screenFiles) {
      const contents = await readFile(filePath, 'utf8');

      if (/from ['"]@\/components\//.test(contents)) {
        legacyImports.push(path.relative(projectRoot, filePath).replace(/\\/g, '/'));
      }
    }

    legacyImports.sort();

    expect(legacyImports).toEqual([
      'apps/web/src/presentation/screens/company/CompanyDashboardScreen.tsx',
      'apps/web/src/presentation/screens/company/CompanyDetailPanel.tsx',
      'apps/web/src/presentation/screens/market/MarketScreen.tsx',
    ]);
  });
});
