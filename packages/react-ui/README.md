# `datocms-react-ui`

React component library to mimic the DatoCMS interface inside plugins.

## Using these components

To build a plugin with these components, see the official [DatoCMS Plugin SDK documentation](https://www.datocms.com/docs/plugin-sdk) for guides and component reference. Plugins scaffolded from the official plugin template already include this package (alongside `datocms-plugin-sdk`). You should not need to manually add this.

## Developing

This package is developed in the [`datocms/plugins-sdk`](https://github.com/datocms/plugins-sdk) repository, a [Lerna](https://lerna.js.org/) monorepo (a single Git repo hosting multiple npm packages, with Lerna managing their shared version number and publishing). The monorepo contains two packages, released in lockstep:

- [`datocms-plugin-sdk`](https://github.com/datocms/plugins-sdk/tree/master/packages/sdk) — the core plugin SDK;
- `datocms-react-ui` — this component library, which depends on it.

To work on the library itself (e.g. to prepare a PR), clone the whole monorepo — this package isn't buildable standalone:

```sh
git clone https://github.com/datocms/plugins-sdk && cd plugins-sdk
npm install && npx lerna bootstrap   # root tooling + per-package dependencies
npx lerna run build                  # build all packages in dependency order
```

To verify the checkout, `npm test` runs the monorepo's small Jest suite (unit tests for SDK and UI helpers); it takes a couple of seconds and every test should pass.

A fresh checkout won't compile until that first build: components import generated `styles.module.css.json` class maps, and this package needs `datocms-plugin-sdk`'s build output — so a `Cannot find module './styles.module.css.json'` error just means "run the build".

### Testing your changes inside a real plugin

Don't use `npm link` — symlinking a React library commonly breaks with duplicate-React "Invalid hook call" errors. Instead, use our provided npm `install-in-place` script, which rebuilds **this package only** and copies its artifacts (`dist/`, `styles.css`, `types.json`) over the copy installed in a plugin project:

```sh
cd packages/react-ui
INSTALL_PATH=/path/to/your-plugin npm run install-in-place
```

Re-run it after every change; if the plugin uses Vite, restart the dev server with `--force` so its dependency cache doesn't serve stale bits. If your change also touches `datocms-plugin-sdk`, run that package's own `install-in-place` too, **before** this one — this package compiles against the SDK's build output. To restore the registry version afterwards, in the plugin run:

```sh
rm -rf node_modules/datocms-react-ui node_modules/.vite && npm install
```

### Releasing (maintainers)

From the repo root, `npm run publish` runs the tests, builds everything, and hands off to `lerna publish`, which bumps **both** packages to the same version (fixed mode), commits, tags `vX.Y.Z`, and publishes to npm. Use `npm run publish-next` for a prerelease under the `next` dist-tag.

For deeper architectural notes (CSS Modules pipeline, dual CJS/ESM output, theming via `ctx`), see [`AGENTS.md`](https://github.com/datocms/plugins-sdk/blob/master/packages/react-ui/AGENTS.md) in this directory.
