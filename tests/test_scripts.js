const fs=require('fs'),vm=require('vm'),path=require('path');const assert=require('assert');
const root=path.join(__dirname,'..','characters'),manifest=require('../characters/manifest.json');
const slugs=Object.keys(manifest.characters);let checks=0;
function dir(slug){return path.join(root,manifest.characters[slug]);}
function check(x,label){checks++;assert(x,label);}
function run(slug,msg){const code=fs.readFileSync(path.join(dir(slug),'SCRIPT.js'),'utf8');const context={chat:{last_message:msg,message_count:100},character:{personality:'',scenario:''}};vm.runInNewContext(code,{context});return context.character;}
check(slugs.length===41,'expected 41 unique characters');
for(const slug of slugs){const folder=dir(slug);check(fs.existsSync(folder),'missing '+slug);const neutral=run(slug,'Hello, how are you?');check(neutral.personality.includes('Roleplay'),'core '+slug);check(neutral.scenario==='','unexpected neutral lore '+slug);check(run(slug,'Please stop touching me.').scenario.toLowerCase().includes('boundary'),'boundary '+slug);const cfg=JSON.parse(fs.readFileSync(path.join(folder,'config.json'),'utf8'));check(cfg.maxOptionalChars<=900&&cfg.maxEntries<=3,'budget '+slug);check(!fs.readFileSync(path.join(folder,'SCRIPT.js'),'utf8').includes('new Date(') && !fs.readFileSync(path.join(folder,'SCRIPT.js'),'utf8').includes('Math.random('),'clock '+slug);}
check(run('shiraishi','What do you think about Luka?').scenario.includes('REFERENCE ONLY: Luka'),'Shiraishi reference');
check(run('dunkle','Are you from Japan?').scenario.includes('Scandinavian'),'Dunkle correction');
check(run('xuerou','Tell me about Batu.').scenario.includes('Batu'),'Batu reference');
check(run('yugo','Do you know Yamato?').scenario.includes('Yamato'),'Yugo-Yamato');
check(run('yamato','Tell me about Yugo').scenario.includes('Yugo'),'Yamato-Yugo');
console.log('PASS: '+checks+' assertions across '+slugs.length+' grouped characters');
