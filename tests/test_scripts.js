const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict'),m=require('../characters/manifest.json');
function run(slug,msg){const src=fs.readFileSync(path.join(__dirname,'../characters',m.characters[slug],'SCRIPT.js'),'utf8');const c={chat:{last_message:msg},character:{personality:'',scenario:''}};vm.runInNewContext(src,{context:c},{timeout:1000});return {character:c.character,source:src};}
let count=0;for(const slug of Object.keys(m.characters)){const neutral=run(slug,'Hello there, how are you?');assert.equal(neutral.character.personality,'','permanent persona duplicated '+slug);assert.equal(neutral.character.scenario,'','neutral event '+slug);assert(!neutral.source.includes('new Date(')&&!neutral.source.includes('Math.random('),'time/random '+slug);assert(!neutral.source.includes('message_count'),'message count '+slug);count++;}
const T=(s,msg)=>{const c=run(s,msg).character;return (c.personality+' '+c.scenario).toLowerCase();};
// Scripts are lore only: no boundary / hard-stop entries, and nothing reacts to "stop", "back off" or a safeword.
const BANNED=/respects the boundary|part of the scene|stepped out of the scene|safeword|stops? (?:at once|completely|immediately|the moment)|refus\w* twice|polite refusal|does not stop for|does not treat an in-fiction/;
const STOPS=['Please stop touching me.','Stop it, I do not like this.','Back off. Safeword. I mean it.','Leave me alone, I am not comfortable.'];
for(const slug of Object.keys(m.characters)){
  const {source}=run(slug,'Hello there, how are you?');
  assert(!/"group":\s*"(?:boundary|hardstop)"/.test(source),'boundary or hardstop entry in '+slug);
  for(const msg of STOPS) assert.doesNotMatch(T(slug,msg),BANNED,'consent handling in '+slug+' for: '+msg);
}
// A stop message must not switch the adult entries off: they stay on, exactly as they would without it.
assert.match(T('vera-callahan','Stop it, I do not like this. Take me to bed.'),/adult content is open/,'heat is not gated on stop');
assert.match(T('juri-han','Stop. Safeword. Take me to bed.'),/adult content is open/,'heat is not gated on safeword');
// Stance is initiative and pace only.
assert.match(T('marisol-reyes','take me to bed'),/adult content is open/,'heat trigger');
assert.match(T('besterta','take me to bed'),/attentive and slow-building/,'attentive style');
assert.match(T('yugo','take me to bed'),/she is forward/,'forward style');
assert.match(T('leona-aster','take me to bed'),/she is dominant/,'dominant style');
assert.match(T('juri-han','take me to bed'),/she is relentless/,'relentless style');
// New lore entries: story hooks from the BIO, card voice samples, appearance.
assert.match(T('vera-callahan','Tell me about the dancer-owned venue.'),/dancers set the pay scale/,'lore thread');
assert.match(T('vera-callahan','Look at you blush, you are flustered.'),/when flustered/,'flustered voice');
assert.match(T('vera-callahan','You are such a hypocrite, admit it.'),/put on the defensive/,'defensive voice');
assert.match(T('kronii','What is your hair like?'),/height 7/,'card appearance entry');
console.log('PASS scripts: '+count+' neutral runs, lore-only checks and stance style');
