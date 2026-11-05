from pathlib import Path
import re, json, unicodedata, argparse

ROOT=Path(__file__).resolve().parents[1]
ORDER=['SYSTEM_ROLE','CHARACTER','SUMMARY','APPEARANCE','PSYCHOLOGICAL_PROFILE','SOCIAL_BEHAVIOR','EXPRESSION & SENSORY','RELATIONSHIP_FLAGS','EMOTIONAL_LOGIC','CLOSENESS_BEHAVIOR','SCENARIO_HOOKS','CANON & KNOWLEDGE LIMITS','DIALOGUE_PATTERNS','FORMAT','REFLECTION_PROMPT']
BIO=['Overview','Physical Appearance and Presentation','Origin and Personal History','Personality, Values and Voice','Work, Abilities and Daily Life','Motivations, Flaws and Emotional Logic','Important Relationships','Powers, Secrets and Knowledge Limits','Roleplay Guidance and Dialogue','Reference Art and Initial Scenarios','Expanded Stories and Editorial Notes']

def sections(s, kind='bio'):
    pattern=r'^## ([^\n]+)\s*$' if kind=='bio' else r'^#{2,3} ([A-Z][A-Z_ &/-]+)\s*$'
    ms=list(re.finditer(pattern,s,re.M))
    return [(m[1].strip(),s[m.end():ms[i+1].start()].strip()) for i,m in enumerate(ms)]

def num(sec,n):
    return next((t for h,t in sec if re.match(r'^'+str(n)+r'\.\s',h)), '')

def like(sec,patterns):
    return next((t for p in patterns for h,t in sec if re.search(p,h,re.I)), '')

def meaningful(t,n=16):
    return len(t.split())>=n and not re.match(r'^(See (?:the )?(?:identity|origins|card)|The identity section records|Relationships are defined by|A reference to another person is never)',t.strip(),re.I)

def pick(*args,n=16):
    return next((x.strip() for x in args if meaningful(x,n)),next((x.strip() for x in args if x.strip()),''))

def normal(s):
    s=unicodedata.normalize('NFKD',s.replace('œ','oe').replace('Œ','Oe'))
    return re.sub(r'[^a-z0-9]','', ''.join(c for c in s.lower() if not unicodedata.combining(c)))

def heights(root):
    data={}; proposed=False
    for line in (root/'HEIGHT_REFERENCE.md').read_text().splitlines():
        if 'Twelve reconstructed Zentreya heights' in line: proposed=True
        if 'New artwork-led characters' in line: proposed=False
        if line.startswith('|'):
            a=[x.strip() for x in line.strip('|').split('|')]
            if len(a)>=2 and a[0]!='Character' and '---' not in a[0]: data[normal(a[0])]=(a[1],proposed)
    return data

def appearance(b,c):
    t=num(b,3)
    t=re.split(r'\*\*Current character-card description:\*\*',t)[0].strip()
    if meaningful(t,13): return t
    t=like(b,['^Visual reference','Physical impression','^Appearance','^Core identity, boundaries and appearance'])
    if t:
        paragraphs=[x.strip() for x in t.split('\n\n') if re.search(r'hair|eyes|skin|horn|outfit|wear|dress|muscul|body|face|braid|armor|portrait',x,re.I)]
        if paragraphs: return '\n\n'.join(paragraphs[:2])
    t=num(b,2)
    paragraphs=[x.strip() for x in t.split('\n\n') if re.search(r'hair|eyes|skin|horn|muscul|braid|fur|tail',x,re.I)]
    if paragraphs: return paragraphs[0]
    t=dict(c).get('APPEARANCE','')
    return t if meaningful(t,11) else 'Individual facial features, hair, eyes and proportions have not been confirmed; leave those details open rather than assigning a face from ambiguous artwork.'

COLOR=r'(?:silver-white|blue-white|honey-gold|silver-green|copper-orange|purple-blue|mint-teal|red|black|blonde|white|gold|golden|brown|green|pink|blue|silver|pale|purple|lavender|teal|orange|magenta|coral|dark)'
def hair(t):
    if re.search(r'(?:exact|specific|individual).{0,55}hair.{0,55}(?:unassigned|unconfirmed|unknown|unresolved)',t,re.I): return 'Unassigned in source artwork.'
    m=re.search(r'(?i)((?:(?:long|short|wild|wavy|shaggy|braided|curly|flowing)\s+){0,3}'+COLOR+r'(?:[- ]'+COLOR+r')?(?:\s+(?:long|short|wavy|braided))?\s+(?:hair|braids|locs|locks|mane|ponytail))',t)
    return m[1] if m else 'Not established in the available source.'
