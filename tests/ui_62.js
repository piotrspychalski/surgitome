// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Trzustka i drogi żółciowe: slajd „Dostęp” we wszystkich zabiegach kategorii (decyzje autora 2026-11-25: Whipple, PPPD, Puestow/Frey — cięcie podżebrowe
// obustronne, Whipple i PPPD także robot; HJ i CDD — cięcie podżebrowe prawe (Kochera); pankreatektomia dystalna — otwarty / laparoskopia / robot;
// cholecystektomia — laparoskopia w układzie amerykańskim (4 trokary) i konwersja: cięcie Kochera); cięcia podżebrowe poniżej łuku żebrowego, porty co ≥ 6 cm.
// Cholecystektomia (model z 11c / 12-cholecystektomia): pęcherzyk w rzeczywistych wymiarach, odciągnięcie otwiera trójkąt (przewód pęcherzykowy prawie
// prostopadle do przewodu wątrobowego), w CVS trójkąt bez tkanki tłuszczowej, widoczna płytka pęcherzykowa i „okno”, etykiety warunków CVS; kadry
// laparoskopowe ze światłem optyki i tłem, narzędzia; po usunięciu tylko kikuty; EN — teksty bez polskich znaków.
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
const has=(w,re)=>lblOn(w).some(e=>re.test(e.textContent));
(async()=>{
  let w=boot(); await sleep(300); const A=w.ANAT, B=A.BODY, S=w.__sgTest.state(), $=id=>w.document.getElementById(id), CM=1/1.64;
  // 1. dostęp we wszystkich zabiegach kategorii, zestawy wg decyzji autora
  const WANT={ chole:['open','lap'], whip:['open','rob'], pppd:['open','rob'], drain:['open'], hj:['open'], cdd:['open'], dp:['open','lap','rob'] };
  const hpb=A.PROCS.filter(p=>p.cat==='hpb'); ok(hpb.length===7,'kategoria: '+hpb.map(p=>p.id));
  hpb.forEach(p=>{ ok(WANT[p.id],'zabieg bez oczekiwanego dostępu: '+p.id); if(!WANT[p.id]) return;
    p.variants.forEach(v=>ok(v.access===p.id,v.id+': brak dostępu ('+v.access+')'));
    const X=A.ACCESS[p.id], kinds=['open','lap','rob'].filter(k=>X&&X[k]); ok(kinds.join()===WANT[p.id].join(),p.id+': dostępy '+kinds);
    kinds.forEach(k=>{ const D=X[k]; ok(D.title&&D.text&&D.short,p.id+'/'+k+': brak tytułu, opisu lub podpisu');
      (D.ports||[]).forEach((P,i)=>{ ok(Math.abs(P.at[0])<B.W(P.at[1])*0.9&&P.at[1]<B.LM.xiph[1]&&P.at[1]>B.LM.pubis[1]+1,p.id+'/'+k+': port '+i+' poza powłokami');
        (D.ports||[]).forEach((Q,j)=>{ if(j>i) ok(Math.hypot(P.at[0]-Q.at[0],P.at[1]-Q.at[1])>6*CM,p.id+'/'+k+': porty '+i+' i '+j+' bliżej niż 6 cm'); }); });
      if(D.line){ const [a,b]=D.line; D.ports.filter(P=>!P.assist).forEach((P,i)=>{ const cr=((b[0]-a[0])*(P.at[1]-a[1])-(b[1]-a[1])*(P.at[0]-a[0]))/Math.hypot(b[0]-a[0],b[1]-a[1]); ok(Math.abs(cr)<0.15,p.id+': port robota '+i+' poza linią'); }); }
    }); });
  // 2. cięcia podżebrowe: 1,5–4 cm poniżej łuku żebrowego (y łuku przy tym samym x), strona wg zabiegu
  const costal=x=>{ const L=x<0?B.LM.costalR:B.LM.costalL; for(let i=1;i<L.length;i++){ const a=L[i-1],b=L[i]; if((x-a[0])*(x-b[0])<=0){ const u=(x-a[0])/(b[0]-a[0]); return a[1]+(b[1]-a[1])*u; } } return null; };
  const segD=(p,a,b)=>{ const ax=b[0]-a[0], ay=b[1]-a[1], t=Math.max(0,Math.min(1,((p[0]-a[0])*ax+(p[1]-a[1])*ay)/(ax*ax+ay*ay))); return Math.hypot(p[0]-a[0]-ax*t,p[1]-a[1]-ay*t); };
  const toCostal=p=>{ const L=p[0]<0?B.LM.costalR:B.LM.costalL; let d=1e9; for(let i=1;i<L.length;i++) d=Math.min(d,segD(p,L[i-1],L[i])); return d; };
  const sub=(id,side)=>{ const c=A.ACCESS[id].open.cuts[0]; c.pts.forEach(p=>{ const cy=costal(p[0]); if(cy==null||Math.abs(p[0])<1) return; const d=toCostal(p)/CM; ok(p[1]<cy&&d>1.5&&d<4,id+': cięcie '+d.toFixed(1)+' cm od łuku żebrowego przy x '+p[0]); });
    const xs=c.pts.map(p=>p[0]); if(side<0) ok(Math.max(...xs)<0.5&&Math.min(...xs)<-7,id+': cięcie nie po prawej'); else if(side>0) ok(Math.min(...xs)>-0.5&&Math.max(...xs)>7,id+': cięcie nie po lewej'); else ok(Math.min(...xs)<-7&&Math.max(...xs)>7&&c.humps===2,id+': cięcie nie obustronne (chevron)');
    ok(A.ACCESS[id].open.side===side,id+': wyróżniony mięsień prosty'); };
  sub('whip',0); sub('pppd',0); sub('drain',0); sub('hj',-1); sub('cdd',-1); sub('dp',1); sub('chole',-1);
  ok(JSON.stringify(A.ACCESS.chole.open.cuts[0].pts)===JSON.stringify(A.ACCESS.hj.open.cuts[0].pts),'cholecystektomia: konwersja nie cięciem Kochera jak w HJ');
  // 3. cholecystektomia — układ amerykański: pępek (optyka), nadbrzusze na prawo od linii pośrodkowej, prawa linia środkowo-obojczykowa pod łukiem, prawa pachowa przednia
  const cp=A.ACCESS.chole.lap.ports; ok(cp.length===4,'chole: liczba trokarów '+cp.length);
  ok(Math.abs(cp[0].at[0])<0.3&&Math.abs(cp[0].at[1]-B.LM.umb[1])<0.8&&cp[0].mm>=10&&A.ACCESS.chole.lap.first===0,'chole: optyka nie w pępku');
  ok(cp[1].at[0]<0&&cp[1].at[0]>-1.5&&cp[1].at[1]>5.5,'chole: trokar nadbrzuszny nie na prawo od więzadła obłego');
  ok(Math.abs(cp[2].at[0]+B.MCL)<0.6&&cp[2].at[1]<costal(cp[2].at[0]),'chole: trokar w prawej linii środkowo-obojczykowej nie pod łukiem');
  ok(cp[3].at[0]<-8.5&&cp[3].mm===5,'chole: brak trokaru w prawej linii pachowej przedniej');
  // 4. slajd „Dostęp” — pierwszy kadr, okno wyboru z oferowanymi przyciskami
  for(const id of Object.keys(WANT)){ const an=A.PROCS.findIndex(p=>p.id===id); w.__sgTest.open(an,0,0); await sleep(20); const F=w.__sgTest.frames();
    ok(F[0].k==='access',id+': pierwszy kadr '+F[0].k);
    const shown=[...w.document.querySelectorAll('#acc .accopt')].filter(b=>!b.hidden).map(b=>b.dataset.acc).filter(k=>['open','lap','rob'].includes(k));
    ok(shown.join()===WANT[id].join(),id+': przyciski w oknie '+shown); }
  // 5. cholecystektomia — model
  const anC=A.PROCS.findIndex(p=>p.id==='chole'), FC=w.__sgTest.open(anC,0,0)&&w.__sgTest.frames(), fi=k=>FC.findIndex(f=>f.k===k);
  ok(['access','normal','expo','dis','cvs','clip','remove','post'].every(k=>fi(k)>=0),'chole: kadry '+FC.map(f=>f.k));
  const H=A.CHOLE, cG=new T.CatmullRomCurve3(H.GB.map(p=>new T.Vector3(...p))); const len=cG.getLength()+H.gbR(0), rMax=Math.max(...[...Array(41)].map((_,i)=>H.gbR(i/40)));
  ok(len>6&&len<9&&rMax>1.1&&rMax<1.7,'chole: wymiary pęcherzyka '+len.toFixed(1)+' × '+(2*rMax).toFixed(1)+' cm');
  const tool=()=>w.__sgTest.model().tools.find(t=>t.d&&t.d.type==='chole');
  const angle=()=>{ const c=tool().dbg().cur.duct, a=c.getPointAt(0), b=c.getPointAt(1), d=a.clone().sub(b).normalize(), bd=new T.CatmullRomCurve3(H.VES.bd[0].pts.map(p=>new T.Vector3(...p))), t=bd.getTangentAt(H.tCYJ);
    return Math.acos(Math.abs(d.dot(t)))*180/Math.PI; };
  w.__sgTest.open(anC,0,fi('normal')); S.playing=false; w.__sgTest.at(0); await sleep(10); const a0=angle();
  ok(!tool().dbg().back.visible&&!w.__sgTest.model().light,'chole: tło laparoskopowe w kadrze anatomii');
  w.__sgTest.open(anC,0,fi('expo')); S.playing=false; w.__sgTest.at(0.3); await sleep(10); const a1=angle();
  ok(a0<35&&a1>60,'chole: odciągnięcie nie otwiera trójkąta (kąt przewodów '+a0.toFixed(0)+'° → '+a1.toFixed(0)+'°)');
  const db=tool().dbg(); ok(db.back.visible&&w.__sgTest.model().light&&db.G[0].g.visible&&db.G[1].g.visible,'chole: widok laparoskopowy bez światła optyki, tła lub chwytaków');
  ok(db.fat.visible&&has(w,/Kieszonka Hartmanna/),'chole: przed preparowaniem brak tkanki trójkąta lub kieszonki Hartmanna');
  w.__sgTest.open(anC,0,fi('dis')); S.playing=false; w.__sgTest.at(0.6); await sleep(10); ok(has(w,/Rowek Rouvi/),'chole: brak rowka Rouvière’a przy preparowaniu');
  w.__sgTest.open(anC,0,fi('cvs')); S.playing=false; w.__sgTest.at(1); await sleep(10);
  const dc=tool().dbg(), pa=[...dc.plA].filter((v,i)=>i%4===3&&v>0.5).length;
  ok(!dc.fat.visible&&!dc.peri.visible,'CVS: trójkąt nieoczyszczony'); ok(pa>20,'CVS: płytka pęcherzykowa niewidoczna ('+pa+')'); ok(dc.win.visible&&dc.win.children.length>10,'CVS: brak „okna”');
  ok(has(w,/Dwie i tylko dwie/)&&has(w,/Płytka pęcherzykowa/)&&has(w,/Trójkąt oczyszczony/),'CVS: brak etykiet trzech warunków');
  ok(!dc.G.slice(2).some(I=>I.g.visible),'CVS: narzędzie robocze zasłania widok');
  w.__sgTest.open(anC,0,fi('clip')); S.playing=false; w.__sgTest.at(1.9); await sleep(10); ok(has(w,/Kikut przewodu/)&&has(w,/Kikut tętnicy/),'klipsy: brak kikutów po przecięciu');
  w.__sgTest.open(anC,0,fi('post')); S.playing=false; w.__sgTest.at(3); await sleep(10); const dp=tool().dbg();
  ok(!dp.gb.visible&&dp.parts===2,'po operacji: pęcherzyk lub części przy pęcherzyku zostały ('+dp.parts+')'); ok(has(w,/Łoże pęcherzyka/),'po operacji: brak łoża');
  // dostęp: wątroba przezroczysta, bez narzędzi i tła
  w.__sgTest.open(anC,0,0); S.playing=false; w.__sgTest.at(-0.02); await sleep(10); const da=tool().dbg();
  ok(!da.back.visible&&!da.G.some(I=>I.g.visible),'chole: narzędzia lub tło w kadrze „Dostęp”');
  // 6. EN — tytuły i opisy kadrów oraz okna wyboru bez polskich znaków
  w=boot('en'); await sleep(300); const A2=w.ANAT, S2=w.__sgTest.state(), PL=/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/, bad=[];
  for(const p of A2.PROCS.filter(p=>p.cat==='hpb')){ const an=A2.PROCS.indexOf(p);
    for(let vi=0;vi<p.variants.length;vi++){ w.__sgTest.open(an,vi,0); const F=w.__sgTest.frames();
      for(let f=0;f<F.length;f++){ if(F[f].kind==='endo'||F[f].kind==='ct') continue; w.__sgTest.open(an,vi,f); S2.playing=false; w.__sgTest.at(F[f].m1==null?F[f].m0:F[f].m1); await sleep(2);
        ['capTitle','capText'].forEach(k=>{ const t=w.document.getElementById(k).textContent; if(PL.test(t)) bad.push(p.id+' '+f+':'+t.slice(0,50)); });
        lblOn(w).forEach(e=>{ if(PL.test(e.textContent)) bad.push(p.id+' '+f+' etykieta:'+e.textContent.slice(0,40)); }); }
      w.__sgTest.open(an,vi,0); ['open','lap','rob'].forEach(k=>{ const b=w.document.querySelector('#acc .accopt[data-acc="'+k+'"]'); if(b&&!b.hidden&&PL.test(b.textContent)) bad.push(p.id+' okno '+k+':'+b.textContent); }); } }
  ok(!bad.length,'EN: polskie teksty: '+[...new Set(bad)].slice(0,6).join(' | '));
  console.log('zabiegi:',hpb.length,'| kąt przewodów:',a0.toFixed(0)+'° → '+a1.toFixed(0)+'°','| pęcherzyk:',len.toFixed(1),'cm, płytka:',pa,'wierzchołków');
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
