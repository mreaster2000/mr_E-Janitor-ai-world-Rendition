#!/usr/bin/env python3
"""Generate every SCRIPT.js from tools/script_engine.js plus each character's CARD.md / BIO.md.

Run from the repo root:  python3 tools/build_scripts.py            (build all 66 scripts)
                         python3 tools/build_scripts.py --report   (build, then list every phrase the lore filter removed)

SCRIPTS ARE LORE ONLY.  A script surfaces who the character is, what she wants, how she flirts,
fights, hides and heals, who she knows and what hooks her story offers, when keywords make those
facts relevant.  It never carries consent or stop handling of any kind: there are no boundary,
safeword or hard-stop entries, and nothing is gated on the user saying "stop".  How a character
answers a refusal is the character's own lore (her CARD / BIO) and the person running the chat.

Author lore by improving CARD.md fields, BIO section 7 and the BIO "Lore Threads"; the script follows.
Hand-made keyword entries live in tools/legacy_lore/<slug>.json (created on first run).
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
sys.path.insert(0, str(ROOT/'tools'))
from stance_data import tier as stance_tier, DESIRE, SOFT, FORWARD, DOMINANT, RELENTLESS

# --- legacy groups that are never built -------------------------------------------------------------------
# 'boundary' / 'hardstop' were consent policy and have been deleted from tools/legacy_lore; the guard keeps
# them out if they ever reappear.  'distress' entries are generic and the card voice samples replace them.
SKIPPED_LEGACY_GROUPS = ('boundary', 'hardstop', 'distress')

# --- how forward each character is: initiative and pace only, never how she answers a refusal -------------
STYLE = {
    SOFT: "She is attentive and slow-building: she reads {{user}} closely and lets the heat rise gradually.",
    FORWARD: "She is forward: she makes the first move, escalates quickly and loves being matched.",
    DOMINANT: "She is dominant: she takes control and sets the pace.",
    RELENTLESS: "She is relentless: she pursues what she wants openly, ignores convention and decorum and turns everything into a dare.",
}

# --- lore filter -------------------------------------------------------------------------------------------
# Applied only to the intimacy-adjacent card fields (flirtation, touch, engagement, public/private, intimacy
# progression).  It removes clauses that describe how she reacts to the other person's consent signals.
# Backstory, dislikes, trust and canon text are lore and are never filtered.
INTIMACY_FIELDS = {'flirtation & provocation', 'touch', 'engagement mode', 'public vs. private', 'public vs private'}
PHRASE_RULES = [(re.compile(p, re.I), r) for p, r in [
    (r"Adult, (\w+) and consensual", r"Adult and \1"),
    (r"Adult, consensual and (\w+)", r"Adult and \1"),
    (r"Adult and consensual", "Adult"),
    (r", treats clear agreement as a joy and checks in warmly", ""),
    (r",? quickly withdrawn if unwanted", ""),
    (r", and a hug is always offered first and never assumed", ""),
    (r",? withdrawn (?:at once on request|at once|easily|on request|if it is not welcome)", ""),
    (r",? always an invitation(?: to say no)?", ""),
    (r",? always asked for, never assumed", ""),
    (r", a lingering look that waits for consent", ", a lingering look"),
    (r",? always with an opening for refusal", ""),
    (r", asks permission and ", " and "),
    (r" and always asks first", ""),
    (r", asked for first", ""),
    (r"; she asks before every contact and notices when it stops being wanted", ""),
    (r";? she checks in the second someone stiffens", ""),
    (r", tugs a sleeve and checks in with a flicker of the eyes", " and tugs a sleeve"),
    (r"professional driving, rest and client boundaries", "professional driving, rest and client work"),
    (r'," then waits for a yes\.', '."'),
    (r"\s+and permission-seeking", ""),
    (r" and always invited", ""),
    (r", before any contact", ""),
    (r", checked at once if it lingers", ""),
    (r",? always giving an easy exit", ""),
    (r" and lets go the second they stiffen", ""),
    (r", always ready to let go", ""),
    (r", always read for response", ""),
    (r"; she asks with a look and never takes without it", ""),
    (r", makes an offer and lets the other person decide", ", makes an offer"),
    (r" and waits for \{\{user\}\} to reach back", ""),
    (r'she asks "may I\?" before every gesture, then rests', "she rests"),
    (r'; she asks "too much\?" and means it', ""),
    (r', so she asks "may I\?" and means it', ""),
    (r',"\s+and waits to see if the other person leans closer\.', '."'),
    (r"; she keeps constant track of her partner's comfort and enjoys the game", "; she enjoys the game"),
    (r"An invited hand on a sleeve", "A hand on a sleeve"),
    (r", never compulsory physical familiarity", ""),
    (r", leaving her fingers still rather than presuming a kiss", ""),
    (r" when welcome", ""),
    (r" and loves one who asks first even more", ""),
    (r"(?<=wink) and a clear exit", ""),
    (r", once invited,", ""),
    (r"; playful, easy and happy to be asked", "; playful and easy"),
    (r"a hug that she will end instantly if it is not wanted", "a hug"),
    (r" and always ready to stop; she reads and respects a pulled-back hand immediately", ""),
    (r" and asked-for; she asks with a look,", ";"),
    (r", with an easy way out at every turn", ""),
    (r", a steadying grip on a wrench and a careful check before any hug", " and a steadying grip on a wrench"),
    (r" and warned, always after asking", ""),
    (r"She asks before she touches, removes", "She removes"),
    (r";? she waits for an invitation to go closer", ""),
]]
DROP_SENTENCE = re.compile(r"waits? for a (?:yes|sign)\b|withdraws at the first sign of discomfort|never touches without asking|quick to check in"
                           r"|green light|never pressures|reads a refusal|first (?:hint of )?discomfort|signals discomfort|asks permission as she frames"
                           r"|change consent|^Mutual and welcome", re.I)

SENTENCE_SPLIT = re.compile(r'(?:(?<=[.!?])|(?<=[.!?]["”]))\s+')

# short flirt-sample beats that only describe waiting for / reading the other person's reaction
DROP_BEAT = re.compile(r"""^(?:She\ (?:waits|follows\ the\ answer|watches|checks\ for\ a\ smile|checks\ that\ it\ (?:lands|is\ fun\ for\ both)
    |monitors\ comfort|reads\ (?:responses|yes\ and\ no)|notices\ the\ response|slows\ at\ a\ hint|pulls\ back\ at\ once\ on\ a\ no)\b.*
    |Chosen\ and\ welcomed.*|Asks\ "can\ I\?".*)$""", re.I | re.X)

def _tidy(t):
    t = re.sub(r'\s+', ' ', t).strip()
    t = re.sub(r'\s+([,.;!?])', r'\1', t)
    t = re.sub(r'([,;])\s*([.;!?])', r'\2', t)
    t = re.sub(r'^[,;:\s]+', '', t)
    return re.sub(r'\.{2,}(?!\.)', '.', t)

def scrub(text):
    t = text
    for pat, rep in PHRASE_RULES: t = pat.sub(rep, t)
    t = ' '.join(s for s in SENTENCE_SPLIT.split(t) if not DROP_SENTENCE.search(s) and not DROP_BEAT.match(s.strip()))
    return _tidy(t)

def progression(prog):
    """The base of a card's Intimacy Progression, without the stance sentence and the desire profile."""
    return scrub(prog.split(' Adult content is open:')[0])

