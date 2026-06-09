# Images

| File | Used for | Spec |
|------|----------|------|
| `hero.jpg` | Home hero background | Landscape **2400×1350** (16:9), JPG/WebP, optimised **< 350 KB**. Keep the left third relatively calm — the headline sits there. |
| `willowbank-poster.jpg` *(optional)* | Willowbank video first-frame | Portrait **720×1280** (9:16), JPG |
| `process-poster.jpg` *(optional)* | Process video first-frame | Portrait **720×1280** (9:16), JPG |

Paths are wired in `lib/media.ts`. A missing file falls back gracefully (gradient / placeholder), so nothing breaks before the asset lands.
