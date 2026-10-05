// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Badania ECOPOP (ETHOS, SCAR): ukryte w nawigacji, wyszukiwarka, widok podzielony, synchronizacja kamer, ulubione, „Dalej”, EN
// node tests/ui_32.js [mobile] [preview]
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const MOB=process.argv.includes('mobile'), PREVIEW=process.argv.includes('preview');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1'); if(PREVIEW) w.__SG_PREVIEW=true;
w.matchMedia=(q)=>({matches:MOB&&/max-width: 760px/.test(q),addEventListener(){}});
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
const T=Object.assign({},require('three')); const renders=[];
T.WebGLRenderer=function(){let vp=null; return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(x,y,ww,hh){vp=[x,y,ww,hh];},setClearColor(){},clear(){},render(sc,cam){renders.push({vp:vp&&vp.join(','),cam:cam.uuid});},setScissor(){},getPixelRatio:()=>1}};
w.THREE=T; w.eval(fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8'));
Object.defineProperty(w.HTMLElement.prototype,'getBoundingClientRect',{value:function(){ return this.id==='viewport'?{left:0,top:0,width:MOB?390:1200,height:MOB?600:700,right:MOB?390:1200,bottom:MOB?600:700}:{left:0,top:0,width:0,height:0,right:0,bottom:0}; }});
const errs=[]; w.addEventListener('error',e=>errs.push(e.message||String(e.error))); w.console.error=(...a)=>errs.push(a.join(' ').slice(0,160));
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); w.eval(sc[0]); w.eval(sc[1]);
const $=id=>w.document.getElementById(id), sleep=ms=>new Promise(r=>setTimeout(r,ms)), fails=[];
function ok(cond,msg){ if(!cond) fails.push(msg); return cond; }
const PL=/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]|\b(i|oraz|pętla|jelito|zespolenie|kikut|odbytnica|okrężnica|ramię|krezka|nadzór|kadr|z|w|na|do|po)\b/;
function search(q){ const inp=MOB?$('mq'):$('q'); if(MOB) $('mMenuBtn').click(); inp.value=q; inp.dispatchEvent(new w.Event('input')); return [...(MOB?$('mqres'):$('qres')).querySelectorAll('.qitem')].map(b=>b.textContent); }
function pick(q){ const inp=MOB?$('mq'):$('q'); search(q); inp.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter'})); }
(async()=>{ await sleep(300);
  const cats=[...$('cats').children].map(b=>b.textContent);
  ok(!cats.some(c=>/Badania|Trials/.test(c)),'kategoria Badania widoczna w pasku');
  console.log('kategorie:',cats.join(' | '));
  const hitEthos=search('ethos'), hitEftr=search('eftr'), hitRak=search('rak');
  console.log('szukaj „ethos”:',hitEthos.join(' ; '),'| „eftr”:',hitEftr.join(' ; '),'| „rak”:',hitRak.filter(x=>/ETHOS|SCAR/.test(x)).length,'badań');
  ok(hitEthos.some(x=>/ETHOS/.test(x)),'wyszukiwarka nie znajduje ETHOS'); ok(hitEftr.some(x=>/ETHOS/.test(x))&&hitEftr.some(x=>/SCAR/.test(x)),'„eftr” nie znajduje ETHOS i SCAR');
  ok(!hitRak.some(x=>/ETHOS|SCAR/.test(x)),'badania widoczne w wynikach „rak”');
  if(MOB) $('mMenuClose').click();
  const trials=['ethos','scar'];
  for(const q of trials){
    pick(q); await sleep(700);
    const S=w.__sgTest.state(), SP=w.__sgTest.split();
    ok(SP.on,q+': widok podzielony nie włączony');
    const v=SP.views; console.log(q,'| widoki:',JSON.stringify(v),'| ramiona:',[...$('variants').querySelectorAll('.armtag')].map(x=>x.textContent).join(' vs '));
    ok(v[0]&&v[1]&&(MOB?v[1].y>0&&v[0].w===v[1].w:v[1].x>0&&v[0].h===v[1].h),q+': zły układ połówek');
    renders.length=0; await sleep(120);
    const vps=new Set(renders.map(r=>r.vp)), cams=new Set(renders.map(r=>r.cam));
    ok(vps.size>=2&&cams.size>=2,q+': render nie w dwóch widokach/kamerach ('+vps.size+'/'+cams.size+')');
    ok(!$('splitHdr').hidden&&/A:/.test(document_q('.sh0 b'))&&/B:/.test(document_q('.sh1 b')),q+': brak nagłówków ramion');
    // synchronizacja kamer
    const cA=w.__sgTest.cam, cB=w.__sgTest.camB;
    cA.position.x+=3; await sleep(80); ok(cB.position.distanceTo(cA.position)<1e-6,q+': kamera B nie podąża za A');
    $('splitSync').click(); const bx=cB.position.clone(); cA.position.x+=3; await sleep(80);
    ok(cB.position.distanceTo(bx)<1e-6,q+': po rozłączeniu kamera B nadal podąża'); $('splitSync').click(); await sleep(80);
    ok(cB.position.distanceTo(cA.position)<1e-6,q+': po połączeniu kamera B nie wraca do A');
    // przebieg kadrów „Dalej”
    const steps=[...$('strip').querySelectorAll('.step')].map(b=>b.textContent); let n=0, seen=[];
    while(n<12){ seen.push(w.__sgTest.state().frame+':'+w.__sgTest.state().m.toFixed(2)+':'+$('capTitle').textContent.slice(0,22)); if(w.__sgTest.state().frame===steps.length-1 && w.__sgTest.state().m>=1) break; $('btnNext').click(); await sleep(420); n++; }
    console.log(q,'| kadry:',steps.join(' / '),'| przebieg:',seen.join(' → '));
    ok(w.__sgTest.state().frame===steps.length-1,q+': „Dalej” nie dochodzi do ostatniego kadru');
    ok(SP.MA.tools.every(t=>typeof t.update==='function')&&SP.MB.tools.length>0,q+': brak narzędzi ramion');
    ok(!/[.]{3}|undefined/.test(document_q('.sh0 span')+document_q('.sh1 span')),q+': pusty podpis ramienia');
    console.log(q,'| A:',document_q('.sh0 span').slice(0,90),'| B:',document_q('.sh1 span').slice(0,90));
  }
  // gwiazdka: badanie trafia do Ulubionych (zapis w localStorage), kategoria Badania nadal niewidoczna
  pick('ethos'); await sleep(600);
  w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'f',bubbles:true})); await sleep(50);
  const fav=JSON.parse(w.localStorage.getItem('surgitome-fav')||'[]'); console.log('ulubione:',fav.join(','));
  ok(fav.includes('ethos'),'ETHOS nie trafił do ulubionych');
  $('cats').children[0].click(); await sleep(300);
  ok([...$('tabs').querySelectorAll('.tab')].some(t=>/ETHOS/.test(t.textContent)),'ETHOS nie widać w zakładce Ulubione');
  // wyjście z badania do zwykłego zabiegu: widok pojedynczy
  pick('hartmann'); await sleep(700); ok(!w.__sgTest.split().on,'po wyjściu z badania widok nadal podzielony'); ok($('splitHdr').hidden,'nagłówki ramion po wyjściu');
  // EN: brak polskich tekstów w badaniach
  $('btnLang').click(); await sleep(60); const bad=new Set();
  for(const q of trials){ pick(q); await sleep(600);
    for(let f=0;f<3;f++){ $('strip').querySelectorAll('.step')[f].click(); await sleep(260); if(f===1){ $('btnNext').click(); await sleep(80); }
      $('fInfo').click(); await sleep(30);
      for(const s of ['#capTitle','#capText','#labels','#tabs','#variants','#strip','#splitHdr','#pTitle','#pSub','#pNotes','#mFrameTxt','#mProcName']){ const el=w.document.querySelector(s); if(!el) continue; const tw=w.document.createTreeWalker(el,4); let t; while((t=tw.nextNode())){ const x=t.textContent.trim(), xn=x.replace(/Gdańsk|Jarosław|Nastazja/g,""); if(x&&PL.test(xn)) bad.add(q+': '+x.slice(0,80)); } }
      $('fInfo').click(); } }
  console.log('Polskie teksty w EN:',bad.size,[...bad].slice(0,12));
  ok(!bad.size,'polskie teksty w wersji EN');
  console.log('errors',JSON.stringify(errs.concat(fails)));
  process.exit(0);
})();
function document_q(s){ const el=w.document.querySelector(s); return el?el.textContent:''; }