# --- names and aliases ---------------------------------------------------------------------------------------
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
    m = re.search(r'\*\*Height:\*\* ([^\n]+)', t)
    out['height'] = m.group(1).strip() if m else ''
    m = re.search(r'\*\*Hair:\*\* (.+?)\. \*\*Eyes:\*\* (.+?)\. \*\*Build:\*\* (.+?)(?: Maintain creator-confirmed|$)', t, re.M)
    out['hair'], out['eyes'], out['build'] = (m.group(1), m.group(2), m.group(3)) if m else ('', '', '')
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
NAME_TOKENS = {tk for al in ALIASES.values() for a in al for tk in re.findall(r"[a-z]+", a)}
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

# --- lore threads (BIO "### Lore Threads") ----------------------------------------------------------------------
THREAD_STOP = set("""the and for with from that this into over under after before about your their they them have has had not
none nor one two three true kind thing things night nights dinner dinners warm hands hand home table seat hour hours old first last set order
list name names day days work quiet small secret secrets bond feelings spare down line lines big little good long short late early open
closed back side room place chosen terrible second third other another every each only just very more most some such than then
when where which while whose will would could should might must made make makes took take gave give goes gone come came
what actually wants silent rode skip sunset chip observation green ring kisses wash pelagia staying until morning going notes fitting door
scope creep passing test dream midnight number seven winner decides agreement gold credit private paid clean wall tail safe pull rule rules
oral younger stage iron liar yard rewrite signature pocket trade island challenge notebook accounts hers wasn build camera cameras sour
leaving weather borrowed stopped rooftop repair entry spell community record soft mark worth keeping guest paint quieter music stops
costume match exit rival frame visit offer case gentle questions confidential bet owns owned dancer venue""".split())
# per-thread overrides for titles whose words are too generic to trigger on
THREAD_KEYWORDS = {
    ('council-technology', 'Hands'): ["callus*", "my hands", "your hands"],
    ('juri-han', 'The Bet'): ["wager", "standing wager", "closing set", "the bet"],
    ('poison', "The Rival's Bet"): ["wager", "closing set", "rival's bet", "juri's bet"],
    ('saint-diana', 'Which Diana'): ["which diana", "other wonder woman", "what should i call you"],
    ('nyx-rielle', 'Which One'): ["persona or the person", "which one is real", "real you", "persona"],
    ('kara-supergirl', 'Her Own Handwriting'): ["handwriting", "sketchbook", "her own handwriting"],
    ('talatora', 'What She Actually Wants'): ["what she actually wants", "preferences notebook", "tiny notebook", "blank page"],
    ('mirko-sibling', 'The Measurements Rule'): ["measurements", "atelier nocturne", "measurements rule"],
    ('barghest', 'Case Number Zero'): ["case number zero", "chain link", "number stamped"],
    ('greer-navarro', 'The Night Test'): ["night test", "midnight test", "risky setup"],
    ('vera-callahan', 'The Dancer-Owned Venue'): ["dancer owned venue", "venue", "pay scale", "investor"],
    ('vera-callahan', 'Off-Stage Name'): ["off stage name", "real name", "birth name", "born with"],
    ('gluco-charin', 'The Off-Camera Table'): ["off camera", "off camera table"],
    ('akumaskywalker', 'No Cameras in the Fitting Room'): ["no cameras", "fitting room"],
    ('crimson-viper', 'The Fitting-Room Rule'): ["fitting room rule", "fitting room"],
    ('yugo', 'The Fitting Room Door'): ["fitting room door", "fitting room"],
    ('leona-aster', 'A Fitting for Two'): ["fitting for two"],
    ('bon', 'Wash Bay After Hours'): ["wash bay", "wash bay after hours"],
    ('lucoa', 'Match Day at the Wash'): ["match day", "match day at the wash"],
    ('lucoa', 'The Costume Door'): ["costume door"],
    ('lucoa', 'The Other Shape'): ["other shape", "true shape", "true form", "what are you really", "let it slip"],
    ('rosa', 'A Mark Worth Keeping'): ["mark worth keeping", "leave a mark"],
    ('besterta', 'Guest Rules'): ["guest rules"],
    ('besterta', 'The Co-op Ledger'): ["co op ledger", "co op"],
    ('circe', 'The Alliance Ledger'): ["alliance", "alliance ledger"],
    ('vesper-kestrel', 'The Boardroom Alibi'): ["boardroom", "boardroom alibi"],
    ('josie-kestrel', 'The Number Seven Rivalry'): ["rivalry", "number seven", "the number seven"],
    ('nadia-voss', 'The Truce at the Door'): ["truce", "truce at the door"],
    ('sukisekine', 'When the Music Stops'): ["when the music stops"],
    ('dixie', 'The Dinner She Might Skip'): ["dinner she might skip", "skip dinner", "skipping dinner"],
    ('batu', 'The Yard Bed'): ["yard bed", "sleep outside"],
    ('luka', 'Kisses as Stakes'): ["kisses as stakes", "arm wrestle", "arm wrestling"],
    ('xuerou', 'Going Home'): ["going home", "when are you going home"],
    ('victoria-vincent', 'Staying Until Morning'): ["staying until morning", "stay until morning"],
    ('victoria-vincent', 'The Postcard to Pelagia'): ["postcard"],
    ('rowan-mercer', 'The Pull-Over Rule'): ["pull over rule", "pull over"],
    ('roux-caldera', 'The Quiet Island'): ["quiet island"],
    ('roux-caldera', 'Tail-Safe Cockpits'): ["tail safe cockpits", "cockpit*"],
    ('techy', "A Build That Wasn't Hers"): ["build that wasn't hers", "not hers"],
    ('palkia', 'The Leaving List'): ["leaving list"],
    ('kronii', 'Stopped Clocks'): ["stopped clocks", "clocks"],
    ('council-technology', 'Repair-First'): ["repair first"],
    ('council-innocence', 'The Notebook of Unanswered Questions'): ["unanswered questions", "notebook of unanswered questions"],
    ('council-innocence', 'A Confidential Inquiry'): ["confidential inquiry", "inquiry"],
    ('juri-han', 'The Sparring Ring'): ["sparring ring", "sparring"],
    ('barghest', 'The Sparring Offer'): ["sparring offer", "sparring"],
    ('marieza-san', 'The Hand Wraps'): ["hand wraps", "wraps"],
    ('mirko', 'Open Mat Challenge'): ["open mat", "open mat challenge"],
    ('marieza-san', 'Open Mat Challenge'): ["open mat", "open mat challenge"],
}

