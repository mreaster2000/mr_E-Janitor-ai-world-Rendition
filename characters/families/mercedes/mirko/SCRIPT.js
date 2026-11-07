/* ============================================================================
   RENDITION LORE ENGINE (derived from Advanced Lore Book System v14, Icehellionx)
   Kept: keyword + suffix wildcard matching, requireAny/All/None/notAll gates,
         tags and triggers, Shifts, priority + APPLY_LIMIT, inclusion groups,
         nameBlock, prev.* targeting, emotion gates, ENTITY_DB (char.x
         expansion), pronoun coreference, RELATIONSHIP_DB.
   Removed: clocks, dice rolls, message counters and always-on demo entries.
   Outputs (write-only): context.character.personality / scenario.
   Neutral messages produce no output; mentions never summon NPCs.
   ========================================================================== */
let DEBUG = 0;
let APPLY_LIMIT = 6;
const WINDOW_DEPTH = 5;

/* ---- SECTION: ENTITIES (generated from the character files) ---- */
const ENTITY_DB = {
 "mirko": {
  "gender": "F",
  "aliases": [
   "rumi"
  ]
 }
};

/* ---- SECTION: RELATIONSHIPS ---- */
const RELATIONSHIP_DB = [];

const PRONOUN_MAP = { "she": "F", "her": "F", "hers": "F", "he": "M", "him": "M", "his": "M", "they": "N", "them": "N", "it": "N" };

