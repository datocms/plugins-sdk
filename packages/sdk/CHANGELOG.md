# datocms-plugin-sdk

## 2.3.0

### Minor Changes

- 7b6d352: Track `@datocms/cma-client` 6.x, and say `RawApiTypes` instead of the legacy `SchemaTypes` alias
  
  The dependency on `@datocms/cma-client` moves from `^5.0.0` to `^6.1.0`.
  Nothing the SDK exports changes.

## 2.2.7

### Patch Changes

- 5b90e51: Pin the `@datocms/cma-client` and `emoji-regex-xs` dependencies, which were both declared as `"*"`. An unbounded range means every install resolves whatever the latest major happens to be, so a breaking release of either package could break the SDK for new installs without a single change on our side. They are now `^5.0.0` and `^2.0.0`: the widest range that excludes the next major, so plugins already using either package keep a single copy in their tree instead of getting a duplicate.
