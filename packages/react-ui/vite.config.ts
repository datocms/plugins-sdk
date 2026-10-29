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

// The code of ui-public and its icons go into the output. Every npm package stays
// an import: it is a dependency or a peer of react-ui.
function isExternal(id: string) {
  if (id.startsWith('\0') || id.startsWith('.') || path.isAbsolute(id)) {
    return false;
  }
  return id !== 'ui-public' && !id.startsWith('ui-public/');
}

export default defineConfig({
  root: packageDir,
  publicDir: false,
  envPrefix: [],
  plugins: [
    entryModules(),
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
        entryFileNames: '[name].js',
      },
    },
  },
});
