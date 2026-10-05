// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Informacja przy pierwszym wejściu: widoczna raz na urządzenie (localStorage), blokuje klawisze, PL/EN, link pod nazwiskiem
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
const orbit=fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8');
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const errs=[], sleep=ms=>new Promise(r=>setTimeout(r,ms));
function boot(seen){
  const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
  if(seen) w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1');
  w.matchMedia=()=>({matches:false,addEventListener(){}});
  w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
  w.THREE=T; w.eval(orbit); w.addEventListener('error',e=>errs.push(e.message||String(e.error)));
  w.eval(sc[0]); w.eval(sc[1]); return w;
}
(async()=>{
  let w=boot(false); const $=id=>w.document.getElementById(id); await sleep(300);
  const shown=el=>w.getComputedStyle(el).display!=='none';
  console.log('pierwsze wejście, okno widoczne:',shown($('intro')),'| tytuł:',$('introTitle').textContent);
  const cap0=$('capTitle').textContent;
  w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true})); await sleep(50);
  console.log('strzałka nie przewija kadru pod oknem:',$('capTitle').textContent===cap0,'| okno nadal widoczne:',!$('intro').hidden);
  $('introLang').click(); console.log('EN:',$('introTitle').textContent,'|',$('introOk').textContent,'| przycisk języka:',$('introLang').textContent);
  $('introLang').click(); console.log('PL:',$('introTitle').textContent);
  $('introOk').click(); const vis1=shown($('intro')); console.log('po „Rozumiem”: widoczne:',vis1,'| zapis:',w.localStorage.getItem('surgitome-intro'));
  w=boot(true); await sleep(300);
  console.log('kolejne wejście, okno ukryte:',w.document.getElementById('intro').hidden);
  const bd=boot(false); await sleep(300); bd.document.querySelector('.introbox').click(); const inBox=bd.getComputedStyle(bd.document.getElementById('intro')).display;
  bd.document.getElementById('intro').click(); const outBox=bd.getComputedStyle(bd.document.getElementById('intro')).display;
  console.log('klik w okno nie zamyka:',inBox!=='none','| klik obok zamyka:',outBox==='none');
  const esc=boot(false); await sleep(300); esc.document.dispatchEvent(new esc.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
  const escGone=esc.getComputedStyle(esc.document.getElementById('intro')).display==='none'; console.log('Esc zamyka i zapisuje:',escGone,esc.localStorage.getItem('surgitome-intro'));
  const links=[...w.document.querySelectorAll('a[href="https://piotrspychalski.github.io/"]')].map(a=>a.closest('#mCred,.bcred,.credit').id||a.closest('#mCred,.bcred,.credit').className);
  console.log('link pod nazwiskiem:',links.length,links.join(', '));
  const ok=!errs.length && links.length===4 && !vis1 && escGone && inBox!=='none' && outBox==='none';
  console.log('errors',JSON.stringify(ok?[]:errs.concat(links.length===4?[]:['linki: '+links.length], vis1?['okno widoczne po Rozumiem']:[], escGone?[]:['Esc nie zamyka'], outBox==='none'?[]:['klik obok nie zamyka'])));
  process.exit(0);
})();
