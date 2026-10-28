const fs=require('fs');const S='/home/claude/src/';const SP='tools/out/';
const cheerio=require(SP+'npm/node_modules/cheerio');
global.document={};
let code='';for(const f of ['glyphs.js','art.js','art2.js','chars.js','geodata.js','write.js','pages.js','c-common.js','c-matte.js','c-svenska.js','c-eng.js','c-geo.js','geo-eur.js','c-level4.js','c-level5.js','c-mer.js','c-tryg.js']){let c=fs.readFileSync(S+f,'utf8');code+=c+'\n'}
// markörer i stället för bilder
code=code.replace("const art=(","const __art=(").replace("const artIn=(","const __artIn=(").replace("const artSvgW=(","const __artSvgW=(").replace("const outlineArt=(","const __outlineArt=(").replace("const freeLine=","const __freeLine=");
code+=`
const art=(n)=>'⟦'+n+'⟧';const artIn=(n)=>'⟦'+n+'⟧';const artSvgW=(n,w,f)=>'⟦'+n+(f?' (spegelvänd)':'')+'⟧';const outlineArt=(n)=>'⟦kontur:'+n+'⟧';
function clockSvg(h,m){return '⟦klocka '+h+':'+String(m).padStart(2,'0')+'⟧'}
function coinSvg(v){return '⟦mynt '+v+' kr⟧'}function noteSvg(v){return '⟦sedel '+v+' kr⟧'}
function dice(n){return '⟦tärning '+n+'⟧'}function domino(a,b){return '⟦domino '+a+'|'+b+'⟧'}
function tenFrame(n,w,icon){return '⟦tiofält med '+n+' '+(icon||'acorn')+'⟧'}
function bundle(t,o){return '⟦'+t+' buntar och '+o+' lösa pinnar⟧'}
function blocks(h,t,o){return '⟦'+h+' hundraplattor, '+t+' tiostavar, '+o+' entalskuber⟧'}
function writeLine(items,o){return '⟦skrivrad: '+((items||[]).map(i=>i.t+'('+i.m+')').join(' ')||'')+(o&&o.fill?' + prickad '+o.fill:'')+'⟧'}
function freeLine(){return '⟦tom skrivrad⟧'}
function glassSvg(l){return '⟦glas fyllt '+Math.round(l*100)+'%⟧'}
function scaleSvg(l){return '⟦våg⟧'}
`;
code+=fs.readFileSync(S+'c-catalog.js','utf8');
code+=';module.exports={BOOKS,SUBJ};';
const m=new module.constructor();m._compile(code,'dump.js');const {BOOKS}=m.exports;
const SN={matte:'Matte',svenska:'Svenska',eng:'Engelska',geo:'Geografi'};
const out={};
for(const b of BOOKS){let t=`\n==================== ${b.id.toUpperCase()} · ${SN[b.subj]} ${b.nr} · ${b.title} · nivå ${b.level} (${['','från 4 år','från 5 år','från 6 år','från 7 år'][b.level]}) ====================\nMål: ${b.goal}\n`;
 b.pages.forEach((p,k)=>{const $=cheerio.load('<div id=r>'+p.b+'</div>',null,false);
  $('svg').each((i,e)=>{const tx=$(e).text().trim().replace(/\s+/g,' ');$(e).replaceWith(' ⟦bild'+(tx?': '+tx.slice(0,80):'')+'⟧ ')});
  $('input').each((i,e)=>{const a=$(e).attr('data-a');$(e).replaceWith(a?` [ruta, rätt svar: ${a.split('|').join(' / ')}] `:' [fri ruta] ')});
  $('.sel').each((i,e)=>{const ok=$(e).attr('data-ok');$(e).replaceWith(` (${ok?'✓RÄTT ':''}${$(e).text().trim()||'⟦bild⟧'}) `)});
  $('.mdot').replaceWith(' • ');$('.draw').each((i,e)=>$(e).replaceWith(' [RITYTA '+$(e).text().trim()+'] '));
  $('span').each((i,e)=>$(e).append(' '));$('p,div,tr,br').each((i,e)=>$(e).append(' ¶ '));
  let tx=$('#r').text().replace(/[ \t]+/g,' ').replace(/(\s*¶\s*)+/g,'\n   ').trim();
  t+=`\n--- Sida ${k+2}: ${p.t}\nInstruktion: ${p.i}\nInnehåll:\n   ${tx}\n${p.a?'Facit: '+p.a.join(' · ')+'\n':''}`});
 const key=b.subj==='matte'?(b.level<=2?'matte-a':'matte-b'):b.subj;(out[key]=out[key]||[]).push(t)}
for(const [k,v] of Object.entries(out)){fs.writeFileSync(SP+'audit/'+k+'.txt',v.join('\n'));console.log(k,v.join('').length)}
