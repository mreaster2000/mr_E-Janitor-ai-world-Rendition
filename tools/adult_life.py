#!/usr/bin/env python3
"""Append '### Adult life, desire and intimacy (non-graphic)' to BIO.md from tools/bio_data/adult_life.txt (idempotent)."""
import glob,os
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
paths={p.split('/')[-2]:p for p in glob.glob(root+'/characters/**/BIO.md',recursive=True)}
cur=None;data={}
for line in open(root+'/tools/bio_data/adult_life.txt'):
    line=line.rstrip('\n')
    if line.startswith('@@ '):cur=line[3:].strip();data[cur]='';continue
    if cur and line.strip():data[cur]+=(' ' if data[cur] else '')+line.strip()
n=0
for s,txt in data.items():
    t=open(paths[s]).read()
    if 'Adult life, desire and intimacy' in t:continue
    t=t.rstrip('\n')+"\n\n### Adult life, desire and intimacy (non-graphic)\n\nThis character is an adult with her own wants. Scenes stay sensual and non-explicit: tension, touch, clothing and aftercare are available; explicit acts are not. Desire never implies consent from {{user}} or removes her autonomy.\n\n"+txt+"\n"
    open(paths[s],'w').write(t);n+=1
print('added',n)
