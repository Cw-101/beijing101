# Běijīng 101 — V1 prototype

A working, local-first browser prototype based on the supplied product brief.

## Beta v1.1 — what changed

- **All 30 days are authored.** Each day has its own teaching text, vocabulary (148 entries, 210 characters) and a graded check question. Previously days 2-30 replayed Day 1's content under different titles.
- **Real spaced repetition.** SM-2 style scheduling (`cards` map: interval, ease, due date) replaces the flat "reviewed" list. Grade a card Again / Hard / Good / Easy and the next due date moves accordingly; the dashboard queue and review tag both read from the same schedule.
- **Exam draws from your progress.** Questions come from the days you have actually completed, shuffled, capped at 10, with per-question explanations and a stored best score. Before, it was four hardcoded Day 1 questions that never changed.
- **Content validation pipeline.** `scripts/validate-content.py` enforces the lexicon and tone-mark rules: 30 days, ≥4 words each, CJK-only hanzi, no tone numbers, tone marks never exceeding character count, 4 options per quiz item. With `pypinyin` available it also cross-checks every entry's syllables against a real reading of the hanzi.
- **Publish tooling.** `scripts/deploy-gh-pages.sh` validates, pushes and enables GitHub Pages. Service worker bumped to v3 and now precaches the curriculum data.

Run the validator before every commit that touches content:

```bash
python3 scripts/validate-content.py
uv run --with pypinyin python scripts/validate-content.py   # with syllable cross-check
```

## Run it

- Simplest: open `index.html` in a modern browser.
- For installable PWA/offline service-worker support, serve this folder from localhost (for example `python -m http.server 8134`) and open `http://127.0.0.1:8134`.

## Fixed in review — 2026-11-12

Bugs found by exercising the running app, and what changed:

- **Corrupt saved progress killed the app.** `JSON.parse` on the `bj101` key ran without a guard, so a malformed value threw during startup and left a page with no event handlers. Now `loadState()` resets bad data, merges over `DEFAULTS`, and validates every field.
- **PWA was not installable.** `manifest.webmanifest` shipped `"icons": []`. Added generated 192px and 512px PNGs (maskable) plus `apple-touch-icon`.
- **Review counter was hardcoded to 5** while the queue holds 8 cards, so it hit zero with cards still left. Now derived from `vocab.length`.
- **"Today's study time" never reset and capped at 60 forever.** Now tracks `dayMinutes` + `lastStudyDate` and shows today's work only.
- **Streak pill read "1 day learning" before any lesson existed.** Now shows "Not started yet".
- **The pinyin toggle did nothing** — it only fired a toast. Now hides/shows pinyin and persists the choice.
- **Completing day 30 could roll the day counter past the course.** Now clamps and reports course completion.
- **Service worker answered failed cross-origin requests with `index.html`**, breaking font loads; it also never refreshed the page for returning users. Now network-first for navigations, cache-first for same-origin assets only, and `CACHE` is versioned.

## Included in V1

- First-run onboarding and learner profile stored locally
- Dashboard with daily lesson, study time, four skill indicators and weekly rhythm
- Six-block Day 1 lesson player
- Browser Mandarin speech synthesis fallback
- Basic optional microphone input check (not pronunciation or tone grading)
- Local vocabulary review queue
- 30-day curriculum overview based on the supplied brief
- Four-question Day 1 practice check with answer explanations
- Local progress persistence and starter service worker

## Not implemented yet

This is a front-end beta, not the complete production architecture. Still outstanding: native Beijing speaker recordings, FSRS-5 (the scheduler is SM-2 style), reliable pitch-contour scoring, Azure pronunciation assessment, handwriting/stroke animation, timed four-paper mock exams, exam grade calibration, sync/database abstraction, and Tauri Windows/Linux packaging. The voice feature uses the browser's installed `zh-CN` voice when available and may require internet or OS voice assets.

The Chinese content now covers all 30 days (148 entries, 210 characters) and must pass `scripts/validate-content.py` before it ships. Production content should still go through the fuller lexicon review the brief specifies.
