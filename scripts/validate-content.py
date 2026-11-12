#!/usr/bin/env python3
"""Validate data/lessons.js — the lexicon and tone-mark pipeline.

Structural checks (failures exit non-zero):
  1. exactly 30 days, numbered 1..30, no gaps or duplicates
  2. every day has >= 4 words and >= 1 quiz item
  3. every word is [hanzi, pinyin, english], all non-empty
  4. hanzi are CJK characters
  5. pinyin uses only a-z, ü, tone-marked vowels, apostrophes and spaces
     (tone numbers are rejected — the brief requires tone marks)
  6. a word has no more tone marks than characters (tone marks cannot exceed
     syllables, because neutral tones are unmarked)
  7. quiz items have exactly 4 options and an in-range correct index

Cross-check (needs pypinyin; skipped with a warning if absent):
  8. the toneless syllables of every word match pypinyin's reading of the
     hanzi. This catches wrong romanisation and wrong characters, which is
     what a hand-written lexicon actually gets wrong. Tone *quality* is not
     compared, because pypinyin has no context and renders neutral tones
     (xièxie, míngzi, bàba) and erhua (nǎr) as full tones.

Warnings only: repeated hanzi outside the deliberate review days (10, 20, 21, 30).

Usage:
  python3 scripts/validate-content.py
  uv run --with pypinyin python scripts/validate-content.py   # with cross-check
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT = ROOT / "data" / "lessons.js"

TONE_MARKS = set("āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ")
TONE_FOLD = {
    **dict(zip("āáǎà", "a" * 4)), **dict(zip("ēéěè", "e" * 4)),
    **dict(zip("īíǐì", "i" * 4)), **dict(zip("ōóǒò", "o" * 4)),
    **dict(zip("ūúǔù", "u" * 4)), **dict(zip("ǖǘǚǜ", "v" * 4)),
}
ALLOWED = set("abcdefghijklmnopqrstuvwxyzü' ") | TONE_MARKS
REVIEW_DAYS = {10, 20, 21, 30}
WORD_RE = re.compile(r'\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]')


def cjk(ch: str) -> bool:
    return "\u4e00" <= ch <= "\u9fff" or "\u3400" <= ch <= "\u4dbf"


def fold(pinyin: str) -> str:
    """Strip tone marks and separators: dìtiě -> ditie."""
    out = "".join(TONE_FOLD.get(c, c) for c in pinyin.lower())
    return out.replace("'", "").replace(" ", "")


def same_reading(expected: str, ours: str) -> bool:
    """Do two romanisations describe the same syllables?

    Beyond exact equality this allows two documented divergences, both of which
    are correct in our data and wrong in pypinyin's context-free output:

      * erhua: pypinyin spells the 儿 as its own "er" syllable (nǎ'ér -> naer)
        while standard erhua writes an r suffix (nǎr -> nar).
      * 谁: pypinyin gives the dictionary reading shuí; shéi is the taught
        colloquial reading and is what beginners should learn.
    """
    if expected == ours:
        return True
    if ours.endswith("r") and expected == ours[:-1] + "er":
        return True
    return {expected, ours} == {"shui", "shei"}


def brace_blocks(text: str) -> list[str]:
    start = text.find("[", text.find("const LESSONS"))
    if start == -1:
        sys.exit("could not find the LESSONS array")
    blocks, depth, buf = [], 0, []
    for ch in text[start:]:
        if ch == "{":
            depth += 1
            if depth == 1:
                buf = [ch]
                continue
        elif ch == "}":
            depth -= 1
            if depth == 0:
                buf.append(ch)
                blocks.append("".join(buf))
                continue
        if depth >= 1:
            buf.append(ch)
    return blocks


def main() -> int:
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT
    text = path.read_text(encoding="utf-8")
    blocks = brace_blocks(text)

    lazy_pinyin = None
    Style = None
    try:
        from pypinyin import Style as _Style, lazy_pinyin as _lazy
        lazy_pinyin, Style = _lazy, _Style
    except ImportError:
        pass
    have_pypinyin = lazy_pinyin is not None

    errors: list[str] = []
    warnings: list[str] = []
    days: list[int] = []
    seen: dict[str, list[int]] = {}
    all_words: list[tuple[str, str, str, int]] = []

    if len(blocks) != 30:
        errors.append(f"expected 30 day objects, found {len(blocks)}")

    for raw in blocks:
        m = re.search(r"d:\s*(\d+)", raw)
        if not m:
            errors.append("a day object has no d: field")
            continue
        d = int(m.group(1))
        days.append(d)

        words = WORD_RE.findall(raw)
        if len(words) < 4:
            errors.append(f"day {d}: only {len(words)} words (need >= 4)")

        for h, p, e in words:
            all_words.append((h, p, e, d))
            if not (h and p and e):
                errors.append(f"day {d}: empty field in [{h!r}, {p!r}, {e!r}]")
                continue
            if not all(cjk(c) for c in h):
                errors.append(f"day {d}: {h!r} is not all CJK characters")
            if any(c.isdigit() for c in p):
                errors.append(f"day {d}: {p!r} uses tone numbers; use tone marks")
            bad = {c for c in p if c.lower() not in ALLOWED}
            if bad:
                errors.append(f"day {d}: {p!r} has illegal characters {sorted(bad)}")
            marks = sum(1 for c in p if c in TONE_MARKS)
            if marks > len(h):
                errors.append(
                    f"day {d}: {h} has {len(h)} characters but {marks} tone marks in {p!r}"
                )
            if have_pypinyin:
                expected = "".join(lazy_pinyin(h, style=Style.TONE))
                if not same_reading(fold(expected), fold(p)):
                    errors.append(
                        f"day {d}: {h} reads {fold(expected)} per pypinyin, data says {p!r}"
                    )
            seen.setdefault(h, []).append(d)

        quizzes = re.findall(r'\[\s*"((?:[^"\\]|\\.)*)"\s*,\s*"([^"]*)"\s*,\s*(\d+)\s*,', raw)
        if not quizzes:
            errors.append(f"day {d}: no quiz items")
        for q, opts, idx in quizzes:
            n = len(opts.split("|"))
            if n != 4:
                errors.append(f"day {d}: quiz {q!r} has {n} options (need 4)")
            if not 0 <= int(idx) < n:
                errors.append(f"day {d}: quiz {q!r} correct index {idx} out of range {n}")

    if sorted(days) != list(range(1, 31)):
        errors.append(f"day numbers are not 1..30: {sorted(days)}")

    repeats = 0
    for h, where in seen.items():
        if len(where) > 1:
            repeats += 1
            uniq = sorted(set(where))
            if set(uniq) - REVIEW_DAYS:
                warnings.append(f"{h} repeats on days {uniq}")

    chars = sum(len(h) for h in seen)
    print(
        f"days: {len(days)}  words: {len(all_words)}  unique entries: {len(seen)}  "
        f"characters: {chars}  repeats: {repeats}"
    )
    print(f"cross-check: {'pypinyin (syllable match)' if have_pypinyin else 'SKIPPED (install pypinyin)'}")
    for w in warnings[:8]:
        print(f"  warn: {w}")
    if len(warnings) > 8:
        print(f"  warn: … {len(warnings) - 8} more repeats")

    if errors:
        print(f"\n{len(errors)} ERROR(S):")
        for e in errors:
            print(f"  ✗ {e}")
        return 1

    print("\nOK — content valid")
    return 0


if __name__ == "__main__":
    sys.exit(main())
