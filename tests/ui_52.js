// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Nowe zabiegi (audyt 2026-11-24): kolektomia z ileostomią końcową (subtotalna, proktokolektomia), odtworzenie ciągłości po Hartmannie, zamknięcie ileostomii,
// appendektomia (pętle, stapler), cholecystektomia laparoskopowa, gastrostomia (PEG, Stamm), jejunostomia sposobem Witzla.
// Wszystkie kadry bez błędów i z etykietami; kategorie; dostęp (kolorektalne); zamknięcie ileostomii — ramiona po zamknięciu stykają się (ciągłość);
// Hartmann → odtworzenie: linia zszywek kikuta widoczna od początku; appendektomia — krezka zawsze widoczna; cholecystektomia — CVS (etykieta „dwie struktury”);
// EN — teksty bez polskich znaków.
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
const NEW={ tcei:'colon', hrev:'colon', iclo:'colon', appy:'colon', chole:'hpb', gstom:'upper', witzel:'sb' };
const lblOn=w=>[...w.document.querySelectorAll('#labels .lbl')].filter(e=>e.style.display!=='none'&&e.style.opacity!=='0');
(async()=>{
  let w=boot(); await sleep(300); const A=w.ANAT, S=w.__sgTest.state();
  for(const id in NEW){ const an=A.PROCS.findIndex(p=>p.id===id); ok(an>=0,'brak zabiegu: '+id); if(an<0) continue;
    const P=A.PROCS[an]; ok(P.cat===NEW[id],id+': kategoria '+P.cat);
    for(let vi=0;vi<P.variants.length;vi++){ const v=P.variants[vi]; w.__sgTest.open(an,vi,0); const F=w.__sgTest.frames();
      if(P.cat==='colon') ok(v.access && A.ACCESS[v.access],id+'/'+v.id+': brak slajdu „Dostęp”');
      for(let fi=0;fi<F.length;fi++){ w.__sgTest.open(an,vi,fi); S.playing=false; const m=F[fi].m1==null?F[fi].m0:F[fi].m1; w.__sgTest.at(m); await sleep(4);
        if(F[fi].kind==='orbit') ok(lblOn(w).length>0,v.id+' kadr '+fi+': brak etykiet'); }
    }
  }
  // zamknięcie ileostomii: po operacji ramię wydzielnicze kończy się tam, gdzie zaczyna się odprowadzające
  const iv=A.PROCS.find(p=>p.id==='iclo').variants[0], pr=iv.objects.find(o=>o.id==='prox'), di=iv.objects.find(o=>o.id==='dist');
  const a=pr.post.path[pr.post.path.length-1], b=di.post.path[0]; ok(Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2])<0.3,'zamknięcie ileostomii: ramiona nie stykają się po operacji');
  // odtworzenie ciągłości po Hartmannie: linia zszywek kikuta widoczna od początku (m = 0), pierścień EEA dopiero po zespoleniu
  const hv=A.PROCS.find(p=>p.id==='hrev').variants[0], st=hv.marks.find(m=>m.fullStump), rg=hv.marks.find(m=>m.kind==='loop'&&/EEA/.test(m.name||''));
  ok(st && st.opacity[0][0]<0 && st.opacity[1][1]===1,'Hartmann → odtworzenie: linia zszywek kikuta nie od początku'); ok(rg && rg.opacity[0][0]>3,'Hartmann → odtworzenie: pierścień EEA za wcześnie');
  // appendektomia: krezka wyrostka zawsze widoczna (bez przełącznika krezki), tętnica podwiązana
  const ap=A.PROCS.find(p=>p.id==='appy').variants[0], ms=ap.cutTools.find(t=>t.type==='meso'); ok(ms && ms.always && ms.vessels.some(v=>v.tie!=null),'appendektomia: krezka niewidoczna lub bez podwiązania');
  // cholecystektomia: w kadrze CVS etykieta „Dwie i tylko dwie struktury”, po operacji kikuty
  const anC=A.PROCS.findIndex(p=>p.id==='chole'), FC=A.PROCS[anC].variants[0].singleFrames, ci=FC.findIndex(f=>f.k==='cvs');
  w.__sgTest.open(anC,0,ci); S.playing=false; w.__sgTest.at(1); await sleep(20);
  ok(lblOn(w).some(e=>/Dwie i tylko dwie/.test(e.textContent)),'cholecystektomia: brak etykiety CVS');
  w.__sgTest.open(anC,0,FC.length-1); S.playing=false; w.__sgTest.at(3); await sleep(20);
  ok(lblOn(w).some(e=>/Kikut przewodu pęcherzykowego/.test(e.textContent)),'cholecystektomia: brak kikuta przewodu po operacji');
  // EN
  w=boot('en'); await sleep(300); const A2=w.ANAT, S2=w.__sgTest.state(), PL=/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/, bad=[];
  for(const id in NEW){ const an=A2.PROCS.findIndex(p=>p.id===id);
    for(let vi=0;vi<A2.PROCS[an].variants.length;vi++){ w.__sgTest.open(an,vi,0); const F=w.__sgTest.frames();
      for(let fi=0;fi<F.length;fi++){ w.__sgTest.open(an,vi,fi); S2.playing=false; w.__sgTest.at(F[fi].m1==null?F[fi].m0:F[fi].m1); await sleep(3);
        ['capTitle','capText'].forEach(k=>{ const t=w.document.getElementById(k).textContent; if(PL.test(t)) bad.push(id+' '+fi+':'+t.slice(0,50)); });
        [...w.document.querySelectorAll('#labels .lbl b, #labels .lbl small')].forEach(e=>{ if(PL.test(e.textContent)) bad.push(id+' '+fi+':'+e.textContent); }); } } }
  ok(!bad.length,'EN: polskie teksty: '+bad.slice(0,4).join(' | '));
  console.log('nowe zabiegi:',Object.keys(NEW).join(','));
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
