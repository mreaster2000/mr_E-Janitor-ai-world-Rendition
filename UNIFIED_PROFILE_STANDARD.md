# Rendition — Unified BIO and Card v4 Editorial Standard

**Status:** Active editorial contract for all 61 character profiles. This pass intentionally **does not modify** `SCRIPT.js`, openings, canon books or reference images.

## Canon evidence hierarchy

1. Creator-confirmed notes, original card/reference imagery, and explicit retcons or overrides.
2. Character-specific current canon in `BIO.md`, `CARD.md`, and `HEIGHT_REFERENCE.md`.
3. Cross-character world canon, with knowledge limits and relationships respected.
4. Original Rendition narrative expansions, marked as editorial material and never mistaken for creator-confirmed canon.

**No visual guesswork:** Use recorded measurements and grounded image descriptions. If a character's precise height, hair/eye color, facial identity or age is not documented, say **Not established** at the exact field; do not infer it from a group portrait, costume style or another character. Composite artwork may depict multiple characters without unambiguous face attribution. Heights listed under editorial defaults in `HEIGHT_REFERENCE.md` remain marked *proposed*.

## BIO.md — uniform creator-facing reference

All character biographies use exactly these ordered **top-level** numbered sections (additional life episodes must be nested under Section 11, never inserted as arbitrary unnumbered top-level chapters).

1. **Overview** — identity, age (or explicitly open), lineage, place, daily occupation, central dramatic conflict.
2. **Physical Appearance and Presentation** — height, build/physical form, hair, eyes, skin/markings, clothing, accessories, body language. Include source-supported detail, not empty redirects or generic boilerplate. State unknowns explicitly.
3. **Origin and Personal History** — birthplace, family, formative circumstances, source-confirmed trajectory.
4. **Personality, Values and Voice** — demeanor, humor, speech, likes/dislikes, behavior under stress.
5. **Work, Abilities and Daily Life** — actual job, skills, powers where documented, routines and restrictions.
6. **Motivations, Flaws and Emotional Logic** — near/far goals, greatest worry, contradiction, growth barriers and repairs.
7. **Important Relationships** — specific named ties and their different dynamics, including unreconciled conflict; no generic “see World Bible.”
8. **Powers, Secrets and Knowledge Limits** — established abilities/limits, who knows what, and explicit boundaries on unconfirmed knowledge.
9. **Roleplay Guidance and Dialogue** — concrete behavior in conflict, warmth, refusal and recovery; sample dialogue rather than blank advice.
10. **Reference Art and Initial Scenarios** — exact in-repository file/opening paths if present; do not claim imported images exist unless verified.
11. **Expanded Stories and Editorial Notes** — retain creator-facing original/expanded histories and scenes; original fictional additions remain distinguishable from established facts.

**Non-negotiable:** No empty sections; no "See the card" in place of substantive content; no invented visual traits. Rich individual stories may vary in length within a consistent section scheme.

## CARD.md — uniform v4 playable prompt

Required ordered headings:
`SYSTEM_ROLE`, `CHARACTER`, `SUMMARY`, `APPEARANCE`,
`PSYCHOLOGICAL_PROFILE`, `SOCIAL_BEHAVIOR`, `EXPRESSION & SENSORY`,
`RELATIONSHIP_FLAGS`, `EMOTIONAL_LOGIC`, `CLOSENESS_BEHAVIOR`,
`SCENARIO_HOOKS`, `CANON & KNOWLEDGE LIMITS`, `DIALOGUE_PATTERNS`,
`FORMAT`, `REFLECTION_PROMPT`.

Use coherent prose for identity, summary and physical form; use consistent bold-labeled bullets for the psychological, social, emotional and scenario fields. Dialogue patterns require at least six character-appropriate lines. Prompts should focus on playable individuality rather than reciting the entire BIO; preserve established source constraints. The image, physical description, character family and secret identities must not contradict one another.

## Quality gate for this editorial pass

- Every one of the 61 manifests contains exactly the same eleven numbered BIO sections and all fifteen Card v4 headings.
- No BIO section contains only a title, a cross-reference or a generic restriction.
- BIO physical profile includes explicit height status, build/form, hair, eyes and clothing, confirmed or clearly marked unknown.
- Card APPEARANCE is substantive and agrees with the BIO; card sections aren't blank.
- All documented source lore and expanded incidents are preserved in the BIO; history does not silently disappear in formatting.
- Existing `SCRIPT.js` files are not edited in this pass, and openers are unchanged.
- GitHub validation and link-integrity checks remain green.

Creator review can refine individual literary choices later without changing the schema.
