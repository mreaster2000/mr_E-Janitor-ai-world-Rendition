#!/usr/bin/env python3
"""Import the verified Rendition image bundle into a local Git checkout."""
from pathlib import Path
import argparse
import hashlib
import json
import shutil
import zipfile

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("archive", type=Path, help="rendition_artwork_final_import.zip")
parser.add_argument("--dry-run", action="store_true")
args = parser.parse_args()

with zipfile.ZipFile(args.archive) as archive:
    manifest = json.loads(archive.read("ARTWORK_IMPORT_MANIFEST.json"))
    pictures = manifest["files"]
    if len(pictures) != 58 or len({f["original"] for f in pictures}) != 57:
        raise SystemExit("Expected 57 source images and 58 import destinations")
    for file in pictures:
        rel = Path(file["path"])
        if rel.is_absolute() or ".." in rel.parts or rel.parts[0] != "characters" or rel.suffix != ".webp":
            raise SystemExit(f"Unsafe path: {rel}")
        if rel.as_posix() not in archive.namelist():
            raise SystemExit(f"Missing ZIP entry: {rel}")
        raw = archive.read(rel.as_posix())
        if hashlib.sha256(raw).hexdigest() != file["sha256"]:
            raise SystemExit(f"Checksum mismatch: {rel}")
        if raw[:4] != b"RIFF" or raw[8:12] != b"WEBP":
            raise SystemExit(f"Invalid WebP: {rel}")
        target = ROOT / rel
        print(f'{file["original"]} -> {rel}')
        if not args.dry_run:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(raw)
    if not args.dry_run:
        (ROOT / "ARTWORK_IMPORT_MANIFEST.json").write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    print(f'{"Dry-run ready" if args.dry_run else "Imported"}: 58 verified images from 57 originals')
