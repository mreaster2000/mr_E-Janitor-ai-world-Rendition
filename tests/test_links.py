from pathlib import Path
import re
from urllib.parse import unquote
root=Path(__file__).resolve().parents[1]
issues=[]
for f in root.rglob('*.md'):
 if '.git' in f.parts: continue
 body=f.read_text(encoding='utf-8')
 for raw in re.findall(r'(?<!!)\[[^\]\n]+\]\(([^)]+)\)',body):
  path=raw.split('#',1)[0].strip()
  if not path or '://' in path or path.startswith('#'):continue
  if not (f.parent/unquote(path)).resolve().exists():issues.append((f.relative_to(root).as_posix(),path))
print('Broken relative links:',len(issues))
for name,link in issues[:100]:print(name,'->',link)
raise SystemExit(1 if issues else 0)
