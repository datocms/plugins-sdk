---
"datocms-plugin-sdk": patch
---

Faster host → plugin messaging in Chromium. Chrome deliberately slows the deserialization of cross-origin messages of 16 KB or more when `event.data` is read before `event.origin` (it re-deserializes the payload 4-8 times to mask timing), and Penpal 4 reads `data` first. The SDK now registers a capture-phase `message` listener that reads `event.origin` before Penpal runs, which makes every host message take the fast path: a 266 KB ctx went from ~7 ms to ~1 ms per message in Chrome. Firefox and Safari deserialize eagerly and are unaffected.
