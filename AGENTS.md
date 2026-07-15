# DatoCMS Plugin SDK monorepo

Lerna monorepo with **fixed/lockstep versioning** (both packages always share one version number) containing two npm packages:

- `packages/sdk` → `datocms-plugin-sdk` — core TypeScript SDK for building DatoCMS plugins
- `packages/react-ui` → `datocms-react-ui` — React components mimicking the DatoCMS UI; depends on `datocms-plugin-sdk`

## Setup and commands (run from repo root)

```bash
npm install && npx lerna bootstrap   # required on fresh checkout; package-local commands fail without it
npx lerna run build                  # builds in dependency order (sdk before react-ui)
npm test                             # Jest unit tests
npm run format                       # biome check + format
```

## Testing changes inside a real plugin

Each package has an `install-in-place` script that rebuilds **that package only** and copies its artifacts over the installed copy in a plugin project:

```bash
cd packages/<pkg> && INSTALL_PATH=/path/to/plugin npm run install-in-place
```

Use it instead of `npm link` (a symlinked React library breaks with duplicate-React "Invalid hook call" errors). If a change spans both packages, run the sdk's script before react-ui's — react-ui compiles against the sdk's build output.

## Gotchas

- CI (`.github/workflows/node.js.yml`) triggers on `main`, but the default branch is `master`, so PRs get no automated checks — run `npm test` and a full `npx lerna run build` locally before opening one.
- Releasing (maintainers only): `npm run publish` from the root → `lerna publish` bumps both packages, commits, tags `vX.Y.Z`, and publishes to npm.

## More detail

- `packages/react-ui/AGENTS.md` — react-ui architecture (CSS Modules JSON pipeline, dual CJS/ESM output, theming via `ctx`)
- Each package README has a human-facing "Developing" section; keep them in sync with these files.
