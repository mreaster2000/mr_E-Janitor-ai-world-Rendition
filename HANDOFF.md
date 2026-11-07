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
- All 66 SCRIPT.js now generated from `tools/script_engine.js` (v14 base) + CARD fields + BIO section 7 relationships by `python3 tools/build_scripts.py`. Rebuild after ANY card/bio edit. Legacy hand-made entries are frozen in `tools/legacy_lore/*.json` (edit those to add custom topics).

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
- Zentreya "spicy" adult-themed pass (now fully open): marisol, vera, seraphine, celeste, nyx, leona, liberty, etc.
- Possible new characters implied by art (need creator approval of names/details): Barghest (council member), Poison (fake cop/guard/dancer), her nightclub-dancer rival/lover, Zentreya racing mechanic.
- Sukisekine/TalaTora/third Zentreya group scene `_shared/scenes/muscle-bar.webp`.

## Creator answers (2026-11-06)
- 'Another dancer at the nightclub, lover and hater of Poison' = Juri Han. Poison = Poison (nightclub fake cop/guard/dancer). Barghest = council member image. Profiles for these three plus the Zentreya racing mechanic are NOT yet written; propose adult-world adaptations (original details; adult content open) and get approval or just build them in the Lucoa form.

## Rules
Queen stays unnamed; no new council seats/laws/villains; adult content open (per-character stance in tools/stance_data.py); no auto-spawned NPCs; never write {{user}}'s choices; anima >= 8'0".


