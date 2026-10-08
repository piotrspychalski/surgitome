// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Amputacja brzuszno-kroczowa (APR): kadry, preparat do odbytu, krezka (IMA u odejścia, całe mezorektum), krocze (cięcie, rana, zamknięcie), endoskopia tylko przez kolostomię, piśmiennictwo;
// „Wybór zakresu resekcji” → przycisk „Przejdź do resekcji”: właściwy zabieg i wariant dla każdego odcinka, guz w tym samym miejscu i usuwany z preparatem,
// linie cięcia dopasowane do guza (marginesy), przebudowa modelu po zmianie położenia guza, EN
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
const orbit=fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8');
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); const errs=[], fails=[], sleep=ms=>new Promise(r=>setTimeout(r,ms));
function ok(c,m){ if(!c) fails.push(m); }
function boot(pos, lang){ const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'}); const w=dom.window;
  w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1'); if(pos) w.localStorage.setItem('surgitome-guz-pos',JSON.stringify(pos)); if(lang) w.localStorage.setItem('surgitome-lang',lang);
  w.matchMedia=()=>({matches:false,addEventListener(){}});
  w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
  w.THREE=T; w.eval(orbit); w.addEventListener('error',e=>errs.push(e.message||String(e.error))); w.eval(sc[0]); w.eval(sc[1]); return w; }
