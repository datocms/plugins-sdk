---
'datocms-plugin-sdk': minor
---

Add the date and time preferences of the user to `ctx.ui`

`ctx.ui` had only `locale`. It now also carries the settings the CMS itself uses
to show dates and times, so a plugin can format them the way the user sees them
everywhere else:

- `dateFormat`: a `date-fns` pattern, such as `dd/MM/yyyy`
- `timezone`: an IANA time zone, such as `Europe/Rome`
- `twentyFourHour`: `true` for a 24-hour clock, `false` for a 12-hour one
