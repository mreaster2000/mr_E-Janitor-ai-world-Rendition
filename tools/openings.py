#!/usr/bin/env python3
"""Write OPENING.md for each character from tools/opening_data/*.md ('@@ slug | Title' blocks) and sync BIO section 10.
Reports openings under 350 words."""
import glob,os,re
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
paths={os.path.basename(os.path.dirname(p)):os.path.dirname(p) for p in glob.glob(root+'/characters/**/BIO.md',recursive=True)}
blocks={}
for f in sorted(glob.glob(root+'/tools/opening_data/*.md')):
    cur=None
    for line in open(f):
        m=re.match(r'@@ (\S+) \| (.+)',line.rstrip('\n'))
        if m:cur=m[1];blocks[cur]=[m[2],[]];continue
        if cur:blocks[cur][1].append(line.rstrip('\n'))
for s,(title,lines) in blocks.items():
    body='\n'.join(lines).strip()
    open(paths[s]+'/OPENING.md','w').write(f"# Opening — {title}\n\n{body}\n")
for s,d in paths.items():
    if os.path.exists(d+'/OPENING.md'):
        title=re.sub(r'^#\s*(?:Optional )?[Oo]pening\s*[—-]\s*','',open(d+'/OPENING.md').readline().strip())
        p=d+'/BIO.md';t=open(p).read()
        t2=re.sub(r'\*\*Available openings:\*\*\n(?:- [^\n]*\n)+',f"**Available openings:**\n- `OPENING.md` — {title}.\n",t,count=1)
        if t2!=t:open(p,'w').write(t2)
short=[(s,len(open(d+'/OPENING.md').read().split())) for s,d in paths.items() if os.path.exists(d+'/OPENING.md') and len(open(d+'/OPENING.md').read().split())<350]
print('written',len(blocks),'| under 350 words:',len(short))
if short:print(', '.join(f'{s}:{n}' for s,n in short))
