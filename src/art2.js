/* ================= Karaktärer i flera poser + nya motiv ================= */
/* --- Ekorren Ebba (vänd åt höger) --- */
const SQP={
 tail:`<path d="M37 88 C12 90 4 66 13 47 C19 34 15 19 26 11 C37 4 50 11 47.5 24 C45.5 34 35 40 37 54 C39 67 47 75 45 85Z" fill="${C.fox}"/><path d="M35 81 C19 81 13 64 19 50 C24 38 21 25 29.5 17.5 C36 13 42.5 17 41.5 25 C40 33.5 30.5 40 31.5 54 C32.5 66 39 73 38 81Z" fill="${C.foxl}"/>`,
 body:`<path d="M43 89 C35 78 37 58 50 50 C61 43 72 50 74 63 C76 75 72 85 63 89Z" fill="${C.fox}"/><path d="M55 87 C51 78 52 64 59 58 C65 55.5 70 62 70 70 C70 78 67 84 63 87Z" fill="${C.cream}"/><path d="M41 89 C39 82 44 77 51 79 C56 81 57 88 52 90Z" fill="${C.fox2}"/><ellipse cx="57" cy="90" rx="8" ry="3.2" fill="${C.fox2}"/>`,
 head:`<path d="M54 45 C49 33 56 21 67 19.5 C77 18 87 25.5 87.5 35.5 C88 44 81.5 50 72.5 50.5 C64 51 56.5 50.5 54 45Z" fill="${C.fox}"/><path d="M60 25 L56.5 7.5 C63 9 68.5 15 68.5 22Z" fill="${C.fox}"/><path d="M61 22 L59 12.5 C62.5 14 65.5 17.5 65.5 21Z" fill="${C.rose}"/><path d="M56.5 7.5 L54 1.5 M56.5 7.5 L58.6 2" stroke="${C.fox2}" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="79" cy="41" rx="8.5" ry="6.5" fill="${C.cream}"/>${eye(72.5,32.5,3.6)}<circle cx="87" cy="37" r="2.4" fill="${C.ink}"/><ellipse cx="66" cy="42" rx="4" ry="2.6" fill="${C.rose}" opacity=".7"/>`,
 smile:`<path d="M77.5 44.6 C80 46.8 83.2 46.6 85.2 44.4" fill="none" stroke="${C.ink}" stroke-width="1.4" stroke-linecap="round"/>`,
 arm:(d,w=5.6)=>`<path d="${d}" fill="none" stroke="${C.fox2}" stroke-width="${w}" stroke-linecap="round"/>`,
};
function squirrelArt(pose){const P=SQP;let a='';
 if(pose==='hold')a=P.arm('M66 57 C74 56 80 58 82.5 62')+`<g transform="translate(61.5 49) scale(.29)">${ART.acorn}</g>`+P.arm('M60 59 C62.5 64 65.5 66 69 65.5')+`<ellipse cx="69.5" cy="64.5" rx="3.1" ry="3.7" fill="${C.fox2}"/><ellipse cx="82.6" cy="63" rx="2.7" ry="3.5" fill="${C.fox2}"/>`;
 if(pose==='wave')a=P.arm('M62 60 C70 62 79 58 86 50')+`<circle cx="88" cy="46.5" r="4.4" fill="${C.fox2}"/><path d="M86 42 L85 39 M89 42 L89.6 38.8 M91.6 44 L94 42" stroke="${C.fox2}" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="64" cy="67" rx="3.4" ry="3" fill="${C.fox2}"/>`;
 if(pose==='point')a=P.arm('M62 60 C72 62 81 61 89 58')+`<ellipse cx="91.5" cy="57.6" rx="4.2" ry="3.4" fill="${C.fox2}"/><path d="M94.5 56.4 L99 54.6" stroke="${C.fox2}" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="64" cy="67" rx="3.4" ry="3" fill="${C.fox2}"/>`;
 if(pose==='think')a=P.arm('M62 62 C68 64 74 59 76.5 53.5')+`<circle cx="77.5" cy="51" r="3.9" fill="${C.fox2}"/>`;
 return P.tail+P.body+P.head+(pose==='hold'?'':P.smile)+a}
ART.squirrel=squirrelArt('hold');ART.squirrel_wave=squirrelArt('wave');ART.squirrel_point=squirrelArt('point');ART.squirrel_think=squirrelArt('think');

/* --- Ugglan Otto (framifrån) --- */
const OWP={
 tufts:`<path d="M27 31 L21 11 L41 22Z" fill="${C.bark2}"/><path d="M73 31 L79 11 L59 22Z" fill="${C.bark2}"/>`,
 body:`<path d="M21 60 C21 33 34 17 50 17 C66 17 79 33 79 60 C79 80 67 91 50 91 C33 91 21 80 21 60Z" fill="${C.bark}"/>`,
 belly:`<ellipse cx="50" cy="66" rx="19" ry="21" fill="${C.sand}"/>${[[42,58],[50,56],[58,58],[38,66],[46,64],[54,64],[62,66],[42,74],[50,72],[58,74]].map(([x,y])=>`<path d="M${x-2.6} ${y} L${x} ${y+2.6} L${x+2.6} ${y}" fill="none" stroke="${C.bark}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}`,
 face:`<circle cx="39.5" cy="40" r="13.5" fill="${C.cream}"/><circle cx="60.5" cy="40" r="13.5" fill="${C.cream}"/><circle cx="39.5" cy="40" r="8.6" fill="#fff"/><circle cx="60.5" cy="40" r="8.6" fill="#fff"/><circle cx="40.5" cy="41" r="5.8" fill="${C.sun}"/><circle cx="59.5" cy="41" r="5.8" fill="${C.sun}"/><circle cx="41" cy="41.4" r="3.4" fill="${C.ink}"/><circle cx="59" cy="41.4" r="3.4" fill="${C.ink}"/><circle cx="42.2" cy="40" r="1.2" fill="#fff"/><circle cx="60.2" cy="40" r="1.2" fill="#fff"/><path d="M45.5 49 L54.5 49 L50 57.5Z" fill="${C.kant}"/>`,
 wingL:`<path d="M21 56 C13 64 15 80 26 85 C28 73 28 62 24 53Z" fill="${C.bark2}"/>`,
 wingR:`<path d="M79 56 C87 64 85 80 74 85 C72 73 72 62 76 53Z" fill="${C.bark2}"/>`,
 wingRup:`<path d="M76 55 C86 48 93 36 91 24 C88 22 85 25 84 28 C82 38 79 45 73 51Z" fill="${C.bark2}"/><path d="M85 30 L89 27 M83 36 L88 34" stroke="${C.bark}" stroke-width="1.4" stroke-linecap="round"/>`,
 wingLout:`<path d="M24 52 C16 46 6 42 1 32 C9 32 16 34 21 37 C17 33 14 28 13 23 C20 26 25 32 28 40 C28 45 27 49 24 52Z" fill="${C.bark2}"/>`,
 wingRout:`<path d="M76 52 C84 46 94 42 99 32 C91 32 84 34 79 37 C83 33 86 28 87 23 C80 26 75 32 72 40 C72 45 73 49 76 52Z" fill="${C.bark2}"/>`,
 feet:`<path d="M42 90 l-2 4 M45 90 l0 4.4 M55 90 l0 4.4 M58 90 l2 4" stroke="${C.kant}" stroke-width="2.4" stroke-linecap="round"/>`,
 book:`<path d="M33 75 L50 79 L67 75 L67 89 L50 93 L33 89Z" fill="${C.lingon}"/><path d="M50 79 L50 93" stroke="${C.lingon2}" stroke-width="1.6"/><path d="M36 79 L47 81.5 M36 83 L47 85.5 M53 81.5 L64 79 M53 85.5 L64 83" stroke="#fff" stroke-width="1.3" opacity=".75"/><ellipse cx="31" cy="79" rx="5.5" ry="7" fill="${C.bark2}" transform="rotate(-20 31 79)"/><ellipse cx="69" cy="79" rx="5.5" ry="7" fill="${C.bark2}" transform="rotate(20 69 79)"/>`
};
ART.owl=OWP.tufts+OWP.body+OWP.wingL+OWP.wingR+OWP.belly+OWP.face+OWP.feet+OWP.book;
ART.owl_wave=OWP.tufts+OWP.body+OWP.wingL+OWP.wingRup+OWP.belly+OWP.face+OWP.feet;
ART.owl_fly=OWP.tufts+OWP.wingLout+OWP.wingRout+OWP.body+OWP.belly+OWP.face+OWP.feet;

