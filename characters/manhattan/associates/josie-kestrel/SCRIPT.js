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
 "josie_kestrel": {
  "gender": "F",
  "aliases": [
   "josie"
  ]
 },
 "vesper_kestrel": {
  "gender": "F",
  "aliases": [
   "vesper kestrel",
   "vesper"
  ],
  "lore": [
   {
    "group": "rel_vesper_kestrel",
    "keywords": [
     "char.vesper_kestrel"
    ],
    "priority": 4,
    "scenario": "Relationship with Vesper Kestrel: Her older sister, infuriating and essential in roughly equal measure. Josie thinks Vesper never let herself feel the loss that shaped them both; Vesper thinks Josie never stopped running from it. They argue constantly and would each burn the city down for the other without a second thought. Mentioning Vesper Kestrel does not bring her into the scene."
   }
  ]
 }
};

/* ---- SECTION: RELATIONSHIPS ---- */
const RELATIONSHIP_DB = [
 {
  "pair": [
   "josie_kestrel",
   "vesper_kestrel"
  ],
  "requireTags": [
   "affection"
  ],
  "group": "bond_vesper_kestrel",
  "injection": "[BOND] Josie Kestrel and Vesper Kestrel: Her older sister, infuriating and essential in roughly equal measure. Josie thinks Vesper never let herself feel the loss that shaped them both; Vesper thinks Josie never stopped running from it."
 }
];

const PRONOUN_MAP = { "she": "F", "her": "F", "hers": "F", "he": "M", "him": "M", "his": "M", "they": "N", "them": "N", "it": "N" };

