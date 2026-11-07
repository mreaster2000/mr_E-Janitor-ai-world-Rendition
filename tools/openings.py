#!/usr/bin/env python3
"""Create OPENING.md for characters from tools/opening_data.json and keep BIO section 10 in sync with the files on disk."""
import glob,json,os,re
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data=json.load(open(root+'/tools/opening_data.json'))
for p in glob.glob(root+'/characters/**/BIO.md',recursive=True):
    d=os.path.dirname(p);s=os.path.basename(d)
    if s in data and not os.path.exists(d+'/OPENING.md'):
        title,text=data[s]
        open(d+'/OPENING.md','w').write(f"# Opening — {title}\n\n{text}\n")
    if os.path.exists(d+'/OPENING.md'):
        first=open(d+'/OPENING.md').readline().strip()
        title=re.sub(r'^#\s*Opening\s*[—-]\s*','',first)
        t=open(p).read()
        new=f"**Available openings:**\n- `OPENING.md` — {title}.\n"
        t2=re.sub(r'\*\*Available openings:\*\*\n(?:- [^\n]*\n)+',new,t,count=1)
        if t2!=t:open(p,'w').write(t2)