/* --- Räven Ruben (vänd åt höger) --- */
const FXP={
 tail:`<path d="M40 84 C24 88 8 82 10 68 C11 60 18 58 23 62 C27 66 30 72 42 74Z" fill="${C.fox}"/><path d="M10.5 66 C9 72 11 79 17 82 C19 78 19 72 17 66 C15 63 12 63 10.5 66Z" fill="#fff"/>`,
 body:`<path d="M36 89 C33 71 39 54 54 50 C66 47 73 59 73 73 C73 81 71 87 67 90Z" fill="${C.fox}"/><path d="M54 54 C47 62 47 77 51 89 L63 89 C65 76 63 62 59 54Z" fill="#fff"/>`,
 legL:`<path d="M44 76 L42 91 L48 91 L49 78Z" fill="var(--a-foxleg)"/>`,
 legR:`<path d="M60 78 L59 91 L65 91 L66 76Z" fill="var(--a-foxleg)"/>`,
 armUp:`<path d="M58 67 C66 65 74 63 83 62" fill="none" stroke="var(--a-foxleg)" stroke-width="5.6" stroke-linecap="round"/><ellipse cx="85.4" cy="61.6" rx="4" ry="3.3" fill="var(--a-foxleg)"/><path d="M80 75 C84 78 86 82 86 86" fill="none" stroke="${C.fox2}" stroke-width="0" />`,
 head:`<path d="M50 41 C50 30 58 23.5 67 23.5 C75 23.5 81 28 84.5 34 L95 42.5 C93 46.5 89 48.5 84.5 48.5 C78 52.5 66 54.5 58 50.5 C52.5 48 50 45 50 41Z" fill="${C.fox}"/><path d="M64 45 C71 49.5 81 50 88 47.5 C92 46 94.5 44 95 42.5 C88 45 79 45 71 42.5Z" fill="#fff"/><path d="M55.5 31 L53 11 L67.5 24.5Z" fill="${C.fox}"/><path d="M56.5 27 L55.5 16 L63.5 24Z" fill="var(--a-foxleg)"/><path d="M66 25 L71 8.5 L77.5 27Z" fill="${C.fox2}"/><path d="M68.5 24 L71.5 13.5 L75 25Z" fill="var(--a-foxleg)"/><path d="M66.5 34.5 C68.5 32 72 32 73.5 34.5 C72 36 68.5 36 66.5 34.5Z" fill="${C.ink}"/><circle cx="95" cy="42.5" r="2.6" fill="${C.ink}"/>`,
 scarf:`<path d="M51 46 C59 53 71 53.5 80 49 L80.5 55.5 C71.5 60 59 59.5 50.5 52.5Z" fill="${C.berry}"/><path d="M56 53 L53.5 68 L60 68.5 L61.5 54.5Z" fill="${C.berry}"/><path d="M54 59 L60.5 59.5 M53.5 63.5 L60 64" stroke="${C.berry2}" stroke-width="1.4"/>`
};
ART.fox=FXP.tail+FXP.body+FXP.legL+FXP.legR+FXP.head+FXP.scarf;
ART.fox_wave=FXP.tail+FXP.body+FXP.legL+FXP.head+FXP.scarf+FXP.armUp;

/* --- Svalan Siri sittande på gren --- */
ART.swallow_perch=`<path d="M2 80 C28 75 62 77 98 72" fill="none" stroke="${C.bark}" stroke-width="4.2" stroke-linecap="round"/><path d="M80 74 C86 66 94 66 97 70 C92 76 86 77 80 74Z" fill="${C.moss}"/><path d="M14 79 C10 72 3 72 1 75 C4 80 9 81 14 79Z" fill="${C.moss2}"/>
 <path d="M47 70 L37 94 L45.5 79 L49 95 L53 72Z" fill="${C.navy}"/>
 <path d="M51 45 C45 51 43 61 45 69 C49 74 58 74 62 70 C66 60 66 50 62 44Z" fill="${C.navy}"/>
 <path d="M54.5 52 C52.5 60 53.5 68 57 71 C61 70 63.5 62 63.5 54Z" fill="${C.cream}"/>
 <path d="M50 48 C44 56 40.5 66 39 78 C46.5 72 52 62 55 52Z" fill="${C.navy2}"/>
 <circle cx="60" cy="39" r="9.4" fill="${C.navy}"/>
 <path d="M64.5 43.5 C67.5 45.5 67.8 49 64.5 51.2 C61.3 51.4 59.4 48.6 60.2 45.2Z" fill="${C.lingon}"/><path d="M66 32.5 C67.6 32.8 68.6 34 68.8 35.6 L65.5 35.6Z" fill="${C.lingon}"/>
 <path d="M68.6 37.6 L75 39.2 L68.6 40.8Z" fill="${C.ink}"/>
 <circle cx="63.4" cy="37" r="2.5" fill="#fff"/><circle cx="64" cy="37.2" r="1.5" fill="${C.ink}"/>
 <path d="M54 73 L53 77 M59 73 L59.5 76.5" stroke="${C.ink}" stroke-width="1.6" stroke-linecap="round"/>`;

/* --- Björk för scener (i scenens egna enheter) --- */
function birchTree(x,b,h,seed=1){const r=rng(seed*13+Math.round(x)),tw=h*.07,top=b-h*.78;let s=`<path d="M${x-tw/2} ${b} L${x-tw*.32} ${top} L${x+tw*.32} ${top} L${x+tw/2} ${b}Z" fill="#F3F0E8"/>`;
 for(let y=top+h*.06;y<b-3;y+=h*(.06+r()*.05)){const w=tw*(.3+r()*.4),left=r()<.5;s+=`<rect x="${(left?x-tw*.45:x+tw*.45-w).toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${(h*.014+.6).toFixed(1)}" rx=".6" fill="var(--a-ink)" opacity=".78"/>`}
 s+=`<path d="M${x} ${top+h*.08} L${x-h*.16} ${top-h*.02} M${x} ${top+h*.16} L${x+h*.17} ${top+h*.06} M${x} ${top+h*.02} L${x+h*.08} ${top-h*.12}" stroke="var(--a-ink)" stroke-width="${(h*.012+.4).toFixed(1)}" stroke-linecap="round" opacity=".7"/>`;
 const cols=['#B9CF7C','#A5C26B','#CADB92','#98B962'];for(let i=0;i<9;i++){const a=r()*Math.PI*2,d=r()*h*.17;s+=`<ellipse cx="${(x+Math.cos(a)*d*1.15).toFixed(1)}" cy="${(top-h*.06+Math.sin(a)*d*.8).toFixed(1)}" rx="${(h*(.09+r()*.06)).toFixed(1)}" ry="${(h*(.08+r()*.05)).toFixed(1)}" fill="${cols[i%4]}"/>`}
 return s}

