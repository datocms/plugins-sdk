# Changesets

This folder holds the pending release notes for the next version.

Whenever you change something worth mentioning in a release, run `npx changeset`
and answer the two prompts (which packages, and whether it's a patch/minor/major).
That writes a small markdown file here, which you commit along with your changes.

At release time `npm run release` consumes every pending file: it computes the
resulting version, updates the `package.json`s and the `CHANGELOG.md`s, and
deletes the files.

`datocms-plugin-sdk` and `datocms-react-ui` are a `linked` group: anything
released together lands on the same version, but a package nobody touched keeps
the version it had. This is the exact translation of what Lerna's
`"version": "2.2.7"` did.

So the package list inside a changeset does matter. List every package whose
*own* behaviour changed — but not the ones that merely depend on it, which
changesets handles by itself. In practice:

- a fix in `datocms-react-ui` alone takes it to 2.2.8 and leaves
  `datocms-plugin-sdk` at 2.2.7;
- a `minor` in `datocms-plugin-sdk` alone takes it to 2.3.0 and leaves
  `datocms-react-ui` at 2.2.7, because `^2.2.7` already allows 2.3.0;
- a `major` in `datocms-plugin-sdk` takes **both** to 3.0.0 — the range breaks,
  so `datocms-react-ui` has to move, and being linked it moves to the same
  version rather than to 2.2.8.

That last case is what the group buys: the two never end up at versions that
contradict each other, like a `datocms-react-ui@2.2.8` that requires
`datocms-plugin-sdk@^3.0.0`.

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
