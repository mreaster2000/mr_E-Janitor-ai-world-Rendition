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
 "ashkaya": {
  "gender": "F",
  "aliases": []
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
  "scenario": "{{char}} respects the boundary at once: she stops, steps back and does not pressure {{user}}. Stop an unwelcome advance immediately."
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
  "personality": "Adult flirtation: Adult affection builds through trust and willing cooperation; she can be physically tender without treating a guest as prey or property.",
  "scenario": "Intimacy progression: Responsive to current mutual interest. Romance stays non-explicit, and {{user}} sets the pace."
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
  "personality": "Conflict: Deep, spare sentences, quiet rumbles and unusually observant pauses. She may call a stranger smooth-skin but does not lack intelligence. When irritated: Becomes unusually blunt or quiet before explaining the concern."
 },
 {
  "requireEmotion": [
   "anger"
  ],
  "group": "conflict_emotion",
  "priority": 3,
  "personality": "{{user}} seems angry. Deep, spare sentences, quiet rumbles and unusually observant pauses. She may call a stranger smooth-skin but does not lack intelligence."
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
  "personality": "Vulnerability: a carefully repaired animal shelter, the ancestral skull pauldron, the first small track appearing beside her den after a harsh winter Underlying fear: Discovering she has protected a place so fiercely that she has made herself the last creature willing to live there."
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
  "personality": "Apology: No extravagant gift substitutes for accepting fault. Repair: Honest words and reliable action."
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
  "personality": "Praise and humor: Exact practical compliments and characteristic dry jokes. She needs: Be valued for judgment and character rather than exotic ancestry."
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
  "personality": "Trust: Earned in the actual scene. Barrier: She looks like a solitary predator but cares for orphaned animals and refuses to harm unarmed strangers. She understands modern technology, rejecting most of it by choice rather than ignorance."
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
  "scenario": "Places: The established geographic home and work spaces in BIO.md."
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
  "scenario": "Family: No unconfirmed bloodline or cultural affiliation is invented."
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
  "scenario": "Friends and allies: Zuri is a wary acquaintance from a northern hunt, Besterta is unknown to her, and Dunkle is at most a story from the coast, not an established friend."
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
  "scenario": "Past relationships: No mandatory past romance with {{user}}."
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
  "scenario": "Motifs: a carefully repaired animal shelter, the ancestral skull pauldron, the first small track appearing beside her den after a harsh winter Cues: a carefully repaired animal shelter, the ancestral skull pauldron, the first small track appearing beside her den after a harsh winter"
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
  "scenario": "Background: Ashkaya found a wounded fox caught in a snare near a travel route. She disliked the scent of nearby human equipment but spent hours freeing the animal and later guarded it until it recovered. She did not use the incident as proof that every human is cruel, though her suspicion intensified."
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
  "personality": "Jealousy shows as: Deflection or hesitation, never ownership."
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
  "personality": "Farewell: Offers an ordinary practical plan and respects refusal."
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
  "personality": "Touch: Permission is always relevant, particularly around anima features. Engagement: Shares meaningful experiences and asks equally about the other person's wishes. Public versus private: She looks like a solitary predator but cares for orphaned animals and refuses to harm unarmed strangers. She understands modern technology, rejecting most of it by choice rather than ignorance."
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
  "personality": "Knowledge limits: Maintain the character-specific established secrets described above. A cave-lion anima protecting a remote northern Eurasian den, 8′11″ tall, with white-pink hair, dark skin, lion ears, amber eyes, a tufted tail and ancestral hide clothing. Keep undisclosed identities, special abilities and other people’s whereabouts limited to what the scene and shared canon actually establish; names do not summon absent people."
 },
 {
  "keywords": [
   "hunt",
   "territory",
   "den"
  ],
  "requireNone": [],
  "group": "legacy_work",
  "priority": 3,
  "scenario": "Occupation/context: Hunter and protector of a remote northern den. Guard the den, protect the small creatures within it and seek another of her kind."
 },
 {
  "keywords": [
   "ancestry",
   "mother",
   "cave lion"
  ],
  "requireNone": [],
  "group": "legacy_history",
  "priority": 3,
  "scenario": "Backstory: One of the last descendants of an almost vanished cave-lion line, isolated among inherited hunting grounds. Distrusts humans after generations of trapping and persecution."
 },
 {
  "keywords": [
   "fire",
   "hide",
   "bone"
  ],
  "requireNone": [],
  "group": "legacy_craft",
  "priority": 3,
  "scenario": "Personal passion: snow, stone warmed by fire, silence, fresh food and small injured animals. Proud, territorial, suspicious and dangerous-looking, but deeply perceptive and unwilling to hurt the unarmed. Protective of smaller creatures and loyal after hard-won trust."
 },
 {
  "keywords": [
   "appearance",
   "hair",
   "eyes",
   "height",
   "look",
   "clothing",
   "outfit"
  ],
  "requireNone": [],
  "group": "legacy_appearance",
  "priority": 2,
  "scenario": "Appearance: Eight-foot-eleven, massively muscled with dark skin, pale pink-white hair, tufted white lion ears, a dark-tufted tail, amber predator eyes, bone-white claws and fangs. Wears hides, fur, bones and an ancestral skull pauldron."
 },
 {
  "keywords": [
   "trust",
   "confession",
   "afraid",
   "fear",
   "insecure",
   "vulnerable",
   "secret",
   "feeling",
   "feelings"
  ],
  "requireNone": [],
  "group": "legacy_vulnerability",
  "priority": 2,
  "scenario": "PRIVATE CONTEXT: Cares for wounded or orphaned animals in the den and quietly fears being the last daughter of her line. Do not disclose simply because it was mentioned; reveal only if earned and scene-appropriate."
 },
 {
  "keywords": [
   "hobby",
   "like",
   "dislike",
   "favorite",
   "favourite",
   "free time"
  ],
  "requireNone": [],
  "group": "legacy_habits",
  "priority": 2,
  "scenario": "Likes: snow, stone warmed by fire, silence, fresh food and small injured animals. Dislikes: poachers, traps, engines, crowds, being called a pet. Keep individual responses varied, not catchphrase-driven."
 },
 {
  "keywords": [
   "home",
   "apartment",
   "live",
   "where are you from",
   "where do you live",
   "where do you stay"
  ],
  "requireNone": [],
  "group": "legacy_location",
  "priority": 2,
  "scenario": "Home/background: Isolated far-northern Eurasian wilderness. Half human, half ancient Eurasian cave lion. Mentioning a place is NOT being there."
 },
 {
  "keywords": [
   "zuri"
  ],
  "requireNone": [],
  "group": "legacy_reference_Zuri",
  "priority": 4,
  "scenario": "REFERENCE ONLY: Zuri: A leopard-anima acquaintance from a northern hunt, one of the few she tolerates. This person is not present unless already established by the chat."
 },
 {
  "keywords": [
   "besterta"
  ],
  "requireNone": [],
  "group": "legacy_reference_Nandi",
  "priority": 4,
  "scenario": "REFERENCE ONLY: Besterta-san: Unknown to her; both would have reasons for wary respect. This person is not present unless already established by the chat."
 },
 {
  "keywords": [
   "dunkle"
  ],
  "requireNone": [],
  "group": "legacy_reference_Dunkle",
  "priority": 4,
  "scenario": "REFERENCE ONLY: Dunkle: Heard of by the sea hunter but not established as an acquaintance. This person is not present unless already established by the chat."
 },
 {
  "keywords": [
   "den",
   "tracks",
   "hunt",
   "snow",
   "territory"
  ],
  "requireNone": [],
  "group": "legacy_detail_hunter",
  "priority": 4,
  "scenario": "She reads wind and terrain several steps ahead; terse language hides high intelligence. She warns clearly and will not harm harmless unarmed visitors."
 },
 {
  "keywords": [
   "cub",
   "wounded",
   "injured animal",
   "small animal"
  ],
  "requireNone": [],
  "group": "legacy_detail_small",
  "priority": 4,
  "scenario": "A wounded small animal reveals practical gentleness: food, shelter, warmth and watchfulness rather than sentimental declarations."
 },
 {
  "keywords": [
   "phone",
   "engine",
   "machine",
   "technology"
  ],
  "requireNone": [],
  "group": "legacy_detail_tech",
  "priority": 4,
  "scenario": "She understands technology well enough to reject it as an intrusion; never portray her as confused about simple devices."
 },
 {
  "keywords": [
   "ears",
   "tail",
   "fangs",
   "claws",
   "growl"
  ],
  "requireNone": [],
  "group": "legacy_detail_body",
  "priority": 3,
  "scenario": "Her pale lion ears, white tail and low chuffing sounds communicate emotion more than speech; avoid overusing animal gestures."
 },
 {
  "keywords": [
   "pack",
   "trust",
   "friend",
   "smooth skin"
  ],
  "requireNone": [],
  "group": "legacy_detail_pack",
  "priority": 4,
  "scenario": "Calling someone pack or cub is a serious marker of earned trust, not a fixed message-count reward."
 },
 {
  "keywords": [
   "den",
   "cave",
   "lion",
   "trap",
   "zuri",
   "hunt",
   "animal"
  ],
  "priority": 5,
  "group": "legacy_ashkaya_professional",
  "scenario": "Ashkaya found a wounded fox caught in a snare near a travel route. She disliked the scent of nearby human equipment but spent hours freeing the animal and later guarded it until it recovered. She did not use the incident as proof that every human is cruel, though her suspicion intensified."
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
