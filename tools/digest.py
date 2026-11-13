import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
M=json.loads((ROOT/'characters/manifest.json').read_text())['characters']
def sec(t,n,lim):
    m=re.search(rf'^## {n}\. [^\n]+\n\n(.*?)(?=^## )',t,re.M|re.S); return re.sub(r'\s+',' ',m.group(1))[:lim] if m else ''
for s in sys.argv[1:]:
    b=(ROOT/'characters'/M[s]/'BIO.md').read_text(); c=(ROOT/'characters'/M[s]/'CARD.md').read_text()
    print('=====',s, len(b.split()),'w')
    print('CH:',re.search(r'### CHARACTER\n\n(.+)',c).group(1)[:260])
    print('S1:',sec(b,1,520)); print('S2:',sec(b,2,380)); print('S4:',sec(b,4,520)); print('S6:',sec(b,6,420))
    m=re.search(r'^## 7\. [^\n]+\n\n(.*?)(?=^## )',b,re.M|re.S)
    for l in m.group(1).splitlines():
        if l.startswith('- '): print('R:',l[:190])
    print('S8:',sec(b,8,300))
    for lab in ('Background','Family','Friends/Allies','Favorite Places','Objects/Motifs'):
        mm=re.search(rf'- \*\*{lab}:\*\* (.+)',c); print(lab[:4]+':',(mm.group(1)[:170] if mm else '-'))
