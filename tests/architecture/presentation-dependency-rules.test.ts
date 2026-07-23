import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const webSourceRoot = path.join(projectRoot, 'apps/web/src');
const backendSourceRoot = path.join(projectRoot, 'src');

const FORBIDDEN_IMPORT_PATTERNS: readonly RegExp[] = [
  /from ['"]@\/\.\.\/\.\.\/\.\.\/src\//,
  /from ['"][^'"]*\/src\/domain\//,
  /from ['"][^'"]*\/src\/infrastructure\//,
  /from ['"][^'"]*\/src\/simulation\//,
  /from ['"][^'"]*\/src\/application\//,
  /from ['"]@domain\//,
  /from ['"]@infrastructure\//,
  /from ['"]@simulation\//,
  /from ['"]@application\//,
];

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

function normalizeImportPath(importPath: string, filePath: string): string | undefined {
  if (!importPath.startsWith('.')) {
    return importPath;
  }

  const resolved = path.resolve(path.dirname(filePath), importPath);

  if (resolved.endsWith('.js')) {
    return resolved.slice(0, -3);
  }

  return resolved;
}

describe('presentation dependency rules', () => {
  it('prevents apps/web from importing backend layers directly', async () => {
    const files = await collectSourceFiles(webSourceRoot);
    const violations: string[] = [];

    for (const filePath of files) {
      const contents = await readFile(filePath, 'utf8');
      const importMatches = contents.matchAll(/from ['"]([^'"]+)['"]/g);

      for (const match of importMatches) {
        const importPath = match[1]!;
        const resolvedImport = normalizeImportPath(importPath, filePath);

        for (const pattern of FORBIDDEN_IMPORT_PATTERNS) {
          if (pattern.test(`from '${importPath}'`)) {
            violations.push(
              `${path.relative(projectRoot, filePath)} -> ${importPath} (pattern ${pattern})`,
            );
          }
        }

        if (resolvedImport !== undefined && path.isAbsolute(resolvedImport)) {
          for (const layer of ['domain', 'infrastructure', 'simulation', 'application'] as const) {
            const layerRoot = path.join(backendSourceRoot, layer);
            if (
              resolvedImport.startsWith(layerRoot + path.sep) ||
              resolvedImport === layerRoot
            ) {
              violations.push(
                `${path.relative(projectRoot, filePath)} -> ${importPath} (backend ${layer})`,
              );
            }
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
