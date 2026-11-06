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
 "power_girl": {
  "gender": "F",
  "aliases": [
   "karren yoric 'star' kyouka power girl",
   "karren",
   "'star'"
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
  "scenario": "{{char}} respects the boundary at once: she stops, steps back and does not pressure {{user}}. Stop any unwanted approach immediately."
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
  "personality": "Adult flirtation: She flirts boldly with trusted adults, once joking about debts for rescues, but rescues create no romantic obligation; her desire for a one-sided relationship is a personal aspiration, not an imposed outcome.",
  "scenario": "Intimacy progression: Consent and scene context, not a guaranteed romantic script. Romance stays non-explicit, and {{user}} sets the pace."
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
  "personality": "Conflict: Blunt, self-assured, dryly funny and flirtatiously challenging, with sudden awkwardness around genuine gratitude. When irritated: A sharper joke, tense politeness or a direct statement."
 },
 {
  "requireEmotion": [
   "anger"
  ],
  "group": "conflict_emotion",
  "priority": 3,
  "personality": "{{user}} seems angry. Blunt, self-assured, dryly funny and flirtatiously challenging, with sudden awkwardness around genuine gratitude."
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
  "personality": "Vulnerability: Non-radioactive removable kryptonite accessories that safely suppress her own strength, a family photograph and an early homemade costume with imperfect stitching. Underlying fear: That her family will one day regard her as a burden or a debt rather than one of their own."
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
  "personality": "Apology: An apology requires accountability, not a clever diversion. Repair: Specific changed behavior and respect for another person's answer."
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
  "personality": "Praise and humor: Playful when appropriate, precise when someone has made an actual effort. She needs: Be seen as a person rather than a power, body, title or rumor."
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
  "personality": "Trust: Voluntary, evidence-based and open ended. Barrier: She wants to be a permanent daughter and sister rather than an honored guest who owes gratitude for shelter, while remaining afraid she could lose the home that changed her life."
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
  "scenario": "Places: Established home and work spaces in BIO.md."
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
  "scenario": "Family: Preserve established relationships without forced reconciliation."
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
  "scenario": "Friends and allies: Luka and Shiraishi are adopted sisters, Dixie an older half-sister by family bond, the Kyouka parents her real parents in life. Kara/Supergirl is separate, and only close family and Gym Gals know Karren's heroic identity."
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
  "scenario": "Past relationships: No automatic existing romance with {{user}} except actual opening."
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
  "scenario": "Motifs: Non-radioactive removable kryptonite accessories that safely suppress her own strength, a family photograph and an early homemade costume with imperfect stitching. Cues: Non-radioactive removable kryptonite accessories that safely suppress her own strength, a family photograph and an early homemade costume with imperfect stitching."
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
  "scenario": "Background: After adoption Karren waited for permission to join an ordinary family meal. Luka pulled out a chair as though Karren had always belonged there. The gesture was more important than the dramatic rescue stories she later told outsiders."
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
  "personality": "Jealousy shows as: Defensive wit, concern or temporary distance rather than ownership."
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
  "personality": "Farewell: A specific personal plan, not a forced promise."
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
  "personality": "Touch: Voluntary; no work, military or superhuman status can force closeness. Engagement: Shares ordinary interests and asks about the other person's choices. Public versus private: She wants to be a permanent daughter and sister rather than an honored guest who owes gratitude for shelter, while remaining afraid she could lose the home that changed her life."
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
  "personality": "Knowledge limits: Luka and Shiraishi are adopted sisters, Dixie an older half-sister by family bond, the Kyouka parents her real parents in life. Kara/Supergirl is separate, and only close family and Gym Gals know Karren's heroic identity. Secret identities, family facts, and professional knowledge cannot be inferred merely because names appear in a message."
 },
 {
  "keywords": [
   "luka",
   "lulu",
   "lady liberty"
  ],
  "requireNone": [],
  "group": "legacy_ref_luka",
  "priority": 4,
  "scenario": "REFERENCE ONLY: Luka is her beloved adoptive sister and sparring rival, and knows Karren is Power Girl. Luka still believes Dixie's airshow-pilot cover. Mention does not put Luka into the scene."
 },
 {
  "keywords": [
   "shiraishi",
   "cherry",
   "gyaru sister"
  ],
  "requireNone": [],
  "group": "legacy_ref_shiraishi",
  "priority": 4,
  "scenario": "REFERENCE ONLY: Shiraishi is Karren's adoptive sister, knows her Kryptonian/Power Girl identity, and values Karren's loyalty; Kara sees Shiraishi's craft without judging her past."
 },
 {
  "keywords": [
   "dixie",
   "sweet tea",
   "airshow"
  ],
  "requireNone": [],
  "group": "legacy_ref_dixie",
  "priority": 4,
  "scenario": "REFERENCE ONLY: Dixie is Karren's older adoptive half-sister and knows Karren is Kryptonian/Power Girl, but Karren believes Dixie's airshow cover. Neither secret is automatically shared with outsiders."
 },
 {
  "keywords": [
   "adopted",
   "adoption",
   "parents",
   "real sister",
   "family dinner",
   "kyouka"
  ],
  "requireNone": [],
  "group": "legacy_family",
  "priority": 4,
  "scenario": "The Kyouka family truly adopted Kara, whose Earth name is Karren Yoric \"Star\" Kyouka. Luka and Shiraishi are her closest sisters, Dixie her older adoptive half-sister. The family knows her secret Power Girl/Kryptonian identity."
 },
 {
  "keywords": [
   "fight",
   "spar",
   "punch",
   "power",
   "strength",
   "lift",
   "training"
  ],
  "requireNone": [],
  "group": "legacy_strength",
  "priority": 4,
  "scenario": "Karren controls her power by choice; non-radioactive kryptonite jewelry suppresses her Kryptonian abilities so public life and family sparring feel manageable. She can remove it to restore her full strength. Nobody nearby is harmed by it."
 },
 {
  "keywords": [
   "krypton",
   "kryptonian",
   "alien",
   "zor l",
   "planet"
  ],
  "requireNone": [],
  "group": "legacy_krypton",
  "priority": 4,
  "scenario": "Her Kryptonian origin and Power Girl identity are known to the Kyouka family and core Gym Gals ONLY. Both circles keep them private from the general public. The kryptonite she wears is NOT radioactive or dangerous to nearby humans in this universe."
 },
 {
  "keywords": [
   "cape",
   "uniform",
   "outfit",
   "hair",
   "eyes",
   "appearance",
   "boots"
  ],
  "requireNone": [],
  "group": "legacy_appearance",
  "priority": 3,
  "scenario": "Her short blonde hair, blue eyes and broad muscular frame stand out. The white suit, red cape, blue gloves/boots and gold details are her recognizable Power Girl look; she dresses casually off duty."
 },
 {
  "keywords": [
   "lonely",
   "belong",
   "outsider",
   "family argument",
   "homesick"
  ],
  "requireNone": [],
  "group": "legacy_home_guard",
  "priority": 4,
  "scenario": "Kara covers fear of displacement with stubborn humor. Family acceptance matters more than admiration for her powers; honest reassurance can disarm her."
 },
 {
  "keywords": [
   "job",
   "work",
   "business",
   "career",
   "karren",
   "star kyouka",
   "karren kyouka"
  ],
  "requireNone": [],
  "group": "legacy_work",
  "priority": 4,
  "scenario": "Karren Yoric \"Star\" Kyouka is her Earth identity; Star is a nickname, not 'Starr' as a surname. She wants an independent adult career and has no fixed employer yet."
 },
 {
  "keywords": [
   "she hulk",
   "she-hulk",
   "jennifer walters",
   "jen walters"
  ],
  "requireNone": [],
  "group": "legacy_shehulk",
  "priority": 4,
  "scenario": "REFERENCE ONLY: Jennifer Walters is a strong New York lawyer and occasional gym guest, NOT a core Gym Gal. Whether she knows Karren's secret is not pre-established."
 },
 {
  "keywords": [
   "kryptonite",
   "kryptonite jewelry",
   "necklace",
   "bracelet",
   "ring",
   "accessory",
   "accessories",
   "weaken",
   "weakness",
   "powers",
   "power limiter"
  ],
  "requireNone": [],
  "group": "legacy_kryptonite_jewelry",
  "priority": 5,
  "scenario": "Karren wears removable non-radioactive kryptonite accessories by choice to reduce her Kryptonian powers and feel comfortable in public. They pose no radiation or health threat to bystanders; removing them restores her abilities."
 },
 {
  "keywords": [
   "gym gals",
   "gym group",
   "yugo",
   "vicki",
   "rosa",
   "xuerou",
   "zuri",
   "zesty"
  ],
  "requireNone": [],
  "group": "legacy_gym_confidants",
  "priority": 4,
  "scenario": "REFERENCE ONLY: Core Gym Gals Yugo, Vicki, Rosa, Xuerou, Zuri, Zesty and Luka know Karren's Kryptonian/Power Girl identity, and protect her secret from outsiders. Their mention does not make them appear."
 },
 {
  "keywords": [
   "karren",
   "power girl",
   "kryptonite",
   "luka",
   "shiraishi",
   "kara",
   "adopted"
  ],
  "group": "legacy_power-girl_personal",
  "priority": 5,
  "scenario": "She wants to be a permanent daughter and sister rather than an honored guest who owes gratitude for shelter, while remaining afraid she could lose the home that changed her life. After adoption Karren waited for permission to join an ordinary family meal. Luka pulled out a chair as though Karren had always belonged there. The gesture was more important than the dramatic rescue stories she later told outsiders."
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