## Update 2026-11-07
- DONE: ALL 62 CARD.md files are in the Lucoa form (batches 01-14 in tools/card_data). She-Hulk length fixed. Tests green.
- WIP / NEXT: BIO uniformity pass (real sections 3/4/5/6/7/9, section 6 != section 1, specific section 8, Lore Threads; trim bloated bios: wonder-witch, saint-diana, kronii, council x3; fix section-6 duplicates in apollo, besterta, emelia, reagin).
- NOT STARTED: profiles for art-implied characters (Poison, Juri Han, Barghest, Zentreya racing mechanic) - needs count updates 62->N and no new council seats.
- Workflow: edit tools/card_data/*.txt -> python3 tools/card_rewrite.py && python3 tools/build_scripts.py -> run tests -> commit/push.

## Update 2026-11-07 (BIO pass, part 1)
- New tool: tools/bio_rewrite.py applies tools/bio_data/*.txt (`@@ slug`, `S6:`/`S8:` blocks) to BIO sections. Note: some characters live at characters/<group>/<slug>/ (2 levels), use recursive glob.
- DONE: section 6/8 rewrites for dixie, luka, rosa, vicki, yugo, zuri, shiraishi, apollo, emelia, reagin, besterta, council-innocence, council-technology.
- WIP: thin section 8 in saint-diana, sukisekine, power-girl, renata; trim bloat in wonder-witch, saint-diana, kronii, council-beauty; Lore Threads for bios lacking them; then art-implied characters.

## Update 2026-11-07 (new roster)
- DONE: Ilyana Rell retitled Inquisitor and Keeper of Oaths (folder slug still council-innocence). Added poison, juri-han, greer-navarro (worldwide/associates; Greer is an ordinary human) and barghest (pelagia/islanders, Warden of Chains, 4th present-day council member). Total 66 characters; tests/docs/manifest/heights updated; concept art moved to each reference.webp (explicit originals kept per creator, text describes appearance non-explicitly).
- WIP: remaining BIO uniformity (Lore Threads for older bios; kronii/council-beauty/wonder-witch left long deliberately).

## Update 2026-11-07 (council + QC pass)
- DONE: COUNCIL.md (Council of Seven Seats, six active; Harvest Cup Seat vacant since Lucoa) linked from README/WORLD_BIBLE; seat lines in council BIO/CARD/scripts; heights assigned to all 21 previously unset characters (HEIGHT_REFERENCE.md); non-graphic "Adult life, desire and intimacy" sections added to the 10 Zentreya BIOs (not Kaia/Aveline, per canon).
- WIP: Lore Threads for older bios; optional adult-life sections for Poison/Juri/Barghest/Greer; deeper per-character new lore.

- 2026-11-07: ALL 66 BIOs now have '### Adult life, desire and intimacy (non-graphic)' (tools/adult_life.py + tools/bio_data/adult_life.txt; Zentreya ones are longer). Non-Zentreya entries are short and can be deepened.

- 2026-11-07 polish: removed unused scripts/engine.js, tools/ADVANCED_V14_LEAN_RUNTIME.js and extra_details/; OPENING.md now exists for all 66 (tools/openings.py + tools/opening_data.json keep BIO section 10 in sync); stale 'portrait pending' text fixed; generic dialogue replaced on 6 cards; RELATIONSHIPS.md generated by tools/relationship_map.py (12 characters show no links because section 7 names don't match other profiles).
- 2026-11-07 openings: every OPENING.md is now 350+ words (DONE, 66/66). Source blocks live in tools/opening_data/batch01-06*.md ("@@ slug | Title" then body); run `python3 tools/openings.py` to regenerate OPENING.md and sync BIO section 10. It reports "under 350 words: 0". Hooks include hit-list plots, heartfelt confessions and teasing flirtation, sensual and open to explicit play.
- Remaining optional work: 29 cards still say "Eyes: Not established"; non-Zentreya adult-life BIO sections could be deepened; older BIOs lack "Lore Threads"; RELATIONSHIPS.md has 12 unlinked characters.
- 2026-11-07 Kara retcon: Kara is Shiraishi's sidekick and partner in her adult paid-arrangement work and openly enjoys it (consensual, adult content open). Updated Kara BIO/CARD/opening/legacy lore, adult_life data and Shiraishi's link.
- 2026-11-07 Kyouka family pass: new KYOUKA_FAMILY.md (family tree, Balaika's missing years, sibling bonds, Kara's Karren-made non-radioactive kryptonite accessories with consent rules, open threads). Added 'Kyouka family threads' to Balaika, Dixie, Karren, Kara, Shiraishi and Luka BIOs; card fields and legacy lore updated. Father and Dixie's mother deliberately left unnamed for the creator.
- 2026-11-07 ADULT-CONTENT OPENING (supersedes earlier "non-explicit" notes): all non-explicit/fade-out rules removed. Every character is an adult; sexual content is open and follows {{user}}'s lead. Per-character stance lives in `tools/stance_data.py` (tier: attentive / forward / dominant / relentless; `DESIRE` profile; custom `BOUNDARY` lines for dominant and relentless characters). Pipeline: `python3 tools/stance_apply.py` (patches card_data and the 6 hand-written cards) -> `python3 tools/card_rewrite.py` -> `python3 tools/adult_life.py` (rewrites the BIO adult section) -> `python3 tools/build_scripts.py`. Scripts: attentive/forward characters respect a stop at once; dominant characters treat a first or playful refusal as part of the scene and stop after two serious refusals; relentless characters ignore in-fiction objections. Safeword/out-of-character stop (`HARD` keywords in build_scripts.py) halts every character. Keep the safeword floor.
- 2026-11-07 stance revision per creator: Mirko, Yamato, Poison, Roux Caldera and Renata -> relentless; Marisol, Celeste, Vera, Liberty, Emelia, Bernadette -> dominant (Zentreya exceptions: Rowan Mercer attentive, Kaia Solenne forward); Bon and Yugo -> forward. Renata's card still contains some consent-flavoured lines in older fields; review if desired.
- 2026-11-08: Rowan Mercer -> dominant (Kaia Solenne the cyborg and Aveline the general are the two Zentreya exceptions: Kaia forward, Aveline dominant). Removed consent-flavoured contradictions from dominant/relentless BIO/CARD/openings. Added STANCES.md (generated by tools/stance_report.py) and JANITOR_SETUP.md. Remaining optional: 29 cards 'Eyes: Not established', RELATIONSHIPS.md unlinked characters, older BIOs lack Lore Threads.
