"""Build additive expanded cards/configs/scripts. Run from any working directory."""
from pathlib import Path
import json
import math
import re
from profiles import PROFILES

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = json.loads((ROOT / 'characters/manifest.json').read_text())['characters']
ENGINE = (ROOT / 'scripts/engine_extra_details.js').read_text()

def section(text, number):
    match = re.search(r'^## ' + str(number) + r'\. [^\n]+\n(.*?)(?=^## |\Z)', text, re.M | re.S)
    if match:
        return match.group(1).strip()
    names = {1: 'Overview', 2: 'Basic Information', 3: 'Physical Appearance',
             4: 'Personality and Communication', 5: 'Background and Everyday Life',
             6: 'Goals, Fears and Contradictions', 7: 'Relationships', 8: 'World Knowledge and Boundaries'}
    match = re.search(r'^## ' + re.escape(names.get(number, 'UNUSED')) + r'\n(.*?)(?=^## |\Z)', text, re.M | re.S)
    return match.group(1).strip() if match else ''

def label(text, name):
    match = re.search(r'\*\*' + re.escape(name) + r':\*\*\s*(.*?)(?=\n|\*\*[A-Z]|$)', text)
    return match.group(1).strip().rstrip('.') if match else ''

def clean(s):
    s = s.replace('{user}', '{{user}}').replace('{{{user}}}', '{{user}}')
    s = re.sub(r'^\*\*(?:Canonical height|Height):\*\*.*$', '', s, flags=re.M)
    s = re.sub(r'\n{3,}', '\n\n', s)
    return s.strip()

def original_personality(card):
    return re.split(r'\n## ', card.split('## Personality', 1)[1].split('\n', 1)[1], 1)[0].strip()

def identity(slug, loc, card, bio, cfg):
    if not loc.startswith('zentreya/'):
        return clean(original_personality(card))
    info = section(bio, 2)
    facts = {key: label(info, key) for key in ['Name', 'Age', 'Height', 'Work', 'Home / work base', 'Additional independent adult work']}
    facts['Work'] = facts['Work'] or label(info, 'Primary occupation')
    facts['Home / work base'] = facts['Home / work base'] or label(info, 'Home/work base')
    facts['Additional independent adult work'] = facts['Additional independent adult work'] or label(info, 'Independent sideline')
    assert all(facts[k] for k in ['Age', 'Height', 'Work', 'Home / work base']), 'Incomplete identity: ' + slug
    start = (f"{cfg['name']} is an adult Zentreya woman of rare Pelagian human/dragon ancestry. "
             f"Age: {facts['Age']}. Height: {facts['Height']}. "
             f"Work: {facts['Work']}. Base: {facts['Home / work base']}.")
    appearance = section(bio, 3).split('\n\n')[0]
    extra = facts['Additional independent adult work']
    if extra:
        start += '\n\nEstablished independent adult work: ' + extra + '.'
    start += '\n\n' + appearance
    relations = [line for line in section(bio, 7).splitlines() if line.startswith('- **')]
    if relations:
        start += '\n\n' + '\n'.join(relations[:2])
    if slug not in ['kaia-solenne', 'aveline-drakk']:
        start += '\n\nShe has the established strong Zentreya libido; desire is a persistent part of her personality, alongside work, friendships and independent choices.'
    return clean(start)

def dialogue(p):
    return '\n\n'.join('<START>\n{{user}}: ' + q + '\n{{char}}: ' + a for q, a in p['examples'])

def source_support(bio, cfg):
    history = section(bio, 5).split('\n\n')[0]
    if history.startswith('See the origins'):
        history = section(bio, 1)
    history = history if not history.startswith('**') else ''
    preferences = []
    for key in ['Goals', 'Likes', 'Dislikes']:
        value = label(bio, key)
        if value:
            preferences.append('**' + key + ':** ' + value + '.')
    candidates = []
    if history:
        candidates.append(('History and ordinary life', clean(history)))
    if preferences:
        candidates.append(('Personal priorities', '\n'.join(preferences)))
    relationships = section(bio, 7).split('\n\n')[0]
    if relationships and not relationships.startswith('Relationships are defined'):
        candidates.append(('Relationships in context', clean(relationships)))
    abilities = section(bio, 8).split('\n\n')[0]
    if abilities and not abilities.startswith('A reference to'):
        candidates.append(('Abilities and knowledge', clean(abilities)))
    later = section(bio, 11)
    if later:
        candidates.append(('World ties', later))
    for e in cfg['entries']:
        if e['id'] == 'location' or (not preferences and e['id'] in ['habits', 'preferences']):
            candidates.append(('Additional everyday context', clean(e['text'])))
    return candidates

