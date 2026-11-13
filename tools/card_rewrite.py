#!/usr/bin/env python3
"""Apply authored card field blocks (tools/card_data/*.txt) to CARD.md files in the Lucoa form.
Block format:  '@@ slug' then 'Label: text' lines ('Summary:' replaces ### SUMMARY).
Run: python3 tools/card_rewrite.py   then   python3 tools/build_scripts.py
"""
import json, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
M = json.loads((ROOT/'characters/manifest.json').read_text(encoding='utf8'))['characters']
FORM = [
 ('PSYCHOLOGICAL_PROFILE', ['Motivation','Goals','Deepest Fear','Internal Conflict','Emotional Baseline','Triggers','Validation Needs','Vulnerability Behaviors','Conflict Style','Background']),
 ('SOCIAL_BEHAVIOR', ['Casual Tone','Humor & Praise','Disconnection Reaction','Irritation Style','Farewell Behavior','Relational Role']),
 ('EXPRESSION & SENSORY', ['Eyes','Voice','Touch','Ordinary sensory cues']),
 ('RELATIONSHIP_FLAGS', ['Attraction','Symbolic Cues','Trust Anchors','Attachment Pattern','Jealousy Markers','Role Transition']),
 ('EMOTIONAL_LOGIC', ['Default State','Emotional Barriers','Recovery Speed','Reconnection Method','Escalation Path','Apology Logic','Repair Methods','Trust Development','Cool-Down Pattern']),
 ('CLOSENESS_BEHAVIOR', ['Distance Mode','Engagement Mode','Conversational Role','Flirtation & Provocation','Intimacy Progression','Boundary Response','Public vs. Private']),
 ('SCENARIO_HOOKS', ['Favorite Places','Family','Friends/Allies','Past Relationship(s)','Objects/Motifs','Social Circles']),
]
def parse(path):
    data, cur = {}, None
    for line in path.read_text(encoding='utf8').splitlines():
        if line.startswith('@@ '): cur = data.setdefault(line[3:].strip(), {}); continue
        if not line.strip() or cur is None: continue
        k, _, v = line.partition(': ')
        cur[k.strip()] = v.strip()
    return data
def apply(slug, d):
    p = ROOT/'characters'/M[slug]/'CARD.md'; t = p.read_text(encoding='utf8')
    missing = [l for _, ls in FORM for l in ls if l not in d]
    if missing: print('WARN', slug, 'missing', missing)
    blocks = []
    for head, labels in FORM:
        blocks.append('### ' + head + '\n\n' + '\n'.join(f'- **{l}:** {d[l]}' for l in labels if l in d) + '\n')
    new = '\n'.join(blocks)
    t2 = re.sub(r'### PSYCHOLOGICAL_PROFILE\n.*?(?=### CANON & KNOWLEDGE LIMITS)', lambda m: new + '\n', t, count=1, flags=re.S)
    if 'Summary' in d: t2 = re.sub(r'(### SUMMARY\n\n).*?(?=\n### )', lambda m: m.group(1) + d['Summary'] + '\n', t2, count=1, flags=re.S)
    p.write_text(t2, encoding='utf8')
if __name__ == '__main__':
    n = 0
    for f in sorted((ROOT/'tools/card_data').glob('*.txt')):
        for slug, d in parse(f).items(): apply(slug, d); n += 1
    print('rewrote', n, 'cards')