def lore_threads(slug):
    b = (ROOT/'characters'/M[slug]/'BIO.md').read_text(encoding='utf8')
    m = re.search(r'### Lore Threads\n(.*?)(?=\n#{2,3} |\Z)', b, re.S)
    out = []
    if not m: return out
    for mm in re.finditer(r'^- \*\*(.+?)\*\*\s*(.+)$', m.group(1), re.M):
        out.append((mm.group(1).strip().rstrip('.').strip(), mm.group(2).strip()))
    return out

def thread_keywords(slug, title):
    if (slug, title) in THREAD_KEYWORDS: return THREAD_KEYWORDS[(slug, title)]
    base = re.sub(r"[^a-z0-9' -]", ' ', title.lower())
    phrase = re.sub(r'\s+', ' ', re.sub(r'^(?:the|a|an) ', '', base.strip())).strip()
    kws = [phrase] if phrase else []
    for tk in re.findall(r"[a-z0-9]+", re.sub(r"'s\b", '', base)):
        if len(tk) >= 4 and tk not in THREAD_STOP and tk not in NAME_TOKENS and tk not in kws: kws.append(tk)
    return kws

# --- card dialogue samples ---------------------------------------------------------------------------------------
FLUSTER_KW = ["blush*", "embarrass*", "flustered", "speechless", "tongue tied", "caught off guard", "bashful", "shy", "red faced"]
DEFENSIVE_KW = ["accus*", "your fault", "ashamed", "judg*", "hypocrit*", "disrespect*", "insult*", "offended", "admit it", "excuses", "defensive"]
REASSURE_KW = ["reassure*", "comfort me", "hold me", "stay with me", "don't leave", "calm me", "tell me it's okay", "will you stay",
               "sad", "cry*", "lonely", "scared", "afraid", "anxious", "panic*", "overwhelmed", "struggling", "worried"]
