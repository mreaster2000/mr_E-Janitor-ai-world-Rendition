const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict'),m=require('../characters/manifest.json');
function run(slug,msg){const src=fs.readFileSync(path.join(__dirname,'../characters',m.characters[slug],'SCRIPT.js'),'utf8');const c={chat:{last_message:msg},character:{personality:'',scenario:''}};vm.runInNewContext(src,{context:c},{timeout:1000});return {character:c.character,source:src};}
let count=0;for(const slug of Object.keys(m.characters)){const neutral=run(slug,'Hello there, how are you?');assert.equal(neutral.character.personality,'','permanent persona duplicated '+slug);assert.equal(neutral.character.scenario,'','neutral event '+slug);assert(!neutral.source.includes('new Date(')&&!neutral.source.includes('Math.random('),'time/random '+slug);assert(!neutral.source.includes('message_count'),'message count '+slug);count++;}
for(const slug of ['yugo','phoebe','rosa','besterta','runa-valeska']){const x=run(slug,'Please stop touching me.');assert.match(x.character.scenario.toLowerCase(),/boundary|respect|stop/,'consent '+slug);}
const T=(s,msg)=>run(s,msg).character.scenario.toLowerCase();
assert.match(T('besterta','Please stop touching me.'),/respects the boundary at once/,'attentive respects');
assert.match(T('juri-han','Please stop touching me.'),/part of the scene/,'relentless presses');
assert.match(T('juri-han','Safeword. I mean it.'),/stepped out of the scene/,'relentless hard stop');
assert.doesNotMatch(T('juri-han','Safeword. I mean it.'),/part of the scene/,'hard stop overrides');
assert.match(T('leona-aster','Please stop touching me.'),/part of the scene|twice/,'dominant presses');
assert.match(T('yugo','Please stop touching me.'),/respects the boundary at once/,'forward respects');
assert.match(T('marisol-reyes','take me to bed'),/adult content is open/,'heat trigger');
console.log('PASS scripts: '+count+' neutral runs and core boundary checks');
