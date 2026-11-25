// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Endokrynologia (2026-11-25): tyreoidektomia (całkowita, lobektomia, + przedział VI, + boczna II–V), paratyreoidektomia (celowana, obustronna,
// subtotalna, całkowita z autoprzeszczepem), adrenalektomia laparoskopowa (prawa, lewa). Kategoria i podgrupy; wszystkie kadry bez błędów i z etykietami;
// anatomia: przytarczyce górne grzbietowo, dolne brzusznie od nerwu krtaniowego wstecznego; żyła nadnerczowa prawa do żyły głównej dolnej, lewa do nerkowej;
// dostęp — slajd „Dostęp” tylko z laparoskopią (adrenalektomia) i schemat ułożenia na boku (lustrzany po lewej, tylko w tym kadrze); etykiety kluczowe (CVS nerwu, kikut, PTH, autoprzeszczep); EN — teksty bez polskich znaków.
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
const orbit=fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8');
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); const errs=[], fails=[], sleep=ms=>new Promise(r=>setTimeout(r,ms));
function ok(c,m){ if(!c) fails.push(m); }
function boot(lang){ const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'}); const w=dom.window;
  w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1'); if(lang) w.localStorage.setItem('surgitome-lang',lang);
  w.matchMedia=()=>({matches:false,addEventListener(){}});
  w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
  w.THREE=T; w.eval(orbit); w.addEventListener('error',e=>errs.push(e.message||String(e.error))); w.eval(sc[0]); w.eval(sc[1]); return w; }
