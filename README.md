# Rendition — Janitor AI character world

A creator-led roleplay world with **61 character profiles**, indexed by story-world groups. Work continues safely on branch `rendition-overhaul-2026-11-05`; the original `main` remains unchanged and preserves all earlier exports.

## Browse
- [Character roster](CHARACTERS.md) and [machine-readable manifest](characters/manifest.json)
- [World bible](WORLD_BIBLE.md), [Pelagia](PELAGIA_CANON.md), [Zentreya lineage](ZENTREYA_CANON.md), [crossovers](CROSSOVER_CANON.md), [heights](HEIGHT_REFERENCE.md)
- [Creator overrides](CANON_OVERRIDES_2026-11-05.md) and [overhaul checkpoint](OVERHAUL_CHECKPOINT.md)
- [Artwork import guide](ARTWORK_IMPORT.md)

Each character has one `CARD.md`, `BIO.md`, and `SCRIPT.js` in their canonical folder. Existing openings are preserved as `OPENING.md` or `OPENING_ALT.md`. New cast additions do not necessarily have a written opening.

**Prompt strategy:** Paste a character card's useful identity/personality content into Janitor AI, not the entire creator-facing biography. The advanced script supplies situational lore only; it does not repeatedly append the character's basic persona, spawn NPCs, or trigger clock events.

**Current status (2026-11-05):** **61/61 long-form profiles complete and validated**; creator art ZIP is prepared but its 58 mapped WebP files have **not yet been pushed**. See [long-form completion checkpoint](LONGFORM_PROGRESS.md). The work remains on the isolated overhaul branch; `main` is untouched.


**Unified profile format:** Every character now uses the same [11-section BIO and 15-section Card v4 standard](UNIFIED_PROFILE_STANDARD.md), with appearance dimensions, hair, eyes, clothing and anatomy recorded directly or explicitly left unconfirmed. The new [profile schema test](tests/test_profile_schema.py) checks all 61. The creator-facing BIO holds extended lore; only the Card belongs in the roleplay prompt. No `SCRIPT.js` was altered during this formatting pass.

**Quality checks:** GitHub Actions runs the 61-profile structural tests, script syntax/execution checks and continuity tests. A separate Markdown link audit has passed with zero broken relative links. These are technical checks, not proof of final literary consistency or live Janitor AI token usage.

**Artwork status:** 57 images are optimized and mapped in a separate import-ready ZIP, but the pictures have **not** yet been pushed to this branch. Existing GitHub reference JPGs have been preserved. See [import guide](ARTWORK_IMPORT.md).

The branch is a reviewable overhaul, not merged to main.

## Final art handoff

The final verified 57-source, 58-destination artwork package is supplied in the conversation as `rendition_artwork_final_import.zip`. It includes a Windows installer and source-filename lore manifest. Follow [ARTWORK_IMPORT.md](ARTWORK_IMPORT.md) to push it into the **overhaul branch**, not `main`. Repository tests verify text and links; image verification becomes active once `ARTWORK_IMPORT_MANIFEST.json` has been imported.