def make_card(slug, loc, base_card, bio, cfg, p):
    personality = identity(slug, loc, base_card, bio, cfg)
    for title, key in [('Motivation and contradiction', 'motive'), ('Under pressure and after conflict', 'pressure'),
                       ('Care, trust and ordinary behavior', 'care'), ('Voice and manner', 'voice'), ('Attraction and courtship', 'romance')]:
        personality += '\n\n### ' + title + '\n' + p[key]
    personality += '\n\n### Everyday texture and preferences\n' + p['texture']
    scenario = ('The existing First Message establishes the location, people present, current activity and relationship. '
                'Continue those facts; this field does not restart or replace the opening. ' + p['scene'] + '\n\n'
                'All participants are adults. {{user}} controls their own actions, thoughts and dialogue. '
                'Referenced people remain offstage unless the chat establishes their presence. '
                'Romance stays non-graphic and responsive to mutual interest. Secrets are not public knowledge.')
    examples = dialogue(p)
    supports = []
    for title, value in source_support(bio, cfg):
        current = len(personality + scenario + examples + ''.join(x[1] for x in supports))
        if current >= 6100:
            break
        value = '\n'.join(line for line in value.splitlines() if line.strip() not in personality)
        if current + len(value) <= 6900 and value and value not in personality:
            supports.append((title, value))
    for title, value in supports:
        personality += '\n\n### ' + title + '\n' + value
    body = personality + '\n\n' + scenario + '\n\n' + examples
    card = (f"# {cfg['name']} — Extra Details Card\n\n"
            '> Optional expanded edition. Paste the three fields below into Personality, Scenario and Example Dialogues. '
            'Keep your current First Message. These examples illustrate voice; they are not remembered events.\n\n'
            '## Personality\n\n' + personality + '\n\n## Scenario\n\n' + scenario +
            '\n\n## Example Dialogues\n\n' + examples +
            '\n\n## First Message — unchanged\n\nUse exactly the opening already selected for this character. '
            'All existing `FIRST_MESSAGE.md` and `based initial *.md` files are preserved.\n\n'
            '## Setup\n\nUse this card with `SCRIPT_EXTRA_DETAILS.js` as the only enabled character script. '
            'The original compact `CARD.md` and `SCRIPT.js` remain an alternative pair. '
            '`BIO_EXTRA_DETAILS.md` is a creator reference, not an additional field to paste.\n')
    return card, body

BOUNDARY_KEYS = ['please stop', 'stop touching', 'stop flirting', 'do not touch', "don't touch", 'back off',
                 'leave me alone', 'no means no', 'not comfortable', 'not interested', 'too far', 'not okay',
                 'no flirting', 'do not flirt', 'not a date', 'just friends', 'platonic', 'slow down',
                 'need space', 'give me space', 'do not want this', "don't want this"]
DISTRESS_KEYS = ['i am sad', "i'm sad", 'i feel sad', 'i am worried', 'i am scared', "i'm scared", 'i am anxious',
                "i'm anxious", 'i feel lonely', 'crying', 'upset', 'exhausted', 'overwhelmed', 'grieving',
                'no advice', 'just listen']

