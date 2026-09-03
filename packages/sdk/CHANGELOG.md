# datocms-plugin-sdk

## 2.4.1

### Patch Changes

- c0a01a4: Actually deliver the asset metadata change 2.4.0 announced
  
  2.4.0 said every upload reaching a plugin would arrive in the shape its type
  describes — `alt`, `title` and `custom_data` keyed by locale. It didn't: on
  2.4.0 uploads arrive exactly as they did on 2.3.0.
  
  This release delivers it. Upgrade to get what 2.4.0 described; nothing beyond
  the version bump is needed.

## 2.4.0

### Minor Changes

- 2fc8b38: Fix the metadata shape of the assets handed to plugins
  
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

## 2.3.0

### Minor Changes

- 7b6d352: Track `@datocms/cma-client` 6.x, and say `RawApiTypes` instead of the legacy `SchemaTypes` alias
  
  The dependency on `@datocms/cma-client` moves from `^5.0.0` to `^6.1.0`.
  Nothing the SDK exports changes.

## 2.2.7

### Patch Changes

- 5b90e51: Pin the `@datocms/cma-client` and `emoji-regex-xs` dependencies, which were both declared as `"*"`. An unbounded range means every install resolves whatever the latest major happens to be, so a breaking release of either package could break the SDK for new installs without a single change on our side. They are now `^5.0.0` and `^2.0.0`: the widest range that excludes the next major, so plugins already using either package keep a single copy in their tree instead of getting a duplicate.
