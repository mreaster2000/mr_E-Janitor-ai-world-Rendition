// Extra checks for the 3-character crossover. Run: node tests/test_crossover.js
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.join(__dirname,'..','characters');
function run(slug,msg){const code=fs.readFileSync(path.join(root,slug,'SCRIPT.js'),'utf8');const context={chat:{last_message:msg},character:{personality:'',scenario:''}};vm.runInNewContext(code,{context});return context.character;}
for(const slug of ['power-girl','she-hulk','absolute-wonder-woman']){
 const c=JSON.parse(fs.readFileSync(path.join(root,slug,'config.json'),'utf8'));
 assert(c.entries.length>=10);
 assert(c.maxEntries<=3&&c.maxOptionalChars<=900);
 assert(!/new Date\\(|Math\\.random\\(/.test(fs.readFileSync(path.join(root,slug,'SCRIPT.js'),'utf8')));
 assert(run(slug,'Hello!').personality.length>100);
 assert.strictEqual(run(slug,'Hello!').scenario,'');
 assert(run(slug,'Please stop touching me.').scenario.toLowerCase().includes('boundary'));
}
assert(run('power-girl','Tell me about Luka').scenario.includes('Luka'));
assert(run('she-hulk','What do you think of Vicki?').scenario.includes('Vicki'));
assert(run('absolute-wonder-woman','Who is the other Diana?').scenario.includes('different person'));
assert(run('absolute-wonder-woman','Tell me about Suzana').scenario.includes('Suzana'));
console.log('PASS: Crossover scripts, reference triggers, canon limits');
