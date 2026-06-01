# Upgrading datocms-react-ui

## v3.0.0 — Semantic color tokens and dark-mode support

This release reworks the color system around the host's semantic color
tokens. The CMS now computes a full color palette for the active theme
(including dark mode), and `datocms-react-ui` consumes it directly. All
built-in components automatically adapt to whichever theme the user has
selected.

### Action required

**Test your plugin in dark mode before publishing.** Upgrading to v3 opts
your plugin into the host's active theme. If the user has dark mode
enabled, your plugin renders with dark colors.

Common things to audit:

- **Hardcoded colors** in your CSS (e.g. `color: #333`, `background: white`).
  They won't follow the theme; users in dark mode will see them as-is and
  the contrast may break.
- **Hardcoded SVG fills** in custom icons. Use `fill="currentColor"` so they
  inherit the surrounding `color`.
- **Custom CSS that mixes library components with your own colors.** Verify
  the combinations look right in both themes.

### What's new

A new set of CSS custom properties is available inside `<Canvas>`. They
follow the host's active theme:

- `--color--surface`, `--color--surface-hover`, `--color--surface-muted`, …
- `--color--ink`, `--color--ink-subtle`, `--color--ink-placeholder`,
  `--color--ink-link`, `--color--ink-danger`, …
- `--color--border`, `--color--border-hover`
- Per-context variants: `--color--primary--surface`, `--color--primary--ink`,
  `--color--primary--surface-secondary`, `--color--primary-soft--surface`,
  `--color--selected--surface`, `--color--disabled--surface`,
  `--color--danger--surface`, …
- Signal tones: `--color--danger-soft--surface`,
  `--color--warning-soft--surface`, `--color--success-soft--ink`, …
- Plus diff, status, overlay, stacked, progress, tooltip, code and shadow
  groups.

See the `Canvas` JSDoc for the full reference.

All built-in components (`Button`, `Dropdown`, `Section`, `TextInput`,
`SwitchInput`, `Toolbar`, `Tooltip`, …) now use these tokens. Built-in
icons render with `fill="currentColor"` and inherit the surrounding
`color`.

### Deprecated CSS variables

Two groups of legacy color variables remain available for backward
compatibility, but **both are deprecated and will be removed in a future
major version**. Migrate everything to the `--color--*` semantic tokens.

**Structural legacy vars** — defined inside `<Canvas>` (e.g.
`--border-color`, `--base-body-color`, `--light-bg-color`, `--alert-color`,
`--add-color`, `--remove-color`, …). Each one now resolves to the closest
semantic token first, falling back to its original light-mode value if the
token is unavailable. So a v3 plugin that still uses them will follow the
active theme.

**Theme-derived legacy vars** — `--accent-color`, `--primary-color`,
`--light-color`, `--dark-color`, `--semi-transparent-accent-color` (plus
their `*-rgb-components` counterparts). These are emitted from the
deprecated `ctx.theme` field, which the host now pins to **light values
only**, regardless of the active theme. Mixing these with the new
`--color--*` tokens in dark mode will produce a light accent on a dark
surface — visibly mismatched. Replace them with the corresponding
semantic tokens (`--color--primary--surface-secondary`, `--color--primary--ink`,
`--color--primary--surface`, etc.).

Non-color tokens (`--spacing-*`, `--font-size-*`, `--font-weight-bold`,
`--material-ease`, font families) are stable and remain available.
