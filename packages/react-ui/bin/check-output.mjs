// Fails when the output has what a plugin must not get, or cannot resolve:
// - a module of ui-app, or an import of a forbidden package
//   (`forbiddenPackages` of entries.mjs: ui-app and the libraries of the
//   apps), in the JS or the types;
// - an import of a package that is not a dependency or a peer of react-ui;
// - an import of ui (`ui/...`), of an SVG file, or of a relative file that is
//   not in the output;
// - a font file or an absolute path of this machine.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { forbiddenPackages } from '../entries.mjs';
import { packageDir } from './entryModules.mjs';

const distDir = path.join(packageDir, 'dist');
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
    if (name === 'ui' || specifier.includes('.svg')) {
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

if (existsSync(path.join(distDir, 'ui-app'))) {
  errors.push('dist/ui-app: a module of ui-app is in the output');
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`The ${files.length} files of the output pass the checks.`);
