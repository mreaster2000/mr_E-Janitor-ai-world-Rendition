# Handoff / progress log (branch `rendition-overhaul-2026-11-05`)

Updated: 2026-11-06. Read this first when resuming. Never merge to `main` without creator approval.

## Done
- Branch cleanup: removed ~22k words of boilerplate/duplicate sentences from all BIO files; fixed `{user}` -> `{{user}}`; placeholder Build text replaced.
- WORLD_BIBLE: 9 proposed shared lore threads (Tidewall Ledger, Lantern Line, Atelier Nocturne, Back Stairs, Advisory Weather, Costume Door, Ember Postcards, Skerry Table, Unedited Hour) + "Wash Bay" note.
- Real sections 3/6/8 authored for: ashkaya, ayame, batu, dunkle, mellow, suzana, xuerou, zesty, zirkala-tatanka (section 8 only); sections 8 + Lore Threads for balaika, kara-supergirl, mirko, mirko-sibling, crimson-viper, techy, gluco-charin, akumaskywalker, wonder-witch, bon, talatora, marieza-san. Palkia and bernadette rewritten by interrupted agents (quality NOT reviewed).
- Lucoa added (pelagia/diaspora/lucoa): Vicki's roommate, ex-council member, runs Vicki's car wash, Bon's best friend. Bon and Vicki updated. Counts now 62.
- All tests pass (`python3 tests/test_profile_schema.py`, `node tests/test_*.js`, `python3 tests/test_links.py`).

## WIP
- Artwork import of the creator's 4 image zips (64 images): see ART_IMPORT_STATUS below if present.

## Not started
- Card cleanup: ~25 generator-made CARD.md files still have copy-pasted fields (internal conflict = summary, etc.).
- Section 6 == section 1 duplicates remain for apollo, besterta, emelia, reagin (verify).
- Trim bloated bios: wonder-witch, saint-diana, kronii, council-beauty/technology/innocence.
- Add `### Lore Threads` to bios that lack them.
- Zentreya "spicy" adult-themed pass (non-explicit): marisol, vera, seraphine, celeste, nyx, leona, liberty, etc.
- Possible new characters implied by art (need creator approval of names/details): Barghest (council member), Poison (fake cop/guard/dancer), her nightclub-dancer rival/lover, Zentreya racing mechanic.
- Sukisekine/TalaTora/third Zentreya group scene `_shared/scenes/muscle-bar.webp`.

## Rules
Queen stays unnamed; no new council seats/laws/villains; romance non-explicit; no auto-spawned NPCs; never write {{user}}'s choices; anima >= 8'0".
