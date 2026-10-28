/* ================= Illustrationer (viewBox 0 0 100 100, platta former utan konturer) ================= */
const C={ink:'var(--a-ink)',spruce:'var(--a-spruce)',spruce2:'var(--a-spruce2)',moss:'var(--a-moss)',moss2:'var(--a-moss2)',mossd:'var(--a-mossd)',
 lingon:'var(--a-lingon)',lingon2:'var(--a-lingon2)',rose:'var(--a-rose)',kant:'var(--a-kant)',sun:'var(--a-sun)',sunl:'var(--a-sunl)',
 fox:'var(--a-fox)',fox2:'var(--a-fox2)',foxl:'var(--a-foxl)',bark:'var(--a-bark)',bark2:'var(--a-bark2)',nut:'var(--a-nut)',nut2:'var(--a-nut2)',
 sand:'var(--a-sand)',cream:'var(--a-cream)',cream2:'var(--a-cream2)',blue:'var(--a-blue)',blue2:'var(--a-blue2)',bluel:'var(--a-bluel)',sky:'var(--a-sky)',
 berry:'var(--a-berry)',berry2:'var(--a-berry2)',navy:'var(--a-navy)',navy2:'var(--a-navy2)',grey:'var(--a-grey)',grey2:'var(--a-grey2)',white:'var(--a-white)',falu:'var(--a-falu)',roof:'var(--a-roof)'};
