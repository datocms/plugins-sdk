# Upgrading datocms-plugin-sdk

## v3.0.0 — Semantic color tokens

The plugin context now exposes a `semanticColorTokensTheme` field with the
active color palette for the current DatoCMS host. This is the new source
of truth for plugin theming and supports dark mode.

### What's new

- `ctx.semanticColorTokensTheme` — a record of semantic color token values
  (e.g. `colorSurface`, `colorInk`, `colorPrimarySurface`, …). The host
  computes these for the user's active theme, including dark mode.
- `ctx.theme` — still present and unchanged in shape, but **deprecated**.
  Kept for backward compatibility with third-party plugins that read it
  directly.

### Action required

If your plugin uses `datocms-react-ui`, see
[its upgrade notes](../react-ui/UPGRADING.md) — most of the visible
changes are there, including the dark-mode audit checklist.

If your plugin reads `ctx.theme` directly, you can keep doing so for now.
Migrating to `ctx.semanticColorTokensTheme` will let your plugin follow
the user's active theme (including dark mode).
