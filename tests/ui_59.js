// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Slajd „Dostęp” w zabiegach żołądka (decyzja autora 2026-11-25): resekcja dystalna i gastrektomia całkowita — otwarty, laparoskopowy, robotyczny;
// gastroenterostomia omijająca i gastrostomia Stamma — otwarty i laparoskopowy; PEG bez slajdu. Laparoskopia resekcji: 5 trokarów (optyka w pępku,
// 2 po prawej, 2 po lewej stronie chorego) + retraktor wątroby pod wyrostkiem mieczykowatym, wydobycie przez cięcie Pfannenstiela; robot — porty w linii
// poprzecznej przy pępku, asystent w prawym dolnym kwadrancie; gastrektomia: dwa warianty dostępu otwartego (laparotomia pośrodkowa górna i cięcie
// podżebrowe obustronne — przycisk open2, klawisze wg kolejności widocznych przycisków), porty w obrębie powłok, co ≥ 6 cm, poniżej łuków żebrowych; EN
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
async function search(w, txt){ const q=w.document.getElementById('q'); q.value=txt; q.dispatchEvent(new w.Event('input')); q.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter'})); await sleep(500); }
const key=(w,k)=>w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true}));
(async()=>{
  let w=boot(); await sleep(300); const $=id=>w.document.getElementById(id), A=w.ANAT, B=A.BODY, CM=1/1.64;
  const P=id=>A.PROCS.find(p=>p.id===id), idx=id=>A.PROCS.findIndex(p=>p.id===id);
  // dane: zakres dostępów
  const EXP={dg:['open','lap','rob'], tg:['open','open2','lap','rob'], gebp:['open','lap'], 'gstom-stamm':['open','lap']};
  Object.keys(EXP).forEach(k=>{ const X=A.ACCESS[k]; ok(X,k+': brak dostępu');
    if(!X) return; const have=['open','open2','lap','rob'].filter(q=>X[q]); ok(have.join()===EXP[k].join(),k+': dostępy '+have.join()+' zamiast '+EXP[k].join());
    have.forEach(q=>{ const D=X[q]; ok(D.title&&D.text&&D.short,k+'/'+q+': brak tytułu, opisu lub podpisu w oknie');
      (D.ports||[]).forEach((Pt,i)=>{ ok(Math.abs(Pt.at[0])<B.W(Pt.at[1])*0.85&&Pt.at[1]<B.LM.xiph[1]&&Pt.at[1]>B.LM.pubis[1]+1.2,k+'/'+q+': port '+i+' poza powłokami brzucha');
        // porty boczne poniżej łuku żebrowego (interpolacja łuku po |x|)
        const ax=Math.abs(Pt.at[0]), C=B.LM.costalL; if(ax>1.5&&ax<C[C.length-1][0]){ let cy=null; for(let j=1;j<C.length;j++) if(ax<=C[j][0]){ const u=(ax-C[j-1][0])/(C[j][0]-C[j-1][0]); cy=C[j-1][1]+u*(C[j][1]-C[j-1][1]); break; } ok(cy==null||Pt.at[1]<cy-0.6,k+'/'+q+': port '+i+' nie poniżej łuku żebrowego'); }
        (D.ports||[]).forEach((Q,j)=>{ if(j>i){ const d=Math.hypot(Pt.at[0]-Q.at[0],Pt.at[1]-Q.at[1]); ok(d>6*CM,k+'/'+q+': porty '+i+' i '+j+' bliżej niż 6 cm ('+(d/CM).toFixed(1)+' cm)'); } }); });
      if(D.line){ const [a,b]=D.line; D.ports.filter(Pt=>Pt.mm===8).forEach((Pt,i)=>{ const cr=((b[0]-a[0])*(Pt.at[1]-a[1])-(b[1]-a[1])*(Pt.at[0]-a[0]))/Math.hypot(b[0]-a[0],b[1]-a[1]); ok(Math.abs(cr)<0.15,k+': port robota '+i+' poza linią portów'); }); } }); });
  ['dg','tg'].forEach(k=>{ const L=A.ACCESS[k].lap, tro=L.ports.filter(Pt=>!/Retraktor/.test(Pt.name)), cam=tro.find(Pt=>/kamera/.test(Pt.name)), ret=L.ports.find(Pt=>/Retraktor/.test(Pt.name));
    ok(tro.length===5,k+': laparoskopia — '+tro.length+' trokarów zamiast 5');
    ok(cam&&cam.at[0]===0&&Math.abs(cam.at[1]-B.LM.umb[1])<1&&cam.mm===12&&L.first===L.ports.indexOf(cam),k+': optyka 12 mm nie w pępku (lub nie pierwsza)');
    ok(tro.filter(Pt=>Pt.at[0]<-1).length===2&&tro.filter(Pt=>Pt.at[0]>1).length===2,k+': trokary nie po 2 z każdej strony');
    ok(tro.filter(Pt=>Pt.mm===12).length===3,k+': nie 3 trokary 12 mm (optyka + po jednym z każdej strony)');
    ok(ret&&ret.at[0]===0&&ret.at[1]>B.LM.xiph[1]-2.5,k+': brak retraktora wątroby pod wyrostkiem mieczykowatym');
    const R=A.ACCESS[k].rob, arms=R.ports.filter(Pt=>Pt.mm===8), as=R.ports.find(Pt=>Pt.assist);
    ok(arms.length===4&&R.robot&&Math.abs(R.line[0][1]-R.line[1][1])<1e-6&&Math.abs(R.line[0][1]-B.LM.umb[1])<2.5,k+': robot — nie 4 porty w linii poprzecznej przy pępku');
    ok(arms.filter(Pt=>Pt.at[0]<-1).length===1&&arms.filter(Pt=>Pt.at[0]>1).length===2,k+': robot — nie 1 ramię po prawej i 2 po lewej');
    ok(as&&as.at[0]<0&&as.at[1]<B.LM.umb[1]&&as.mm===12,k+': port asystenta nie w prawym dolnym kwadrancie');
    [L,R].forEach(D=>ok(D.ext&&D.ext.pts.every(p=>p[1]<-13)&&/Pfannenstiela/.test(D.ext.name),k+': wydobycie nie przez cięcie Pfannenstiela')); });
  const O2=A.ACCESS.tg.open2; ok(O2.cuts.length===1&&O2.cuts[0].pts.some(p=>p[0]<-6)&&O2.cuts[0].pts.some(p=>p[0]>6)&&Math.max(...O2.cuts[0].pts.map(p=>p[1]))<B.LM.xiph[1]-2,'gastrektomia: cięcie podżebrowe nie obustronne lub sięga wyrostka');
  ok(A.ACCESS.tg.open.cuts[0].pts.every(p=>Math.abs(p[0])<0.8)&&A.ACCESS.dg.open.cuts[0].pts[0][1]>7,'laparotomia pośrodkowa górna: zły przebieg');
  // warianty: dostęp we wszystkich wariantach resekcji dystalnej; PEG bez dostępu, Stamm z własnym
  P('dg').variants.forEach(v=>ok(v.access==='dg',v.id+': brak slajdu „Dostęp”')); ok(P('tg').variants.every(v=>v.access==='tg')&&P('gebp').variants.every(v=>v.access==='gebp'),'gastrektomia / gastroenterostomia bez dostępu');
  const gs=P('gstom').variants; ok(!gs.find(v=>v.id==='gstom-peg').access&&gs.find(v=>v.id==='gstom-stamm').access==='gstom-stamm','gastrostomia: PEG z dostępem albo Stamm bez');
  // okno wyboru: gastrektomia — 4 przyciski w kolejności, klawisz 2 = drugi dostęp otwarty
  w.__sgTest.open(idx('tg'),0,0); await sleep(250);
  ok(w.__sgTest.frames()[0].k==='access'&&!$('acc').hidden,'gastrektomia: brak slajdu „Dostęp” lub okna');
  const visB=()=>[...w.document.querySelectorAll('#acc .accopt')].filter(b=>!b.hidden).sort((a,b)=>+w.getComputedStyle(a).order- +w.getComputedStyle(b).order);
  ok(visB().map(b=>b.dataset.acc).join()==='open,open2,lap,rob','gastrektomia: przyciski '+visB().map(b=>b.dataset.acc).join());
  ok(visB().map(b=>b.querySelector('kbd').textContent).join()==='1,2,3,4','gastrektomia: numery klawiszy '+visB().map(b=>b.querySelector('kbd').textContent).join());
  ok($('acc').classList.contains('acc4'),'gastrektomia: okno nie poszerzone przy 4 przyciskach');
  ok(/dwa rodzaje cięcia/.test($('capText').textContent),'gastrektomia: podpis okna nie wspomina dwóch cięć: '+$('capText').textContent);
  key(w,'2'); await sleep(200); w.__sgTest.at(-0.02);
  const T=w.__sgTest.model().access, o2=T.sets.open2; console.log('gastrektomia, klawisz 2:',w.localStorage.getItem('surgitome-dostep'),'|',$('capTitle').textContent);
  ok(w.localStorage.getItem('surgitome-dostep')==='open2'&&o2&&o2.g.visible&&!T.sets.open.g.visible&&o2.cuts[0].wm.visible,'gastrektomia: klawisz 2 nie wybiera cięcia podżebrowego');
  ok(/podżebrowe/.test($('capTitle').textContent),'gastrektomia: tytuł dostępu podżebrowego');
  $('accChange').click(); await sleep(100); key(w,'4'); await sleep(200); w.__sgTest.at(-0.02);
  ok(w.localStorage.getItem('surgitome-dostep')==='rob'&&T.sets.rob.ports.filter(p=>p.g.visible).length===6,'gastrektomia: klawisz 4 nie wybiera robota (5 portów + retraktor)');
  // resekcja dystalna: zapamiętany open2 nieoferowany — okno, 3 przyciski, klawisz 2 = laparoskopia
  w.localStorage.setItem('surgitome-dostep','open2');
  w.__sgTest.open(idx('dg'),2,0); await sleep(250);
  ok(!$('acc').hidden&&visB().map(b=>b.dataset.acc).join()==='open,lap,rob'&&!$('acc').classList.contains('acc4'),'resekcja dystalna: przyciski '+visB().map(b=>b.dataset.acc).join());
  key(w,'2'); await sleep(200); w.__sgTest.at(-0.02); const L2=w.__sgTest.model().access.sets.lap;
  ok(L2.g.visible&&L2.ports.filter(p=>p.g.visible).length===6&&L2.ext.g.visible,'resekcja dystalna: laparoskopia (5 trokarów + retraktor, cięcie Pfannenstiela)');
  ok(A.PROCS[w.__sgTest.state().an].variants[w.__sgTest.state().vi].id===P('dg').variants[2].id,'resekcja dystalna: wybór dostępu zmienił wariant rekonstrukcji');
  // gastroenterostomia: bez robota
  w.__sgTest.open(idx('gebp'),0,0); await sleep(250); ok(visB().map(b=>b.dataset.acc).join()==='open,lap','gastroenterostomia: przyciski '+visB().map(b=>b.dataset.acc).join());
  key(w,'3'); await sleep(100); ok(!$('acc').hidden,'gastroenterostomia: klawisz 3 wybiera nieoferowany dostęp');
  key(w,'1'); await sleep(200); w.__sgTest.at(-0.02); ok(w.__sgTest.model().access.sets.open.cuts[0].wm.visible,'gastroenterostomia: brak laparotomii');
  // gastrostomia: Stamm ze slajdem, PEG bez (przejście między wariantami bez błędów)
  w.__sgTest.open(idx('gstom'),1,0); await sleep(250); ok(w.__sgTest.frames()[0].k==='access'&&!$('acc').hidden,'Stamm: brak slajdu „Dostęp”');
  key(w,'2'); await sleep(200); w.__sgTest.at(-0.02); const SL=w.__sgTest.model().access.sets.lap; ok(SL.stoma&&SL.stoma.g.visible&&SL.ports.filter(p=>p.g.visible).length===3,'Stamm: laparoskopia (3 trokary, miejsce zgłębnika)');
  w.__sgTest.open(idx('gstom'),0,0); await sleep(250); ok(w.__sgTest.frames()[0].k==='normal'&&$('acc').hidden&&!w.__sgTest.model().access,'PEG: slajd „Dostęp” albo okno');
  // klawisze w zabiegu jelitowym bez zmian (1 otwarty, 2 laparoskopia, 3 robot)
  w.__sgTest.open(idx('lh'),0,0); await sleep(250); ok(visB().map(b=>b.querySelector('kbd').textContent+b.dataset.acc).join()==='1open,2lap,3rob','hemikolektomia lewa: klawisze '+visB().map(b=>b.querySelector('kbd').textContent+b.dataset.acc).join());
  // EN
  w=boot('en'); await sleep(300); w.__sgTest.open(w.ANAT.PROCS.findIndex(p=>p.id==='tg'),0,0); await sleep(250);
  const enB=[...w.document.querySelectorAll('#acc .accopt')].filter(b=>!b.hidden).map(b=>b.querySelector('b').textContent+' / '+b.querySelector('small').textContent);
  console.log('EN:',enB.join(' | '),'|',w.document.getElementById('capText').textContent);
  ok(enB.includes('Open / bilateral subcostal incision (rooftop)')&&enB.includes('Laparoscopic / 5 trocars, extraction through a Pfannenstiel incision'),'EN: przyciski dostępu');
  ok(w.document.getElementById('capText').textContent==='Choose the approach: open (two types of incision), laparoscopic or robotic.','EN: podpis okna');
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
