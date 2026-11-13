#!/usr/bin/env python3
"""Insert '### Lore Threads' into BIOs from tools/bio_data/lore_threads.txt (before the adult-life section). Skips BIOs that already have one."""
import glob, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data, cur = {}, None
for line in open(root + '/tools/bio_data/lore_threads.txt', encoding='utf8'):
    line = line.rstrip('\n')
    if line.startswith('@@ '): cur = line[3:].strip(); data[cur] = []
    elif cur and line.strip(): data[cur].append(line)
n = 0
for p in glob.glob(root + '/characters/**/BIO.md', recursive=True):
    s = p.split('/')[-2]; t = open(p, encoding='utf8').read()
    if s not in data or '### Lore Threads' in t: continue
    block = "### Lore Threads\n\nOptional context and hooks, never automatic events:\n\n" + '\n'.join(data[s]) + "\n\n"
    marker = "### Adult life, desire and intimacy"
    if marker in t: t = t.replace(marker, block + marker, 1)
    else: t = t.rstrip('\n') + "\n\n" + block.rstrip('\n') + "\n"
    open(p, 'w', encoding='utf8').write(t); n += 1
print('lore threads inserted', n)
