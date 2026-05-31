# Upgrading datocms-plugin-sdk

## v3.0.0 — Semantic color tokens

The plugin context now exposes a `semanticColorTokensTheme` field with the
active color palette for the current DatoCMS host. This is the new source
of truth for plugin theming and supports dark mode.

### What's new

- `ctx.semanticColorTokensTheme` — a `Record<string, string>` mapping CSS
  custom property names to their resolved values (e.g.
  `{ '--color--surface': '…', '--color--primary--surface': '…' }`). The host
  computes these for the user's **active theme**, light or dark per the
  user's preference. The SDK applies whatever the host sends verbatim and
  keeps no token list of its own, so the vocabulary can evolve host-side
  without an SDK release. If you use `datocms-react-ui`, `Canvas` injects
  these onto the canvas for you; otherwise apply them yourself, e.g.
  `Object.assign(document.documentElement.style, ctx.semanticColorTokensTheme)`.
- `ctx.theme` — still present and unchanged in shape, but **deprecated**.
  The host now pins this field to **light-mode values only**, regardless
  of the user's active theme, so existing plugins that read it (or use
  the `--accent-color` / `--light-color` / `--primary-color` /
  `--dark-color` / `--semi-transparent-accent-color` CSS vars derived
  from it) keep rendering exactly as they did before.
- `ctx.colorScheme` — `'light'` or `'dark'`. The host has already resolved
  `'system'` for you. The SDK runtime also writes
  `document.documentElement.dataset.colorScheme` to `"light"` / `"dark"`
  on initial handshake and on every ctx update, so you can theme with CSS
  selectors like:

  ```css
  [data-color-scheme="dark"] .my-panel { background: #222; }
  ```

  For non-CSS decisions (picking a logo asset, a syntax-highlighting
  preset, …) branch on `ctx.colorScheme` directly.

> **Host contract.** `ctx.theme` always returns light-mode colors;
> `ctx.semanticColorTokensTheme` is theme-aware. This lets plugins upgrade
> to the latest version without breaking, and opt into the active theme by
> reading the new field.

### Action required

If your plugin uses `datocms-react-ui`, see
[its upgrade notes](../react-ui/UPGRADING.md) — most of the visible
changes are there, including the dark-mode audit checklist.

If your plugin reads `ctx.theme` directly, you can keep doing so for now.
Migrating to `ctx.semanticColorTokensTheme` will let your plugin follow
the user's active theme (including dark mode).
