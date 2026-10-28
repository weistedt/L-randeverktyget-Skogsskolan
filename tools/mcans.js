const fs=require('fs');const S='/home/claude/src/';
global.document={fonts:{status:'loaded'},getElementById:()=>null,addEventListener(){},createElement:()=>({style:{},setAttribute(){},appendChild(){}})};global.window=global;global.localStorage={getItem:()=>null,setItem(){}};
let code='';for(const f of ['glyphs.js','art.js','art2.js','chars.js','geodata.js','write.js','pages.js','c-common.js','c-matte.js','c-svenska.js','c-eng.js','c-geo.js','geo-eur.js','c-level4.js','c-level5.js','c-mer.js','c-tryg.js','c-catalog.js'])code+=fs.readFileSync(S+f,'utf8')+'\n';
code+=`;module.exports={BOOKS};`;const m=new module.constructor();m._compile(code,'all.js');
const strip=h=>h.replace(/<button[^>]*>.*?<\/button>/g,'').replace(/<svg[\s\S]*?<\/svg>/g,'[bild]').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
for(const b of m.exports.BOOKS)b.pages.forEach((p,k)=>{if(!p.b.includes('class="tray match"'))return;const mm=p.b.match(/data-ans="([^"]*)"/);
 const L=[...p.b.matchAll(/<div class="mc-l">([\s\S]*?)<\/div><span class="mdot"/g)].map(x=>strip(x[1]).slice(0,14));const R=[...p.b.matchAll(/data-mr="\d+"><\/span><span><\/span>?<div class="mc-r">([\s\S]*?)<\/div>|<span class="mdot" data-mr="\d+"><\/span><div class="mc-r">([\s\S]*?)<\/div>/g)].map(x=>strip(x[1]||x[2]).slice(0,14));
 const ans=mm?mm[1].split(',').map(Number):null;
 console.log(b.id,k+2,p.t.padEnd(28),ans?L.map((l,i)=>l+'→'+R[ans[i]]).join(' | '):'INGEN ANS','| facit:',(p.a||[]).join('; ').slice(0,90))});
