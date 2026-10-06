// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Piśmiennictwo i stopka: każdy zabieg i wariant ma listę źródeł z odnośnikiem (PubMed, DOI lub online); stopka z oświadczeniem
// o autorstwie i licencjami w PL i EN; okna dialogowe bezpośrednio w <body>; okno „Źródła” obejmuje wszystkie zabiegi i badania, zamyka się klawiszem Escape; „Jak cytować” w stopce otwiera okienko cytowania
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
const orbit=fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8');
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); const errs=[], fails=[], sleep=ms=>new Promise(r=>setTimeout(r,ms));
function ok(c,m){ if(!c) fails.push(m); }
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); const w=dom.window, D=w.document;
Object.defineProperty(w.navigator,'languages',{value:['pl-PL']});
w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1');
w.matchMedia=()=>({matches:false,addEventListener(){}});
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
w.THREE=T; w.eval(orbit); w.addEventListener('error',e=>errs.push(e.message||String(e.error))); w.eval(sc[0]); w.eval(sc[1]);
const refs=()=>[...D.querySelectorAll('#pRefsList li')];
const linked=li=>li.className==='rbook'||[...li.querySelectorAll('a')].some(a=>/^https:\/\//.test(a.href));
(async()=>{
  await sleep(250);
  // 0. okna dialogowe i nakładki są bezpośrednio w <body> (niezamknięty <div> chowa je w innym, ukrytym oknie — jsdom sprawdza tylko atrybut hidden)
  const dlg=['intro','tour','fb','cite','bib','qrOverlay','mMenu'].filter(id=>D.getElementById(id));
  ok(dlg.length>=6&&dlg.every(id=>D.getElementById(id).parentElement===D.body),'okno poza <body>: '+dlg.filter(id=>D.getElementById(id).parentElement!==D.body).map(id=>id+' w #'+(D.getElementById(id).parentElement.closest('[id]')||{}).id).join(', '));
  // 1. każdy zabieg i każdy wariant z głównej nawigacji
  let n=0, minN=99, total=0;
  for(const c of [...D.querySelectorAll('#cats .cat')].filter(b=>!/Ulubione/.test(b.textContent))){
    c.click(); await sleep(30);
    for(let ti=0; ti<D.querySelectorAll('#tabs .tab').length; ti++){
      D.querySelectorAll('#tabs .tab')[ti].click(); await sleep(30);
      const vb=[...D.querySelectorAll('#variants .vbtn')], vn=Math.max(1,vb.length);
      for(let vi=0; vi<vn; vi++){
        if(vb.length){ D.querySelectorAll('#variants .vbtn')[vi].click(); await sleep(30); }
        const st=w.__sgTest.state(), L=refs(), who=c.textContent+' / '+D.getElementById('pTitle').textContent+' #'+vi;
        ok(!D.getElementById('pRefs').hidden && L.length>=2,'za mało piśmiennictwa: '+who+' ('+L.length+')');
        ok(L.every(linked),'pozycja bez odnośnika: '+who);
        ok(L.every(li=>li.querySelector('.rrole')),'pozycja bez roli: '+who);
        ok(D.getElementById('pRefsN').textContent==='('+L.length+')','licznik pozycji: '+who);
        n++; total+=L.length; minN=Math.min(minN,L.length);
      }
    }
  }
  console.log('zabiegów i wariantów:',n,'| pozycji łącznie:',total,'| najmniej w jednym:',minN);
  ok(n>=55,'za mało zabiegów i wariantów: '+n);
  // 2. stopka: oświadczenie o autorstwie, licencja, Źródła, Jak cytować — PL i EN
  const note=D.querySelector('.pfoot .authnote');
  ok(note && /asystenta AI \(Claude, Anthropic\)/.test(note.textContent) && /nie jest wyrobem medycznym/.test(note.textContent),'stopka PL: '+(note&&note.textContent.slice(0,60)));
  ok(/Kod: MIT/.test(D.querySelector('.pfoot .legal').textContent)&&/Treści: CC BY 4\.0/.test(D.querySelector('.pfoot .legal').textContent),'brak licencji w stopce: '+D.querySelector('.pfoot .legal').textContent);
  ok(D.querySelectorAll('#panel .citeBtn').length===1,'„Jak cytować” w panelu powtórzone');
  D.getElementById('btnLang').click(); await sleep(50);
  ok(/AI assistant \(Claude, Anthropic\)/.test(note.textContent) && /not a medical device/.test(note.textContent),'stopka EN: '+note.textContent.slice(0,60));
  ok(D.getElementById('btnSources').textContent==='Sources' && D.querySelector('.legal .citeBtn').textContent==='How to cite' && /Code: MIT/.test(D.querySelector('.legal').textContent),'stopka EN: '+D.querySelector('.legal').textContent);
  ok(D.querySelector('#pRefs summary span').textContent==='References','nagłówek piśmiennictwa EN');
  ok(refs().every(li=>!/[ąęłśżź]/i.test(li.querySelector('.rrole').textContent)),'rola pozycji nieprzetłumaczona');
  // 3. „Jak cytować” (okienko z 12-cytowanie.js) i okno „Źródła”
  D.querySelector('.legal .citeBtn').click(); await sleep(30);
  ok(!D.getElementById('cite').hidden && /Spychalski P\. SURGITOME/.test(D.getElementById('citeRef').textContent),'„Jak cytować” ze stopki nie otwiera okienka cytowania');
  D.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true})); await sleep(30);
  D.getElementById('btnSources').click(); await sleep(30);
  ok(!D.getElementById('bib').hidden,'okno źródeł się nie otwiera');
  const h4=[...D.querySelectorAll('#bibList h4')].map(h=>h.id.replace('bib-',''));
  const A=w.ANAT, want=A.PROCS.filter(p=>!(p.split&&p.published===false)).map(p=>p.id);
  ok(want.every(id=>h4.includes(id)),'w „Źródłach” brak zabiegów: '+want.filter(id=>!h4.includes(id)).join(', '));
  ok(h4.includes('ethos')&&h4.includes('scar'),'w „Źródłach” brak badań ETHOS/SCAR');
  ok([...D.querySelectorAll('#bibList li')].every(linked),'pozycja w „Źródłach” bez odnośnika');
  D.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true})); await sleep(30);
  ok(D.getElementById('bib').hidden,'Escape nie zamyka okna');
  D.getElementById('btnSources').click(); await sleep(30);
  D.getElementById('bib').dispatchEvent(new w.MouseEvent('click',{bubbles:true})); await sleep(30);
  ok(D.getElementById('bib').hidden,'klik w tło nie zamyka okna');
  // 4. dane: każdy klucz piśmiennictwa to istniejący zabieg lub wariant, każda pozycja ma PMID, DOI albo URL
  if(!A.BIB){ fails.push("brak ANAT.BIB"); console.log("errors",JSON.stringify(errs.concat(fails))); process.exit(0); }
  const ids=new Set(['_tools']); A.PROCS.forEach(p=>{ids.add(p.id); p.variants.forEach(v=>ids.add(v.id));});
  ok(Object.keys(A.BIB.P).every(k=>ids.has(k)),'nieznane id w ANAT.BIB.P: '+Object.keys(A.BIB.P).filter(k=>!ids.has(k)).join(', '));
  ok(Object.values(A.BIB.P).every(l=>l.every(x=>A.BIB.R[x[0]])),'odwołanie do nieistniejącej pozycji');
  ok(Object.values(A.BIB.R).every(r=>r.pmid||r.doi||r.url||r.book),'pozycja bez PMID, DOI i URL');
  ok(Object.values(A.BIB.R).every(r=>!r.pmid||/^\d{4,9}$/.test(r.pmid)),'błędny PMID');
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
