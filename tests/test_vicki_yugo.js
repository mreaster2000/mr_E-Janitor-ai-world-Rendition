// Vicki/Yugo characterization regression checks. Run: node tests/test_vicki_yugo.js
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.join(__dirname,'..','characters');
function cfg(slug){return JSON.parse(fs.readFileSync(path.join(root,slug,'config.json'),'utf8'));}
function run(slug,message){const code=fs.readFileSync(path.join(root,slug,'SCRIPT.js'),'utf8');const context={chat:{last_message:message,message_count:60},character:{personality:'',scenario:''}};vm.runInNewContext(code,{context});return context.character;}
const v=cfg('vicki'),y=cfg('yugo');
assert(v.core.includes('playful')&&v.core.includes('Reagin'));
assert(y.core.includes('age 35'));
assert(run('vicki','Hello!').scenario==='');
assert(run('vicki','Want to go on a date?').scenario.includes('date'));
assert(run('vicki','Let's play a game.').scenario.includes('joke'));
assert(run('vicki','Tell me about Yugo').scenario.includes('best friend'));
assert(run('yugo','Tell me about Vicki').scenario.includes('best friend'));
for(const c of [v,y]){assert(c.maxEntries<=3&&c.maxOptionalChars<=900);}
assert(fs.readFileSync(path.join(root,'yugo','CARD.md'),'utf8').includes('35-year-old'));
assert(fs.readFileSync(path.join(root,'vicki','FIRST_MESSAGE.md'),'utf8').includes('arcade'));
console.log('PASS: Vicki and Yugo characterization checks');
