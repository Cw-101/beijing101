#!/usr/bin/env python3
"""Check audio coverage for vocabulary words.

This script reads vocabulary from data/lessons.js and checks if each word
has an audio clip in audio/. It exits 0 if all words have clips, or non-zero
with missing words listed if any are missing.
"""

import re
import sys
from pathlib import Path

def slug(text: str) -> str:
    """Convert text to slug format (Unicode code points in hex, joined by '-')."""
    return "-".join(f"{ord(c):x}" for c in text)

def main() -> int:
    # Setup paths
    root = Path(__file__).resolve().parents[1]
    lessons_file = root / "data" / "lessons.js"
    audio_dir = root / "audio"
    
    # Read the lessons file
    source = lessons_file.read_text(encoding="utf-8")
    
    # Extract vocabulary words using regex (same pattern as generate-audio.py)
    word_pattern = re.compile(r'\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]')
    words = word_pattern.findall(source)
    
    # Get unique hanzi (first element of each word tuple)
    hanzi = []
    for h, _p, _e in words:
        if h not in hanzi:
            hanzi.append(h)
    
    # Also extract example sentences for audio coverage
    # `ex` sentences: {"h": "...", "p": "...", "e": "..."} — match like the generator does,
    # without requiring `"}` immediately after the hanzi (most objects carry more fields).
    sentence_pattern = re.compile(r'\{"h":\s*"([^"]+)"')
    sentences = sentence_pattern.findall(source)
    for s in sentences:
        if s not in hanzi:
            hanzi.append(s)
    
    # Count total words
    total_words = len(hanzi)
    
    # Check which words have audio clips
    missing = []
    total_clips = 0
    
    for word in hanzi:
        slug_name = slug(word)
        audio_file = audio_dir / f"{slug_name}.mp3"
        if audio_file.exists():
            total_clips += 1
        else:
            missing.append(word)
    
    # Print summary
    print(f"{total_words} words, {total_clips} clips, {len(missing)} missing")
    
    # Report missing words if any
    if missing:
        print("Missing clips for words:")
        for word in missing:
            print(f"  {word}")
        return 1
    else:
        return 0

if __name__ == "__main__":
    sys.exit(main())