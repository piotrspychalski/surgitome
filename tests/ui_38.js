// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Resekcje wątroby (bisegmentektomia II/III, prawa i lewa hemihepatektomia, ALPPS) i slajd „Guz w wątrobie”: kadry, kikuty, preparat, reguły zakresu, EN
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
const orbit=fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8');
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); const errs=[], fails=[], sleep=ms=>new Promise(r=>setTimeout(r,ms));
function ok(c,m){ if(!c) fails.push(m); }
const mobile=process.argv[2]==='mobile';
function boot(){ const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
  w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1');
  w.matchMedia=q=>({matches:mobile&&/max-width/.test(q),addEventListener(){}});
  w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
  w.THREE=T; w.eval(orbit); w.addEventListener('error',e=>errs.push(e.message||String(e.error))); w.eval(sc[0]); w.eval(sc[1]); return w; }
(async()=>{
  const w=boot(); await sleep(300); const $=id=>w.document.getElementById(id), D=w.document;
  [...D.querySelectorAll('#cats .cat')].find(b=>/Wątroba/.test(b.textContent)).click(); await sleep(500);
  if(!w.__sgTest.state().labels) $('btnLabels').click(); // na telefonie etykiety są domyślnie wyłączone
  const tabs=[...D.querySelectorAll('#tabs .tab')].map(b=>b.textContent.replace(/[☆★]/g,'').trim());
  ok(tabs.join('|')==='Anatomia wątroby|Guz: zakres resekcji|Bisegmentektomia II/III|Prawa hemihepatektomia|Lewa hemihepatektomia|ALPPS|Przeszczepienie wątroby','zakładki: '+tabs.join('|'));
  const lbl=()=>[...D.querySelectorAll('#labels .lbl')].filter(e=>e.style.display!=='none'&&+(e.style.opacity||1)>0.3).map(e=>e.querySelector('b').textContent);
  const WANT={'Bisegmentektomia II/III':['Szypuła segmentu II (podwiązana)','Szypuła segmentu III (podwiązana)','Żyła wątrobowa lewa (stapler)','Pozostała wątroba: I, IV–VIII'],
    'Prawa hemihepatektomia':['Tętnica wątrobowa prawa (podwiązana)','Prawa gałąź żyły wrotnej (podwiązana)','Przewód wątrobowy prawy (przecięty)','Żyła wątrobowa prawa (stapler)','Pozostała wątroba: I–IV'],
    'Lewa hemihepatektomia':['Tętnica wątrobowa lewa (podwiązana)','Lewa gałąź żyły wrotnej (podwiązana)','Przewód wątrobowy lewy (przecięty)','Żyła wątrobowa lewa (stapler)','Pozostała wątroba: I, V–VIII'],
    'ALPPS':['Prawa gałąź żyły wrotnej (podwiązana — etap I)','Żyła wątrobowa pośrodkowa (stapler)','Żyła wątrobowa prawa (stapler)','Szypuły segmentu IV','Przyszła pozostała wątroba (FLR): II, III (+ I)']};
  for(const name of Object.keys(WANT)){
    [...D.querySelectorAll('#tabs .tab')].find(b=>b.textContent.includes(name)).click(); await sleep(800);
    const st=[...D.querySelectorAll('.srow1 .step')]; ok(st.length===5,name+': kadrów '+st.length);
    st[0].click(); await sleep(300); let L=lbl(); ok(L.some(x=>/^Preparat/.test(x)||/FLR/.test(x)),name+': brak etykiety preparatu w planie: '+L.join('|'));
    st[4].click(); await sleep(400); w.__sgTest.state(); L=lbl();
    WANT[name].forEach(x=>ok(L.includes(x),name+': brak „'+x+'” w stanie po'));
    ok(!L.some(x=>/^Preparat/.test(x)),name+': preparat widoczny po resekcji');
    console.log(name,'| etykiety po:',L.length);
  }
  // guz: wariant „Metastazektomia” — kadr 1 położenie, kadr 2 wycięcie z marginesem (preparat odjeżdża, zostaje loża)
  const tumTab=()=>[...D.querySelectorAll('#tabs .tab')].find(b=>b.textContent.includes('Guz:')).click();
  tumTab(); await sleep(800);
  const vb=[...D.querySelectorAll('#variants .vbtn')].map(b=>b.textContent); ok(vb.join('|')==='Metastazektomia|Resekcja anatomiczna','warianty guza: '+vb.join('|'));
  ok($('capTitle').textContent==='Położenie przerzutu','kadr 1 metastazektomii: '+$('capTitle').textContent);
  w.__sgTest.lvTumor([-4.6,2.4,2.0]); await sleep(30); ok(/Guz w segmencie: VIII/.test($('capText').textContent),'segment przerzutu: '+$('capText').textContent);
  D.querySelectorAll('.srow1 .step')[1].click(); await sleep(4600);
  ok($('capTitle').textContent==='Metastazektomia','kadr 2 metastazektomii: '+$('capTitle').textContent);
  let L=lbl(); ok(L.includes('Loża po metastazektomii'),'brak loży po metastazektomii: '+L.join('|'));
  // wariant „Resekcja anatomiczna”: reguły zakresu, kadr 2 z podwiązaniem szypuł
  D.querySelectorAll('#variants .vbtn')[1].click(); await sleep(800); D.querySelectorAll('.srow1 .step')[0].click(); await sleep(300);
  const CASES=[[[5.5,1.2,0.6],'Bisegmentektomia II/III',['Szypuła segmentu II (podwiązana)','Szypuła segmentu III (podwiązana)','Żyła wątrobowa lewa (stapler)']],
    [[-4.6,2.4,2.0],'Segmentektomia VIII',['Szypuła segmentu VIII (podwiązana)']],[[-7.2,-2,-1.5],'Bisegmentektomia V/VI',['Szypuła segmentu V (podwiązana)','Szypuła segmentu VI (podwiązana)']]];
  for(const [p,want,ligs] of CASES){
    D.querySelectorAll('.srow1 .step')[0].click(); await sleep(300);
    w.__sgTest.lvTumor(p); await sleep(30); ok($('capTitle').textContent===want,'guz '+p+': '+$('capTitle').textContent+' (chciano '+want+')');
    ok(/Pozostaje ok\. \d+% miąższu/.test($('capText').textContent),'brak odsetka: '+$('capText').textContent);
    D.querySelectorAll('.srow1 .step')[1].click(); await sleep(6600); L=lbl();
    ligs.forEach(x=>ok(L.includes(x),want+': brak „'+x+'”: '+L.join('|')));
    ok(L.includes('Pozostała wątroba')&&!L.includes('Preparat'),want+': koniec resekcji: '+L.join('|'));
  }
  // EN
  $('btnLang').click(); await sleep(100);
  const txt=[$('capTitle').textContent,$('capText').textContent,$('pTitle').textContent,$('pSub').textContent,...[...D.querySelectorAll('#pNotes li,#labels .lbl,.srow1 .step,#tabs .tab')].filter(e=>e.style.display!=='none').map(e=>e.textContent)].join(' | ');
  const pl=txt.match(/[^|]*[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ][^|]*/g); ok(!pl,'polskie teksty w EN: '+(pl||[]).slice(0,4).join(' / '));
  ok(/Bisegmentectomy V\/VI/.test($('capTitle').textContent),'EN tytuł reguły: '+$('capTitle').textContent); ok(/Segment V pedicle \(ligated\)/.test(lbl().join('|')),'EN etykiety szypuł: '+lbl().join('|'));
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