/* --- Gården --- */
ART.hen=`<path d="M70 66 C80 60 86 48 82 38 C90 44 92 56 88 64 C84 70 76 72 70 70Z" fill="${C.bark}"/><path d="M74 62 C82 56 86 46 84 40" fill="none" stroke="${C.bark2}" stroke-width="1.6"/>
 <path d="M44 86 L42 94 M56 86 L57 94 M39 94 L45 94 M54 94 L60 94" stroke="${C.kant}" stroke-width="2.4" stroke-linecap="round"/>
 <path d="M24 56 C24 40 32 28 40 28 C48 28 50 40 54 46 C62 46 76 52 76 64 C76 78 64 88 50 88 C34 88 24 74 24 56Z" fill="${C.cream}"/>
 <path d="M44 62 C52 58 64 60 68 68 C62 76 50 76 44 70Z" fill="${C.cream2}"/>
 <path d="M34 26 C34 20 38 18 40 22 C41 17 46 17 46 22 C49 20 51 24 48 28 L36 29Z" fill="${C.lingon}"/>
 <path d="M24 40 L15 43 L24 46Z" fill="${C.kant}"/><path d="M26 47 C22 49 22 55 26 56 C28 53 28 49 26 47Z" fill="${C.lingon}"/>
 ${eye(31,38,2.4)}`;
ART.cow=`<path d="M26 70 L26 90 M36 72 L36 90 M66 72 L66 90 M76 70 L76 90" stroke="${C.grey2}" stroke-width="6" stroke-linecap="round"/>
 <path d="M84 48 C92 52 92 62 89 68" fill="none" stroke="${C.grey2}" stroke-width="2.2" stroke-linecap="round"/><path d="M89 66 C86 70 88 74 91 74" fill="none" stroke="${C.ink}" stroke-width="3.4" stroke-linecap="round"/>
 <path d="M22 50 C22 42 28 38 36 38 L74 38 C80 38 84 44 84 52 L84 66 C84 72 80 76 74 76 L32 76 C26 76 22 72 22 66Z" fill="#F3EEE6"/>
 <path d="M44 38 C50 46 48 56 40 58 C34 56 34 46 36 38Z" fill="${C.ink}"/><path d="M62 50 C70 46 78 50 76 60 C70 66 60 62 62 50Z" fill="${C.ink}"/>
 <path d="M60 76 C60 82 68 82 68 76Z" fill="${C.rose}"/>
 <path d="M12 26 C8 20 8 15 11 12 M28 26 C32 20 32 15 29 12" fill="none" stroke="${C.sand}" stroke-width="3.4" stroke-linecap="round"/>
 <path d="M4 32 L-1 28 L5 37Z M36 32 L41 28 L35 37Z" fill="#F3EEE6"/>
 <path d="M6 34 C6 26 12 22 20 22 C28 22 34 26 34 34 L34 48 C34 56 28 60 20 60 C12 60 6 56 6 48Z" fill="#F3EEE6"/>
 <path d="M20 22 C26 22 30 26 30 32 C26 34 22 30 20 22Z" fill="${C.ink}"/>
 <ellipse cx="20" cy="52" rx="12" ry="8" fill="${C.rose}"/><circle cx="15.5" cy="52" r="1.7" fill="${C.ink}"/><circle cx="24.5" cy="52" r="1.7" fill="${C.ink}"/>
 ${eye(14,37,2.5)}${eye(26,37,2.5)}`;
ART.pig=`<path d="M28 74 L27 88 M38 76 L38 88 M62 76 L62 88 M72 74 L73 88" stroke="#E08E96" stroke-width="6" stroke-linecap="round"/>
 <path d="M84 52 C92 50 92 60 88 58 C85 57 88 52 92 54" fill="none" stroke="#E08E96" stroke-width="2.4" stroke-linecap="round"/>
 <ellipse cx="54" cy="58" rx="32" ry="22" fill="${C.rose}"/>
 <path d="M64 40 C78 42 86 52 86 60 C86 72 76 80 62 80 C74 72 76 56 64 40Z" fill="#E08E96" opacity=".5"/>
 <circle cx="24" cy="52" r="16" fill="${C.rose}"/>
 <path d="M16 38 L12 26 L26 34Z M30 36 L34 25 L38 38Z" fill="#E08E96"/>
 <ellipse cx="13" cy="56" rx="7" ry="8.5" fill="#E08E96"/><ellipse cx="11" cy="54" rx="1.4" ry="2.4" fill="${C.ink}" opacity=".6"/><ellipse cx="15" cy="58" rx="1.4" ry="2.4" fill="${C.ink}" opacity=".6"/>
 ${eye(24,46,2.4)}`;
