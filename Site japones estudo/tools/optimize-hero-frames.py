#!/usr/bin/env python3
"""Build lighter WebP hero frames without changing the source PNG files.

Install the build-only dependency with ``python3 -m pip install Pillow``, then
run ``python3 tools/optimize-hero-frames.py`` from any working directory.
"""

import argparse
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import re

try:
    from PIL import Image
except ImportError as error:
    raise SystemExit("Install the build tool first: python3 -m pip install Pillow") from error


PROJECT_ROOT = Path(__file__).resolve().parents[1]
FRAME_NAME = re.compile(r"frame_(\d{3})\.png")
WEBP_METHOD = 4


def quality(value: str) -> int:
    number = int(value)
    if not 0 <= number <= 100:
        raise argparse.ArgumentTypeError("quality must be between 0 and 100")
    return number


def inventory(source: Path) -> list[Path]:
    files = sorted(source.glob("frame_*.png"))
    if not files:
        raise ValueError(f"No source frames found in {source}")
    for index, path in enumerate(files, start=1):
        match = FRAME_NAME.fullmatch(path.name)
        if match is None or int(match.group(1)) != index:
            raise ValueError(f"Expected contiguous frame_{index:03d}.png; found {path.name}")
    return files


def convert_frame(path: Path, output: Path, profiles: list[dict], source_size: tuple[int, int]) -> list[int]:
    sizes = []
    with Image.open(path) as source_image:
        if source_image.size != source_size:
            raise ValueError(f"Unexpected source dimensions for {path.name}: {source_image.size}")
        image = source_image.convert("RGB")
        for profile in profiles:
            target_size = (profile["width"], profile["height"])
            resized = image if image.size == target_size else image.resize(target_size, Image.Resampling.LANCZOS)
            destination = output / profile["directory"] / f"{path.stem}.webp"
            temporary = destination.with_suffix(".webp.tmp")
            try:
                resized.save(temporary, format="WEBP", quality=profile["quality"], method=WEBP_METHOD)
                temporary.replace(destination)
            finally:
                temporary.unlink(missing_ok=True)
                if resized is not image:
                    resized.close()
            sizes.append(destination.stat().st_size)
        image.close()
    return sizes


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=PROJECT_ROOT / "telainicial")
    parser.add_argument("--output", type=Path, default=PROJECT_ROOT / "telainicial" / "optimized")
    parser.add_argument("--quality-1280", type=quality, default=80)
    parser.add_argument("--quality-1920", type=quality, default=82)
    parser.add_argument("--workers", type=int, choices=(1, 2, 3), default=2)
    args = parser.parse_args()

    frames = inventory(args.source)
    with Image.open(frames[0]) as first_frame:
        source_size = first_frame.size
    if source_size[0] * 9 != source_size[1] * 16:
        raise ValueError(f"Expected 16:9 source frames; found {source_size}")

    profiles = [
        {"directory": "1280", "width": 1280, "height": 720, "quality": args.quality_1280},
        {"directory": "1920", "width": 1920, "height": 1080, "quality": args.quality_1920},
    ]
    for profile in profiles:
        (args.output / profile["directory"]).mkdir(parents=True, exist_ok=True)

    totals = [0] * len(profiles)
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        results = executor.map(lambda path: convert_frame(path, args.output, profiles, source_size), frames)
        for sizes in results:
            for index, size in enumerate(sizes):
                totals[index] += size

    source_bytes = sum(path.stat().st_size for path in frames)
    manifest = {
        "format": "webp",
        "frameCount": len(frames),
        "filenamePattern": "frame_{index:03d}.webp",
        "source": {"width": source_size[0], "height": source_size[1], "totalBytes": source_bytes},
        "variants": [dict(profile, method=WEBP_METHOD, frameCount=len(frames), totalBytes=total)
                     for profile, total in zip(profiles, totals)],
    }
    manifest_path = args.output / "manifest.json"
    temporary_manifest = manifest_path.with_suffix(".json.tmp")
    temporary_manifest.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    temporary_manifest.replace(manifest_path)

    print(f"Source: {len(frames)} PNG frames, {source_bytes:,} bytes")
    for profile, total in zip(profiles, totals):
        print(f"{profile['width']}x{profile['height']}: {total:,} bytes ({100 * (1 - total / source_bytes):.1f}% smaller)")
    print(f"Manifest: {manifest_path}")


if __name__ == "__main__":
    main()