async function search(w, txt){ const q=w.document.getElementById('q'); q.value=txt; q.dispatchEvent(new w.Event('input')); q.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter'})); await sleep(500); }
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
(async()=>{
  // --- APR: dane
  let w=boot(null); await sleep(300); const A=w.ANAT, L=A._lib;
  const ids=A.PROCS.filter(p=>p.cat==='colon').map(p=>p.id); ok(ids.indexOf('apr')===ids.indexOf('ar')+1,'APR nie zaraz po resekcji odbytnicy: '+ids.join(','));
  const P=A.PROCS.find(p=>p.id==='apr'), v=P.variants[0];
  ok(!v.objects.some(o=>o.id==='rect'),'APR: odbytnica nie może zostać'); const sp=v.objects.find(o=>o.id==='specS'); ok(sp&&sp.offset&&sp.offset[1][1][1]<0,'APR: preparat nie odjeżdża w stronę krocza');
  ok(v.tumour,'APR: brak guza'); ok(!Array.isArray(v.routePost)===false,'APR: endoskopia powinna mieć jedną drogę (przez kolostomię)');
  ok(v.routePost[0].pt&&v.routePost[0].pt[2]>8,'APR: endoskopia nie zaczyna się od kolostomii');
  const me=v.cutTools.find(d=>d.type==='meso'), kr=v.cutTools.find(d=>d.type==='krocze');
  const tie=me.vessels.filter(x=>x.tie!=null).map(x=>x.id).join(','), rem=me.vessels.filter(x=>x.removed&&x.kind==='a').map(x=>x.id).join(',');
  console.log('APR krezka — podwiązania:',tie,'| usuwane:',rem,'| mezorektum:',me.labels[0].sub);
  ok(tie==='ima,lc'&&/ima/.test(rem)&&/sra/.test(rem),'APR: IMA u odejścia i SRA z preparatem'); ok(me.labels[0].removed&&/kanałem odbytu/.test(me.labels[0].sub),'APR: mezorektum nie w całości');
  ok(me.sheets.filter(s=>s.rows[0][2]>0.9).every(s=>s.removed),'APR: krezka odbytnicy pozostaje');
  ok(kr&&kr.close[0]>=3&&kr.close[1]<=4,'APR: brak zamknięcia krocza w kadrze rekonstrukcji');
  ok((A.BIB.P.apr||[]).length>=5,'APR: za mało piśmiennictwa');
  // --- APR: interfejs i animacja krocza
  await search(w,'amputacja brzuszno'); const $=id=>w.document.getElementById(id);
  ok(/Amputacja brzuszno-kroczowa/.test($('pTitle').textContent),'wyszukiwarka nie otwiera APR: '+$('pTitle').textContent);
  const ks=w.__sgTest.frames().map(f=>f.k).join(','); ok(ks==='normal,resect,cut,remove,var,endo,ct','APR: kadry '+ks);
  const tool=()=>w.__sgTest.model().tools.find(t=>t.d.type==='krocze'), lab=m=>{ w.__sgTest.at(m); return tool().labels.map(L=>L.alpha?1:0).join(''); };
  const seq=[0.6,2.6,3.25,4].map(lab).join(' '); console.log('krocze — etykiety (cięcie, rana, zamknięcie) przy m 0,6 / 2,6 / 3,25 / 4:',seq);
  ok(seq==='100 010 001 001','APR: kolejność cięcie → rana → zamknięcie: '+seq);
  w.__sgTest.at(3.25); const half=tool().grp.children[0].children.filter(c=>c.geometry&&c.geometry.type==='TorusGeometry'&&c.visible).length;
  w.__sgTest.at(4); const all=tool().grp.children[0].children.filter(c=>c.geometry&&c.geometry.type==='TorusGeometry'&&c.visible).length;
  console.log('szwy węzełkowe skóry: w połowie',half,'| na końcu',all); ok(half>0&&half<all&&all===kr.stitches,'APR: szwy krocza nie zakładane po kolei');
  // --- przycisk „Przejdź do resekcji”: każdy odcinek
  const C=L.C_COL, R=L.COL_R, onWall=t=>{ const p=C.getPointAt(t), tg=C.getTangentAt(t), n=new T.Vector3(0,0,1); n.addScaledVector(tg,-n.dot(tg)).normalize(); return p.addScaledVector(n,R(t)).toArray().map(x=>+x.toFixed(3)); }; // przednia ściana, prostopadle do osi
  // [t guza, wariant, napis, minimalny margines proksymalny, dystalny] (0,045 t ≈ 5 cm); null — bez sprawdzania
  const CASES=[[0.10,'rh-iso','Hemikolektomia prawa',null,null],[0.30,'rh-ext','Poszerzona',null,0.05],[0.38,'rh-ext','Poszerzona',null,0.05],[0.42,'sf','zagięcia śledzionowego',0.05,0.05],[0.50,'sf','zagięcia śledzionowego',0.05,0.05],
    [0.60,'lh','Hemikolektomia lewa',0.05,0.05],[0.72,'sig','Resekcja esicy',0.04,0.05],[0.86,'sig','Resekcja esicy',0.05,0.04],[0.88,'ar-side','Przednia ściana',0.05,0.04],[0.93,'ar-center','Linia przez środek',0.05,0.017],
    [0.955,'ar-ular','Ultraniska',0.05,0.009],[0.97,'ar-ular','Ultraniska',0.05,0.009],[0.99,'apr','Amputacja',0.05,null]];
  const tOn=(C,p)=>A.nearestT(C,new T.Vector3(...p),1500);
  for (const [t,vid,txt,mP,mD] of CASES) {
    w=boot(onWall(t)); await sleep(300); await search(w,'wybór zakresu'); const $=id=>w.document.getElementById(id);
    const g0=w.__sgTest.tumour(), shown=!$('ctxZakres').hidden&&!$('ctxRow').hidden, lbl=$('zkGo').textContent;
    $('zkGo').click(); await sleep(400);
    const S=w.__sgTest.state(), f0=S.frame, vv=w.ANAT.PROCS[S.an].variants[S.vi], g1=w.__sgTest.tumour(), an=w.__sgTest.model().an;
    const spec=an.objects.filter(o=>/^spec/.test(o.id)&&o.id!=='specTi').map(o=>[tOn(C,o.pre.path[0]),tOn(C,o.pre.path[o.pre.path.length-1])]).sort((a,b)=>a[0]-b[0]), tg=tOn(C,onWall(t));
    const s0=spec.length?spec[0][0]:0, s1=spec.length?spec[spec.length-1][1]:1;
    const fr=w.__sgTest.frames(); w.__sgTest.open(S.an,S.vi,fr.length-2); w.__sgTest.at(fr[fr.length-2].m0); const gEnd=w.__sgTest.tumour();
    console.log('t',t,'→',vv.id+(an.adapted!=null?' (linie za guzem)':''),'|',lbl,'| preparat',s0.toFixed(3)+'–'+s1.toFixed(3),'| marginesy',(tg-s0).toFixed(3),(s1-tg).toFixed(3),'| guz przesunięty o',g0&&g1?dist(g0,g1).toFixed(2):'?','| po operacji:',gEnd?'zostaje':'usunięty');
    if (mP!=null) ok(tg-s0>=mP,'t '+t+': margines proksymalny '+(tg-s0).toFixed(3)); if (mD!=null) ok(s1-tg>=mD,'t '+t+': margines dystalny '+(s1-tg).toFixed(3));
    ok(shown,'t '+t+': brak przycisku'); ok(lbl.indexOf(txt)>=0,'t '+t+': zły napis '+lbl); ok(vv.id===vid,'t '+t+': otwiera '+vv.id+' zamiast '+vid);
    ok(f0===0,'t '+t+': nie pierwszy kadr'); ok(g0&&g1&&dist(g0,g1)<0.6,'t '+t+': guz nie odziedziczony'); ok(!gEnd,'t '+t+': guz zostaje w pacjencie');
    ok($('ctxZakres').hidden,'t '+t+': przycisk widoczny poza slajdem zakresu');
  }
  // przebudowa po zmianie położenia guza (tu: wyłączenie i włączenie przełącznika z nowym położeniem) — linia przecięcia odbytnicy schodzi niżej
  w=boot(onWall(0.90)); await sleep(300); await search(w,'resekcja odbytnicy'); { const $=id=>w.document.getElementById(id), cut=()=>{ const r=w.__sgTest.model().an.marks.find(m=>m.name==='Przecięcie odbytnicy'); return r.pos[1]; };
    const y0=cut(), a0=w.__sgTest.model().an.adapted; w.localStorage.setItem('surgitome-guz-pos',JSON.stringify(onWall(0.95))); $('optGuz').click(); await sleep(50); const y1=cut(); $('optGuz').click(); await sleep(50); const y2=cut(), a2=w.__sgTest.model().an.adapted;
    console.log('przecięcie odbytnicy (y): guz w t 0,90 →',y0.toFixed(2),'| guz wyłączony →',y1.toFixed(2),'| guz w t 0,95 →',y2.toFixed(2));
    ok(a0==null&&y1===y0&&a2!=null&&y2<y0-0.3,'przebudowa po zmianie położenia guza'); ok(w.__sgTest.state().frame===0,'przebudowa zmieniła kadr'); }
  // bez guza — bez przycisku; EN
  w=boot(null); await sleep(300); await search(w,'wybór zakresu'); w.document.getElementById('optGuz').click(); await sleep(100);
  ok(w.document.getElementById('ctxZakres').hidden,'przycisk bez guza');
  w=boot(onWall(0.99),'en'); await sleep(300); await search(w,'choosing the extent'); const en=w.document.getElementById('zkGo').textContent; console.log('EN:',en);
  ok(/^Go to the resection: Abdominoperineal resection \(APR\)/.test(en),'EN: '+en);
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
