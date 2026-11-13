#!/usr/bin/env python3
"""Idempotent BIO/Card appearance-field punctuation and matching polish. No scripts touched."""
from pathlib import Path
import re
import json
ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'characters/manifest.json').read_text(encoding='utf-8'))['characters']
count=0
for slug, folder in manifest.items():
    root=ROOT/'characters'/folder
    bio=(root/'BIO.md').read_text(encoding='utf-8')
    cardfile=root/'CARD.md'
    card=cardfile.read_text(encoding='utf-8')
    b=re.search(r'## 2\. Physical Appearance and Presentation\n([\s\S]*?)(?=\n## 3\.)',bio)
    c=re.search(r'(### APPEARANCE\n)([\s\S]*?)(?=\n### PSYCHOLOGICAL_PROFILE)',card)
    if not b or not c:raise ValueError(slug+' missing appearance section')
    def bio_field(field):
        x=re.search(r'(?m)^- \*\*'+re.escape(field)+r':\*\*\s*(.+)$',b[1])
        if not x:raise ValueError(slug+' BIO missing '+field)
        return x[1].strip().rstrip('.')
    hair=bio_field('Hair')
    eyes=bio_field('Eyes')
    appearance=c[2]
    pattern=r'\*\*Hair:\*\* [^\n]+?\. \*\*Eyes:\*\* [^\n]+?\. \*\*Build:\*\*'
    replacement='**Hair:** '+hair+'. **Eyes:** '+eyes+'. **Build:**'
    new,found=re.subn(pattern,lambda _: replacement,appearance,count=1)
    if found!=1:
        raise ValueError(slug+': cannot identify exactly one card Hair/Eyes/Build line')
    new=re.sub(r'\.\.(?=\s+Maintain creator-confirmed)', '.',new)
    new=re.sub(r'\.\.(?=\s+\*\*Build:\*\*)', '.',new)
    if new!=appearance:
        after=card[:c.start(2)]+new+card[c.end(2):]
        cardfile.write_text(after,encoding='utf-8')
        count+=1
        print('polished',slug)
print('Card appearances polished:',count,'of',len(manifest),'(all BIO hair/eyes matched)')