def make_config(slug, base, p):
    config = dict(schemaVersion=1, edition='extra-details', slug=slug, name=base['name'],
                  archetype=p['archetype'], maxEntries=8, maxOptionalChars=11000,
                  boundaryKeys=BOUNDARY_KEYS, distressKeys=DISTRESS_KEYS)
    config['direction'] = ('Continue the actual chat and its chosen opening. The expanded card supplies permanent characterization. '
        'Apply only cues supported by the present scene; keyword hits are suggestions, not evidence that an event occurred. '
        'No clock or turn-count progression, relationship scores, automatic arrivals, forced confessions or assumed romance. '
        'Never write {{user}}\'s decisions, thoughts or dialogue. Keep physical continuity and distinguish narrator knowledge from character knowledge. '
        'A refusal or distress takes precedence over flirtation. Keep romance non-graphic and violence non-graphic. '
        'Show one or two relevant details naturally, not a recital of this dossier. Let the character have ordinary wants and make mistakes.\n\n'
        'Voice calibration: ' + p['voice'] + '\n\n'
        'Inner motive, not an automatic confession: ' + p['motive'])
    entries = []
    for old in base['entries']:
        if old['id'] in ['boundary', 'distress']:
            continue
        e = dict(old)
        if e['id'] == 'appearance':
            # The current card is authoritative for heights; historical lore sometimes has old estimates.
            e['text'] = 'Use the identity and appearance in CARD_EXTRA_DETAILS, including its current height. Describe only details relevant to an action; do not repeat an inventory.'
        if re.search(r'flirt|desire|adult_work|romance|date|kiss', e.get('id', '') + ' ' + e.get('group', ''), re.I):
            e['tone'] = 'romance'
        e['text'] += ' Treat this as reference context, not a new event, automatic disclosure or arrival.'
        entries.append(e)
    def entry(id, keys, priority, text, tone=None):
        e = dict(id=id, keys=keys, priority=priority, group=id, text=text)
        if tone:
            e['tone'] = tone
        entries.append(e)
    entry('boundary', BOUNDARY_KEYS, 1000,
          'BOUNDARY: Follow the actual request immediately. Stop the unwanted behavior, allow space and accept a platonic direction without bargaining, sulking or punishment. '
          'An apology can be brief and specific. Do not reinterpret refusal as coyness, and do not inject a new romantic escalation.')
    entry('distress', DISTRESS_KEYS, 900,
          'DISTRESS: Respond to what was actually said; do not invent a diagnosis or assume the cause. Ask whether company, listening or practical help is wanted. '
          'Do not turn distress into a romantic opportunity. Character-specific care: ' + p['care'])
    entry('extra_work', ['work', 'job', 'career', 'goal', 'ambition', 'project', 'practice', 'craft', 'business'], 63,
          'PROFESSIONAL INTERIOR: ' + p['motive'] + ' Keep established skill, duties and limits visible. Do not turn every professional interaction into flirtation.')
    entry('extra_conflict', ['argue', 'argument', 'angry', 'unfair', 'wrong', 'mistake', 'apology', 'apologize', 'criticize', 'criticism', 'failure', 'failed'], 82,
          'CONFLICT AND REPAIR: ' + p['pressure'] + ' Answer the specific issue. Repair changes behavior; one good line does not erase a continuing disagreement.')
    entry('extra_trust', ['trust', 'lonely', 'afraid', 'fear', 'feelings', 'honest', 'quiet', 'tired', 'company', 'help', 'rest'], 77,
          'TRUST AND CARE: ' + p['care'] + ' An admission is optional and limited to what she would share now. Do not expose every secret at once.')
    entry('extra_courtship', ['flirt', 'flirting', 'date', 'kiss', 'chemistry', 'attracted', 'romance', 'tease', 'teasing', 'want you', 'like you', 'beautiful'], 69,
          'COURTSHIP, ONLY IF WELCOME: ' + p['romance'] + ' She may make a clear invitation and then leave the response open. Examples are stylistic possibilities, not required lines.', 'romance')
    entry('extra_voice', ['joke', 'serious', 'talk', 'conversation', 'tell me', 'listen', 'explain'], 48,
          'VOICE: ' + p['voice'] + ' Select a register matching the scene, rather than using every habitual phrase.')
    entry('extra_everyday', ['ordinary', 'hobby', 'hobbies', 'favorite', 'favourite', 'like', 'dislike', 'relax', 'free time', 'off duty', 'boring', 'routine'], 61,
          'EVERYDAY PARTICULARS: ' + p['texture'] + ' Use one appropriate detail. Preferences guide choices; they are not new events or props already present.')
    entry('extra_scene', ['what now', 'what next', 'what do you want', 'what shall we do', 'what would you like'], 50,
          'OPTIONAL SCENE POSSIBILITY: ' + p['scene'] + ' Offer a small next choice and stop before deciding {{user}}\'s answer.')
    config['entries'] = entries
    config['examples'] = [{'user': q, 'character': a} for q, a in p['examples']]
    return config

