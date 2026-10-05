// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Statystyki zabiegów: zmiana zakładki/wariantu → po 2 s jedno zdarzenie GoatCounter zabieg/<id>[/<wariant>]; szybkie przewijanie nie liczy; bez GoatCounter brak błędów
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
const orbit=fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8');
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); const errs=[], fails=[], sleep=ms=>new Promise(r=>setTimeout(r,ms));
function ok(c,m){ if(!c) fails.push(m); }
function boot(langs, stored){ const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); const w=dom.window;
  Object.defineProperty(w.navigator,'languages',{value:langs}); Object.defineProperty(w.navigator,'language',{value:langs[0]});
  w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1'); if(stored) w.localStorage.setItem('surgitome-lang',stored);
  w.matchMedia=()=>({matches:false,addEventListener(){}});
  w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
  w.THREE=T; w.eval(orbit); w.addEventListener('error',e=>errs.push(e.message||String(e.error))); w.eval(sc[0]); w.eval(sc[1]); return w; }
(async()=>{
  // 1) bez GoatCounter (lokalnie / inne hosty) — przełączanie nie może rzucać błędów
  let w=boot(['pl-PL'],null); await sleep(250); let D=w.document;
  D.querySelectorAll('#tabs .tab')[1].click(); await sleep(2300);
  ok(errs.length===0,'bez GoatCounter: błędy');
  // 2) z GoatCounter
  w=boot(['pl-PL'],null); const ev=[]; w.goatcounter={count(o){ev.push(o);}}; await sleep(250); D=w.document;
  ok(ev.length===0,'start nie liczy zabiegu');
  const tabs=()=>D.querySelectorAll('#tabs .tab');
  tabs()[1].click(); await sleep(300); tabs()[2].click(); await sleep(300); tabs()[3].click(); await sleep(2300);
  ok(ev.length===1,'szybkie przewijanie: zdarzeń '+ev.length+' (chciano 1)');
  ok(ev[0]&&ev[0].event===true&&/^zabieg\/[a-z0-9-]+(\/[^/]+)?$/.test(ev[0].path)&&ev[0].title,'format zdarzenia '+JSON.stringify(ev[0]));
  console.log('zakładka →',JSON.stringify(ev[0]));
  // wariant: znajdź zabieg z wariantami w dowolnej kategorii
  const cats=D.querySelectorAll('#cats .cat'); let done=false;
  for(let c=0;c<cats.length&&!done;c++){ D.querySelectorAll('#cats .cat')[c].click(); await sleep(50);
    for(let t=0;t<tabs().length&&!done;t++){ tabs()[t].click(); await sleep(50); const vb=D.querySelectorAll('#variants .vbtn'); if(vb.length>1){ await sleep(2300); const n=ev.length; vb[1].click(); await sleep(2300);
      ok(ev.length===n+1,'wariant: zdarzeń '+(ev.length-n)); const e=ev[ev.length-1]; ok(e.path.split('/').length===3,'wariant w ścieżce '+e.path); console.log('wariant →',JSON.stringify(e)); done=true; } } }
  ok(done,'nie znaleziono zabiegu z wariantami');
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
