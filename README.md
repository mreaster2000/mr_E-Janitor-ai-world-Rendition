# Janitor AI — Character Framework & Character Bible (rebuilt)

A complete **29-character** starter repository for the Kyouka Family / Gym Gals world. The original source repository remains untouched. This is the **independent Rendition repository**, published separately from the original source.

## Per character

- `characters/<group>/<slug>/CARD.md`: compact Personality field; original first messages are left as authored.
- `characters/<group>/<slug>/BIO.md`: creator-facing, expanded prose biography and relationships; **do not paste the full bio into the card**.
- `characters/<group>/<slug>/SCRIPT.js`: complete, copy-pasteable, self-contained Advanced Script.
- `characters/<group>/<slug>/config.json`: authorable details and selective lore entries.

All scripts share an ES5-compatible, deterministic, no-memory, no-clock runtime derived from the design principles of Advanced Template v14 rather than being an exact port of v14. They can choose up to three relevant entries, with a global optional-text size budget; detailed unused lore is not included in the model prompt. References do not auto-spawn NPCs. Neither script source length nor comments count as prompt tokens merely by existing in Janitor AI.

## Quick start

1. Create a Janitor AI test character and choose its name.
2. Copy only the **Personality** paragraph from `CARD.md` into the Personality field; leave Scenario and Example Dialogues empty unless needed.
3. Copy all of that character’s `SCRIPT.js` into a single Advanced Script.
4. Disable legacy mood, lore and memory scripts so no duplicate injections occur.
5. Optionally use `based initial <slug>.md` from the character's folder as a dating-themed starter, or write your own. Start a fresh chat and compare input tokens.

## Canon changes

Dunkle is **Scandinavian**, not Japanese, and lives on an unspecified Scandinavian coast. This overrides the source-repo Dunkle bio and old World references. Country, island and birthplace remain undecided.

## Important provenance note

The source repository’s `Kyouka Family & Gym Gals — Character Bible.docx` could not be fetched as binary through the available GitHub file reader. Accordingly, `CHARACTER_BIBLE_REBUILT.docx` is a **newly assembled canon reference** based on the accessible character bios and world description, not a claim to have edited the original DOCX in place. The project includes a text world bible and expanded character biographies. Facts that were open in the source remain open here.

## Repository status

This project is published at [mr_E-Janitor-ai-world-Rendition](https://github.com/mreaster2000/mr_E-Janitor-ai-world-Rendition). The original project remains unchanged.

First messages are optional and written separately by the creator. Reagin has a user-requested hospital opening in her folder; Vicki has an arcade-date opening in `characters/gym-gals/vicki/FIRST_MESSAGE.md`. New crossover cards intentionally leave First Message blank.

## Tests

From the repository root run `node tests/test_scripts.js` to simulate character injections, validate boundaries, and ensure every script loads without a syntax error. Local simulations do not substitute for Janitor AI’s runtime and actual model-token counts.

## Recent cast additions

Power Girl (adopted Kyouka family), She-Hulk (outside attorney and gym associate), and Absolute Wonder Woman (Pelagia's next ruler) have dedicated cards, bios, and paste-ready scripts. See `WORLD_BIBLE.md` and `CROSSOVER_CANON.md`. The two Dianas remain distinct.

## Characterization adjustment

Vicki's public and script personalities have been rebalanced toward warm, witty, playful competence, distinctly different from military-minded Reagin. Yugo is now **35**, Vicki **34**; they are longtime best friends who enjoy teasing one another. The original character Bible DOCX predates this correction, so use the Markdown bios and World Bible as current canon until that DOCX is regenerated.

## Six-character expansion

New cards/bios/scripts/configs: `gwen`, `phoebe`, `apollyon`, `renata`, `victoria-vincent`, `yamato`. Their image references are creator-provided and should stay with their individual folders. See `WORLD_BIBLE.md` for Pelagia's magical but non-worship-based civic government.

## Categorized structure

The roster is now organized into six primary groups under `characters/`: `gym-gals`, `kyouka-family`, `pelagia`, `pelagian-diaspora`, `new-york-associates` and `beyond-the-gym`. See [the grouped roster](CHARACTERS.md), [directory index](characters/README.md) and machine-readable [manifest](characters/manifest.json).

Older flat `characters/<slug>/...` links have been moved. Use [the migration map](MIGRATION.md) for old-to-new paths. Tests use the manifest to resolve character locations.

## Current canon sources

`WORLD_BIBLE.md` and `CROSSOVER_CANON.md` are kept current with the 28-character roster, including Yamato's couture commissions through Yugo. The older `CHARACTER_BIBLE_REBUILT.docx` predates these additions and should be treated as a historical snapshot until replaced; the Markdown files are authoritative.

## Character card consistency

All 28 cards have been rewritten with more consistent descriptive depth, distinct dialogue styles and explicit heights. See [HEIGHT_REFERENCE.md](HEIGHT_REFERENCE.md) for the canonical measurements. The older bios may retain outdated approximate phrasing, so the new card and height reference take precedence. Advanced Scripts and First Messages were not changed during this pass.


## Biography standard and date starters

The full roster now has 29 creator-facing BIO.md files standardized into ten sections: overview, identity, appearance, personality, daily life, motivations, relationships, secrets, boundaries, and art/starter references. Every character has a separate `based initial <slug>.md` dating-themed opening; older openings remain untouched. The Native American bison-anima Zirkala Tatanka is the newest addition. Note: character images discussed in chat are **not** in this repo until their binary image files are uploaded; see the artwork inventory.

## November 4 recovery: Pelagia and Zentreya

The expanded women-only, culturally diverse Pelagia setting, centuries of limited trade, diaspora and unequal technological development are documented in [PELAGIA_CANON.md](PELAGIA_CANON.md). Five Pelagian and three diaspora bios include added continuity notes. The prior 29 characters' cards and openings are preserved; the test suite's erroneous 28-character assertion was corrected to 29.

Seven verified creator-provided artworks have been placed into their matching character directories. Another thirteen creator-provided art files from the unfinished Zentreya expansion are preserved as optimized copies in [incoming/zentreya/](incoming/zentreya/) pending the exact twelve-character mapping. The interrupted 41-character Word document and twelve new profiles were not committed and must not be claimed as finished. The historical `CHARACTER_BIBLE_REBUILT.docx` still predates the new material.