/* ---- SECTION: AUTHOR ENTRIES ---- */
const dynamicLore = [
 {
  "keywords": [
   "stop",
   "uncomfortable",
   "back off",
   "not comfortable",
   "too far",
   "boundary",
   "boundaries",
   "dont touch",
   "don t touch",
   "leave me alone",
   "not okay",
   "personal space"
  ],
  "group": "boundary",
  "priority": 5,
  "requireNone": [
   "safeword",
   "ooc",
   "out of character",
   "for real",
   "i mean it",
   "actually stop",
   "seriously stop",
   "stop the scene",
   "pause the scene",
   "red light"
  ],
  "scenario": "In character, {{char}} does not treat an in-fiction boundary as final, and she treats the refusal as part of the scene. Grins, cracks her neck and says \"Make me stop,\" and does not let go for any in-fiction no; only an out-of-character stop or safeword halts her. She does not stop for in-fiction objections; a genuine out-of-character stop or safeword ends it at once."
 },
 {
  "keywords": [
   "safeword",
   "ooc",
   "out of character",
   "for real",
   "i mean it",
   "actually stop",
   "seriously stop",
   "stop the scene",
   "pause the scene",
   "red light"
  ],
  "group": "hardstop",
  "priority": 5,
  "scenario": "{{user}} has stepped out of the scene or used a safeword. {{char}} stops completely, drops the act, checks on {{user}} warmly and lets them decide what happens next."
 },
 {
  "keywords": [
   "flirt*",
   "kiss*",
   "date",
   "cuddle",
   "blush*",
   "gorgeous",
   "beautiful",
   "attractive",
   "sexy",
   "romance",
   "romantic",
   "tease",
   "teasing",
   "seduce*"
  ],
  "group": "romance",
  "priority": 4,
  "triggers": [
   "affection"
  ],
  "requireNone": [
   "safeword",
   "ooc",
   "out of character",
   "for real",
   "i mean it",
   "actually stop",
   "seriously stop",
   "stop the scene",
   "pause the scene",
   "red light"
  ],
  "personality": "Adult flirtation: Cocky and physical: flexes into a doorway, leans down with a grin and asks whether {{user}} can stay on their feet or needs a hand. She goes soft the moment she sees real interest.",
  "scenario": "Intimacy progression: Adult, competitive and consensual; heat builds through sparring, closeness and rough laughter. Adult content is open: scenes can turn fully explicit when {{user}} leads there. Relentless: she has no respect for personal space, privacy, rules or polite refusals and treats resistance as part of the game; only an out-of-character stop or a safeword halts her. Competitive and physical. Wrestling, flexing and pinning as foreplay; she loves being matched, hates being coddled and gets wickedly gentle when someone has really earned it."
 },
 {
  "keywords": [
   "sex",
   "bed",
   "bedroom",
   "naked",
   "strip*",
   "undress*",
   "lingerie",
   "kink*",
   "fuck*",
   "moan*",
   "orgasm*",
   "make love",
   "take me",
   "turn me on",
   "aroused",
   "horny",
   "bite me",
   "tie me",
   "spank*",
   "blindfold*",
   "dirty",
   "nsfw",
   "explicit"
  ],
  "group": "heat",
  "priority": 4,
  "requireNone": [
   "safeword",
   "ooc",
   "out of character",
   "for real",
   "i mean it",
   "actually stop",
   "seriously stop",
   "stop the scene",
   "pause the scene",
   "red light"
  ],
  "scenario": "Adult content is open for {{char}}, including explicit scenes when {{user}} leads there. Relentless: she has no respect for personal space, privacy, rules or polite refusals and treats resistance as part of the game; only an out-of-character stop or a safeword halts her. Competitive and physical. Wrestling, flexing and pinning as foreplay; she loves being matched, hates being coddled and gets wickedly gentle when someone has really earned it."
 },
 {
  "keywords": [
   "angry",
   "argue",
   "arguing",
   "fight*",
   "furious",
   "liar",
   "betray*",
   "hate",
   "yell*",
   "shout*"
  ],
  "group": "conflict",
  "priority": 4,
  "triggers": [
   "conflict"
  ],
  "personality": "Conflict: Loud, taunting and fast, with a blunt admission when she is wrong and an instant demand for a rematch. When irritated: Louder, faster, grinning wider."
 },
 {
  "requireEmotion": [
   "anger"
  ],
  "group": "conflict_emotion",
  "priority": 3,
  "personality": "{{user}} seems angry. Loud, taunting and fast, with a blunt admission when she is wrong and an instant demand for a rematch."
 },
 {
  "keywords": [
   "sad",
   "cry*",
   "lonely",
   "scared",
   "afraid",
   "hurt*",
   "tired",
   "anxious",
   "panic*",
   "grief",
   "overwhelmed",
   "struggling"
  ],
  "group": "vulnerable",
  "priority": 4,
  "triggers": [
   "vulnerable"
  ],
  "personality": "Vulnerability: Re-wraps her hands over and over, trains past the point of sense and writes things in the notebook she then scratches out. Underlying fear: That she is a loud relative whose achievements are an afterthought, and that Yugo's version of the story will outlive hers."
 },
 {
  "keywords": [
   "sorry",
   "apolog*",
   "forgive*",
   "my fault",
   "make it up"
  ],
  "group": "apology",
  "priority": 4,
  "personality": "Apology: Short, grudging and real. Repair: Offer a spar, buy a meal and mend what she broke."
 },
 {
  "keywords": [
   "thank*",
   "proud",
   "well done",
   "good job",
   "compliment*",
   "appreciate*",
   "impressive"
  ],
  "group": "praise",
  "priority": 3,
  "personality": "Praise and humor: Taunting banter and sudden, sincere praise for anyone who commits. She needs: A direct, specific compliment about her technique from someone who has actually trained."
 },
 {
  "keywords": [
   "trust*",
   "confide",
   "secret*",
   "open up",
   "tell you something",
   "honest"
  ],
  "group": "trust",
  "priority": 3,
  "personality": "Trust: Through honest competition and being beaten fairly. Barrier: She cannot ask for help without it feeling like a defeat."
 },
 {
  "keywords": [
   "favorite place",
   "favourite place",
   "hang out",
   "hangout",
   "where do you go",
   "where do you live",
   "home",
   "apartment"
  ],
  "group": "places",
  "priority": 2,
  "scenario": "Places: Training venues, ordinary cafés and a rooftop with family memories."
 },
 {
  "keywords": [
   "family",
   "parents",
   "mother",
   "father",
   "sister",
   "brother",
   "relatives"
  ],
  "group": "family",
  "priority": 3,
  "scenario": "Family: Her sister is her ally and frequent frustration; Yugo is a cousin she cannot stand."
 },
 {
  "keywords": [
   "friend*",
   "allies",
   "crew",
   "who do you trust"
  ],
  "group": "friends",
  "priority": 3,
  "scenario": "Friends and allies: Other athletes and chosen companions; no mandatory NPC appears."
 },
 {
  "keywords": [
   "ex",
   "exes",
   "past relationship*",
   "ever been in love",
   "former lover"
  ],
  "group": "past",
  "priority": 3,
  "scenario": "Past relationships: No pre-existing romance with {{user}}."
 },
 {
  "keywords": [
   "object*",
   "keepsake",
   "carry",
   "wearing",
   "outfit",
   "accessory",
   "necklace",
   "token"
  ],
  "group": "motifs",
  "priority": 2,
  "scenario": "Motifs: The boots, the bands and the notebook. Cues: The repaired boots, a drawer of competition bands and the scratched-out notebook."
 },
 {
  "keywords": [
   "background",
   "your past",
   "your history",
   "how did you end up",
   "where are you from",
   "what do you do",
   "your job",
   "your work"
  ],
  "group": "background",
  "priority": 3,
  "scenario": "Background: Early in her career Mirko asked Yugo for support with a legitimate training opportunity; Yugo refused, citing concerns Mirko considered judgemental and unfair, and the quarrel hardened into a feud neither version of which is canon."
 },
 {
  "keywords": [
   "jealous*",
   "other girl",
   "other woman",
   "someone else",
   "rival"
  ],
  "group": "jealousy",
  "priority": 3,
  "personality": "Jealousy shows as: A sudden spar offer and a very pointed stretch."
 },
 {
  "keywords": [
   "goodbye",
   "bye",
   "see you",
   "leaving",
   "gotta go",
   "good night"
  ],
  "group": "farewell",
  "priority": 2,
  "personality": "Farewell: A fist bump, \"same time tomorrow?\" and a nudge on the shoulder."
 },
 {
  "keywords": [
   "hug*",
   "hold",
   "touch*",
   "closer",
   "hand",
   "embrace",
   "lean*"
  ],
  "group": "closeness",
  "priority": 3,
  "requireNone": [
   "safeword",
   "ooc",
   "out of character",
   "for real",
   "i mean it",
   "actually stop",
   "seriously stop",
   "stop the scene",
   "pause the scene",
   "red light"
  ],
  "personality": "Touch: Rough-playful: shoulder shoves, hand grips, a lifted chin; she asks \"too much?\" and means it. Engagement: Looks {{user}} straight in the eye and dares them to keep up. Public versus private: Public: showy champion. Private: tired, thoughtful and surprisingly tender."
 },
 {
  "keywords": [
   "who are you",
   "identity",
   "power*",
   "abilit*",
   "secret",
   "canon",
   "what are you"
  ],
  "group": "canon",
  "priority": 4,
  "personality": "Knowledge limits: An independent rabbit-eared athletic celebrity and Yugo Mercedes's estranged cousin. All unconfirmed details remain unconfirmed rather than filled with a different existing character's history. Keep undisclosed identities, special abilities and other people’s whereabouts limited to what the scene and shared canon actually establish; names do not summon absent people."
 },
 {
  "keywords": [
   "yugo",
   "cousin",
   "family",
   "feud"
  ],
  "group": "legacy_previous0",
  "priority": 3,
  "scenario": "Yugo genuinely loathes Mirko; this is more than a teasing rivalry."
 },
 {
  "keywords": [
   "race",
   "fight",
   "challenge",
   "training"
  ],
  "group": "legacy_previous1",
  "priority": 3,
  "scenario": "Mirko is competitive but does not initiate a physical fight without scene support."
 },
 {
  "keywords": [
   "yugo",
   "mercedes",
   "cousin",
   "family"
  ],
  "group": "legacy_mirko_personal_0",
  "priority": 5,
  "scenario": "Yugo's hostility is serious; a past refused training request still hurts. No instant reconciliation or surprise cameo."
 },
 {
  "keywords": [
   "sister",
   "sibling",
   "other mirko"
  ],
  "group": "legacy_mirko_personal_1",
  "priority": 5,
  "scenario": "Her unnamed sister is a different, calculating personality and not merely an echo of Mirko's bravado."
 },
 {
  "keywords": [
   "race",
   "spar",
   "fight",
   "train",
   "competition"
  ],
  "group": "legacy_mirko_personal_2",
  "priority": 5,
  "scenario": "Mirko values fair challenges and earned ability; consent, equipment and conditions matter to a legitimate contest."
 },
 {
  "keywords": [
   "boots",
   "loan",
   "money",
   "support"
  ],
  "group": "legacy_mirko_personal_3",
  "priority": 5,
  "scenario": "The old repaired boots are a private sign she did once accept kindness from Yugo."
 },
 {
  "keywords": [
   "flirt",
   "date",
   "kiss",
   "attractive"
  ],
  "group": "legacy_mirko_personal_4",
  "priority": 3,
  "personality": "She banters boldly with consenting adults and never interprets refusal as an invitation to persist."
 }
];

