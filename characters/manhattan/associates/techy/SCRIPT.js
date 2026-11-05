/* Rendition Advanced Lore v14 (lean edition). Replace __AUTHOR_RULES__ with author entries.
   Self-contained; no imports, clocks, dice rolls, memory counters or automatic NPC entrances.
*/
(function(){
 if(typeof context==='undefined'||!context||!context.character)return;
 var dynamicLore=[{"keywords":["shiraishi","followers","viral","audience","stream"],"group":"techy_depth0","priority":5,"scenario":"Techy's following surpassed Shiraishi's; she refused a damaging solo sponsorship but hid the offer."},{"keywords":["gluco","candy","crew","checklist"],"group":"techy_depth1","priority":5,"scenario":"Gluco is a serious logistics collaborator, not just a source of sour sweets."},{"keywords":["prototype","circuit","code","gadget","repair"],"group":"techy_depth2","priority":5,"scenario":"Techy's competence includes testing, admitting failure and understanding trade-offs."},{"keywords":["palkia","contract","sponsor","agency"],"group":"techy_depth3","priority":5,"scenario":"Palkia's company can make fair offers but does not own Techy's independent creative identity."},{"keywords":["flirt","date","kiss","romance"],"group":"techy_depth4","priority":3,"personality":"Nerdy, cheeky adult banter gives way to genuine awkwardness when she really likes someone."}], APPLY_LIMIT=3, MAX_OPTIONAL_CHARS=900;
 var chat=context.chat||{},raw=String(chat.last_message||chat.lastMessage||'');
 function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9*]+/g,' ').trim().replace(/\s+/g,' ');}
 var h=' '+norm(raw).replace(/\*/g,'')+' ';
 function hasWord(k){var w=norm(k);if(!w)return false;if(w.charAt(w.length-1)==='*'){w=w.slice(0,-1);if(w.length<3)return false;return h.trim().split(/\s+/).some(function(x){return x.indexOf(w)===0;});}return h.indexOf(' '+w+' ')>=0;}
 function any(a){return Array.isArray(a)&&a.some(hasWord);}
 function all(a){return !Array.isArray(a)||a.every(hasWord);}
 var fired={},chosen={},entries=[],total=0;
 var candidates=dynamicLore.filter(function(r){if(!Array.isArray(r.keywords)||!r.keywords.length||!any(r.keywords))return false;if(Array.isArray(r.requireAny)&&r.requireAny.length&&!any(r.requireAny))return false;if(Array.isArray(r.requireAll)&&!all(r.requireAll))return false;if(Array.isArray(r.requireNone)&&any(r.requireNone))return false;return true;});
 candidates.sort(function(a,b){return(b.priority||3)-(a.priority||3);});
 var boundary=any(['stop touching','do not touch','back off','leave me alone','not comfortable','no flirting','please stop','no means no']);
 for(var i=0;i<candidates.length&&entries.length<APPLY_LIMIT;i++){var r=candidates[i],g=r.group||('rule'+i);if(chosen[g]||(boundary&&g==='romance'))continue;if(Array.isArray(r.andAllTags)&&!r.andAllTags.every(function(t){return fired[t];}))continue;if(Array.isArray(r.notAnyTags)&&r.notAnyTags.some(function(t){return fired[t];}))continue;var p=String(r.personality||''),s=String(r.scenario||''),len=p.length+s.length;if(!len||total+len>MAX_OPTIONAL_CHARS)continue;entries.push(r);chosen[g]=true;total+=len;if(Array.isArray(r.triggers))r.triggers.forEach(function(t){fired[t]=true;});}
 for(var j=0;j<entries.length;j++){var e=entries[j];if(e.personality)context.character.personality=(context.character.personality||'')+'\n[Relevant behavioral cue] '+e.personality;if(e.scenario)context.character.scenario=(context.character.scenario||'')+'\n[Relevant background; not an automatic event] '+e.scenario;}
 if(boundary&&!chosen.boundary)context.character.personality=(context.character.personality||'')+'\nRespect the stated boundary immediately without pressure or retaliation.';
})();