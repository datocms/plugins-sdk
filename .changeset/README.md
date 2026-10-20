# Changesets

This folder holds the pending release notes for the next version.

Whenever you change something worth mentioning in a release, run `npx changeset`
and answer the two prompts (which packages, and whether it's a patch/minor/major).
That writes a small markdown file here, which you commit along with your changes.

At release time `npm run release` consumes every pending file: it computes the
resulting version, updates the `package.json`s and the `CHANGELOG.md`s, and
deletes the files.

This is the `2.x` branch: it releases only `datocms-react-ui` 2.x. The SDK
(`datocms-plugin-sdk`) and `datocms-react-ui` 3.x are on `master`, and are
released from there.

## Which dist-tag?

While `datocms-react-ui` 3.0 is in prerelease, `npm run release` publishes a 2.x
fix under `latest`, as before. Once 3.0 is stable, `latest` belongs to 3.x:
release 2.x with `npm run release:v2` instead, which publishes under the `v2`
dist-tag. A plain `npm run release` would move `latest` back to 2.x.

## Which bump level?

- `patch` — bug fixes only. It's the clearest signal in semver ("nothing new,
  just a fix"), so we don't spend it on anything else.
- `minor` — new API surface. A new hook, a new component, a new `ctx` method.
- `major` — something was removed or renamed.

## Prereleases

`npm run release:next` publishes under the `next` dist-tag, leaving `latest`
untouched. It works in two modes:

- **as-is** — the pending changesets produce a normal version (say `2.3.0`)
  which is published under `next` instead of `latest`;
- **real prerelease versions** — run `npx changeset pre enter next` first and
  the same command produces `2.3.0-next.0`, `2.3.0-next.1`, … That mode is
  recorded in `.changeset/pre.json`, which you commit. Run
  `npx changeset pre exit` when the line is done.

Either way the GitHub release is marked as a prerelease, so it never becomes
the repository's "Latest release".

`npm run release` refuses to run while `.changeset/pre.json` exists, so a
forgotten pre mode can't quietly turn a real release into a prerelease.
