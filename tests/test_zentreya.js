// Separate checks for the twelve reconstructed Zentreya characters.
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const manifest=require('../characters/manifest.json');
const slugs=manifest.groups.zentreya.slugs;
assert.strictEqual(slugs.length,12);
for(const slug of slugs){
 const folder=path.join(__dirname,'../characters/zentreya',slug),cfg=JSON.parse(fs.readFileSync(path.join(folder,'config.json'),'utf8'));
 assert(cfg.maxEntries<=3&&cfg.maxOptionalChars<=900,'budget '+slug);
 const js=fs.readFileSync(path.join(folder,'SCRIPT.js'),'utf8');
 assert(!js.includes('new Date(')&&!js.includes('Math.random('),'clock '+slug);
 const context={chat:{last_message:'Hello, how are you?'},character:{personality:'',scenario:''}};
 vm.runInNewContext(js,{context});assert(context.character.personality.includes('Roleplay'),'core '+slug);
 assert.strictEqual(context.character.scenario,'','unexpected neutral lore '+slug);
 const stop={chat:{last_message:'Please stop touching me.'},character:{personality:'',scenario:''}};
 vm.runInNewContext(js,{context:stop});assert(stop.character.scenario.toLowerCase().includes('boundary'),'boundary '+slug);
}
console.log('PASS 12 reconstructed Zentreya characters');

// Creator's November 4 personality and image correction.
const exceptions=new Set(['kaia-solenne','aveline-drakk']);
let libidoProfiles=0;
for(const slug of slugs){
 const cfg=JSON.parse(fs.readFileSync(path.join(__dirname,'../characters/zentreya',slug,'config.json'),'utf8'));
 if(exceptions.has(slug)){
   assert(!cfg.entries.some(e=>e.id==='desire'||e.id==='adult_work'),'exempt character modified '+slug);
 } else {
   libidoProfiles++;
   assert(cfg.entries.some(e=>e.id==='desire'),'missing desire cue '+slug);
   assert(cfg.entries.some(e=>e.id==='adult_work'),'missing adult-work cue '+slug);
   const context={chat:{last_message:'Would you like a date? I enjoy a little flirting.'},character:{personality:'',scenario:''}};
   vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../characters/zentreya',slug,'SCRIPT.js'),'utf8'),{context});
   assert(context.character.scenario.includes('personal desire')||context.character.scenario.includes('Mutual adult desire'),'missing responsive flirtation '+slug);
 }
}
assert.strictEqual(libidoProfiles,10);
console.log('PASS 10 desire-forward characters and 2 unchanged exceptions');
