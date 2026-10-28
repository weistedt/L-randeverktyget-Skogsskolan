const fs=require('fs');global.window={};global.document={};
let code='';for(const f of ['glyphs.js','art.js','art2.js'])code+=fs.readFileSync('/home/claude/src/'+f,'utf8')+'\n';
code+='\nmodule.exports={ART,CHAR};';
const m=new module.constructor();m._compile(code,'x.js');
console.log(Object.keys(m.exports.ART).sort().join(' '));console.log(JSON.stringify(m.exports.CHAR));