def eyes(t):
    m=re.search(r'(?i)((?:bright|icy|cool|pale|vivid|dark|glowing|sharp|narrow)?\s*(?:green|blue|amber|red|brown|gold|golden|violet|purple|black|grey|gray|turquoise|hazel)(?:[- ](?:blue|green))?\s+eyes)',t)
    return m[1].strip() if m else 'Not established in the available source.'
def frame(t):
    return 'Clearly powerful, muscular or athletic as described above.' if re.search(r'muscular|athletic|powerhouse|broad|heavy.build|muscle',t,re.I) else 'See the sourced visual profile; exact body measurements are not established.'

def original_h(slug,H):
    key=normal(slug)
    found=[(k,v) for k,v in H.items() if key in k or k in key]
    if not found: return 'Not established; no numeric estimate from artwork.'
    k,(h,p)=min(found,key=lambda a: abs(len(a[0])-len(key)))
    return h+(' (proposed editorial measurement)' if p else '')

def normalize(slug,folder,root,H):
    p=root/'characters'/folder
    bio=(p/'BIO.md').read_text();card=(p/'CARD.md').read_text();b=sections(bio);c=sections(card,'card');d=dict(c)
    visual=appearance(b,c)
    visual=re.sub(r'(?i)^(?:six|seven|eight|nine)-foot-[a-z-]+,?\s*','',visual)
    visual=re.sub(r'(?is)Her appearance and posture should remain recognizable.*?every reply\.','',visual).strip()
    h=original_h(slug,H)
    who=pick(num(b,1),like(b,['^Identity and story role','^Overview','^Core identity','^Orientation','^Biography']),d.get('CHARACTER',''),n=10)
    if len(who.split())<45:who+='\n\n'+d.get('SUMMARY','')
    origin=pick(num(b,2),like(b,['^Background','^Basic information','^Origin','Childhood influences','^Biography']),d.get('CHARACTER',''),n=25)
    if len(origin.split())<40:origin+='\n\n'+d.get('CHARACTER','')
    persona=pick(num(b,4),like(b,['^Core characterization','Character psychology','Speech, humor','^Personality','^Psychology']),d.get('SOCIAL_BEHAVIOR',''),n=25)
    work=pick(num(b,5),like(b,['Daily routines','Professional constraints','^Biography','^Background']),d.get('CHARACTER',''),n=25)
    if len(work.split())<45:work+='\n\n'+pick(d.get('CHARACTER',''),d.get('SCENARIO_HOOKS',''),n=10)
    drive=pick(num(b,6),like(b,['Motivations','Personal psychology','Psychology','Weaknesses']),d.get('PSYCHOLOGICAL_PROFILE',''),n=25)
    rel=pick(num(b,7),like(b,['Relationships and knowledge','Relationships and connection','Voice, mannerisms and relationships','^Relationships']),d.get('SCENARIO_HOOKS',''),n=30)
    if len(rel.split())<55: rel+='\n\n**Card-recorded family, peers and rivals:**\n'+d.get('SCENARIO_HOOKS','')
    privacy=pick(num(b,8),like(b,['Secrets','Powers','Abilities','Roleplay continuity']),d.get('CANON & KNOWLEDGE LIMITS',''),n=35)
    if len(privacy.split())<45:privacy+='\n\n'+d.get('CHARACTER','')+'\n\nKeep undisclosed identities, special abilities and other people’s whereabouts limited to what the scene and shared canon actually establish; names do not summon absent people.'
    guidance=pick(num(b,9),like(b,['Scene and character logic','Roleplay','Speech, humor']),d.get('REFLECTION_PROMPT',''),n=40)
    if len(guidance.split())<45:guidance+='\n\n'+d.get('SOCIAL_BEHAVIOR','')
    guidance+='\n\n**Dialogue calibration:**\n\n'+d.get('DIALOGUE_PATTERNS','')
    art=sorted(x.name for x in p.iterdir() if x.is_file() and x.suffix.lower() in ('.png','.webp','.jpg','.jpeg'))
    openers=sorted(x.name for x in p.iterdir() if x.is_file() and x.name.startswith('OPENING') and x.suffix.lower()=='.md')
    refs='**Artwork in this directory:**\n'+('\n'.join('- ['+x+']('+x+')' for x in art) if art else '- None verified here; image import is a separate pending step.')+'\n\n**Available openings:**\n'+('\n'.join('- ['+x+']('+x+')' for x in openers) if openers else '- No opening file verified here.')
    extras=[(name,text) for name,text in b if not re.match(r'^([1-9]|10)\.\s',name)]
    preserve='\n\n'.join('### '+name+'\n\n'+re.sub(r'(?m)^(#{3,5})(\s)',lambda m:'#'+m[1]+m[2],text) for name,text in extras)
    if not preserve:preserve='### Distinct scenes and background\n\n'+d.get('SCENARIO_HOOKS','')
    overview='**Height:** '+h+'\n\n**Visual profile:** '+visual+'\n\n**Verified attributes:**\n- **Hair:** '+hair(visual)+'\n- **Eyes:** '+eyes(visual)+'\n- **Build/form:** '+frame(visual)+'\n- **Style and markings:** As specifically described above; if a detail is absent, leave it unresolved.\n\nUse physical details naturally in movement, not as a repeated inventory.'
    bodies=[who,overview,origin,persona,work,drive,rel,privacy,guidance,refs,'Earlier detailed background is preserved below as creator-facing context; newly invented Rendition scenes remain editorial rather than automatically confirmed canon.\n\n'+preserve]
    title=bio.splitlines()[0].split(' — ')[0].strip() if bio.startswith('# ') else '# '+slug.replace('-',' ').title()
    result=title+' — Unified Character Bible\n\n> Creator-facing reference; the BIO is not inserted into every roleplay response.\n\n'
    for i,(label,part) in enumerate(zip(BIO,bodies),1):result+='## '+str(i)+'. '+label+'\n\n'+part.strip()+'\n\n'
    d['APPEARANCE']='**Height:** '+h+'\n\n'+visual+'\n\n**Hair:** '+hair(visual)+'. **Eyes:** '+eyes(visual)+'. **Build:** '+frame(visual)+' Maintain creator-confirmed features across outfits; do not invent unresolved traits.'
    d['CANON & KNOWLEDGE LIMITS']=d.get('CANON & KNOWLEDGE LIMITS','') or privacy
    d['CHARACTER']=d.get('CHARACTER','') or who
    d['SUMMARY']=d.get('SUMMARY','') or who
    for hname,fall in [('PSYCHOLOGICAL_PROFILE',drive),('SOCIAL_BEHAVIOR',persona),('EXPRESSION & SENSORY',visual),('RELATIONSHIP_FLAGS',rel),('EMOTIONAL_LOGIC',drive),('CLOSENESS_BEHAVIOR',persona),('SCENARIO_HOOKS',rel),('DIALOGUE_PATTERNS',guidance),('SYSTEM_ROLE',guidance),('FORMAT','*Actions*; "spoken dialogue"; [thoughts sparingly]; OOC only when asked.'),('REFLECTION_PROMPT',guidance)]:
        if not d.get(hname,'').strip():d[hname]=fall
    d['PSYCHOLOGICAL_PROFILE']=re.sub(r'(?im)^- \*\*(Near goals|Near-term goals)\*\*:','- **Short-term goals**:',d['PSYCHOLOGICAL_PROFILE'])
    d['PSYCHOLOGICAL_PROFILE']=re.sub(r'(?im)^- \*\*(Far goals|Far-term goals)\*\*:','- **Long-term goals**:',d['PSYCHOLOGICAL_PROFILE'])
    resultc=card.splitlines()[0].split(' — ')[0].strip()+' — Unified Card v4\n\n'
    for label in ORDER:resultc+='### '+label+'\n\n'+d[label].strip()+'\n\n'
    (p/'BIO.md').write_text(result)
    (p/'CARD.md').write_text(resultc)
    return len(result.split()),len(resultc.split())

def main():
    args=argparse.ArgumentParser()
    args.add_argument('--only',nargs='*')
    opts=args.parse_args()
    manifest=json.loads((ROOT/'characters/manifest.json').read_text())['characters']
    H=heights(ROOT)
    for slug,folder in manifest.items():
        if slug=='absolute-wonder-woman':continue
        if opts.only and slug not in opts.only:continue
        b,c=normalize(slug,folder,ROOT,H)
        print(slug,b,c)
        if b<2000 or c<800:raise ValueError(slug+' below long-form floor')
if __name__=='__main__':main()
