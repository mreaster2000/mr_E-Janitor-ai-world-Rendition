#!/usr/bin/env python3
"""Apply tools/stance_data.py to card sources: rewrites 'Intimacy Progression' and (pushier tiers) 'Boundary Response'.
Patches tools/card_data/*.txt (60 cards) and the 6 hand-written CARD.md files. Idempotent.
Then run: python3 tools/card_rewrite.py && python3 tools/build_scripts.py"""
import glob, re, sys
sys.path.insert(0, 'tools')
from stance_data import *
FADE = re.compile(r"[;,]?\s*(?:and |with )?(?:scenes? fad(?:e|es|ing) (?:out )?before anything explicit|nothing explicit (?:is )?written)", re.I)
def newint(old, slug):
    if TIER_TEXT[tier(slug)] in old: return old
    base = FADE.sub('', old).rstrip(' .;,')
    return (base + ". Adult content is open: scenes can turn fully explicit when {{user}} leads there. " + TIER_TEXT[tier(slug)] + " " + DESIRE[slug]).replace('  ', ' ')
def newbound(old, slug):
    return BOUNDARY[slug] if slug in BOUNDARY else old
n = 0
for p in glob.glob('tools/card_data/*.txt'):
    out, cur = [], None
    for ln in open(p, encoding='utf8').read().split('\n'):
        if ln.startswith('@@ '): cur = ln[3:].strip()
        elif cur and ln.startswith('Intimacy Progression: '): ln = 'Intimacy Progression: ' + newint(ln[22:], cur); n += 1
        elif cur and ln.startswith('Boundary Response: '): ln = 'Boundary Response: ' + newbound(ln[19:], cur)
        out.append(ln)
    open(p, 'w', encoding='utf8').write('\n'.join(out))
for p in glob.glob('characters/**/CARD.md', recursive=True):
    slug = p.split('/')[-2]
    t = open(p, encoding='utf8').read(); o = t
    t = re.sub(r"(- \*\*Intimacy Progression:\*\* )(.*)", lambda m: m.group(1) + newint(m.group(2), slug), t)
    t = re.sub(r"(- \*\*Boundary Response:\*\* )(.*)", lambda m: m.group(1) + newbound(m.group(2), slug), t)
    if t != o: open(p, 'w', encoding='utf8').write(t)
print('card_data intimacy fields updated:', n)