ART.sheep=`<path d="M30 72 L30 90 M40 74 L40 90 M62 74 L62 90 M72 72 L72 90" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>
 ${[[34,48,14],[50,42,15],[66,46,14],[76,58,12],[66,70,13],[48,72,14],[30,66,13],[24,56,11]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#EFE8DB"/>`).join('')}<ellipse cx="50" cy="58" rx="26" ry="18" fill="#F7F2E9"/>${[[38,50],[54,48],[64,58],[46,64],[32,60]].map(([x,y])=>`<path d="M${x} ${y} c2 -3 6 -3 7 0" fill="none" stroke="#E2D7C5" stroke-width="1.6" stroke-linecap="round"/>`).join('')}
 <ellipse cx="16" cy="46" rx="10" ry="13" fill="${C.grey2}"/><path d="M8 40 C2 40 0 44 2 46 C6 46 8 44 9 42Z M22 38 C28 36 31 39 29 42 C26 42 24 41 22 40Z" fill="${C.grey2}"/>
 <circle cx="12" cy="44" r="2" fill="#fff"/><circle cx="12.4" cy="44.2" r="1.2" fill="${C.ink}"/>`;

/* --- Svensk natur och världens djur --- */
ART.moose=`<g transform="translate(-2 6) scale(.9)"><path d="M28 64 L26 92 M36 66 L36 92 M62 66 L62 92 M70 64 L72 92" stroke="${C.bark2}" stroke-width="5.4" stroke-linecap="round"/>
 <path d="M20 52 C20 42 30 36 42 38 L64 38 C72 38 76 44 74 54 L72 64 C70 70 64 72 58 72 L32 72 C24 72 20 64 20 58Z" fill="${C.bark}"/>
 <path d="M56 38 C62 30 70 30 74 36 L74 48Z" fill="${C.bark2}" opacity=".55"/>
 <path d="M68 40 C72 30 80 28 84 32 C88 36 92 46 96 54 C98 60 94 64 88 62 C82 60 76 54 70 50Z" fill="${C.bark}"/>
 <path d="M90 52 C96 54 98 60 95 63 C91 64 88 60 88 56Z" fill="${C.bark2}"/><circle cx="93" cy="57" r="1.4" fill="${C.ink}"/>
 <path d="M80 58 C80 64 78 68 75 70" stroke="${C.bark2}" stroke-width="3.4" stroke-linecap="round" fill="none"/>
 <path d="M77 32 C72 24 64 18 56 20 C58 23 62 25 65 26 C60 27 56 30 55 33 C62 33 69 33 76 34Z" fill="${C.sand}"/>
 <path d="M83 30 C86 20 93 14 99 15 C98 19 95 22 92 24 C96 24 99 26 99 29 C94 30 89 30 84 32Z" fill="${C.sand}"/>
 ${eye(82,40,2.1)}</g>`;
ART.hedgehog=`<path d="M14 72 C12 52 26 36 46 34 C66 32 82 44 84 62 C84 70 80 74 74 74 L22 74 C18 74 14 74 14 72Z" fill="${C.bark2}"/>
 ${Array.from({length:11},(_,i)=>{const a=Math.PI*(1.05+i*.09),x=48+Math.cos(a)*36,y=66+Math.sin(a)*30;return `<path d="M${(48+Math.cos(a)*24).toFixed(1)} ${(66+Math.sin(a)*20).toFixed(1)} L${x.toFixed(1)} ${(y-4).toFixed(1)} L${(48+Math.cos(a+.12)*26).toFixed(1)} ${(66+Math.sin(a+.12)*21).toFixed(1)}Z" fill="${C.bark}"/>`}).join('')}
 <path d="M64 50 C76 48 90 56 94 66 C90 72 80 76 68 74 C62 70 60 58 64 50Z" fill="${C.sand}"/>
 <circle cx="94" cy="65" r="3" fill="${C.ink}"/>${eye(78,58,2.4)}
 <path d="M30 74 L30 80 M44 74 L44 80 M60 74 L60 80" stroke="${C.bark2}" stroke-width="4" stroke-linecap="round"/>`;
ART.hare=`<path d="M48 30 C44 14 46 4 50 4 C54 4 56 16 54 30Z" fill="${C.sand}"/><path d="M58 30 C60 14 66 6 70 8 C72 12 66 22 62 32Z" fill="${C.sand}"/><path d="M49.5 26 C48 16 49 9 50.5 9 C52 9 52.5 17 52 26Z" fill="${C.rose}"/>
 <path d="M30 88 C24 70 32 52 48 50 C64 48 76 60 76 76 C76 84 72 88 66 90Z" fill="${C.sand}"/>
 <circle cx="26" cy="78" r="7" fill="#fff"/>
 <path d="M42 46 C40 34 48 26 58 28 C68 30 72 40 68 48 C64 54 52 56 46 52Z" fill="${C.sand}"/>
 <ellipse cx="62" cy="46" rx="5" ry="4" fill="#fff"/><circle cx="66" cy="43" r="1.8" fill="${C.rose}"/>${eye(57,38,2.4)}
 <path d="M50 88 C52 84 60 84 64 88 Z" fill="${C.cream2}"/>`;
ART.bear=`<circle cx="28" cy="22" r="9" fill="${C.bark}"/><circle cx="72" cy="22" r="9" fill="${C.bark}"/><circle cx="28" cy="22" r="4.5" fill="${C.nut2}"/><circle cx="72" cy="22" r="4.5" fill="${C.nut2}"/>
 <path d="M24 90 C18 76 22 58 50 56 C78 58 82 76 76 90Z" fill="${C.bark}"/><ellipse cx="50" cy="76" rx="14" ry="13" fill="${C.nut}"/>
 <circle cx="50" cy="38" r="22" fill="${C.bark}"/><ellipse cx="50" cy="46" rx="10" ry="8" fill="${C.nut}"/><ellipse cx="50" cy="42.5" rx="4" ry="3" fill="${C.ink}"/>
 <path d="M46 49 C48 51 52 51 54 49" fill="none" stroke="${C.ink}" stroke-width="1.4" stroke-linecap="round"/>${eye(41,34,2.6)}${eye(59,34,2.6)}
 <ellipse cx="32" cy="88" rx="8" ry="5" fill="${C.bark2}"/><ellipse cx="68" cy="88" rx="8" ry="5" fill="${C.bark2}"/>`;
ART.frog=`<path d="M14 80 C14 62 30 50 50 50 C70 50 86 62 86 80 C86 86 80 88 74 88 L26 88 C20 88 14 86 14 80Z" fill="${C.moss}"/>
 <path d="M30 70 C38 76 62 76 70 70 C66 82 34 82 30 70Z" fill="${C.moss2}"/>
 <circle cx="34" cy="46" r="11" fill="${C.moss}"/><circle cx="66" cy="46" r="11" fill="${C.moss}"/><circle cx="34" cy="45" r="7" fill="#fff"/><circle cx="66" cy="45" r="7" fill="#fff"/><circle cx="35" cy="46" r="3.6" fill="${C.ink}"/><circle cx="65" cy="46" r="3.6" fill="${C.ink}"/>
 <path d="M36 62 C44 68 56 68 64 62" fill="none" stroke="${C.mossd}" stroke-width="2.2" stroke-linecap="round"/>
 <path d="M10 88 L22 82 M90 88 L78 82" stroke="${C.mossd}" stroke-width="4" stroke-linecap="round"/>`;
ART.lion=`${Array.from({length:14},(_,i)=>{const a=i*Math.PI/7;return `<ellipse cx="${(50+30*Math.cos(a)).toFixed(1)}" cy="${(48+30*Math.sin(a)).toFixed(1)}" rx="13" ry="11" fill="${i%2?C.fox2:C.fox}" transform="rotate(${(a*180/Math.PI).toFixed(0)} ${(50+30*Math.cos(a)).toFixed(1)} ${(48+30*Math.sin(a)).toFixed(1)})"/>`}).join('')}
 <circle cx="30" cy="26" r="6" fill="${C.sun}"/><circle cx="70" cy="26" r="6" fill="${C.sun}"/>
 <circle cx="50" cy="50" r="24" fill="${C.sun}"/><ellipse cx="50" cy="60" rx="12" ry="9" fill="${C.sunl}"/>
 <path d="M45 54 L55 54 L50 59Z" fill="${C.bark2}"/><path d="M50 59 C50 63 46 64 44 62 M50 59 C50 63 54 64 56 62" fill="none" stroke="${C.bark2}" stroke-width="1.4" stroke-linecap="round"/>${eye(41,45,2.8)}${eye(59,45,2.8)}`;
ART.panda=`<circle cx="26" cy="24" r="11" fill="${C.ink}"/><circle cx="74" cy="24" r="11" fill="${C.ink}"/>
 <circle cx="50" cy="52" r="34" fill="#fff"/><circle cx="50" cy="52" r="34" fill="none" stroke="${C.grey}" stroke-width="1.4"/>
 <ellipse cx="37" cy="48" rx="9" ry="11" fill="${C.ink}" transform="rotate(-25 37 48)"/><ellipse cx="63" cy="48" rx="9" ry="11" fill="${C.ink}" transform="rotate(25 63 48)"/>
 <circle cx="38" cy="47" r="3" fill="#fff"/><circle cx="62" cy="47" r="3" fill="#fff"/><circle cx="38.5" cy="47.5" r="1.6" fill="${C.ink}"/><circle cx="61.5" cy="47.5" r="1.6" fill="${C.ink}"/>
 <ellipse cx="50" cy="63" rx="5" ry="3.6" fill="${C.ink}"/><path d="M44 70 C47 73 53 73 56 70" fill="none" stroke="${C.ink}" stroke-width="1.6" stroke-linecap="round"/>`;
ART.penguin=`<path d="M50 8 C70 8 80 30 80 56 C80 80 68 92 50 92 C32 92 20 80 20 56 C20 30 30 8 50 8Z" fill="${C.navy}"/>
 <path d="M50 30 C62 30 68 46 68 62 C68 80 60 88 50 88 C40 88 32 80 32 62 C32 46 38 30 50 30Z" fill="#fff"/>
 <path d="M20 50 C10 58 8 70 12 76 C18 72 22 64 22 56Z M80 50 C90 58 92 70 88 76 C82 72 78 64 78 56Z" fill="${C.navy}"/>
 ${eye(42,24,2.6)}${eye(58,24,2.6)}<path d="M44 30 L56 30 L50 38Z" fill="${C.kant}"/>
 <ellipse cx="40" cy="92" rx="8" ry="3.4" fill="${C.kant}"/><ellipse cx="60" cy="92" rx="8" ry="3.4" fill="${C.kant}"/>`;
ART.kangaroo=`<path d="M38 74 C22 80 10 88 2 94" fill="none" stroke="${C.nut2}" stroke-width="7" stroke-linecap="round"/>
 <path d="M34 84 C28 66 34 46 50 42 C64 40 72 54 70 70 C68 82 60 88 50 88Z" fill="${C.nut}"/>
 <path d="M48 64 C52 60 60 62 62 70 C58 76 50 76 48 70Z" fill="${C.sand}"/>
 <path d="M40 86 L58 92 L60 88 L46 82Z" fill="${C.nut2}"/>
 <path d="M58 52 C64 54 68 58 70 62" fill="none" stroke="${C.nut2}" stroke-width="4" stroke-linecap="round"/>
 <path d="M52 44 C50 30 56 20 66 20 C74 20 80 26 82 32 L90 36 C88 40 84 42 80 42 C74 46 62 48 56 46Z" fill="${C.nut}"/>
 <path d="M58 24 L54 6 C60 8 64 14 64 22Z M66 21 L66 4 C72 8 74 14 72 22Z" fill="${C.nut}"/><path d="M58.5 20 L56.5 11 C59.5 12 61.5 15 61.5 20Z" fill="${C.rose}"/>
 <circle cx="89.5" cy="36" r="2.2" fill="${C.ink}"/>${eye(70,30,2.4)}`;
ART.parrot=`<path d="M46 74 L38 98 L44 96 L50 76Z" fill="${C.blue}"/><path d="M52 74 L56 98 L50 98 L48 76Z" fill="${C.sun}"/>
 <path d="M34 50 C34 30 46 18 58 20 C68 22 72 32 70 44 C68 58 62 72 50 78 C40 76 34 64 34 50Z" fill="${C.lingon}"/>
 <path d="M38 52 C44 46 56 48 62 58 C58 70 50 76 44 74 C38 70 36 60 38 52Z" fill="${C.moss}"/><path d="M42 62 C48 60 54 64 56 70 C52 74 46 74 42 70Z" fill="${C.blue}"/>
 <circle cx="60" cy="32" r="7" fill="#fff"/><circle cx="61" cy="32" r="2.8" fill="${C.ink}"/>
 <path d="M68 34 C78 32 82 40 78 48 C76 44 72 42 68 42Z" fill="${C.ink}"/><path d="M68 38 C74 38 76 42 74 46 C72 44 70 43 68 43Z" fill="${C.grey2}"/>
 <path d="M30 84 L72 84" stroke="${C.bark}" stroke-width="4" stroke-linecap="round"/>`;
ART.elephant=`<path d="M30 66 L30 90 M42 68 L42 90 M64 68 L64 90 M76 66 L76 90" stroke="${C.grey2}" stroke-width="8" stroke-linecap="round"/>
 <path d="M24 56 C24 38 38 30 54 30 C72 30 84 40 84 58 C84 70 76 74 66 74 L36 74 C28 74 24 68 24 56Z" fill="${C.grey}"/>
 <path d="M84 52 C88 50 90 54 88 58" fill="none" stroke="${C.grey2}" stroke-width="2" stroke-linecap="round"/>
 <path d="M28 46 C20 46 12 52 12 62 C12 72 8 78 4 82 C8 84 14 80 16 74 C18 66 22 62 28 62Z" fill="${C.grey}"/>
 <path d="M32 34 C22 34 16 44 20 54 C26 60 38 56 40 46 C40 40 38 36 32 34Z" fill="${C.grey2}" opacity=".55"/>
 ${eye(22,44,2.4)}<path d="M16 54 C14 58 16 60 18 60" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;

