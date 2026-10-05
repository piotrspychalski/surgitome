// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
const {JSDOM}=require('jsdom'); const fs=require('fs');
const MOB=process.argv[2]==='mobile', LANG=process.argv[3]||'pl';
const html=fs.readFileSync(require('path').join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
w.matchMedia=(q)=>({matches:MOB&&/max-width: 760px/.test(q),addEventListener(){}});
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
w.THREE=T; w.eval(fs.readFileSync(require('path').join(require('path').dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8'));
const errs=[], warns=[]; w.addEventListener('error',e=>errs.push(e.message||String(e.error)));
const cw=console.warn; console.warn=(...a)=>warns.push(a.join(' ').slice(0,160)); w.console.warn=console.warn; w.console.error=(...a)=>errs.push(a.join(' ').slice(0,160));
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); w.eval(sc[0]); w.eval(sc[1]);
const $=id=>w.document.getElementById(id); const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const PL=/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]|\b(i|oraz|pętla|jelito|żołądek|zespolenie|kikut|odbytnica|przełyk|okrężnica|trzustka|dwunastnica|widok|kadr|z|w|na|do)\b/;
const bad=new Map();
(async()=>{ await sleep(300);
  if(LANG==='en'){ $('btnLang').click(); await sleep(50); }
  let n=0;
  for(const cat of [...$('cats').children]){ cat.click(); await sleep(250);
    for(const tab of [...$('tabs').children]){ tab.click(); await sleep(350);
      const vbs=[...$('variants').querySelectorAll('.vbtn')]; const nv=Math.max(1,vbs.length);
      for(let v=0;v<nv;v++){ if(vbs.length){ $('variants').querySelectorAll('.vbtn')[v].click(); await sleep(300); }
        const st=[...$('strip').querySelectorAll('.step')];
        for(let f=0;f<st.length;f++){ $('strip').querySelectorAll('.step')[f].click(); await sleep(f===5?500:220); n++;
          if(LANG==='en'){ const sel=['#capTitle','#capText','#hudTitle','#hudNote','#labels','#pBody','#tabs','#variants','#strip','#mFrameTxt','#mProcName','#choice','#ctPanel'];
            for(const s of sel){ const el=w.document.querySelector(s); if(!el) continue; const walker=w.document.createTreeWalker(el,4); let t; while((t=walker.nextNode())){ const x=t.textContent.trim(); if(x && PL.test(x)) bad.set(x.slice(0,90),(tab.textContent+'/'+f)); } } }
        } } } }
  console.log((MOB?'telefon':'komputer'),LANG,'| kadrów:',n,'| błędy:',errs.length,[...new Set(errs)].slice(0,4),'| ostrzeżenia:',[...new Set(warns)].slice(0,5));
  if(LANG==='en') console.log('Polskie teksty w EN:',bad.size,[...bad.entries()].slice(0,25));
  process.exit(0); })();
