# Long-form character overhaul — verified checkpoint

**Branch:** `rendition-overhaul-2026-11-05`. **Repository:** `mreaster2000/mr_E-Janitor-ai-world-Rendition`. Do not merge to `main` without creator approval.

## Completed to original creator Card v4 standard (36/61)

- [kronii](characters/pelagia/foreign-council/kronii/)
- [council-beauty](characters/pelagia/islanders/council-beauty/)
- [council-technology](characters/pelagia/islanders/council-technology/)
- [council-innocence](characters/pelagia/islanders/council-innocence/)
- [marisol-reyes](characters/pelagia/dragonblood/marisol-reyes/)
- [vera-callahan](characters/pelagia/dragonblood/vera-callahan/)
- [runa-valeska](characters/pelagia/dragonblood/runa-valeska/)
- [roux-caldera](characters/pelagia/dragonblood/roux-caldera/)
- [palkia](characters/manhattan/creator-collective/palkia/)
- [aveline-drakk](characters/pelagia/dragonblood/aveline-drakk/)
- [celeste-rojas](characters/pelagia/dragonblood/celeste-rojas/)
- [kaia-solenne](characters/pelagia/dragonblood/kaia-solenne/)
- [leona-aster](characters/pelagia/dragonblood/leona-aster/)
- [liberty-redford](characters/pelagia/dragonblood/liberty-redford/)
- [nyx-rielle](characters/pelagia/dragonblood/nyx-rielle/)
- [rowan-mercer](characters/pelagia/dragonblood/rowan-mercer/)
- [seraphine-ash](characters/pelagia/dragonblood/seraphine-ash/)
- [mirko](characters/families/mercedes/mirko/)
- [mirko-sibling](characters/families/mercedes/mirko-sibling/)
- [wonder-witch](characters/pelagia/islanders/wonder-witch/)
- [saint-diana](characters/pelagia/islanders/saint-diana/)
- [bernadette](characters/worldwide/associates/bernadette/)
- [akumaskywalker](characters/manhattan/creator-collective/akumaskywalker/)
- [bon](characters/worldwide/associates/bon/)
- [sukisekine](characters/worldwide/associates/sukisekine/)
- [talatora](characters/worldwide/associates/talatora/)
- [balaika](characters/families/kyouka/balaika/)
- [kara-supergirl](characters/families/kyouka/kara-supergirl/)
- [techy](characters/manhattan/associates/techy/)
- [gluco-charin](characters/manhattan/associates/gluco-charin/)
- [crimson-viper](characters/manhattan/associates/crimson-viper/)
- [marieza-san](characters/manhattan/gym/marieza-san/)
- [rosa](characters/manhattan/gym/rosa/)
- [besterta](characters/anima/besterta/)
- [vicki](characters/manhattan/gym/vicki/)
- [yugo](characters/manhattan/gym/yugo/)

Every entry above has all 14 Card v4 headings, an 800+-word playable card, a 2,000+-word creator-facing biography and a conditional script tested with a relevant keyword, neutral message and explicit boundary. The tests are in [tests/test_longform.js](tests/test_longform.js); the design contract is [CHARACTER_AUTHORING_STANDARD.md](CHARACTER_AUTHORING_STANDARD.md). Original creator-supplied files are recovered in the user's file library; the source templates are not pasted wholesale into the repo.

## Not yet fully rewritten to the new depth standard (25/61)

- [absolute-wonder-woman](characters/pelagia/islanders/absolute-wonder-woman/)
- [apollo](characters/worldwide/associates/apollo/)
- [apollyon](characters/pelagia/islanders/apollyon/)
- [ashkaya](characters/anima/ashkaya/)
- [ayame](characters/pelagia/diaspora/ayame/)
- [batu](characters/anima/batu/)
- [dixie](characters/families/kyouka/dixie/)
- [dunkle](characters/anima/dunkle/)
- [emelia](characters/worldwide/associates/emelia/)
- [gwen](characters/manhattan/associates/gwen/)
- [luka](characters/manhattan/gym/luka/)
- [mellow](characters/manhattan/associates/mellow/)
- [phoebe](characters/pelagia/islanders/phoebe/)
- [power-girl](characters/families/kyouka/power-girl/)
- [reagin](characters/worldwide/associates/reagin/)
- [renata](characters/pelagia/diaspora/renata/)
- [she-hulk](characters/manhattan/associates/she-hulk/)
- [shiraishi](characters/families/kyouka/shiraishi/)
- [suzana](characters/pelagia/islanders/suzana/)
- [victoria-vincent](characters/pelagia/diaspora/victoria-vincent/)
- [xuerou](characters/manhattan/gym/xuerou/)
- [yamato](characters/pelagia/islanders/yamato/)
- [zesty](characters/manhattan/gym/zesty/)
- [zuri](characters/manhattan/gym/zuri/)
- [zirkala-tatanka](characters/anima/zirkala-tatanka/)

**Next action:** Individually expand these 25 remaining characters. Read each existing BIO.md, CARD.md, SCRIPT.js first, preserve old details and confirmed relationships. Add substantial distinctive professional/family experiences and ordinary-life behavior, then original Card v4 sections and character-specific conditional lore. Each finished character must be added to the `completed` map in `tests/test_longform.js`, with a real topic word. Avoid generic repetition, false face assignments and forced romance/time triggers.

## Recent substantive changes
- Rosa now has separate band, tattoo and gym mural arcs, with retained original rules and three targeted cues. Rosa supersedes the old Mudryk name.
- Besterta-san is 8′5″ to the head / 8′8″ including horns, not the superseded 7-foot estimates. Her Nguni herd, family and cooperative are central.
- Vicki is witty and genuinely playful, Yugo's longtime equal friend, not civilian Captain Reagin.
- Yugo retains the divorce, atelier leadership, Vicki partnership and dislike for both Mirko cousins. Her Yamato couture relationship does not grant Pelagian political knowledge.
- Crimson Viper and Marieza-san have passed the long-form depth target, and their entries were added to the tests.
- No selected openings were overwritten, and `main` was not merged.

## Outstanding art
The prepared artwork installer/ZIP described in [ARTWORK_IMPORT.md](ARTWORK_IMPORT.md) remains a separate unfinished import step; binary art has not yet been pushed into character folders. Text completion does not imply image completion.

## Canon constraints
Palkia's creator collective is not the Zentreya lineage. Runa and Roux are partners. Vera and Seraphine work together in nightlife. Saint Diana and Absolute Diana are different. Karren/Power Girl and Kara/Supergirl are different. The Pelagian 'goddess' epithets are historical council titles. Offscreen references cannot summon characters. No time gates, relationship counters or omniscient knowledge.

## Quality-check state
GitHub Actions `Validate Rendition` and `Link integrity` have passed on the preceding long-form commits. Recheck both for the final checkpoint SHA before considering this section closed.
