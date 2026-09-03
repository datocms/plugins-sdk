---
'datocms-plugin-sdk': minor
---

Fix the metadata shape of the assets handed to plugins

On some projects the host was sending asset metadata in a shape the SDK types
don't describe, so `upload.attributes.default_field_metadata.alt[locale]` read
`undefined`. Every upload a plugin receives now matches its type: `alt`, `title`
and `custom_data` keyed by locale, `focal_point` and `poster_time` as single
per-asset values.

Plugins on an older SDK keep getting what they get today, so upgrading is what
picks the fix up — nothing breaks by staying put.

`renderAssetSource`'s `ctx.select()` accepts `default_field_metadata` in that
same shape now, so you can pass back what you read. The older shape, one hash
per locale, still works.
