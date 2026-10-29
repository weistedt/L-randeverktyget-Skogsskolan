/* ================= Serien ================= */
Object.assign(CHAR.matte,{poses:['squirrel','squirrel_point','squirrel_think','squirrel_wave'],flipTutor:true,diploma:'squirrel_cheer'});
Object.assign(CHAR.svenska,{poses:['owl','owl_read','owl_think','owl_wave'],flipTutor:false,diploma:'owl_cheer'});
Object.assign(CHAR.eng,{poses:['fox','fox_point','fox_think','fox_wave'],flipTutor:true,diploma:'fox_cheer'});
Object.assign(CHAR.mer,{poses:['ivar','ivar_point','ivar_think','ivar_wave'],flipTutor:true,diploma:'ivar_cheer'});
CHAR.tryg={...CHAR.mer,poses:[...CHAR.mer.poses]};
Object.assign(CHAR.geo,{poses:['swallow_perch','swallow_map','swallow','swallow_cheer'],flipTutor:true,diploma:'swallow_cheer'});
const SUBJ={
 matte:{name:'Matte',color:'var(--s-matte)',sub:'Räkna · Former · Plus & minus · Gånger · Mäta · Klockan · Pengar · Logik'},
 svenska:{name:'Svenska',color:'var(--s-svenska)',sub:'Bokstäver · Lägesord · Första ord · Rim & stavelser · Ordbygge · Berättelser · Skriva'},
 eng:{name:'Engelska',color:'var(--s-eng)',sub:'Hälsa · Siffror · Färger · Djur · Väder · Känslor · Läsa och skriva'},
 geo:{name:'Geografi',color:'var(--s-geo)',sub:'Landskap · Kartor & väderstreck · Sverige · Världen · Klimat'},
 mer:{name:'Natur',color:'var(--s-mer)',sub:'Djur · Årstider · Naturdetektiv'},
 tryg:{name:'Trygghet',color:'var(--s-tryg)',sub:'Känslor & vänner · Trygg ute · Brand & olycka'}
};
const BOOKS=(()=>{const L=[bookM1(),bookM2(),bookM3(),bookM4(),bookM5(),bookM6(),bookM7(),bookM8(),bookM9(),bookM10(),bookM11(),bookM13(),bookM12(),
 bookLetters(1,'A','I','s1',{scene:'forest',pose:'owl',props:artIn('apple',30,256,20)+artIn('ball',54,262,18)+artIn('fish',14,268,18)}),
 bookLetters(2,'J','R','s2',{scene:'dusk',pose:'owl_fly',side:'left',x:20,y:140}),
 bookLetters(3,'S','Ö','s3',{scene:'winter',pose:'owl',side:'left'}),
 bookSL(),bookS4(),bookS5(),bookS6(),bookS7(),bookS8(),bookS9(),bookS11(),bookS10(),bookE1(),bookE2(),bookE3(),bookE4(),bookG1(),bookG2(),bookG3(),bookG4(),bookG5(),bookG6(),bookN1(),bookN2(),bookN3(),bookB1(),bookK1(),bookJ1(),bookT1(),bookB2(),bookK2()];
 const K={m2:'Former och mönster',m4:'Mät och jämför',m5:'Plus och minus',m6:'Gånger',s5:'Rim och stavelser',s6:'Ord och meningar',e1:'Mina första ord',e2:'Vardagsord',sl:'Lägesord',g1:'Landskap',g2:'Kartor',g3:'Sverige',g4:'Världen'};
 /* rev: höj när en bok byggs om så att sidorna inte längre motsvarar gammalt sparat arbete (rensas då i app.js) */
 /* höj revisionen när sidor flyttas eller svar byter plats, annars bockas fel sidor av */
 const REV={g2:4,g3:4,g4:2,g5:2,e1:4,e2:4,e3:4,s1:2,s2:2,s3:2,s4:2,s5:3,s6:3,s7:3,s8:3,m1:3,m2:4,m3:2,m4:3,m5:2,m6:3,m7:3,m8:3,m9:3,m10:3,m11:3,m12:2,m13:2,g1:5,s9:4};
 const LOOSE={s9:['En och flera','Verb – vad gör de?','I dag och i går'],m7:['Klockans visare']};
 const n={};L.forEach(b=>{n[b.subj]=(n[b.subj]||0)+1;b.nr=n[b.subj];b.rev=REV[b.id]||1;if(b.facit!==false)b.facit=true;
  /* svar i hela meningar godtas på läsfrågor och några utvalda sidor (se looseOk i app.js) */
  b.pages.forEach(p=>{if(/^(Frågor om|Läs och svara)/.test(p.t)||(LOOSE[b.id]||[]).includes(p.t))p.b=p.b.replace(/class="tline /g,'class="tline loose ')});if(K[b.id])b.kick=K[b.id]});return L})();
const SOON=[];
/* barnen: KIDS byggs av familjeregistret (family.js) */
