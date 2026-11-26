// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Przeszczepienie nerki (TOOL_EXT.ktx): kategoria „Transplantologia” (także OLTx), 5 wariantów × 8 kadrów bez błędów i z etykietami;
// powłoki otwarte w kadrze „Cięcie” i przygaszone potem; nerka na stole, potem w dole biodrowym; zespolenia po kolei (żylne → tętnicze → moczowód),
// zaciski zdjęte przy reperfuzji, cewnik JJ od kadru „Moczowód”; wariant iia — tętnica biodrowa wewnętrzna, bez zacisku na zewnętrznej;
// rv — przedłużenie żyły; pl — cystotomia, nowe ujście; EN — bez polskich znaków.
// Przenikanie (m 1–5 co 0,05, każdy wariant): rury naczyń biorcy i przeszczepu, moczowodów, cewnika JJ, mięśnia lędźwiowego, brzegów nacięcia pęcherza
// nie przechodzą przez siebie (poza połączeniami: rozwidlenia, zespolenia, miedniczka–moczowód, JJ w moczowodzie), przez nerkę ani przez pęcherz;
// półprzezroczyste struktury (pęcherz, mięśnie, kości, otrzewna, powłoki) rysowane po nieprzezroczystych (bez „prześwitywania” na wierzch).
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
const orbit=fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8');
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); const errs=[], fails=[], sleep=ms=>new Promise(r=>setTimeout(r,ms));
function ok(c,m){ if(!c) fails.push(m); }
function boot(lang,mobile){ const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'}); const w=dom.window;
  w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1'); if(lang) w.localStorage.setItem('surgitome-lang',lang);
  w.matchMedia=q=>({matches:!!mobile&&/max-width/.test(q),addEventListener(){}});
  w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
  w.THREE=T; w.eval(orbit); w.addEventListener('error',e=>errs.push(e.message||String(e.error))); w.eval(sc[0]); w.eval(sc[1]); return w; }
const KEYS=['carrel','nopatch','iia','rv','pl'];
// --- przenikanie rur: oś (krzywa) i promień z geometry.userData.tube, nazwa siatki = struktura ---
const JOIN=['AO CIA','AO CIAL','CIA CIAL','IVC CIV','IVC CIVL','CIV CIVL','CIA EIA','CIA IIA','EIA IIA','CIV EIV','CIV IIV','EIV IIV','IIA IIAd','EIA IEA1','IEA1 IEA2','IEV1 IEV2','EIA IEV1','EIV IEV1',
  'gArt EIA','gArt IIA','gVein EIV','gVein gExt','gExt EIV','gUre pelvis','JJ pelvis'].map(x=>x.split(' '));
const SKIP=[['JJ','gUre'],['det1','det2']];   // cewnik w moczowodzie; brzegi nacięcia pęcherza (na początku jedna linia)
const PEN_TOL=-0.05;                           // 0,05 j. ≈ 0,7 mm
function tubesOf(T,M){ const o=[]; M.grp.updateMatrixWorld(true);
  M.grp.traverse(x=>{ if(!x.isMesh||!x.name||!x.geometry.userData.tube) return; for(let p=x;p;p=p.parent) if(p.visible===false) return; if(x.material.opacity<0.3) return;
    const {c,r}=x.geometry.userData.tube, n=Math.max(12,Math.round(c.getLength()*8)), P=[]; for(let i=0;i<=n;i++) P.push([c.getPointAt(i/n).applyMatrix4(x.matrixWorld),r(i/n)]); o.push({id:x.name,P}); }); return o; }
const has=(L,a,b)=>L.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a));
function endsOn(a,b){ const o=[]; [a.P[0],a.P[a.P.length-1]].forEach(([p,r])=>{ let mn=1e9; for(const [q,r2] of b.P) mn=Math.min(mn,p.distanceTo(q)-r2); if(mn<r+0.15) o.push(p); }); return o; }
function pen(a,b){ if(has(SKIP,a.id,b.id)) return 1e9; const J=has(JOIN,a.id,b.id)?endsOn(a,b).concat(endsOn(b,a)):[]; let mn=1e9;
  for(const [p,r] of a.P){ if(J.some(j=>p.distanceTo(j)<r*2+0.6)) continue; for(const [q,r2] of b.P){ if(J.some(j=>q.distanceTo(j)<r2*2+0.6)) continue; mn=Math.min(mn,p.distanceTo(q)-r-r2); } } return mn; }
