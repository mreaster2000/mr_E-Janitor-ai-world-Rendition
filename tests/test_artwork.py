#!/usr/bin/env python3
"""Validate imported portraits when the artwork manifest is present."""
import hashlib
import json
from pathlib import Path

root=Path(__file__).resolve().parents[1]
manifest_file=root/'ARTWORK_IMPORT_MANIFEST.json'
if not manifest_file.exists():
    print('SKIP artwork check: no artwork manifest present')
    raise SystemExit(0)
manifest=json.loads(manifest_file.read_text(encoding='utf-8'))
items=manifest['files']
assert len({f['path'] for f in items})==len(items), 'duplicate target'
assert len({f['original'] for f in items})>=len(items)-2, 'source artwork count'
for item in items:
    rel=Path(item['path'])
    assert not rel.is_absolute() and '..' not in rel.parts and rel.parts[0]=='characters', rel
    assert rel.suffix=='.webp', rel
    image=root/rel
    assert image.is_file(), image
    data=image.read_bytes()
    assert data[:4]==b'RIFF' and data[8:12]==b'WEBP', f'invalid WebP: {rel}'
    assert hashlib.sha256(data).hexdigest()==item['sha256'], f'checksum mismatch: {rel}'
print(f"PASS artwork: {len({f['original'] for f in items})} source images across {len(items)} verified destinations")
