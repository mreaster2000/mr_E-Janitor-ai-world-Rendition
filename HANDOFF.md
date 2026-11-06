# Handoff / progress log (branch `rendition-overhaul-2026-11-05`)

Updated: 2026-11-06. Read this first when resuming. Never merge to `main` without creator approval.

## Done
- Artwork imported (64 source images -> 65 WebP files, `ARTWORK_IMPORT_MANIFEST.json`, sha256). Reference/alternate choices: Apollo ref=Sunkiller full art, alt=model sheet; Balaika ref=clean line-art portrait, alt=coloured comic scene; Absolute Wonder Woman ref=full-figure cover art, alt=crouching sword pose. Council beauty+technology share one image. Hilde.png -> reagin (eyepatch, uniform), Major.png -> apollyon (pink hair, epaulets, violet apparition). Unassigned art in `characters/_shared/`. No art yet: aveline-drakk, kaia-solenne, sukisekine, talatora (scene only).
- RESOLVED: Mirko's sister is Zentreya via her mother (father not Zentreya); siblings by blood with Mirko; name still pending. Updated mirko-sibling, mirko, ZENTREYA_CANON.
- Branch cleanup: removed ~22k words of boilerplate/duplicate sentences from all BIO files; fixed `{user}` -> `{{user}}`; placeholder Build text replaced.
- WORLD_BIBLE: 9 proposed shared lore threads (Tidewall Ledger, Lantern Line, Atelier Nocturne, Back Stairs, Advisory Weather, Costume Door, Ember Postcards, Skerry Table, Unedited Hour) + "Wash Bay" note.
- Real sections 3/6/8 authored for: ashkaya, ayame, batu, dunkle, mellow, suzana, xuerou, zesty, zirkala-tatanka (section 8 only); sections 8 + Lore Threads for balaika, kara-supergirl, mirko, mirko-sibling, crimson-viper, techy, gluco-charin, akumaskywalker, wonder-witch, bon, talatora, marieza-san. Palkia and bernadette rewritten by interrupted agents (quality NOT reviewed).
- Lucoa added (pelagia/diaspora/lucoa): Vicki's roommate, ex-council member, runs Vicki's car wash, Bon's best friend. Bon and Vicki updated. Counts now 62.
- All tests pass (`python3 tests/test_profile_schema.py`, `node tests/test_*.js`, `python3 tests/test_links.py`).

## Scripts (done 2026-11-06)
- All 62 SCRIPT.js now generated from `tools/script_engine.js` (v14 base) + CARD fields + BIO section 7 relationships by `python3 tools/build_scripts.py`. Rebuild after ANY card/bio edit. Legacy hand-made entries are frozen in `tools/legacy_lore/*.json` (edit those to add custom topics).

## WIP: card rewrite to the Lucoa form (creator likes it)
Workflow: write `tools/card_data/batchNN_*.txt` (block format in `tools/card_rewrite.py` docstring; 48 fields incl. Summary), then `python3 tools/card_rewrite.py && python3 tools/build_scripts.py`, run tests, commit, push. `python3 tools/digest.py slug ...` prints a compact bio digest to write from.
Done so far (cards in new form): all Zentreya (vera, marisol, runa, roux, celeste, leona, kaia, aveline, nyx, liberty, seraphine), kara, techy, gluco, balaika, talatora, sukisekine, mirko, mirko-sibling, akumaskywalker, saint-diana, marieza-san, crimson-viper, bernadette, yamato, wonder-witch, victoria-vincent, gwen, yugo, vicki, dixie, luka, apollo, emelia, reagin, rosa, lucoa, palkia, bon (+council-beauty, kronii checked).
Still to do (cards): absolute-wonder-woman, apollyon, ashkaya, ayame, batu, dunkle, mellow, phoebe, power-girl, renata, she-hulk, shiraishi, suzana, xuerou, zesty, zuri, zirkala-tatanka, council-technology, council-innocence, besterta. Detect remaining with: grep -L "Cool-Down Pattern" characters/*/*/*/CARD.md
Then BIOs: bring to Lucoa form (sections 3/4/5/6/7/9 real, section 6 != section 1, section 8 specific): original-style bios (apollo, emelia, reagin, rosa, yugo, vicki, dixie, luka, ...) still have section 6 duplicating section 1 and boilerplate section 8.

## Not started
- Card cleanup: ~25 generator-made CARD.md files still have copy-pasted fields (internal conflict = summary, etc.).
- Section 6 == section 1 duplicates remain for apollo, besterta, emelia, reagin (verify).
- Trim bloated bios: wonder-witch, saint-diana, kronii, council-beauty/technology/innocence.
- Add `### Lore Threads` to bios that lack them.
- Zentreya "spicy" adult-themed pass (non-explicit): marisol, vera, seraphine, celeste, nyx, leona, liberty, etc.
- Possible new characters implied by art (need creator approval of names/details): Barghest (council member), Poison (fake cop/guard/dancer), her nightclub-dancer rival/lover, Zentreya racing mechanic.
- Sukisekine/TalaTora/third Zentreya group scene `_shared/scenes/muscle-bar.webp`.

## Creator answers (2026-11-06)
- 'Another dancer at the nightclub, lover and hater of Poison' = Juri Han. Poison = Poison (nightclub fake cop/guard/dancer). Barghest = council member image. Profiles for these three plus the Zentreya racing mechanic are NOT yet written; propose adult-world adaptations (original details, non-explicit) and get approval or just build them in the Lucoa form.

## Rules
Queen stays unnamed; no new council seats/laws/villains; romance non-explicit; no auto-spawned NPCs; never write {{user}}'s choices; anima >= 8'0".


## Update 2026-11-07
- DONE: ALL 62 CARD.md files are in the Lucoa form (batches 01-14 in tools/card_data). She-Hulk length fixed. Tests green.
- WIP / NEXT: BIO uniformity pass (real sections 3/4/5/6/7/9, section 6 != section 1, specific section 8, Lore Threads; trim bloated bios: wonder-witch, saint-diana, kronii, council x3; fix section-6 duplicates in apollo, besterta, emelia, reagin).
- NOT STARTED: profiles for art-implied characters (Poison, Juri Han, Barghest, Zentreya racing mechanic) - needs count updates 62->N and no new council seats.
- Workflow: edit tools/card_data/*.txt -> python3 tools/card_rewrite.py && python3 tools/build_scripts.py -> run tests -> commit/push.
