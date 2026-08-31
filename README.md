<!--datocms-autoinclude-header start-->

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)

---

<!--datocms-autoinclude-header end-->

# DatoCMS Plugin SDK

Monorepo with the TypeScript libraries used to build DatoCMS plugins.

## Building a plugin?

You should not need to install these packages manually. Follow our [Build your first plugin](https://www.datocms.com/docs/plugin-sdk/build-your-first-plugin#set-up-your-project) guide to easily scaffold a plugin with both packages already set up. 

From there, the [Plugin SDK documentation](https://www.datocms.com/docs/plugin-sdk/introduction) and [real-world examples](https://www.datocms.com/docs/plugin-sdk/real-world-examples) cover everything else.

## Packages

- [`datocms-plugin-sdk`](https://github.com/datocms/plugins-sdk/tree/master/packages/sdk)
  - TypeScript SDK to build DatoCMS plugins.
- [`datocms-react-ui`](https://github.com/datocms/plugins-sdk/tree/master/packages/react-ui)
  - React component library to mimic the DatoCMS interface inside plugins.

## Developing

To work on the packages themselves (e.g. to prepare a PR or debug an issue in the framework itself), see the "Developing" section of each package's README: [`datocms-plugin-sdk`](https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/README.md#developing), [`datocms-react-ui`](https://github.com/datocms/plugins-sdk/blob/master/packages/react-ui/README.md#developing). Both are developed in this npm-workspaces monorepo, and share a version number whenever they are released together.

## Trying a change before it's released

Every push to a branch here publishes a preview of both packages, which you can
install into a real plugin — no npm release, no `npm link`:

```
npm i https://pkg.pr.new/datocms-plugin-sdk@<commit-sha>
npm i https://pkg.pr.new/datocms-react-ui@<commit-sha>
```

The exact URLs show up in the commit's check run on GitHub, and in a comment on
the pull request once there is one. Installing one preview pulls in the previews
of its siblings built from the same commit, so a change spanning several
packages can be tried as one coherent set.

Previews are throwaway: they are never published to npm, and the URL stops
resolving after a while. Never commit one to a `package.json` that ships.

## Releasing

Maintainers only. The two packages share one version number and are always
released together.

1. **Describe your change.** Run `npx changeset` in the same PR that makes the
   change: it asks which packages are affected and whether the bump is a
   patch/minor/major, then writes a small markdown file under `.changeset/`
   which you commit. `patch` is for bug fixes only; new API surface is
   `minor`. See [`.changeset/README.md`](.changeset/README.md).
2. **Release.** From an up-to-date, clean `master`, run `npm run release`.
   It builds and tests first, then applies the pending changesets (bumping the
   versions and writing the `CHANGELOG.md`s), publishes to npm, and only then
   tags each package `name@X.Y.Z`, pushes, and publishes one GitHub release per
   tag — its notes are the changelog entries changesets just wrote.

If a release is interrupted, **do not undo anything**: run `npm run release`
again. It detects that some package is still missing from the registry and
resumes the publish instead of starting a new release.

`npm run release:next` does the same under the `next` dist-tag, leaving
`latest` untouched; its GitHub releases are marked as prereleases, so they don't
become the repository's "Latest release" either.

The script itself is
[`@datocms/release-toolchain`](https://github.com/datocms/release-toolchain),
shared with every other DatoCMS repository and pinned here by tag.

## License

This repository is published under the [MIT](LICENSE.md) license.

<!--datocms-autoinclude-footer start-->

---

# What is DatoCMS?

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60" alt="DatoCMS - The Headless CMS for the Modern Web"></a>

[DatoCMS](https://www.datocms.com/) is Headless CMS for the modern web. Trusted by 25,000+ businesses, agencies, and individuals, it gives your team one place to manage content and ship it to any website, app, or device via API.

**New here?** Start with [Create free account](https://dashboard.datocms.com/signup) and the [Documentation](https://www.datocms.com/docs). Stuck? Ask the [Community](https://community.datocms.com/). Curious what's new? [Product Updates](https://www.datocms.com/product-updates).

**Building with AI:** [Agent Skills](https://www.datocms.com/docs/agent-skills) turn coding assistants (Claude Code, Cursor) into expert DatoCMS developers, with full read/write via the auto-installed CLI. No local terminal? Use the [MCP Server](https://www.datocms.com/docs/mcp-server) instead.

**Talking to DatoCMS from code:**
- [Content Delivery API](https://www.datocms.com/docs/content-delivery-api) (CDA) — the fast, read-only GraphQL API your website/app uses to **fetch** published content.
- [Content Management API](https://www.datocms.com/docs/content-management-api) (CMA) — the REST API for **creating and updating** content, models, and project settings (think scripts, migrations, integrations).
- [CLI](https://www.datocms.com/docs/scripting-migrations/installing-the-cli) — terminal tool for schema migrations and importing from Contentful/WordPress.

**Framework guides:** end-to-end recipes for fetching content, rendering Structured Text, optimizing images/video, handling SEO, and setting up live preview with visual editing in [Next.js](https://www.datocms.com/docs/next-js), [Nuxt](https://www.datocms.com/docs/nuxt), [Svelte](https://www.datocms.com/docs/svelte), and [Astro](https://www.datocms.com/docs/astro).

**Want a head start?** Browse our [starter projects](https://www.datocms.com/marketplace/starters) — ready-to-deploy example sites for popular frameworks.


<!--datocms-autoinclude-footer end-->
