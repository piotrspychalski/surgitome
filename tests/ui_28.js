// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync(require('path').join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  dom.window.localStorage.setItem('surgitome-intro','1'); dom.window.localStorage.setItem('surgitome-tour','1'); /* informacja startowa już potwierdzona */ if(process.argv[2]==='stored') dom.window.localStorage.setItem('surgitome-fav',JSON.stringify(['ladd','ipaa','sb'])); const w=dom.window;
w.matchMedia=()=>({matches:false,addEventListener(){}});
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
w.THREE=T; w.eval(fs.readFileSync(require('path').join(require('path').dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8'));
const errs=[]; w.addEventListener('error',e=>errs.push(e.message||String(e.error)));
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); w.eval(sc[0]); w.eval(sc[1]);
const $=id=>w.document.getElementById(id); const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const tabs=()=>[...$('tabs').querySelectorAll('.tab')].map(b=>b.firstChild.textContent+(b.querySelector('.star.on')?'★':'☆')+(b.getAttribute('aria-selected')==='true'?'*':''));
(async()=>{ await sleep(400);
  console.log('kategorie:',[...$('cats').children].map(b=>b.textContent+(b.getAttribute('aria-pressed')==='true'?'*':'')).join(' | '));
  console.log('start, zakładki:',tabs().join(' , '),'| tytuł:',$('pTitle').textContent);
  // gwiazdka w innej kategorii
  [...$('cats').children].find(b=>b.textContent==='Jelito cienkie').click(); await sleep(500);
  const sp=[...$('tabs').querySelectorAll('.tab')].find(b=>b.textContent.startsWith('Resekcja jelita'));
  sp.querySelector('.star').click(); await sleep(100);
  console.log('jelito cienkie po gwiazdce:',tabs().join(' , '),'| zapis:',w.localStorage.getItem('surgitome-fav'));
  [...$('cats').children].find(b=>b.textContent.includes('Ulubione')).click(); await sleep(500);
  console.log('ulubione:',tabs().join(' , '));
  // przejście „dalej” przez wszystkie kadry do następnego ulubionego
  const t0=$('pTitle').textContent; let guard=0;
  while($('pTitle').textContent===t0 && guard++<40){ w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true})); await sleep(420); }
  console.log('po przejściu kadrów:',$('pTitle').textContent,'| kategoria:',[...$('cats').children].find(b=>b.getAttribute('aria-pressed')==='true').textContent,'| naciśnięć:',guard);
  // klawisz F
  w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'f',bubbles:true})); await sleep(100);
  console.log('F (usuń bieżący):',w.localStorage.getItem('surgitome-fav'));
  errs.length ? console.log('errors',errs) : console.log('errors []'); process.exit(0);
})();
