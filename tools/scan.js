const fs=require('fs'),S='/home/claude/src/';
let js=['glyphs.js','art.js','art2.js','chars.js','geodata.js','write.js','pages.js','c-common.js','c-matte.js','c-svenska.js','c-eng.js','c-geo.js','geo-eur.js','c-level4.js','c-catalog.js'].map(f=>fs.readFileSync(S+f,'utf8')).join('\n');
js+=`\n;module.exports={BOOKS,buildPages,facitChunks};`;
const m={exports:{}};new Function('module','require',js)(m,require);
const {BOOKS,buildPages}=m.exports;
let issues=0,pagesN=0;
for(const b of BOOKS){const P=buildPages(b);P.forEach((h,i)=>{pagesN++;
 const ins=[...h.matchAll(/<input[^>]*>/g)].map(x=>x[0]);
 ins.forEach(t=>{const a=(t.match(/data-a="([^"]*)"/)||[])[1]||'';const ml=+((t.match(/maxlength="(\d+)"/)||[])[1]||0);
  if(a&&ml){const alts=a.split('|');const minLen=Math.min(...alts.map(x=>x.trim().length));if(minLen>ml){issues++;console.log('MAXLEN',b.id,i,JSON.stringify(a),ml)}}
  if(a&&/[−·]/.test(a)){console.log('UNICODE',b.id,i,JSON.stringify(a))}
 });
 // sel groups with data-ok
 const sels=[...h.matchAll(/<span ([^>]*)class="sel([^"]*)"/g)];
});}
console.log('books',BOOKS.length,'pages',pagesN,'issues',issues);
