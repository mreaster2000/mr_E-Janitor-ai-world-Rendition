#!/usr/bin/env python3
"""Regression check for 61 source-grounded unified BIO and Card v4 documents."""
from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = json.loads((ROOT/"characters/manifest.json").read_text(encoding="utf-8"))["characters"]
HEADINGS = [
  "Overview","Physical Appearance and Presentation","Origin and Personal History",
  "Personality, Values and Voice","Work, Abilities and Daily Life",
  "Motivations, Flaws and Emotional Logic","Important Relationships",
  "Powers, Secrets and Knowledge Limits","Roleplay Guidance and Dialogue",
  "Reference Art and Initial Scenarios","Expanded Stories and Editorial Notes"
]
CARD = [
  "SYSTEM_ROLE","CHARACTER","SUMMARY","APPEARANCE",
  "PSYCHOLOGICAL_PROFILE","SOCIAL_BEHAVIOR","EXPRESSION & SENSORY",
  "RELATIONSHIP_FLAGS","EMOTIONAL_LOGIC","CLOSENESS_BEHAVIOR","SCENARIO_HOOKS",
  "CANON & KNOWLEDGE LIMITS","DIALOGUE_PATTERNS","FORMAT","REFLECTION_PROMPT"
]
# Characteristics explicitly supported by creators' visual descriptions in the current BIOs.
CONFIRMED = {
 "apollo":{"hair":"ember-red","eyes":"amber"},
 "ashkaya":{"hair":"pink-white","eyes":"amber"},
 "batu":{"hair":"black","eyes":"black"},
 "reagin":{"hair":"dark bob"},
 "renata":{"hair":"deep-plum"},
 "runa-valeska":{"hair":"pale"},
 "yugo":{"hair":"silver-white","eyes":"blue"},
 "luka":{"hair":"blonde"},
 "shiraishi":{"hair":"blonde","eyes":"blue"},
 "zirkala-tatanka":{"hair":"dark brown"},
 "aveline-drakk":{"hair":"red"},
 "celeste-rojas":{"hair":"pale"},
 "kaia-solenne":{"hair":"white"},
 "leona-aster":{"hair":"golden"},
 "liberty-redford":{"hair":"red"},
 "marisol-reyes":{"hair":"red"},
 "nyx-rielle":{"hair":"pale","eyes":"crimson"},
 "roux-caldera":{"hair":"red"},
 "rowan-mercer":{"hair":"red"},
 "seraphine-ash":{"hair":"red","eyes":"gold"},
 "balaika":{"hair":"blonde"},
 "kara-supergirl":{"hair":"blonde"},
 "bernadette":{"hair":"black"},
 "wonder-witch":{"hair":"dark"},
 "marieza-san":{"hair":"light"},
 "palkia":{"hair":"lavender","eyes":"lilac"},
 "phoebe":{"hair":"copper-orange","eyes":"ember"},
 "rosa":{"hair":"black","eyes":"dark"},
 "besterta":{"hair":"silver-white","eyes":"pale"}
}

def parse(s, regex):
    found=list(re.finditer(regex,s,re.M))
    return [(m[1].strip(),s[m.end():(found[i+1].start() if i+1<len(found) else len(s))].strip())
            for i,m in enumerate(found)]

