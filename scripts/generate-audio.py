#!/home/Evan/.hermes/bin/tts-venv/bin/python
"""Pre-generate Mandarin audio for every word in data/lessons.js.

The app plays bundled MP3s instead of relying on browser speech synthesis:
Chrome/Chromium on Linux has no voice engine unless speech-dispatcher has one
installed, so TTS silently does nothing on most Linux desktops.

Filenames are the hanzi's Unicode code points in lowercase hex, joined by "-",
so the mapping is deterministic and needs no lookup table:

    北      -> audio/5317.mp3
    多少钱  -> audio/591a-5c11-94b1.mp3

Usage:
  scripts/generate-audio.py [--voice zh-CN-XiaoxiaoNeural] [--force] [--limit N]

Idempotent: existing clips are skipped unless --force.
"""
from __future__ import annotations

import argparse
import asyncio
import re
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
LESSONS = ROOT / "data" / "lessons.js"
AUDIO = ROOT / "audio"
WORD_RE = re.compile(r'\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]')


def slug(text: str) -> str:
    return "-".join(f"{ord(c):x}" for c in text)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default="zh-CN-XiaoxiaoNeural")
    ap.add_argument("--rate", default="-8%")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--limit", type=int, default=0)
    args = ap.parse_args()

    words = WORD_RE.findall(LESSONS.read_text(encoding="utf-8"))
    hanzi = []
    for h, _p, _e in words:
        if h not in hanzi:
            hanzi.append(h)
    if args.limit:
        hanzi = hanzi[: args.limit]

    AUDIO.mkdir(exist_ok=True)
    todo = [h for h in hanzi if args.force or not (AUDIO / f"{slug(h)}.mp3").exists()]
    print(f"unique words: {len(hanzi)}  |  to generate: {len(todo)}  |  voice: {args.voice}")

    async def run() -> int:
        made = 0
        for i, h in enumerate(todo, 1):
            out = AUDIO / f"{slug(h)}.mp3"
            for attempt in range(3):
                try:
                    await edge_tts.Communicate(h, args.voice, rate=args.rate).save(str(out))
                    if out.exists() and out.stat().st_size > 0:
                        made += 1
                        break
                except Exception as exc:  # noqa: BLE001
                    if attempt == 2:
                        print(f"  ✗ {h}: {exc}", file=sys.stderr)
                    await asyncio.sleep(1 + attempt)
            if i % 25 == 0:
                print(f"  … {i}/{len(todo)}")
        return made

    made = asyncio.run(run())
    total = len(list(AUDIO.glob("*.mp3")))
    size = sum(f.stat().st_size for f in AUDIO.glob("*.mp3"))
    print(f"generated {made} clip(s); {total} files on disk, {size / 1024:.0f} KB total")
    return 0 if made or total >= len(hanzi) else 1


if __name__ == "__main__":
    sys.exit(main())