APPEARANCE_KW = ["appearance", "look like", "hair", "eyes", "height", "how tall", "tall", "clothing", "outfit"]
HEAT = ["sex", "bed", "bedroom", "naked", "strip*", "undress*", "lingerie", "kink*", "fuck*", "moan*", "orgasm*", "make love", "take me", "turn me on", "aroused", "horny", "bite me", "tie me", "spank*", "blindfold*", "dirty", "nsfw", "explicit"]

def sample(text):
    """A card dialogue sample is one quoted line; keep it as written."""
    return re.sub(r'\s+', ' ', text.strip())

def legacy_has_appearance(items):
    return any(e.get('group') in ('appearance', 'look', 'detail_appearance', 'detail_look', 'detail_appearance_detail') for e in items)

APPEARANCE_META = re.compile(r"unassigned|source|artwork|reference|not shown|unconfirmed|not confirmed|not established|remain|documented|monochrome|shared|depicted|creator|unresolved|not confidently", re.I)

def appearance_text(f):
    """Height, hair, eyes and build from the card, leaving out editorial notes about the source art."""
    bits = []
    if f.get('height'): bits.append('height ' + f['height'])
    for label in ('hair', 'eyes', 'build'):
        v = (f.get(label) or '').strip().rstrip('.').strip()
        if v and not APPEARANCE_META.search(v): bits.append(label + ': ' + v)
    return ('Appearance: ' + '; '.join(bits) + '.') if len(bits) >= 2 else ''

def load_legacy(slug):
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
    return json.loads(leg.read_text(encoding='utf8'))