def scan(slug,folder):
    bio=(ROOT/"characters"/folder/"BIO.md").read_text(encoding="utf-8")
    card=(ROOT/"characters"/folder/"CARD.md").read_text(encoding="utf-8")
    bs=parse(bio,r"^## ([0-9]+\.[^\n]+)$")
    cs=parse(card,r"^### ([A-Z][A-Z_ &/-]+)$")
    err=[]
    bh=[h for h,_ in bs]
    if bh != [str(i)+". "+h for i,h in enumerate(HEADINGS,1)]:
        err.append("BIO headings out of order or missing")
    if [h for h,_ in cs] != CARD:
        err.append("Card v4 headings out of order or missing")
    for i,(heading,content) in enumerate(bs):
        required = 8 if i == 9 else (35 if i in (1,6,7,8) else 12)
        if len(content.split())<required:
            err.append("BIO section "+str(i+1)+" underspecified: "+str(len(content.split()))+" words")
        if i in (1,6,7,8) and re.match(r"^(?:see (?:the )?(?:card|identity)|relationships are defined|a reference to)",content,re.I):
            err.append("BIO section "+str(i+1)+" is a placeholder")
    if len(bs)>=10 and ("**Artwork in this directory:**" not in bs[9][1] and "**Verified local visual files:**" not in bs[9][1]):
        err.append("BIO reference section does not identify actual artwork status")
    if len(bs)>=10 and ("**Available openings:**" not in bs[9][1] and "OPENING" not in bs[9][1]):
        err.append("BIO reference section does not identify actual opening status")
    for name,content in cs:
        if len(content.split())<5:err.append("Card section "+name+" empty/short")
    if len(bio.split())<2000:err.append("BIO below established 2000-word minimum")
    if len(card.split())<800:err.append("Card below established 800-word minimum")
    if len(bs)>=2 and len(cs)>=4:
        visual=bs[1][1]
        cv=dict(cs).get("APPEARANCE","")
        bh=re.search(r"\*\*Height:\*\*\s*([^\n]+)",visual)
        ch=re.search(r"\*\*Height:\*\*\s*([^\n]+)",cv)
        if not bh or not ch or bh[1].strip()!=ch[1].strip():err.append("BIO and Card heights mismatch")
        for label in ("Hair","Eyes","Build/form"):
            if not re.search(r"(?m)^- \*\*"+re.escape(label)+r":\*\* \S",visual):
                err.append("BIO physical detail index missing "+label)
        if "Visual profile:" not in visual or re.search(r"(?i)^Visual profile:\s*(?:See (?:identity|card)|The identity section records)",visual):
            err.append("BIO lacks actual appearance description")
        if "**Hair:**" not in cv or "**Eyes:**" not in cv:
            err.append("Card lacks explicit hair and eye status")
        fields={}
        for f in ("Hair","Eyes"):
            q=re.search(r"(?m)^- \*\*"+f+r":\*\* ([^\n]+)",visual)
            fields[f.lower()]=q[1] if q else ""
        card_pair=re.search(r"\*\*Hair:\*\* (.*?)\. \*\*Eyes:\*\* (.*?)\. \*\*Build:\*\*",cv,re.S)
        if not card_pair:
            err.append("Card hair/eyes pair malformed")
        else:
            if card_pair[1].strip().rstrip(".")!=fields["hair"].strip().rstrip(".") or card_pair[2].strip().rstrip(".")!=fields["eyes"].strip().rstrip("."):
                err.append("Card hair/eyes differ from BIO source")
        if ".. **Build:**" in cv or ".. Maintain creator-confirmed" in cv:
            err.append("Duplicate punctuation in appearance fields")
        for key,expected in CONFIRMED.get(slug,{}).items():
            if expected.lower() not in fields[key].lower():
                err.append("Sourced "+key+" not reflected: "+fields[key])
        if slug=="runa-valeska" and "red hair" in fields["hair"].lower():err.append("Runa falsely labeled red-haired")
    for stale in (r"Six-foot-eight, tan and muscular",r"Six-foot-nine, athletic",r"Six-foot-eleven wrestler",r"closer to seven-foot-six with her ivory horns"):
        if re.search(stale,bio,re.I):err.append("Superseded height estimate remains: "+stale)
    return err

def main():
    failures=[]
    for slug,folder in MANIFEST.items():
        errors=scan(slug,folder)
        if errors:
            failures.extend(slug+": "+error for error in errors)
    print("Unified BIO/CARD structure and appearance examined:",len(MANIFEST),"characters")
    if failures:
        for f in failures:print("FAIL:",f)
        sys.exit(1)
    print("PASS: all 61 have populated uniform BIO/Card sections and consistent sourced appearance details")
if __name__=="__main__":main()