function penetrations(T,M,m){ const L=tubesOf(T,M), bad=[];
  for(let i=0;i<L.length;i++) for(let j=i+1;j<L.length;j++){ const d=pen(L[i],L[j]); if(d<PEN_TOL) bad.push(L[i].id+'×'+L[j].id+' '+d.toFixed(2)+' @m='+m); }
  const t=M.test, km=t.kidMesh, pos=km.geometry.attributes.position; km.updateMatrixWorld(true);
  if(t.kid.visible) for(const u of L){ if(/^(gArt|gVein|gExt|pelvis)$/.test(u.id)) continue; const st=u.P[0][0]; let mn=1e9;   // naczynia przeszczepu i miedniczka wychodzą z wnęki
    for(let q=0;q<pos.count;q+=3){ const p=new T.Vector3().fromBufferAttribute(pos,q).applyMatrix4(km.matrixWorld); for(const [c,r] of u.P){ if(/gUre|JJ/.test(u.id)&&c.distanceTo(st)<1.2) continue; mn=Math.min(mn,p.distanceTo(c)-r); } }
    if(mn<PEN_TOL) bad.push('nerka×'+u.id+' '+mn.toFixed(2)+' @m='+m); }
  const B=t.blad; B.updateMatrixWorld(true); const inv=B.matrixWorld.clone().invert(), sc=Math.min(B.scale.x,B.scale.y,B.scale.z);
  for(const u of L){ if(/^det/.test(u.id)) continue; let mn=1e9; const n=u.P.length;   // moczowody i JJ kończą się w pęcherzu
    u.P.forEach(([c,r],i)=>{ if(/^(URN|gUre|JJ)$/.test(u.id)&&i>n*0.6) return; mn=Math.min(mn,(c.clone().applyMatrix4(inv).length()-1)*sc-r); });
    if(mn<PEN_TOL) bad.push('pęcherz×'+u.id+' '+mn.toFixed(2)+' @m='+m); }
  return bad; }
