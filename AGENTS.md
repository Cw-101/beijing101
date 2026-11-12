# beijing101

Project rules. Inherits `~/Projects/hermes/AGENTS.md`; this file adds what is
specific to Běijīng 101.

## What this is

A single-file, offline-capable PWA teaching a 30-day Beijing Mandarin
foundation course. No build step, no dependencies, no bundler — `index.html`
carries the markup, the CSS and the JS inline.

## Definition of done

- [ ] Served and exercised in a real browser, not just "the file exists"
- [ ] Zero console errors on load and through every view
- [ ] Progress survives a reload; corrupt `localStorage` still boots the app
- [ ] Works offline after first load (service worker)
- [ ] Committed with a conventional-commit message

## Architecture

```
index.html      all markup, CSS and JS (inline <style> and <script>)
sw.js           service worker — cache-first assets, network-first navigations
manifest.webmanifest   PWA metadata: 192/512 icons, maskable, standalone
icon-192.png / icon-512.png   北 on red, generated with Pillow (Noto Sans CJK)
```

## State

Everything persists in `localStorage` under the key `bj101`. Schema:

```
name, day (1-30), completed[], minutes (lifetime), dayMinutes, lastStudyDate,
block (0-5), reviewed[], quizDone, skills{listen,speak,read,write}, pinyin, started
```

**Any change to this schema must keep `loadState()` tolerant** — it merges over
`DEFAULTS`, validates every field, and deletes unparseable values rather than
throwing. A user with old data must never see a dead page.

## Editing rules

- **Bump `CACHE` in `sw.js` whenever `index.html`, the manifest or an icon
  changes** (`beijing101-vN`). An unchanged cache name means returning users
  keep the old files indefinitely.
- Keep the PWA manifest valid: at least one 192px and one 512px PNG, plus a
  `maskable` entry, or the app stops being installable.
- Don't add a build step or dependencies for a change this file can absorb;
  if the file genuinely outgrows a single page, say so before splitting it.
- Test the lesson flow, the review queue, the exam and the settings toggle —
  they each own part of the state object.

## Known limitations (V1)

- Only Day 1 lesson content is authored. Days 2-30 show the same six blocks
  under different titles — the syllabus is real, the per-day content is not.
- Browser `zh-CN` speech synthesis is the audio, not recorded Beijing speakers.
- No FSRS scheduling; the review queue is a simple local list.
