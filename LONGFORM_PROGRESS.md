# Long-form character overhaul — final text checkpoint (2026-11-05)

**Working branch:** `rendition-overhaul-2026-11-05` · **Main branch:** unchanged; merge only after creator approval.

## Status: 61 / 61 completed and CI-tested

The 61 roster entries now each have a full `CARD.md`, author-facing `BIO.md`, and standalone `SCRIPT.js` tested by `tests/test_longform.js`.

The regression suite verifies every file has the required Character Card v4 headings, a card of at least 800 words, a creator-facing biography of at least 2,000 words, a neutral-message no-injection case, a topic-specific trigger, and a respected boundary cue. `tests/test_scripts.js` validates basic operation for all 61 scripts; GitHub Actions additionally checks link integrity.

**Important distinction:** passing structural and runtime checks does not prove literary perfection or certify all original creator lore; newly invented personal incidents are editorial Rendition extensions rather than recovered lost messages. Preserve source canon when adjusting them.

## Completed characters

- [x] [absolute-wonder-woman](characters/pelagia/islanders/absolute-wonder-woman/)
- [x] [apollo](characters/worldwide/associates/apollo/)
- [x] [apollyon](characters/pelagia/islanders/apollyon/)
- [x] [ashkaya](characters/anima/ashkaya/)
- [x] [ayame](characters/pelagia/diaspora/ayame/)
- [x] [batu](characters/anima/batu/)
- [x] [dixie](characters/families/kyouka/dixie/)
- [x] [dunkle](characters/anima/dunkle/)
- [x] [emelia](characters/worldwide/associates/emelia/)
- [x] [gwen](characters/manhattan/associates/gwen/)
- [x] [luka](characters/manhattan/gym/luka/)
- [x] [mellow](characters/manhattan/associates/mellow/)
- [x] [phoebe](characters/pelagia/islanders/phoebe/)
- [x] [power-girl](characters/families/kyouka/power-girl/)
- [x] [reagin](characters/worldwide/associates/reagin/)
- [x] [renata](characters/pelagia/diaspora/renata/)
- [x] [she-hulk](characters/manhattan/associates/she-hulk/)
- [x] [shiraishi](characters/families/kyouka/shiraishi/)
- [x] [suzana](characters/pelagia/islanders/suzana/)
- [x] [vicki](characters/manhattan/gym/vicki/)
- [x] [victoria-vincent](characters/pelagia/diaspora/victoria-vincent/)
- [x] [xuerou](characters/manhattan/gym/xuerou/)
- [x] [yamato](characters/pelagia/islanders/yamato/)
- [x] [yugo](characters/manhattan/gym/yugo/)
- [x] [zesty](characters/manhattan/gym/zesty/)
- [x] [zuri](characters/manhattan/gym/zuri/)
- [x] [zirkala-tatanka](characters/anima/zirkala-tatanka/)
- [x] [aveline-drakk](characters/pelagia/dragonblood/aveline-drakk/)
- [x] [celeste-rojas](characters/pelagia/dragonblood/celeste-rojas/)
- [x] [kaia-solenne](characters/pelagia/dragonblood/kaia-solenne/)
- [x] [leona-aster](characters/pelagia/dragonblood/leona-aster/)
- [x] [liberty-redford](characters/pelagia/dragonblood/liberty-redford/)
- [x] [marisol-reyes](characters/pelagia/dragonblood/marisol-reyes/)
- [x] [nyx-rielle](characters/pelagia/dragonblood/nyx-rielle/)
- [x] [roux-caldera](characters/pelagia/dragonblood/roux-caldera/)
- [x] [rowan-mercer](characters/pelagia/dragonblood/rowan-mercer/)
- [x] [runa-valeska](characters/pelagia/dragonblood/runa-valeska/)
- [x] [seraphine-ash](characters/pelagia/dragonblood/seraphine-ash/)
- [x] [vera-callahan](characters/pelagia/dragonblood/vera-callahan/)
- [x] [balaika](characters/families/kyouka/balaika/)
- [x] [kara-supergirl](characters/families/kyouka/kara-supergirl/)
- [x] [mirko](characters/families/mercedes/mirko/)
- [x] [mirko-sibling](characters/families/mercedes/mirko-sibling/)
- [x] [crimson-viper](characters/manhattan/associates/crimson-viper/)
- [x] [techy](characters/manhattan/associates/techy/)
- [x] [gluco-charin](characters/manhattan/associates/gluco-charin/)
- [x] [palkia](characters/manhattan/creator-collective/palkia/)
- [x] [akumaskywalker](characters/manhattan/creator-collective/akumaskywalker/)
- [x] [bernadette](characters/worldwide/associates/bernadette/)
- [x] [kronii](characters/pelagia/foreign-council/kronii/)
- [x] [council-beauty](characters/pelagia/islanders/council-beauty/)
- [x] [council-technology](characters/pelagia/islanders/council-technology/)
- [x] [council-innocence](characters/pelagia/islanders/council-innocence/)
- [x] [wonder-witch](characters/pelagia/islanders/wonder-witch/)
- [x] [saint-diana](characters/pelagia/islanders/saint-diana/)
- [x] [rosa](characters/manhattan/gym/rosa/)
- [x] [besterta](characters/anima/besterta/)
- [x] [bon](characters/worldwide/associates/bon/)
- [x] [sukisekine](characters/worldwide/associates/sukisekine/)
- [x] [talatora](characters/worldwide/associates/talatora/)
- [x] [marieza-san](characters/manhattan/gym/marieza-san/)