const lblOn=w=>[...w.document.querySelectorAll('#labels .lbl')].filter(e=>e.style.display!=='none'&&e.style.opacity!=='0');
const NEW={ thyr:4, ptx:4, adr:2 };
async function at(w,an,vi,fi,m){ const S=w.__sgTest.state(); w.__sgTest.open(an,vi,fi); S.playing=false; w.__sgTest.at(m); await sleep(40); }
(async()=>{
  let w=boot(); await sleep(300); const A=w.ANAT, S=w.__sgTest.state();
  // kategoria i podgrupy
  ok(A.CATS.some(c=>c.id==='endo'&&c.name==='Endokrynologia'),'brak kategorii Endokrynologia');
  ok(A.SUBS.endo && A.SUBS.endo.map(g=>g.ids.join()).join('|')==='thyr|ptx|adr','podgrupy endokrynologii: '+JSON.stringify(A.SUBS.endo));
  const ti=A.CATS.findIndex(c=>c.id==='trials'), ei=A.CATS.findIndex(c=>c.id==='endo'); ok(ti<0||ei<ti,'Endokrynologia po badaniach');
  for(const id in NEW){ const an=A.PROCS.findIndex(p=>p.id===id); ok(an>=0,'brak zabiegu: '+id); if(an<0) continue;
    const P=A.PROCS[an]; ok(P.cat==='endo',id+': kategoria '+P.cat); ok(P.variants.length===NEW[id],id+': liczba wariantów '+P.variants.length);
    for(let vi=0;vi<P.variants.length;vi++){ const v=P.variants[vi]; w.__sgTest.open(an,vi,0); const F=w.__sgTest.frames();
      if(id==='adr'){ ok(v.access && A.ACCESS[v.access] && A.ACCESS[v.access].lap && !A.ACCESS[v.access].open && !A.ACCESS[v.access].rob, v.id+': dostęp tylko laparoskopowy'); ok(F[0].k==='access',v.id+': pierwszy kadr to nie „Dostęp”'); }
      else ok(F[0].k==='acc' && F[0].short==='Dostęp',v.id+': pierwszy kadr to nie „Dostęp”');
      ok(F[F.length-1].k==='post',v.id+': ostatni kadr to nie stan po operacji');
      for(let fi=0;fi<F.length;fi++){ const m=F[fi].m1==null?F[fi].m0:F[fi].m1; await at(w,an,vi,fi,(F[fi].m0+m)/2); await at(w,an,vi,fi,m);
        ok(lblOn(w).length>0,v.id+' kadr '+fi+' ('+F[fi].k+'): brak etykiet'); }
    }
  }
  // anatomia: przytarczyce górne grzbietowo (z mniejsze), dolne brzusznie od nerwu krtaniowego wstecznego na tej samej wysokości
  const N=A.NECK; function rlnZ(k,y){ const P=N.P.rln[k]; for(let i=0;i<P.length-1;i++){ const a=P[i],b=P[i+1]; if((y-a[1])*(y-b[1])<=0 && a[1]!==b[1]){ const t=(y-a[1])/(b[1]-a[1]); return a[2]+(b[2]-a[2])*t; } } return null; }
  [[-1,'R'],[1,'L']].forEach(([s,k])=>{ const sup=N.glandAt(s,'sup',0.12).c, inf=N.glandAt(s,'inf',0.12).c;
    ok(sup[2]<rlnZ(k,sup[1]),'przytarczyca górna '+k+' nie leży grzbietowo od nerwu'); ok(inf[2]>rlnZ(k,inf[1]),'przytarczyca dolna '+k+' nie leży brzusznie od nerwu'); });
  // żyły nadnerczowe: prawa kończy się na ścianie żyły głównej dolnej, lewa przy żyle nerkowej lewej
  const V=A.ADRENAL.V, ivcEnd=V.rav[V.rav.length-1], lavEnd=V.lav[V.lav.length-1];
  const dI=Math.hypot(ivcEnd[0]-(-1.6),ivcEnd[2]-(-4.6)); ok(dI>0.7&&dI<1.25,'żyła nadnerczowa prawa nie dochodzi do ściany żyły głównej dolnej: '+dI.toFixed(2));
  const Q=N.poly(V.lrv), dL=N.near(Q,lavEnd[0],lavEnd[1],lavEnd[2]).d; ok(dL<0.7,'żyła nadnerczowa lewa nie dochodzi do żyły nerkowej lewej: '+dL.toFixed(2));
  const rlen=N.poly(V.rav).L, llen=N.poly(V.lav).L; ok(rlen<1.4 && llen>1.6,'długości żył nadnerczowych (prawa krótka, lewa dłuższa): '+rlen.toFixed(2)+' / '+llen.toFixed(2));
  // etykiety kluczowe
  async function frameBy(id,vi,k,q){ const an=A.PROCS.findIndex(p=>p.id===id); w.__sgTest.open(an,vi,0); const F=w.__sgTest.frames(), fi=F.findIndex(f=>f.k===k); const m=F[fi].m0+((F[fi].m1==null?F[fi].m0:F[fi].m1)-F[fi].m0)*(q==null?1:q); await at(w,an,vi,fi,m); return lblOn(w).map(e=>e.textContent).join(' | '); }
  let t=await frameBy('thyr',0,'post'); ok(/Nerw krtaniowy wsteczny prawy/.test(t)&&/Nerw krtaniowy wsteczny lewy/.test(t),'tyreoidektomia: po operacji brak obu nerwów krtaniowych wstecznych');
  t=await frameBy('thyr',0,'rln',0.4); ok(/Neuromonitoring/.test(t),'tyreoidektomia: brak etykiety neuromonitoringu');
  t=await frameBy('thyr',1,'post'); ok(/Brzeg cieśni zamknięty/.test(t),'lobektomia: brak brzegu cieśni');
  t=await frameBy('thyr',2,'cnd',0.2); ok(/Węzły przytchawicze prawe/.test(t),'przedział VI: brak węzłów przytchawiczych');
  t=await frameBy('thyr',3,'lnd'); ok(/Nerw dodatkowy/.test(t)&&/Przewód piersiowy/.test(t),'limfadenektomia boczna: brak nerwu dodatkowego lub przewodu piersiowego');
  t=await frameBy('ptx',0,'exp'); ok(/Gruczolak przytarczycy/.test(t),'MIP: brak gruczolaka');
  t=await frameBy('ptx',0,'pth'); ok(/10 min po/.test(t)&&/50% najwyższej wartości/.test(t),'MIP: brak wykresu PTH');
  const pt=N.PTH, top=Math.max(...pt.map(q=>q[1])); ok(pt[3][1]<0.5*top && pt[2][1]>pt[3][1],'PTH: 10 min poniżej 50% najwyższej wartości');
  t=await frameBy('ptx',2,'rest'); ok(/Kikut przytarczycy/.test(t),'subtotalna: brak kikuta');
  t=await frameBy('ptx',3,'at'); ok(/Fragmenty przytarczycy/.test(t)&&/Mięsień ramienno-promieniowy/.test(t),'autoprzeszczep: brak przedramienia');
  t=await frameBy('adr',0,'vein',0.6); ok(/Klipsy/.test(t),'adrenalektomia prawa: brak klipsów');
  t=await frameBy('adr',0,'post'); ok(/Kikut żyły nadnerczowej/.test(t),'adrenalektomia prawa: brak kikuta żyły');
  t=await frameBy('adr',1,'anat'); ok(/Żyła przeponowa dolna lewa/.test(t),'adrenalektomia lewa: brak żyły przeponowej dolnej');
  // dostęp: okno wyboru — tylko „Laparoskopowy”, podpis jednego dostępu
  const anA=A.PROCS.findIndex(p=>p.id==='adr'); w.__sgTest.open(anA,0,0); await sleep(60);
  const vis=[...w.document.querySelectorAll('#acc .accopt')].filter(b=>!b.hidden).map(b=>b.dataset.acc).join(); ok(vis==='lap','adrenalektomia: przyciski dostępu '+vis);
  // schemat ułożenia na boku (kadr „Dostęp” po wyborze dostępu): prawa — na lewym boku, 4 trokary; lewa — na prawym boku, lustrzanie, 3 trokary
  const pose=()=>w.document.getElementById('pose'), lap=async()=>{ w.document.querySelector('#acc .accopt[data-acc="lap"]').click(); await sleep(60); };
  ok(pose().hidden,'schemat ułożenia widoczny pod oknem wyboru dostępu');
  await lap(); ok(!pose().hidden && /Ułożenie na lewym boku/.test(pose().textContent) && /Wałek pod lewym bokiem/.test(pose().textContent),'adrenalektomia prawa: brak schematu ułożenia na lewym boku');
  ok(pose().querySelectorAll('.pz-port').length===4 && !pose().querySelector('svg > g[transform]'),'adrenalektomia prawa: schemat — 4 trokary, bez odbicia');
  w.__sgTest.open(anA,1,0); await sleep(60); if(!w.document.getElementById('acc').hidden) await lap();
  ok(!pose().hidden && /Ułożenie na prawym boku/.test(pose().textContent) && pose().querySelectorAll('.pz-port').length===3 && pose().querySelector('svg > g[transform]'),'adrenalektomia lewa: schemat na prawym boku, 3 trokary, odbity');
  w.__sgTest.open(anA,1,1); await sleep(60); ok(pose().hidden,'schemat ułożenia widoczny poza kadrem „Dostęp”');
  const anO=A.PROCS.findIndex(p=>p.variants.some(v=>v.access && !A.ACCESS[v.access].pose)), viO=A.PROCS[anO].variants.findIndex(v=>v.access);
  w.__sgTest.open(anO,viO,0); await sleep(60); if(!w.document.getElementById('acc').hidden) await lap(); ok(pose().hidden,'schemat ułożenia w zabiegu bez ułożenia na boku: '+A.PROCS[anO].id);
  const anT=A.PROCS.findIndex(p=>p.split); if(anT>=0){ w.__sgTest.open(anA,0,0); await sleep(40); await lap(); w.__sgTest.open(anT,0,0); await sleep(60); ok(pose().hidden,'schemat ułożenia w widoku badań'); }
  // EN
  w=boot('en'); await sleep(300); const A2=w.ANAT, PL=/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/, bad=[];
  for(const id in NEW){ const an=A2.PROCS.findIndex(p=>p.id===id);
    for(let vi=0;vi<A2.PROCS[an].variants.length;vi++){ w.__sgTest.open(an,vi,0); const F=w.__sgTest.frames();
      for(let fi=0;fi<F.length;fi++){ await at(w,an,vi,fi,F[fi].m1==null?F[fi].m0:F[fi].m1);
        ['capTitle','capText'].forEach(k=>{ const t=w.document.getElementById(k).textContent; if(PL.test(t)) bad.push(id+' '+fi+':'+t.slice(0,50)); });
        [...w.document.querySelectorAll('#labels .lbl b, #labels .lbl small')].forEach(e=>{ if(PL.test(e.textContent)) bad.push(id+' '+fi+':'+e.textContent); }); } } }
  ok(!bad.length,'EN: polskie teksty: '+[...new Set(bad)].slice(0,4).join(' | '));
  { const an=A2.PROCS.findIndex(p=>p.id==='adr'); w.__sgTest.open(an,0,0); await sleep(60); const b=w.document.querySelector('#acc .accopt[data-acc="lap"]'); if(!w.document.getElementById('acc').hidden) b.click(); await sleep(60);
    const t=w.document.getElementById('pose').textContent; ok(/Left lateral decubitus/.test(t) && /Table break/.test(t) && !PL.test(t),'EN: schemat ułożenia: '+t.slice(0,80)); }
  console.log('endokrynologia:',Object.keys(NEW).join(','));
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
