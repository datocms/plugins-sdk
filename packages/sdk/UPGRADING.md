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
  `'system'` for you. On initial handshake and on every ctx update, the SDK
  runtime reflects this onto `document.documentElement` two ways:

  - the `data-color-scheme="light"` / `data-color-scheme="dark"` attribute,
    so you can theme with explicit CSS selectors:

    ```css
    [data-color-scheme="dark"] .my-panel { background: #222; }
    ```

  - the actual `color-scheme` CSS property, so [`light-dark()`][light-dark]
    resolves to the correct branch (and native form controls / scrollbars
    match the active scheme) anywhere in your plugin frame:

    ```css
    .my-panel { background: light-dark(#fff, #222); }
    ```

  For non-CSS decisions (picking a logo asset, a syntax-highlighting
  preset, …) branch on `ctx.colorScheme` directly.

[light-dark]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark

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
