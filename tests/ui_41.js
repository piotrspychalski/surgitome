// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Jak cytować: link w stopce panelu i w menu na telefonie, okienko z cytowaniem (DOI koncepcyjny z Zenodo), kopiowanie, klawisze, Esc, EN
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1');
w.matchMedia=()=>({matches:false,addEventListener(){}});
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
w.THREE=T; w.eval(fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8'));
let copied=null; Object.defineProperty(w.navigator,'clipboard',{value:{writeText:t=>{copied=t;return Promise.resolve();}}});
const errs=[]; w.addEventListener('error',e=>errs.push(e.message||String(e.error)));
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); w.eval(sc[0]); w.eval(sc[1]);
const $=id=>w.document.getElementById(id), sleep=ms=>new Promise(r=>setTimeout(r,ms)), fails=[];
function ok(c,m){ if(!c) fails.push(m); }
const key=(k,el)=>(el||w.document).dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true}));
(async()=>{ await sleep(300);
  const btns=[...w.document.querySelectorAll('.citeBtn')];
  ok(btns.length===2&&btns.some(b=>b.closest('#panel'))&&btns.some(b=>b.closest('#mMenu')),'brak linku „Jak cytować” w panelu lub w menu na telefonie');
  ok($('cite').hidden,'okienko cytowania otwarte na starcie');
  btns.find(b=>b.closest('#panel')).click(); await sleep(30);
  ok(!$('cite').hidden,'okienko cytowania się nie otwiera');
  const ref=$('citeRef').textContent, a=$('citeRef').querySelector('a'); console.log('cytowanie:',ref,'|',a&&a.href);
  ok(/^Spychalski P\. SURGITOME: interactive 3D atlas of postoperative gastrointestinal anatomy \[software\]\. /.test(ref),'zły początek cytowania');
  ok(/Zenodo; 2026\. doi:10\.5281\/zenodo\.23185125$/.test(ref)&&a&&a.href==='https://doi.org/10.5281/zenodo.23185125','brak DOI koncepcyjnego z Zenodo w cytowaniu');
  ok(/MIT/.test($('cite').textContent)&&/CC BY 4\.0/.test($('cite').textContent),'brak informacji o licencjach');
  // klawisze przy otwartym okienku nie działają jak skróty
  const fav0=w.localStorage.getItem('surgitome-fav'), fr0=w.__sgTest.state().frame;
  key('ArrowRight'); key('f'); key('l'); await sleep(50);
  ok(w.__sgTest.state().frame===fr0&&w.localStorage.getItem('surgitome-fav')===fav0,'klawisze przy okienku cytowania przełączają kadry lub ulubione');
  // kopiowanie
  $('citeCopy').click(); await sleep(30);
  ok(copied===ref,'skopiowany tekst różni się od cytowania'); ok(/Skopiowano/.test($('citeStatus').textContent),'brak potwierdzenia kopiowania');
  key('Escape'); await sleep(20); ok($('cite').hidden,'Esc nie zamyka okienka');
  // zamykanie: przycisk, ✕, tło
  btns[0].click(); await sleep(20); $('citeOk').click(); ok($('cite').hidden,'„Zamknij” nie zamyka okienka');
  btns[0].click(); await sleep(20); $('citeClose').click(); ok($('cite').hidden,'✕ nie zamyka okienka');
  btns[0].click(); await sleep(20); ok($('citeStatus').textContent==='','status kopiowania nie znika po ponownym otwarciu');
  $('cite').dispatchEvent(new w.MouseEvent('click',{bubbles:true})); ok($('cite').hidden,'kliknięcie w tło nie zamyka okienka');
  // menu na telefonie: link zamyka menu i otwiera okienko
  $('mMenuBtn').click(); await sleep(20); ok(!$('mMenu').hidden,'menu się nie otwiera');
  btns.find(b=>b.closest('#mMenu')).click(); await sleep(20);
  ok($('mMenu').hidden&&!$('cite').hidden,'link w menu nie otwiera okienka albo nie zamyka menu'); key('Escape'); await sleep(20);
  // EN
  $('btnLang').click(); await sleep(50); btns[0].click(); await sleep(20); $('citeCopy').click(); await sleep(30);
  console.log('EN:',$('citeTitle').textContent,'|',$('citeCopy').textContent,'|',btns[0].textContent,'|',$('citeStatus').textContent);
  ok($('citeTitle').textContent==='How to cite'&&$('citeCopy').textContent==='Copy'&&$('citeOk').textContent==='Close'&&btns.every(b=>b.textContent==='How to cite')&&$('citeStatus').textContent==='Copied.','okienko cytowania nieprzetłumaczone');
  ok($('citeRef').textContent===ref,'cytowanie zmienia się z językiem');
  console.log('errors',JSON.stringify(errs.concat(fails)));
  process.exit(0);
})();
