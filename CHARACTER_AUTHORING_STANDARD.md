# Long-form Rendition character authoring contract

The creator's **Character Card v4** (supplied in ChatGPT) is the source template for `CARD.md`. The supplied **Advanced Lore Book System v14** is the behavioral reference for `SCRIPT.js`. This contract records implementation decisions; it does not replace either source template.

## CARD.md: required original v4 structure
`### SYSTEM_ROLE`, `### CHARACTER`, `### SUMMARY`, `### APPEARANCE`, `### PSYCHOLOGICAL_PROFILE`, `### SOCIAL_BEHAVIOR`, `### EXPRESSION & SENSORY`, `### RELATIONSHIP_FLAGS`, `### EMOTIONAL_LOGIC`, `### CLOSENESS_BEHAVIOR`, `### SCENARIO_HOOKS`, `### DIALOGUE_PATTERNS`, `### FORMAT`, `### REFLECTION_PROMPT`.

Use the *subfields* specified in the original: motivations, near/far goals, deepest fears, contradictions, triggers, validation needs, vulnerable tells, conflict style, social humor and irritation, goodbyes, sensory behavior, trust anchors, attachment, jealousy when relevant, repair stages, boundaries, public versus private conduct, real places and meaningful relationships, and at least six varied dialogue lines. Add an optional `### CANON & KNOWLEDGE LIMITS` if needed.

**Depth target:** Each card about 800–1,500+ substantive words where warranted, not repetitive filler. Preserve confirmed names, roles, ages, heights and first messages. Prefer distinctive embodied reactions over generic directives such as 'respond naturally'. Avoid describing the player's predetermined attraction or decisions.

## BIO.md: creator-side character bible
**Depth target:** about 2,000–4,000+ useful words when warranted. Character-to-character relationships, formative incidents, geography, professional routines, wants and fears, values and flaws, habits, body language, intimate personality (where relevant), what they know/don't know, private secrets, multiple unresolved story hooks, and original sample scenes/dialogue. Mark new original Rendition lore as editorial when derived from creator's bare-bones prompts.

The BIO is a *non-prompt author reference*. It should not be pasted wholesale into Janitor AI. Preserve older source-canon text unless explicitly contradicted; separate confirmed lore from invented editorial expansions.

## SCRIPT.js: lightweight v14 adaptation
- One standalone script per character; it must work without importing another file.
- Read `context.chat.last_message` or `lastMessage`; mutate only `context.character.personality` and/or `context.character.scenario`.
- Author rules are v14-inspired: `keywords` (including suffix wildcard), `group`, `priority`, `requireAny`, `requireAll`, `requireNone`, optional `triggers` and tag gates, and `personality`/`scenario` strings.
- Inject no permanent character card, opening scene, whole biography, unrelated NPCs, or omniscient secrets. Respect the selected opening.
- Intentionally omit v14's sample coffee-shop entries, `minMessages`, `maxMessages`, `new Date`, stochastic probabilities, forced romance clocks, and persistent memory counters.
- Priority-based selection, group deduplication, maximum three entries and approximately 900 optional characters per turn; neutral messages should inject nothing.
- A boundary cue must immediately take precedence over ordinary romance escalation.
- Include topic-specific history, relevant social knowledge, profession, inherited trait constraints, political or family disputes, and emotional response patterns; avoid injecting the same bland one-sentence cue for every character.

## Quality gates
- Script syntax and sample context execution (neutral, explicit boundary, profession, relationship, private secret, flirtation where appropriate).
- Original v4 card headers present and substantial content.
- No stale names or folder references; no auto-spawned named characters.
- Triggers match whole words and sensible multi-word phrases; no broad substring false positives such as 'car' in 'scared'.
- GitHub Actions `Validate Rendition` and `Link integrity` green.
- The overhaul stays on `rendition-overhaul-2026-11-05`; do not merge to main without the creator's approval.


## Uniform presentation supplement

See [UNIFIED_PROFILE_STANDARD.md](UNIFIED_PROFILE_STANDARD.md) for the eleven-section BIO and fifteen-section Card v4 format; this supplement leaves all JavaScript scripts untouched.