const hi=(cx,cy,rx,ry,rot=0,o=.38)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${o}" transform="rotate(${rot} ${cx} ${cy})"/>`;
const eye=(x,y,r=3.2)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${C.ink}"/><circle cx="${x+r*.35}" cy="${y-r*.38}" r="${r*.34}" fill="#fff"/>`;
const ART={
apple:`<path d="M50 31 C40 23 17 25 15.5 49 C14 71 30 90 44 88.5 C47 88 48.6 86.6 50 86.6 C51.4 86.6 53 88 56 88.5 C70 90 86 71 84.5 49 C83 25 60 23 50 31Z" fill="${C.lingon}"/>
 <path d="M66 27.5 C78 30 85 40 84.5 50 C83.6 71 70 90 56 88.5 C67 80 74.5 65 73 49 C72.2 39 69.5 32 66 27.5Z" fill="${C.lingon2}" opacity=".55"/>
 ${hi(30,46,4.6,9,-18)}
 <path d="M50 32 C50 24 52 18 56 13.5" fill="none" stroke="${C.bark2}" stroke-width="3.6" stroke-linecap="round"/>
 <path d="M53 21 C59 11 71 10 77 14 C71 22.5 61 25 53 21Z" fill="${C.moss}"/><path d="M54.5 20.5 C61 17 68 15 75 14.5" fill="none" stroke="${C.mossd}" stroke-width="1.3" stroke-linecap="round"/>`,
acorn:`<path d="M29 50 C29 71 39 86 50 90.5 C61 86 71 71 71 50Z" fill="${C.nut}"/>
 <path d="M58.5 50 C58.5 69 55.5 83 50 90.5 C61 86 71 71 71 50Z" fill="${C.nut2}"/>
 ${hi(38,62,3.2,8,-8,.3)}<circle cx="50" cy="90" r="2" fill="${C.bark2}"/>
 <path d="M23 51 C23 34 35 26 50 26 C65 26 77 34 77 51 C77 54 75 55.5 72 55.5 L28 55.5 C25 55.5 23 54 23 51Z" fill="${C.bark}"/>
 ${[[33,38],[43,34],[55,34],[65,38],[29,47],[39,44],[50,42],[61,44],[71,47],[34,52],[45,51],[56,51],[67,52]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2" fill="${C.bark2}" opacity=".8"/>`).join('')}
 <path d="M50 27 C50 21 52 16.5 56 13" fill="none" stroke="${C.bark2}" stroke-width="3.6" stroke-linecap="round"/>`,
leaf:`<path d="M18 84 C15 52 38 22 84 16 C85 60 58 85 18 84Z" fill="${C.moss2}"/>
 <path d="M18 84 C40 66 60 44 84 16 C85 60 58 85 18 84Z" fill="${C.moss}"/>
 <path d="M18 84 C40 66 60 44 81 20" fill="none" stroke="${C.mossd}" stroke-width="2.2" stroke-linecap="round"/>
 <path d="M44 60 L40 46 M56 47 L54 34 M33 70 L26 62 M48 61 L62 64 M60 47 L72 48" fill="none" stroke="${C.mossd}" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>
 <path d="M19 83 L11 91" stroke="${C.mossd}" stroke-width="3" stroke-linecap="round"/>`,
mushroom:`<path d="M39.5 56 C39.5 70 37.5 82 35.5 88.5 C44 91.5 56 91.5 64.5 88.5 C62.5 82 60.5 70 60.5 56Z" fill="${C.cream}"/>
 <path d="M53 56 C54 70 56 82 57.5 90 C60 89.6 62.4 89.2 64.5 88.5 C62.5 82 60.5 70 60.5 56Z" fill="${C.cream2}"/>
 <path d="M39.6 66 C46 69.5 54 69.5 60.4 66 L61 71 C54 75 46 75 39 71Z" fill="${C.cream2}"/>
 <path d="M11 58.5 C11 33 29 18 50 18 C71 18 89 33 89 58.5 C89 61.5 87 63 84 63 L16 63 C13 63 11 61.5 11 58.5Z" fill="${C.lingon}"/>
 <path d="M64 21 C79 27 89 40 89 58.5 C89 61.5 87 63 84 63 L70 63 C77 50 75 33 64 21Z" fill="${C.lingon2}" opacity=".45"/>
 <circle cx="31" cy="41" r="4.6" fill="${C.cream}"/><circle cx="50" cy="30" r="4.2" fill="${C.cream}"/><circle cx="67" cy="42" r="5" fill="${C.cream}"/>
 <circle cx="44" cy="51.5" r="3.2" fill="${C.cream}"/><circle cx="23" cy="53.5" r="2.8" fill="${C.cream}"/><circle cx="78" cy="54" r="3" fill="${C.cream}"/>
 <path d="M30 92 C33 86 35 84 37 82 M70 92 C68 87 66 85 63 83 M24 92 C25 89 27 87 29 86" fill="none" stroke="${C.moss}" stroke-width="2.6" stroke-linecap="round"/>`,
ladybug:`<path d="M27 50 L15 44 M25 62 L12 63 M28 74 L17 82 M73 50 L85 44 M75 62 L88 63 M72 74 L83 82" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round"/>
 <path d="M44 23 C41 16 36 13 32 13 M56 23 C59 16 64 13 68 13" fill="none" stroke="${C.ink}" stroke-width="2.2" stroke-linecap="round"/><circle cx="32" cy="13" r="2.3" fill="${C.ink}"/><circle cx="68" cy="13" r="2.3" fill="${C.ink}"/>
 <ellipse cx="50" cy="31" rx="16" ry="12" fill="${C.ink}"/><circle cx="43.5" cy="28" r="2.4" fill="#fff"/><circle cx="56.5" cy="28" r="2.4" fill="#fff"/>
 <circle cx="50" cy="58" r="30" fill="${C.lingon}"/>
 <path d="M50 28 A30 30 0 0 1 50 88Z" fill="${C.lingon2}" opacity=".35"/>
 <path d="M50 28.5 L50 87.5" stroke="${C.ink}" stroke-width="2.4"/>
 <circle cx="37" cy="47" r="5.2" fill="${C.ink}"/><circle cx="63" cy="47" r="5.2" fill="${C.ink}"/><circle cx="33" cy="64" r="4.4" fill="${C.ink}"/><circle cx="67" cy="64" r="4.4" fill="${C.ink}"/><circle cx="42" cy="78" r="4" fill="${C.ink}"/><circle cx="58" cy="78" r="4" fill="${C.ink}"/>
 ${hi(36,40,5,3,-30,.35)}`,
flower:`<path d="M50 52 C50 66 49 79 48 93" fill="none" stroke="${C.mossd}" stroke-width="3.4" stroke-linecap="round"/>
 <path d="M48.6 77 C40 66 28 67 23 72 C31 81 42 81 48.6 77Z" fill="${C.moss}"/><path d="M49 70 C58 61 70 61 75 65 C67 74 56 74 49 70Z" fill="${C.moss2}"/>
 ${[0,1,2,3,4].map(i=>{const a=-90+i*72,r=a*Math.PI/180,x=50+13.5*Math.cos(r),y=35+13.5*Math.sin(r);return `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="10.5" ry="13.5" fill="${C.rose}" transform="rotate(${a+90} ${x.toFixed(2)} ${y.toFixed(2)})"/>`}).join('')}
 ${[0,1,2,3,4].map(i=>{const a=-90+i*72,r=a*Math.PI/180,x=50+8*Math.cos(r),y=35+8*Math.sin(r);return `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="4.6" ry="6.5" fill="${C.lingon}" opacity=".28" transform="rotate(${a+90} ${x.toFixed(2)} ${y.toFixed(2)})"/>`}).join('')}
 <circle cx="50" cy="35" r="8.2" fill="${C.sun}"/><circle cx="52.5" cy="37.5" r="5" fill="${C.kant}" opacity=".55"/>`,
fish:`<path d="M71 50 L89 33 C92 41 92 59 89 67Z" fill="${C.blue2}"/>
 <path d="M38 31 C44 20 56 20 62 30Z" fill="${C.blue2}"/><path d="M44 69 C48 76 56 77 60 70Z" fill="${C.blue2}"/>
 <path d="M12 50 C22 32 43 26 60 30 C69 32 75 40 77 50 C75 60 69 68 60 70 C43 74 22 68 12 50Z" fill="${C.blue}"/>
 <path d="M16 55 C27 66 45 72 60 70 C66 68 71 64 74 59 C57 64 34 64 16 55Z" fill="${C.bluel}"/>
 <path d="M35 38 C39.5 46 39.5 55 35 62" fill="none" stroke="${C.blue2}" stroke-width="2.4" stroke-linecap="round"/>
 ${[[48,42],[57,40],[52,50],[61,49],[66,43]].map(([x,y])=>`<path d="M${x} ${y} q3 3 0 6" fill="none" stroke="${C.blue2}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>`).join('')}
 <circle cx="25" cy="45" r="5" fill="#fff"/>${eye(24.4,45.4,2.7)}
 <path d="M13.5 52 C15.5 53.2 18 53.2 19.6 52" fill="none" stroke="${C.blue2}" stroke-width="1.6" stroke-linecap="round"/>`,
bird:`<path d="M24 55 L6 61 L10 50 L23 49Z" fill="${C.navy2}"/>
 <path d="M42 77 L40 88 M51 77 L53 88" stroke="${C.bark}" stroke-width="2.4" stroke-linecap="round"/>
 <path d="M21 56 C21 41 34 33 50 34.5 C63 36 71 44 71 57 C71 70 59 78.5 45 78.5 C31 78.5 21 69 21 56Z" fill="${C.sun}"/>
 <path d="M22 54 C25 42 39 36 53 40 C47 51 37 59 22.5 61Z" fill="var(--a-olive)"/>
 <path d="M30 51 C36 47 42 46 47 46" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>
 <path d="M57 46 C57.5 56 55.5 67 51 77 L46.5 77.5 C50.5 67 52.5 56 52.5 46Z" fill="${C.ink}"/>
 <circle cx="64" cy="34" r="15" fill="${C.ink}"/>
 <path d="M60 34.5 C60 40 64 44 70 44 C75 44 78 40 78 36.5 C73 39 66 39 60 34.5Z" fill="#fff"/>
 <path d="M77.5 30.5 L87 33 L77.5 36Z" fill="${C.grey2}"/>
 <circle cx="68" cy="29" r="2.4" fill="#fff"/><circle cx="68.6" cy="29.2" r="1.3" fill="${C.ink}"/>`,
sun:`${Array.from({length:12},(_,i)=>{const a=i*30*Math.PI/180;return `<path d="M${(50+31*Math.cos(a)).toFixed(1)} ${(50+31*Math.sin(a)).toFixed(1)} L${(50+42*Math.cos(a)).toFixed(1)} ${(50+42*Math.sin(a)).toFixed(1)}" stroke="${C.kant}" stroke-width="5.5" stroke-linecap="round"/>`}).join('')}
 <circle cx="50" cy="50" r="24" fill="${C.sun}"/><path d="M68 34 A24 24 0 0 1 50 74 A24 24 0 0 0 68 34Z" fill="${C.kant}" opacity=".35"/>${hi(41,41,6,4,-35,.35)}`,
moon:`<path d="M60 10 A40 40 0 1 0 88 66 A31 31 0 1 1 60 10Z" fill="${C.sun}"/>
 <path d="M60 10 A40 40 0 1 0 88 66 C70 82 36 80 24 60 C16 44 24 22 38 16 C44 13 52 11 60 10Z" fill="${C.kant}" opacity=".25"/>
 <circle cx="30" cy="62" r="4" fill="${C.kant}" opacity=".35"/><circle cx="44" cy="76" r="3" fill="${C.kant}" opacity=".35"/><circle cx="25" cy="42" r="2.6" fill="${C.kant}" opacity=".35"/>`,
star:`<path d="M50 11 L60.6 35.4 L87 37.7 L67 55.2 L72.9 81 L50 67.4 L27.1 81 L33 55.2 L13 37.7 L39.4 35.4Z" fill="${C.sun}" stroke="${C.sun}" stroke-width="7" stroke-linejoin="round"/>
 <path d="M50 11 L60.6 35.4 L87 37.7 L67 55.2 L72.9 81 L50 67.4Z" fill="${C.kant}" opacity=".4"/>`,
heart:`<path d="M50 86 C30 72 12 58 12 38 C12 24 22 15 33 15 C41 15 47 20 50 27 C53 20 59 15 67 15 C78 15 88 24 88 38 C88 58 70 72 50 86Z" fill="${C.rose}"/>
 <path d="M67 15 C78 15 88 24 88 38 C88 58 70 72 50 86 C64 70 76 56 76 38 C76 27 72 19 67 15Z" fill="${C.lingon}" opacity=".3"/>${hi(28,32,5,8,30,.4)}`,
tree:`<rect x="45.5" y="82" width="9" height="13" rx="2" fill="${C.bark}"/>
 ${[[6,30,16],[20,48,24],[35,66,31],[50,86,38]].map(([y0,y1,w])=>`<path d="M50 ${y0} L${50+w} ${y1} C${50+w*.5} ${y1-3} ${50-w*.5} ${y1-3} ${50-w} ${y1}Z" fill="${C.spruce}"/><path d="M50 ${y0} L${50-w} ${y1} C${50-w*.6} ${y1-2.4} ${50-w*.25} ${y1-3} 50 ${y1-3}Z" fill="${C.spruce2}"/>`).join('')}`,
house:`<rect x="64" y="16" width="8" height="16" fill="${C.roof}"/>
 <rect x="18" y="44" width="64" height="44" fill="${C.falu}"/>
 <path d="M60 44 L82 44 L82 88 L60 88Z" fill="#000" opacity=".1"/>
 <path d="M8 47 L50 15 L92 47 Z" fill="${C.roof}"/>
 <path d="M13 46 L50 18.5 L87 46" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
 <rect x="18" y="47" width="4.2" height="41" fill="#fff"/><rect x="77.8" y="47" width="4.2" height="41" fill="#fff"/>
 <rect x="43.5" y="61" width="15" height="27" fill="${C.bark2}"/><rect x="43.5" y="61" width="15" height="27" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="55" cy="75" r="1.4" fill="${C.sun}"/>
 ${[27,63].map(x=>`<rect x="${x}" y="56" width="12" height="13" fill="${C.sky}"/><path d="M${x+6} 56 V69 M${x} 62.5 H${x+12}" stroke="#fff" stroke-width="1.8"/><rect x="${x}" y="56" width="12" height="13" fill="none" stroke="#fff" stroke-width="2.6"/>`).join('')}
 <path d="M6 90 C30 87 70 87 94 90" stroke="${C.moss}" stroke-width="3.5" stroke-linecap="round" fill="none"/>`,
boat:`<path d="M51 14 L51 62" stroke="${C.bark2}" stroke-width="2.6" stroke-linecap="round"/>
 <path d="M54 17 L54 58 L82 58Z" fill="${C.cream}"/><path d="M54 36 L54 58 L82 58Z" fill="${C.cream2}"/>
 <path d="M48 24 L48 58 L25 58Z" fill="${C.kant}"/>
 <path d="M51 14 L60 17 L51 20Z" fill="${C.lingon}"/>
 <path d="M12 62 L88 62 L78 79 C66 83 34 83 22 79Z" fill="${C.lingon}"/>
 <path d="M14.5 66 L85.5 66" stroke="#fff" stroke-width="2.6" opacity=".9"/>
 <path d="M60 62 L88 62 L78 79 C72 81 66 82 60 82Z" fill="${C.lingon2}" opacity=".35"/>
 <path d="M6 86 C14 82 20 82 28 86 S42 90 50 86 S64 82 72 86 S86 90 94 86" fill="none" stroke="${C.blue}" stroke-width="3.4" stroke-linecap="round"/>`,
cloud:`<path d="M20 70 C9 70 6 56 15 51 C14 39 27 33 36 39 C40 26 60 24 66 37 C76 32 88 40 85 52 C93 55 92 70 82 70Z" fill="${C.white}"/>
 <path d="M20 70 C12 70 8 63 10 58 C22 64 60 64 90 60 C91 66 87 70 82 70Z" fill="${C.sky}"/>`,
ball:`<circle cx="50" cy="52" r="34" fill="${C.white}"/>
 <path d="M50 18 C36 30 34 72 50 86 C26 82 16 64 16 52 C16 34 30 20 50 18Z" fill="${C.lingon}"/>
 <path d="M50 18 C64 30 66 72 50 86 C74 82 84 64 84 52 C84 34 70 20 50 18Z" fill="${C.blue}"/>
 <path d="M50 18 C56 32 57 72 50 86 C43 72 44 32 50 18Z" fill="${C.sun}"/>
 <circle cx="50" cy="52" r="34" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="2"/>
 <path d="M66 26 A34 34 0 0 1 50 86 A34 34 0 0 0 66 26Z" fill="#000" opacity=".1"/>${hi(34,34,6,4,-35,.45)}`,
cat:`<path d="M66 84 C84 86 92 72 86 60 C83 54 77 56 79 62 C82 70 78 78 66 78Z" fill="var(--a-cat)"/>
 <path d="M33 89 C29 71 35 55 50 55 C65 55 71 71 67 89Z" fill="var(--a-cat)"/>
 <path d="M42 89 C42 77 46 68 50 68 C54 68 58 77 58 89Z" fill="${C.cream}"/>
 <ellipse cx="41" cy="88.5" rx="6.5" ry="3.6" fill="${C.cream}"/><ellipse cx="59" cy="88.5" rx="6.5" ry="3.6" fill="${C.cream}"/>
 <path d="M30 35 L27 12 L45 24Z" fill="var(--a-cat)"/><path d="M70 35 L73 12 L55 24Z" fill="var(--a-cat)"/>
 <path d="M31 30 L29.5 18 L39 25Z" fill="${C.rose}"/><path d="M69 30 L70.5 18 L61 25Z" fill="${C.rose}"/>
 <path d="M27 41 C27 28 37 21 50 21 C63 21 73 28 73 41 C73 53 63 59 50 59 C37 59 27 53 27 41Z" fill="var(--a-cat)"/>
 <path d="M45 22 L46.5 29 M50 21.5 L50 29.5 M55 22 L53.5 29" stroke="var(--a-catd)" stroke-width="2.2" stroke-linecap="round"/>
 <ellipse cx="50" cy="49" rx="11" ry="7.5" fill="${C.cream}"/>
 <ellipse cx="40.5" cy="40" rx="3" ry="3.8" fill="${C.ink}"/><ellipse cx="59.5" cy="40" rx="3" ry="3.8" fill="${C.ink}"/><circle cx="41.5" cy="38.6" r="1.1" fill="#fff"/><circle cx="60.5" cy="38.6" r="1.1" fill="#fff"/>
 <path d="M47 45.5 L53 45.5 L50 49Z" fill="${C.rose}"/>
 <path d="M50 49 C50 52 47 53.5 45 51.8 M50 49 C50 52 53 53.5 55 51.8" fill="none" stroke="${C.ink}" stroke-width="1.4" stroke-linecap="round"/>
 <path d="M38 48 L25 46 M38 51 L26 53 M62 48 L75 46 M62 51 L74 53" stroke="${C.ink}" stroke-width="1.1" stroke-linecap="round" opacity=".55"/>`,
dog:`<path d="M34 89 C30 72 36 58 50 58 C64 58 70 72 66 89Z" fill="${C.sand}"/>
 <path d="M43 89 C43 78 46 70 50 70 C54 70 57 78 57 89Z" fill="${C.cream}"/>
 <ellipse cx="41" cy="88.5" rx="6.5" ry="3.6" fill="${C.cream}"/><ellipse cx="59" cy="88.5" rx="6.5" ry="3.6" fill="${C.cream}"/>
 <path d="M36 58 C44 62 56 62 64 58 L64 63 C56 67 44 67 36 63Z" fill="${C.lingon}"/><circle cx="50" cy="66" r="3" fill="${C.sun}"/>
 <circle cx="50" cy="38" r="20" fill="${C.sand}"/>
 <path d="M32 26 C24 26 19 36 21 50 C22 56 28 58 31 53 C33 46 34 36 34 30Z" fill="${C.bark}"/><path d="M68 26 C76 26 81 36 79 50 C78 56 72 58 69 53 C67 46 66 36 66 30Z" fill="${C.bark}"/>
 <ellipse cx="57" cy="34" rx="6" ry="5" fill="${C.bark}" opacity=".5"/>
 <ellipse cx="50" cy="47" rx="11" ry="8" fill="${C.cream}"/>
 ${eye(42,36,2.8)}${eye(58,36,2.8)}
 <ellipse cx="50" cy="43.5" rx="4.2" ry="3.2" fill="${C.ink}"/>
 <path d="M46 50 C48 52.5 52 52.5 54 50" fill="none" stroke="${C.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M48.5 51.5 C48.5 56 51.5 56 51.5 51.5Z" fill="${C.rose}"/>`,
car:`<path d="M8 68 L8 58 C8 52 12 50 18 50 L26 36 C28 33 31 32 34 32 L62 32 C66 32 68 33 70 36 L78 50 C86 50 92 53 92 60 L92 68 C92 70 90 72 88 72 L12 72 C10 72 8 70 8 68Z" fill="${C.blue}"/>
 <path d="M60 50 L78 50 C86 50 92 53 92 60 L92 68 C92 70 90 72 88 72 L60 72Z" fill="${C.blue2}" opacity=".35"/>
 <path d="M30 37 C31 36 32 35.5 34 35.5 L47 35.5 L47 50 L23 50Z" fill="${C.sky}"/><path d="M52 35.5 L62 35.5 C64 35.5 65.5 36 66.5 37.5 L73 50 L52 50Z" fill="${C.sky}"/>
 <rect x="84" y="55" width="7" height="5" rx="2" fill="${C.sun}"/><rect x="8.5" y="56" width="5" height="4" rx="1.5" fill="${C.lingon}"/>
 <path d="M46 56 L52 56" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>
 ${[28,72].map(x=>`<circle cx="${x}" cy="72" r="10" fill="${C.ink}"/><circle cx="${x}" cy="72" r="4.2" fill="${C.grey}"/>`).join('')}`,
egg:`<path d="M50 14 C66 14 78 38 78 58 C78 76 66 88 50 88 C34 88 22 76 22 58 C22 38 34 14 50 14Z" fill="var(--a-egg)"/>
 <path d="M60 17 C71 25 78 42 78 58 C78 76 66 88 50 88 C64 80 70 66 70 52 C70 38 66 25 60 17Z" fill="var(--a-eggd)"/>${hi(37,40,5,10,-15,.5)}`,
pinecone:`<path d="M50 8 L50 16" stroke="${C.bark2}" stroke-width="3" stroke-linecap="round"/>
 <path d="M50 14 C70 18 78 44 74 66 C71 82 60 92 50 92 C40 92 29 82 26 66 C22 44 30 18 50 14Z" fill="${C.bark}"/>
 ${[[50,24,9],[40,34,9.5],[60,34,9.5],[33,47,9],[50,45,10],[67,47,9],[38,59,10],[62,59,10],[50,70,10],[34,72,7.5],[66,72,7.5],[50,84,8]].map(([x,y,r])=>`<path d="M${x-r} ${y} C${x-r*.7} ${y+r*.9} ${x+r*.7} ${y+r*.9} ${x+r} ${y} C${x+r*.5} ${y+r*.35} ${x-r*.5} ${y+r*.35} ${x-r} ${y}Z" fill="${C.nut}"/>`).join('')}`,
blueberry:`<path d="M58 30 C66 18 80 16 88 20 C82 30 70 34 58 30Z" fill="${C.moss}"/><path d="M58 30 C70 24 80 22 86 21" fill="none" stroke="${C.mossd}" stroke-width="1.3"/>
 <path d="M52 32 C50 40 44 46 38 50 M52 32 C56 40 62 46 66 54" fill="none" stroke="${C.mossd}" stroke-width="2.2" stroke-linecap="round"/>
 ${[[34,62,17],[66,66,16],[50,80,15]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${C.berry}"/><path d="M${x+r*.55} ${y-r*.8} A${r} ${r} 0 0 1 ${x} ${y+r} A${r} ${r} 0 0 0 ${x+r*.55} ${y-r*.8}Z" fill="${C.berry2}" opacity=".5"/>${hi(x-r*.4,y-r*.4,r*.28,r*.18,-35,.45)}<path d="M${x-3} ${y-r+3} L${x} ${y-r+6} L${x+3} ${y-r+3}" fill="none" stroke="${C.berry2}" stroke-width="1.6" stroke-linecap="round"/>`).join('')}`,
strawberry:`<path d="M50 26 C68 22 86 34 84 50 C82 68 62 88 50 92 C38 88 18 68 16 50 C14 34 32 22 50 26Z" fill="${C.lingon}"/>
 <path d="M66 25 C78 30 85 40 84 50 C82 68 62 88 50 92 C62 78 72 62 72 48 C72 38 70 30 66 25Z" fill="${C.lingon2}" opacity=".4"/>
 ${[[34,44],[50,40],[66,44],[28,56],[42,54],[58,54],[72,56],[36,66],[50,66],[64,66],[44,77],[56,77]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="1.4" ry="2.1" fill="${C.sunl}"/>`).join('')}
 <path d="M50 30 C42 30 32 24 30 18 C38 18 44 20 50 26 C52 18 58 14 66 14 C64 22 58 26 50 30Z" fill="${C.moss}"/><path d="M50 30 C56 26 66 26 72 28 C66 32 58 33 50 30Z" fill="${C.mossd}"/>
 <path d="M50 26 L50 14" stroke="${C.mossd}" stroke-width="3" stroke-linecap="round"/>`,
butterfly:`<path d="M48 48 C40 30 20 18 12 26 C6 34 14 48 30 52 C16 56 12 70 20 78 C28 84 42 72 48 56Z" fill="${C.rose}"/>
 <path d="M52 48 C60 30 80 18 88 26 C94 34 86 48 70 52 C84 56 88 70 80 78 C72 84 58 72 52 56Z" fill="${C.kant}"/>
 <circle cx="26" cy="34" r="5" fill="#fff" opacity=".7"/><circle cx="74" cy="34" r="5" fill="#fff" opacity=".7"/><circle cx="28" cy="68" r="3.6" fill="${C.lingon}" opacity=".5"/><circle cx="72" cy="68" r="3.6" fill="${C.lingon}" opacity=".45"/>
 <rect x="46.5" y="34" width="7" height="40" rx="3.5" fill="${C.ink}"/>
 <path d="M48 35 C46 26 42 20 37 17 M52 35 C54 26 58 20 63 17" fill="none" stroke="${C.ink}" stroke-width="1.8" stroke-linecap="round"/>`,
/* ---------- karaktärer ---------- */
squirrel:`<path d="M37 88 C12 90 4 66 13 47 C19 34 15 19 26 11 C37 4 50 11 47.5 24 C45.5 34 35 40 37 54 C39 67 47 75 45 85Z" fill="${C.fox}"/>
 <path d="M35 81 C19 81 13 64 19 50 C24 38 21 25 29.5 17.5 C36 13 42.5 17 41.5 25 C40 33.5 30.5 40 31.5 54 C32.5 66 39 73 38 81Z" fill="${C.foxl}"/>
 <path d="M43 89 C35 78 37 58 50 50 C61 43 72 50 74 63 C76 75 72 85 63 89Z" fill="${C.fox}"/>
 <path d="M55 87 C51 78 52 64 59 58 C65 55.5 70 62 70 70 C70 78 67 84 63 87Z" fill="${C.cream}"/>
 <path d="M41 89 C39 82 44 77 51 79 C56 81 57 88 52 90Z" fill="${C.fox2}"/><ellipse cx="57" cy="90" rx="8" ry="3.2" fill="${C.fox2}"/>
 <path d="M54 45 C49 33 56 21 67 19.5 C77 18 87 25.5 87.5 35.5 C88 44 81.5 50 72.5 50.5 C64 51 56.5 50.5 54 45Z" fill="${C.fox}"/>
 <path d="M60 25 L56.5 7.5 C63 9 68.5 15 68.5 22Z" fill="${C.fox}"/><path d="M61 22 L59 12.5 C62.5 14 65.5 17.5 65.5 21Z" fill="${C.rose}"/>
 <path d="M56.5 7.5 L54 1.5 M56.5 7.5 L58.6 2" stroke="${C.fox2}" stroke-width="2.2" stroke-linecap="round"/>
 <ellipse cx="79" cy="41" rx="8.5" ry="6.5" fill="${C.cream}"/>
 ${eye(72.5,32.5,3.6)}<circle cx="87" cy="37" r="2.4" fill="${C.ink}"/>
 <ellipse cx="66" cy="42" rx="4" ry="2.6" fill="${C.rose}" opacity=".7"/>
 <g transform="translate(70 50) scale(.26)">${'ACORN'}</g>
 <path d="M63 58 C68 56 72 58 74 62 M65 64 C70 63 73 65 75 68" fill="none" stroke="${C.fox2}" stroke-width="5" stroke-linecap="round"/>`,
owl:`<path d="M27 31 L21 11 L41 22Z" fill="${C.bark2}"/><path d="M73 31 L79 11 L59 22Z" fill="${C.bark2}"/>
 <path d="M21 60 C21 33 34 17 50 17 C66 17 79 33 79 60 C79 80 67 91 50 91 C33 91 21 80 21 60Z" fill="${C.bark}"/>
 <path d="M21 56 C13 64 15 80 26 85 C28 73 28 62 24 53Z" fill="${C.bark2}"/><path d="M79 56 C87 64 85 80 74 85 C72 73 72 62 76 53Z" fill="${C.bark2}"/>
 <ellipse cx="50" cy="66" rx="19" ry="21" fill="${C.sand}"/>
 ${[[42,58],[50,56],[58,58],[38,66],[46,64],[54,64],[62,66]].map(([x,y])=>`<path d="M${x-2.6} ${y} L${x} ${y+2.6} L${x+2.6} ${y}" fill="none" stroke="${C.bark}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}
 <circle cx="39.5" cy="40" r="13.5" fill="${C.cream}"/><circle cx="60.5" cy="40" r="13.5" fill="${C.cream}"/>
 <circle cx="39.5" cy="40" r="8.6" fill="#fff"/><circle cx="60.5" cy="40" r="8.6" fill="#fff"/>
 <circle cx="40.5" cy="41" r="5.8" fill="${C.sun}"/><circle cx="59.5" cy="41" r="5.8" fill="${C.sun}"/>
 <circle cx="41" cy="41.4" r="3.4" fill="${C.ink}"/><circle cx="59" cy="41.4" r="3.4" fill="${C.ink}"/><circle cx="42.2" cy="40" r="1.2" fill="#fff"/><circle cx="60.2" cy="40" r="1.2" fill="#fff"/>
 <path d="M45.5 49 L54.5 49 L50 57.5Z" fill="${C.kant}"/>
 <path d="M33 75 L50 79 L67 75 L67 89 L50 93 L33 89Z" fill="${C.lingon}"/><path d="M50 79 L50 93" stroke="${C.lingon2}" stroke-width="1.6"/>
 <path d="M36 79 L47 81.5 M36 83 L47 85.5 M53 81.5 L64 79 M53 85.5 L64 83" stroke="#fff" stroke-width="1.3" opacity=".75"/>
 <ellipse cx="31" cy="79" rx="5.5" ry="7" fill="${C.bark2}" transform="rotate(-20 31 79)"/><ellipse cx="69" cy="79" rx="5.5" ry="7" fill="${C.bark2}" transform="rotate(20 69 79)"/>
 <path d="M42 92 l-2 4 M45 92 l0 4 M55 92 l0 4 M58 92 l2 4" stroke="${C.kant}" stroke-width="2.4" stroke-linecap="round"/>`,
fox:`<path d="M40 84 C24 88 8 82 10 68 C11 60 18 58 23 62 C27 66 30 72 42 74Z" fill="${C.fox}"/>
 <path d="M10.5 66 C9 72 11 79 17 82 C19 78 19 72 17 66 C15 63 12 63 10.5 66Z" fill="#fff"/>
 <path d="M36 89 C33 71 39 54 54 50 C66 47 73 59 73 73 C73 81 71 87 67 90Z" fill="${C.fox}"/>
 <path d="M54 54 C47 62 47 77 51 89 L63 89 C65 76 63 62 59 54Z" fill="#fff"/>
 <path d="M44 76 L42 91 L48 91 L49 78Z" fill="var(--a-foxleg)"/><path d="M60 78 L59 91 L65 91 L66 76Z" fill="var(--a-foxleg)"/>
 <path d="M50 41 C50 30 58 23.5 67 23.5 C75 23.5 81 28 84.5 34 L95 42.5 C93 46.5 89 48.5 84.5 48.5 C78 52.5 66 54.5 58 50.5 C52.5 48 50 45 50 41Z" fill="${C.fox}"/>
 <path d="M64 45 C71 49.5 81 50 88 47.5 C92 46 94.5 44 95 42.5 C88 45 79 45 71 42.5Z" fill="#fff"/>
 <path d="M55.5 31 L53 11 L67.5 24.5Z" fill="${C.fox}"/><path d="M56.5 27 L55.5 16 L63.5 24Z" fill="var(--a-foxleg)"/>
 <path d="M66 25 L71 8.5 L77.5 27Z" fill="${C.fox2}"/><path d="M68.5 24 L71.5 13.5 L75 25Z" fill="var(--a-foxleg)"/>
 <path d="M66.5 34.5 C68.5 32 72 32 73.5 34.5 C72 36 68.5 36 66.5 34.5Z" fill="${C.ink}"/><circle cx="95" cy="42.5" r="2.6" fill="${C.ink}"/>
 <path d="M51 46 C59 53 71 53.5 80 49 L80.5 55.5 C71.5 60 59 59.5 50.5 52.5Z" fill="${C.berry}"/>
 <path d="M56 53 L53.5 68 L60 68.5 L61.5 54.5Z" fill="${C.berry}"/>
 <path d="M54 59 L60.5 59.5 M53.5 63.5 L60 64" stroke="${C.berry2}" stroke-width="1.4"/>
 <path d="M53 50 L78 52.5" stroke="${C.berry2}" stroke-width="1.2" opacity=".6"/>`,
swallow:`<path d="M31 53 L3 43 L22 56.5 L5 68 L33 59.5Z" fill="${C.navy}"/>
 <path d="M47 54 C41 66 31 77 13 84 C25 71 34 61 40 52Z" fill="${C.navy2}"/>
 <path d="M27 56.5 C35 46.5 55 42 70 44 C78 45 84 48 86.5 52 C80 58.5 70 62.5 56 62.5 C44 62.5 33.5 60.5 27 56.5Z" fill="${C.navy}"/>
 <path d="M39 60 C50 64.5 66 63 79 56 C71 63 57 67 46 65 C42 64 40 62.5 39 60Z" fill="${C.cream}"/>
 <path d="M48 48.5 C52 30 62.5 15 81 7 C73 23 67 37.5 62.5 50.5Z" fill="${C.navy2}"/>
 <path d="M54 46 C58 34 64 24 72 17" fill="none" stroke="#fff" stroke-width="1.4" opacity=".35" stroke-linecap="round"/>
 <circle cx="78" cy="46.5" r="10.5" fill="${C.navy}"/>
 <path d="M82.5 50 C86.5 51.5 88.5 54 86.5 57.5 C82.5 58.5 78 56.5 76 53Z" fill="${C.lingon}"/><path d="M84 40.5 C86 40.5 87.5 42 88 44 L84.5 44Z" fill="${C.lingon}"/>
 <path d="M87.5 45.8 L95 47.6 L87.5 49.4Z" fill="${C.ink}"/>
 <circle cx="81" cy="44.5" r="2.6" fill="#fff"/><circle cx="81.6" cy="44.7" r="1.6" fill="${C.ink}"/>`,
/* ---------- småsaker ---------- */
paw:`<ellipse cx="50" cy="66" rx="20" ry="17" fill="currentColor"/><ellipse cx="24" cy="43" rx="8.5" ry="11" fill="currentColor" transform="rotate(-20 24 43)"/><ellipse cx="40" cy="27" rx="8.5" ry="11.5" fill="currentColor" transform="rotate(-6 40 27)"/><ellipse cx="60" cy="27" rx="8.5" ry="11.5" fill="currentColor" transform="rotate(6 60 27)"/><ellipse cx="76" cy="43" rx="8.5" ry="11" fill="currentColor" transform="rotate(20 76 43)"/>`
};
ART.squirrel=ART.squirrel.replace('>ACORN<','>'+ART.acorn+'<');
const CHAR={matte:{art:'squirrel',name:'Ebba',kind:'Ekorren'},svenska:{art:'owl',name:'Otto',kind:'Ugglan'},eng:{art:'fox',name:'Ruben',kind:'Räven'},mer:{art:'ivar',name:'Ivar',kind:'Igelkotten'},geo:{art:'swallow',name:'Siri',kind:'Svalan'}};
/* svg-hjälpare */
const art=(n,w,{flip=false,cls='',style=''}={})=>`<svg class="ic ${cls}" viewBox="0 0 100 100" style="width:${w}cqw;height:${w}cqw;${style}" aria-hidden="true"><g ${flip?'transform="translate(100 0) scale(-1 1)"':''}>${ART[n]}</g></svg>`;
/* 3D-bild tätt beskuren till sitt innehåll (ICONBOX från build.py); största sidan blir s cqw. Breda scener blir då lika tydliga som höga. */
const artFit=(n,s,hm=s,box=false)=>{const b=typeof ICONBOX!=='undefined'&&ICONBOX[n];if(!b)return art(n,Math.min(s,hm));const[x,y,w,h]=b,k=Math.min(s/w,hm/h),svg=`<svg class="ic" viewBox="${x} ${y} ${w} ${h}" style="width:${+(w*k).toFixed(2)}cqw;height:${+(h*k).toFixed(2)}cqw" aria-hidden="true">${ART[n]}</svg>`;return box?`<span style="display:grid;place-items:center;width:${s}cqw;height:${hm}cqw">${svg}</span>`:svg};
const artIn=(n,x,y,s,flip=false)=>`<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 100 100" overflow="visible"><g ${flip?'transform="translate(100 0) scale(-1 1)"':''}>${ART[n]}</g></svg>`;
const artSvg=(n,cls='',flip=false)=>`<svg viewBox="0 0 100 100" class="${cls}" aria-hidden="true"><g ${flip?'transform="translate(100 0) scale(-1 1)"':''}>${ART[n]}</g></svg>`;
