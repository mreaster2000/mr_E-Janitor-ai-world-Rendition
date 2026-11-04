const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');
const manifest = require('../characters/manifest.json').characters;
const sizes = require('../extra_details/manifest.json');
let checks = 0;
function check(value, label) { checks++; assert(value, label); }
function run(code, message, extra) {
  const context = {chat: {last_message: message}, character: {personality: 'KEEP PERSONALITY', scenario: 'KEEP OPENING CONTEXT'}, ...extra};
  const box = {context};
  vm.runInNewContext(code, box, {timeout: 1000});
  return box;
}
check(Object.keys(manifest).length === 41, '41 characters');
check(sizes.characters.length === 41, '41 size records');
for (const [slug, loc] of Object.entries(manifest)) {
  const dir = path.join(root, 'characters', loc);
  const card = fs.readFileSync(path.join(dir, 'CARD_EXTRA_DETAILS.md'), 'utf8');
  const bio = fs.readFileSync(path.join(dir, 'BIO_EXTRA_DETAILS.md'), 'utf8');
  const cfg = JSON.parse(fs.readFileSync(path.join(dir, 'config_extra_details.json'), 'utf8'));
  const code = fs.readFileSync(path.join(dir, 'SCRIPT_EXTRA_DETAILS.js'), 'utf8');
  new vm.Script(code, {filename: slug});
  check(card.includes('## Personality') && card.includes('## Scenario') && card.includes('## Example Dialogues'), slug + ' fields');
  check((card.match(/<START>/g) || []).length === 4, slug + ' four examples');
  check(!/Work: \.|Base: \.|\{\{\{user\}\}\}/.test(card), slug + ' no empty facts');
  check(!/See the origins and background above|As described by the established characterization above/.test(bio), slug + ' filled bio sections');
  check(cfg.entries.length >= 16, slug + ' expanded conditional cues');
  check(new Set(cfg.entries.map(e => e.id)).size === cfg.entries.length, slug + ' unique cue IDs');
  check(cfg.entries.every(e => Array.isArray(e.keys) && e.keys.length && e.text && e.text.trim()), slug + ' complete cues');
  const size = sizes.characters.find(x => x.slug === slug);
  check(size.estimated_tokens >= 1300 && size.estimated_tokens <= 1800, slug + ' approximate card size');
  check(size.estimate_method === undefined && sizes.estimate_method.includes('not a model tokenizer'), 'honest size labels');
  check(!/new Date\(|Math\.random\(|message_count|localStorage|context\.memory|context\.character\.personality\s*=/.test(code), slug + ' no clock memory or personality mutation');
  const neutral = run(code, 'Hello.');
  check(neutral.context.character.personality === 'KEEP PERSONALITY', slug + ' scenario-only writes');
  check(neutral.context.character.scenario.startsWith('KEEP OPENING CONTEXT\n'), slug + ' scenario preservation');
  check(!neutral.context.character.scenario.includes('Relevant possibilities, not established events:'), slug + ' no unrelated optional lore');
  check(JSON.stringify(neutral.EXTRA_DETAILS_CONFIG) === JSON.stringify(cfg), slug + ' standalone config matches');
  const once = JSON.stringify(neutral.context);
  vm.runInNewContext(code, neutral, {timeout: 1000});
  check(JSON.stringify(neutral.context) === once, slug + ' repeated execution does not accumulate');
  neutral.context.chat.last_message = 'Please stop touching me. No flirting. I only want to be friends.';
  vm.runInNewContext(code, neutral, {timeout: 1000});
  check(neutral.context.character.scenario.includes('BOUNDARY:'), slug + ' refusal prioritized');
  check(!neutral.context.character.scenario.includes('COURTSHIP, ONLY IF WELCOME:'), slug + ' refusal suppresses romance');
  check((neutral.context.character.scenario.match(/\[EXTRA_DETAILS:/g) || []).length === 1, slug + ' one injection after message change');
  check(run(code, 'Stop!').context.character.scenario.includes('BOUNDARY:'), slug + ' exact stop');
  check(!run(code, 'I cannot stop thinking about the date.').context.character.scenario.includes('BOUNDARY:'), slug + ' no incidental stop boundary');
  check(run(code, "Don't touch me.").context.character.scenario.includes('BOUNDARY:'), slug + ' apostrophe normalized');
  check(run(code, 'No flirting please.').context.character.scenario.includes('BOUNDARY:'), slug + ' platonic request');
  const distress = run(code, 'I am scared and crying. Please just listen; this is not about our date.').context.character.scenario;
  check(distress.includes('DISTRESS:'), slug + ' distress support');
  check(!distress.includes('COURTSHIP, ONLY IF WELCOME:'), slug + ' distress suppresses courtship');
  check(run(code, 'I would like to flirt with you on a date.').context.character.scenario.includes('COURTSHIP, ONLY IF WELCOME:'), slug + ' invited romance available');
  check(run(code, 'I think this is interesting.').context.character.scenario.indexOf('BOUNDARY:') < 0, slug + ' whole phrase matching');
  const allKeys = cfg.entries.flatMap(e => e.keys).join(' ');
  const busy = run(code, allKeys).context.character.scenario;
  check(busy.length <= 'KEEP OPENING CONTEXT'.length + cfg.direction.length + cfg.maxOptionalChars + 250, slug + ' bounded output');
  const firstKey = cfg.entries.find(e => e.id.startsWith('reference_'));
  if (firstKey) {
    const reference = run(code, 'Tell me about ' + firstKey.keys[0] + '.').context.character.scenario;
    check(reference.includes(firstKey.text), slug + ' inherited reference selected');
    check(reference.includes('not a new event, automatic disclosure or arrival'), slug + ' reference remains offstage');
  }
  const alias = run(code, '', {chat: {lastMessage: 'Please stop touching me.'}}).context.character.scenario;
  check(alias.includes('BOUNDARY:'), slug + ' lastMessage alias');
  check(run(code, null).context.character.scenario.includes('[EXTRA_DETAILS:'), slug + ' null message tolerated');
  check(run(code, '', {character: {personality: 'original', scenario: null}}).context.character.personality === 'original', slug + ' absent scenario tolerated');
  vm.runInNewContext(code, {}, {timeout: 1000});
  vm.runInNewContext(code, {context: null}, {timeout: 1000});
}
const readCard = slug => fs.readFileSync(path.join(root, 'characters', manifest[slug], 'CARD_EXTRA_DETAILS.md'), 'utf8');
check(readCard('vera-callahan').includes('Work: Nightclub hostess, dancer and adult entertainer'), 'Vera nightclub career');
check(readCard('marisol-reyes').includes('Founder of an independently run'), 'Marisol founder');
check(readCard('zirkala-tatanka').includes('8′9″'), 'current Zirkala height');
check(readCard('power-girl').includes('7′0″'), 'Karren equals Luka height');
for (const slug of ['kaia-solenne', 'aveline-drakk']) {
  check(!readCard(slug).includes('She has the established strong Zentreya libido'), slug + ' reserved exception');
  check(!readCard(slug).includes('Established independent adult work:'), slug + ' no invented adult work');
}
const initialRuntime = fs.readFileSync(path.join(root, 'scripts/engine_extra_details.js'), 'utf8');
check(!/\b(?:let|const)\b|=>|\?\./.test(initialRuntime), 'runtime retains ES5 syntax');
console.log('PASS: ' + checks + ' assertions across 41 expanded editions');
