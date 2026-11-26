// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Bariatria — slajd „Dostęp” we wszystkich zabiegach kategorii (rękaw, RYGB, OAGB, przełączenie dwunastnicze, BPD Scopinaro): pierwszy kadr, zestawy dostępów
// (laparoskopia wszędzie; robot poza BPD; otwarty tylko RYGB, przełączenie dwunastnicze i BPD), porty w obrębie powłok co ≥ 6 cm, optyka ok. 15 cm poniżej
// wyrostka mieczykowatego na lewo od linii pośrodkowej (wprowadzana pierwsza), retraktor wątroby pod wyrostkiem, 12 mm w obu liniach środkowo-obojczykowych,
// przełączenie dwunastnicze i BPD — 6 trokarów; robot: 4 porty w jednej linii ok. 18–20 cm poniżej wyrostka, co 6–10 cm, kamera nieco na lewo od linii
// pośrodkowej, stapler 12 mm po lewej, asystent ≥ 8 cm od kamery i ramion; cięcie pośrodkowe od wyrostka mieczykowatego; okno bez przycisków
// nieoferowanych dostępów, klawisze 1–4 wg widocznych przycisków; trokary widoczne po wyborze; EN
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
  let w=boot(); await sleep(300); const $=id=>w.document.getElementById(id), A=w.ANAT, B=A.BODY, CM=1/1.64, XI=B.LM.xiph[1];
  const BAR=A.PROCS.filter(p=>p.cat==='bar').map(p=>p.id), OPEN=['rygb','ds','bpd'];
  ok(BAR.join()==='sleeve,rygb,oagb,ds,bpd','kategoria Bariatria: '+BAR.join());
  const dist=(P,Q)=>Math.hypot(P.at[0]-Q.at[0],P.at[1]-Q.at[1]);
  BAR.forEach(id=>{ const X=A.ACCESS[id]; ok(X&&X.lap,id+': brak dostępu laparoskopowego'); if(!X) return;
    A.PROCS.find(p=>p.id===id).variants.forEach(v=>ok(v.access===id,v.id+': brak slajdu „Dostęp”'));
    ok(!!X.open===OPEN.includes(id),id+': dostęp otwarty '+(X.open?'oferowany':'nieoferowany'));
    ok(!!X.rob===(id!=='bpd'),id+': robot '+(X.rob?'oferowany':'nieoferowany'));
    ['open','lap','rob'].forEach(k=>{ const D=X[k]; if(!D) return;
      ok(D.title&&D.text&&D.short,id+'/'+k+': brak tytułu, opisu lub podpisu w oknie');
      (D.ports||[]).forEach((P,i)=>{ ok(Math.abs(P.at[0])<B.W(P.at[1])*0.92&&P.at[1]<XI&&P.at[1]>B.LM.pubis[1]+1.2,id+'/'+k+': port '+i+' poza powłokami brzucha');
        (D.ports||[]).forEach((Q,j)=>{ if(j>i) ok(dist(P,Q)>6*CM,id+'/'+k+': porty '+i+' i '+j+' bliżej niż 6 cm ('+(dist(P,Q)/CM).toFixed(1)+' cm)'); }); });
      const liver=(D.ports||[]).find(P=>/retraktor wątroby/.test(P.name));
      if(k!=='open') ok(liver&&Math.abs(liver.at[0])<0.5&&XI-liver.at[1]<3*CM,id+'/'+k+': retraktor wątroby nie pod wyrostkiem mieczykowatym'); });
    // laparoskopia: optyka 12 mm pierwsza, ok. 15 cm poniżej wyrostka, na lewo od linii pośrodkowej; 12 mm w obu liniach środkowo-obojczykowych
    const L=X.lap, cam=L.ports[L.first], d15=(XI-cam.at[1])/CM;
    ok(cam&&/optyka/.test(cam.name)&&cam.mm===12&&cam.at[0]>0&&cam.at[0]<4*CM&&d15>12&&d15<18,id+': optyka nie ok. 15 cm poniżej wyrostka, na lewo ('+d15.toFixed(1)+' cm)');
    ok(L.ports.some(P=>P.mm===12&&Math.abs(P.at[0]-B.MCL)<1.5)&&L.ports.some(P=>P.mm===12&&Math.abs(P.at[0]+B.MCL)<1.5),id+': brak 12 mm w obu liniach środkowo-obojczykowych');
    ok(L.ports.length===(['ds','bpd'].includes(id)?6:5),id+': liczba trokarów '+L.ports.length);
    // robot: 4 porty w jednej linii, co 6–10 cm, kamera nieco na lewo, stapler 12 mm po lewej, asystent ≥ 8 cm od kamery i ramion
    const R=X.rob; if(R){ const arms=R.ports.filter(P=>!P.assist).sort((a,b)=>a.at[0]-b.at[0]), rc=arms.find(P=>/kamera/.test(P.name)), as=R.ports.find(P=>P.assist&&/asystent/.test(P.name));
      ok(arms.length===4&&arms.every(P=>Math.abs(P.at[1]-arms[0].at[1])<0.05)&&R.line,id+': porty robota nie w jednej linii');
      arms.forEach((P,i)=>{ if(i){ const d=dist(P,arms[i-1])/CM; ok(d>=6&&d<=10.5,id+': odstęp portów robota '+d.toFixed(1)+' cm'); } });
      const d20=(XI-arms[0].at[1])/CM; ok(d20>16&&d20<21,id+': porty robota nie ok. 18–20 cm poniżej wyrostka ('+d20.toFixed(1)+' cm)');
      ok(rc&&rc.at[0]>0&&rc.at[0]<3*CM&&R.ports[R.first]===rc,id+': kamera robota nie nieco na lewo od linii pośrodkowej albo nie pierwsza');
      ok(arms.some(P=>P.mm===12&&/stapler/.test(P.name)&&P.at[0]>0),id+': brak portu 12 mm pod stapler po lewej');
      ok(as&&as.mm===12&&dist(as,rc)>8*CM&&arms.every(P=>dist(as,P)>8*CM),id+': port asystenta bliżej niż 8 cm od kamery lub ramienia'); }
    if(X.open){ const c=X.open.cuts[0]; ok(X.open.cuts.length===1&&c.pts.every(p=>Math.abs(p[0])<0.8)&&XI-c.pts[0][1]<1.5*CM,id+': cięcie nie pośrodkowe od wyrostka mieczykowatego'); }
  });
  // interfejs: rękaw — pierwszy kadr „Dostęp”, bez przycisku „Otwarty”; laparoskopia — 5 trokarów
  await search(w,'rękawowa resekcja');
  ok(w.__sgTest.frames()[0].k==='access'&&!$('acc').hidden,'rękaw: brak slajdu „Dostęp” albo okna wyboru');
  const btn=k=>w.document.querySelector('#acc .accopt[data-acc="'+k+'"]');
  ok(btn('open').hidden&&!btn('lap').hidden&&!btn('rob').hidden,'rękaw: zły zestaw przycisków');
  key(w,'1'); await sleep(200); w.__sgTest.at(-0.02);   // klawisze 1–4 — kolejne widoczne przyciski (w rękawie: 1 laparoskopia, 2 robot)
  const vis=st=>st.ports.filter(p=>p.g.visible).length, s1=w.__sgTest.model().access.sets;
  console.log('rękaw — laparoskopia, widoczne trokary:',vis(s1.lap),'| podpis:',$('capTitle').textContent);
  ok(s1.lap.g.visible&&vis(s1.lap)===5&&!s1.open,'rękaw: zły zestaw trokarów');
  $('accChange').click(); await sleep(100); key(w,'2'); await sleep(200); ok(w.localStorage.getItem('surgitome-dostep')==='rob','rękaw: klawisz 2 nie wybiera robota (drugiego widocznego przycisku)');
  key(w,'3'); await sleep(100); ok(w.localStorage.getItem('surgitome-dostep')==='rob','rękaw: klawisz 3 wybiera nieoferowany dostęp');
  // BPD: bez robota; otwarty — cięcie
  await search(w,'Scopinaro'); await sleep(600); ok(btn('rob').hidden&&!btn('open').hidden,'BPD: zły zestaw przycisków');
  key(w,'1'); await sleep(300); w.__sgTest.at(-0.02); const s2=w.__sgTest.model().access.sets.open;
  ok(s2.g.visible&&s2.cuts.length===1&&s2.cuts[0].wm.visible,'BPD: brak cięcia pośrodkowego');
  // przełączenie dwunastnicze — oba warianty, robot: 6 portów (4 ramiona, asystent, retraktor)
  await search(w,'BPD-DS'); await sleep(600); key(w,'3'); await sleep(300); w.__sgTest.at(-0.02); const s3=w.__sgTest.model().access.sets.rob;
  console.log('BPD-DS — robot, widoczne porty:',vis(s3)); ok(s3.g.visible&&vis(s3)===6,'BPD-DS: zły zestaw portów robota');
  // EN
  w=boot('en'); await sleep(300); await search(w,'sleeve gastrectomy'); key(w,'1'); await sleep(200);
  const te=w.document.getElementById('capTitle').textContent, tx=w.document.getElementById('capText').textContent;
  console.log('EN:',te,'|',tx.slice(0,60)); ok(te==='Laparoscopic approach'&&!/[ąćęłńóśźż]/i.test(tx),'EN: opis dostępu nieprzetłumaczony');
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