(async()=>{
  let w=boot(); await sleep(300); const A=w.ANAT, S=w.__sgTest.state(), D=w.document;
  // kategoria: Transplantologia z nerką i OLTx; OLTx nie w „Wątrobie”
  const cat=A.CATS.find(c=>c.id==='tx'); ok(cat&&cat.name==='Transplantologia','brak kategorii Transplantologia');
  const tx=A.PROCS.filter(p=>p.cat==='tx').map(p=>p.id); ok(tx.join(',')==='ktx,oltx','zabiegi w Transplantologii: '+tx.join(','));
  ok(!A.PROCS.some(p=>p.cat==='liver'&&p.id==='oltx'),'OLTx wciąż w Wątrobie');
  [...D.querySelectorAll('#cats .cat')].find(b=>/Transplantologia/.test(b.textContent)).click(); await sleep(400);
  const tabs=[...D.querySelectorAll('#tabs .tab')].map(b=>b.textContent); ok(tabs.some(t=>/nerki/.test(t))&&tabs.some(t=>/wątroby/.test(t)),'karty: '+tabs.join('|'));
  const an=A.PROCS.findIndex(p=>p.id==='ktx'), P=A.PROCS[an]; ok(P.variants.length===5,'wariantów '+P.variants.length);
  for(let vi=0;vi<P.variants.length;vi++){
    const key=KEYS[vi]; w.__sgTest.open(an,vi,0); const F=w.__sgTest.frames(), M=w.__sgTest.model(); ok(M.ktx,'brak modelu nerki: '+key);
    ok(F.length===8,key+': kadrów '+F.length);
    for(let fi=0;fi<F.length;fi++){ w.__sgTest.open(an,vi,fi); S.playing=false; w.__sgTest.at(F[fi].m1); await sleep(4);
      const L=w.__sgTest.ktx(); ok(L&&L.labels.length>0,key+' kadr '+fi+': brak etykiet'); if(process.env.V) console.log(key,fi,F[fi].k,L.labels.join(' | ')); }
    const t=M.ktx.test, st=t.state;
    ok(st(0).oSk===0 && st(0.95).oSk>0.99 && st(0.95).oTF>0.99,key+': powłoki nie otwarte w kadrze „Cięcie”');
    ok(st(0.95).wall>0.99 && st(1.2).wall<0.01,key+': powłoki nie przygaszone po odsłonięciu');
    ok(st(1.2).move===0 && st(2).move>0.99,key+': nerka nie przechodzi ze stołu do dołu biodrowego');
    ok(st(2).vein===0 && st(3).vein>0.99 && st(3).art===0 && st(4).art>0.99 && st(4).ure===0 && st(5).ure>0.99,key+': kolejność zespoleń');
    ok(st(3.5).clV===1 && st(3.95).clV===0 && st(3.95).clA===0 && st(3.7).rep===0 && st(4).rep>0.99,key+': reperfuzja / zaciski');
    ok(st(4.4).jj===0 && st(5).jj>0.99,key+': cewnik JJ');
    if(key==='iia'){ ok(st(3.4).iiaCut===1 && st(3.6).iiaSw>0.99,'iia: tętnica biodrowa wewnętrzna nie przecięta / nie odwrócona'); ok(t.TA===null,'iia: zespolenie z t. biodrową zewnętrzną'); }
    if(key==='rv') ok(st(1.5).ext>0.99,'rv: brak przedłużenia żyły');
    if(key==='pl') ok(st(4.2).cys===1 && st(4.75).rU>0.5,'pl: cystotomia / nowe ujście');
    // nerka w dole biodrowym pod powłokami (przed skórą od środka), nie za mięśniem biodrowym
    w.__sgTest.open(an,vi,7); S.playing=false; w.__sgTest.at(5); const kc=t.kid.position, A2=w.ANAT;
    ok(kc.z < A2.BODY.z(kc.x,kc.y)-2 && kc.z-A2.KTX.KID.t > A2.KTX.iliacZ(kc.x,kc.y),key+': nerka poza dołem biodrowym '+kc.toArray().map(x=>x.toFixed(2)));
    // przenikanie w całym przebiegu (od dołu biodrowego do stanu po)
    const M2=w.__sgTest.model().ktx, P=[]; for(let k=0;k<=80;k++){ const m=+(1+k*0.05).toFixed(2); M2.update(m); P.push(...penetrations(T,M2,m)); }
    const worst={}; P.forEach(x=>{ const k=x.split(' ')[0]; if(!worst[k]) worst[k]=x; }); ok(!P.length,key+': przenikanie ('+P.length+'): '+Object.values(worst).slice(0,6).join(' | '));
    // kolejność rysowania: nieprzezroczyste rury bez przezroczystości; pęcherz i mięsień lędźwiowy rysowane po nich
    M2.update(5); const G=n=>M2.grp.getObjectByName(n);
    ok(!G('gArt').material.transparent && !G('EIA').material.transparent && !G('URN').material.transparent,key+': nieprzezroczyste rury w kolejce przezroczystych');
    ok(M2.test.blad.renderOrder>0 && G('psoas').renderOrder>0 && M2.test.blad.material.transparent,key+': pęcherz / mięsień lędźwiowy rysowane przed strukturami za nimi');
  }
  // EN
  w=boot('en'); await sleep(300); const A3=w.ANAT, S3=w.__sgTest.state(), PL=/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/, bad=[];
  const an3=A3.PROCS.findIndex(p=>p.id==='ktx');
  for(let vi=0;vi<5;vi++){ w.__sgTest.open(an3,vi,0); const F=w.__sgTest.frames();
    for(let fi=0;fi<F.length;fi++){ w.__sgTest.open(an3,vi,fi); S3.playing=false; w.__sgTest.at(F[fi].m1); await sleep(3);
      ['capTitle','capText'].forEach(k=>{ const t=w.document.getElementById(k).textContent; if(PL.test(t)) bad.push(vi+' '+fi+':'+t.slice(0,60)); });
      [...w.document.querySelectorAll('#labels .lbl b, #labels .lbl small')].forEach(e=>{ if(PL.test(e.textContent)) bad.push(vi+' '+fi+':'+e.textContent); }); } }
  ok(!bad.length,'EN: polskie teksty ('+bad.length+'): '+[...new Set(bad)].slice(0,6).join(' | '));
  console.log('przeszczepienie nerki:',KEYS.join(','));
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
