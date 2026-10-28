// load all content in node with a fake DOM-less env and build every page string
const fs=require('fs');const S='/home/claude/src/';
global.document={fonts:{status:'loaded'},getElementById:()=>null,addEventListener(){},createElement:()=>({style:{},setAttribute(){},appendChild(){}})};global.window=global;global.localStorage={getItem:()=>null,setItem(){}};
let code='';for(const f of ['glyphs.js','art.js','art2.js','chars.js','geodata.js','write.js','pages.js','c-common.js','c-matte.js','c-svenska.js','c-eng.js','c-geo.js','geo-eur.js','c-level4.js','c-level5.js','c-mer.js','c-tryg.js','c-catalog.js'])code+=fs.readFileSync(S+f,'utf8')+'\n';
code+=`;module.exports={BOOKS,SUBJ,CHAR,coverPage,introPage,actPage,diplomaPage,facitPage,facitChunks,ART};`;
const m=new module.constructor();m._compile(code,'all.js');const {BOOKS,coverPage,introPage,actPage,diplomaPage,facitPage,facitChunks,ART}=m.exports;
let probs=0,tot=0;
for(const b of BOOKS){let html=coverPage(b)+introPage(b,1);b.pages.forEach((p,k)=>{html+=actPage(b,p,k+2,k)});if(b.facit)facitChunks(b).forEach((c,n,a)=>html+=facitPage(b,b.pages.length+2+n,c,n+1,a.length));html+=diplomaPage(b,b.pages.length+3);tot+=b.pages.length;
 const bad=[];if(/undefined|NaN|\[object/.test(html))bad.push((html.match(/.{60}(undefined|NaN|\[object).{40}/)||[''])[0]);
 const missingArt=[...html.matchAll(/viewBox="0 0 100 100"[^>]*>(<g [^>]*>)?<\/g>/g)].length; if(missingArt)bad.push('emptyart '+missingArt);
 const da=[...html.matchAll(/data-a="([^"]*)"/g)].length, ok=[...html.matchAll(/data-ok="1"/g)].length;
 console.log(b.id.padEnd(4),String(b.nr).padEnd(2),'L'+b.level,b.title.padEnd(26),'sidor',String(b.pages.length).padEnd(3),'svar',String(da).padEnd(4),'rätt-tryck',String(ok).padEnd(4),bad.join(' | '));if(bad.length)probs++}
console.log('böcker',BOOKS.length,'aktivitetssidor',tot,'problem',probs);
