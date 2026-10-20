# datocms-react-ui 2.x

This is the `2.x` branch: the maintenance line of `datocms-react-ui` 2.x, built with Turborepo and released with Changesets. It contains one npm package:

- `packages/react-ui` → `datocms-react-ui` — React components mimicking the DatoCMS UI; depends on `datocms-plugin-sdk` from npm

The SDK (`datocms-plugin-sdk`) and `datocms-react-ui` 3.x are on `master`. Do not add the SDK back here: it has one source.

## Setup and commands (run from repo root)

```bash
npm install          # workspaces: one install at the root
npm run build        # turbo; builds react-ui, and caches
npm test             # Jest unit tests
npm run format       # biome check + format
npx changeset        # describe a change for the next release (commit the file it writes)
```

## Testing changes inside a real plugin

Each package has an `install-in-place` script that rebuilds **that package only** and copies its artifacts over the installed copy in a plugin project:

```bash
cd packages/<pkg> && INSTALL_PATH=/path/to/plugin npm run install-in-place
```

Use it instead of `npm link` (a symlinked React library breaks with duplicate-React "Invalid hook call" errors).

## Gotchas

- Every user-visible change needs a changeset (`npx changeset`) in the same PR, or it ships with no release note. `patch` is for bug fixes only; new API surface is `minor`.
- Releasing (maintainers only): `npm run release` from the root, on a clean `2.x`. Once react-ui 3.0 is stable, use `npm run release:v2` instead, so that `latest` stays on 3.x (see `.changeset/README.md`). It builds and tests, applies the pending changesets, publishes to npm, then tags, pushes, and opens the GitHub releases. An interrupted release is resumed by re-running it, never undone. The script is [`@datocms/release-toolchain`](https://github.com/datocms/release-toolchain), shared by every DatoCMS repository and pinned here by git tag.
- One `name@X.Y.Z` tag and one GitHub release **per package**. `changeset publish` does the publishing and the tagging itself, in that order and only for the packages npm accepted, so a tag can't outlive a failed publish. What is being released comes from `changeset publish-plan --output`, not from anything the script reconstructs. Each release's body is that package's own `CHANGELOG.md` section — when a package moved only because the other one did, that section is just its dependency bump, which is the honest thing to show. Releases up to v2.2.7 used a single `vX.Y.Z` tag instead; those tags stay where they are.

## More detail

- `packages/react-ui/AGENTS.md` — react-ui architecture (CSS Modules JSON pipeline, dual CJS/ESM output, theming via `ctx`)
- Each package README has a human-facing "Developing" section; keep them in sync with these files.
