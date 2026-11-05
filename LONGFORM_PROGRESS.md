# Long-form character expansion — handoff checkpoint

**Branch:** `rendition-overhaul-2026-11-05` (private; never merge to main without creator approval).

## Creator-approved authoring sources
- The user's original **Character Card v4.txt** (retrieved from file library), not the shortened v4-inspired cards.
- The user's **Advanced Template v14_1.js** by Icehellionx (retrieved from file library), with conditional keyword/tag concepts but without demo entries, clocks, probability gates or memory counters.
- [Authoring contract](CHARACTER_AUTHORING_STANDARD.md) and [lean v14 engine](tools/ADVANCED_V14_LEAN_RUNTIME.js).

## Completed to the *new* long-form standard (9/61)
- [kronii](characters/pelagia/foreign-council/kronii/) — long card, extended biography, v14 conditional script
- [council-beauty](characters/pelagia/islanders/council-beauty/) — long card, extended biography, v14 conditional script
- [council-technology](characters/pelagia/islanders/council-technology/) — long card, extended biography, v14 conditional script
- [council-innocence](characters/pelagia/islanders/council-innocence/) — long card, extended biography, v14 conditional script
- [marisol-reyes](characters/pelagia/dragonblood/marisol-reyes/) — long card, extended biography, v14 conditional script
- [vera-callahan](characters/pelagia/dragonblood/vera-callahan/) — long card, extended biography, v14 conditional script
- [runa-valeska](characters/pelagia/dragonblood/runa-valeska/) — long card, extended biography, v14 conditional script
- [roux-caldera](characters/pelagia/dragonblood/roux-caldera/) — long card, extended biography, v14 conditional script
- [palkia](characters/manhattan/creator-collective/palkia/) — long card, extended biography, v14 conditional script

These nine have passed `node tests/test_longform.js` for all original v4 headers, at least 800 words/card, at least 2,000 words/bio, relevant lore activation, neutral-message non-injection and immediate boundary response. The CI workflow also runs the original 61-character integrity checks, script tests and link audit.

The original creator files remain in ChatGPT library, not committed verbatim into the repository. The official source template sections are described in CHARACTER_AUTHORING_STANDARD.md, and the authored card files implement them.

## Still awaiting *individual*, full-depth rewriting (52/61)
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
- [vicki](characters/manhattan/gym/vicki/)
- [victoria-vincent](characters/pelagia/diaspora/victoria-vincent/)
- [xuerou](characters/manhattan/gym/xuerou/)
- [yamato](characters/pelagia/islanders/yamato/)
- [yugo](characters/manhattan/gym/yugo/)
- [zesty](characters/manhattan/gym/zesty/)
- [zuri](characters/manhattan/gym/zuri/)
- [zirkala-tatanka](characters/anima/zirkala-tatanka/)
- [aveline-drakk](characters/pelagia/dragonblood/aveline-drakk/)
- [celeste-rojas](characters/pelagia/dragonblood/celeste-rojas/)
- [kaia-solenne](characters/pelagia/dragonblood/kaia-solenne/)
- [leona-aster](characters/pelagia/dragonblood/leona-aster/)
- [liberty-redford](characters/pelagia/dragonblood/liberty-redford/)
- [nyx-rielle](characters/pelagia/dragonblood/nyx-rielle/)
- [rowan-mercer](characters/pelagia/dragonblood/rowan-mercer/)
- [seraphine-ash](characters/pelagia/dragonblood/seraphine-ash/)
- [balaika](characters/families/kyouka/balaika/)
- [kara-supergirl](characters/families/kyouka/kara-supergirl/)
- [mirko](characters/families/mercedes/mirko/)
- [mirko-sibling](characters/families/mercedes/mirko-sibling/)
- [crimson-viper](characters/manhattan/associates/crimson-viper/)
- [techy](characters/manhattan/associates/techy/)
- [gluco-charin](characters/manhattan/associates/gluco-charin/)
- [akumaskywalker](characters/manhattan/creator-collective/akumaskywalker/)
- [bernadette](characters/worldwide/associates/bernadette/)
- [wonder-witch](characters/pelagia/islanders/wonder-witch/)
- [saint-diana](characters/pelagia/islanders/saint-diana/)
- [rosa](characters/manhattan/gym/rosa/)
- [besterta](characters/anima/besterta/)
- [bon](characters/worldwide/associates/bon/)
- [sukisekine](characters/worldwide/associates/sukisekine/)
- [talatora](characters/worldwide/associates/talatora/)
- [marieza-san](characters/manhattan/gym/marieza-san/)

These 52 profiles still have earlier cards/bios/scripts. Some already have useful characterization or the first depth-pass improvements, particularly the dragonblood cast and Balaika/Kara/Techy/Crimson Viper; **do not confuse prior partial improvements with the new 2,000-word-bio and creator-v4 completion standard**.

## Important preserved canon
- Council Member supersedes old Pelagian 'goddess' titles; Kronii is the foreign-born exception.
- The Zentreya dragon-descended lineage is different from Palkia's not-yet-named creator collective.
- Yugo loathes both cousins Mirko and Mirko's unnamed sister.
- Power Girl Karren and Supergirl Kara are separate. Saint Diana and Absolute Diana are separate.
- Runa/Roux are partners. Vera/Seraphine are nightclub partners with relationship type otherwise unspecified.
- Rosa supersedes Mudryk; Besterta supersedes Nandi. Gwen Stuard and Marieza-san are newer canonical names.
- Zentreya romance and adult impulses are character-specific, never a universal script that overrides careers or consent.
- Selected openings should not be overwritten; mentioned NPCs should not spawn; real-time/message gates are unwanted.

## Recommended continuing order
1. Remaining Pelagian and Mercedes family members, including Mirko and Mirko's unnamed sister, Wonder Witch, Saint Diana.
2. Remaining new associates, Bon, Sukisekine, TalaTora, Balaika, Kara, Techy, Gluco, Crimson Viper, Marieza, Bernadette, and Akumaskywalker.
3. Remaining original Zentreya cast, then Kyouka/Gym Gals, anima, diaspora and independent associates.
4. After *each* real profile rewrite, extend the completed map in `tests/test_longform.js`, run GitHub Actions and audit name/relationship consistency.

## Art import status
57 original images mapped to 58 WebP destinations are prepared separately; binaries are **not** pushed into the private GitHub branch yet. `ARTWORK_IMPORT.md` and included ZIP installer handle local import. This is independent of the long-form text-rewrite task.

## Work-in-progress caution
This is a committed, tested checkpoint, not completion of the requested all-61 literary overhaul. Never restart from scratch or claim the remaining 52 profiles were rewritten to the full-depth standard.
