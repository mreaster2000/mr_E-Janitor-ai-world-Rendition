# Final artwork import — Rendition overhaul

**Branch:** `rendition-overhaul-2026-11-05`. Keep `main` untouched.

The creator supplied 57 distinct PNG illustrations. The final import ZIP holds 58 verified WebP destination files because the shared Beauty/Technology council-sisters image is deliberately copied into both relevant folders. Original source filenames and lore annotations survive verbatim in `ARTWORK_IMPORT_MANIFEST.json`. The images are **not yet pushed**; this document describes the prepared handoff rather than claiming a completed import.

## Recommended Windows import

1. Download **rendition_artwork_final_import.zip** from the ChatGPT conversation.
2. Right-click the ZIP and select **Extract All**. Leave the file `rendition_artwork_final_import.zip` beside the extracted `install_artwork.cmd` and `install_artwork.ps1`. If needed, copy the original ZIP into the extracted folder (Windows extraction does not always include the archive itself).
3. Double-click **install_artwork.cmd**. It will prompt for a checkout path; press Enter to clone the private overhaul branch into `Rendition-repo` if needed. Git might ask you to sign into GitHub.
4. The importer fetches the overhaul branch, ensures a clean checkout, checks every SHA-256, copies the artwork, creates one artwork commit and pushes **only** the overhaul branch. It never pushes to `main`.
5. Confirm the [GitHub artwork commit](https://github.com/mreaster2000/mr_E-Janitor-ai-world-Rendition/tree/rendition-overhaul-2026-11-05) and GitHub Actions.

**Alternative for existing checkout:**

```bash
git switch rendition-overhaul-2026-11-05
python tools/import_artwork.py /path/to/rendition_artwork_final_import.zip --dry-run
python tools/import_artwork.py /path/to/rendition_artwork_final_import.zip
python tests/test_artwork.py
git add characters ARTWORK_IMPORT_MANIFEST.json
git commit -m "artwork: import 57 source illustrations"
git push origin rendition-overhaul-2026-11-05
```

## Source-to-folder decisions

- **MarieZa-san** lives at `characters/manhattan/gym/marieza-san/` (not former `marisa-trainer/`).
- **Gwen Stuard** retains `characters/manhattan/associates/gwen/` as her existing folder slug. Image note `Gwen Stuard.png` supersedes the old profile surname.
- **Rosa** replaces Mudryk, **Besterta-san** replaces Nandi. Their original canon measurements are preserved.
- Council sisters are depicted together; the same group image goes into both individual folders, **without** assigning a specific face to either sister.
- The muscle-bar group scene belongs in `characters/_shared/scenes/muscle-bar.webp`, not an arbitrarily selected character folder.
- The innocent, unnamed council member lives in `characters/pelagia/islanders/council-innocence/`.
- **Aveline Drakk and Kaia Solenne** lack clearly identified new art in the 57-image batch; keep their older GitHub references for now rather than inventing pictures.

**Still to review:** group-image attribution, missing newer art for Aveline/Kaia, author confirmation of as-yet unnamed characters, and any artistic/roleplay preferences beyond the source notes.
