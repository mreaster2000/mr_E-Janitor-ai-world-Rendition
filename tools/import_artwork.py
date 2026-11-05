#!/usr/bin/env python3
"""Install the creator's prepared artwork ZIP into the corresponding character folders."""
from pathlib import Path
import argparse, json, zipfile, shutil

ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description="Import cleaned artwork prepared from character image.zip")
parser.add_argument("archive",type=Path,help="rendition_artwork_import_ready.zip")
parser.add_argument("--dry-run",action="store_true",help="Show copy actions only")
args=parser.parse_args()

with zipfile.ZipFile(args.archive) as z:
    manifest=json.loads(z.read("ARTWORK_IMPORT_MANIFEST.json"))
    total=0
    for item in manifest["files"]:
        rel=Path(item["path"])
        if rel.is_absolute() or ".." in rel.parts or rel.parts[0]!="characters" or rel.suffix.lower()!=".webp":
            raise SystemExit(f"Unsafe destination: {rel}")
        if rel.as_posix() not in z.namelist():
            raise SystemExit(f"Artwork missing from ZIP: {rel}")
        target=ROOT/rel
        print(f"{item['original']} -> {rel}")
        if not args.dry_run:
            target.parent.mkdir(parents=True,exist_ok=True)
            with z.open(rel.as_posix()) as source, target.open("wb") as output:
                shutil.copyfileobj(source,output)
        total+=1
    if not args.dry_run:
        dest=ROOT/"ARTWORK_IMPORT_MANIFEST.json"
        dest.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
    print(f"{'Would import' if args.dry_run else 'Imported'} {total} images")
