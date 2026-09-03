---
'datocms-plugin-sdk': patch
---

Actually deliver the asset metadata change 2.4.0 announced

2.4.0 said every upload reaching a plugin would arrive in the shape its type
describes — `alt`, `title` and `custom_data` keyed by locale. It didn't: on
2.4.0 uploads arrive exactly as they did on 2.3.0.

This release delivers it. Upgrade to get what 2.4.0 described; nothing beyond
the version bump is needed.
