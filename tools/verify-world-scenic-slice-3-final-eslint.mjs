import { execFileSync } from 'node:child_process';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceRoot = path.join(
  root,
  'docs/design/world/web-final-2d-scenic-pilot/evidence/production-slice-3-final-evidence-verification-only',
);
const webRoot = path.join(root, 'apps/web');

const webFiles = [
  'src/presentation/screens/world/WorldScreen.tsx',
  'src/presentation/components/world/PGWorldViewport.tsx',
  'src/presentation/components/world/PGWorldCanvas.tsx',
  'src/presentation/components/world/PGWorldBuildingMarker.tsx',
  'src/presentation/adapters/mappers/world-scenic-region-label-layout.ts',
  'src/presentation/hooks/world-camera-math.ts',
  'src/presentation/hooks/useWorldCamera.ts',
  'src/presentation/hooks/world-viewport-pointer.ts',
  'src/presentation/adapters/mappers/world-scenic-visual-projection.ts',
  'src/presentation/config/world-scenic-feature.ts',
  'src/presentation/adapters/mappers/world-scenic-region-label-layout.test.ts',
  'src/presentation/components/world/PGWorldBuildingMarker.test.tsx',
  'src/presentation/components/world/PGWorldViewport.scenic.test.tsx',
  'src/presentation/screens/world/WorldScreen.test.tsx',
];
const files = [
  ...webFiles.map((f) => path.normalize(path.join(webRoot, f))),
  path.join(root, 'tools/verify-world-scenic-slice-3-final-evidence-capture.mjs'),
  path.join(root, 'tools/verify-world-scenic-slice-3-final-qa-reset.mjs'),
  path.join(root, 'tools/verify-world-scenic-slice-3-final-eslint.mjs'),
];

const eslintBin = path.join(root, 'node_modules/eslint/bin/eslint.js');
const version = execFileSync(process.execPath, [eslintBin, '--version'], { encoding: 'utf8' }).trim();

function runEslint(targetFiles) {
  let exitCode = 0;
  let stdout = '';
  let stderr = '';
  try {
    stdout = execFileSync(
      process.execPath,
      [eslintBin, ...targetFiles, '-f', 'json'],
      { cwd: webRoot, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 },
    );
  } catch (e) {
    exitCode = e.status ?? 1;
    stdout = e.stdout?.toString() ?? '';
    stderr = e.stderr?.toString() ?? '';
  }
  const parsed = stdout ? JSON.parse(stdout) : [];
  return {
    exitCode,
    stderr,
    parsed,
    lintedFileCount: parsed.filter((r) => r.filePath && !r.ignored).length,
    errorCount: parsed.reduce((n, r) => n + r.errorCount, 0),
    warningCount: parsed.reduce((n, r) => n + r.warningCount, 0),
  };
}

const productFiles = webFiles.map((f) => path.normalize(path.join(webRoot, f)));
const toolFiles = files.filter((f) => f.includes(`${path.sep}tools${path.sep}`));
const productRun = runEslint(productFiles);
const toolRun = runEslint(toolFiles);

const manifest = {
  eslintVersion: version,
  command: `node ${eslintBin} <files> -f json`,
  workingDirectory: webRoot,
  productTsFiles: productFiles,
  productTsFileCount: productFiles.length,
  productActuallyLintedFileCount: productRun.lintedFileCount,
  productExitCode: productRun.exitCode,
  productErrorCount: productRun.errorCount,
  productWarningCount: productRun.warningCount,
  productResult:
    productRun.exitCode === 0 &&
    productRun.lintedFileCount === productFiles.length &&
    productRun.errorCount === 0
      ? 'PASS'
      : 'FAIL',
  toolScriptFiles: toolFiles,
  toolExitCode: toolRun.exitCode,
  toolErrorCount: toolRun.errorCount,
  toolResult:
    toolRun.exitCode === 0 && toolRun.errorCount === 0 ? 'PASS' : 'FAIL',
  toolNote: 'Tooling scripts linted via eslint.config.js overrides for verify-world-scenic-slice-3-final-*.mjs.',
  ignoredFiles: [],
  cssFilesExcluded: true,
  exitCode: productRun.exitCode,
  errorCount: productRun.errorCount,
  warningCount: productRun.warningCount,
  result: productRun.exitCode === 0 && productRun.errorCount === 0 ? 'PASS' : 'FAIL',
  capturedAt: new Date().toISOString(),
};

await mkdir(path.join(evidenceRoot, 'lint'), { recursive: true });
await writeFile(
  path.join(evidenceRoot, 'lint', 'eslint-verification.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
await writeFile(
  path.join(evidenceRoot, 'lint', 'eslint-protocol.txt'),
  `PRODUCT TS/TSX:\n${JSON.stringify(productRun.parsed, null, 2)}\n\nTOOLS:\n${JSON.stringify(toolRun.parsed, null, 2)}\n${toolRun.stderr}\nPRODUCT_EXIT:${productRun.exitCode}\n`,
);

console.log(
  `ESLint verification → ${manifest.result} (product ${productRun.lintedFileCount}/${productFiles.length}, exit ${productRun.exitCode})`,
);
process.exit(manifest.result === 'PASS' ? 0 : 1);
