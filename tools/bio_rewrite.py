#!/usr/bin/env python3
"""Apply tools/bio_data/*.txt: '@@ slug' then 'S6:'/'S8:'/... blocks (multi-line) replace section bodies in BIO.md."""
import glob,re,sys,os
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
paths={p.split('/')[-2]:p for p in glob.glob(root+'/characters/**/BIO.md',recursive=True)}
n=0
for f in sorted(glob.glob(root+'/tools/bio_data/*.txt')):
    cur=None;sec=None;data={}
    for line in open(f):
        line=line.rstrip('\n')
        if line.startswith('@@ '):cur=line[3:].strip();data[cur]={};sec=None;continue
        m=re.match(r'S(\d+):\s?(.*)',line)
        if cur and m:sec=int(m.group(1));data[cur][sec]=m.group(2);continue
        if cur and sec is not None:data[cur][sec]+='\n'+line
    for slug,secs in data.items():
        p=paths[slug];t=open(p).read()
        for s,body in secs.items():
            body=body.strip()
            pat=re.compile(r'(## %d\. [^\n]*\n\n).*?(?=\n## \d+\. |\Z)'%s,re.S)
            assert pat.search(t),(slug,s)
            t=pat.sub(lambda m:m.group(1)+body+'\n',t,count=1)
        open(p,'w').write(t);n+=1
print('rewrote',n,'bios')
