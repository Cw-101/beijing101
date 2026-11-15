#!/usr/bin/env python3
"""Compare the audio clips on disk with the precache list in sw.js.

Every audio/<codepoint>.mp3 that the app can play must appear in the service
worker's ASSETS array, exactly once, as './audio/<codepoint>.mp3'.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SW = os.path.join(ROOT, "sw.js")
AUDIO_DIR = os.path.join(ROOT, "audio")


def main() -> int:
    src = open(SW, encoding="utf-8").read()
    m = re.search(r"const\s+ASSETS\s*=\s*\[(.*?)\];", src, re.S)
    if not m:
        print("FAIL: could not find the ASSETS array in sw.js")
        return 1
    entries = re.findall(r"['\"]\./([^'\"]+)['\"]", m.group(1))
    audio_entries = [e for e in entries if e.startswith("audio/")]

    on_disk = sorted(
        "audio/" + f for f in os.listdir(AUDIO_DIR) if f.endswith(".mp3")
    )
    if not on_disk:
        print("FAIL: no .mp3 files found in audio/")
        return 1

    dups = sorted({e for e in audio_entries if audio_entries.count(e) > 1})
    listed = set(audio_entries)
    missing = [p for p in on_disk if p not in listed]
    phantom = sorted(e for e in listed if not os.path.exists(os.path.join(ROOT, e)))
    all_dups = sorted({e for e in entries if entries.count(e) > 1})

    problems = []
    if missing:
        problems.append(f"{len(missing)} clip(s) not precached, e.g. {missing[:3]}")
    if phantom:
        problems.append(f"{len(phantom)} precached clip(s) missing on disk: {phantom[:3]}")
    if dups:
        problems.append(f"{len(dups)} duplicate audio entr(ies), e.g. {dups[:3]}")
    if all_dups:
        problems.append(f"duplicate ASSETS entr(ies) anywhere: {all_dups[:3]}")

    cache = re.search(r"const\s+CACHE\s*=\s*'([^']+)'", src)
    version = re.search(r"beijing101-v(\d+)", cache.group(1)) if cache else None
    ver = int(version.group(1)) if version else 0
    if ver < 11:
        problems.append(
            "CACHE must be bumped to at least beijing101-v11 (currently %s)"
            % (cache.group(1) if cache else "absent")
        )

    if problems:
        print("FAIL: %d problem(s):" % len(problems))
        for p in problems:
            print(" - " + p)
        return 1
    print(
        "PASS: %d clips on disk, %d precached, no duplicates, CACHE %s"
        % (len(on_disk), len(audio_entries), cache.group(1))
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