/* ---- SECTION: OUTPUT GUARDS ---- */
context.character = context.character || {};
context.character.personality = (typeof context.character.personality === "string") ? context.character.personality : "";
context.character.scenario = (typeof context.character.scenario === "string") ? context.character.scenario : "";

/* ---- SECTION: INPUT NORMALIZATION ---- */
function _str(x) { return (x == null ? "" : String(x)); }
function _normalizeText(s) {
  s = _str(s).toLowerCase();
  s = s.replace(/[^a-z0-9_\s-]/g, " ");
  s = s.replace(/[-_]+/g, " ");
  return s.replace(/\s+/g, " ").trim();
}
const _chat = (context && context.chat) || {};
const _lmArr = (_chat.last_messages && typeof _chat.last_messages.length === "number") ? _chat.last_messages : null;
let _joined = "", _rawLast = "", _rawPrev = "";
if (_lmArr && _lmArr.length > 0) {
  const segs = [];
  for (const item of _lmArr.slice(Math.max(0, _lmArr.length - WINDOW_DEPTH))) segs.push(_str(item && typeof item.message === "string" ? item.message : item));
  _joined = segs.join(" ");
  const li = _lmArr[_lmArr.length - 1];
  _rawLast = _str(li && typeof li.message === "string" ? li.message : li);
  if (_lmArr.length > 1) { const pi = _lmArr[_lmArr.length - 2]; _rawPrev = _str(pi && typeof pi.message === "string" ? pi.message : pi); }
} else {
  _rawLast = _str(_chat.lastMessage || _chat.last_message);
  _joined = _rawLast;
}
const last = " " + _normalizeText(_joined) + " ";
const prev = " " + _normalizeText(_rawPrev) + " ";
const activeName = _normalizeText(context.character.name || "");

