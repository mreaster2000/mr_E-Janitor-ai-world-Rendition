# Rendition overhaul — durable checkpoint (November 5, 2026)

**Branch:** `rendition-overhaul-2026-11-05`
**Base main commit:** `a7c00029309b20d7d3429310f1633b54b6141cb7`. Keep main untouched until final creator approval.

## Completed in this chat
1. **Cleanup:** Inventoried 443 starting files, removed 227 redundant or legacy artifacts, and relocated 186 files to a coherent story-world grouping. All old commits remain recoverable.
2. **Roster:** Expanded from 41 existing profiles to **61** with 20 artwork-derived additions. New characters are in their own distinct folders; source-supported details are kept separate from editorial reconstruction.
3. **Names and canon:** Canonical folder renames **Mudryk → Rosa** and **Nandi → Besterta-san**, preserving older recorded height/age. Emèlia portrait redesigned. Runa/Roux partnership and Seraphine/Vera nightclub partnership recorded. Distinct Kara/Karren and Saint Diana/Absolute Diana. 
4. **Retcons:** All goddess-titled figures except Kronii are Pelagian by birth. The contemporary title is **Council Member**, old goddess titles are historical. `Zentreya Corp` remains a temporary label for a creator collective, distinct from the dragon-descended people. Mirko and her unnamed sister are Yugo's cousins and she loathes them.
5. **Cards:** Standardized the 41 inherited character cards using a compact v4-inspired structure without discarding their prior personality descriptions. The 20 new characters also have cards.
6. **Bios:** Strengthened 29 older biographies, preserving creator history while adding strengths, weaknesses, fears, goals and emotional nuances. Detailed bios are creator-facing and not added to every prompt.
7. **Scripts:** Converted all 41 legacy scripts to conditional-only lore: no repeated permanent persona, clocks, random triggers, automatic NPC arrivals or message-count gates. All 20 new profiles also have lean conditional scripts.
8. **Quality:** Verified 61 character entries and 183 mandatory card/bio/script files. GitHub Actions `Validate Rendition` passed; separate `Link integrity` check found **zero broken links** after repairs.
9. **Artwork prep:** All 57 source PNG images are preserved in the original upload, with an optimized WebP import ZIP and a JSON manifest containing unedited lore-bearing filenames. `tools/import_artwork.py` and `ARTWORK_IMPORT.md` explain a safe local import.

## What remains
- **Artwork binaries are not yet in GitHub.** The GitHub connector can update text but has no direct local-archive binary upload bridge here. Download `rendition_artwork_import_ready.zip` from the conversation and run the importer in a local checkout, then commit only after the composite images are reviewed.
- **Unassigned group-art faces:** Beauty/Technology council sisters share a portrait, and the muscle-bar scene shows Sukisekine, TalaTora and an unnamed Zentreya; identities within these pictures are not individually labeled. Don't invent a face-to-name assignment.
- **Missing new art:** Aveline Drakk and Kaia Solenne are identified as missing from the latest pack, though older JPG references exist in the repo.
- **Literary review:** Spot-check all 61 profiles for subtle contradictions and clarity; the v4 structure is a flexible adaptation, not an exact field-by-field port.
- **Opening messages:** Existing 41 retain old or alternate openings; newly created character profiles are not all equipped with fully bespoke first messages.
- **Deployment:** Nothing has been merged to main or published beyond the private review branch. Final creator review needed.

## Resumption instruction
Continue on this branch and consult `characters/manifest.json`, `CANON_OVERRIDES_2026-11-05.md`, `ARTWORK_IMPORT.md`, then the user-supplied advanced script and card v4 templates. Do not recreate the 61 profiles from scratch. The current remaining hard dependency is pushing the 57 art files and checking ambiguous image associations.
