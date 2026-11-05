const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const manifest=require('../characters/manifest.json');
const completed={
  kronii:'clock',
  'council-beauty':'festival',
  'council-technology':'filter',
  'council-innocence':'clinic',
  'marisol-reyes':'photoshoot',
  'vera-callahan':'nightclub',
  'runa-valeska':'archive',
  'roux-caldera':'track',
  palkia:'contract',
  'aveline-drakk':'military',
  'celeste-rojas':'steering',
  'kaia-solenne':'cyborg',
  'leona-aster':'fabric',
  'liberty-redford':'freight',
  'nyx-rielle':'stage',
  'rowan-mercer':'freight',
  'seraphine-ash':'sing',
  'mirko':'yugo',
  'mirko-sibling':'mirko',
  'wonder-witch':'magic',
  'saint-diana':'hero',
  bernadette:'security',
  akumaskywalker:'camera',
  bon:'wash',
  sukisekine:'bar',
  talatora:'guest',
  balaika:'daughter',
  'kara-supergirl':'shiraishi',
  techy:'viral',
  'gluco-charin':'candy',
  'crimson-viper':'maison',
  'marieza-san':'training',
  rosa:'guitar',
  besterta:'cattle'
};
const headings=['SYSTEM_ROLE','CHARACTER','SUMMARY','APPEARANCE','PSYCHOLOGICAL_PROFILE','SOCIAL_BEHAVIOR','EXPRESSION & SENSORY','RELATIONSHIP_FLAGS','EMOTIONAL_LOGIC','CLOSENESS_BEHAVIOR','SCENARIO_HOOKS','DIALOGUE_PATTERNS','FORMAT','REFLECTION_PROMPT'];
function words(s){return s.trim().split(/\s+/).length;}
function run(src,message){const context={character:{personality:'',scenario:''},chat:{last_message:message}};vm.runInNewContext(src,{context},{timeout:1000});return context.character;}
for(const [slug,keyword] of Object.entries(completed)){
 const root=path.join(__dirname,'../characters',manifest.characters[slug]);
 const card=fs.readFileSync(path.join(root,'CARD.md'),'utf8');
 const bio=fs.readFileSync(path.join(root,'BIO.md'),'utf8');
 const script=fs.readFileSync(path.join(root,'SCRIPT.js'),'utf8');
 for(const name of headings) assert(card.includes('### '+name),slug+' missing '+name);
 assert(words(card)>=800,slug+' short card: '+words(card));
 assert(words(bio)>=2000,slug+' short bio: '+words(bio));
 assert(!script.includes('var dynamicLore=__AUTHOR_RULES__'),slug+' unresolved template placeholder');
 assert.equal(run(script,'Hello there how are you?').scenario,'',slug+' neutral scenario');
 const topical=run(script,'Tell me about '+keyword+' please');
 assert(topical.scenario.length+topical.personality.length>15,slug+' topic does not fire: '+keyword);
 const boundary=run(script,'Please stop touching me.');
 assert((boundary.personality+' '+boundary.scenario).toLowerCase().includes('boundary'),slug+' boundary cue missing');
}
console.log('PASS: '+Object.keys(completed).length+' full-length v4 cards, bios and conditional scripts');
