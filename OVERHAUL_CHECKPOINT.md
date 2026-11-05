# Overhaul checkpoint — November 5, 2026

Branch: `rendition-overhaul-2026-11-05`. Starting point: main commit `a7c00029309b20d7d3429310f1633b54b6141cb7`. Do not restart or overwrite main.

## Completed
- Audited 443 tracked files and 41 existing character profiles.
- Moved 186 files to organized groups: manhattan/gym, manhattan/associates, families/kyouka, pelagia/islanders, pelagia/diaspora, pelagia/dragonblood, anima, worldwide/associates.
- Removed 227 generated/duplicate documents, obsolete exports, and config copies. All old materials remain in main's Git history.
- Standardized prior opening filenames as OPENING.md and OPENING_ALT.md; some scenes are alternatives, not replacements.
- Updated characters/manifest.json to the moved paths.

## Unfinished and important
- New image ZIP contains 57 PNGs with substantial lore notes in filenames. Keep the source ZIP unchanged; do not discard notes. Some images show multiple people, some are alternate portraits, and Avan / Drak / Kaia are reported missing from the latest pack. The repo already has Aveline Drakk and Kaia profiles and older reference JPGs.
- Integrate and reconcile new characters and redesigns: Balaika is Luka and Shiraishi's mother; Techy and Gluco are Shiraishi sidekicks; Palkia owns the not-yet-named creator collective; Crimson Viper is Yugo's fashion co-owner and investigator; Rosa replaces the name Mudryk; Besterta replaces Nandi; Emila has a redesign; Kara Yoric Denvers Kyouka is Supergirl, separate from Power Girl; Wonder Witch, Kronii and unnamed Council Members need distinctive cards.
- All goddess-titled characters except Kronii are Pelagian; 'goddess' is an old honorific, modern office is Council Member. Do not erase already established supernatural traits, such as Phoebe's fire nature.
- Zentreya is a dragon-descended lineage. Zentreya Corp is a PLACEHOLDER for a talent/creator agency, **not** the lineage or a finalized name.
- Mirko and the unnamed Mirko sibling are BOTH Yugo's cousins; she genuinely loathes them.
- Continue in requested order: finish folder cleanup and repairs -> world-bible retcons/new cast -> CARD v4-informed standardization -> detailed non-prompt BIO -> scripts conditional v14, remove clock/time gating -> upload correctly named art, missing references flagged rather than fabricated.
- Manifest paths were repaired, but legacy cross-links and old tests still need updating. Do not claim validation complete before testing.

All 41 existing BIO.md / CARD.md / SCRIPT.js retained. Main branch is the recovery reference. Do not invent automatically present NPCs or control {{user}}.

## Update after initial checkpoint

- Repository tree checked: 218 tracked files, 41 manifest characters, and all 123 required BIO/CARD/SCRIPT files present.
- First v4-inspired cards completed for Yugo, Phœbe and Vera. Remaining 38 character cards still use their earlier layout and need individual revision.
- A local optimized import-ready artwork ZIP was prepared from all 57 supplied PNGs with original filename lore notes preserved in ARTWORK_IMPORT_MANIFEST.json. It has **not been uploaded to GitHub**; use it to complete the artwork phase, checking composite scenes and alias mappings before import.
- Tests were rewritten as initial smoke checks for new paths, but were **not executed** against a checkout. Legacy links in individual BIOs and other canon files may still need correction.
