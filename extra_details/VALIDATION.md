# Expanded-edition validation

Source snapshot: `c3ca283b2f9f50d2eeb8a0c4bfb266f4dbda97c4` (4 November 2026).

## Expanded edition

`node tests/test_extra_details.js` passes **1,305 assertions across all 41 characters**. Checks cover standalone config consistency, missing-context handling, both last-message field names, scenario-only injection, preservation of existing personality and scenario content, idempotent repeated execution, relevant references, bounded optional text, refusal/distress precedence, permitted courtship, canon exceptions and card coverage.

Every card includes four original dialogue samples and a scene-compatible Scenario field. Estimated card size ranges from **1,346 to 1,737 tokens**, averaging **1,499**, using `ceil(character count / 4)` for the Personality, Scenario and Example Dialogues fields. This is an approximation, not a tokenizer measurement. The First Message, scripts and surrounding chat are additional context. Actual provider/model counts and limits can differ; this edition makes no assertion about FreeTheAI billing or an unlimited context window.

The standalone script files are approximately 16–24 KB each. JavaScript source size is not the amount inserted into the prompt. Each execution inserts the direction block and at most eight relevant entries, with an 11,000-character optional-text ceiling. This ceiling is a relevance bound; it is not a promised token count. The full creator-facing bio is not injected wholesale.

Local SHA-256 comparison confirms **all 233 downloaded original text/code files are unchanged**, including **43 original opening-message files**. The publishing operation adds new paths to the source Git tree, preserving existing binary artworks and Word documents too. Original files are never regeneration targets.

## Existing suites at the unchanged source snapshot

| Command | Result | Existing reason |
| --- | --- | --- |
| `node tests/test_crossover.js` | Pass | Crossover scripts, references and canon limits |
| `node tests/test_scripts.js` | Fail | Apollyon's original boundary response omits the literal word `boundary` required by the assertion, although it tells the bot to stop the unwanted action |
| `node tests/test_vicki_yugo.js` | Syntax error | Unescaped apostrophe in the single-quoted `Let's play a game.` test input |
| `node tests/test_zentreya.js` | Fail after roster checks | Vera's existing flirtation response does not match the test's expected wording |

Those original files are preserved as requested. These failures are not reported as passing and are independent of the expanded script suite.

## Practical limits

Testing uses Node's isolated JavaScript contexts to simulate the repository's established Janitor `context.chat` / `context.character` interface. No live Janitor AI chat or provider-key request was performed. Keyword matching cannot infer every negation or conversational nuance; the injected instructions explicitly require reading the actual scene before using a cue. Editorial quality and a model's final responses still benefit from a fresh-chat comparison.
