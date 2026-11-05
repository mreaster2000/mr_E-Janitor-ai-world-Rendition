# Rendition — Janitor AI character world

Independent fictional character/lore repository; the original source project remains unchanged.

## Current published state

**41 character profiles** across eight browsing groups. Browse the [roster](CHARACTERS.md), [directory](characters/README.md), and [manifest](characters/manifest.json). A larger overhaul prepared in an interrupted chat is **not yet present on GitHub**, and should not be confused with this published version.

Each canonical folder has `CARD.md`, `BIO.md`, `SCRIPT.js` and `config.json`; first messages are preserved where supplied. Optional expanded alternatives live alongside the originals as `*_EXTRA_DETAILS.*`. Use **one** script edition at a time; the original and expanded variants must not both run. See [the expanded-edition guide](EXTRA_DETAILS_README.md).

## Lore

Canonical references: [World](WORLD_BIBLE.md), [Pelagia](PELAGIA_CANON.md), [Zentreya](ZENTREYA_CANON.md), [Crossovers](CROSSOVER_CANON.md), [Heights](HEIGHT_REFERENCE.md) and [41-character Word bible](Rendition_Character_Bible_41_Reconstructed.docx). The superseded interim Word bible is in `archive/`.

Pelagia is a multicultural women-only nation with tightly controlled trade and a diaspora, not a Greek-worship society. Absolute Diana is the **heir**, Phœbe a councilor, and Apollyon the military commander. Marisol owns the media operation and uses the green water-gun artwork. Vera is the pink-lipstick full-time nightclub performer, **not an engineer**. Dunkle is Scandinavian; her exact coastal hometown is unspecified. Names mentioned in lore do not automatically appear in scenes.

## Use and verification

Paste the Personality section of a character's `CARD.md` and its single `SCRIPT.js` into Janitor AI; use that character's existing opening separately. For a richer alternative, use `CARD_EXTRA_DETAILS.md` and `SCRIPT_EXTRA_DETAILS.js`, retaining the current First Message. No script should create automatic NPC arrivals or clock-triggered events.

Run `node tests/test_scripts.js`, `node tests/test_extra_details.js`, `node tests/test_zentreya.js`, `node tests/test_crossover.js` and `node tests/test_vicki_yugo.js` locally. Script tests cannot guarantee live Janitor AI token counts.

Artwork is only partially published: seven confirmed earlier-cast references and thirteen Zentreya source images with character aliases; the other character art from the proposed 61-profile overhaul has not been verified in GitHub. See [art inventory](ARTWORK_STATUS.md), [source images](incoming/zentreya/README.md) and [provisional mappings](ZENTREYA_ART_MAPPING.md).

Earlier folder locations: [migration table](MIGRATION.md).
