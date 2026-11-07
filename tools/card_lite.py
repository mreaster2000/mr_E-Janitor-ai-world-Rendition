#!/usr/bin/env python3
"""Generate characters/**/CARD_LITE.md: a compact (~350-word) roleplay card built from CARD.md fields plus stance data.
Intended for small context budgets. Re-run after any card or stance change."""
import glob, os, re, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, root + '/tools')
from stance_data import tier, TIER_TEXT, DESIRE
def short(t, n):
    t = re.sub(r'\s+', ' ', t.strip())
    w = t.split(' ')
    if len(w) <= n: return t
    cut = ' '.join(w[:n]); m = max(cut.rfind('. '), cut.rfind('! '), cut.rfind('? '))
    return cut[:m + 1] if m > len(cut) * 0.5 else cut.rstrip(',;:') + '...'
def fields(t): return {m[1].strip(): m[2].strip() for m in re.finditer(r"(?m)^- \*\*([^*]+):\*\* (.*)$", t)}
def section(t, name):
    m = re.search(r"### " + re.escape(name) + r"\n\n(.*?)(?=\n### |\Z)", t, re.S); return m[1].strip() if m else ''
count = 0
for p in sorted(glob.glob(root + '/characters/**/CARD.md', recursive=True)):
    d = os.path.dirname(p); slug = d.split('/')[-1]; t = open(p, encoding='utf8').read(); f = fields(t)
    name = re.search(r"^# (.+?) — Unified Card", t, re.M)[1]
    app = section(t, 'APPEARANCE')
    height = (re.search(r"\*\*Height:\*\* ([^\n]+)", app) or [0, ''])[1]
    he = re.search(r"\*\*Hair:\*\* (.*?)\. \*\*Eyes:\*\* (.*?)\. \*\*Build:\*\*", app, re.S)
    hair, eyes = (he[1], he[2]) if he else ('', '')
    build = (re.search(r"\*\*Build:\*\* (.*?)(?: Maintain creator-confirmed|$)", app, re.S) or [0, ''])[1]
    st = tier(slug)
    out = [f"# {name} — Lite Card", "",
           "Compact roleplay card for small context budgets. Adult character; adult content is open. Full detail: [CARD.md](CARD.md).", "",
           f"**Who:** {short(section(t, 'SUMMARY'), 55)}", "",
           f"**Look:** {height}. Hair: {hair}. Eyes: {eyes}. Build: {short(build, 22)}", "",
           f"**Voice and manner:** {short(f.get('Casual Tone', ''), 28)} {short(f.get('Humor & Praise', ''), 24)}", "",
           f"**Drive:** {short(f.get('Motivation', ''), 25)} Fear: {short(f.get('Deepest Fear', ''), 22)} Conflict: {short(f.get('Internal Conflict', ''), 25)}", "",
           f"**With others:** {short(f.get('Relational Role', ''), 25)} Allies and family: {short(f.get('Friends/Allies', ''), 38)} {short(f.get('Family', ''), 30)}", "",
           f"**Flirting and intimacy ({st}):** {TIER_TEXT[st]} {short(DESIRE[slug], 50)} Flirts: {short(f.get('Flirtation & Provocation', ''), 32)}", "",
           f"**When refused:** {short(f.get('Boundary Response', ''), 40)}", "",
           "**Rules:** Write only {{char}}; never speak, act or decide for {{user}}. Use only what {{char}} knows; names in lore do not mean other characters are present. Keep her voice, quirks and stance consistent. A safeword or out-of-character stop from {{user}} ends the scene at once.", ""]
    open(d + '/CARD_LITE.md', 'w', encoding='utf8').write('\n'.join(out)); count += 1
print('lite cards written', count)
