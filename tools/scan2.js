const fs=require('fs'),S='/home/claude/src/';
let js=['glyphs.js','art.js','art2.js','chars.js','geodata.js','write.js','pages.js','c-common.js','c-matte.js','c-svenska.js','c-eng.js','c-geo.js','geo-eur.js','c-level4.js','c-catalog.js'].map(f=>fs.readFileSync(S+f,'utf8')).join('\n');
js+=`\n;module.exports={BOOKS,buildPages};`;
const m={exports:{}};new Function('module','require',js)(m,require);
const {BOOKS,buildPages}=m.exports;
const cls=new Set();let sayInSel=0,okPages=0,mixed=0,inkBig=[];
for(const b of BOOKS){const P=buildPages(b);P.forEach((h,i)=>{
 [...h.matchAll(/class="sel([^"]*)"/g)].forEach(x=>cls.add(x[1]));
 if(/class="sel[^"]*"[^>]*data-say|data-say[^>]*class="sel/.test(h))sayInSel++;
 const hasOk=/data-ok="1"/.test(h), hasIn=/data-a="[^"]+"/.test(h), hasDraw=/class="draw|class="tray match|mdot|dotsPuzzle|stroke-dasharray="0 7"/.test(h);
 if((hasOk||hasIn)&&hasDraw){mixed++;}
});}
console.log([...cls].join(' | '));console.log('sayInSel',sayInSel,'mixed check+draw pages',mixed);
// doc ids
console.log(BOOKS.map(b=>b.id).filter(id=>/[~\/]/.test(id)));
