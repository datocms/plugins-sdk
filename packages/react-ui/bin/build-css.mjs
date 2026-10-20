// Writes dist/styles.css from styles/index.css: one file, with the imports
// inlined and the custom media queries and selectors of ui compiled, as the
// apps do in their build.

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
import mediaPlugin from 'postcss-custom-media';
import selectorsPlugin from 'postcss-custom-selectors';
import postcssImport from 'postcss-import';
import { packageDir, uiDir } from './entryModules.mjs';

const from = path.join(packageDir, 'styles/index.css');
const to = path.join(packageDir, 'dist/styles.css');

// The styles of ui are not in the `exports` map that postcss-import reads.
function resolveUi(id, basedir) {
  return id.startsWith('ui/')
    ? path.join(uiDir, id.slice('ui/'.length))
    : path.resolve(basedir, id);
}

const result = await postcss([
  postcssImport({ resolve: resolveUi }),
  mediaPlugin(),
  selectorsPlugin(),
]).process(readFileSync(from, 'utf8'), { from, to });

for (const warning of result.warnings()) console.warn(warning.toString());
writeFileSync(to, result.css);
console.log(`Wrote ${path.relative(packageDir, to)}.`);
