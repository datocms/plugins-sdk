---
"datocms-plugin-sdk": minor
---

New `ctx.rootFontSize`: the font size of the host's `<html>` element, in CSS pixels. The host steps it with the viewport width (14.4, 15 or 16 px), and the SDK runtime now mirrors it onto the plugin's `<html>`, so `rem` units and every rem-based token (`--font-size-*`, `--spacing-*`) measure the same inside the frame as in the surrounding UI.
