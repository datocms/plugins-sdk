// Fails when the output has what a plugin must not get, or cannot resolve:
// - a module of ui-static or of ui-apps, or an import of a forbidden package
//   (`forbiddenPackages` of entries.mjs: ui-static, ui-apps and the libraries of the
//   apps), in the JS or the types;
// - an import of a package that is not a dependency or a peer of react-ui;
// - an import of ui-public (`ui-public/...`), of an SVG file, or of a relative file that is
//   not in the output;
// - a font file or an absolute path of this machine;
// - a picture at rest of ui-public (`pictureModules`).

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { forbiddenPackages } from '../entries.mjs';
import { packageDir, resolveUiSpecifier } from './entryModules.mjs';

const distDir = path.join(packageDir, 'dist');

// The pictures at rest of ui-public are for a page without JS, never for a
// plugin (see "Pictures at Rest" in `packages/ui-public/AGENTS.md`). The
// output keeps the path of each module under the folder of the packages
// (`preserveModulesRoot` of vite.config.ts). `ui-public/SplitPane/Rail` is
// not in the list, because `SplitPane` renders it.
const pictureModules = [
  'ui-public/Dropdown/Static',
  'ui-public/Tooltip/Static',
  'ui-public/HoverCard/Static',
  'ui-public/Modal/Static',
  'ui-public/FullscreenModal/Static',
  'ui-public/InsertGap/Static',
  'ui-public/SplitButton/Static',
];
// The public mirror copies only the modules of the entries, thus its
// ui-public has no pictures. A picture that is not in the exports map cannot
// be in the output.
function pictureFile(specifier) {
  try {
    return resolveUiSpecifier(specifier);
  } catch {
    return undefined;
  }
}

const pictureOutputs = new Map(
  pictureModules.flatMap((specifier) => {
    const file = pictureFile(specifier);
    if (!file) return [];
    return [
      [
        path
          .relative(path.resolve(packageDir, '..'), file)
          .replace(/\.tsx?$/, ''),
        specifier,
      ],
    ];
  }),
);
const manifest = JSON.parse(
  readFileSync(path.join(packageDir, 'package.json'), 'utf8'),
);
const declared = new Set([
  ...Object.keys(manifest.dependencies ?? {}),
  ...Object.keys(manifest.peerDependencies ?? {}),
]);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const file = path.join(dir, name);
    return statSync(file).isDirectory() ? walk(file) : [file];
  });
}

function packageName(specifier) {
  const parts = specifier.split('/');
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

const specifierPattern =
  /(?:\bfrom\s+|\bimport\s*\(\s*|^import\s+)(['"])([^'"]+)\1/gm;
const errors = [];
const files = walk(distDir);

for (const file of files) {
  const relative = path.relative(distDir, file);
  if (/\.(woff2?|ttf|otf|eot|svg)$/.test(file)) {
    errors.push(`${relative}: a font or an SVG file is in the output`);
    continue;
  }
  const picture = pictureOutputs.get(relative.replace(/\.(js|d\.ts)$/, ''));
  if (picture) {
    errors.push(`${relative}: the picture at rest ${picture} is in the output`);
  }
  const source = readFileSync(file, 'utf8');
  if (source.includes(path.resolve(packageDir, '..'))) {
    errors.push(`${relative}: has an absolute path of this machine`);
  }
  if (!/\.(js|d\.ts)$/.test(file)) continue;

  for (const [, , specifier] of source.matchAll(specifierPattern)) {
    if (specifier.startsWith('.')) {
      const target = path.resolve(path.dirname(file), specifier);
      const typesTarget = target.replace(/\.js$/, '.d.ts');
      const exists = file.endsWith('.d.ts')
        ? existsSync(typesTarget)
        : existsSync(target);
      if (!exists)
        errors.push(`${relative}: ${specifier} is not in the output`);
      continue;
    }
    const name = packageName(specifier);
    if (name === 'ui-public' || specifier.includes('.svg')) {
      errors.push(`${relative}: imports ${specifier}`);
    } else if (forbiddenPackages.includes(name)) {
      errors.push(`${relative}: imports the forbidden package ${name}`);
    } else if (!declared.has(name)) {
      errors.push(
        `${relative}: imports ${name}, which package.json does not declare`,
      );
    }
  }
}

for (const internalPackage of ['ui-static', 'ui-apps']) {
  if (existsSync(path.join(distDir, internalPackage))) {
    errors.push(
      `dist/${internalPackage}: a module of ${internalPackage} is in the output`,
    );
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`The ${files.length} files of the output pass the checks.`);