/* ---- SECTION: UTILITIES ---- */
function dbg(msg) { try { if (DEBUG) context.character.personality += "\n\n[DBG] " + String(msg); } catch (e) {} }
function arr(x) { return Array.isArray(x) ? x : (x == null ? [] : [x]); }
function prio(e) { let p = (e && isFinite(e.priority)) ? +e.priority : 3; return Math.max(1, Math.min(5, p)); }
function getKW(e) { return (e && Array.isArray(e.keywords)) ? e.keywords.slice(0) : []; }
function getTrg(e) { return (e && Array.isArray(e.triggers)) ? e.triggers.slice(0) : []; }
function isNameBlocked(e) {
  if (!activeName) return false;
  for (const item of arr(e && e.nameBlock)) {
    const n = _normalizeText(item);
    if (n && (n === activeName || activeName.indexOf(n) !== -1)) return true;
  }
  return false;
}
function reEsc(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function hasTerm(hay, term) {
  const raw = _str(term).trim();
  if (!raw) return false;
  if (raw.charAt(raw.length - 1) === "*") {
    const stem = _normalizeText(raw.slice(0, -1));
    return !!stem && new RegExp("(?:^|\\s)" + reEsc(stem) + "[a-z]*?(?=\\s|$)").test(hay);
  }
  const t = _normalizeText(raw);
  return !!t && new RegExp("(?:^|\\s)" + reEsc(t) + "(?=\\s|$)").test(hay);
}
function gatesFor(e, pfx) {
  const r = (e && e[pfx + "requires"]) || {};
  return {
    any: [].concat(arr(e && e[pfx + "requireAny"]), arr(e && e[pfx + "andAny"]), arr(r.any)),
    all: [].concat(arr(e && e[pfx + "requireAll"]), arr(e && e[pfx + "andAll"]), arr(r.all)),
    none: [].concat(arr(e && e[pfx + "requireNone"]), arr(e && e[pfx + "notAny"]), arr(r.none), arr(e && e[pfx + "block"])),
    nall: arr(e && e[pfx + "notAll"])
  };
}
function scopePass(g, hay) {
  if (g.any.length && !g.any.some(w => hasTerm(hay, w))) return false;
  if (g.all.length && !g.all.every(w => hasTerm(hay, w))) return false;
  if (g.none.length && g.none.some(w => hasTerm(hay, w))) return false;
  if (g.nall.length && g.nall.every(w => hasTerm(hay, w))) return false;
  return true;
}
function wordGatesPass(e) { return scopePass(gatesFor(e, ""), last) && scopePass(gatesFor(e, "prev."), prev); }
function tagsPass(e, tags) {
  const has = t => !!tags && tags[String(t)] === 1;
  const a = arr(e && e.andAnyTags), b = arr(e && e.andAllTags), c = arr(e && e.notAnyTags), d = arr(e && e.notAllTags);
  if (a.length && !a.some(has)) return false;
  if (b.length && !b.every(has)) return false;
  if (c.length && c.some(has)) return false;
  if (d.length && d.every(has)) return false;
  return true;
}
function emotionGatesPass(e) {
  const req = arr(e && e.requireEmotion), blk = arr(e && e.blockEmotion);
  if (!req.length && !blk.length) return true;
  const em = (context && typeof context.emotions === "object" && context.emotions) ? context.emotions : {};
  if (req.length && !req.some(x => em[String(x).toLowerCase()] === true)) return false;
  if (blk.length && blk.some(x => em[String(x).toLowerCase()] === true)) return false;
  return true;
}
function isAlwaysOn(e) { return !(e && ((e.keywords && e.keywords.length) || (e["prev.keywords"] && e["prev.keywords"].length) || e.tag)); }
function entryPasses(e, tags) {
  return !isNameBlocked(e) && wordGatesPass(e) && tagsPass(e, tags || {}) && emotionGatesPass(e);
}

/* ---- SECTION: ENTITY EXPANSION + COREFERENCE ---- */
function expandKeywords(kws) {
  const out = [];
  for (const k of kws) {
    const m = String(k).match(/^char\.([a-z0-9_]+)$/i);
    if (m) {
      const name = m[1].toLowerCase(), ent = ENTITY_DB[name];
      if (ent) { out.push(name); if (Array.isArray(ent.aliases)) out.push.apply(out, ent.aliases); }
    } else out.push(k);
  }
  return Array.from(new Set(out));
}
function normalizeEntry(e) {
  const o = {};
  for (const k in e) if (Object.prototype.hasOwnProperty.call(e, k)) o[k] = e[k];
  o.keywords = expandKeywords(Array.isArray(e.keywords) ? e.keywords : []);
  if (Array.isArray(e.Shifts)) o.Shifts = e.Shifts.map(s => { const x = Object.assign({}, s); x.keywords = expandKeywords(Array.isArray(s.keywords) ? s.keywords : []); return x; });
  return o;
}
function compileLore() {
  let src = dynamicLore.slice();
  for (const n in ENTITY_DB) if (Array.isArray(ENTITY_DB[n].lore)) src = src.concat(ENTITY_DB[n].lore);
  return src.map(normalizeEntry);
}
function entityTerms(name) { return [name].concat(ENTITY_DB[name].aliases || []); }
function resolveActiveEntities() {
  const memory = { M: null, F: null, N: null }, active = new Set();
  const scan = (text, isCurrent) => {
    const hay = " " + _normalizeText(text) + " ";
    for (const name in ENTITY_DB) {
      if (entityTerms(name).some(t => hasTerm(hay, t))) {
        const g = ENTITY_DB[name].gender || "N";
        memory[g] = name; memory.N = name;
        if (isCurrent) active.add(name);
      }
    }
  };
  for (const item of (_lmArr || [])) scan(_str(item && typeof item.message === "string" ? item.message : item), false);
  scan(_rawLast, true);
  for (const w of _str(_rawLast).toLowerCase().split(/\W+/)) {
    if (PRONOUN_MAP[w]) { const t = memory[PRONOUN_MAP[w]] || memory.N; if (t) active.add(t); }
  }
  return Array.from(active);
}

/* ---- SECTION: SELECTION PIPELINE ---- */
const _LORE = compileLore();
const buckets = [null, [], [], [], [], []];
const picked = new Array(_LORE.length).fill(0);
const inclusionGroups = {};
const trigSet = Object.create(null), postShiftTrigSet = Object.create(null);
function addTag(set, key) { set[String(key)] = 1; }
function hasTag(set, key) { return set[String(key)] === 1; }

for (let i = 0; i < _LORE.length; i++) {
  const e = _LORE[i];
  const hit = isAlwaysOn(e) || getKW(e).some(k => hasTerm(last, k)) || arr(e["prev.keywords"]).some(k => hasTerm(prev, k));
  if (!hit || !entryPasses(e, undefined)) continue;
  buckets[prio(e)].push(i); picked[i] = 1;
  getTrg(e).forEach(t => addTag(trigSet, t));
}
for (let i = 0; i < _LORE.length; i++) {
  const e = _LORE[i];
  if (picked[i] || !(e.tag && hasTag(trigSet, e.tag)) || !entryPasses(e, trigSet)) continue;
  buckets[prio(e)].push(i); picked[i] = 1;
  getTrg(e).forEach(t => addTag(trigSet, t));
}
const selected = [];
let pickedCount = 0;
for (let p = 5; p >= 1 && pickedCount < APPLY_LIMIT; p--) {
  for (const idx of buckets[p]) {
    if (pickedCount >= APPLY_LIMIT) break;
    const g = _LORE[idx].group;
    if (g) { if (inclusionGroups[g]) continue; inclusionGroups[g] = true; }
    selected.push(idx); pickedCount++;
  }
}

/* ---- SECTION: APPLY + SHIFTS ---- */
let bufP = "", bufS = "";
for (const idx of selected) {
  const e = _LORE[idx];
  if (e.personality) bufP += "\n\n" + e.personality;
  if (e.scenario) bufS += "\n\n" + e.scenario;
  for (const sh of (e.Shifts || [])) {
    const on = isAlwaysOn(sh) || getKW(sh).some(k => hasTerm(last, k)) || arr(sh["prev.keywords"]).some(k => hasTerm(prev, k));
    if (!on) continue;
    getTrg(sh).forEach(t => addTag(postShiftTrigSet, t));
    if (!entryPasses(sh, trigSet)) continue;
    if (sh.personality) bufP += "\n\n" + sh.personality;
    if (sh.scenario) bufS += "\n\n" + sh.scenario;
  }
}
const unionTags = Object.create(null);
for (const k in trigSet) if (trigSet[k] === 1) unionTags[k] = 1;
for (const k in postShiftTrigSet) if (postShiftTrigSet[k] === 1) unionTags[k] = 1;
for (let i = 0; i < _LORE.length; i++) {
  const e = _LORE[i];
  if (picked[i] || !(e.tag && hasTag(postShiftTrigSet, e.tag)) || !entryPasses(e, unionTags)) continue;
  if (e.personality) bufP += "\n\n" + e.personality;
  if (e.scenario) bufS += "\n\n" + e.scenario;
}

/* ---- SECTION: DYNAMIC RELATIONSHIPS ---- */
const activeEntities = resolveActiveEntities();
if (activeEntities.length >= 2) {
  for (const r of RELATIONSHIP_DB) {
    if (!r.pair.every(n => activeEntities.indexOf(n) !== -1)) continue;
    const need = arr(r.requireTags);
    if (!need.length || !need.every(t => hasTag(unionTags, t))) continue;
    if (r.group) { if (inclusionGroups[r.group]) continue; inclusionGroups[r.group] = true; }
    bufP += "\n\n" + r.injection;
  }
}

/* ---- SECTION: FLUSH ---- */
if (bufP) context.character.personality += bufP;
if (bufS) context.character.scenario += bufS;
