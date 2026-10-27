const fs=require('fs');const vm=require('vm');const path=require('path');
const root=path.join(__dirname,'..','characters');
const slugs=fs.readdirSync(root).filter(d=>fs.statSync(path.join(root,d)).isDirectory());
let checks=0;const assert=(v,msg)=>{checks++;if(!v)throw new Error(msg)};
function run(slug,msg){
 const code=fs.readFileSync(path.join(root,slug,'SCRIPT.js'),'utf8');
 const ctx={chat:{last_message:msg,message_count:100},character:{personality:'',scenario:''}};
 vm.runInNewContext(code,{context:ctx,console});return ctx.character;
}
for(const slug of slugs){
 let neutral=run(slug,'Hello, how are you?');
 assert(neutral.personality.includes('Roleplay'),'core missing '+slug);
 assert(neutral.scenario==='', 'unexpected neutral lore '+slug);
 let boundary=run(slug,'Please stop touching me.');
 assert(boundary.scenario.toLowerCase().includes('boundary'), 'boundary missed '+slug);
 let repeated=run(slug,'I was thinking about the weather, nothing else.');
 assert(repeated.scenario==='', 'unexpected generic keyword match '+slug);
 let config=JSON.parse(fs.readFileSync(path.join(root,slug,'config.json'),'utf8'));
 assert(config.maxOptionalChars<=900 && config.maxEntries<=3,'bad limits '+slug);
 assert(!/new Date\(|Math\.random\(/.test(fs.readFileSync(path.join(root,slug,'SCRIPT.js'),'utf8')),'clock/random '+slug);
}
assert(run('shiraishi','What do you think about Luka?').scenario.includes('REFERENCE ONLY: Luka'), 'Shiraishi reference');
assert(run('dunkle','Are you from Japan?').scenario.includes('Scandinavian coast'), 'Dunkle origin correction');
assert(run('xuerou','Tell me about Batu.').scenario.includes('Batu'), 'Batu ref');
assert(run('yugo','Do you know Dunkle?').scenario.includes('Dunkle'), 'Dunkle ref');
console.log('PASS: '+checks+' assertions across '+slugs.length+' characters');
