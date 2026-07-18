import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const sourceRoot = path.join(projectRoot, 'src');

type LayerRule = {
  readonly layer: string;
  readonly prefix: string;
  readonly forbiddenImportPrefixes: readonly string[];
};

const LAYER_RULES: readonly LayerRule[] = [
  {
    layer: 'domain',
    prefix: path.join(sourceRoot, 'domain'),
    forbiddenImportPrefixes: [
      path.join(sourceRoot, 'application'),
      path.join(sourceRoot, 'infrastructure'),
      path.join(sourceRoot, 'simulation'),
      path.join(sourceRoot, 'content'),
    ],
  },
  {
    layer: 'simulation',
    prefix: path.join(sourceRoot, 'simulation'),
    forbiddenImportPrefixes: [path.join(sourceRoot, 'application'), path.join(sourceRoot, 'infrastructure')],
  },
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

    if (entry.isFile() && fullPath.endsWith('.ts') && !fullPath.endsWith('.test.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

function normalizeImportPath(importPath: string, filePath: string): string | undefined {
  if (!importPath.startsWith('.')) {
    return undefined;
  }

  const resolved = path.resolve(path.dirname(filePath), importPath);

  if (resolved.endsWith('.js')) {
    return resolved.slice(0, -3);
  }

  return resolved;
}

describe('architecture dependency rules', () => {
  it('prevents forbidden layer imports in production source files', async () => {
    const violations: string[] = [];

    for (const rule of LAYER_RULES) {
      const files = await collectSourceFiles(rule.prefix);

      for (const filePath of files) {
        const contents = await readFile(filePath, 'utf8');
        const importMatches = contents.matchAll(/from ['"](\.[^'"]+)['"]/g);

        for (const match of importMatches) {
          const resolvedImport = normalizeImportPath(match[1]!, filePath);

          if (resolvedImport === undefined) {
            continue;
          }

          for (const forbiddenPrefix of rule.forbiddenImportPrefixes) {
            if (
              resolvedImport.startsWith(forbiddenPrefix + path.sep) ||
              resolvedImport === forbiddenPrefix
            ) {
              violations.push(
                `${rule.layer} violation in ${path.relative(projectRoot, filePath)} -> ${match[1]}`,
              );
            }
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