/* --- Mat, kläder, väder, känslor, saker --- */
ART.banana=`<path d="M20 30 C18 60 40 84 76 80 C82 79 84 74 80 72 C50 74 32 58 30 30 C29 24 21 24 20 30Z" fill="${C.sun}"/><path d="M30 34 C32 58 50 72 78 74 C82 76 80 79 76 80 C44 82 22 62 22 36Z" fill="${C.kant}" opacity=".35"/><path d="M22 28 L22 20 L28 20 L28 28Z" fill="${C.bark2}"/><circle cx="79" cy="76" r="2.4" fill="${C.bark2}"/>`;
ART.bread=`<path d="M10 64 C10 44 28 32 50 32 C72 32 90 44 90 64 C90 72 84 76 76 76 L24 76 C16 76 10 72 10 64Z" fill="${C.nut}"/><path d="M10 64 C10 72 16 76 24 76 L76 76 C84 76 90 72 90 64 C80 70 20 70 10 64Z" fill="${C.nut2}"/>
 <path d="M28 44 C32 50 32 56 30 62 M44 38 C48 46 48 54 46 62 M60 38 C64 46 64 54 62 62 M74 44 C78 50 78 56 76 60" fill="none" stroke="${C.cream}" stroke-width="2.6" stroke-linecap="round" opacity=".8"/>`;
ART.milk=`<path d="M30 30 L70 30 L74 40 L74 90 L26 90 L26 40Z" fill="#fff"/><path d="M30 30 L50 14 L70 30Z" fill="${C.blue}"/><path d="M26 40 L74 40 L74 54 L26 54Z" fill="${C.blue}"/><path d="M26 40 L74 40" stroke="${C.blue2}" stroke-width="1.4"/>
 <path d="M48 64 C40 66 40 78 50 80 C60 78 60 66 52 64" fill="none" stroke="${C.blue}" stroke-width="2.4" stroke-linecap="round"/><path d="M26 40 L74 40 L74 90 L26 90Z" fill="none" stroke="${C.cream2}" stroke-width="1.4"/><path d="M56 30 L70 30 L74 40 L74 90 L60 90Z" fill="#000" opacity=".06"/>`;
