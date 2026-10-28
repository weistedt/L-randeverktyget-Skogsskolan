const fs=require('fs');
eval(fs.readFileSync('/home/claude/src/art.js','utf8').replace(/^const /gm,'var '));
const css=fs.readFileSync('/home/claude/src/palette.css','utf8');
const names=Object.keys(ART);
let h=`<html><head><style>${css} body{margin:0;background:#fff;font:14px sans-serif;display:grid;grid-template-columns:repeat(6,200px);gap:8px;padding:10px} div{text-align:center} svg{width:190px;height:190px;background:#fff;outline:1px solid #eee}</style></head><body>`;
for(const n of names) h+=`<div><svg viewBox="0 0 100 100">${ART[n]}</svg><br>${n}</div>`;
h+=`<div><svg viewBox="0 0 100 100" style="width:60px;height:60px">${ART.apple}</svg><svg viewBox="0 0 100 100" style="width:40px;height:40px">${ART.mushroom}</svg><svg viewBox="0 0 100 100" style="width:40px;height:40px">${ART.squirrel}</svg><br>small</div>`;
fs.writeFileSync('artsheet.html',h+'</body></html>');
