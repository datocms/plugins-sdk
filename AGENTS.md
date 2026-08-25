# DatoCMS Plugin SDK monorepo

npm-workspaces monorepo, built with Turborepo and released with Changesets, using **`linked` versioning** (packages released together share one version number; a package nobody touched keeps the version it had). It contains two npm packages:

- `packages/sdk` → `datocms-plugin-sdk` — core TypeScript SDK for building DatoCMS plugins
- `packages/react-ui` → `datocms-react-ui` — React components mimicking the DatoCMS UI; depends on `datocms-plugin-sdk`

## Setup and commands (run from repo root)

```bash
npm install          # workspaces: one install at the root wires up both packages
npm run build        # turbo; builds in dependency order (sdk before react-ui), and caches
npm test             # Jest unit tests
npm run format       # biome check + format
npx changeset        # describe a change for the next release (commit the file it writes)
```

## Testing changes inside a real plugin

Each package has an `install-in-place` script that rebuilds **that package only** and copies its artifacts over the installed copy in a plugin project:

```bash
cd packages/<pkg> && INSTALL_PATH=/path/to/plugin npm run install-in-place
```

Use it instead of `npm link` (a symlinked React library breaks with duplicate-React "Invalid hook call" errors). If a change spans both packages, run the sdk's script before react-ui's — react-ui compiles against the sdk's build output.

## Gotchas

- Every user-visible change needs a changeset (`npx changeset`) in the same PR, or it ships with no release note. `patch` is for bug fixes only; new API surface is `minor`.
- Releasing (maintainers only): `npm run publish` from the root, on a clean `master`. It builds and tests, applies the pending changesets, publishes to npm, then tags, pushes, and opens the GitHub releases. An interrupted release is resumed by re-running it, never undone. See `bin/publish.mjs`.
- One `name@X.Y.Z` tag and one GitHub release **per package**. `changeset publish` does the publishing and the tagging itself, in that order and only for the packages npm accepted, so a tag can't outlive a failed publish. What is being released comes from `changeset publish-plan --output`, not from anything the script reconstructs. Each release's body is that package's own `CHANGELOG.md` section — when a package moved only because the other one did, that section is just its dependency bump, which is the honest thing to show. Releases up to v2.2.7 used a single `vX.Y.Z` tag instead; those tags stay where they are.

## More detail

- `packages/react-ui/AGENTS.md` — react-ui architecture (CSS Modules JSON pipeline, dual CJS/ESM output, theming via `ctx`)
- Each package README has a human-facing "Developing" section; keep them in sync with these files.