ART.icecream=`<path d="M34 48 L50 94 L66 48Z" fill="${C.nut}"/><path d="M38 56 L58 76 M44 50 L62 66 M38 66 L52 52 M42 78 L60 58" stroke="${C.nut2}" stroke-width="1.6" stroke-linecap="round"/>
 <circle cx="40" cy="42" r="13" fill="${C.rose}"/><circle cx="60" cy="42" r="13" fill="${C.cream}"/><circle cx="50" cy="28" r="14" fill="#9C6B4A"/><circle cx="50" cy="12" r="5" fill="${C.lingon}"/>${hi(45,24,4,2.6,-30,.4)}`;
ART.cookie=`<circle cx="50" cy="52" r="36" fill="${C.nut}"/><circle cx="50" cy="52" r="36" fill="none" stroke="${C.nut2}" stroke-width="2"/>${[[36,40],[58,34],[64,56],[44,62],[32,54],[54,48],[52,72],[70,44]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2.8" fill="#6A4B36"/>`).join('')}`;
ART.carrot=`<path d="M40 30 C32 18 32 10 36 8 C40 12 42 20 44 28Z M50 28 C48 14 52 6 56 6 C58 12 56 20 54 28Z M58 30 C64 18 70 14 74 16 C72 22 66 28 60 32Z" fill="${C.moss}"/>
 <path d="M38 30 C46 26 60 26 64 32 C62 52 56 76 50 92 C44 76 38 52 38 30Z" fill="${C.kant}"/><path d="M44 42 L50 42 M46 56 L52 56 M48 70 L52 70" stroke="${C.fox2}" stroke-width="1.6" stroke-linecap="round"/>`;
ART.cheese=`<path d="M10 70 L80 40 L90 70Z" fill="${C.sun}"/><path d="M10 70 L90 70 L90 82 L10 82Z" fill="${C.kant}"/><path d="M80 40 L90 70" stroke="${C.kant}" stroke-width="1.4"/><circle cx="40" cy="62" r="4" fill="${C.kant}" opacity=".6"/><circle cx="62" cy="58" r="3" fill="${C.kant}" opacity=".6"/><circle cx="74" cy="76" r="3.2" fill="#D98C2C"/><circle cx="30" cy="76" r="2.6" fill="#D98C2C"/>`;
ART.bun=`<path d="M14 62 C14 42 30 30 50 30 C70 30 86 42 86 62 C86 72 74 78 50 78 C26 78 14 72 14 62Z" fill="${C.nut}"/><path d="M50 50 C42 50 40 58 46 60 C54 62 58 52 52 46 C44 40 32 48 34 58 C36 68 52 72 62 64 C70 56 66 42 56 38" fill="none" stroke="${C.bark2}" stroke-width="3" stroke-linecap="round"/>${[[30,46],[40,38],[58,36],[70,46],[72,60],[28,62],[60,70]].map(([x,y])=>`<rect x="${x}" y="${y}" width="3" height="2" rx="1" fill="#fff" transform="rotate(${x*7} ${x} ${y})"/>`).join('')}`;
ART.hat=`<path d="M18 70 C18 44 32 28 50 28 C68 28 82 44 82 70Z" fill="${C.lingon}"/><path d="M30 34 L30 70 M42 29 L42 70 M58 29 L58 70 M70 34 L70 70" stroke="${C.lingon2}" stroke-width="2" opacity=".5"/>
 <rect x="14" y="66" width="72" height="16" rx="6" fill="${C.cream}"/><path d="M20 72 L80 72 M20 77 L80 77" stroke="${C.cream2}" stroke-width="1.6"/><circle cx="50" cy="22" r="10" fill="${C.cream}"/>`;
ART.mitten=`<path d="M30 80 L30 40 C30 24 40 14 52 14 C64 14 72 24 72 38 L72 80Z" fill="${C.blue}"/><path d="M30 52 C20 48 14 40 18 34 C22 30 28 32 32 38Z" fill="${C.blue}"/>
 <rect x="26" y="74" width="50" height="16" rx="5" fill="${C.cream}"/><path d="M38 34 L46 42 L54 34 L62 42 M38 50 L46 58 L54 50 L62 58" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
ART.sock=`<path d="M36 10 L66 10 L66 56 C66 62 70 66 76 70 C86 76 86 90 72 92 L44 92 C34 92 30 84 34 76 C36 70 36 64 36 58Z" fill="${C.moss}"/><rect x="34" y="8" width="34" height="12" rx="3" fill="${C.cream}"/>
 <path d="M36 32 L66 32 M36 44 L66 44" stroke="#fff" stroke-width="4"/><path d="M66 84 C72 86 78 86 80 82 C82 88 78 92 72 92 L60 92 C60 88 62 86 66 84Z" fill="${C.mossd}"/>`;
