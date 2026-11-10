import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import svgr from 'vite-plugin-svgr';
import { entryCode, packageDir, resolvedEntries } from './bin/entryModules.mjs';

const entries = resolvedEntries();
const ENTRY_PREFIX = 'react-ui-entry:';
const ENTRY_ID = '\0react-ui-entry:';

// Each entry is a small virtual module that re-exports a module of ui-public. Thus
// the public paths do not depend on the folders of ui-public, and an entry can
// expose only a part of a module (`only` in entries.mjs).
function entryModules(): Plugin {
  return {
    name: 'react-ui-entries',
    // Vite gives a lib entry as a path: the prefix can be after a folder.
    resolveId(id) {
      const index = id.indexOf(ENTRY_PREFIX);
      return index === -1
        ? null
        : `${ENTRY_ID}${id.slice(index + ENTRY_PREFIX.length)}`;
    },
    load(id) {
      if (!id.startsWith(ENTRY_ID)) return null;
      const entry = entries.find(
        (candidate) => candidate.name === id.slice(ENTRY_ID.length),
      );
      return entry ? entryCode(entry, entry.file, { withTypes: false }) : null;
    },
  };
}

// The SVG files of the icon packages, with the folder of their set in the
// output
const ICON_PACKAGE_SVGS =
  /^node_modules\/(?:(lucide)-static|(simple-icons))\/icons\//;

const require = createRequire(import.meta.url);

// The ISC licence of Lucide tells us to put its notice in each copy of the
// drawings. The icons of Simple Icons are CC0: they need no notice.
function lucideLicence(): Plugin {
  return {
    name: 'react-ui-lucide-licence',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'LICENSE-lucide.txt',
        source: readFileSync(require.resolve('lucide-static/LICENSE'), 'utf8'),
      });
    },
  };
}

// The code of ui-public and its icons go into the output. The icons are SVG
// files of ui-public and of the icon packages: svgr makes them components.
// Every other npm package stays an import: it is a dependency or a peer of
// react-ui.
function isExternal(id: string) {
  if (id.startsWith('\0') || id.startsWith('.') || path.isAbsolute(id)) {
    return false;
  }
  if (/\.svg(\?|$)/.test(id)) return false;
  return id !== 'ui-public' && !id.startsWith('ui-public/');
}

export default defineConfig({
  root: packageDir,
  publicDir: false,
  envPrefix: [],
  plugins: [
    entryModules(),
    lucideLicence(),
    react(),
    // The same options as the apps (see the vite.config.ts of the cms)
    svgr({
      svgrOptions: {
        icon: true,
        ref: true,
        // The button or the link that holds an icon gives the accessible
        // name. Thus an icon is hidden from assistive technology.
        svgProps: { 'aria-hidden': 'true' },
      },
    }),
  ],
  // The warnings of ui-public for the developer show in the development build of
  // the plugin. Every bundler that bundles React replaces
  // process.env.NODE_ENV, because React reads it too.
  define: {
    'import.meta.env.DEV': 'process.env.NODE_ENV !== "production"',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // The plugin bundles and minifies the output. A readable output makes
    // a stack trace and a debug session in a plugin easier.
    minify: false,
    sourcemap: false,
    target: 'es2020',
    lib: {
      entry: Object.fromEntries(
        entries.map((entry) => [entry.name, `${ENTRY_PREFIX}${entry.name}`]),
      ),
      formats: ['es'],
    },
    rolldownOptions: {
      external: isExternal,
      output: {
        // One file for each module: a plugin bundles only the modules that
        // its imports reach.
        preserveModules: true,
        preserveModulesRoot: path.resolve(packageDir, '..'),
        // The icons of the icon packages go next to the icons of ui-public,
        // in a folder for each set (ui-public/icons/lucide/x.js). npm does
        // not publish a node_modules folder, thus the output cannot keep the
        // path of the package.
        entryFileNames: ({ name }) =>
          ICON_PACKAGE_SVGS.test(name)
            ? `${name
                .replace(
                  ICON_PACKAGE_SVGS,
                  (_, lucide, simpleIcons) =>
                    `ui-public/icons/${lucide ?? simpleIcons}/`,
                )
                .replace(/\.svg(\?.*)?$/, '')}.js`
            : '[name].js',
      },
    },
  },
});
