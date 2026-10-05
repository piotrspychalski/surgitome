// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync(require('path').join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const MOB=process.argv[2]==='mobile'; const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  dom.window.localStorage.setItem('surgitome-intro','1'); dom.window.localStorage.setItem('surgitome-tour','1'); /* informacja startowa już potwierdzona */ const w=dom.window;
w.matchMedia=()=>({matches:MOB,addEventListener(){}});
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
w.THREE=T; w.eval(fs.readFileSync(require('path').join(require('path').dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8'));
const errs=[]; w.addEventListener('error',e=>errs.push(e.message||String(e.error)));
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); w.eval(sc[0]); w.eval(sc[1]);
const $=id=>w.document.getElementById(id); const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const vis=()=>!$('variants').hidden, vtxt=()=>[...$('variants').querySelectorAll('.vbtn')].map(b=>b.textContent).join(', ');
const mvar=()=>{ $('mMenuBtn').click(); const h=[...$('mMenuBody').querySelectorAll('h4')].map(x=>x.textContent); $('mMenuClose').click(); return h.includes('Wariant'); };
(async()=>{ await sleep(400);
  console.log('start:',$('pTitle').textContent,'| wiersz wariantów widoczny:',vis(),'('+vtxt()+')','| menu telefonu: sekcja Wariant',mvar());
  // odgwiazdkuj wszystkie ulubione po kolei (zawsze pierwszą gwiazdkę na liście)
  let n=0; while($('tabs').querySelector('.tab .star')){ $('tabs').querySelector('.tab .star').click(); await sleep(80); n++;
    console.log(' po usunięciu',n,': zakładek',$('tabs').querySelectorAll('.tab').length,'| wiersz wariantów:',vis(),'| menu Wariant:',mvar()); }
  console.log('podpowiedź:',($('tabs').querySelector('.favhint')||{}).textContent);
  // ponowne dodanie bieżącego klawiszem F — wiersz wariantów wraca
  w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'f',bubbles:true})); await sleep(80);
  console.log('po F: zakładek',$('tabs').querySelectorAll('.tab').length,'| wiersz wariantów:',vis(),'('+vtxt()+')');
  // inna kategoria — warianty jak zwykle
  [...$('cats').children].find(b=>b.textContent==='Jelito grube').click(); await sleep(500);
  console.log('Jelito grube:',$('pTitle').textContent,'| wiersz wariantów:',vis(),'('+vtxt()+')');
  console.log(errs.length?errs:'errors []'); process.exit(0);
})();