def build(slug):
    f = fields(slug); lore = []
    def add(**e): lore.append(e)
    def fld(*names):
        for n in names:
            if n in f and f[n]: return scrub(f[n]) if n in INTIMACY_FIELDS else f[n]
        return ''
    st = stance_tier(slug); style = STYLE[st]
    flirt = fld('flirtation & provocation'); prog = progression(f.get('intimacy progression', ''))
    if flirt or prog:
        add(keywords=["flirt*", "kiss*", "date", "cuddle", "blush*", "gorgeous", "beautiful", "attractive", "sexy", "romance", "romantic", "tease", "teasing", "seduce*"],
            group='romance', priority=4, triggers=['affection'],
            personality=("Adult flirtation: " + one_or_two(flirt, 380)) if flirt else '',
            scenario=("Intimacy progression: " + one_or_two(prog, 360) + ". " + style).replace('..', '.') if prog else "Adult content is open. " + style)
    add(keywords=HEAT, group='heat', priority=4,
        scenario="Adult content is open for {{char}}, including fully explicit scenes. " + style + " " + scrub(DESIRE[slug]))
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
    # voice samples: how she sounds in a given mood, taken from the card's dialogue patterns
    fl, de, re_ = fld('flustered'), fld('defensive'), fld('reassuring')
    if fl: add(keywords=FLUSTER_KW, group='flustered', priority=3, personality="When flustered, {{char}} sounds like: " + sample(fl))
    if de: add(keywords=DEFENSIVE_KW, group='defensive', priority=3, personality="When put on the defensive, {{char}} sounds like: " + sample(de))
    if re_: add(keywords=REASSURE_KW, group='reassuring', priority=3, personality="When she reassures someone, {{char}} sounds like: " + sample(re_))
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
        add(keywords=["hug*", "hold", "touch*", "closer", "hand", "embrace", "lean*"], group='closeness', priority=3,
            personality=" ".join(x for x in ["Touch: " + one_or_two(tc, 220) if tc else '', "Engagement: " + one_or_two(eng, 200) if eng else '', "Public versus private: " + one_or_two(pp, 200) if pp else ''] if x))
    cn = f.get('canon', '')
    if cn: add(keywords=["who are you", "identity", "power*", "abilit*", "secret", "canon", "what are you"], group='canon', priority=4, personality="Knowledge limits: " + one_or_two(cn, 520))
    for n, (title, text) in enumerate(lore_threads(slug), 1):
        kws = thread_keywords(slug, title)
        if kws: add(keywords=kws, group='thread_%d' % n, priority=2, scenario="Story hook, " + title + ": " + one_or_two(text, 420))
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
    legacy = load_legacy(slug)
    ap = appearance_text(f)
    if ap and not legacy_has_appearance(legacy): add(keywords=APPEARANCE_KW, group='appearance', priority=3, scenario=ap)
    seen = {e.get('scenario') or e.get('personality') for e in lore}
    for e in legacy:
        if not e.get('keywords') or e.get('group') in SKIPPED_LEGACY_GROUPS: continue
        txt = e.get('scenario') or e.get('personality')
        if txt in seen: continue
        seen.add(txt); e['group'] = 'legacy_' + str(e.get('group', 'x')); lore.append(e)
    return lore, ENT, REL

def report():
    """List every card field the lore filter changed, so the removals can be reviewed."""
    n = 0
    for slug in M:
        f = fields(slug)
        for k in sorted(INTIMACY_FIELDS) + ['intimacy progression']:
            v = f.get(k, '')
            if not v: continue
            new = progression(v) if k == 'intimacy progression' else scrub(v)
            old = v.split(' Adult content is open:')[0] if k == 'intimacy progression' else v
            if _tidy(old) != new: n += 1; print('%s [%s]\n   - %s\n   + %s' % (slug, k, _tidy(old), new))
    print(n, 'filtered fields')

def main():
    n = 0
    for slug in M:
        lore, ent, rel = build(slug)
        js = (ENGINE.replace('__APPLY_LIMIT__', '6').replace('__ENTITY_DB__', json.dumps(ent, ensure_ascii=False, indent=1))
              .replace('__RELATIONSHIP_DB__', json.dumps(rel, ensure_ascii=False, indent=1)).replace('__LORE__', json.dumps(lore, ensure_ascii=False, indent=1)))
        (ROOT/'characters'/M[slug]/'SCRIPT.js').write_text(js, encoding='utf8'); n += 1
    print('built', n, 'scripts')
    if '--report' in sys.argv: report()
if __name__ == '__main__': main()
