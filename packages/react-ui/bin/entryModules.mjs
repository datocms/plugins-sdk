// Resolves the entries of `entries.mjs` to the files of ui and of the
// adapter (`src/`), and writes the
// code of the module of each entry. The JS build and the types build share
// it, thus the two outputs expose the same names.

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { entries } from '../entries.mjs';

export const packageDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
export const uiDir = path.resolve(packageDir, '../ui');

const uiExports = JSON.parse(
  readFileSync(path.join(uiDir, 'package.json'), 'utf8'),
).exports;

export function resolveUiSpecifier(specifier) {
  const subpath = `./${specifier.slice('ui/'.length)}`;
  if (uiExports[subpath]) return path.join(uiDir, uiExports[subpath]);
  for (const [pattern, target] of Object.entries(uiExports)) {
    if (!pattern.endsWith('/*')) continue;
    const prefix = pattern.slice(0, -1);
    if (subpath.startsWith(prefix)) {
      return path.join(
        uiDir,
        target.replace('*', subpath.slice(prefix.length)),
      );
    }
  }
  throw new Error(`${specifier} is not in the exports map of ui`);
}

// A regular expression is enough here: the modules of ui write a default
// export only as "export default".
function hasDefaultExport(file) {
  return /^export default /m.test(readFileSync(file, 'utf8'));
}

/**
 * The entries as a list: the public name, the file (of ui or of the adapter),
 * and the names
 * that the entry exposes (`only`), or nothing for all the names.
 */
export function resolvedEntries() {
  return Object.entries(entries).map(([name, value]) => {
    const spec = typeof value === 'string' ? { module: value } : value;
    const file = spec.adapter
      ? path.join(packageDir, spec.adapter)
      : resolveUiSpecifier(spec.module);
    if (!existsSync(file)) {
      throw new Error(`The entry ${name} points to ${file}, which is missing`);
    }
    return {
      name,
      file,
      only: spec.only,
      hasDefault: !spec.only && hasDefaultExport(file),
    };
  });
}

/**
 * The code of the module of an entry, which imports `target`. The JS module
 * gets no type names (`withTypes: false`), the declaration file gets them.
 */
export function entryCode({ only, hasDefault }, target, { withTypes }) {
  const from = JSON.stringify(target);
  if (only) {
    const names = [
      ...(only.values ?? []),
      ...(withTypes ? (only.types ?? []).map((type) => `type ${type}`) : []),
    ];
    return `export { ${names.join(', ')} } from ${from};\n`;
  }
  return (
    `export * from ${from};\n` +
    (hasDefault ? `export { default } from ${from};\n` : '')
  );
}
