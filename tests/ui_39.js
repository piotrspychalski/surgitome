// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Język startowy: zapisany wybór ma pierwszeństwo; bez niego język przeglądarki — polski → PL, każdy inny → EN
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
  const CASES=[[['pl-PL','en'],null,'pl'],[['pl'],null,'pl'],[['en-US'],null,'en'],[['de-DE','pl'],null,'en'],[['uk-UA'],null,'en'],[['en-GB'],'pl','pl'],[['pl-PL'],'en','en']];
  for(const [langs,stored,want] of CASES){
    const w=boot(langs,stored); await sleep(250); const D=w.document;
    const got=D.documentElement.lang, btn=D.getElementById('btnNext').textContent;
    ok(got===want,'przeglądarka '+langs.join(',')+' / zapis '+stored+': język '+got+' (chciano '+want+')');
    ok(want==='pl'?btn==='Dalej':btn==='Next','przycisk Dalej w '+want+': '+btn);
    console.log(langs.join(','),'| zapis:',stored,'→',got,'|',btn);
  }
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
