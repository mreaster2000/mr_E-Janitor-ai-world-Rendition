#!/usr/bin/env python3
"""Validate imported portraits when the artwork manifest is present."""
import hashlib
import json
from pathlib import Path

root=Path(__file__).resolve().parents[1]
manifest_file=root/'ARTWORK_IMPORT_MANIFEST.json'
if not manifest_file.exists():
    print('SKIP artwork check: 57-image import has not yet been pushed')
    raise SystemExit(0)
manifest=json.loads(manifest_file.read_text(encoding='utf-8'))
items=manifest['files']
assert len({f['original'] for f in items})==57, 'source artwork count'
assert len(items)==58, 'destination count; shared council portrait duplicated'
assert len({f['path'] for f in items})==58, 'duplicate target'
for item in items:
    rel=Path(item['path'])
    assert not rel.is_absolute() and '..' not in rel.parts and rel.parts[0]=='characters', rel
    assert rel.suffix=='.webp', rel
    image=root/rel
    assert image.is_file(), image
    data=image.read_bytes()
    assert data[:4]==b'RIFF' and data[8:12]==b'WEBP', f'invalid WebP: {rel}'
    assert hashlib.sha256(data).hexdigest()==item['sha256'], f'checksum mismatch: {rel}'
print('PASS artwork: 57 source images across 58 verified destinations')
