const fs=require('fs');
let code=['/home/claude/src/art.js','/home/claude/src/pages.js','/home/claude/src/art2.js'].map(f=>fs.readFileSync(f,'utf8')).join('\n');
code=code.replace(/^const /gm,'var ');
eval(code);
const css=fs.readFileSync('/home/claude/src/palette.css','utf8')+':root{--ink:#26322E}';
const names=process.argv[2].split(',');
let h=`<html><head><style>${css} body{margin:0;background:#fff;font:13px sans-serif;display:grid;grid-template-columns:repeat(6,210px);gap:6px;padding:8px} div{text-align:center} svg.big{width:200px;height:200px;outline:1px solid #eee;overflow:visible}</style></head><body>`;
for(const n of names){ if(n==='birch'){h+=`<div><svg class="big" viewBox="0 0 100 100"><rect width="100" height="100" fill="#DCE8EA"/>${birchTree(30,95,80,1)}${birchTree(70,95,60,2)}</svg><br>birch</div>`;continue}
 if(n==='clock'){h+=`<div>${clockSvg(3,30,{w:20}).replace('class="ic"','class="big"')}<br>clock 3:30</div>`;continue}
 if(n==='coins'){h+=`<div style="width:200px">${[1,2,5,10].map(v=>coinSvg(v).replace(/style="[^"]*"/,'style="width:45px;height:45px"')).join('')}${noteSvg(20).replace(/style="[^"]*"/,'style="width:90px;height:45px"')}${noteSvg(100).replace(/style="[^"]*"/,'style="width:90px;height:45px"')}<br>coins</div>`;continue}
 h+=`<div><svg class="big" viewBox="0 0 100 100">${ART[n]}</svg><br>${n}</div>`}
fs.writeFileSync('artsheet2.html',h+'</body></html>');
