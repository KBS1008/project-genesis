import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const apiRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

describe('API production build scope', () => {
  it('excludes developer tooling from tsconfig.build.json', () => {
    const configPath = path.join(apiRoot, 'tsconfig.build.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8')) as {
      include?: readonly string[];
      exclude?: readonly string[];
    };

    expect(config.exclude).toEqual(expect.arrayContaining(['../../src/tools/**']));
    expect(config.include).toEqual(
      expect.arrayContaining(['src/main.ts', 'src/api-bootstrap.ts']),
    );
    expect(config.include).not.toContain('src/main.dev.ts');
  });

  it('keeps production AppModule free of DevModule imports', () => {
    const appModuleSource = readFileSync(path.join(apiRoot, 'src', 'app.module.ts'), 'utf8');

    expect(appModuleSource).not.toContain('DevModule');
    expect(appModuleSource).toContain('GameModule');
  });
});
