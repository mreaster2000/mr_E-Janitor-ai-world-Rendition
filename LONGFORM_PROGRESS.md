# Long-form character review — live checkpoint

**Private branch:** `rendition-overhaul-2026-11-05`. Main is unchanged.

## Completed under the actual creator Card v4 and Advanced Lore v14 specification — 17/61

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

All 17 have complete `CARD.md` using all 14 original v4 sections, 800+ word card, 2000+ word creator-facing `BIO.md`, and standalone bounded conditional v14-style `SCRIPT.js`. The original Zentreya lore triggers were retained alongside new character-specific triggers. The `tests/test_longform.js` regression suite verifies heading presence, lengths, neutral non-injection, topic activation and immediate boundary response. GitHub Actions validation and links were green at commit `2723a09852987b741d1714045c9fb26e034da7a8`.

The cards and bios are original Rendition creative expansions written on top of creator source. Added incidents are fictional narrative material, not historical claims. The source files `Character Card v4.txt` and `Advanced Template v14_1.js` were recovered from the user's file library, and their functional requirements are recorded in [CHARACTER_AUTHORING_STANDARD.md](CHARACTER_AUTHORING_STANDARD.md).

## Still need creator-standard long-form overhaul — 44/61

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

These 44 profiles still have their pre-long-form cards/bios/scripts (some had earlier partial improvements). They remain intact and structurally valid; **do not represent them as rewritten**. Continue exact same editing pattern: verify existing BIO/CARD/SCRIPT and canon, invent substantial character-specific incidents, write v4 card and 2k+ BIO, merge existing script cues plus new relevant ones, add the character to `tests/test_longform.js`, and verify CI. Don't drop source details or overwrite the opening.

## Priority next
Mercedes cousins (Mirko and unnamed sister), Wonder Witch and Saint Diana, new associates (Balaika, Kara, Techy, Gluco, Crimson Viper, Bernadette, Akumaskywalker, Bon, Sukisekine, TalaTora, Marieza-san), then all remaining original cast including gym, Kyouka, anima, diaspora and Pelagian islanders.

## Other unfinished scope
Artwork package holds 57 distinct source images mapped to 58 WebP destinations. They are verified in the ZIP but not yet pushed as GitHub binaries. `ARTWORK_IMPORT.md` gives local installer steps. No merge to main until author approval.