ART.boot=`<path d="M30 12 L58 12 L58 60 C68 62 82 66 86 76 L86 86 L24 86 L24 60 C24 40 28 24 30 12Z" fill="${C.sun}"/><path d="M24 80 L86 80 L86 90 L24 90Z" fill="${C.kant}"/><rect x="28" y="10" width="32" height="8" rx="3" fill="${C.kant}"/><path d="M34 26 C34 40 34 50 32 60" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5" fill="none"/>`;
ART.tshirt=`<path d="M34 14 C38 20 62 20 66 14 L88 24 L80 42 L70 38 L70 88 L30 88 L30 38 L20 42 L12 24Z" fill="${C.blue}"/><path d="M36 15 C40 24 60 24 64 15" fill="none" stroke="${C.blue2}" stroke-width="3"/><path d="M44 48 L50 56 L56 48" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
ART.scarf=`<path d="M20 30 C40 40 60 40 80 30 L82 44 C60 54 40 54 18 44Z" fill="${C.lingon}"/><path d="M58 44 L54 90 L70 90 L72 42Z" fill="${C.lingon}"/><path d="M56 60 L71 60 M55 72 L70 72" stroke="#fff" stroke-width="3" opacity=".8"/><path d="M54 90 L54 96 M58 90 L58 96 M62 90 L62 96 M66 90 L66 96 M70 90 L70 96" stroke="${C.lingon}" stroke-width="2" stroke-linecap="round"/>`;
ART.umbrella=`<path d="M50 50 L50 84 C50 92 40 92 40 84" fill="none" stroke="${C.ink}" stroke-width="3.4" stroke-linecap="round"/><path d="M8 50 C10 26 28 12 50 12 C72 12 90 26 92 50 C86 44 78 44 72 50 C66 44 56 44 50 50 C44 44 34 44 28 50 C22 44 14 44 8 50Z" fill="${C.lingon}"/><path d="M50 12 C40 22 30 36 28 50 M50 12 C60 22 70 36 72 50" fill="none" stroke="${C.lingon2}" stroke-width="1.6"/><path d="M50 12 L50 6" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`;
ART.rain=ART.cloud.replace(/var\(--a-white\)/,'#E2EAF0')+`${[[30,78],[46,84],[62,78],[38,92],[56,94],[72,88]].map(([x,y])=>`<path d="M${x} ${y} C${x-3} ${y+4} ${x-1} ${y+7} ${x} ${y+7} C${x+1} ${y+7} ${x+3} ${y+4} ${x} ${y}Z" fill="${C.blue}"/>`).join('')}`;
ART.snow=`${[0,60,120].map(a=>`<g transform="rotate(${a} 50 50)"><path d="M50 10 L50 90" stroke="${C.blue}" stroke-width="5" stroke-linecap="round"/><path d="M50 24 L40 16 M50 24 L60 16 M50 76 L40 84 M50 76 L60 84" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/></g>`).join('')}<circle cx="50" cy="50" r="6" fill="${C.bluel}"/>`;
const face=(mouth,brows='',eyes=null)=>`<circle cx="50" cy="50" r="40" fill="${C.sun}"/><path d="M76 22 A40 40 0 0 1 50 90 A40 40 0 0 0 76 22Z" fill="${C.kant}" opacity=".25"/>${eyes||`<ellipse cx="36" cy="44" rx="4.4" ry="5.6" fill="${C.ink}"/><ellipse cx="64" cy="44" rx="4.4" ry="5.6" fill="${C.ink}"/><circle cx="37.4" cy="42" r="1.5" fill="#fff"/><circle cx="65.4" cy="42" r="1.5" fill="#fff"/>`}${brows}${mouth}`;
ART.happy=face(`<path d="M30 60 C38 76 62 76 70 60 C60 64 40 64 30 60Z" fill="${C.ink}"/><circle cx="26" cy="58" r="5" fill="${C.rose}" opacity=".7"/><circle cx="74" cy="58" r="5" fill="${C.rose}" opacity=".7"/>`);
ART.sad=face(`<path d="M34 72 C42 62 58 62 66 72" fill="none" stroke="${C.ink}" stroke-width="3.6" stroke-linecap="round"/><path d="M68 52 C66 58 66 62 69 62 C72 62 72 58 68 52Z" fill="${C.blue}"/>`,`<path d="M28 34 L42 30 M58 30 L72 34" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round"/>`);
ART.angry=face(`<path d="M36 70 C44 64 56 64 64 70" fill="none" stroke="${C.ink}" stroke-width="3.6" stroke-linecap="round"/>`,`<path d="M27 32 L43 38 M73 32 L57 38" stroke="${C.ink}" stroke-width="3.2" stroke-linecap="round"/>`).replace(C.sun,C.foxl);
ART.sleepy=face(`<ellipse cx="50" cy="68" rx="5" ry="6" fill="${C.ink}"/><text x="74" y="26" font-size="14" font-family="Andika,sans-serif" font-weight="700" fill="${C.berry}">z</text><text x="84" y="14" font-size="10" font-family="Andika,sans-serif" font-weight="700" fill="${C.berry}">z</text>`,'',`<path d="M30 46 C34 50 40 50 44 46 M56 46 C60 50 66 50 70 46" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`);
ART.surprised=face(`<ellipse cx="50" cy="68" rx="7" ry="9" fill="${C.ink}"/>`,`<path d="M28 30 C32 26 40 26 44 30 M56 30 C60 26 68 26 72 30" fill="none" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round"/>`);
ART.pencil=`<path d="M18 82 L22 66 L70 18 L82 30 L34 78Z" fill="${C.sun}"/><path d="M22 66 L34 78 L18 82Z" fill="${C.sand}"/><path d="M18 82 L20.5 74 L26 79.5Z" fill="${C.ink}"/><path d="M70 18 L76 12 C79 9 85 15 88 18 C91 21 85 27 82 30Z" fill="${C.rose}"/><path d="M64 24 L76 36" stroke="${C.grey}" stroke-width="4"/><path d="M28 60 L62 26" stroke="${C.kant}" stroke-width="2" opacity=".6"/>`;
ART.book=`<path d="M8 26 C22 22 38 24 50 32 C62 24 78 22 92 26 L92 80 C78 76 62 78 50 86 C38 78 22 76 8 80Z" fill="${C.lingon}"/><path d="M12 26 C24 23 38 25 50 32 L50 82 C38 75 24 73 12 76Z" fill="#fff"/><path d="M88 26 C76 23 62 25 50 32 L50 82 C62 75 76 73 88 76Z" fill="${C.cream}"/>
 <path d="M18 36 L42 40 M18 44 L42 48 M18 52 L42 56 M58 40 L82 36 M58 48 L82 44 M58 56 L82 52" stroke="${C.grey}" stroke-width="2" stroke-linecap="round"/>`;
ART.bike=`${[24,76].map(x=>`<circle cx="${x}" cy="64" r="17" fill="none" stroke="${C.ink}" stroke-width="4"/><circle cx="${x}" cy="64" r="2.6" fill="${C.ink}"/>`).join('')}<path d="M24 64 L40 40 L66 40 L76 64 M40 40 L52 64 L66 40 M52 64 L24 64" fill="none" stroke="${C.lingon}" stroke-width="4" stroke-linejoin="round"/><path d="M36 34 L46 34 M64 40 L62 30 L70 28" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`;
ART.train=`<rect x="10" y="40" width="58" height="34" rx="4" fill="${C.lingon}"/><rect x="50" y="20" width="26" height="54" rx="4" fill="${C.lingon2}"/><rect x="55" y="26" width="16" height="14" rx="2" fill="${C.sky}"/><rect x="18" y="26" width="10" height="16" fill="${C.ink}"/><path d="M14 22 C14 14 26 12 26 20 C32 14 40 20 34 24Z" fill="${C.grey}"/>
 <path d="M76 66 L90 74 L76 74Z" fill="${C.ink}"/>${[24,48,66].map(x=>`<circle cx="${x}" cy="78" r="9" fill="${C.ink}"/><circle cx="${x}" cy="78" r="3.4" fill="${C.grey}"/>`).join('')}<rect x="16" y="50" width="26" height="4" fill="${C.sun}"/>`;
ART.flag_se=`<rect x="8" y="22" width="84" height="56" rx="3" fill="#2F6CAB"/><rect x="32" y="22" width="12" height="56" fill="#F2C744"/><rect x="8" y="44" width="84" height="12" fill="#F2C744"/>`;
ART.basket=`<path d="M14 46 L86 46 L78 86 C64 90 36 90 22 86Z" fill="${C.nut}"/><path d="M14 46 L86 46 L84 54 L16 54Z" fill="${C.nut2}"/><path d="M28 54 L32 86 M44 54 L46 88 M56 54 L54 88 M72 54 L68 86 M20 66 L80 66 M22 76 L78 76" stroke="${C.nut2}" stroke-width="1.6"/><path d="M26 46 C26 20 74 20 74 46" fill="none" stroke="${C.bark}" stroke-width="4"/>`;
ART.mushroom2=`<path d="M42 54 C42 68 40 80 38 88 C46 91 56 91 62 88 C60 80 58 68 58 54Z" fill="${C.cream}"/><path d="M14 56 C14 36 30 24 50 24 C70 24 86 36 86 56 C70 60 30 60 14 56Z" fill="${C.nut}"/><path d="M60 26 C76 32 86 42 86 56 C80 58 74 58 70 58 C74 46 70 34 60 26Z" fill="${C.nut2}" opacity=".6"/>`;
/* parameterritning: klocka, mynt, sedlar, linjal */
function clockSvg(h,m,{w=20,hands=true,num=true}={}){const a=(m/60)*360,b=((h%12)+m/60)*30;let s=`<svg class="ic" viewBox="0 0 100 100" style="width:${w}cqw;height:${w}cqw" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="var(--a-lingon)"/><circle cx="50" cy="50" r="40" fill="#fff"/>`;
 for(let i=0;i<60;i++){const r=i%5?37.5:35,an=i*6*Math.PI/180;s+=`<line x1="${(50+39*Math.sin(an)).toFixed(2)}" y1="${(50-39*Math.cos(an)).toFixed(2)}" x2="${(50+r*Math.sin(an)).toFixed(2)}" y2="${(50-r*Math.cos(an)).toFixed(2)}" stroke="var(--ink)" stroke-width="${i%5?.7:1.8}" stroke-linecap="round"/>`}
 if(num)for(let i=1;i<=12;i++){const an=i*30*Math.PI/180;s+=`<text x="${(50+26.5*Math.sin(an)).toFixed(1)}" y="${(50-26.5*Math.cos(an)+3.4).toFixed(1)}" font-size="9.4" text-anchor="middle" font-family="Andika,sans-serif" fill="var(--ink)">${i}</text>`}
 if(hands)s+=`<line x1="50" y1="50" x2="${(50+14.5*Math.sin(b*Math.PI/180)).toFixed(2)}" y2="${(50-14.5*Math.cos(b*Math.PI/180)).toFixed(2)}" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><line x1="50" y1="50" x2="${(50+22.5*Math.sin(a*Math.PI/180)).toFixed(2)}" y2="${(50-22.5*Math.cos(a*Math.PI/180)).toFixed(2)}" stroke="var(--a-blue2)" stroke-width="3.2" stroke-linecap="round"/>`;
 return s+`<circle cx="50" cy="50" r="3.4" fill="var(--ink)"/></svg>`}
