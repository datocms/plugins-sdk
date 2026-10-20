# `datocms-plugin-sdk`

TypeScript SDK to build DatoCMS plugins.

## Using this SDK

To build a plugin with this SDK, see the official [DatoCMS Plugin SDK documentation](https://www.datocms.com/docs/plugin-sdk) for guides and API reference.

Plugins scaffolded from the official plugin template already include the SDK (alongside [`datocms-react-ui`](https://github.com/datocms/plugins-sdk/tree/master/packages/react-ui)). You should not need to manually add this.

## Developing

DatoCMS develops this package in a private repository, together with the CMS that hosts the plugins. The branch [`next` of `datocms/plugins-sdk`](https://github.com/datocms/plugins-sdk/tree/next) has a copy of its source and of the source of [`datocms-react-ui`](https://github.com/datocms/plugins-sdk/tree/next/packages/react-ui), updated at each release. Its README tells how to propose a change.

To build the SDK from that branch:

```sh
git clone --branch next https://github.com/datocms/plugins-sdk && cd plugins-sdk
npm ci
npm run build
npm test
```

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

The maintainers release the SDK from the private repository, with changesets. Each release updates the branch `next`.
