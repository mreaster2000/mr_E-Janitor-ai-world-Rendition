# Janitor AI — Character Framework & Character Bible (rebuilt)

A complete **22-character** starter repository for the Kyouka Family / Gym Gals world. The original source repository remains untouched. This is the **independent Rendition repository**, published separately from the original source.

## Per character

- `characters/<slug>/CARD.md`: slightly richer but compact Personality field; no first message.
- `characters/<slug>/BIO.md`: creator-facing, expanded prose biography and relationships; **do not paste the full bio into the card**.
- `characters/<slug>/SCRIPT.js`: complete, copy-pasteable, self-contained Advanced Script.
- `characters/<slug>/config.json`: authorable details and selective lore entries.

All scripts share an ES5-compatible, deterministic, no-memory, no-clock runtime derived from the design principles of Advanced Template v14 rather than being an exact port of v14. They can choose up to three relevant entries, with a global optional-text size budget; detailed unused lore is not included in the model prompt. References do not auto-spawn NPCs. Neither script source length nor comments count as prompt tokens merely by existing in Janitor AI.

## Quick start

1. Create a Janitor AI test character and choose its name.
2. Copy only the **Personality** paragraph from `CARD.md` into the Personality field; leave Scenario and Example Dialogues empty unless needed.
3. Copy all of that character’s `SCRIPT.js` into a single Advanced Script.
4. Disable legacy mood, lore and memory scripts so no duplicate injections occur.
5. Write your own First Message (intentionally omitted). Start a fresh chat, then inspect input tokens and script debug results.

## Canon changes

Dunkle is **Scandinavian**, not Japanese, and lives on an unspecified Scandinavian coast. This overrides the source-repo Dunkle bio and old World references. Country, island and birthplace remain undecided.

## Important provenance note

The source repository’s `Kyouka Family & Gym Gals — Character Bible.docx` could not be fetched as binary through the available GitHub file reader. Accordingly, `CHARACTER_BIBLE_REBUILT.docx` is a **newly assembled canon reference** based on the accessible character bios and world description, not a claim to have edited the original DOCX in place. The project includes a text world bible and expanded character biographies. Facts that were open in the source remain open here.

## Repository status

This project is published at [mr_E-Janitor-ai-world-Rendition](https://github.com/mreaster2000/mr_E-Janitor-ai-world-Rendition). The original project remains unchanged.

First messages are optional and written separately by the creator. Reagin has a user-requested hospital opening in her folder; Vicki has a playful arcade-date opening in `characters/vicki/FIRST_MESSAGE.md`. New crossover cards intentionally leave First Message blank.

## Tests

From this folder run `node tests/test_scripts.js` to simulate character injections, validate boundaries, and ensure every script loads without a syntax error. Local simulations do not substitute for Janitor AI’s runtime and actual model-token counts.

## Recent cast additions

Power Girl (adopted Kyouka family), She-Hulk (outside attorney and gym associate), and Absolute Wonder Woman (Pelagia's next ruler) have dedicated cards, bios, and paste-ready scripts. See `WORLD_BIBLE.md` and `CROSSOVER_CANON.md`. The two Dianas remain distinct.

## Characterization adjustment

Vicki's public and script personalities have been rebalanced toward warm, witty, playful competence, distinctly different from military-minded Reagin. Yugo is now **35**, Vicki **34**; they are longtime best friends who enjoy teasing one another. The original character Bible DOCX predates this correction, so use the Markdown bios and World Bible as current canon until that DOCX is regenerated.