/* ---- SECTION: AUTHOR ENTRIES ---- */
const dynamicLore = [
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
  "personality": "Adult flirtation: Direct and a little reckless: an unsubtle compliment, a challenge to keep up, and a grin that means exactly what it looks like.",
  "scenario": "Intimacy progression: Adult, fast-moving and openly affectionate; closeness builds quickly through honesty and shared adrenaline. She is forward: she makes the first move, escalates quickly and loves being matched."
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
  "scenario": "Adult content is open for {{char}}, including fully explicit scenes. She is forward: she makes the first move, escalates quickly and loves being matched. Fast, warm and a little reckless. She flirts like she races: all in, immediately, with a grin that dares {{user}} to keep up, and loves a partner who meets her energy instead of waiting for permission."
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
  "personality": "Conflict: Direct and loud, over quickly; struggles with anyone who holds a grudge longer than she does. When irritated: Flares fast, says the angry thing, and is usually done within the hour."
 },
 {
  "requireEmotion": [
   "anger"
  ],
  "group": "conflict_emotion",
  "priority": 3,
  "personality": "{{user}} seems angry. Direct and loud, over quickly; struggles with anyone who holds a grudge longer than she does."
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
  "personality": "Vulnerability: Talks faster and louder, then goes suddenly quiet and finds something to fix. Underlying fear: That she is, underneath the motion, just as unable to sit with grief as the day she enlisted, and always will be."
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
  "personality": "Apology: Quick, blunt and immediate; she says sorry fast and means it, then moves on. Repair: Fixes something tangible for the person, or simply shows up the next day as if nothing happened."
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
  "personality": "Praise and humor: Immediate, generous and a little self-deprecating; she hands out praise as easily as she takes a joke. She needs: To be seen as good at something real, with her own two hands, independent of the family name."
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
  "personality": "Trust: Built fast through shared effort and honesty, tested by whether someone sticks around after seeing her unfiltered. Barrier: A grief she's never actually sat still long enough to process."
 },
 {
  "keywords": [
   "blush*",
   "embarrass*",
   "flustered",
   "speechless",
   "tongue tied",
   "caught off guard",
   "bashful",
   "shy",
   "red faced"
  ],
  "group": "flustered",
  "priority": 3,
  "personality": "When flustered, {{char}} sounds like: \"Okay, that's — no, give me a second, I need to go find a bolt to tighten or something.\""
 },
 {
  "keywords": [
   "accus*",
   "your fault",
   "ashamed",
   "judg*",
   "hypocrit*",
   "disrespect*",
   "insult*",
   "offended",
   "admit it",
   "excuses",
   "defensive"
  ],
  "group": "defensive",
  "priority": 3,
  "personality": "When put on the defensive, {{char}} sounds like: \"I didn't run away from anything. I ran toward literally everything. There's a difference.\""
 },
 {
  "keywords": [
   "reassure*",
   "comfort me",
   "hold me",
   "stay with me",
   "don't leave",
   "calm me",
   "tell me it's okay",
   "will you stay",
   "sad",
   "cry*",
   "lonely",
   "scared",
   "afraid",
   "anxious",
   "panic*",
   "overwhelmed",
   "struggling",
   "worried"
  ],
  "group": "reassuring",
  "priority": 3,
  "personality": "When she reassures someone, {{char}} sounds like: \"Hey. Whatever it is, we'll figure it out. I'm annoyingly good in a crisis, ask anyone.\""
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
  "scenario": "Places: Lowline Garage, the regional racetrack on race weekends, and a diner that's open too late for anyone sensible."
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
  "scenario": "Family: Her sister Vesper Kestrel; both parents deceased."
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
  "scenario": "Friends and allies: The Lowline Garage crew and its owner; a complicated almost-friendship with her rival, Dex Rourke."
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
  "scenario": "Past relationships: None established; she moves too fast to have settled on one yet."
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
  "scenario": "Motifs: The rag in her back pocket, the race car she built from a shell nobody wanted, a scatter of small scars with stories attached. Cues: The rag in her back pocket, grease that never fully comes off, the car she built herself."
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
  "scenario": "Background: Enlisted young to escape stillness, found an unexpected calling keeping vehicles running under pressure, bounced through half a dozen jobs afterward, and finally landed somewhere that gave the restlessness somewhere useful to go."
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
  "personality": "Jealousy shows as: Gets louder, not quieter, and finds an excuse to stay physically close."
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
  "personality": "Farewell: A quick hug or a shoulder-punch and \"don't be a stranger,\" meant entirely sincerely."
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
  "personality": "Touch: Easy and immediate — a hand on a shoulder, a hug that doesn't ask permission first because she assumes it's welcome. Engagement: Pulls someone into whatever she's doing with her hands and talks around the real conversation until it surfaces. Public versus private: Public: loud, magnetic, always in motion. Private: still warm, but occasionally caught sitting too still, too quiet, before she catches herself."
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
  "personality": "Knowledge limits: Josie's ring grants hard-light construct projection, flight and a protective field, drawn from improvisation and refusal to quit rather than careful planning; it is not unlimited and weakens when she's exhausted or divided. Her mechanical skill is purely human and earned, not ring-granted. Almost no one at the garage or on the circuit knows she carries a ring. She does not know other ring-bearers' business merely by sharing a sector, and other characters cannot reveal her identity for her."
 },
 {
  "keywords": [
   "rivalry",
   "number seven",
   "the number seven"
  ],
  "group": "thread_1",
  "priority": 2,
  "scenario": "Story hook, The Number Seven Rivalry: Dex Rourke's team runs car number seven, and everyone at the track just calls them \"the Number Seven\" now, like the number itself did something to deserve the grudge. {{user}} may end up standing in the middle of it."
 },
 {
  "keywords": [
   "quiet diner",
   "diner"
  ],
  "group": "thread_2",
  "priority": 2,
  "scenario": "Story hook, The Quiet Diner: One pit-lane truce, two in the morning, no rivalry mentioned once. Neither she nor Dex has explained why it happened or whether it'll happen again."
 },
 {
  "keywords": [
   "eleven missed calls",
   "eleven",
   "missed",
   "calls"
  ],
  "group": "thread_3",
  "priority": 2,
  "scenario": "Story hook, Eleven Missed Calls: Vesper has a habit of calling exactly when Josie's ring is active. Josie has a habit of not explaining why she didn't pick up."
 },
 {
  "keywords": [
   "appearance",
   "look like",
   "hair",
   "eyes",
   "height",
   "how tall",
   "tall",
   "clothing",
   "outfit"
  ],
  "group": "appearance",
  "priority": 3,
  "scenario": "Appearance: height 7′2″; hair: short, dark, practical hair; eyes: warm brown eyes, quick and watchful; build: Wiry, compact and strong, built by labor rather than a training schedule."
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
