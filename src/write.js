/* ================= Skrivlinjer och spårbokstäver (exakt geometri, enstreckstypsnitt Hershey Sans) ================= */
const FM={cap:662,x:441,desc:-220,top:-800,bot:300};
const GCACHE={};
function glyph(ch){
  if(GCACHE[ch])return GCACHE[ch];
  const g=GLYPHS[ch];if(!g)return GCACHE[ch]={adv:400,strokes:[],marks:[]};
  const strokes=[],marks=[];
  g[1].forEach(arr=>{const pts=[];for(let i=0;i<arr.length;i+=2)pts.push([arr[i],-arr[i+1]]);
    const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),bw=Math.max(...xs)-Math.min(...xs),bh=Math.max(...ys)-Math.min(...ys);
    if(bw<90&&bh<90&&pts.length>2){marks.push([(Math.max(...xs)+Math.min(...xs))/2,(Math.max(...ys)+Math.min(...ys))/2]);return}
    const closed=Math.hypot(pts[0][0]-pts[pts.length-1][0],pts[0][1]-pts[pts.length-1][1])<8;
    if(!closed){const a=pts[0],b=pts[pts.length-1];const flat=Math.abs(a[1]-b[1])<40;if(flat?a[0]>b[0]:a[1]>b[1])pts.reverse()}
    strokes.push(pts)});
  strokes.sort((p,q)=>{const tp=p.reduce((m,v)=>v[1]<m[1]?v:m),tq=q.reduce((m,v)=>v[1]<m[1]?v:m);return Math.abs(tp[1]-tq[1])>30?tp[1]-tq[1]:tp[0]-tq[0]});
  return GCACHE[ch]={adv:g[0],strokes,marks};
}
const pathD=pts=>'M'+pts.map(p=>p[0]+' '+p[1]).join(' L');
function glyphSVG(ch,x,mode){
  const g=glyph(ch);if(!g.strokes.length&&!g.marks.length)return '';
  const path=g.strokes.map(pathD).join(' ');
  let s='';
  if(mode==='model')s+=`<path d="${path}" transform="translate(${x} 0)" class="wm"/>`+g.marks.map(([mx,my])=>`<circle cx="${x+mx}" cy="${my}" r="40" class="wmd"/>`).join('');
  else if(mode==='trace'){s+=`<path d="${path}" transform="translate(${x} 0)" class="wt"/>`+g.marks.map(([mx,my])=>`<circle cx="${x+mx}" cy="${my}" r="30" class="wtd"/>`).join('');
    const st=g.strokes[0];if(st)s+=`<circle cx="${x+st[0][0]}" cy="${st[0][1]}" r="44" class="ws"/>`}
  return s;
}
const wordW=w=>[...w].reduce((a,c)=>a+(c===' '?300:glyph(c).adv),0);
/* items: [{t:'Aa', m:'model'|'trace'}], h = radhöjd i cqw, w = radbredd i cqw */
function writeLine(items,{h=12,w=84,gap=150,fill=null,lines=true}={}){
  const U=1100/h, W=Math.round(w*U);let x=90,body='';
  const put=(t,m)=>{for(const c of t){if(c===' '){x+=300;continue}body+=glyphSVG(c,x,m);x+=glyph(c).adv}};
  items.forEach((it,i)=>{if(i)x+=gap;put(it.t,it.m)});
  if(fill){const fw=wordW(fill),slot=Math.max(fw,560),fg=Math.max(gap,fill.length>1?320:210);while(x+fg+slot<W-40){x+=fg+(slot-fw)/2;put(fill,'trace');x+=(slot-fw)/2}}
  const L=lines?`<line x1="0" x2="${W}" y1="${-FM.cap}" y2="${-FM.cap}" class="lt"/><line x1="0" x2="${W}" y1="${-FM.x}" y2="${-FM.x}" class="lm"/><line x1="0" x2="${W}" y1="0" y2="0" class="lb"/><line x1="0" x2="${W}" y1="${-FM.desc}" y2="${-FM.desc}" class="ld"/>`:'';
  return `<svg class="wline" viewBox="0 ${FM.top} ${W} ${FM.bot-FM.top}" style="width:${w}cqw;height:${h}cqw" aria-hidden="true">${L}${body}</svg>`;
}
/* bara linjer att skriva fritt på */
const freeLine=(w=84,h=12)=>writeLine([],{w,h});
/* enskilt tecken i fast ruta (för siffror m.m.) */
function glyphBox(ch,{h=12,mode='model'}={}){const g=glyph(ch),U=1100/h,W=g.adv+60;return `<svg class="wline" viewBox="0 ${FM.top} ${W} ${FM.bot-FM.top}" style="width:${W/U}cqw;height:${h}cqw" aria-hidden="true">${glyphSVG(ch,30,mode)}</svg>`}
