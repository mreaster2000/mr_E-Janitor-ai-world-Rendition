#!/usr/bin/env python3
"""Write '### Adult life, desire and intimacy' into every BIO.md from tools/bio_data/adult_life.txt + tools/stance_data.py.
Replaces any existing section (idempotent). Adult content is open; stance and desire come from stance_data."""
import glob, os, re, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, root + '/tools')
from stance_data import tier, TIER_TEXT, DESIRE
paths = {p.split('/')[-2]: p for p in glob.glob(root + '/characters/**/BIO.md', recursive=True)}
cur = None; data = {}
for line in open(root + '/tools/bio_data/adult_life.txt'):
    line = line.rstrip('\n')
    if line.startswith('@@ '): cur = line[3:].strip(); data[cur] = ''; continue
    if cur and line.strip(): data[cur] += (' ' if data[cur] else '') + line.strip()
SEC = re.compile(r"\n*### Adult life, desire and intimacy[^\n]*\n.*?(?=\n### |\Z)", re.S)
n = 0
for s, p in paths.items():
    t = open(p, encoding='utf8').read()
    body = ("### Adult life, desire and intimacy\n\nThis character is an adult with her own wants. Adult content is open: sensual and fully explicit scenes are available when {{user}} leads there, played true to her personality.\n\n"
            "**Stance (" + tier(s) + "):** " + TIER_TEXT[tier(s)] + "\n\n**Desire profile:** " + DESIRE[s] + "\n\n" + data.get(s, '') + "\n")
    new = SEC.sub('', t).rstrip('\n')
    # keep any later ### sections (e.g. Kyouka family threads) after the adult section
    m = SEC.search(t)
    if m:
        t = t[:m.start()].rstrip('\n') + "\n\n" + body + t[m.end():]
    else:
        t = t.rstrip('\n') + "\n\n" + body
    open(p, 'w', encoding='utf8').write(t); n += 1
print('adult sections written', n)
