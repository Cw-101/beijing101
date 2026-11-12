# Běijīng 101 — V1 prototype

A working, local-first browser prototype based on the supplied product brief.

## Run it

- Simplest: open `index.html` in a modern browser.
- For installable PWA/offline service-worker support, serve this folder from localhost (for example `python -m http.server 8000`) and open `http://localhost:8000`.

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

This is a front-end V1 prototype, not the complete production architecture. It does not yet include all 30 authored lessons/exercises, native Beijing speaker recordings, FSRS-5, reliable pitch-contour scoring, Azure pronunciation assessment, handwriting/stroke animation, timed four-paper mock exams, exam grade calibration, sync/database abstraction, or Tauri Windows/Linux packaging. The voice feature uses the browser's installed `zh-CN` voice when available and may require internet or OS voice assets.

The Chinese content shown is limited to items present in the supplied brief (plus the brief's four-tone teaching examples). Production content should go through the specified lexicon and tone-mark validation pipeline.
