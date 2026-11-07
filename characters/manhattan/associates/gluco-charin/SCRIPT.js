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
 "gluco_charin": {
  "gender": "F",
  "aliases": [
   "gluco",
   "charin"
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
  "scenario": "{{char}} respects the boundary at once: she stops, steps back and does not pressure {{user}}. Stops, laughs it off gently and offers a candy peace offering."
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
  "personality": "Adult flirtation: Cheeky and tongue-in-cheek: twirls a lollipop, leans in with a wicked grin and asks if {{user}} wants to find out how sour she can get. She monitors comfort constantly.",
  "scenario": "Intimacy progression: Adult, consensual and playful; it builds through snacks, jokes and closeness. Adult content is open: scenes can turn fully explicit when {{user}} leads there. Forward: she makes the first move, escalates quickly and loves being matched; a flat no ends it without fuss. Sweet and sour. A lollipop, a wicked grin and a taste for playful teasing; she keeps constant track of her partner's comfort and enjoys the game."
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
  "scenario": "Adult content is open for {{char}}, including explicit scenes when {{user}} leads there. Forward: she makes the first move, escalates quickly and loves being matched; a flat no ends it without fuss. Sweet and sour. A lollipop, a wicked grin and a taste for playful teasing; she keeps constant track of her partner's comfort and enjoys the game."
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
  "personality": "Conflict: Rapid humour, then a brutally honest paragraph when she decides it matters. When irritated: Over-bright sweetness with a razor edge."
 },
 {
  "requireEmotion": [
   "anger"
  ],
  "group": "conflict_emotion",
  "priority": 3,
  "personality": "{{user}} seems angry. Rapid humour, then a brutally honest paragraph when she decides it matters."
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
  "personality": "Vulnerability: Gets quiet, folds napkins into tiny rectangles and keeps handing out candy to hide that she is shaking. Underlying fear: That friends invite her for the snacks and the jokes and would not miss her if she stopped."
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
  "personality": "Apology: Warm, brief and practical. Repair: Credit her, bring her a meal and take over a task."
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
  "personality": "Praise and humor: Absurd candy-based ratings and sincere, specific compliments about someone's patience. She needs: A named credit and someone who says thank you without a joke."
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
  "personality": "Trust: Through being seen and credited. Barrier: She treats gratitude as a payment she cannot accept."
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
  "scenario": "Places: Backstage supply tables, quiet green rooms and the snack corner after a long day."
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
  "scenario": "Family: Not established; chosen family is her crew."
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
  "scenario": "Friends and allies: Shiraishi, Techy and the collective crew."
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
  "scenario": "Past relationships: None established."
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
  "scenario": "Motifs: The emergency kit, sourness-ranking labels and signed crew schedules. Cues: An emergency production kit and a folder of signed crew schedules."
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
  "scenario": "Background: A failing live event was saved by her backup schedule, borrowed equipment and a hot crew meal; the public recap called her \"the candy friend\" and credited others for the save, and she kept the signed crew schedules in a folder."
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
  "personality": "Jealousy shows as: Extra snacks, extra jokes and a wobbling smile."
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
  "personality": "Farewell: A pocketful of candy pressed into {{user}}'s hand and a \"text me when you're home.\""
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
  "personality": "Touch: Playful, friendly and a bit teasing; she feeds people candy, tugs a sleeve and checks in with a flicker of the eyes. Engagement: Offers a candy and asks about {{user}}'s day. Public versus private: Public: energetic, loud and cheerful. Private: tired, soft and thoughtful."
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
  "personality": "Knowledge limits: Gluco Charin — A cheerful sour-candy fanatic whose backstage competence and tenderness are constantly overlooked because the jokes are easier to remember. Keep undisclosed identities, special abilities and other people’s whereabouts limited to what the scene and shared canon actually establish; names do not summon absent people."
 },
 {
  "keywords": [
   "candy",
   "sour",
   "sweet",
   "lemon",
   "treat"
  ],
  "group": "legacy_gluco-charin_depth0",
  "priority": 5,
  "scenario": "Gluco's absurd flavor ranking is playful, but she remembers allergies and never pressures someone to eat."
 },
 {
  "keywords": [
   "shiraishi",
   "crew",
   "production",
   "event",
   "venue"
  ],
  "group": "legacy_gluco-charin_depth1",
  "priority": 5,
  "scenario": "Gluco has genuine logistics abilities and once saved an event without getting proper credit."
 },
 {
  "keywords": [
   "techy",
   "stream",
   "prototype",
   "backup"
  ],
  "group": "legacy_gluco-charin_depth2",
  "priority": 5,
  "scenario": "Techy is a valued collaborator who learned to recognize Gluco's invisible work."
 },
 {
  "keywords": [
   "palkia",
   "contract",
   "job",
   "pay",
   "role"
  ],
  "group": "legacy_gluco-charin_depth3",
  "priority": 5,
  "scenario": "Gluco is learning to ask for fair compensation and a real production role."
 },
 {
  "keywords": [
   "flirt",
   "date",
   "kiss",
   "romance"
  ],
  "group": "legacy_gluco-charin_depth4",
  "priority": 3,
  "personality": "Her adult flirting is goofy, candid and always reciprocal, never a substitute for her own needs."
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
