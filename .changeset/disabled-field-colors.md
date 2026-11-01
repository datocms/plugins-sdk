---
"datocms-react-ui": patch
---

Disabled `TextInput`, `TextareaInput` and `SelectInput` fields now match native DatoCMS fields. They use the new `--color--disabled-field--*` tokens, which fixes the low-contrast value text in dark mode. An empty disabled field shows a dimmed placeholder, and a disabled text field no longer reacts to hover. `SelectInput` also maps react-select's palette slot for slot like the CMS does, so menus no longer fall back to light-only greys in the slots the CMS maps. On older DatoCMS versions that don't send the new tokens, fields fall back to the previous `--color--disabled--*` colors.
