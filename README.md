<!--datocms-autoinclude-header start-->
<!--datocms-autoinclude-header end-->

# DatoCMS plugin packages

The source of the two npm packages that DatoCMS plugins are built with.

| Package | Source | Docs |
| --- | --- | --- |
| [`datocms-plugin-sdk`](https://www.npmjs.com/package/datocms-plugin-sdk) | [`packages/sdk`](packages/sdk) | [Plugin SDK documentation](https://www.datocms.com/docs/plugin-sdk) · [changelog](packages/sdk/CHANGELOG.md) |
| [`datocms-react-ui`](https://www.npmjs.com/package/datocms-react-ui) | [`packages/react-ui`](packages/react-ui) | [Component docs](https://react-ui.datocms.com/) · [README](packages/react-ui/README.md) · [changelog](packages/react-ui/CHANGELOG.md) |

The SDK connects a plugin to DatoCMS. The React components give a plugin the look of the DatoCMS interface.

> This repository is a copy of a private repository, and each release replaces its content. Pull requests are welcome, but we do not merge them here: see [Contributing](#contributing).

## Versions

| Branch | Holds | On npm |
| --- | --- | --- |
| [`master`](https://github.com/datocms/plugins-sdk/tree/master) | Version 3 of both packages, a prerelease | `npm install datocms-plugin-sdk@next datocms-react-ui@next` |
| [`2.x`](https://github.com/datocms/plugins-sdk/tree/2.x) | `datocms-react-ui` 2.x | `npm install datocms-react-ui` |

A plain `npm install` gets version 2 of both packages. If your plugin uses version 2 of `datocms-react-ui`, read its source on the branch `2.x`, not here. The SDK is developed only on `master`: the branch `2.x` does not have it.

## Build a plugin

You do not need this repository to build a plugin. Start from the [Plugin SDK documentation](https://www.datocms.com/docs/plugin-sdk): it has the guides, the API reference, and the plugin template, which already installs both packages.

## What is in this repository

- [`packages/sdk`](packages/sdk): the SDK. [`ARCHITECTURE.md`](packages/sdk/ARCHITECTURE.md) explains how a plugin talks to DatoCMS.
- [`packages/react-ui`](packages/react-ui): the component library. `src/` has the adapter between the components and the `ctx` of a plugin: `Canvas`, `useCtx`, and `ContextInspector`. `bin/` builds the output.
- [`packages/ui-public`](packages/ui-public): the components themselves. The build of react-ui bundles them into the package. Only the modules that react-ui ships are here.

### Find the source of a component

The source of a component is in `packages/ui-public`, not in `packages/react-ui`. To find the file behind `datocms-react-ui/Button`:

1. [`packages/react-ui/entries.mjs`](packages/react-ui/entries.mjs) lists the public entries. It maps `Button` to `ui-public/Button`.
2. The `exports` of [`packages/ui-public/package.json`](packages/ui-public/package.json) map `./Button` to [`src/actions/Button.tsx`](packages/ui-public/src/actions/Button.tsx).

The CSS of the components is in [`packages/ui-public/styles`](packages/ui-public/styles).

## Build

You need Node 24 (see `.nvmrc`).

```sh
git clone https://github.com/datocms/plugins-sdk && cd plugins-sdk
npm ci
npm run build    # the SDK first, then react-ui: react-ui reads the types of the SDK
npm test         # the tests of the SDK
npm run tsc      # the types of the three packages
npm run lint     # the lint of the three packages
npx biome ci .   # the format
```

These are the commands that the CI runs. `npm run format` fixes what `npx biome ci .` reports.

### Try a change in a plugin

For the SDK, one script builds the package and copies it over the copy that the plugin has installed:

```sh
cd packages/sdk
INSTALL_PATH=/path/to/my-plugin npm run install-in-place
```

For react-ui, pack the build and install the tarball in the plugin:

```sh
cd packages/react-ui
npm pack --pack-destination /tmp
cd /path/to/my-plugin
npm install /tmp/datocms-react-ui-*.tgz
```

If the plugin uses Vite, restart its dev server with `--force` after each install: Vite keeps a cache of the dependencies.

To go back to the versions of npm, run this in the plugin. For react-ui, first put the version back in its `package.json`:

```sh
rm -rf node_modules/datocms-plugin-sdk node_modules/datocms-react-ui node_modules/.vite && npm install
```

## Contributing

**Report a bug or ask for a feature** in the [issues of this repository](https://github.com/datocms/plugins-sdk/issues). For a question about your own plugin or your project, write to [our support team](https://www.datocms.com/support).

**Pull requests are welcome**, with one difference from most repositories: we do not merge them here. This is how a change gets in:

1. Open a pull request to `master`. The CI installs, builds, tests, and lints it, so run the commands of [Build](#build) first.
2. A maintainer reviews it and applies your commits to the private repository, with you as their author.
3. The next release brings the change to `master`, and the pull request closes.

Things to know:

- **Open an issue before a large change.** The CMS uses the same components, so a change to a component also changes the CMS. We can tell you early if it fits.
- **You do not add a changeset or change a version.** The maintainer does it.
- **A fix for `datocms-react-ui` 2.x** goes to the branch [`2.x`](https://github.com/datocms/plugins-sdk/tree/2.x), with a pull request to that branch.
- **Some files are generated**, and a change to them does not apply as it is: the files at the root of the repository, the `package.json` of each package, and `packages/ui-public/tsconfig.json`. Say in the pull request what you need, and a maintainer changes the source.

## How this repository is maintained

DatoCMS develops these packages in a private repository, together with the CMS, which uses the same components. At each release, a script copies here the files that the npm packages are built from, and replaces the whole content of `master`. A check makes sure that the build of `master` is the same, file for file, as the build in the private repository. What you build here is what npm has.

Some comments point to a file of the private repository, such as an `AGENTS.md` file. These files are not here.

## License

MIT, see [`LICENSE.md`](LICENSE.md).

<sub>Source commit: `28973034acaac71e60bc2245d4691f35df58aea3`</sub>

<!--datocms-autoinclude-footer start-->
<!--datocms-autoinclude-footer end-->
