---
'datocms-plugin-sdk': minor
---

Add `explicitConfirmation` and `acknowledgement` to the options of `ctx.openConfirm`

The confirmation panel of a plugin can now ask for the same checks as the
panels of the CMS itself, before the choices turn on:

- `explicitConfirmation: { label, confirmString }`: the user must type
  `confirmString` (for example the name of a project) in an input
- `acknowledgement`: the label of a switch that the user must turn on

Both are optional. A CMS that is older than this release ignores them and
shows the panel without the checks.
