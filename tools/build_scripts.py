#!/usr/bin/env python3
"""Generate every SCRIPT.js from tools/script_engine.js plus each character's CARD.md / BIO.md.

Run from the repo root:  python3 tools/build_scripts.py
Author lore by improving CARD.md fields and BIO section 7; the script follows.
Legacy hand-made keyword entries live in tools/legacy_lore/<slug>.json (created on first run).
"""
import json, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
M = json.loads((ROOT/'characters/manifest.json').read_text(encoding='utf8'))['characters']
ENGINE = (ROOT/'tools/script_engine.js').read_text(encoding='utf8')
SKIP_TOKENS = {'saint','absolute','power','wonder','council','diana','girl','she','the','miss','mister','san'}
EXTRA_ALIASES = {'mirko': ['rumi'], 'mirko-sibling': ["mirko's sister", 'mirko sister'], 'absolute-wonder-woman': ['absolute diana'],
                 'kara-supergirl': ['kara','supergirl'], 'power-girl': ['karren','power girl'], 'saint-diana': ['saint diana'],
                 'apollyon': ['major'], 'zirkala-tatanka': ['zirkala','zitkala'], 'techy': [], 'victoria-vincent': ['vincent'],
                 'council-beauty': [], 'council-technology': [], 'council-innocence': []}
GENDER = {}

def card_name(slug):
    t = (ROOT/'characters'/M[slug]/'CARD.md').read_text(encoding='utf8')
    return re.match(r'# (.+?) — Unified Card', t).group(1).strip()

def fields(slug):
    t = (ROOT/'characters'/M[slug]/'CARD.md').read_text(encoding='utf8')
    out = {}
    for m in re.finditer(r'^- \*\*([^*]+?):\*\* (.+)$', t, re.M):
        out.setdefault(m.group(1).strip().lower(), m.group(2).strip())
    m = re.search(r'### CANON & KNOWLEDGE LIMITS\n\n(.+?)(?=\n### )', t, re.S)
    out['canon'] = m.group(1).strip() if m else ''
    return out

names = {s: card_name(s) for s in M}
tok_count = {}
for s, n in names.items():
    for tk in set(re.findall(r"[a-z']+", n.lower())): tok_count[tk] = tok_count.get(tk, 0)+1
def aliases(slug):
    n = names[slug].lower(); al = []
    toks = re.findall(r"[a-z']+", n)
    al.append(' '.join(toks))
    for tk in toks:
        if len(tk) >= 4 and tok_count[tk] == 1 and tk not in SKIP_TOKENS: al.append(tk)
    al += EXTRA_ALIASES.get(slug, [])
    seen = []; [seen.append(a) for a in al if a not in seen]
    return seen
ALIASES = {s: aliases(s) for s in M}
def key(slug): return slug.replace('-', '_')

def one_or_two(text, limit=380):
    text = re.sub(r'\s+', ' ', text.strip())
    if len(text) <= limit: return text
    cut = text[:limit]; i = max(cut.rfind('. '), cut.rfind('; '))
    return cut[:i+1] if i > 120 else cut.rstrip(' ,;') + '…'

def relationships(slug):
    b = (ROOT/'characters'/M[slug]/'BIO.md').read_text(encoding='utf8')
    m = re.search(r'^## 7\. [^\n]+\n\n(.*?)(?=^## 8\.)', b, re.M | re.S)
    rels = []
    if not m: return rels
    for line in m.group(1).splitlines():
        mm = re.match(r'- \*\*(.+?):\*\*\s*(.+)', line)
        if not mm: continue
        label = mm.group(1).lower(); matches = []
        for other in M:
            if other == slug: continue
            if any(re.search(r'(?<![a-z])'+re.escape(a)+r'(?![a-z])', label) for a in ALIASES[other]): matches.append(other)
        if len(matches) == 1: rels.append((matches[0], mm.group(2).strip()))
    return rels

