# Rendition — Janitor AI character world

This private, creator-led fictional world has **66 character profiles** across 11 story-world groups. The active review branch is `rendition-overhaul-2026-11-05`; `main` remains untouched until the creator approves a merge.

## Find what you need

- [Character roster](CHARACTERS.md) · [machine-readable manifest](characters/manifest.json) · [character directory](characters/README.md)
- Canon: [World Bible](WORLD_BIBLE.md) · [Pelagia](PELAGIA_CANON.md) · [Zentreya dragonblood](ZENTREYA_CANON.md) · [Kyouka family](KYOUKA_FAMILY.md) · [Crossovers](CROSSOVER_CANON.md) · [Heights](HEIGHT_REFERENCE.md)
- Workflows: [Character authoring standard](CHARACTER_AUTHORING_STANDARD.md) · [Artwork import](ARTWORK_IMPORT.md)
 · [Stances](STANCES.md) · [Janitor setup](JANITOR_SETUP.md) · [Lite cards](JANITOR_SETUP.md#lite-cards)
## Current state and decisions

- **66/66 profiles:** each has `CARD.md` (15-section v4 playable persona), `BIO.md` (11-section long-form creator reference), and conditional-only `SCRIPT.js`. Earlier openings remain separate. The card is the roleplay prompt; the BIO is *not* pasted every turn.
- **Names:** the Beauty/Revelry and Technology Council Members are sisters **Zafira** and **Nahla Marenne**; the Inquisitor and Keeper of Oaths (formerly styled 'Innocence') is **Ilyana Rell**. Their names are editorial Rendition choices. The sisters' individual faces in the shared portrait are **not** assigned, Ilyana's portfolio is undecided, and Pelagia's incumbent queen is still unnamed.
- **Anima height retcon:** every established anima in the active roster stands at least **8′0″**. Zuri is **8′1″**, Zirkala Tatanka **8′2″**; see the canonical [height table](HEIGHT_REFERENCE.md). Unconfirmed animal-themed people are not automatically classified as anima.
- **Identity distinctions:** Rosa supersedes Mudryk; Besterta-san supersedes Nandi. Kara/Supergirl is not Karren/Power Girl. Saint Diana is not Absolute Diana. 'Zentreya' is an inherited dragon-descended lineage; `Zentreya Corp` is only a temporary working name for Palkia's unrelated creator collective. Mirko and her sister are Yugo's estranged cousins. Vera works in nightlife, not engineering.
- **Story continuity:** no time-counted relationship advances, automatic NPC arrivals, wholesale biography insertion, omniscient secrets, or forced decisions for `{{user}}`. Select **one** character script; council name updates changed lore strings only, not the injection engine.

## Artwork still pending

A separately prepared `rendition_artwork_final_import.zip` contains **57 source images mapped to 58 WebP destinations** (the council sisters' shared image maps to two folders). These WebPs are **not yet pushed to GitHub**. Follow [ARTWORK_IMPORT.md](ARTWORK_IMPORT.md) to import into the **overhaul branch only**. Aveline and Kaia lack confirmed new-pack individual art; some group-image faces are unassigned. Earlier verified reference JPGs remain. Do not mark art migration complete until the image test confirms the import.

## Verification and historical notes

GitHub Actions runs structure, v4 schema, script behavior, continuity, and Markdown link checks. Successful CI establishes structural consistency, **not** perfect creative characterization. Re-run validation after revisions; do not merge without approval.

The old update logs, duplicate formatting standards, and one-off correction notes were consolidated into this guide, the authoring standard, and the World Bible. Their original text remains recoverable in Git history; no character profile, opening, or reference picture was deleted by the documentation cleanup.

- [COUNCIL.md](COUNCIL.md): the Council of Seven Seats, portfolios, heights and procedure.
- [RELATIONSHIPS.md](RELATIONSHIPS.md): who connects to whom.
