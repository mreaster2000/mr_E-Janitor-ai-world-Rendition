# Character path migration

Folders previously stored at `characters/<slug>/` are now nested in primary groups. All scripts and card files were moved without rewriting their unrelated content.

| Old folder | New folder |
|---|---|
| `characters/absolute-wonder-woman/` | [`characters/pelagia/absolute-wonder-woman/`](characters/pelagia/absolute-wonder-woman/) |
| `characters/apollo/` | [`characters/independent-associates/apollo/`](characters/independent-associates/apollo/) |
| `characters/apollyon/` | [`characters/pelagia/apollyon/`](characters/pelagia/apollyon/) |
| `characters/ashkaya/` | [`characters/anima-lineages/ashkaya/`](characters/anima-lineages/ashkaya/) |
| `characters/ayame/` | [`characters/pelagian-diaspora/ayame/`](characters/pelagian-diaspora/ayame/) |
| `characters/batu/` | [`characters/anima-lineages/batu/`](characters/anima-lineages/batu/) |
| `characters/dixie/` | [`characters/kyouka-family/dixie/`](characters/kyouka-family/dixie/) |
| `characters/dunkle/` | [`characters/anima-lineages/dunkle/`](characters/anima-lineages/dunkle/) |
| `characters/emelia/` | [`characters/independent-associates/emelia/`](characters/independent-associates/emelia/) |
| `characters/gwen/` | [`characters/new-york-associates/gwen/`](characters/new-york-associates/gwen/) |
| `characters/luka/` | [`characters/gym-gals/luka/`](characters/gym-gals/luka/) |
| `characters/mellow/` | [`characters/new-york-associates/mellow/`](characters/new-york-associates/mellow/) |
| `characters/mudryk/` | [`characters/gym-gals/mudryk/`](characters/gym-gals/mudryk/) |
| `characters/nandi/` | [`characters/anima-lineages/nandi/`](characters/anima-lineages/nandi/) |
| `characters/phoebe/` | [`characters/pelagia/phoebe/`](characters/pelagia/phoebe/) |
| `characters/power-girl/` | [`characters/kyouka-family/power-girl/`](characters/kyouka-family/power-girl/) |
| `characters/reagin/` | [`characters/independent-associates/reagin/`](characters/independent-associates/reagin/) |
| `characters/renata/` | [`characters/pelagian-diaspora/renata/`](characters/pelagian-diaspora/renata/) |
| `characters/she-hulk/` | [`characters/new-york-associates/she-hulk/`](characters/new-york-associates/she-hulk/) |
| `characters/shiraishi/` | [`characters/kyouka-family/shiraishi/`](characters/kyouka-family/shiraishi/) |
| `characters/suzana/` | [`characters/pelagia/suzana/`](characters/pelagia/suzana/) |
| `characters/vicki/` | [`characters/gym-gals/vicki/`](characters/gym-gals/vicki/) |
| `characters/victoria-vincent/` | [`characters/pelagian-diaspora/victoria-vincent/`](characters/pelagian-diaspora/victoria-vincent/) |
| `characters/xuerou/` | [`characters/gym-gals/xuerou/`](characters/gym-gals/xuerou/) |
| `characters/yamato/` | [`characters/pelagia/yamato/`](characters/pelagia/yamato/) |
| `characters/yugo/` | [`characters/gym-gals/yugo/`](characters/gym-gals/yugo/) |
| `characters/zesty/` | [`characters/gym-gals/zesty/`](characters/gym-gals/zesty/) |
| `characters/zuri/` | [`characters/gym-gals/zuri/`](characters/gym-gals/zuri/) |

The machine-readable map is in [`characters/manifest.json`](characters/manifest.json). Link to a character's new folder instead of retaining copied/duplicate cards.

## November 5 restructuring

The former `beyond-the-gym` catch-all was split into `anima-lineages` and `independent-associates`. All per-character card, bio, script, config, first-message and reference-art file contents remain intact. The table above now links to the active grouped paths.
