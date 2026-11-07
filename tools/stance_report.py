#!/usr/bin/env python3
"""Generate STANCES.md from tools/stance_data.py (run after changing any tier)."""
import glob, os, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, root + '/tools')
from stance_data import tier, TIER_TEXT, BOUNDARY, SOFT, FORWARD, DOMINANT, RELENTLESS
rows = {}
for b in sorted(glob.glob(root + '/characters/**/BIO.md', recursive=True)):
    s = b.split('/')[-2]; name = open(b, encoding='utf8').read().split('\n')[0][2:].split(' — ')[0]
    rows.setdefault(tier(s), []).append((name, s, os.path.relpath(b, root)))
out = ["# Character Stances (generated)", "",
       "Every character is an adult and adult content is open. A stance sets how each character handles a refusal in play. Change a tier in `tools/stance_data.py`, then run `python3 tools/stance_apply.py && python3 tools/card_rewrite.py && python3 tools/adult_life.py && python3 tools/build_scripts.py && python3 tools/stance_report.py`.", "",
       "A safeword or out-of-character stop (`HARD` keywords in `tools/build_scripts.py`) halts every character, including the relentless ones.", ""]
for k in (SOFT, FORWARD, DOMINANT, RELENTLESS):
    out += ["## %s (%d)" % (k.capitalize(), len(rows.get(k, []))), "", TIER_TEXT[k], ""]
    for name, s, rel in rows.get(k, []):
        extra = (" — " + BOUNDARY[s]) if s in BOUNDARY else ""
        out.append("- [%s](%s)%s" % (name, rel, extra))
    out.append("")
open(root + '/STANCES.md', 'w', encoding='utf8').write('\n'.join(out))
print('wrote STANCES.md')
