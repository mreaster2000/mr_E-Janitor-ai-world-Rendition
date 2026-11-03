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
