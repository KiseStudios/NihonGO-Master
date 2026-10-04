#!/usr/bin/env python3
"""Serve the app locally with byte ranges for native video seeking."""

import argparse
import email.utils
import os
import re
from datetime import timezone
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class RangeRequestHandler(SimpleHTTPRequestHandler):
    """Keep standard directory handling and stream single file byte ranges."""

    def send_head(self):
        self._remaining_bytes = None
        path = self.translate_path(self.path)
        self._accept_ranges = os.path.isfile(path)
        range_header = self.headers.get("Range")

        if not self._accept_ranges or not range_header:
            return super().send_head()

        # Multipart and unknown range units fall back to a regular response.
        match = re.fullmatch(r"bytes=(\d*)-(\d*)", range_header.strip())
        if match is None:
            return super().send_head()

        try:
            source = open(path, "rb")
        except OSError:
            return super().send_head()

        stat = os.fstat(source.fileno())
        if not self._if_range_matches(stat.st_mtime):
            source.close()
            return super().send_head()

        size = stat.st_size
        first, last = match.groups()
        try:
            if size == 0 or not (first or last):
                raise ValueError
            if first:
                start = int(first)
                end = min(int(last), size - 1) if last else size - 1
                if start >= size or end < start:
                    raise ValueError
            else:
                suffix_length = int(last)
                if suffix_length == 0:
                    raise ValueError
                start = max(0, size - suffix_length)
                end = size - 1
        except ValueError:
            source.close()
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return None

        length = end - start + 1
        source.seek(start)
        self._remaining_bytes = length
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(length))
        self.send_header("Last-Modified", self.date_time_string(stat.st_mtime))
        self.end_headers()
        return source

    def _if_range_matches(self, modified_at):
        value = self.headers.get("If-Range")
        if not value:
            return True
        # This server emits Last-Modified, not entity tags.
        try:
            date = email.utils.parsedate_to_datetime(value)
            if date.tzinfo is None:
                date = date.replace(tzinfo=timezone.utc)
            return int(modified_at) <= int(date.timestamp())
        except (TypeError, ValueError, OverflowError):
            return False

    def end_headers(self):
        if getattr(self, "_accept_ranges", False):
            self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def copyfile(self, source, outputfile):
        remaining = self._remaining_bytes
        if remaining is None:
            return super().copyfile(source, outputfile)
        while remaining > 0:
            chunk = source.read(min(64 * 1024, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=4173)
    parser.add_argument("--bind", default="127.0.0.1")
    args = parser.parse_args()
    app_directory = Path(__file__).resolve().parent.parent
    handler = partial(RangeRequestHandler, directory=str(app_directory))
    server = ThreadingHTTPServer((args.bind, args.port), handler)
    print(f"Serving {app_directory} at http://{args.bind}:{args.port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
