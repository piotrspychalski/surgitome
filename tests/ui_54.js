// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Pasek zabiegów w jednym wierszu: podgrupy (ANAT.SUBS — jelito grube: Kolektomie, Odbytnica, Stomie, Wyrostek), każdy zabieg kategorii w dokładnie jednej
// grupie, kliknięcie grupy przechodzi do jej pierwszego zabiegu, w innych kategoriach brak podgrup; karty bez zawijania; „Wszystkie” otwiera i zamyka
// pełną listę (Esc, wybór zabiegu); klawisze 1–9 wybierają zabieg z bieżącej grupy. Regresja: przejście z animowanego slajdu „Dostęp” do zabiegu
// z kadrem bez czasu trwania (cholecystektomia) nie psuje osi czasu (NaN). EN — nazwy grup przetłumaczone.
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
(async()=>{
  let w=boot(); await sleep(300); const D=w.document, A=w.ANAT, S=w.__sgTest.state(), $=id=>D.getElementById(id);
  const cat=re=>{ [...D.querySelectorAll('#cats .cat')].find(b=>re.test(b.textContent)).click(); };
  const tabs=()=>[...D.querySelectorAll('#tabs .tab')], subs=()=>[...D.querySelectorAll('#subs .sub')], cur=()=>A.PROCS[S.an].id;
  // podgrupy jelita grubego
  cat(/Jelito grube/); await sleep(500);
  ok(!$('subs').hidden && subs().map(b=>b.textContent).join(',')==='Kolektomie,Odbytnica,Stomie,Wyrostek','podgrupy jelita grubego: '+subs().map(b=>b.textContent));
  const colon=A.PROCS.filter(p=>p.cat==='colon').map(p=>p.id), seen={};
  for(let k=0;k<subs().length;k++){ subs()[k].click(); await sleep(450);
    ok(subs()[k].getAttribute('aria-pressed')==='true','grupa '+k+' niezaznaczona po kliknięciu');
    const names=tabs().map(b=>b.textContent.replace(/[☆★]/g,'').trim()), ids=names.map(n=>A.PROCS.find(p=>p.cat==='colon'&&p.short===n).id);
    ok(ids[0]===cur(),'grupa '+k+': nie przechodzi do pierwszego zabiegu ('+cur()+')');
    ok(tabs().some(b=>b.getAttribute('aria-selected')==='true'),'grupa '+k+': brak zaznaczonej karty');
    ids.forEach(id=>{ ok(!seen[id],'zabieg w dwóch grupach: '+id); seen[id]=1; });
  }
  ok(colon.every(id=>seen[id]),'zabiegi jelita grubego poza grupami: '+colon.filter(id=>!seen[id]));
  // klawisz 2 — drugi zabieg bieżącej grupy (poza oknem dostępu)
  subs()[1].click(); await sleep(450); if(!$('acc').hidden) $('acc').querySelector('.accopt').click(); await sleep(100);
  const second=tabs()[1].textContent.replace(/[☆★]/g,'').trim(); D.body.dispatchEvent(new w.KeyboardEvent('keydown',{key:'2',bubbles:true})); await sleep(450);
  ok(A.PROCS[S.an].short===second,'klawisz 2 nie wybiera drugiego zabiegu grupy: '+A.PROCS[S.an].short);
  // inne kategorie bez podgrup
  cat(/Trzustka/); await sleep(450); ok($('subs').hidden,'podgrupy w kategorii bez ANAT.SUBS');
  // karty w jednym wierszu, panel „Wszystkie”
  ok(w.getComputedStyle($('tabs')).flexWrap==='nowrap','karty zabiegów zawijają się');
  const sb=D.querySelector('.subbar'); $('tabsAll').click(); await sleep(50);
  ok(sb.classList.contains('tabsopen') && $('tabsAll').getAttribute('aria-expanded')==='true','„Wszystkie” nie otwiera listy');
  D.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true})); await sleep(50); ok(!sb.classList.contains('tabsopen'),'Esc nie zamyka listy');
  $('tabsAll').click(); await sleep(50); tabs()[2].click(); await sleep(450); ok(!sb.classList.contains('tabsopen'),'wybór zabiegu nie zamyka listy');
  // regresja: animowany slajd „Dostęp” → zabieg z kadrem bez czasu trwania
  cat(/Jelito grube/); await sleep(450); subs()[2].click(); await sleep(450);
  ok(!$('acc').hidden,'brak okna dostępu w zabiegu jelitowym'); $('acc').querySelectorAll('.accopt')[1].click(); await sleep(250);
  const e0=errs.length; cat(/Trzustka/); await sleep(900);
  ok(cur()==='chole' && Number.isFinite(S.m),'oś czasu po przejściu z dostępu: '+cur()+' m='+S.m); ok(errs.length===e0,'błąd po przejściu z dostępu: '+errs.slice(e0));
  // EN
  w=boot('en'); await sleep(300); const D2=w.document; [...D2.querySelectorAll('#cats .cat')].find(b=>/Large|Colon/.test(b.textContent)).click(); await sleep(450);
  const en=[...D2.querySelectorAll('#subs .sub')].map(b=>b.textContent).join(','); ok(en==='Colectomies,Rectum,Stomas,Appendix','EN grupy: '+en);
  ok(/All/.test(D2.getElementById('tabsAll').textContent),'EN „Wszystkie”: '+D2.getElementById('tabsAll').textContent);
  console.log('podgrupy:',Object.keys(seen).length,'zabiegów');
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