## Updated canon and behavior constraints
- Rosa supersedes Mudryk; Besterta-san supersedes Nandi. Cross-references in active bios and most cards/scripts have been updated. Rename notices may still explicitly mention old names to explain history.
- Vicki and Yugo remain playful longtime friends, not interchangeable administrators.
- Karren/Power Girl is distinct from Kara/Supergirl; Saint Diana is distinct from Absolute Diana.
- Pelagian goddess names are historical titles of contemporary council members (except foreign-born Kronii). Their powers do not grant universal political authority.
- Palkia's creator collective remains separate from the Zentreya dragonblood lineage, with its name still provisional.
- Both Mirko cousins are related to Yugo and she genuinely dislikes them.
- A mention of another character cannot summon them or reveal offscreen secrets.
- The lean v14 approach uses targeted conditional lore, no clocks, forced romance progress, always-on biography insertion or NPC arrivals.

## Artwork: prepared, not yet pushed

The separate `rendition_artwork_final_import.zip` has been inspected in the working session. It contains **58 WebP destinations derived from 57 source PNGs**, a source-to-destination manifest and a Windows installer. The shared Beauty/Technology council portrait intentionally appears in two folders. Aveline Drakk and Kaia Solenne lack clearly attributed new images, so their existing GitHub references should remain until confirmation.

**Do not mark the artwork step complete.** The text-based GitHub connector cannot directly ingest that local 37 MB archive. See [ARTWORK_IMPORT.md](ARTWORK_IMPORT.md) for safe Windows import and a branch-only push. Confirm the actual image commit and run `python tests/test_artwork.py` afterwards.

## Verification

The last pre-checkpoint GitHub Actions runs for branch commit `8307def3903876e9efd4fffec8cfbc0e3d592c36` succeeded for both **Validate Rendition** and **Link integrity** after canonical name cleanup. Re-run and verify on any later checkpoint or artwork commit.

## Next steps / remaining work
1. Import and push the 58 mapped WebP files from the already prepared ZIP on **this branch only**.
2. Review missing or composite images, particularly Aveline Drakk, Kaia Solenne, and the shared council sisters.
3. Creator review of character-specific inventions, then optionally open a pull request; never merge to main without approval.

No additional character needs a structural long-form rewrite according to the enforced 61-character gate.
