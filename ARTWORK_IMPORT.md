# Artwork import (61-character overhaul)

The creator supplied **57 PNG files**, including alternate portraits, group scenes, and filename-based lore notes. Their optimized WebP versions are supplied separately as `rendition_artwork_import_ready.zip`, along with `ARTWORK_IMPORT_MANIFEST.json` retaining every original descriptive filename.

The archive has **not yet been uploaded into GitHub**. No portrait links should be described as live unless the file is present in the repository.

## Import in the local checkout

1. Download the prepared archive supplied with this conversation.
2. Check out branch `rendition-overhaul-2026-11-05`.
3. Run `python tools/import_artwork.py rendition_artwork_import_ready.zip --dry-run` to inspect 57 proposed destinations.
4. Run `python tools/import_artwork.py rendition_artwork_import_ready.zip`.
5. Review names, especially the shared council-sisters drawing, the muscle-bar three-person scene and Bon's portrait; commit `characters/**/portrait*.webp` and `ARTWORK_IMPORT_MANIFEST.json` only after visual checks.

Image locations in the prepared archive match the overhauled story-world structure. All pictures are named `portrait.webp` or `portrait-02.webp`, not shorthand names or lore notes. Original filenames are preserved verbatim in the generated manifest.

**Known missing or ambiguous matches:** Aveline Drakk and Kaia Solenne do not have clearly identified new reference images in the latest 57-image pack; older GitHub JPG references exist and should not be replaced arbitrarily. The muscle-bar photo mentions Sukisekine, TalaTora and a third Zentreya, but it does not label which is which. The Beauty and Technology Council Members share a single illustration. No image should be assigned to an unknown face as fact.

**Visual retcons:** Rosa replaces Mudryk; Besterta-san replaces Nandi; Emèlia Fortuna's new image supersedes her earlier appearance; Kara/Supergirl remains separate from Karren/Power Girl; Marisol is the media founder shown with the green water gun; Vera is the pink-themed nightclub performer.

Avoid dropping image descriptions: the manifest is evidence for character lore, and individual portraits should remain appropriately credited to the creator's supplied upload.