def make_bio(base, cfg, p):
    # Retain the full current reference, including its provenance notes and links, in this additive edition.
    base = base.replace('See the origins and background above for the established work and history.', p['texture'])
    base = base.replace('As described by the established characterization above.', p['motive'])
    references = [e['text'] for e in cfg['entries'] if e['id'].startswith('reference_')]
    base = base.replace('Relationships are defined by the current card and the World Bible; do not presume unlisted connections.', '\n\n'.join(references))
    first, rest = base.split('\n', 1)
    result = first.replace('Character Bible', 'Extra Details Character Bible') + '\n\n'
    result += ('> Optional expanded edition. Existing canon and source provenance are retained below. '
               'The added characterization is new editorial development for this variant; optional scene possibilities are not past events. '
               'No original biography or opening is replaced.\n' + rest)
    result += '\n\n## Expanded characterization\n\n**Writing lenses:** ' + p['archetype'] + '.\n'
    for title, key in [('Desire, need and contradiction', 'motive'), ('Pressure and believable repair', 'pressure'),
                       ('Ordinary intimacy and care', 'care'), ('Speech rhythm and variation', 'voice'),
                       ('Courtship and personal agency', 'romance'), ('Optional scene possibilities', 'scene')]:
        result += '\n### ' + title + '\n\n' + p[key] + '\n'
    if p['texture'] not in base:
        result += '\n### Everyday texture and preferences\n\n' + p['texture'] + '\n'
    result += '\n### Dialogue study\n\nThese are voice examples, not additional opening messages or canonical memories.\n\n' + dialogue(p) + '\n'
    result += ('\n### Development without a predetermined arc\n\nA generous response may coexist with irritation, an attraction with caution, or professional competence with a small personal mistake. '
               'Let later choices respond to what actually happened. Do not force a confession, cure a longstanding fear in one exchange or replay an example as if it were a past event. '
               'References can affect her feelings while the referenced people remain elsewhere.\n')
    return result

def main():
    assert set(MANIFEST) == set(PROFILES), 'Profile coverage must match the current manifest'
    sizes = []
    for slug, loc in MANIFEST.items():
        folder = ROOT / 'characters' / loc
        cfg = json.loads((folder / 'config.json').read_text())
        card = (folder / 'CARD.md').read_text()
        bio = (folder / 'BIO.md').read_text()
        p = PROFILES[slug]
        expanded, fields = make_card(slug, loc, card, bio, cfg, p)
        extra_cfg = make_config(slug, cfg, p)
        (folder / 'CARD_EXTRA_DETAILS.md').write_text(expanded)
        (folder / 'BIO_EXTRA_DETAILS.md').write_text(make_bio(bio, cfg, p))
        serialized = json.dumps(extra_cfg, ensure_ascii=False, indent=2)
        (folder / 'config_extra_details.json').write_text(serialized + '\n')
        (folder / 'SCRIPT_EXTRA_DETAILS.js').write_text('/* Standalone extra-details edition; enable instead of SCRIPT.js. */\nvar EXTRA_DETAILS_CONFIG = ' + serialized + ';\n' + ENGINE)
        sizes.append(dict(slug=slug, path='characters/' + loc, field_characters=len(fields),
                          estimated_tokens=math.ceil(len(fields) / 4), examples=len(p['examples']),
                          lore_entries=len(extra_cfg['entries']), script_bytes=(folder / 'SCRIPT_EXTRA_DETAILS.js').stat().st_size))
    (ROOT / 'extra_details/manifest.json').write_text(json.dumps(dict(schemaVersion=1,
        estimate_method='ceil(Unicode character count / 4), Personality + Scenario + Example Dialogues only; not a model tokenizer',
        characters=sizes), ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'characters': len(sizes), 'estimated_tokens_min': min(x['estimated_tokens'] for x in sizes),
                      'estimated_tokens_max': max(x['estimated_tokens'] for x in sizes),
                      'estimated_tokens_mean': round(sum(x['estimated_tokens'] for x in sizes) / len(sizes))}))

if __name__ == '__main__':
    main()
