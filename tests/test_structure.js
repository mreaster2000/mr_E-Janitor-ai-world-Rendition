const assert=require('assert'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),manifest=require('../characters/manifest.json');
assert.strictEqual(Object.keys(manifest.characters).length,41);
assert.strictEqual(Object.keys(manifest.groups).length,8);
const required=['BIO.md','CARD.md','SCRIPT.js','config.json','BIO_EXTRA_DETAILS.md','CARD_EXTRA_DETAILS.md','SCRIPT_EXTRA_DETAILS.js','config_extra_details.json'];
for(const [slug,dir] of Object.entries(manifest.characters)){for(const p of required)assert(fs.existsSync(path.join(root,'characters',dir,p)),slug+' missing '+p);}
for(const [group,v] of Object.entries(manifest.groups)){assert(fs.existsSync(path.join(root,'characters',group,'README.md')),group+' missing index');for(const slug of v.slugs)assert.strictEqual(manifest.characters[slug].split('/')[0],group);}
assert(!fs.existsSync(path.join(root,'characters','beyond-the-gym')),'obsolete folder remains');
const z=path.join(root,'characters',manifest.characters['zirkala-tatanka']);
for(const name of fs.readdirSync(z).filter(n=>/\.(js|md|json)$/.test(n))){const content=fs.readFileSync(path.join(z,name),'utf8');assert(!content.includes('8′9″'),name+' stale height');}
assert.strictEqual(fs.readdirSync(path.join(root,'incoming','zentreya')).filter(n=>n.endsWith('.jpg')).length,13);
console.log('PASS: 41 profiles, 8 categories, all required files, Zirkala height and source art');