BOUNDARY = ["stop", "uncomfortable", "back off", "not comfortable", "too far", "boundary", "boundaries", "dont touch", "don t touch", "leave me alone", "not okay", "personal space"]
def build(slug):
    f = fields(slug); lore = []
    def add(**e): lore.append(e)
    def fld(*names):
        for n in names:
            if n in f and f[n]: return f[n]
        return ''
    bt = fld('boundary response')
    add(keywords=BOUNDARY, group='boundary', priority=5,
        scenario="{{char}} respects the boundary at once: she stops, steps back and does not pressure {{user}}. " + (one_or_two(bt, 260) if bt else "Consent is never assumed."))
    flirt = fld('flirtation & provocation'); prog = fld('intimacy progression')
    if flirt:
        add(keywords=["flirt*", "kiss*", "date", "cuddle", "blush*", "gorgeous", "beautiful", "attractive", "sexy", "romance", "romantic", "tease", "teasing", "seduce*"],
            group='romance', priority=4, triggers=['affection'], requireNone=BOUNDARY,
            personality="Adult flirtation: " + one_or_two(flirt, 380),
            scenario=("Intimacy progression: " + one_or_two(prog, 300) + " Romance stays non-explicit, and {{user}} sets the pace.") if prog else "Romance stays non-explicit, and {{user}} sets the pace.")
    cs = fld('conflict style'); irr = fld('irritation style')
    if cs or irr:
        add(keywords=["angry", "argue", "arguing", "fight*", "furious", "liar", "betray*", "hate", "yell*", "shout*"], group='conflict', priority=4, triggers=['conflict'],
            personality=" ".join(x for x in ["Conflict: " + one_or_two(cs, 240) if cs else '', "When irritated: " + one_or_two(irr, 220) if irr else ''] if x))
        add(requireEmotion=['anger'], group='conflict_emotion', priority=3, personality="{{user}} seems angry. " + one_or_two(cs or irr, 260))
    vul = fld('vulnerability behaviors'); fear = fld('deepest fear')
    if vul:
        add(keywords=["sad", "cry*", "lonely", "scared", "afraid", "hurt*", "tired", "anxious", "panic*", "grief", "overwhelmed", "struggling"], group='vulnerable', priority=4, triggers=['vulnerable'],
            personality="Vulnerability: " + one_or_two(vul, 300) + (" Underlying fear: " + one_or_two(fear, 200) if fear else ''))
    apo = fld('apology logic'); rep = fld('repair methods')
    if apo or rep:
        add(keywords=["sorry", "apolog*", "forgive*", "my fault", "make it up"], group='apology', priority=4,
            personality=" ".join(x for x in ["Apology: " + one_or_two(apo, 240) if apo else '', "Repair: " + one_or_two(rep, 220) if rep else ''] if x))
    hum = fld('humor & praise', 'humor'); val = fld('validation needs')
    if hum or val:
        add(keywords=["thank*", "proud", "well done", "good job", "compliment*", "appreciate*", "impressive"], group='praise', priority=3,
            personality=" ".join(x for x in ["Praise and humor: " + one_or_two(hum, 240) if hum else '', "She needs: " + one_or_two(val, 200) if val else ''] if x))
    tr = fld('trust development'); eb = fld('emotional barriers')
    if tr or eb:
        add(keywords=["trust*", "confide", "secret*", "open up", "tell you something", "honest"], group='trust', priority=3,
            personality=" ".join(x for x in ["Trust: " + one_or_two(tr, 240) if tr else '', "Barrier: " + one_or_two(eb, 220) if eb else ''] if x))
    fav = fld('favorite places')
    if fav: add(keywords=["favorite place", "favourite place", "hang out", "hangout", "where do you go", "where do you live", "home", "apartment"], group='places', priority=2, scenario="Places: " + one_or_two(fav, 300))
    fam = fld('family')
    if fam: add(keywords=["family", "parents", "mother", "father", "sister", "brother", "relatives"], group='family', priority=3, scenario="Family: " + one_or_two(fam, 300))
    fr = fld('friends/allies')
    if fr: add(keywords=["friend*", "allies", "crew", "who do you trust"], group='friends', priority=3, scenario="Friends and allies: " + one_or_two(fr, 300))
    pr = fld('past relationship(s)', 'past relationships')
    if pr: add(keywords=["ex", "exes", "past relationship*", "ever been in love", "former lover"], group='past', priority=3, scenario="Past relationships: " + one_or_two(pr, 300))
    ob = fld('objects/motifs'); sc = fld('symbolic cues')
    if ob or sc: add(keywords=["object*", "keepsake", "carry", "wearing", "outfit", "accessory", "necklace", "token"], group='motifs', priority=2, scenario=" ".join(x for x in ["Motifs: " + one_or_two(ob, 220) if ob else '', "Cues: " + one_or_two(sc, 200) if sc else ''] if x))
    bg = fld('background')
    if bg: add(keywords=["background", "your past", "your history", "how did you end up", "where are you from", "what do you do", "your job", "your work"], group='background', priority=3, scenario="Background: " + one_or_two(bg, 420))
    jl = fld('jealousy markers')
    if jl: add(keywords=["jealous*", "other girl", "other woman", "someone else", "rival"], group='jealousy', priority=3, personality="Jealousy shows as: " + one_or_two(jl, 260))
    fw = fld('farewell behavior')
    if fw: add(keywords=["goodbye", "bye", "see you", "leaving", "gotta go", "good night"], group='farewell', priority=2, personality="Farewell: " + one_or_two(fw, 240))
    tc = fld('touch'); eng = fld('engagement mode'); pp = fld('public vs. private', 'public vs private')
    if tc or eng or pp:
        add(keywords=["hug*", "hold", "touch*", "closer", "hand", "embrace", "lean*"], group='closeness', priority=3, requireNone=BOUNDARY,
            personality=" ".join(x for x in ["Touch: " + one_or_two(tc, 220) if tc else '', "Engagement: " + one_or_two(eng, 200) if eng else '', "Public versus private: " + one_or_two(pp, 200) if pp else ''] if x))
    cn = f.get('canon', '')
    if cn: add(keywords=["who are you", "identity", "power*", "abilit*", "secret", "canon", "what are you"], group='canon', priority=4, personality="Knowledge limits: " + one_or_two(cn, 520))
    ENT = {}; REL = []
    sk = key(slug)
    ENT[sk] = {'gender': 'F', 'aliases': [a for a in ALIASES[slug] if a != sk.replace('_', ' ')][:6]}
    for other, text in relationships(slug):
        ok = key(other)
        ENT[ok] = {'gender': 'F', 'aliases': [a for a in ALIASES[other]][:6],
                   'lore': [{'group': 'rel_' + ok, 'keywords': ['char.' + ok], 'priority': 4,
                             'scenario': "Relationship with " + names[other] + ": " + one_or_two(text, 360) + " Mentioning " + names[other] + " does not bring her into the scene."}]}
        tension = bool(re.search(r'estrang|loath|feud|rival|tension|resent|friction|grudge|competes|compet', text, re.I))
        REL.append({'pair': [sk, ok], 'requireTags': ['conflict' if tension else 'affection'], 'group': 'bond_' + ok,
                    'injection': ("[FRICTION] " if tension else "[BOND] ") + names[slug] + " and " + names[other] + ": " + one_or_two(text, 240)})
    leg = ROOT/'tools/legacy_lore'/(slug+'.json')
    if not leg.exists():
        import subprocess
        rel = 'characters/' + M[slug] + '/SCRIPT.js'
        old = subprocess.run(['git', '-C', str(ROOT), 'show', 'HEAD:' + rel], capture_output=True, text=True).stdout
        items = []
        mm = re.search(r'var dynamicLore=(\[.*?\]),\s*APPLY_LIMIT', old, re.S)
        if mm: items = json.loads(mm.group(1))
        else:
            mm = re.search(r'data=(\[\{.*?\}\]);\s*function match', old, re.S)
            if mm:
                for d in json.loads(mm.group(1)):
                    e = {'keywords': d['k'], 'group': d.get('g', 'x'), 'priority': max(1, min(5, round(d.get('p', 60) / 20))), 'scenario': d['t']}
                    if d.get('block'): e['requireNone'] = d['block']
                    items.append(e)
        if not items:
            mm = re.search(r'var rules=(\[\{.*?\}\]);', old, re.S)
            if mm:
                for d in json.loads(mm.group(1)):
                    e = {'keywords': d['keys'], 'group': d.get('group', 'x'), 'priority': max(1, min(5, round(d.get('priority', 60) / 20))), 'scenario': d['text']}
                    if d.get('block'): e['requireNone'] = d['block']
                    items.append(e)
        leg.write_text(json.dumps(items, ensure_ascii=False, indent=1), encoding='utf8')
    legacy = json.loads(leg.read_text(encoding='utf8'))
    seen = {e.get('scenario') or e.get('personality') for e in lore}
    for e in legacy:
        if not e.get('keywords') or e.get('group') in ('boundary', 'distress'): continue
        txt = e.get('scenario') or e.get('personality')
        if txt in seen: continue
        seen.add(txt); e['group'] = 'legacy_' + str(e.get('group', 'x')); lore.append(e)
    return lore, ENT, REL

def main():
    n = 0
    for slug in M:
        lore, ent, rel = build(slug)
        js = (ENGINE.replace('__APPLY_LIMIT__', '6').replace('__ENTITY_DB__', json.dumps(ent, ensure_ascii=False, indent=1))
              .replace('__RELATIONSHIP_DB__', json.dumps(rel, ensure_ascii=False, indent=1)).replace('__LORE__', json.dumps(lore, ensure_ascii=False, indent=1)))
        (ROOT/'characters'/M[slug]/'SCRIPT.js').write_text(js, encoding='utf8'); n += 1
    print('built', n, 'scripts')
if __name__ == '__main__': main()
