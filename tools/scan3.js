const fs=require('fs'),S='/home/claude/src/';
let js=['glyphs.js','art.js','art2.js','chars.js','geodata.js','write.js','pages.js','c-common.js','c-matte.js','c-svenska.js','c-eng.js','c-geo.js','geo-eur.js','c-level4.js','c-catalog.js'].map(f=>fs.readFileSync(S+f,'utf8')).join('\n');
js+=`\n;module.exports={BOOKS,buildPages};`;
const m={exports:{}};new Function('module','require',js)(m,require);
const {BOOKS,buildPages}=m.exports;
for(const b of BOOKS){b.pages.forEach((p,k)=>{const h=p.b;
 const hasOk=/data-ok="1"/.test(h), nIn=(h.match(/data-a="[^"]+"/g)||[]).length, emptyIn=(h.match(/<input[^>]*data-a=""/g)||[]).length;
 const draw=[/class="draw/.test(h)&&'draw',/tray match/.test(h)&&'match',/mdot/.test(h)&&'dots',/stroke-dasharray="0 7"/.test(h)&&'trace',/sel[^"]*paint/.test(h)&&!hasOk&&'paint',/ hc"/.test(h)&&'hc'].filter(Boolean);
 if((hasOk||nIn)&&(draw.length||emptyIn))console.log(b.id,k+2,JSON.stringify(p.t),'ok:',hasOk,'in:',nIn,'emptyIn:',emptyIn,draw.join(','));
});}
