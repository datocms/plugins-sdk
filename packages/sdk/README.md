# `datocms-plugin-sdk`

TypeScript SDK to build DatoCMS plugins.

## Using this SDK

To build a plugin with this SDK, see the official [DatoCMS Plugin SDK documentation](https://www.datocms.com/docs/plugin-sdk) for guides and API reference.

Plugins scaffolded from the official plugin template already include the SDK (alongside [`datocms-react-ui`](https://github.com/datocms/plugins-sdk/tree/master/packages/react-ui)). You should not need to manually add this.

## Developing

This package is developed in the [`datocms/plugins-sdk`](https://github.com/datocms/plugins-sdk) repository, a [Lerna](https://lerna.js.org/) monorepo (a single Git repo hosting multiple npm packages, with Lerna managing their shared version number and publishing). The monorepo contains two packages, released in lockstep:

- `datocms-plugin-sdk` — this core plugin SDK;
- [`datocms-react-ui`](https://github.com/datocms/plugins-sdk/tree/master/packages/react-ui) — a React component library that depends on it.

To work on the SDK (e.g. to prepare a PR), clone the whole monorepo — this package isn't buildable standalone:

```sh
git clone https://github.com/datocms/plugins-sdk && cd plugins-sdk
npm install && npx lerna bootstrap   # root tooling + per-package dependencies
npx lerna run build                  # build all packages in dependency order
```

To verify the checkout, `npm test` runs the monorepo's small Jest suite (unit tests for SDK and UI helpers); it takes a couple of seconds and every test should pass.

### Testing your changes inside a real plugin

Use the provided npm `install-in-place` script, which rebuilds **this package only** and copies its artifacts (`dist/`, `manifest.json`) over the copy installed in a plugin project:

```sh
cd packages/sdk
INSTALL_PATH=/path/to/your-plugin npm run install-in-place
```

Re-run it after every change; if the plugin uses Vite, restart the dev server with `--force` so its dependency cache doesn't serve stale bits. This is enough even if the plugin also uses `datocms-react-ui`: at runtime the UI library resolves `datocms-plugin-sdk` from the plugin's `node_modules`, so it picks up your copied build automatically. To restore the registry version afterwards, in the plugin run:

```sh
rm -rf node_modules/datocms-plugin-sdk node_modules/.vite && npm install
```

### Releasing (maintainers)

From the repo root, `npm run publish` runs the tests, builds everything, and hands off to `lerna publish`, which bumps **both** packages to the same version (fixed mode), commits, tags `vX.Y.Z`, and publishes to npm. Use `npm run publish-next` for a prerelease under the `next` dist-tag.
