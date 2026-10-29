// Writes the declaration files of the output. tsc emits the declarations of
// the modules of ui-public and of the adapter that the entries reach, in the
// folders of the JS build (dist/ui-public/... and dist/react-ui/...). Then the
// script makes them work in a plugin: an import of an SVG file goes to one
// declaration of an icon component, an import of ui-public (in the adapter) goes to
// the declaration of its module, and each relative import gets the ".js"
// extension of the JS build, thus a project with "moduleResolution":
// "node16" resolves it too. Last, it writes one
// declaration file for each entry, and removes the declarations that no
// entry reaches (tsc emits one for each module that the sources import, also
// for a type that no public type uses).

import {
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {
  entryCode,
  packageDir,
  resolvedEntries,
  resolveUiSpecifier,
  uiDir,
} from './entryModules.mjs';

const distDir = path.join(packageDir, 'dist');
const packagesDir = path.resolve(packageDir, '..');
const entries = resolvedEntries();

// The options of ui: the same paths for the React 19 types, the same
// ambient declarations. The output mirrors the folders under packages/.
const config = ts.getParsedCommandLineOfConfigFile(
  path.join(uiDir, 'tsconfig.json'),
  {},
  { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} },
);
const options = {
  ...config.options,
  noEmit: false,
  declaration: true,
  emitDeclarationOnly: true,
  rootDir: path.resolve(packageDir, '..'),
  outDir: distDir,
};
const rootNames = [
  ...entries.map((entry) => entry.file),
  path.join(uiDir, 'src/svg.d.ts'),
  path.join(uiDir, 'src/modules.d.ts'),
];

const program = ts.createProgram(rootNames, options);
const result = program.emit();
const diagnostics = [
  ...ts.getPreEmitDiagnostics(program),
  ...result.diagnostics,
];
if (diagnostics.length > 0) {
  console.error(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (name) => name,
      getCurrentDirectory: () => packageDir,
      getNewLine: () => '\n',
    }),
  );
  process.exit(1);
}

// One declaration for every icon: svgr gives each SVG file the same props.
const iconDeclaration = path.join(distDir, 'ui-public/icons/svgComponent.d.ts');
writeFileSync(
  iconDeclaration,
  `import type { ComponentProps, FunctionComponent } from 'react';

declare const SvgComponent: FunctionComponent<
  ComponentProps<'svg'> & {
    title?: string;
    titleId?: string;
    desc?: string;
    descId?: string;
  }
>;
export default SvgComponent;
`,
);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const file = path.join(dir, name);
    return statSync(file).isDirectory() ? walk(file) : [file];
  });
}

function toRelative(from, to) {
  const relative = path.relative(path.dirname(from), to);
  return relative.startsWith('.') ? relative : `./${relative}`;
}

// ui-public type-checks on the React 19 types, which the root node_modules has
// under the names react-19 and react-dom-19 (see "React 19" in
// packages/ui-public/AGENTS.md). tsc writes these names in an inferred type.
const aliasedPackages = { 'react-19': 'react', 'react-dom-19': 'react-dom' };

// The declaration of a source file of packages/, in the output
function declarationOf(sourceFile) {
  return path
    .join(distDir, path.relative(packagesDir, sourceFile))
    .replace(/\.tsx?$/, '.d.ts');
}

function rewriteSpecifier(file, specifier) {
  if (specifier === 'ui-public' || specifier.startsWith('ui-public/')) {
    return toRelative(
      file,
      declarationOf(resolveUiSpecifier(specifier)),
    ).replace(/\.d\.ts$/, '.js');
  }
  if (!specifier.startsWith('.')) {
    const [name, ...rest] = specifier.split('/');
    return aliasedPackages[name]
      ? [aliasedPackages[name], ...rest].join('/')
      : specifier;
  }
  if (specifier.endsWith('.svg?react')) {
    return toRelative(file, iconDeclaration).replace(/\.d\.ts$/, '.js');
  }
  const target = path.resolve(path.dirname(file), specifier);
  for (const candidate of [`${target}.d.ts`, `${target}/index.d.ts`]) {
    try {
      if (statSync(candidate).isFile()) {
        return toRelative(file, candidate).replace(/\.d\.ts$/, '.js');
      }
    } catch {}
  }
  throw new Error(`${file}: cannot resolve ${specifier}`);
}

// The folders of the output that tsc writes: ui-public, and the adapter
const emittedFiles = () =>
  ['ui-public', path.basename(packageDir)].flatMap((folder) =>
    walk(path.join(distDir, folder)),
  );

for (const file of emittedFiles()) {
  if (!file.endsWith('.d.ts') || file === iconDeclaration) continue;
  const source = readFileSync(file, 'utf8');
  const rewritten = source.replace(
    /(\bfrom\s+|\bimport\s*\(\s*|^import\s+)(['"])([^'"]+)\2/gm,
    (_, before, quote, specifier) =>
      `${before}${quote}${rewriteSpecifier(file, specifier)}${quote}`,
  );
  if (rewritten !== source) writeFileSync(file, rewritten);
}

for (const entry of entries) {
  const declaration = path.join(distDir, `${entry.name}.d.ts`);
  const target = toRelative(
    declaration,
    path.join(distDir, path.relative(packagesDir, entry.file)),
  ).replace(/\.tsx?$/, '.js');
  writeFileSync(declaration, entryCode(entry, target, { withTypes: true }));
}

const specifierPattern =
  /(?:\bfrom\s+|\bimport\s*\(\s*|^import\s+)(['"])(\.[^'"]*)\1/gm;
const reached = new Set();
const queue = entries.map((entry) => path.join(distDir, `${entry.name}.d.ts`));
while (queue.length > 0) {
  const file = queue.pop();
  if (reached.has(file)) continue;
  reached.add(file);
  for (const [, , specifier] of readFileSync(file, 'utf8').matchAll(
    specifierPattern,
  )) {
    queue.push(
      path.resolve(path.dirname(file), specifier).replace(/\.js$/, '.d.ts'),
    );
  }
}
for (const file of emittedFiles()) {
  if (file.endsWith('.d.ts') && !reached.has(file)) rmSync(file);
}

console.log(`Wrote the declarations of ${entries.length} entries.`);
