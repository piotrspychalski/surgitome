// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Slajd „Dostęp” (hemikolektomia prawa): pierwszy kadr, okno „Dostęp?” (przyciski, klawisze 1/2/3, Esc), zapis wyboru, dostęp wybiera wariant zespolenia
// (otwarty → FEEA, laparoskopia/robot → izoperystaltyczne), trokary po lewej stronie chorego (2 × 12 mm przez lewy mięsień prosty), cięcie poprzeczne po prawej,
// „Zmień dostęp”, powłoki niewidoczne poza slajdem, brak slajdu w innych zabiegach, EN; zabiegi ze stomią: te same powłoki (znacznik 'body'), stomia przez mięsień prosty
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
  let w=boot(); await sleep(300); const $=id=>w.document.getElementById(id), A=w.ANAT, B=A.BODY;
  await search(w,'hemikolektomia prawa');
  const fr=w.__sgTest.frames(); ok(fr[0].k==='access'&&fr[1].k==='normal','pierwszy kadr nie jest slajdem „Dostęp”: '+fr.map(f=>f.k).join(','));
  ok(!$('acc').hidden,'okno „Dostęp?” nie pokazuje się'); ok(!$('ctxAcc').hidden,'brak przycisku „Zmień dostęp”');
  ok(w.__sgTest.state().playing===false,'animacja rusza przed wyborem dostępu');
  // laparoskopia: klawisz 2
  key(w,'2'); await sleep(200); const S=w.__sgTest.state(), V=()=>A.PROCS[S.an].variants[S.vi].id;
  ok($('acc').hidden&&w.localStorage.getItem('surgitome-dostep')==='lap','wybór 2 (laparoskopia) nie działa lub nie zapisany'); ok(V()==='rh-iso','laparoskopia: wariant nie izoperystaltyczny');
  w.__sgTest.at(-0.02); const T0=w.__sgTest.model().access, lap=T0.sets.lap;
  const vis=st=>st.ports.filter(p=>p.g.visible).length;
  console.log('laparoskopia — widoczne trokary:',vis(lap),'| podpis:',$('capTitle').textContent);
  ok(lap.g.visible&&vis(lap)===4&&!T0.sets.rob.g.visible&&!T0.sets.open.g.visible,'laparoskopia: zły zestaw trokarów');
  const tr12=lap.d.ports.filter(p=>p.mm===12); ok(tr12.length===2&&tr12.every(p=>p.at[0]>B.RECT_MED&&p.at[0]<B.rectLat(p.at[1])),'2 × 12 mm nie przez lewy mięsień prosty');
  ok(lap.d.ports.every(p=>p.at[0]>=0),'trokar po prawej stronie chorego'); ok(/laparoskopowy/.test($('capTitle').textContent),'podpis laparoskopii');
  // robot: przez „Zmień dostęp” i przycisk
  $('accChange').click(); await sleep(100); ok(!$('acc').hidden,'„Zmień dostęp” nie otwiera okna');
  w.document.querySelector('#acc .accopt[data-acc="rob"]').click(); await sleep(200); w.__sgTest.at(-0.02);
  const rob=w.__sgTest.model().access.sets.rob; console.log('robot — widoczne porty:',vis(rob),'| wariant:',V());
  ok(vis(rob)===5&&V()==='rh-iso','robot: zły zestaw portów lub wariant'); ok(rob.d.ports.filter(p=>!p.assist).every(p=>p.at[0]>0),'port robota po prawej stronie chorego');
  // otwarty: wariant FEEA, bez ponownego okna
  $('accChange').click(); await sleep(100); key(w,'1'); await sleep(700);
  console.log('otwarty — wariant:',V(),'| kadr:',w.__sgTest.state().frame,'| okno:',$('acc').hidden?'ukryte':'widoczne');
  ok(V()==='rh-anti'&&w.__sgTest.state().frame===0&&$('acc').hidden,'otwarty: brak przejścia na FEEA albo okno pokazane ponownie');
  w.__sgTest.at(-0.02); const op=w.__sgTest.model().access.sets.open; ok(op.g.visible&&op.cuts.length===1&&op.cuts[0].c.pts.filter(p=>p[0]<0).length>=4,'otwarty: brak cięcia po prawej stronie');
  // laparoskopia z wariantu FEEA wraca do izoperystaltycznego
  $('accChange').click(); await sleep(100); key(w,'2'); await sleep(700); ok(V()==='rh-iso','laparoskopia z FEEA: brak powrotu do izoperystaltycznego');
  // Esc: zostaje poprzedni wybór
  $('accChange').click(); await sleep(100); key(w,'Escape'); await sleep(200); ok($('acc').hidden&&w.localStorage.getItem('surgitome-dostep')==='lap','Esc zmienia wybór');
  // poza slajdem: powłoki ukryte, okno i przycisk schowane
  $('strip').querySelectorAll('.step')[1].click(); await sleep(400);
  ok(!w.__sgTest.model().access.grp.visible&&$('acc').hidden&&$('ctxAcc').hidden,'powłoki lub okno widoczne poza slajdem „Dostęp”');
  // inne zabiegi bez slajdu
  await search(w,'hemikolektomia lewa'); ok(w.__sgTest.frames()[0].k==='normal'&&$('acc').hidden,'slajd „Dostęp” w hemikolektomii lewej');
  // zabiegi ze stomią: wspólny model powłok, otwór stomii w obrębie mięśnia prostego (kolostomia — lewy, ileostomia — prawy), bez starego prostokąta
  const marks=A.PROCS.filter(p=>['hartmann','apr','ileo'].includes(p.id)).flatMap(p=>p.variants.map(v=>[v.id,v.marks]));
  marks.forEach(([id,mk])=>{ const b=mk.filter(m=>m.kind==='body'); ok(b.length===1&&!mk.some(m=>m.kind==='wall'),id+': brak powłok (body) albo stary prostokąt');
    (b[0]?b[0].holes:[]).forEach(h=>{ const x=Math.abs(h.c[0]); ok(x>B.RECT_MED+0.3&&x<B.rectLat(h.c[1]),id+': stomia poza mięśniem prostym ('+h.c.map(v=>v.toFixed(1))+')'); });
    const st=mk.filter(m=>m.kind==='stoma'); ok(st.length&&st.every(s=>Math.abs(s.center[2]-B.z(s.center[0],s.center[1]))<0.5),id+': stomia nie na skórze'); });
  console.log('zabiegi ze stomią — powłoki:',marks.length,'| kolostomia x:',marks[0][1].find(m=>m.kind==='body').holes[0].c[0],'| ileostomia x:',marks.find(m=>/^ileo/.test(m[0]))[1].find(m=>m.kind==='body').holes[0].c[0].toFixed(1));
  // EN
  w=boot('en'); await sleep(300); await search(w,'right hemicolectomy'); const t=w.document.getElementById('accTitle').textContent, b=[...w.document.querySelectorAll('#acc .accopt b')].map(x=>x.textContent).join(',');
  console.log('EN:',t,'|',b); ok(t==='Approach?'&&b==='Open,Laparoscopic,Robotic','EN: okno wyboru');
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
