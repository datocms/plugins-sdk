# `datocms-plugin-sdk`

TypeScript SDK to build DatoCMS plugins.

## Using this SDK

To build a plugin with this SDK, see the official [DatoCMS Plugin SDK documentation](https://www.datocms.com/docs/plugin-sdk) for guides and API reference.

Plugins scaffolded from the official plugin template already include the SDK (alongside [`datocms-react-ui`](https://github.com/datocms/plugins-sdk/tree/master/packages/react-ui)). You should not need to manually add this.

## Developing

This package is developed in the [`datocms/plugins-sdk`](https://github.com/datocms/plugins-sdk) repository, an npm-workspaces monorepo (a single Git repo hosting multiple npm packages) built with [Turborepo](https://turborepo.com/) and released with [Changesets](https://github.com/changesets/changesets), which keeps their version number shared. The monorepo contains two packages, released in lockstep:

- `datocms-plugin-sdk` — this core plugin SDK;
- [`datocms-react-ui`](https://github.com/datocms/plugins-sdk/tree/master/packages/react-ui) — a React component library that depends on it.

To work on the SDK (e.g. to prepare a PR), clone the whole monorepo — this package isn't buildable standalone:

```sh
git clone https://github.com/datocms/plugins-sdk && cd plugins-sdk
npm install                          # workspaces: one install wires up both packages
npm run build                        # turbo; builds all packages in dependency order
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

Every user-visible change needs a changeset: run `npx changeset` from the repo root in the same PR, pick the bump level (`patch` is for bug fixes only, new API surface is `minor`) and commit the file it writes under `.changeset/`.

To release, from an up-to-date, clean `master`, run `npm run publish` from the repo root. It builds and tests, applies the pending changesets — bumping **both** packages to the same version (fixed group) and writing the `CHANGELOG.md`s — publishes to npm, and only then tags (`datocms-plugin-sdk@X.Y.Z`) and pushes. An interrupted release is resumed by re-running it, never undone. Use `npm run publish-next` for a prerelease under the `next` dist-tag.
