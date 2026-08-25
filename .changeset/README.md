# Changesets

This folder holds the pending release notes for the next version.

Whenever you change something worth mentioning in a release, run `npx changeset`
and answer the two prompts (which packages, and whether it's a patch/minor/major).
That writes a small markdown file here, which you commit along with your changes.

At release time `npm run publish` consumes every pending file: it computes the
resulting version, updates the `package.json`s and the `CHANGELOG.md`s, and
deletes the files.

`datocms-plugin-sdk` and `datocms-react-ui` are a `fixed` group: they always
share the same version and are released together, exactly as they were under
Lerna. So the package list inside a changeset matters far less than the bump
level you pick.

## Which bump level?

- `patch` — bug fixes only. It's the clearest signal in semver ("nothing new,
  just a fix"), so we don't spend it on anything else.
- `minor` — new API surface. A new hook, a new component, a new `ctx` method.
- `major` — something was removed or renamed.

## Prereleases

`npm run publish-next` publishes under the `next` dist-tag, leaving `latest`
untouched. It works in two modes:

- **as-is** — the pending changesets produce a normal version (say `2.3.0`)
  which is published under `next` instead of `latest`;
- **real prerelease versions** — run `npx changeset pre enter next` first and
  the same command produces `2.3.0-next.0`, `2.3.0-next.1`, … That mode is
  recorded in `.changeset/pre.json`, which you commit. Run
  `npx changeset pre exit` when the line is done.

`npm run publish` refuses to run while `.changeset/pre.json` exists, so a
forgotten pre mode can't quietly turn a real release into a prerelease.
