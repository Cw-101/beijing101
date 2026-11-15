#!/usr/bin/env python3
"""Audit pinyin in data/lessons.js.

Rules enforced (see tasks/02-pinyin.md):
  1. no ASCII tone digits (`ni3` must be `nǐ`)
  2. word pinyin uses only a-z/A-Z, tone-marked vowels (āáǎà ēéěè īíǐì ōóǒò
     ūúǔù ǖǘǚǜ), space, apostrophe and hyphen — capitals are allowed for
     proper nouns such as Běijīng
  3. every word entry is a complete [hanzi, pinyin, english] triple
  4. example pinyin (`ex[].p`) obeys the same rules once sentence punctuation
     (. , ? ! ; :) is stripped

Exit 0 when clean, 1 with a list of violations otherwise.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LESSONS_JS = ROOT / "data" / "lessons.js"

TONE_VOWELS = "āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ"
BASE = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" + TONE_VOWELS + "' -"
WORD_OK = set(BASE)
EX_OK = set(BASE + ".,?!;:")
DIGITS = re.compile(r"[0-9]")
LESSON_SPLIT = re.compile(r"^\s*\{ d: (\d+),", re.MULTILINE)


def body():
    text = LESSONS_JS.read_text(encoding="utf-8")
    start = text.index("const LESSONS = [")
    end = text.index("\n];", start)
    return text[start + len("const LESSONS = ["):end]


def lesson_blocks(src):
    marks = list(LESSON_SPLIT.finditer(src))
    for i, m in enumerate(marks):
        stop = marks[i + 1].start() if i + 1 < len(marks) else len(src)
        yield int(m.group(1)), src[m.end():stop]


def literal_after(block, key):
    """String-aware extraction of the bracketed literal that follows `key:`."""
    m = re.search(r"\b%s:\s*[\[{]" % key, block)
    if not m:
        return ""
    start = m.end() - 1
    depth = 0
    in_str = False
    i = start
    while i < len(block):
        c = block[i]
        if in_str:
            if c == "\\":
                i += 2
                continue
            if c == '"':
                in_str = False
        elif c == '"':
            in_str = True
        elif c in "[{":
            depth += 1
        elif c in "]}":
            depth -= 1
            if depth == 0:
                return block[start: i + 1]
        i += 1
    return block[start:]


def check_text(where, value, allowed, errors):
    if DIGITS.search(value):
        errors.append("%s: ASCII digit in %r (use tone marks)" % (where, value))
    bad = sorted({c for c in value if c not in allowed})
    if bad:
        errors.append("%s: illegal character(s) %r in %r" % (where, "".join(bad), value))


def main():
    errors = []
    src = body()
    seen = 0
    words_checked = 0
    examples_checked = 0

    for day, block in lesson_blocks(src):
        seen += 1
        words = literal_after(block, "words")
        triples = re.findall(r"\[([^\[\]]*)\]", words)
        if not triples:
            errors.append("day %d: no `words` list found" % day)
        for n, triple in enumerate(triples, 1):
            parts = re.findall(r'"([^"]*)"', triple)
            if len(parts) != 3:
                errors.append(
                    "day %d word %d: expected 3 fields (hanzi, pinyin, english), got %d"
                    % (day, n, len(parts))
                )
                continue
            hanzi, pinyin, english = parts
            words_checked += 1
            check_text("day %d word %d (%s %s)" % (day, n, hanzi, english), pinyin, WORD_OK, errors)

        examples = literal_after(block, "ex")
        for m in re.finditer(r'"p":\s*"([^"]*)"', examples):
            examples_checked += 1
            check_text("day %d example" % day, m.group(1), EX_OK, errors)

    if seen == 0:
        errors.append("no lessons parsed from data/lessons.js")

    if errors:
        print("FAIL — %d pinyin violation(s) across %d lessons" % (len(errors), seen))
        for e in errors:
            print("  • %s" % e)
        return 1

    print(
        "OK — %d lessons, %d words, %d examples, pinyin clean"
        % (seen, words_checked, examples_checked)
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