function coinSvgFlat(v,w=10){const gold=v>=5;return `<svg class="ic" viewBox="0 0 100 100" style="width:${w}cqw;height:${w}cqw" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="${gold?'#E3B54A':'#C7CDD0'}"/><circle cx="50" cy="50" r="38" fill="none" stroke="${gold?'#C69631':'#A7AFB3'}" stroke-width="3" stroke-dasharray="2 4"/><circle cx="50" cy="50" r="33" fill="${gold?'#EFC867':'#D9DEE0'}"/><text x="50" y="${v>9?60:62}" font-size="${v>9?34:40}" font-weight="700" text-anchor="middle" font-family="Andika,sans-serif" fill="${gold?'#8A6418':'#5F686C'}">${v}</text><text x="50" y="80" font-size="11" font-weight="700" text-anchor="middle" font-family="Andika,sans-serif" fill="${gold?'#8A6418':'#5F686C'}">kr</text></svg>`}
function noteSvgFlat(v,w=22){const c={20:'#B58AC0',50:'#E0A85A',100:'#6FA5C9'}[v]||'#9BBF85';return `<svg class="ic" viewBox="0 0 200 100" style="width:${w}cqw;height:${w/2}cqw" aria-hidden="true"><rect x="2" y="2" width="196" height="96" rx="8" fill="${c}"/><rect x="10" y="10" width="180" height="80" rx="5" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/><circle cx="150" cy="50" r="26" fill="#fff" opacity=".35"/><text x="24" y="66" font-size="48" font-weight="700" font-family="Andika,sans-serif" fill="#fff">${v}</text><text x="150" y="58" font-size="20" font-weight="700" text-anchor="middle" font-family="Andika,sans-serif" fill="#fff">kr</text></svg>`}
/* 3D-mynt och sedlar (Recraft, tomma) med valören skriven ovanpå, så att siffrorna alltid stämmer */
function money3d(icon,w,h,label,small){const b=typeof ICONBOX!=='undefined'&&ICONBOX[icon];if(!b)return null;const[x,y,bw,bh]=b;
 return `<svg class="ic" viewBox="${x} ${y} ${bw} ${bh}" style="width:${w}cqw;height:${(w*bh/bw).toFixed(2)}cqw" aria-hidden="true">${ART[icon]}${label}</svg>`}
function coinSvg(v,w=10){const gold=v>=5,icon=gold?'coin_gold':'coin_silver';const b=typeof ICONBOX!=='undefined'&&ICONBOX[icon];if(!b||!ART[icon]||!ART[icon].startsWith('<use'))return coinSvgFlat(v,w);const[x,y,bw,bh]=b,cx=x+bw/2,cy=y+bh/2,fs=bh*(v>9?.42:.5);
 return money3d(icon,w,0,`<text x="${cx}" y="${cy+fs*.22}" font-size="${fs}" font-weight="700" text-anchor="middle" font-family="Andika,sans-serif" fill="${gold?'#4A3108':'#2F3538'}" stroke="${gold?'#F6DC93':'#F2F4F5'}" stroke-width="${bh*.03}" paint-order="stroke">${v}</text><text x="${cx}" y="${cy+bh*.33}" font-size="${bh*.14}" font-weight="700" text-anchor="middle" font-family="Andika,sans-serif" fill="${gold?'#4A3108':'#2F3538'}" stroke="${gold?'#F6DC93':'#F2F4F5'}" stroke-width="${bh*.02}" paint-order="stroke">kr</text>`)}
function noteSvg(v,w=22){const icon={20:'note_20',50:'note_50',100:'note_100',200:'note_200',500:'note_500'}[v]||'note_100';const b=typeof ICONBOX!=='undefined'&&ICONBOX[icon];if(!b||!ART[icon]||!ART[icon].startsWith('<use'))return noteSvgFlat(v,w);const[x,y,bw,bh]=b;const cx=x+bw*.5,cy=y+bh*.5,fs=bh*.5;
 /* 3D-sedel (Recraft, tom) med valören stort i mitten */
 return money3d(icon,w,0,`<text x="${cx}" y="${cy+fs*.34}" font-size="${fs}" font-weight="700" text-anchor="middle" font-family="Andika,sans-serif" fill="#2B2F33" stroke="#FFFDF6" stroke-width="${bh*.07}" paint-order="stroke" stroke-linejoin="round">${v}<tspan font-size="${fs*.42}" dx="${bh*.04}">kr</tspan></text>`)}
function noteSvgOld(v,w=22){const icon='bill_blue';const b=ICONBOX[icon];const[x,y,bw,bh]=b;const cx=x+bw*.5,cy=y+bh*.5,pw=bw*.5,ph=bh*.42;
 /* 3D-sedel med värdet på en vit etikett i mitten, så att det alltid går att läsa */
 return money3d(icon,w,0,`<rect x="${cx-pw/2}" y="${cy-ph/2}" width="${pw}" height="${ph}" rx="${ph/2}" fill="#fff" opacity=".94"/><text x="${cx}" y="${cy+ph*.3}" font-size="${ph*.78}" font-weight="700" text-anchor="middle" font-family="Andika,sans-serif" fill="var(--ink)">${v} kr</text>`)}
function rulerSvg(cm=15,w=80){let s=`<svg class="ic" viewBox="0 0 ${cm*10+20} 30" style="width:${w}cqw" aria-hidden="true"><rect x="0" y="0" width="${cm*10+20}" height="30" rx="3" fill="#F6E7B8"/>`;for(let i=0;i<=cm*10;i++){const x=10+i;const L=i%10===0?12:i%5===0?8:4;if(i%1===0)s+=`<line x1="${x}" y1="0" x2="${x}" y2="${L}" stroke="var(--ink)" stroke-width="${i%10===0?.8:.35}"/>`;if(i%10===0)s+=`<text x="${x}" y="24" font-size="7" text-anchor="middle" font-family="Andika,sans-serif" fill="var(--ink)">${i/10}</text>`}return s+'</svg>'}
