#!/usr/bin/env python3
"""Static server with HTTP Range support, for local development.

`python3 -m http.server` ignores Range requests: it answers 200 with the whole
body instead of 206 with a slice. Chrome/Firefox's media stack needs byte ranges
to stream audio, so <audio> elements stall at readyState 0 and never play —
which looks exactly like "the audio is broken" even though the MP3 is fine.

GitHub Pages (and any real static host) supports Range, so this only matters
locally. This server makes local behaviour match production.

Usage:
  scripts/serve.py [port] [--bind ADDR]     (default: 8134, 127.0.0.1)
"""
from __future__ import annotations

import re
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RANGE_RE = re.compile(r"bytes=(\d*)-(\d*)")


class RangeHandler(SimpleHTTPRequestHandler):
    def send_head(self):  # noqa: C901 - mirrors the stdlib implementation
        path = Path(self.translate_path(self.path))
        if path.is_dir():
            return super().send_head()

        rng = self.headers.get("Range")
        if not rng:
            return super().send_head()

        m = RANGE_RE.fullmatch(rng.strip())
        if not m:
            self.send_error(416, "Unsupported Range header")
            return None

        try:
            size = path.stat().st_size
            start_s, end_s = m.groups()
            if start_s == "" and end_s == "":
                return super().send_head()
            if start_s == "":
                length = int(end_s)
                start = max(0, size - length)
                end = size - 1
            else:
                start = int(start_s)
                end = int(end_s) if end_s else size - 1
            end = min(end, size - 1)
            if start > end or start >= size:
                self.send_response(416)
                self.send_header("Content-Range", f"bytes */{size}")
                self.end_headers()
                return None

            f = path.open("rb")
            f.seek(start)
            self._range = (start, end, size)
            self.send_response(206)
            self.send_header("Content-Type", self.guess_type(str(path)))
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
            self.send_header("Content-Length", str(end - start + 1))
            self.end_headers()
            return f
        except OSError:
            self.send_error(404, "File not found")
            return None

    def end_headers(self):
        if not getattr(self, "_range", None):
            self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def copyfile(self, source, outputfile):
        rng = getattr(self, "_range", None)
        if not rng:
            return super().copyfile(source, outputfile)
        start, end, _size = rng
        remaining = end - start + 1
        while remaining > 0:
            chunk = source.read(min(64 * 1024, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)


def main() -> None:
    port = 8134
    bind = "127.0.0.1"
    args = sys.argv[1:]
    if "--bind" in args:
        bind = args[args.index("--bind") + 1]
        args = args[: args.index("--bind")] + args[args.index("--bind") + 2:]
    if args:
        try:
            port = int(args[0])
        except ValueError:
            sys.exit(f"not a port: {args[0]}")

    handler = partial(RangeHandler, directory=str(ROOT))
    with ThreadingHTTPServer((bind, port), handler) as httpd:
        print(f"serving {ROOT} at http://{bind}:{port}/  (Range requests enabled)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
