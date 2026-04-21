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
  `--color--ink-accent`, …
- `--color--border`, `--color--border-hover`
- Per-context variants: `--color--primary--surface`, `--color--primary--ink`,
  `--color--tinted--surface`, `--color--accent--ink`,
  `--color--selected--surface`, `--color--disabled--surface`,
  `--color--danger--surface`, …
- Feedback: `--color--feedback-fail--ink`,
  `--color--feedback-warning--surface`, `--color--feedback-success--ink`, …
- Plus diff, status, overlay, stacked, progress, tooltip, code and shadow
  groups.

See the `Canvas` JSDoc for the full reference.

All built-in components (`Button`, `Dropdown`, `Section`, `TextInput`,
`SwitchInput`, `Toolbar`, `Tooltip`, …) now use these tokens. Built-in
icons render with `fill="currentColor"` and inherit the surrounding
`color`.

### Deprecated CSS variables

The legacy color custom properties (`--border-color`, `--base-body-color`,
`--alert-color`, `--add-color`, etc.) are still defined for backward
compatibility. Each one now resolves to the closest semantic token first,
falling back to its original light-mode value if the token is unavailable.

These will be removed in a future major version. Migrate to the
`--color--*` tokens documented above.

Non-color tokens (`--spacing-*`, `--font-size-*`, `--font-weight-bold`,
`--material-ease`, font families) are stable and remain available.
