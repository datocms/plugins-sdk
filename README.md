# DatoCMS plugin packages: the source

This branch holds the source of the two npm packages of the DatoCMS plugins:

- [`datocms-plugin-sdk`](https://www.npmjs.com/package/datocms-plugin-sdk) 2.6.0-next.1 (`packages/sdk`): the SDK that connects a plugin to DatoCMS.
- [`datocms-react-ui`](https://www.npmjs.com/package/datocms-react-ui) 3.1.0-next.1 (`packages/react-ui`): the React components of the plugins.

DatoCMS develops these packages in a private repository, together with the CMS that uses the same components. At each release, a script copies here the files that the npm packages are built from. A check makes sure that the build of this branch is the same, file for file, as the build in the private repository.

Do not edit this branch by hand: the next release replaces it. To propose a change, see [Contributing](#contributing).

The source of `datocms-react-ui` 2.x is on the branch [`2.x`](https://github.com/datocms/plugins-sdk/tree/2.x). A fix for 2.x goes there, with a pull request to that branch.

Copied from the commit `060eada71843af0749b3c3c8f83db94dffc39261` of the private repository.

## What is here

- `packages/sdk`: the SDK. `ARCHITECTURE.md` tells how a plugin talks to DatoCMS, and `README.md` tells how to try a change in a plugin.
- `packages/react-ui`: the component library. `entries.mjs` lists its public entries (`datocms-react-ui/Button`). `src/` has the adapter between the components and the `ctx` of a plugin: `Canvas`, `useCtx` and `ContextInspector`. `bin/` builds the output. `README.md` is the documentation of the package.
- `packages/ui`: the components. The build of react-ui bundles them into the package. Only the modules that react-ui ships are here.

Some comments point to a file of the private repository, such as an `AGENTS.md` file. These files are not here.

## Build

You need Node 24 (see `.nvmrc`).

```sh
npm ci
npm run build   # the SDK first, then react-ui: react-ui reads the types of the SDK
npm test
npm run tsc
npm run lint
```

To try a change in a plugin, pack the build and install the tarball in the plugin:

```sh
cd packages/react-ui   # or packages/sdk
npm pack
cd ../../../my-plugin
npm install ../path/to/the.tgz
```

## Contributing

- **Report a bug or ask for a feature** in the [issues of this repository](https://github.com/datocms/plugins-sdk/issues).
- **Propose a change with a pull request** to this branch. Build the branch before you open the pull request: its CI builds it too.
- **We do not merge a pull request into this branch,** because the next release replaces it. A maintainer applies your commits to the private repository, with you as their author. The pull request closes when a release brings the change here.
- **Some files are generated** and a change to them does not apply as it is: the files at the root of this branch, the `package.json` of each package, and `packages/ui/tsconfig.json`. Say in the pull request what you need, and a maintainer changes the source.

## License

MIT, see `LICENSE.md`.
